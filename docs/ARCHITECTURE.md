# Architecture

LifeTracker is split into small services so the portfolio shows architecture rather
than a single Express server with many routes.

## Services

| Service | Responsibility |
| --- | --- |
| `web` | Consumer React application with dashboard, habits, charts, challenges, live feed. |
| `api-gateway` | Public HTTP entry point. It proxies `/api/auth`, `/api/habits`, `/api/dashboard`, and `/api/challenges`. |
| `auth-service` | Registration, login, JWT issuing, Redis-backed session marker, `user.registered` event. |
| `habit-service` | Habit CRUD, check-ins, dashboard projection, challenge join flow, Redis cache, Kafka events. |
| `realtime-service` | Authenticated Socket.IO connections, Redis presence, Kafka consumer fanout. |
| `analytics-worker` | Kafka consumer that stores event logs, invalidates cache, updates leaderboards, unlocks achievements. |
| `lambda-daily-summary` | AWS Lambda handler that consumes Kafka event-source batches. |

## Data Ownership

MongoDB stores the durable application state:

- users
- habits
- check-ins
- challenges
- event logs
- achievements

Redis stores hot and ephemeral state:

- active session marker
- cached dashboard snapshots
- online presence
- streak leaderboard

Kafka carries domain events:

- `user.registered`
- `habit.created`
- `habit.completed`
- `streak.updated`
- `challenge.joined`
- `achievement.unlocked`
- `reminder.scheduled`

## Event Flow

1. User completes a habit in the React app.
2. The request goes through the API gateway to `habit-service`.
3. `habit-service` writes the check-in to MongoDB.
4. `habit-service` invalidates Redis dashboard cache and publishes `habit.completed`.
5. `analytics-worker` consumes the event, stores it in `event_logs`, updates Redis leaderboard, and unlocks achievements when thresholds are hit.
6. `realtime-service` consumes the event and broadcasts it to the user's socket room.
7. The UI updates its live feed and refreshes dashboard data.

## Why This Fits MERN

It is still MERN at the core:

- MongoDB is the database.
- Express powers every HTTP service.
- React is the frontend.
- Node.js runs the services, worker, and Lambda code.

The additional infrastructure demonstrates modern backend maturity without hiding the MERN stack.
