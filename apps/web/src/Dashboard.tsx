import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  CalendarCheck,
  Check,
  Flame,
  LogOut,
  Plus,
  Radio,
  Sparkles,
  Trophy,
  Users
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis
} from "recharts";

import type { ChallengeDto, DashboardDto, HabitDto, LifeEvent } from "@lifetracker/shared";
import { Badge, Brand, Button, Card, StatCard, Swatch, TextInput } from "@lifetracker/ui";

import type { AuthState } from "./auth";
import { completeHabit, createHabit, getChallenges, getDashboard, joinChallenge } from "./api";
import {
  categoryLabel,
  challengeCopy,
  friendlyErrorMessage,
  languageOptions,
  localeCode,
  moodLabel,
  translate,
  type Language,
  type TranslationKey
} from "./i18n";

const REALTIME_URL = import.meta.env.VITE_REALTIME_URL ?? "http://localhost:4003";

const moodOptions = ["great", "good", "neutral", "tired", "stressed"] as const;
const categoryOptions = [
  "fitness",
  "mind",
  "nutrition",
  "learning",
  "sleep",
  "finance",
  "creative"
] as const;
const colorOptions = ["#12b886", "#3b82f6", "#f97316", "#e11d48", "#8b5cf6", "#14b8a6"];

export function Dashboard({
  auth,
  language,
  onLogout,
  preferences
}: {
  auth: AuthState;
  language: Language;
  onLogout: () => void;
  preferences: ReactNode;
}) {
  const t = translateFor(language);
  const queryClient = useQueryClient();
  const [events, setEvents] = useState<LifeEvent[]>([]);
  const [online, setOnline] = useState(0);
  const [realtimeIssue, setRealtimeIssue] = useState(false);

  const dashboard = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => getDashboard(auth.token)
  });

  const challenges = useQuery({
    queryKey: ["challenges"],
    queryFn: () => getChallenges(auth.token)
  });

  useEffect(() => {
    const socket = io(REALTIME_URL, {
      auth: { token: auth.token },
      transports: ["websocket", "polling"]
    });

    socket.on("life:recent", (items: LifeEvent[]) => setEvents(items));
    socket.on("connect", () => setRealtimeIssue(false));
    socket.on("connect_error", () => setRealtimeIssue(true));
    socket.on("disconnect", (reason) => {
      if (reason !== "io client disconnect") {
        setRealtimeIssue(true);
      }
    });
    socket.on("life:event", (event: LifeEvent) => {
      setEvents((current) => prependUniqueEvent(current, event));
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    });
    socket.on("life:public-event", (event: LifeEvent) => {
      setEvents((current) => prependUniqueEvent(current, event));
    });
    socket.on("presence:update", (payload: { online: number }) => setOnline(payload.online));

    return () => {
      socket.disconnect();
    };
  }, [auth.token, queryClient]);

  const data = dashboard.data;

  return (
    <section className="dashboard-layout" aria-labelledby="dashboard-title">
      <aside className="sidebar" aria-label={t("nav.label")}>
        <Brand
          className="brand-row"
          mark={<Activity size={22} aria-hidden="true" />}
          name="lifetracker"
        />
        <div className="sidebar-preferences">{preferences}</div>
        <nav aria-label={t("nav.sections")}>
          <a className="active" href="#today" aria-current="page">
            <CalendarCheck size={18} aria-hidden="true" /> {t("nav.today")}
          </a>
          <a href="#challenges">
            <Trophy size={18} aria-hidden="true" /> {t("nav.challenges")}
          </a>
          <a href="#progress">
            <Sparkles size={18} aria-hidden="true" /> {t("nav.progress")}
          </a>
          <a href="#realtime">
            <Radio size={18} aria-hidden="true" /> {t("nav.liveFeed")}
          </a>
        </nav>
        <Button className="ghost-action" onClick={onLogout} variant="ghost">
          <LogOut size={18} aria-hidden="true" /> {t("nav.logout")}
        </Button>
      </aside>

      <div className="workspace">
        <header className="workspace-header">
          <div>
            <span className="eyebrow">{t("dashboard.eyebrow")}</span>
            <h2 id="dashboard-title">
              {t("dashboard.welcome", { name: auth.user.name.split(" ")[0] ?? auth.user.name })}
            </h2>
          </div>
          <Badge className="live-pill" tone="success" icon={<Radio size={16} aria-hidden="true" />}>
            {t("dashboard.online", { count: online })}
          </Badge>
        </header>

        {dashboard.isLoading ? (
          <div className="loading" role="status" aria-live="polite">
            {t("dashboard.loading")}
          </div>
        ) : null}
        {dashboard.isError ? (
          <div className="error" role="alert">
            {friendlyErrorMessage(language, dashboard.error, "errors.dashboard")}
          </div>
        ) : null}
        {realtimeIssue ? (
          <div className="warning" role="status">
            {t("dashboard.realtimeError")}
          </div>
        ) : null}

        {data ? (
          <div className="dashboard-grid">
            <Stats data={data} language={language} />
            <HabitCreator token={auth.token} language={language} />
            <HabitList token={auth.token} habits={data.habits} language={language} />
            <ProgressPanel data={data} language={language} />
            <ChallengePanel
              token={auth.token}
              challenges={challenges.data?.challenges ?? []}
              language={language}
              loading={challenges.isLoading}
            />
            <LiveFeed events={events} language={language} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Stats({ data, language }: { data: DashboardDto; language: Language }) {
  const t = translateFor(language);
  const cards = [
    { label: t("stats.activeStreak"), value: `${data.activeStreak}d`, icon: Flame },
    { label: t("stats.completedToday"), value: data.completedToday, icon: Check },
    { label: t("stats.weeklyRate"), value: `${data.weeklyCompletionRate}%`, icon: CalendarCheck },
    { label: t("stats.focusScore"), value: data.focusScore, icon: Sparkles }
  ];

  return (
    <section className="stats-row" aria-label={t("stats.label")}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <StatCard
            className="stat-card"
            icon={<Icon size={20} aria-hidden="true" />}
            key={card.label}
            label={card.label}
            value={card.value}
          />
        );
      })}
    </section>
  );
}

