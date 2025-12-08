# Quick Start with Docker Compose

Get the Universal Deep Research system running in 3 simple steps:

## Prerequisites

- Docker 20.10+ and Docker Compose 2.0+
- Tavily API key (required for web search)
- OpenRouter API key (required for the default free model)

## Steps

### 1. Configure API Keys

The default model is a free model from OpenRouter, so you only need the Tavily and OpenRouter API keys to get started.

Create the required API key files in the `backend` directory:

```bash
# Required: Tavily for web search
echo "your-tavily-api-key" > backend/tavily_api.txt

# Required: OpenRouter for the default free model
echo "your-openrouter-api-key" > backend/openrouter_api.txt

# Optional: Other LLM providers
# echo "your-nvidia-api-key" > backend/nvdev_api.txt
# echo "your-openai-api-key" > backend/openai_api.txt
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
