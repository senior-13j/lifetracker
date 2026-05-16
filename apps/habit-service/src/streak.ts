export function isSameUtcDay(left: Date, right: Date): boolean {
  return (
    left.getUTCFullYear() === right.getUTCFullYear() &&
    left.getUTCMonth() === right.getUTCMonth() &&
    left.getUTCDate() === right.getUTCDate()
  );
}

export function isYesterdayUtc(previous: Date, current: Date): boolean {
  const previousDay = Date.UTC(
    previous.getUTCFullYear(),
    previous.getUTCMonth(),
    previous.getUTCDate()
  );
  const currentDay = Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), current.getUTCDate());
  return currentDay - previousDay === 24 * 60 * 60 * 1000;
}

export function nextStreak(previousCompletedAt: Date | null, current: Date, currentStreak: number): number {
  if (!previousCompletedAt) {
    return 1;
  }

  if (isSameUtcDay(previousCompletedAt, current)) {
    return currentStreak;
  }

  if (isYesterdayUtc(previousCompletedAt, current)) {
    return currentStreak + 1;
  }

  return 1;
}
