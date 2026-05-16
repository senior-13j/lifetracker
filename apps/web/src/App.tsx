import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  CalendarCheck,
  Check,
  Flame,
  LogOut,
  Plus,
  Radio,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Zap
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

import type { ChallengeDto, DashboardDto, HabitDto, LifeEvent, UserDto } from "@lifetracker/shared";

import {
  completeHabit,
  createHabit,
  getChallenges,
  getDashboard,
  joinChallenge,
  login,
  register
} from "./api";

const REALTIME_URL = import.meta.env.VITE_REALTIME_URL ?? "http://localhost:4003";

type AuthState = {
  user: UserDto;
  token: string;
};

const moodOptions = ["great", "good", "neutral", "tired", "stressed"] as const;
const categoryOptions = ["fitness", "mind", "nutrition", "learning", "sleep", "finance", "creative"] as const;
const colorOptions = ["#12b886", "#3b82f6", "#f97316", "#e11d48", "#8b5cf6", "#14b8a6"];

export function App() {
  const [auth, setAuth] = useState<AuthState | null>(() => {
    const raw = localStorage.getItem("lifetracker.auth");
    return raw ? (JSON.parse(raw) as AuthState) : null;
  });

  function saveAuth(next: AuthState) {
    localStorage.setItem("lifetracker.auth", JSON.stringify(next));
    setAuth(next);
  }

  function logout() {
    localStorage.removeItem("lifetracker.auth");
    setAuth(null);
  }

  return (
    <main className="app-shell">
      {auth ? <Dashboard auth={auth} onLogout={logout} /> : <AuthPanel onAuth={saveAuth} />}
    </main>
  );
}

function AuthPanel({ onAuth }: { onAuth: (auth: AuthState) => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("Alex Morgan");
  const [email, setEmail] = useState("demo@lifetracker.dev");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      mode === "login"
        ? login({ email, password })
        : register({ name, email, password, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }),
    onSuccess: (response) => onAuth(response),
    onError: (err) => setError(err instanceof Error ? err.message : "Authentication failed")
  });

  return (
    <section className="auth-layout">
      <div className="auth-copy">
        <div className="brand-row">
          <span className="brand-mark">
            <Activity size={24} />
          </span>
          <span>LifeTracker</span>
        </div>
        <h1>Build momentum you can actually see.</h1>
        <p>
          Track habits, join live challenges, unlock achievements, and watch your progress
          update across devices in real time.
        </p>
        <div className="preview-panel">
          <div className="preview-header">
            <span>Today</span>
            <strong>82 focus score</strong>
          </div>
          <div className="preview-bars">
            {[48, 76, 58, 92, 68, 86, 100].map((height, index) => (
              <span key={index} style={{ height: `${height}%` }} />
            ))}
          </div>
          <div className="preview-feed">
            <span>
              <Zap size={16} /> 7 day streak unlocked
            </span>
            <span>
              <Radio size={16} /> Live challenge feed connected
            </span>
          </div>
        </div>
      </div>

      <form
        className="auth-card"
        onSubmit={(event) => {
          event.preventDefault();
          setError(null);
          mutation.mutate();
        }}
      >
        <div className="segmented">
          <button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
            Login
          </button>
          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>
        {mode === "register" ? (
          <label>
            Name
            <input value={name} onChange={(event) => setName(event.target.value)} minLength={2} />
          </label>
        ) : null}
        <label>
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
        </label>
        <label>
          Password
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button className="primary-action" disabled={mutation.isPending}>
          {mutation.isPending ? "Connecting..." : mode === "login" ? "Open dashboard" : "Create account"}
        </button>
        <p className="hint">Demo account: demo@lifetracker.dev / demo1234</p>
      </form>
    </section>
  );
}

