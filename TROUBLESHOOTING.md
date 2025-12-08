# Troubleshooting Guide for Universal Deep Research Deployment

This guide provides comprehensive troubleshooting steps for common issues that may occur during deployment and operation of Universal Deep Research (UDR).

## Table of Contents

1. [Initial Diagnosis Steps](#initial-diagnosis-steps)
2. [Docker Compose Issues](#docker-compose-issues)
3. [Dokploy Deployment Issues](#dokploy-deployment-issues)
4. [Backend Issues](#backend-issues)
5. [Frontend Issues](#frontend-issues)
6. [API and LLM Issues](#api-and-llm-issues)
7. [Network and Connectivity Issues](#network-and-connectivity-issues)
8. [Performance Issues](#performance-issues)
9. [Environment Variables Issues](#environment-variables-issues)
10. [SSL Certificate Issues](#ssl-certificate-issues)
11. [Resource Issues](#resource-issues)
12. [Log Analysis](#log-analysis)

## Initial Diagnosis Steps

Before diving into specific issues, follow these initial steps to diagnose problems:

### 1. Check Container Status

```bash
# For Docker Compose
docker-compose ps

# For Docker (if not using compose)
docker ps -a
```

### 2. Check Logs

```bash
# For Docker Compose
docker-compose logs backend
docker-compose logs frontend

# For Docker
docker logs <container-name>

# For Dokploy
# Check logs in the Dokploy dashboard for each application
```

### 3. Test Basic Connectivity

```bash
# Test backend health
curl -f http://localhost:8000/ || echo "Backend health check failed"

# Test frontend
curl -I http://localhost:3000/ || echo "Frontend not accessible"
```

## Docker Compose Issues

### Issue: Containers Fail to Start

**Symptoms**:
- Containers show as "Exit" or "Restarting"
- `docker-compose ps` shows non-zero exit codes

**Diagnosis**:
```bash
# Check container logs
docker-compose logs backend
docker-compose logs frontend

# Check for port conflicts
netstat -tulpn | grep :8000
netstat -tulpn | grep :3000
```

**Solutions**:
1. **Port Conflicts**:
   ```bash
   # Change ports in docker-compose.yml
   # For example:
   ports:
     - "8001:8000"  # Change host port from 8000 to 8001
   ```

2. **Missing Environment Variables**:
   ```bash
   # Check .env file exists and is properly formatted
   cat .env
   
   # Ensure required variables are set:
   # TAVILY_API_KEY, OPENROUTER_API_KEY
   ```

3. **Permission Issues**:
   ```bash
   # Check directory permissions
   ls -la backend/
   ls -la frontend/
   
   # Fix permissions if needed
   sudo chown -R $USER:$USER .
   ```

### Issue: Build Failures

**Symptoms**:
- `docker-compose up --build` fails during build process
- Errors about missing dependencies or files

**Diagnosis**:
```bash
# Check if all required files are present
ls -la backend/Dockerfile
ls -la frontend/Dockerfile
ls -la backend/requirements.txt
ls -la frontend/package.json
```

**Solutions**:
1. **Clean Build**:
   ```bash
   # Remove all containers and images
   docker-compose down -v
   docker system prune -a
   
   # Rebuild from scratch
   docker-compose up --build
   ```

2. **Dependency Issues**:
   ```bash
   # Check backend dependencies
   cd backend
   pip install -r requirements.txt
   
   # Check frontend dependencies
   cd frontend
   npm install
   ```

## Dokploy Deployment Issues

### Issue: Application Fails to Deploy

**Symptoms**:
- Deployment stuck in "Building" or "Deploying" state
- Application shows as "Unhealthy" after deployment

**Diagnosis**:
1. Check deployment logs in Dokploy dashboard
2. Verify repository access and credentials
3. Check if Dockerfile paths are correct

**Solutions**:
1. **Repository Access Issues**:
   - Ensure Dokploy has access to your repository
   - Check SSH keys or access tokens
   - Verify branch name is correct

2. **Build Path Issues**:
   - Verify build path points to correct directory
   - Check Dockerfile exists at specified path
   - Ensure all required files are in the repository

3. **Resource Constraints**:
   - Check server resources (CPU, RAM, Disk)
   - Increase resource limits in Dokploy settings
   - Monitor resource usage during build

### Issue: Health Check Failures

**Symptoms**:
- Application deployed but marked as "Unhealthy"
- Automatic restarts due to failed health checks

**Diagnosis**:
1. Check health check configuration in Dokploy
2. Test health endpoint manually
3. Check application startup time

**Solutions**:
1. **Adjust Health Check**:
   - Increase timeout values
   - Extend start period
   - Modify health check path if needed

2. **Fix Application Issues**:
   - Check if application starts correctly
   - Verify all required environment variables are set
   - Check for application errors in logs

## Backend Issues

### Issue: Backend API Not Responding

**Symptoms**:
- Frontend shows connection errors
- API endpoints return 500 errors
- Health checks fail

**Diagnosis**:
```bash
# Check if backend is running
docker-compose exec backend ps aux

# Test API directly
curl -v http://localhost:8000/

# Check backend logs
docker-compose logs backend
```

**Solutions**:
1. **Missing API Keys**:
   ```bash
   # Verify API keys are set
   docker-compose exec backend env | grep API_KEY
   
   # Update .env file with correct keys
   # Restart containers
   docker-compose restart backend
   ```

2. **Port Configuration**:
   ```bash
   # Check if backend is listening on correct port
   docker-compose exec backend netstat -tulpn | grep :8000
   
   # Verify HOST and PORT environment variables
   docker-compose exec backend env | grep -E "(HOST|PORT)"
   ```

3. **Application Errors**:
   ```bash
   # Check for Python errors
   docker-compose logs backend | grep -i error
   
   # Check for import errors
   docker-compose logs backend | grep -i "import error"
   ```

### Issue: LLM API Errors

**Symptoms**:
- Research requests fail with LLM-related errors
- API key authentication errors
- Model not available errors

**Diagnosis**:
1. Check LLM provider API status
2. Verify API key validity and permissions
3. Check model availability

**Solutions**:
1. **API Key Issues**:
   - Verify API key is correct and active
   - Check API key permissions and quotas
   - Ensure API key is properly set in environment variables

2. **Model Configuration**:
   ```bash
   # Check default model configuration
   docker-compose exec backend env | grep DEFAULT_MODEL
   
   # Verify model is available with your API key
   # Test with curl or provider's API documentation
   ```

3. **Rate Limiting**:
   - Check API usage quotas
   - Implement request throttling
   - Consider upgrading API plan if needed

## Frontend Issues

### Issue: Frontend Cannot Connect to Backend

**Symptoms**:
- Network errors in browser console
- CORS errors
- Connection timeout errors

**Diagnosis**:
1. Check browser console for errors
2. Verify backend URL configuration
3. Test backend connectivity

**Solutions**:
1. **URL Configuration**:
   ```bash
   # Check frontend environment variables
   docker-compose exec frontend env | grep BACKEND_URL
   
   # Verify URL is accessible from frontend container
   docker-compose exec frontend curl -v $BACKEND_URL
   ```

2. **CORS Configuration**:
   ```bash
   # Check CORS settings in backend
   docker-compose exec backend env | grep CORS
   
   # Ensure frontend URL is in allowed origins
   ```

3. **Network Connectivity**:
   ```bash
   # Test connectivity between containers
   docker-compose exec frontend ping backend
   
   # Check if both containers are on same network
   docker network ls
   docker network inspect <network-name>
   ```

### Issue: Frontend Build Errors

**Symptoms**:
- Frontend container fails to build
- TypeScript compilation errors
- Missing dependency errors

**Diagnosis**:
1. Check build logs in Dokploy or Docker
2. Verify package.json and dependencies
3. Check TypeScript configuration

**Solutions**:
1. **Dependency Issues**:
   ```bash
   # Clear npm cache
   cd frontend
   npm cache clean --force
   
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **TypeScript Errors**:
   - Check TypeScript configuration
   - Verify type definitions
   - Fix compilation errors in source code

3. **Build Configuration**:
   - Verify Next.js configuration
   - Check environment variables for build
   - Ensure all required files are present

## API and LLM Issues

### Issue: Tavily Search API Errors

**Symptoms**:
- Web search functionality fails
- Search returns no results
- API authentication errors

**Diagnosis**:
1. Check Tavily API key validity
2. Verify API quota and usage
3. Test API directly

**Solutions**:
1. **API Key Issues**:
   - Verify API key is correct
   - Check API key permissions
   - Ensure API key is properly configured

2. **Rate Limiting**:
   - Check API usage limits
   - Implement request throttling
   - Consider upgrading API plan

3. **Search Configuration**:
   ```bash
   # Check search configuration
   docker-compose exec backend env | grep TAVILY
   
   # Verify search parameters
   docker-compose exec backend env | grep MAX_SEARCH
   ```

### Issue: LLM Provider Switching

**Symptoms**:
- Model switching fails
- Provider-specific errors
- Inconsistent behavior

**Diagnosis**:
1. Check model configuration
2. Verify provider-specific settings
3. Test each provider independently

**Solutions**:
1. **Model Configuration**:
   ```bash
   # Check current model configuration
   docker-compose exec backend env | grep DEFAULT_MODEL
   
   # Verify provider-specific settings
   docker-compose exec backend env | grep -E "(OPENAI|OPENROUTER|NVDEV)"
   ```

2. **Provider Fallback**:
   - Implement fallback mechanisms
   - Configure multiple providers
   - Monitor provider availability

## Network and Connectivity Issues

### Issue: Container Communication Failures

**Symptoms**:
- Containers cannot communicate
- Network timeout errors
- DNS resolution failures

**Diagnosis**:
1. Check network configuration
2. Test container connectivity
3. Verify DNS resolution

**Solutions**:
1. **Network Configuration**:
   ```bash
   # List Docker networks
   docker network ls
   
   # Inspect network configuration
   docker network inspect <network-name>
   
   # Check container network settings
   docker inspect <container-name> | grep NetworkMode
   ```

2. **DNS Resolution**:
   ```bash
   # Test DNS from container
   docker-compose exec backend nslookup google.com
   
   # Check DNS configuration
   docker-compose exec backend cat /etc/resolv.conf
   ```

3. **Firewall Issues**:
   - Check firewall rules
   - Verify port accessibility
   - Configure firewall if needed

## Performance Issues

### Issue: Slow Response Times

**Symptoms**:
- API requests take long time
- Frontend loading is slow
- Research processing is slow

**Diagnosis**:
1. Monitor resource usage
2. Check API response times
3. Analyze bottlenecks

**Solutions**:
1. **Resource Optimization**:
   ```bash
   # Check resource usage
   docker stats
   
   # Monitor memory usage
   docker-compose exec backend top
   
   # Check CPU usage
   docker-compose exec backend htop
   ```

2. **Caching**:
   - Implement response caching
   - Use CDN for static assets
   - Cache LLM responses when appropriate

3. **Database Optimization**:
   - Optimize database queries
   - Implement indexing
   - Consider connection pooling

## Environment Variables Issues

### Issue: Missing or Incorrect Environment Variables

**Symptoms**:
- Application fails to start
- Configuration errors
- Unexpected behavior

**Diagnosis**:
1. Check environment variables
2. Verify variable formats
3. Test with different values

**Solutions**:
1. **Variable Verification**:
   ```bash
   # List all environment variables
   docker-compose exec backend env
   
   # Check specific variables
   docker-compose exec backend env | grep -E "(API_KEY|MODEL|URL)"
   ```

2. **Format Issues**:
   - Check for special characters
   - Verify URL formats
   - Ensure proper escaping

3. **Variable Sources**:
   - Check .env files
   - Verify Dokploy configuration
   - Check system environment

## SSL Certificate Issues

### Issue: SSL Certificate Errors

**Symptoms**:
- Browser security warnings
- HTTPS connection failures
- Certificate validation errors

**Diagnosis**:
1. Check certificate validity
2. Verify domain configuration
3. Test SSL configuration

**Solutions**:
1. **Certificate Renewal**:
   - Check certificate expiration
   - Renew certificates if needed
   - Verify automatic renewal

2. **Domain Configuration**:
   - Verify DNS records
   - Check domain ownership
   - Ensure proper CNAME/A records

3. **SSL Configuration**:
   - Check certificate chain
   - Verify intermediate certificates
   - Test SSL configuration

## Resource Issues

### Issue: Memory or CPU Exhaustion

**Symptoms**:
- Container crashes
- Out-of-memory errors
- High CPU usage

**Diagnosis**:
1. Monitor resource usage
2. Check resource limits
3. Analyze resource patterns

**Solutions**:
1. **Resource Limits**:
   ```bash
   # Check current limits
   docker inspect <container-name> | grep -i memory
   
   # Update resource limits
   docker-compose up -d --scale backend=2
   ```

2. **Optimization**:
   - Optimize application code
   - Reduce memory usage
   - Implement efficient algorithms

3. **Scaling**:
   - Horizontal scaling
   - Load balancing
   - Resource allocation

## Log Analysis

### Analyzing Backend Logs

```bash
# View real-time logs
docker-compose logs -f backend

# Filter errors
docker-compose logs backend | grep -i error

# Filter warnings
docker-compose logs backend | grep -i warning

# Check specific time range
docker-compose logs --since="2023-01-01T00:00:00" --until="2023-01-02T00:00:00" backend
```

### Analyzing Frontend Logs

```bash
# View build logs
docker-compose logs frontend

# Check for build errors
docker-compose logs frontend | grep -i error

# Check for warnings
docker-compose logs frontend | grep -i warning
```

### Common Log Patterns

1. **API Key Errors**:
   ```
   ERROR: Invalid API key
   WARNING: API key not found
   ```

2. **Connection Errors**:
   ```
   ERROR: Connection refused
   WARNING: Network timeout
   ```

3. **Resource Errors**:
   ```
   ERROR: Out of memory
   WARNING: High CPU usage
   ```

## Emergency Procedures

### Complete Reset

```bash
# Stop all containers
docker-compose down

# Remove all volumes (data will be lost)
docker-compose down -v

# Remove all images
docker system prune -a

# Rebuild from scratch
docker-compose up --build
```

### Backup and Restore

```bash
# Backup volumes
docker run --rm -v udr_backend-logs:/data -v $(pwd):/backup alpine tar czf /backup/logs-backup.tar.gz -C /data .
docker run --rm -v udr_backend-instances:/data -v $(pwd):/backup alpine tar czf /backup/instances-backup.tar.gz -C /data .

# Restore volumes
docker run --rm -v udr_backend-logs:/data -v $(pwd):/backup alpine tar xzf /backup/logs-backup.tar.gz -C /data
docker run --rm -v udr_backend-instances:/data -v $(pwd):/backup alpine tar xzf /backup/instances-backup.tar.gz -C /data
```

## Getting Help

If you're still experiencing issues after trying these solutions:

1. **Check Documentation**:
   - [DOKPLOY_DEPLOYMENT.md](DOKPLOY_DEPLOYMENT.md)
   - [DEPLOYMENT.md](DEPLOYMENT.md)
   - [README.md](README.md)

2. **Create an Issue**:
   - Provide detailed error messages
   - Include your configuration
   - Describe steps to reproduce

3. **Community Support**:
   - Check for similar issues
   - Ask for help in discussions
   - Share your experience

## Prevention Tips

1. **Regular Monitoring**:
   - Set up monitoring alerts
   - Regularly check logs
   - Monitor resource usage

2. **Backup Strategy**:
   - Regular backups
   - Test restore procedures
   - Document backup process

3. **Update Management**:
   - Regular updates
   - Test before deployment
   - Rollback plan

4. **Security**:
   - Regular security audits
   - Update dependencies
   - Monitor access logs