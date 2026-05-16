import mongoose, { type HydratedDocument, type InferSchemaType, type Model } from "mongoose";

const { Schema, model, models } = mongoose;

const timestamps = { timestamps: true, versionKey: false as const };

export async function connectDatabase(uri: string): Promise<typeof mongoose> {
  mongoose.set("strictQuery", true);

  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  return mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10_000
  });
}

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    avatarColor: { type: String, required: true },
    timezone: { type: String, required: true, default: "UTC" }
  },
  timestamps
);

const habitSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true, ref: "User" },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, index: true },
    color: { type: String, required: true },
    targetPerWeek: { type: Number, required: true, min: 1, max: 7 },
    streak: { type: Number, required: true, default: 0 },
    bestStreak: { type: Number, required: true, default: 0 },
    lastCompletedAt: { type: Date, default: null },
    reminderHour: { type: Number, default: null },
    isArchived: { type: Boolean, required: true, default: false }
  },
  timestamps
);

const checkInSchema = new Schema(
  {
    habitId: { type: Schema.Types.ObjectId, required: true, index: true, ref: "Habit" },
    userId: { type: Schema.Types.ObjectId, required: true, index: true, ref: "User" },
    mood: { type: String, required: true },
    note: { type: String, default: "" },
    completedAt: { type: Date, required: true, index: true }
  },
  timestamps
);

checkInSchema.index({ userId: 1, habitId: 1, completedAt: -1 });

const challengeSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    participantIds: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  timestamps
);

const eventLogSchema = new Schema(
  {
    eventId: { type: String, required: true, unique: true, index: true },
    type: { type: String, required: true, index: true },
    actorId: { type: String, required: true, index: true },
    payload: { type: Schema.Types.Mixed, required: true },
    timestamp: { type: Date, required: true, index: true }
  },
  timestamps
);

const achievementSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true, ref: "User" },
    code: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    unlockedAt: { type: Date, required: true }
  },
  timestamps
);

achievementSchema.index({ userId: 1, code: 1 }, { unique: true });

type User = InferSchemaType<typeof userSchema>;
type Habit = InferSchemaType<typeof habitSchema>;
type CheckIn = InferSchemaType<typeof checkInSchema>;
type Challenge = InferSchemaType<typeof challengeSchema>;
type EventLog = InferSchemaType<typeof eventLogSchema>;
type Achievement = InferSchemaType<typeof achievementSchema>;

export const UserModel = (models.User as Model<User> | undefined) ?? model<User>("User", userSchema);
export const HabitModel =
  (models.Habit as Model<Habit> | undefined) ?? model<Habit>("Habit", habitSchema);
export const CheckInModel =
  (models.CheckIn as Model<CheckIn> | undefined) ?? model<CheckIn>("CheckIn", checkInSchema);
export const ChallengeModel =
  (models.Challenge as Model<Challenge> | undefined) ?? model<Challenge>("Challenge", challengeSchema);
export const EventLogModel =
  (models.EventLog as Model<EventLog> | undefined) ?? model<EventLog>("EventLog", eventLogSchema);
export const AchievementModel =
  (models.Achievement as Model<Achievement> | undefined) ??
  model<Achievement>("Achievement", achievementSchema);

export type UserDocument = HydratedDocument<User>;
export type HabitDocument = HydratedDocument<Habit>;
export type ChallengeDocument = HydratedDocument<Challenge>;

export function objectIdToString(value: unknown): string {
  return String(value);
}
