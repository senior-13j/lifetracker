import cors from "cors";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";

import {
  createKafka,
  createLifeEvent,
  createRedis,
  env,
  errorHandler,
  ensureKafkaTopics,
  publishLifeEvent,
  requireAuth,
  toIso,
  validateBody,
  type AuthedRequest
} from "@lifetracker/backend-common";
import {
  ChallengeModel,
  CheckInModel,
  HabitModel,
  connectDatabase,
  objectIdToString
} from "@lifetracker/database";
import { completeHabitSchema, createHabitSchema, joinChallengeSchema } from "@lifetracker/shared";

import { nextStreak } from "./streak.js";

const app = express();
const port = Number(env("HABIT_SERVICE_PORT", "4002"));
const redis = createRedis();
const kafka = createKafka("habit-service");
const producer = kafka.producer();

app.use(helmet());
app.use(cors({ origin: env("WEB_ORIGIN", "http://localhost:3000"), credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "habit-service", timestamp: new Date().toISOString() });
});

app.get("/habits", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const habits = await HabitModel.find({ userId: req.user?.id, isArchived: false }).sort({
      createdAt: 1
    });
    res.json({ habits: habits.map(toHabitDto) });
  } catch (error) {
    next(error);
  }
});

app.post("/habits", requireAuth, validateBody(createHabitSchema), async (req: AuthedRequest, res, next) => {
  try {
    const habit = await HabitModel.create({
      userId: req.user?.id,
      name: req.body.name,
      category: req.body.category,
      color: req.body.color,
      targetPerWeek: req.body.targetPerWeek,
      reminderHour: req.body.reminderHour ?? null
    });

    const event = createLifeEvent({
      type: "habit.created",
      actorId: req.user?.id ?? "",
      payload: { habitId: objectIdToString(habit._id), name: habit.name, category: habit.category }
    });

    await redis.del(`dashboard:${req.user?.id}`);
    await publishLifeEvent(producer, event);
    res.status(201).json({ habit: toHabitDto(habit) });
  } catch (error) {
    next(error);
  }
});

app.post(
  "/habits/:habitId/checkins",
  requireAuth,
  validateBody(completeHabitSchema),
  async (req: AuthedRequest, res, next) => {
    try {
      const habit = await HabitModel.findOne({ _id: req.params.habitId, userId: req.user?.id });
      if (!habit) {
        res.status(404).json({ message: "Habit not found" });
        return;
      }

      const completedAt = req.body.completedAt ? new Date(req.body.completedAt) : new Date();
      const streak = nextStreak(habit.lastCompletedAt ?? null, completedAt, habit.streak);
      habit.streak = streak;
      habit.bestStreak = Math.max(habit.bestStreak, streak);
      habit.lastCompletedAt = completedAt;
      await habit.save();

      const checkIn = await CheckInModel.create({
        userId: req.user?.id,
        habitId: habit._id,
        mood: req.body.mood,
        note: req.body.note ?? "",
        completedAt
      });

      await redis.del(`dashboard:${req.user?.id}`);
      await redis.zadd("leaderboard:streaks", streak, req.user?.id ?? "");

      await publishLifeEvent(
        producer,
        createLifeEvent({
          type: "habit.completed",
          actorId: req.user?.id ?? "",
          payload: {
            habitId: objectIdToString(habit._id),
            habitName: habit.name,
            checkInId: objectIdToString(checkIn._id),
            streak,
            mood: req.body.mood
          }
        })
      );

      await publishLifeEvent(
        producer,
        createLifeEvent({
          type: "streak.updated",
          actorId: req.user?.id ?? "",
          payload: { habitId: objectIdToString(habit._id), streak }
        })
      );

      res.status(201).json({ habit: toHabitDto(habit), checkInId: objectIdToString(checkIn._id) });
    } catch (error) {
      next(error);
    }
  }
);

app.get("/dashboard", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const key = `dashboard:${req.user?.id}`;
    const cached = await redis.get(key);
    if (cached) {
      res.json(JSON.parse(cached));
      return;
    }

    const dashboard = await buildDashboard(req.user?.id ?? "");
    await redis.set(key, JSON.stringify(dashboard), "EX", 45);
    res.json(dashboard);
  } catch (error) {
    next(error);
  }
});

app.get("/challenges", requireAuth, async (_req: AuthedRequest, res, next) => {
  try {
    const challenges = await ChallengeModel.find().sort({ startsAt: -1 });
    res.json({ challenges: challenges.map(toChallengeDto) });
  } catch (error) {
    next(error);
  }
});

