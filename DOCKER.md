# Docker Deployment Guide

This guide explains how to deploy the Universal Deep Research system using Docker Compose.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher

You can verify your installation by running:

```bash
docker --version
docker compose version
```

## Quick Start

The fastest way to get the system up and running is to use Docker Compose, which will automatically build and start both the backend and frontend services.

### Step 1: Clone the Repository

```bash
git clone https://github.com/sergeevgit1/UniversalDeepResearch.git
cd UniversalDeepResearch
```

### Step 2: Configure API Keys

The backend requires API keys for LLM providers and web search functionality. Create the following files in the `backend` directory:

```bash
# NVIDIA API key (required)
echo "your-nvidia-api-key" > backend/nvdev_api.txt

# Tavily API key (required for web search)
echo "your-tavily-api-key" > backend/tavily_api.txt

# OpenAI API key (optional)
echo "your-openai-api-key" > backend/openai_api.txt
```

**Important**: Make sure these files contain only the API key without any extra spaces or newlines.

### Step 3: Start the Services

Run the following command to build and start both services:

```bash
docker compose up -d
```

This command will:
- Build Docker images for both backend and frontend
- Create and start containers
- Set up networking between services
- Mount necessary volumes for data persistence

### Step 4: Access the Application

Once the services are running, you can access:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Configuration

### Environment Variables

You can customize the deployment by creating a `.env` file in the root directory. Copy the example file:

```bash
cp .env.example .env
```

Then edit the `.env` file to customize settings such as:

- Port numbers
- Log levels
- Model configurations
- Research parameters

### Custom Ports

If you need to use different ports, you can modify the `docker-compose.yml` file or set environment variables:

```bash
# Change frontend port to 8080
FRONTEND_PORT=8080 docker compose up -d
```

## Managing the Services

### View Logs

To view logs from all services:

```bash
docker compose logs -f
```

To view logs from a specific service:

```bash
docker compose logs -f backend
docker compose logs -f frontend
```

### Stop the Services

To stop all services:

```bash
docker compose down
```

To stop and remove all data (volumes):

```bash
docker compose down -v
```

### Restart the Services

To restart all services:

```bash
docker compose restart
```

To restart a specific service:

```bash
docker compose restart backend
```

### Rebuild After Changes

If you make changes to the code, rebuild the images:

```bash
docker compose up -d --build
```

## Data Persistence

The following directories are mounted as volumes to persist data:

- `backend/logs`: Application logs
- `backend/instances`: Research session data
- `backend/mock_instances`: Mock data for testing

These directories will be created automatically if they don't exist.

## Troubleshooting

### Backend Connection Issues

If the frontend cannot connect to the backend, check:

1. Both services are running: `docker compose ps`
2. Backend health check is passing: `docker compose logs backend`
3. CORS configuration allows frontend URL

### API Key Errors

If you see API key errors in the logs:

1. Verify the API key files exist in the `backend` directory
2. Check that the files contain valid keys without extra whitespace
3. Ensure the files are mounted correctly: `docker compose config`

### Port Conflicts

If you get port conflict errors:

1. Check if ports 3000 or 8000 are already in use: `netstat -an | grep LISTEN`
2. Stop conflicting services or change ports in `docker-compose.yml`

### Permission Issues

If you encounter permission errors with volumes:

```bash
# Fix ownership of mounted directories
sudo chown -R $USER:$USER backend/logs backend/instances
```

## Development Mode

For development, you may want to mount the source code as volumes to enable hot reloading. Create a `docker-compose.dev.yml` file:

```yaml
version: '3.8'

services:
  backend:
    volumes:
      - ./backend:/app
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload

  frontend:
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm run dev
```

Then run:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## Production Deployment

For production deployment, consider the following:

1. **Use environment-specific configuration**: Create separate `.env` files for different environments
2. **Enable HTTPS**: Use a reverse proxy like Nginx or Traefik
3. **Set resource limits**: Add resource constraints in `docker-compose.yml`
4. **Use secrets management**: Store API keys in Docker secrets or external secret managers
5. **Enable monitoring**: Add logging and monitoring solutions

## Security Considerations

**Important**: This is a research prototype and should not be used in production without proper security hardening.

- API keys are stored in plain text files (not recommended for production)
- No authentication or authorization is implemented
- CORS is configured for local development
- Containers run with default security settings

For production use, implement proper security measures including:

- Secure secret management
- Authentication and authorization
- HTTPS/TLS encryption
- Network isolation
- Security scanning and updates

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)

## Support

For issues and questions:

- Check the logs: `docker compose logs`
- Review the main [README.md](README.md)
- Create an issue in the repository
