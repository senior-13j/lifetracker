import http from "node:http";

import cors from "cors";
import express from "express";
import helmet from "helmet";
import { Server } from "socket.io";

import {
  createKafka,
  createRedis,
  ensureKafkaTopics,
  env,
  logger,
  verifyToken
} from "@lifetracker/backend-common";
import { lifeEventSchema, topicNames, type LifeEvent } from "@lifetracker/shared";

const app = express();
const port = Number(env("REALTIME_SERVICE_PORT", "4003"));
const redis = createRedis();
const kafka = createKafka("realtime-service");
const consumer = kafka.consumer({ groupId: "lifetracker-realtime" });
const recentEvents: LifeEvent[] = [];

app.use(helmet());
app.use(cors({ origin: env("WEB_ORIGIN", "http://localhost:3000"), credentials: true }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "realtime-service", timestamp: new Date().toISOString() });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: env("WEB_ORIGIN", "http://localhost:3000"),
    credentials: true
  }
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (typeof token !== "string") {
      throw new Error("Missing token");
    }
    socket.data.user = verifyToken(token);
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", async (socket) => {
  const user = socket.data.user as { id: string; name: string };
  await socket.join(`user:${user.id}`);
  await redis.hset("presence:online", user.id, JSON.stringify({ name: user.name, at: Date.now() }));
  await redis.expire("presence:online", 120);
  socket.emit("life:recent", recentEvents.slice(-10));
  io.emit("presence:update", await onlineCount());

  socket.on("disconnect", async () => {
    await redis.hdel("presence:online", user.id);
    io.emit("presence:update", await onlineCount());
  });
});

async function onlineCount(): Promise<{ online: number }> {
  return { online: await redis.hlen("presence:online") };
}

async function startKafkaConsumer(): Promise<void> {
  await ensureKafkaTopics(kafka);
  await consumer.connect();
  await consumer.subscribe({ topic: topicNames.lifeEvents, fromBeginning: false });
  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) {
        return;
      }

      const parsed = lifeEventSchema.parse(JSON.parse(message.value.toString()));
      recentEvents.push(parsed);
      if (recentEvents.length > 50) {
        recentEvents.shift();
      }

      io.to(`user:${parsed.actorId}`).emit("life:event", parsed);

      if (parsed.type === "challenge.joined" || parsed.type === "achievement.unlocked") {
        io.emit("life:public-event", parsed);
      }
    }
  });
}

async function bootstrap(): Promise<void> {
  await startKafkaConsumer();
  server.listen(port, () => {
    console.log(`realtime-service listening on ${port}`);
  });

  const shutdown = async (): Promise<void> => {
    server.close();
    await consumer.disconnect();
    await redis.quit();
  };

  process.on("SIGTERM", () => void shutdown());
  process.on("SIGINT", () => void shutdown());
}

bootstrap().catch((error) => {
  logger.error({ error }, "realtime-service failed to start");
  process.exit(1);
});
