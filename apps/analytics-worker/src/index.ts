import mongoose from "mongoose";

import {
  createKafka,
  createLifeEvent,
  createRedis,
  ensureKafkaTopics,
  env,
  logger,
  publishLifeEvent
} from "@lifetracker/backend-common";
import { AchievementModel, EventLogModel, connectDatabase } from "@lifetracker/database";
import { lifeEventSchema, topicNames } from "@lifetracker/shared";

const redis = createRedis();
const kafka = createKafka("analytics-worker");
const consumer = kafka.consumer({ groupId: "lifetracker-analytics" });
const producer = kafka.producer();

async function handleEvent(raw: string): Promise<void> {
  const event = lifeEventSchema.parse(JSON.parse(raw));
  await EventLogModel.updateOne(
    { eventId: event.id },
    {
      eventId: event.id,
      type: event.type,
      actorId: event.actorId,
      payload: event.payload,
      timestamp: new Date(event.timestamp)
    },
    { upsert: true }
  );

  await redis.del(`dashboard:${event.actorId}`);

  if (event.type === "habit.completed") {
    const streak = Number(event.payload.streak ?? 0);
    await redis.zadd("leaderboard:streaks", streak, event.actorId);

    const unlocks = [
      { at: 3, code: "spark", title: "Spark", icon: "Zap" },
      { at: 7, code: "week-builder", title: "Week Builder", icon: "CalendarCheck" },
      { at: 14, code: "momentum", title: "Momentum", icon: "Flame" }
    ];

    const hit = unlocks.find((unlock) => unlock.at === streak);
    if (hit) {
      const result = await AchievementModel.updateOne(
        { userId: event.actorId, code: hit.code },
        {
          userId: event.actorId,
          code: hit.code,
          title: hit.title,
          description: `Reached a ${streak} day habit streak.`,
          icon: hit.icon,
          unlockedAt: new Date()
        },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        await publishLifeEvent(
          producer,
          createLifeEvent({
            type: "achievement.unlocked",
            actorId: event.actorId,
            payload: { code: hit.code, title: hit.title, streak }
          })
        );
      }
    }
  }
}

async function bootstrap(): Promise<void> {
  await connectDatabase(env("MONGO_URI", "mongodb://localhost:27017/lifetracker"));
  await ensureKafkaTopics(kafka);
  await producer.connect();
  await consumer.connect();
  await consumer.subscribe({ topic: topicNames.lifeEvents, fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ message }) => {
      if (message.value) {
        await handleEvent(message.value.toString());
      }
    }
  });

  logger.info("analytics-worker running");

  const shutdown = async (): Promise<void> => {
    await consumer.disconnect();
    await producer.disconnect();
    await redis.quit();
    await mongoose.disconnect();
  };

  process.on("SIGTERM", () => void shutdown());
  process.on("SIGINT", () => void shutdown());
}

bootstrap().catch((error) => {
  logger.error({ error }, "analytics-worker failed");
  process.exit(1);
});