function HabitCreator({ token, language }: { token: string; language: Language }) {
  const t = translateFor(language);
  const queryClient = useQueryClient();
  const [name, setName] = useState(() => translate(language, "habit.defaultName"));
  const [category, setCategory] = useState<(typeof categoryOptions)[number]>("learning");
  const [color, setColor] = useState(colorOptions[1] ?? "#3b82f6");
  const [targetPerWeek, setTargetPerWeek] = useState(4);

  useEffect(() => {
    const defaultHabitNames = languageOptions.map((option) =>
      translate(option.value, "habit.defaultName")
    );

    setName((current) =>
      defaultHabitNames.includes(current) ? translate(language, "habit.defaultName") : current
    );
  }, [language]);

  const mutation = useMutation({
    mutationFn: () => createHabit(token, { name, category, color, targetPerWeek }),
    onSuccess: () => {
      setName("");
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  });

  return (
    <Card className="panel habit-create" aria-labelledby="create-habit-title">
      <div className="panel-heading">
        <h3 id="create-habit-title">{t("habit.createTitle")}</h3>
        <Plus size={18} aria-hidden="true" />
      </div>
      <TextInput
        aria-label={t("habit.name")}
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder={t("habit.name")}
      />
      <div className="chips" aria-label={t("habit.category")} role="group">
        {categoryOptions.map((option) => (
          <button
            key={option}
            aria-pressed={category === option}
            className={category === option ? "chip active" : "chip"}
            onClick={() => setCategory(option)}
            type="button"
          >
            {categoryLabel(language, option)}
          </button>
        ))}
      </div>
      <div className="swatches" aria-label={t("habit.color")} role="group">
        {colorOptions.map((option) => (
          <Swatch
            active={color === option}
            aria-label={t("habit.colorChoice", { color: option })}
            color={option}
            key={option}
            onClick={() => setColor(option)}
          />
        ))}
      </div>
      <label className="range-label" htmlFor="habit-target">
        {t("habit.target", { count: targetPerWeek })}
        <input
          id="habit-target"
          min={1}
          max={7}
          type="range"
          value={targetPerWeek}
          onChange={(event) => setTargetPerWeek(Number(event.target.value))}
        />
      </label>
      <Button
        className="primary-action compact"
        onClick={() => mutation.mutate()}
        disabled={!name || mutation.isPending}
      >
        {t("habit.add")}
      </Button>
      {mutation.isError ? (
        <p className="error" role="alert">
          {friendlyErrorMessage(language, mutation.error, "errors.createHabit")}
        </p>
      ) : null}
    </Card>
  );
}

function HabitList({
  token,
  habits,
  language
}: {
  token: string;
  habits: HabitDto[];
  language: Language;
}) {
  const t = translateFor(language);
  const queryClient = useQueryClient();
  const [mood, setMood] = useState<(typeof moodOptions)[number]>("good");
  const mutation = useMutation({
    mutationFn: (habitId: string) => completeHabit(token, habitId, { mood }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["dashboard"] })
  });

  return (
    <Card className="panel habits-panel" id="today" aria-labelledby="today-habits-title">
      <div className="panel-heading">
        <h3 id="today-habits-title">{t("habits.title")}</h3>
        <div className="chips mood" aria-label={t("habits.mood")} role="group">
          {moodOptions.map((option) => (
            <button
              key={option}
              aria-pressed={mood === option}
              className={mood === option ? "chip active" : "chip"}
              onClick={() => setMood(option)}
              type="button"
            >
              {moodLabel(language, option)}
            </button>
          ))}
        </div>
      </div>
      {mutation.isError ? (
        <p className="error" role="alert">
          {friendlyErrorMessage(language, mutation.error, "errors.completeHabit")}
        </p>
      ) : null}
      <div className="habit-list">
        {habits.map((habit) => (
          <article className="habit-card" key={habit.id}>
            <span className="habit-color" style={{ background: habit.color }} aria-hidden="true" />
            <div>
              <strong>{habit.name}</strong>
              <span>
                {t("habit.meta", {
                  category: categoryLabel(language, habit.category),
                  target: habit.targetPerWeek
                })}
              </span>
            </div>
            <Badge
              className="streak-badge"
              tone="success"
              icon={<Flame size={16} aria-hidden="true" />}
            >
              {habit.streak}
            </Badge>
            <Button
              className="icon-action"
              onClick={() => mutation.mutate(habit.id)}
              aria-label={t("habit.complete", { name: habit.name })}
              variant="icon"
            >
              <Check size={18} aria-hidden="true" />
            </Button>
          </article>
        ))}
      </div>
    </Card>
  );
}

