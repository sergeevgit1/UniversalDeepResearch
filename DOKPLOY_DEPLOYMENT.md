# Dokploy Deployment Guide for Universal Deep Research

This guide provides comprehensive instructions for deploying Universal Deep Research (UDR) using Dokploy and Docker. It covers the entire deployment process, configuration, and troubleshooting.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Dokploy Setup](#dokploy-setup)
3. [Application Configuration](#application-configuration)
4. [Deployment Process](#deployment-process)
5. [Environment Variables](#environment-variables)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Monitoring and Maintenance](#monitoring-and-maintenance)
8. [Common Issues and Solutions](#common-issues-and-solutions)

## Prerequisites

Before deploying UDR with Dokploy, ensure you have:

- A server with Docker and Docker Compose installed
- Dokploy instance running on your server
- Domain names configured for your application (recommended)
- SSL certificates (can be managed by Dokploy)
- API keys for required services:
  - Tavily API key (required for web search)
  - At least one LLM provider API key (OpenRouter, NVIDIA, or OpenAI)

## Dokploy Setup

### 1. Create a New Project

1. Log in to your Dokploy dashboard
2. Create a new project named `universal-deep-research`
3. Configure your project settings as needed

### 2. Prepare Your Repository

Ensure your repository is accessible to Dokploy:

```bash
# If using a private repository, add Dokploy's SSH key
# Or use a personal access token for HTTPS cloning
```

### 3. Create Applications

You'll need to create two applications in Dokploy:

1. **Backend Application** (`udr-backend`)
2. **Frontend Application** (`udr-frontend`)

## Application Configuration

### Backend Application (udr-backend)

1. **Basic Settings**:
   - Name: `udr-backend`
   - Source: Git Repository
   - Repository URL: Your repository URL
   - Branch: `main` (or your default branch)
   - Build Path: `./backend`
   - Dockerfile Path: `./Dockerfile`

2. **Port Configuration**:
   - Internal Port: `8000`
   - External Port: Leave as default (Dokploy will assign)

3. **Environment Variables**:
   Create a new environment file with the following variables:

   ```bash
   # Server Configuration
   HOST=0.0.0.0
   PORT=8000
   LOG_LEVEL=info
   RELOAD=false

   # API Keys (REQUIRED)
   TAVILY_API_KEY=your_tavily_api_key_here
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   NVDEV_API_KEY=your_nvidia_api_key_here  # Optional
   OPENAI_API_KEY=your_openai_api_key_here  # Optional

   # LLM Configuration
   DEFAULT_MODEL=openrouter/openai/gpt-oss-120b-free
   LLM_BASE_URL=https://openrouter.ai/api/v1
   LLM_TEMPERATURE=0.2
   LLM_TOP_P=0.7
   LLM_MAX_TOKENS=2048

   # CORS Configuration
   FRONTEND_URL=https://your-frontend-domain.com
   ALLOW_CREDENTIALS=true

   # Research Configuration
   MAX_TOPICS=1
   MAX_SEARCH_PHRASES=1
   MAX_SEARCH_RESULTS=10
   MOCK_DIRECTORY=mock_instances/stocks_24th_3_sections
   RANDOM_SEED=42

   # Logging Configuration
   LOG_DIR=logs
   TRACE_ENABLED=true
   COPY_INTO_STDOUT=false

   # FrameV4 Configuration
   LONG_CONTEXT_CUTOFF=8192
   FORCE_LONG_CONTEXT=false
   MAX_ITERATIONS=1024
   INTERACTION_LEVEL=none
   ```

4. **Health Check**:
   - Path: `/`
   - Interval: 30 seconds
   - Timeout: 10 seconds
   - Retries: 3
   - Start Period: 60 seconds

5. **Storage** (Optional):
   - Add persistent volumes for:
     - `/app/logs` (for application logs)
     - `/app/instances` (for research instances)
     - `/app/mock_instances` (for mock data)

### Frontend Application (udr-frontend)

1. **Basic Settings**:
   - Name: `udr-frontend`
   - Source: Git Repository
   - Repository URL: Your repository URL
   - Branch: `main` (or your default branch)
   - Build Path: `./frontend`
   - Dockerfile Path: `./Dockerfile`

2. **Port Configuration**:
   - Internal Port: `3000`
   - External Port: Leave as default (Dokploy will assign)

3. **Environment Variables**:

   ```bash
   # Frontend Configuration
   NODE_ENV=production
   NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.com
   NEXT_PUBLIC_API_VERSION=v2
   NEXT_PUBLIC_DRY_RUN=false
   NEXT_PUBLIC_ENABLE_V2_API=true
   NEXT_PUBLIC_FRONTEND_URL=https://your-frontend-domain.com
   ```

4. **Health Check**:
   - Path: `/`
   - Interval: 30 seconds
   - Timeout: 10 seconds
   - Retries: 3
   - Start Period: 30 seconds

## Deployment Process

### 1. Deploy the Backend

1. Navigate to the `udr-backend` application in Dokploy
2. Click "Deploy" to start the deployment process
3. Monitor the deployment logs for any errors
4. Wait for the health check to pass

### 2. Deploy the Frontend

1. Navigate to the `udr-frontend` application in Dokploy
2. Click "Deploy" to start the deployment process
3. Monitor the deployment logs for any errors
4. Wait for the health check to pass

### 3. Configure Domain and SSL

1. Add your domain names to each application:
   - Backend: `api.your-domain.com`
   - Frontend: `your-domain.com` or `app.your-domain.com`
2. Enable SSL certificates through Dokploy
3. Verify SSL certificate generation

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `TAVILY_API_KEY` | API key for web search functionality | `tvly-xxxxxxxxxxxxxxxx` |
| `OPENROUTER_API_KEY` | API key for OpenRouter LLM provider | `sk-or-v1-xxxxxxxxxxxxxxxx` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NVDEV_API_KEY` | API key for NVIDIA models | - |
| `OPENAI_API_KEY` | API key for OpenAI models | - |
| `DEFAULT_MODEL` | Default LLM model to use | `openrouter/openai/gpt-oss-120b-free` |
| `FRONTEND_URL` | URL of the frontend application | `http://localhost:3000` |
| `LOG_LEVEL` | Logging level | `info` |
| `MAX_SEARCH_RESULTS` | Maximum search results per query | `10` |

### Frontend Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_BACKEND_URL` | URL of the backend API | `https://api.your-domain.com` |
| `NEXT_PUBLIC_API_VERSION` | API version to use | `v2` |
| `NEXT_PUBLIC_FRONTEND_URL` | URL of the frontend application | `https://your-domain.com` |

## Post-Deployment Verification

### 1. Backend Health Check

```bash
curl -f https://api.your-domain.com/
```

Expected response: Status 200 with basic health information

### 2. Frontend Health Check

```bash
curl -I https://your-domain.com/
```

Expected response: Status 200 with HTML content

### 3. API Functionality Test

1. Open your frontend application in a browser
2. Try submitting a research query
3. Verify that the research process starts and completes
4. Check that results are displayed correctly

## Monitoring and Maintenance

### 1. Log Monitoring

Regularly check application logs:

1. In Dokploy dashboard, navigate to each application
2. Click on "Logs" to view real-time logs
3. Set up log aggregation if needed

### 2. Health Monitoring

1. Monitor health check status in Dokploy
2. Set up external monitoring (e.g., UptimeRobot)
3. Configure alerts for downtime

### 3. Backup Strategy

1. Regularly backup application data:
   - Database (if used)
   - User-generated content
   - Configuration files

2. Document your backup and restore process

### 4. Updates and Maintenance

1. Regularly update dependencies:
   - Monitor security advisories
   - Test updates in staging first
   - Plan for downtime during updates

## Common Issues and Solutions

### 1. Backend Container Fails to Start

**Symptoms**: Health check fails, container restarts repeatedly

**Possible Causes**:
- Missing or incorrect API keys
- Port conflicts
- Resource constraints

**Solutions**:
1. Check environment variables are correctly set
2. Verify API keys are valid and have sufficient quota
3. Check resource allocation in Dokploy
4. Review container logs for specific error messages

### 2. Frontend Cannot Connect to Backend

**Symptoms**: Frontend shows connection errors, API calls fail

**Possible Causes**:
- Incorrect `NEXT_PUBLIC_BACKEND_URL`
- CORS configuration issues
- Network connectivity problems

**Solutions**:
1. Verify `NEXT_PUBLIC_BACKEND_URL` is correct
2. Check `FRONTEND_URL` in backend environment variables
3. Ensure CORS origins are properly configured
4. Test backend API directly

### 3. Slow Performance

**Symptoms**: Long response times, timeouts

**Possible Causes**:
- Insufficient resources
- High load on LLM APIs
- Network latency

**Solutions**:
1. Increase resource allocation in Dokploy
2. Optimize LLM model selection
3. Implement caching strategies
4. Consider CDN for static assets

### 4. SSL Certificate Issues

**Symptoms**: Browser warnings, insecure connections

**Possible Causes**:
- DNS configuration issues
- Certificate generation failures
- Domain verification problems

**Solutions**:
1. Verify DNS records point to correct IP
2. Check Dokploy SSL certificate status
3. Manually regenerate certificates if needed
4. Ensure domain is properly configured

## Security Considerations

1. **API Key Management**:
   - Store API keys securely in Dokploy
   - Regularly rotate API keys
   - Monitor API usage for unusual activity

2. **Network Security**:
   - Use HTTPS for all connections
   - Implement firewall rules
   - Consider VPN access for administration

3. **Application Security**:
   - Regularly update dependencies
   - Monitor security advisories
   - Implement rate limiting

## Scaling Considerations

1. **Horizontal Scaling**:
   - Deploy multiple backend instances
   - Implement load balancing
   - Consider database scaling

2. **Resource Optimization**:
   - Monitor resource usage
   - Optimize container resource limits
   - Consider auto-scaling based on load

## Conclusion

This guide provides a comprehensive approach to deploying Universal Deep Research using Dokploy. Regular monitoring and maintenance are essential for ensuring reliable operation of your deployment.

For additional support or questions, refer to the project's main documentation or create an issue in the repository.