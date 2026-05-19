# User Guide

lifetracker helps you track habits, keep a daily rhythm, join live challenges,
and understand progress from one dashboard.

## Getting Started

Open the app:

```text
http://localhost:3000
```

Use the demo account:

```text
demo@lifetracker.dev / demo1234
```

You can also create a new account from the registration tab. The app stores your
session in the browser, so the dashboard reopens automatically until you log
out.

## Language And Theme

lifetracker supports:

- English
- Russian
- Spanish
- German
- French
- Serbian

The app detects your browser language on first visit. You can change it from the
display preferences control. Your choice is saved for the next visit.

The theme control switches between light and dark mode. It is also saved in the
browser.

## Dashboard

The dashboard is the main workspace after login. It shows:

- active streak;
- completed habits today;
- weekly completion rate;
- focus score;
- habit creation form;
- today's habit list;
- weekly progress charts;
- live challenges;
- realtime activity feed.

On desktop, navigation lives in the side menu. On mobile, the layout stacks so
controls and content do not overlap.

## Creating A Habit

1. Enter a habit name.
2. Choose a category.
3. Pick a color.
4. Set the weekly target.
5. Press `Add habit`.

The new habit appears in the today's habits list and becomes part of the weekly
progress calculation.

## Completing A Habit

1. Choose a mood for the completion.
2. Press the check button on the habit.
3. The dashboard refreshes your streak and progress.
4. The realtime feed receives a habit completion event.

If something fails, the app shows a friendly message in the selected language.

## Challenges

Challenges are shared public goals. You can join a challenge from the dashboard.
Joining a challenge creates a realtime event and updates the participant count.

Current example challenge types:

- seven-day reset;
- learning sprint;
- sleep routine.

## Realtime Feed

The feed shows recent activity such as:

- account registration;
- habit creation;
- habit completion;
- streak update;
- achievement unlock;
- challenge join;
- reminder scheduling.

If realtime connection is unavailable, saved dashboard data still works. The app
shows a warning instead of failing silently.

## Errors And Recovery

| Situation                | What to do                                                            |
| ------------------------ | --------------------------------------------------------------------- |
| Login fails              | Check email and password, then try again.                             |
| Network error            | Check the connection and retry.                                       |
| Dashboard does not load  | Refresh the page.                                                     |
| Habit creation fails     | Check the habit name and retry.                                       |
| Realtime warning appears | Continue using the dashboard; realtime will reconnect when available. |

## Privacy Note

This local showcase stores demo data in the local MongoDB volume. For production,
operators should configure real secrets, managed storage, HTTPS, and retention
rules before accepting real users.