function ProgressPanel({ data, language }: { data: DashboardDto; language: Language }) {
  const t = translateFor(language);
  const chartData = useMemo(
    () =>
      data.heatmap.map((item) => ({
        date: item.date.slice(5),
        count: item.count
      })),
    [data.heatmap]
  );
  const categoryData = useMemo(
    () =>
      data.categoryBreakdown.map((item) => ({
        ...item,
        label: categoryLabel(language, item.category)
      })),
    [data.categoryBreakdown, language]
  );
  const weeklySummary = chartData.map((item) => `${item.date}: ${item.count}`).join(", ");
  const categorySummary = categoryData.map((item) => `${item.label}: ${item.count}`).join(", ");

  return (
    <Card className="panel progress-panel" id="progress" aria-labelledby="progress-title">
      <div className="panel-heading">
        <h3 id="progress-title">{t("progress.title")}</h3>
        <Activity size={18} aria-hidden="true" />
      </div>
      <div
        className="chart-region"
        role="img"
        aria-label={t("progress.byDate", { summary: weeklySummary })}
      >
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="progress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#12b886" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#12b886" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--app-chart-grid)" />
            <XAxis dataKey="date" tickLine={false} axisLine={false} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#0f766e"
              fillOpacity={1}
              fill="url(#progress)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div
        className="chart-region"
        role="img"
        aria-label={t("progress.byCategory", { summary: categorySummary })}
      >
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={categoryData}>
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function ChallengePanel({
  token,
  challenges,
  language,
  loading
}: {
  token: string;
  challenges: ChallengeDto[];
  language: Language;
  loading: boolean;
}) {
  const t = translateFor(language);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (challengeId: string) => joinChallenge(token, challengeId),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["challenges"] })
  });

  return (
    <Card className="panel challenge-panel" id="challenges" aria-labelledby="challenges-title">
      <div className="panel-heading">
        <h3 id="challenges-title">{t("challenges.title")}</h3>
        <Users size={18} aria-hidden="true" />
      </div>
      {loading ? (
        <p className="hint" role="status" aria-live="polite">
          {t("challenges.loading")}
        </p>
      ) : null}
      {mutation.isError ? (
        <p className="error" role="alert">
          {friendlyErrorMessage(language, mutation.error, "errors.joinChallenge")}
        </p>
      ) : null}
      {challenges.map((challenge) => {
        const copy = challengeCopy(language, challenge.title, challenge.description);

        return (
          <article className="challenge-card" key={challenge.id}>
            <div>
              <strong>{copy.title}</strong>
              <span>{copy.description}</span>
            </div>
            <div className="challenge-meta">
              <span>{t("challenges.joined", { count: challenge.participantCount })}</span>
              <Button
                className="secondary-action"
                onClick={() => mutation.mutate(challenge.id)}
                size="sm"
                variant="secondary"
              >
                {t("challenges.join")}
              </Button>
            </div>
          </article>
        );
      })}
    </Card>
  );
}

