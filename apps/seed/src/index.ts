import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import {
  ChallengeModel,
  HabitModel,
  UserModel,
  connectDatabase
} from "@lifetracker/database";

const mongoUri = process.env.MONGO_URI ?? "mongodb://localhost:27017/lifetracker";

async function seed(): Promise<void> {
  await connectDatabase(mongoUri);

  const passwordHash = await bcrypt.hash("demo1234", 12);
  const user = await UserModel.findOneAndUpdate(
    { email: "demo@lifetracker.dev" },
    {
      name: "Alex Morgan",
      email: "demo@lifetracker.dev",
      passwordHash,
      avatarColor: "#12b886",
      timezone: "Europe/Belgrade"
    },
    { upsert: true, new: true }
  );

  const habits = [
    {
      name: "Morning movement",
      category: "fitness",
      color: "#12b886",
      targetPerWeek: 5,
      streak: 8,
      bestStreak: 14,
      reminderHour: 8
    },
    {
      name: "Deep work block",
      category: "learning",
      color: "#3b82f6",
      targetPerWeek: 4,
      streak: 5,
      bestStreak: 9,
      reminderHour: 10
    },
    {
      name: "Evening shutdown",
      category: "sleep",
      color: "#f59e0b",
      targetPerWeek: 6,
      streak: 3,
      bestStreak: 11,
      reminderHour: 22
    }
  ];

  for (const habit of habits) {
    await HabitModel.findOneAndUpdate(
      { userId: user._id, name: habit.name },
      {
        ...habit,
        userId: user._id,
        lastCompletedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        isArchived: false
      },
      { upsert: true }
    );
  }

  const now = new Date();
  const challengeEnds = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const challengeStarts = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

  const challenges = [
    {
      slug: "seven-day-reset",
      title: "7 Day Reset",
      description: "Complete one mindful action every day and keep the room feed alive.",
      category: "mind"
    },
    {
      slug: "learning-sprint",
      title: "Learning Sprint",
      description: "Four focused sessions per week with live progress and streak rewards.",
      category: "learning"
    },
    {
      slug: "sleep-anchor",
      title: "Sleep Anchor",
      description: "Build a consistent evening routine and watch your weekly rhythm improve.",
      category: "sleep"
    }
  ];

  for (const challenge of challenges) {
    await ChallengeModel.findOneAndUpdate(
      { slug: challenge.slug },
      {
        ...challenge,
        startsAt: challengeStarts,
        endsAt: challengeEnds,
        participantIds: []
      },
      { upsert: true }
    );
  }

  console.log("Seed complete. Demo user: demo@lifetracker.dev / demo1234");
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
