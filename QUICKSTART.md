# Quick Start with Docker Compose

Get the Universal Deep Research system running in 3 simple steps:

## Prerequisites

- Docker 20.10+ and Docker Compose 2.0+
- Tavily API key (required for web search)
- OpenRouter API key (required for the default free model)

## Steps

### 1. Configure API Keys

API keys are now set as environment variables in the `.env` file.

1. **Create the `.env` file** by copying the example:
```bash
cp .env.example .env
```

2. **Edit the `.env` file** and set your API keys and service URLs. The default model requires `OPENROUTER_API_KEY` and `TAVILY_API_KEY`.

```env
# .env file content (example)
# Service URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000

# API Keys
OPENROUTER_API_KEY=your-openrouter-api-key
TAVILY_API_KEY=your-tavily-api-key
```

### 2. Start the Services

```bash
docker compose up -d
```

This will:
- Build Docker images for backend and frontend
- Start both services
- Set up networking and volumes

### 3. Access the Application

Open your browser and navigate to:

**http://localhost:3000**

The backend API will be available at:

**http://localhost:8000**

## Stopping the Services

```bash
docker compose down
```

## Viewing Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
```

## Troubleshooting

If you encounter issues:

1. Check that both services are running: `docker compose ps`
2. View logs: `docker compose logs`
3. Ensure API key files exist and contain valid keys
4. See [DOCKER.md](DOCKER.md) for detailed troubleshooting

## Next Steps

- Read the full [Docker Deployment Guide](DOCKER.md)
- Check out the [Backend Documentation](backend/README.md)
- Explore the [Frontend Documentation](frontend/README.md)