function Dashboard({ auth, onLogout }: { auth: AuthState; onLogout: () => void }) {
  const queryClient = useQueryClient();
  const [events, setEvents] = useState<LifeEvent[]>([]);
  const [online, setOnline] = useState(0);

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
    <section className="dashboard-layout">
      <aside className="sidebar">
        <div className="brand-row">
          <span className="brand-mark">
            <Activity size={22} />
          </span>
          <span>LifeTracker</span>
        </div>
        <nav>
          <a className="active">
            <CalendarCheck size={18} /> Today
          </a>
          <a>
            <Trophy size={18} /> Challenges
          </a>
          <a>
            <Sparkles size={18} /> Achievements
          </a>
          <a>
            <ShieldCheck size={18} /> Privacy
          </a>
        </nav>
        <button className="ghost-action" onClick={onLogout}>
          <LogOut size={18} /> Logout
        </button>
      </aside>

      <div className="workspace">
        <header className="workspace-header">
          <div>
            <span className="eyebrow">Personal growth cockpit</span>
            <h2>Welcome back, {auth.user.name.split(" ")[0]}</h2>
          </div>
          <div className="live-pill">
            <Radio size={16} /> {online} online
          </div>
        </header>

        {dashboard.isLoading ? <div className="loading">Loading your momentum...</div> : null}
        {dashboard.isError ? <div className="error">Dashboard failed to load.</div> : null}

        {data ? (
          <div className="dashboard-grid">
            <Stats data={data} />
            <HabitCreator token={auth.token} />
            <HabitList token={auth.token} habits={data.habits} />
            <ProgressPanel data={data} />
            <ChallengePanel
              token={auth.token}
              challenges={challenges.data?.challenges ?? []}
              loading={challenges.isLoading}
            />
            <LiveFeed events={events} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Stats({ data }: { data: DashboardDto }) {
  const cards = [
    { label: "Active streak", value: `${data.activeStreak}d`, icon: Flame },
    { label: "Completed today", value: data.completedToday, icon: Check },
    { label: "Weekly rate", value: `${data.weeklyCompletionRate}%`, icon: CalendarCheck },
    { label: "Focus score", value: data.focusScore, icon: Sparkles }
  ];

  return (
    <section className="stats-row">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article className="stat-card" key={card.label}>
            <Icon size={20} />
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        );
      })}
    </section>
  );
}

