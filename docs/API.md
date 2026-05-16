# API

All public HTTP traffic goes through the API gateway at `http://localhost:4000/api`.

## Auth

### `POST /api/auth/register`

```json
{
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "password": "demo1234",
  "timezone": "Europe/Belgrade"
}
```

Returns:

```json
{
  "user": {
    "id": "...",
    "name": "Alex Morgan",
    "email": "alex@example.com",
    "avatarColor": "#12b886",
    "timezone": "Europe/Belgrade"
  },
  "token": "jwt"
}
```

### `POST /api/auth/login`

```json
{
  "email": "demo@lifetracker.dev",
  "password": "demo1234"
}
```

## Dashboard

### `GET /api/dashboard`

Requires `Authorization: Bearer <token>`.

Returns habits, active streak, weekly completion rate, heatmap, and category breakdown.

## Habits

### `POST /api/habits`

```json
{
  "name": "Read for 20 minutes",
  "category": "learning",
  "color": "#3b82f6",
  "targetPerWeek": 4
}
```

### `POST /api/habits/:habitId/checkins`

```json
{
  "mood": "good",
  "note": "Finished one chapter"
}
```

Publishes:

- `habit.completed`
- `streak.updated`

## Challenges

### `GET /api/challenges`

Returns public challenges.

### `POST /api/challenges/join`

```json
{
  "challengeId": "..."
}
```

Publishes `challenge.joined`.

## Realtime

Socket.IO endpoint: `http://localhost:4003`

Client auth:

```ts
io("http://localhost:4003", {
  auth: { token }
});
```

Events:

- `life:recent`
- `life:event`
- `life:public-event`
- `presence:update`
