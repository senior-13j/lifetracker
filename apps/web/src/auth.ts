import type { UserDto } from "@lifetracker/shared";

export type AuthState = {
  user: UserDto;
  token: string;
};