function HabitCreator({ token }: { token: string }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("Read for 20 minutes");
  const [category, setCategory] = useState<(typeof categoryOptions)[number]>("learning");
  const [color, setColor] = useState(colorOptions[1] ?? "#3b82f6");
  const [targetPerWeek, setTargetPerWeek] = useState(4);

  const mutation = useMutation({
    mutationFn: () => createHabit(token, { name, category, color, targetPerWeek }),
    onSuccess: () => {
      setName("");
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  });

  return (
    <section className="panel habit-create">
      <div className="panel-heading">
        <h3>Create habit</h3>
        <Plus size={18} />
      </div>
      <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Habit name" />
      <div className="chips">
        {categoryOptions.map((option) => (
          <button
            key={option}
            className={category === option ? "chip active" : "chip"}
            onClick={() => setCategory(option)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
      <div className="swatches">
        {colorOptions.map((option) => (
          <button
            key={option}
            aria-label={option}
            className={color === option ? "swatch active" : "swatch"}
            onClick={() => setColor(option)}
            style={{ background: option }}
            type="button"
          />
        ))}
      </div>
      <label className="range-label">
        Target per week: {targetPerWeek}
        <input
          min={1}
          max={7}
          type="range"
          value={targetPerWeek}
          onChange={(event) => setTargetPerWeek(Number(event.target.value))}
        />
      </label>
      <button className="primary-action compact" onClick={() => mutation.mutate()} disabled={!name || mutation.isPending}>
        Add habit
      </button>
    </section>
  );
}

function HabitList({ token, habits }: { token: string; habits: HabitDto[] }) {
  const queryClient = useQueryClient();
  const [mood, setMood] = useState<(typeof moodOptions)[number]>("good");
  const mutation = useMutation({
    mutationFn: (habitId: string) => completeHabit(token, habitId, { mood }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["dashboard"] })
  });

  return (
    <section className="panel habits-panel">
      <div className="panel-heading">
        <h3>Today habits</h3>
        <div className="chips mood">
          {moodOptions.map((option) => (
            <button
              key={option}
              className={mood === option ? "chip active" : "chip"}
              onClick={() => setMood(option)}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="habit-list">
        {habits.map((habit) => (
          <article className="habit-card" key={habit.id}>
            <span className="habit-color" style={{ background: habit.color }} />
            <div>
              <strong>{habit.name}</strong>
              <span>{habit.category} · target {habit.targetPerWeek}/week</span>
            </div>
            <div className="streak-badge">
              <Flame size={16} /> {habit.streak}
            </div>
            <button className="icon-action" onClick={() => mutation.mutate(habit.id)} aria-label={`Complete ${habit.name}`}>
              <Check size={18} />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProgressPanel({ data }: { data: DashboardDto }) {
  const chartData = useMemo(
    () =>
      data.heatmap.map((item) => ({
        date: item.date.slice(5),
        count: item.count
      })),
    [data.heatmap]
  );

  return (
    <section className="panel progress-panel">
      <div className="panel-heading">
        <h3>Weekly rhythm</h3>
        <Activity size={18} />
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="progress" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#12b886" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#12b886" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#d9e2ec" />
          <XAxis dataKey="date" tickLine={false} axisLine={false} />
          <Tooltip />
          <Area type="monotone" dataKey="count" stroke="#0f766e" fillOpacity={1} fill="url(#progress)" />
        </AreaChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={data.categoryBreakdown}>
          <XAxis dataKey="category" tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}

function ChallengePanel({
  token,
  challenges,
  loading
}: {
  token: string;
  challenges: ChallengeDto[];
  loading: boolean;
}) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (challengeId: string) => joinChallenge(token, challengeId),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["challenges"] })
  });

  return (
    <section className="panel challenge-panel">
      <div className="panel-heading">
        <h3>Live challenges</h3>
        <Users size={18} />
      </div>
      {loading ? <p className="hint">Loading challenges...</p> : null}
      {challenges.map((challenge) => (
        <article className="challenge-card" key={challenge.id}>
          <div>
            <strong>{challenge.title}</strong>
            <span>{challenge.description}</span>
          </div>
          <div className="challenge-meta">
            <span>{challenge.participantCount} joined</span>
            <button className="secondary-action" onClick={() => mutation.mutate(challenge.id)}>
              Join
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}

function LiveFeed({ events }: { events: LifeEvent[] }) {
  return (
    <section className="panel live-feed">
      <div className="panel-heading">
        <h3>Realtime feed</h3>
        <Radio size={18} />
      </div>
      {events.length === 0 ? <p className="hint">Complete a habit to stream the first event.</p> : null}
      {events.map((event) => (
        <article className="feed-item" key={event.id}>
          <span className="feed-dot" />
          <div>
            <strong>{event.type.replace(".", " ")}</strong>
            <span>{eventSummary(event)}</span>
          </div>
        </article>
      ))}
    </section>
  );
}

function eventSummary(event: LifeEvent): string {
  if (event.type === "habit.completed") {
    return `${String(event.payload.habitName)} reached streak ${String(event.payload.streak)}`;
  }
  if (event.type === "achievement.unlocked") {
    return `${String(event.payload.title)} unlocked`;
  }
  if (event.type === "challenge.joined") {
    return `Joined ${String(event.payload.title)}`;
  }
  return new Date(event.timestamp).toLocaleTimeString();
}

function prependUniqueEvent(current: LifeEvent[], event: LifeEvent): LifeEvent[] {
  if (current.some((item) => item.id === event.id)) {
    return current;
  }

  return [event, ...current].slice(0, 12);
}