app.post(
  "/challenges/join",
  requireAuth,
  validateBody(joinChallengeSchema),
  async (req: AuthedRequest, res, next) => {
    try {
      const challenge = await ChallengeModel.findByIdAndUpdate(
        req.body.challengeId,
        { $addToSet: { participantIds: req.user?.id } },
        { new: true }
      );

      if (!challenge) {
        res.status(404).json({ message: "Challenge not found" });
        return;
      }

      await publishLifeEvent(
        producer,
        createLifeEvent({
          type: "challenge.joined",
          actorId: req.user?.id ?? "",
          payload: { challengeId: objectIdToString(challenge._id), title: challenge.title }
        })
      );

      res.json({ challenge: toChallengeDto(challenge) });
    } catch (error) {
      next(error);
    }
  }
);

app.use(errorHandler);

async function buildDashboard(userId: string) {
  const habits = await HabitModel.find({ userId, isArchived: false }).sort({ createdAt: 1 });
  const sevenDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
  sevenDaysAgo.setUTCHours(0, 0, 0, 0);

  const checkIns = await CheckInModel.find({
    userId,
    completedAt: { $gte: sevenDaysAgo }
  }).sort({ completedAt: 1 });

  const today = new Date();
  const completedToday = checkIns.filter((checkIn) => sameDay(checkIn.completedAt, today)).length;
  const activeStreak = habits.reduce((max, habit) => Math.max(max, habit.streak), 0);
  const weeklyTarget = habits.reduce((total, habit) => total + habit.targetPerWeek, 0);
  const weeklyCompletionRate = weeklyTarget > 0 ? Math.min(100, Math.round((checkIns.length / weeklyTarget) * 100)) : 0;
  const focusScore = Math.min(100, Math.round(activeStreak * 8 + weeklyCompletionRate * 0.55));

  const heatmap = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(sevenDaysAgo);
    date.setUTCDate(sevenDaysAgo.getUTCDate() + index);
    return {
      date: date.toISOString().slice(0, 10),
      count: checkIns.filter((checkIn) => sameDay(checkIn.completedAt, date)).length
    };
  });

  const categoryBreakdown = habits.reduce<Array<{ category: string; count: number }>>((acc, habit) => {
    const existing = acc.find((item) => item.category === habit.category);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ category: habit.category, count: 1 });
    }
    return acc;
  }, []);

  return {
    habits: habits.map(toHabitDto),
    activeStreak,
    completedToday,
    weeklyCompletionRate,
    focusScore,
    heatmap,
    categoryBreakdown
  };
}

function toHabitDto(habit: {
  _id: unknown;
  userId: unknown;
  name: string;
  category: string;
  color: string;
  targetPerWeek: number;
  streak: number;
  bestStreak: number;
  lastCompletedAt?: Date | null;
  reminderHour?: number | null;
}) {
  return {
    id: objectIdToString(habit._id),
    userId: objectIdToString(habit.userId),
    name: habit.name,
    category: habit.category,
    color: habit.color,
    targetPerWeek: habit.targetPerWeek,
    streak: habit.streak,
    bestStreak: habit.bestStreak,
    lastCompletedAt: toIso(habit.lastCompletedAt),
    reminderHour: habit.reminderHour ?? null
  };
}

function toChallengeDto(challenge: {
  _id: unknown;
  slug: string;
  title: string;
  description: string;
  category: string;
  startsAt: Date;
  endsAt: Date;
  participantIds?: unknown[];
}) {
  return {
    id: objectIdToString(challenge._id),
    slug: challenge.slug,
    title: challenge.title,
    description: challenge.description,
    category: challenge.category,
    startsAt: challenge.startsAt.toISOString(),
    endsAt: challenge.endsAt.toISOString(),
    participantCount: challenge.participantIds?.length ?? 0
  };
}

function sameDay(left: Date, right: Date): boolean {
  return left.toISOString().slice(0, 10) === right.toISOString().slice(0, 10);
}

async function bootstrap(): Promise<void> {
  await connectDatabase(env("MONGO_URI", "mongodb://localhost:27017/lifetracker"));
  await ensureKafkaTopics(kafka);
  await producer.connect();

  const server = app.listen(port, () => {
    console.log(`habit-service listening on ${port}`);
  });

  const shutdown = async (): Promise<void> => {
    server.close();
    await producer.disconnect();
    await redis.quit();
    await mongoose.disconnect();
  };

  process.on("SIGTERM", () => void shutdown());
  process.on("SIGINT", () => void shutdown());
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
