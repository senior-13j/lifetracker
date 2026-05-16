# Testing

The project includes focused automated tests where regressions are most likely:

- shared Zod contracts
- JWT and domain event helpers
- habit streak calculation
- Lambda Kafka payload decoding
- database helper behavior

Run:

```bash
npm run check
```

That command runs:

1. `eslint .`
2. `npm run typecheck --workspaces --if-present`
3. `npm run test --workspaces --if-present`

Docker-level checks:

```bash
docker compose config
docker compose build
docker compose run --rm --profile tools seed
docker compose up -d
```

Manual QA path:

1. Open `http://localhost:3000`.
2. Log in with `demo@lifetracker.dev / demo1234`.
3. Complete a habit.
4. Confirm the streak changes.
5. Confirm the live feed receives `habit.completed`.
6. Join a challenge and confirm `challenge.joined` appears.
7. Check browser console for errors.
