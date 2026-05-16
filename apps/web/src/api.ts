import type {
  ChallengeDto,
  CompleteHabitInput,
  CreateHabitInput,
  DashboardDto,
  HabitDto,
  LoginInput,
  RegisterInput,
  UserDto
} from "@lifetracker/shared";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export interface AuthResponse {
  user: UserDto;
  token: string;
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/login", { method: "POST", body: input });
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/register", { method: "POST", body: input });
}

export async function getDashboard(token: string): Promise<DashboardDto> {
  return request<DashboardDto>("/dashboard", { token });
}

export async function createHabit(token: string, input: CreateHabitInput): Promise<{ habit: HabitDto }> {
  return request<{ habit: HabitDto }>("/habits", { method: "POST", token, body: input });
}

export async function completeHabit(
  token: string,
  habitId: string,
  input: CompleteHabitInput
): Promise<{ habit: HabitDto; checkInId: string }> {
  return request<{ habit: HabitDto; checkInId: string }>(`/habits/${habitId}/checkins`, {
    method: "POST",
    token,
    body: input
  });
}

export async function getChallenges(token: string): Promise<{ challenges: ChallengeDto[] }> {
  return request<{ challenges: ChallengeDto[] }>("/challenges", { token });
}

export async function joinChallenge(
  token: string,
  challengeId: string
): Promise<{ challenge: ChallengeDto }> {
  return request<{ challenge: ChallengeDto }>("/challenges/join", {
    method: "POST",
    token,
    body: { challengeId }
  });
}

async function request<T>(
  path: string,
  options: { method?: string; token?: string; body?: unknown } = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(payload?.message ?? `Request failed with ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