function LiveFeed({ events, language }: { events: LifeEvent[]; language: Language }) {
  const t = translateFor(language);

  return (
    <Card
      className="panel live-feed"
      id="realtime"
      aria-labelledby="realtime-title"
      aria-live="polite"
    >
      <div className="panel-heading">
        <h3 id="realtime-title">{t("feed.title")}</h3>
        <Radio size={18} aria-hidden="true" />
      </div>
      {events.length === 0 ? <p className="hint">{t("feed.empty")}</p> : null}
      {events.map((event) => (
        <article className="feed-item" key={event.id}>
          <span className="feed-dot" aria-hidden="true" />
          <div>
            <strong>{eventTypeLabel(event, language)}</strong>
            <span>{eventSummary(event, language)}</span>
          </div>
        </article>
      ))}
    </Card>
  );
}

function eventTypeLabel(event: LifeEvent, language: Language): string {
  const t = translateFor(language);

  switch (event.type) {
    case "user.registered":
      return t("event.type.userRegistered");
    case "habit.created":
      return t("event.type.habitCreated");
    case "habit.completed":
      return t("event.type.habitCompleted");
    case "streak.updated":
      return t("event.type.streakUpdated");
    case "achievement.unlocked":
      return t("event.type.achievementUnlocked");
    case "challenge.joined":
      return t("event.type.challengeJoined");
    case "reminder.scheduled":
      return t("event.type.reminderScheduled");
    default:
      return formatEventType(event.type);
  }
}

function eventSummary(event: LifeEvent, language: Language): string {
  const t = translateFor(language);

  switch (event.type) {
    case "user.registered":
      return t("event.userRegistered", { name: payloadText(event.payload.name) });
    case "habit.created":
      return t("event.habitCreated", { name: payloadText(event.payload.name) });
    case "habit.completed":
      return t("event.habitCompleted", {
        habitName: payloadText(event.payload.habitName),
        streak: payloadText(event.payload.streak, "0")
      });
    case "streak.updated":
      return t("event.streakUpdated", { streak: payloadText(event.payload.streak, "0") });
    case "achievement.unlocked":
      return t("event.achievementUnlocked", { title: payloadText(event.payload.title) });
    case "challenge.joined":
      return t("event.challengeJoined", { title: payloadText(event.payload.title) });
    case "reminder.scheduled":
      return t("event.reminderScheduled");
    default:
      return new Date(event.timestamp).toLocaleTimeString(localeCode(language));
  }
}

function payloadText(value: unknown, fallback = ""): string {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return fallback;
}

function formatEventType(type: string): string {
  return type.replace(".", " ");
}

function prependUniqueEvent(current: LifeEvent[], event: LifeEvent): LifeEvent[] {
  if (current.some((item) => item.id === event.id)) {
    return current;
  }

  return [event, ...current].slice(0, 12);
}

function translateFor(language: Language) {
  return (key: TranslationKey, values?: Record<string, string | number>) =>
    translate(language, key, values);
}
