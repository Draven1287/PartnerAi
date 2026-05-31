# Learning AI Coolify Backend

This folder is the backend app for Coolify.

Coolify settings:

```text
Source: GitHub
Repository: Draven1287/PartnerAi
Branch: main
Base directory: coolify-backend
Build type: Docker Compose
Compose file: docker-compose.yml
Service: learning-ai-minutes
Port: 8787
Health path: /health
```

Environment variable:

```text
ADMIN_TOKEN=replace-with-a-long-random-secret
```

After deploy:

```text
https://your-backend-domain/health
https://your-backend-domain/admin?token=YOUR_ADMIN_TOKEN
```

The public website should only use the backend URL, never the admin token.
