import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Redis } from "ioredis";
import { Kafka, type Producer } from "kafkajs";
import { nanoid } from "nanoid";
import pino from "pino";
import { ZodError, type ZodSchema } from "zod";

import { lifeEventSchema, topicNames, type LifeEvent } from "@lifetracker/shared";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info"
});

export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
  }
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthedRequest extends Request {
  user?: AuthUser;
}

export function env(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing environment variable ${name}`);
  }
  return value;
}

export function createRedis(url = env("REDIS_URL", "redis://localhost:6379")): Redis {
  return new Redis(url, {
    maxRetriesPerRequest: 3,
    lazyConnect: false
  });
}

export function createKafka(clientId: string): Kafka {
  const brokers = env("KAFKA_BROKERS", "localhost:9092")
    .split(",")
    .map((broker) => broker.trim())
    .filter(Boolean);

  return new Kafka({
    clientId,
    brokers,
    retry: {
      retries: 8
    }
  });
}

export async function ensureKafkaTopics(
  kafka: Kafka,
  topics: string[] = [topicNames.lifeEvents]
): Promise<void> {
  const admin = kafka.admin();
  await admin.connect();
  try {
    await admin.createTopics({
      waitForLeaders: true,
      topics: topics.map((topic) => ({
        topic,
        numPartitions: 1,
        replicationFactor: 1
      }))
    });
  } finally {
    await admin.disconnect();
  }
}

export function signAccessToken(user: AuthUser): string {
  return jwt.sign(user, env("JWT_SECRET", "dev-secret-change-me"), {
    expiresIn: env("JWT_EXPIRES_IN", "7d") as jwt.SignOptions["expiresIn"],
    issuer: "lifetracker"
  });
}

export function verifyToken(token: string): AuthUser {
  const decoded = jwt.verify(token, env("JWT_SECRET", "dev-secret-change-me"), {
    issuer: "lifetracker"
  });

  if (typeof decoded !== "object" || !decoded.id || !decoded.email || !decoded.name) {
    throw new HttpError(401, "Invalid token payload");
  }

  return {
    id: String(decoded.id),
    email: String(decoded.email),
    name: String(decoded.name)
  };
}

export function requireAuth(req: AuthedRequest, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined;

  if (!token) {
    next(new HttpError(401, "Missing bearer token"));
    return;
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch (error) {
    next(error instanceof HttpError ? error : new HttpError(401, "Invalid bearer token"));
  }
}

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      issues: error.flatten()
    });
    return;
  }

  if (error instanceof HttpError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  logger.error({ error }, "Unhandled request error");
  res.status(500).json({ message: "Internal server error" });
}

export function createLifeEvent(
  input: Omit<LifeEvent, "id" | "timestamp"> & Partial<Pick<LifeEvent, "id" | "timestamp">>
): LifeEvent {
  return lifeEventSchema.parse({
    id: input.id ?? `evt_${nanoid(12)}`,
    timestamp: input.timestamp ?? new Date().toISOString(),
    type: input.type,
    actorId: input.actorId,
    payload: input.payload
  });
}

export async function publishLifeEvent(producer: Producer, event: LifeEvent): Promise<void> {
  await producer.send({
    topic: topicNames.lifeEvents,
    messages: [
      {
        key: event.actorId,
        value: JSON.stringify(event)
      }
    ]
  });
}

export function toIso(value: Date | string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}
