import { z } from "zod";

export const habitCategories = [
  "fitness",
  "mind",
  "nutrition",
  "learning",
  "sleep",
  "finance",
  "creative"
] as const;

export const moodValues = ["great", "good", "neutral", "tired", "stressed"] as const;

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8).max(128),
  timezone: z.string().default("UTC")
});

export const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1)
});

export const createHabitSchema = z.object({
  name: z.string().trim().min(2).max(80),
  category: z.enum(habitCategories),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  targetPerWeek: z.number().int().min(1).max(7),
  reminderHour: z.number().int().min(0).max(23).optional()
});

export const completeHabitSchema = z.object({
  mood: z.enum(moodValues).default("good"),
  note: z.string().trim().max(240).optional(),
  completedAt: z.string().datetime().optional()
});

export const joinChallengeSchema = z.object({
  challengeId: z.string().min(1)
});

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatarColor: z.string(),
  timezone: z.string()
});

export const habitSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  category: z.enum(habitCategories),
  color: z.string(),
  targetPerWeek: z.number(),
  streak: z.number(),
  bestStreak: z.number(),
  lastCompletedAt: z.string().nullable(),
  reminderHour: z.number().nullable()
});

export const challengeSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.enum(habitCategories),
  startsAt: z.string(),
  endsAt: z.string(),
  participantCount: z.number()
});

export const dashboardSchema = z.object({
  habits: z.array(habitSchema),
  activeStreak: z.number(),
  completedToday: z.number(),
  weeklyCompletionRate: z.number(),
  focusScore: z.number(),
  heatmap: z.array(
    z.object({
      date: z.string(),
      count: z.number()
    })
  ),
  categoryBreakdown: z.array(
    z.object({
      category: z.enum(habitCategories),
      count: z.number()
    })
  )
});

export const lifeEventSchema = z.object({
  id: z.string(),
  type: z.enum([
    "user.registered",
    "habit.created",
    "habit.completed",
    "streak.updated",
    "challenge.joined",
    "achievement.unlocked",
    "reminder.scheduled"
  ]),
  actorId: z.string(),
  timestamp: z.string().datetime(),
  payload: z.record(z.unknown())
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateHabitInput = z.infer<typeof createHabitSchema>;
export type CompleteHabitInput = z.infer<typeof completeHabitSchema>;
export type UserDto = z.infer<typeof userSchema>;
export type HabitDto = z.infer<typeof habitSchema>;
export type ChallengeDto = z.infer<typeof challengeSchema>;
export type DashboardDto = z.infer<typeof dashboardSchema>;
export type LifeEvent = z.infer<typeof lifeEventSchema>;

export const topicNames = {
  lifeEvents: "life.events"
} as const;
