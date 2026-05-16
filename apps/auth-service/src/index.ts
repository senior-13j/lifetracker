import bcrypt from "bcryptjs";
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
  signAccessToken,
  validateBody,
  type AuthedRequest
} from "@lifetracker/backend-common";
import { UserModel, connectDatabase, objectIdToString } from "@lifetracker/database";
import { loginSchema, registerSchema } from "@lifetracker/shared";

const app = express();
const port = Number(env("AUTH_SERVICE_PORT", "4001"));
const redis = createRedis();
const kafka = createKafka("auth-service");
const producer = kafka.producer();

app.use(helmet());
app.use(cors({ origin: env("WEB_ORIGIN", "http://localhost:3000"), credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "auth-service", timestamp: new Date().toISOString() });
});

app.post("/auth/register", validateBody(registerSchema), async (req, res, next) => {
  try {
    const existing = await UserModel.exists({ email: req.body.email });
    if (existing) {
      res.status(409).json({ message: "Email already registered" });
      return;
    }

    const passwordHash = await bcrypt.hash(req.body.password, 12);
    const avatarColor = pickAvatarColor(req.body.email);
    const user = await UserModel.create({
      name: req.body.name,
      email: req.body.email,
      passwordHash,
      avatarColor,
      timezone: req.body.timezone
    });

    const dto = {
      id: objectIdToString(user._id),
      email: user.email,
      name: user.name,
      avatarColor: user.avatarColor,
      timezone: user.timezone
    };
    const token = signAccessToken({ id: dto.id, email: dto.email, name: dto.name });

    await redis.set(`session:${dto.id}`, "active", "EX", 7 * 24 * 60 * 60);
    await publishLifeEvent(
      producer,
      createLifeEvent({
        type: "user.registered",
        actorId: dto.id,
        payload: { userId: dto.id, name: dto.name }
      })
    );

    res.status(201).json({ user: dto, token });
  } catch (error) {
    next(error);
  }
});

app.post("/auth/login", validateBody(loginSchema), async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isValid = await bcrypt.compare(req.body.password, user.passwordHash);
    if (!isValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const dto = {
      id: objectIdToString(user._id),
      email: user.email,
      name: user.name,
      avatarColor: user.avatarColor,
      timezone: user.timezone
    };

    await redis.set(`session:${dto.id}`, "active", "EX", 7 * 24 * 60 * 60);
    res.json({ user: dto, token: signAccessToken({ id: dto.id, email: dto.email, name: dto.name }) });
  } catch (error) {
    next(error);
  }
});

app.get("/auth/me", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const user = await UserModel.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({
      user: {
        id: objectIdToString(user._id),
        email: user.email,
        name: user.name,
        avatarColor: user.avatarColor,
        timezone: user.timezone
      }
    });
  } catch (error) {
    next(error);
  }
});

app.post("/auth/logout", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    if (req.user?.id) {
      await redis.del(`session:${req.user.id}`);
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

function pickAvatarColor(seed: string): string {
  const colors = ["#12b886", "#3b82f6", "#f97316", "#e11d48", "#8b5cf6", "#14b8a6"];
  const sum = [...seed].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[sum % colors.length] ?? "#12b886";
}

async function bootstrap(): Promise<void> {
  await connectDatabase(env("MONGO_URI", "mongodb://localhost:27017/lifetracker"));
  await ensureKafkaTopics(kafka);
  await producer.connect();

  const server = app.listen(port, () => {
    console.log(`auth-service listening on ${port}`);
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
