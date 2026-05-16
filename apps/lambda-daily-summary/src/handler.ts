import { lifeEventSchema, type LifeEvent } from "@lifetracker/shared";

export interface KafkaLambdaRecord {
  topic: string;
  partition: number;
  offset: number;
  timestamp: number;
  value: string;
}

export interface KafkaLambdaEvent {
  eventSource: "SelfManagedKafka" | "aws:kafka";
  records: Record<string, KafkaLambdaRecord[]>;
}

export interface SummaryResult {
  processed: number;
  habitCompletions: number;
  achievements: number;
  users: string[];
}

export async function handler(event: KafkaLambdaEvent): Promise<SummaryResult> {
  const events = decodeKafkaEvents(event);
  const habitCompletions = events.filter((item) => item.type === "habit.completed").length;
  const achievements = events.filter((item) => item.type === "achievement.unlocked").length;
  const users = [...new Set(events.map((item) => item.actorId))];

  return {
    processed: events.length,
    habitCompletions,
    achievements,
    users
  };
}

export function decodeKafkaEvents(event: KafkaLambdaEvent): LifeEvent[] {
  return Object.values(event.records)
    .flat()
    .map((record) => Buffer.from(record.value, "base64").toString("utf8"))
    .map((raw) => lifeEventSchema.parse(JSON.parse(raw)));
}
