# lifetracker Documentation

This folder contains the canonical repository documentation for lifetracker.

Use the root [README](../README.md) for the project overview and quick start.
Use the guides below when you need a deeper, audience-specific view.

## Guides

| Guide                                         | Audience           | Purpose                                                 |
| --------------------------------------------- | ------------------ | ------------------------------------------------------- |
| [User Guide](USER_GUIDE.md)                   | Product users      | Features, dashboard workflow, languages, themes, errors |
| [Admin Guide](ADMIN_GUIDE.md)                 | Operators/admins   | Services, runtime health, data, volumes, incidents      |
| [Developer Guide](DEVELOPER_GUIDE.md)         | Engineers          | Repo structure, package boundaries, quality gates       |
| [Performance And SEO](PERFORMANCE_AND_SEO.md) | Frontend/devops    | Metadata, sitemap, web vitals, caching, accessibility   |
| [Architecture](ARCHITECTURE.md)               | Engineers          | Services, data ownership, event flow                    |
| [API](API.md)                                 | Engineers          | API gateway routes and realtime events                  |
| [Docker](DOCKER.md)                           | Engineers/devops   | Images, containers, volumes, naming contract            |
| [Deployment](DEPLOYMENT.md)                   | Devops             | Production shape, secrets, Lambda, SEO checklist        |
| [Testing](TESTING.md)                         | Engineers/QA       | Automated gates, manual QA, browser checks              |
| [Frontend Quality](FRONTEND_QUALITY.md)       | Frontend engineers | Accessibility, i18n, theme, bundle rules                |

## Public Site Docs

Human-readable Markdown copies are shipped with the web app from:

```text
apps/web/public/docs
```

After the web image is built, open:

```text
http://localhost:3000/docs/README.md
```

Keep repo docs and public docs aligned whenever user-facing features, runtime
names, deployment behavior, or SEO behavior changes.
