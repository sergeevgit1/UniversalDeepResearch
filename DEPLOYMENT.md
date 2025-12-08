# Руководство по развёртыванию / Deployment Guide

## Русский

### Варианты развёртывания

Для проекта Universal Deep Research доступны следующие варианты развёртывания:

1. **Docker Compose (локальный)** - Для разработки и тестирования
2. **Dokploy (продакшн)** - Для надёжного развёртывания в продакшн среде
3. **Ручное развёртывание** - Для кастомных настроек

### Быстрый старт с Docker Compose

1. **Клонируйте репозиторий**:
   ```bash
   git clone https://github.com/sergeevgit1/UniversalDeepResearch.git
   cd UniversalDeepResearch
   ```

2. **Создайте файл .env**:
   ```bash
   cp .env.example .env
   ```

3. **Настройте переменные окружения в .env**:
   
   **Обязательные переменные**:
   - `OPENROUTER_API_KEY` - API ключ OpenRouter (для бесплатной модели)
   - `TAVILY_API_KEY` - API ключ Tavily (для веб-поиска)

   **Опциональные переменные**:
   - `NVDEV_API_KEY` - API ключ NVIDIA (если используете NVIDIA модели)
   - `OPENAI_API_KEY` - API ключ OpenAI (если используете OpenAI модели)
   - `DEFAULT_MODEL` - модель по умолчанию (по умолчанию: `openrouter/openai/gpt-oss-120b-free`)

4. **Запустите приложение**:
   ```bash
   docker-compose up -d --build
   ```

5. **Проверьте статус контейнеров**:
   ```bash
   docker-compose ps
   ```

6. **Откройте приложение**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

### Устранение неполадок

#### Контейнер backend помечен как unhealthy

Если контейнер backend не проходит проверку здоровья:

1. **Проверьте логи backend**:
   ```bash
   docker-compose logs backend
   ```

2. **Убедитесь, что API ключи настроены**:
   - Проверьте файл `.env`
   - Убедитесь, что `TAVILY_API_KEY` установлен (обязательно)
   - Для модели по умолчанию нужен `OPENROUTER_API_KEY`

3. **Проверьте healthcheck вручную**:
   ```bash
   docker-compose exec backend curl -f http://localhost:8000/
   ```

4. **Увеличьте время ожидания запуска**:
   В `docker-compose.yml` параметр `start_period` установлен на 60 секунд. Если ваш сервер запускается медленнее, увеличьте это значение.

#### Ошибки импорта модулей

Если видите ошибки типа `ModuleNotFoundError`:

1. **Пересоберите контейнеры**:
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

2. **Проверьте requirements.txt**:
   Убедитесь, что все зависимости установлены.

### Остановка приложения

```bash
docker-compose down
```

Для удаления volumes (данные будут потеряны):
```bash
docker-compose down -v
```

### Развёртывание через Dokploy (Рекомендуется для продакшн)

Для надёжного развёртывания в продакшн среде рекомендуется использовать Dokploy. Подробное руководство по развёртыванию через Dokploy доступно в файле [DOKPLOY_DEPLOYMENT.md](DOKPLOY_DEPLOYMENT.md).

#### Преимущества Dokploy:

- Автоматическое управление SSL-сертификатами
- Мониторинг состояния приложений
- Автоматическое переразвертывание при обновлениях
- Управление переменными окружения
- Логирование и отладка

#### Быстрое начало с Dokploy:

1. Установите Dokploy на ваш сервер
2. Следуйте инструкциям в [DOKPLOY_DEPLOYMENT.md](DOKPLOY_DEPLOYMENT.md)
3. Настройте переменные окружения на основе файла [.env.dokploy.example](.env.dokploy.example)

### Решённые проблемы и улучшения

В последних версиях были решены следующие проблемы:

#### 1. Проблема с переменными окружения
- **Проблема**: Раньше API ключи требовалось хранить в файлах
- **Решение**: Теперь все API ключи передаются через переменные окружения для большей безопасности

#### 2. Health check для контейнеров
- **Проблема**: Контейнеры могли запускаться, но приложение было недоступно
- **Решение**: Добавлены надёжные health checks для обоих сервисов

#### 3. CORS конфигурация
- **Проблема**: Ошибки CORS при развёртывании на разных доменах
- **Решение**: Улучшена конфигурация CORS с поддержкой нескольких доменов

#### 4. Управление зависимостями
- **Проблема**: Проблемы с кешированием зависимостей при сборке
- **Решение**: Оптимизированы Dockerfile для более эффективной сборки

---

## English

### Quick Start with Docker Compose

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sergeevgit1/UniversalDeepResearch.git
   cd UniversalDeepResearch
   ```

2. **Create .env file**:
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables in .env**:
   
   **Required variables**:
   - `OPENROUTER_API_KEY` - OpenRouter API key (for free model)
   - `TAVILY_API_KEY` - Tavily API key (for web search)

   **Optional variables**:
   - `NVDEV_API_KEY` - NVIDIA API key (if using NVIDIA models)
   - `OPENAI_API_KEY` - OpenAI API key (if using OpenAI models)
   - `DEFAULT_MODEL` - default model (default: `openrouter/openai/gpt-oss-120b-free`)

4. **Start the application**:
   ```bash
   docker-compose up -d --build
   ```

5. **Check container status**:
   ```bash
   docker-compose ps
   ```

6. **Open the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

### Troubleshooting

#### Backend container is unhealthy

If the backend container fails health checks:

1. **Check backend logs**:
   ```bash
   docker-compose logs backend
   ```

2. **Ensure API keys are configured**:
   - Check the `.env` file
   - Make sure `TAVILY_API_KEY` is set (required)
   - Default model requires `OPENROUTER_API_KEY`

3. **Test healthcheck manually**:
   ```bash
   docker-compose exec backend curl -f http://localhost:8000/
   ```

4. **Increase startup wait time**:
   In `docker-compose.yml`, the `start_period` parameter is set to 60 seconds. If your server starts slower, increase this value.

#### Module import errors

If you see `ModuleNotFoundError` errors:

1. **Rebuild containers**:
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

2. **Check requirements.txt**:
   Ensure all dependencies are installed.

### Stopping the application

```bash
docker-compose down
```

To remove volumes (data will be lost):
```bash
docker-compose down -v
```

### Dokploy Deployment (Recommended for Production)

For reliable production deployment, we recommend using Dokploy. For detailed instructions, see [DOKPLOY_DEPLOYMENT.md](DOKPLOY_DEPLOYMENT.md).

#### Dokploy Advantages:

- Automatic SSL certificate management
- Application health monitoring
- Automatic redeployment on updates
- Environment variable management
- Logging and debugging

#### Quick Start with Dokploy:

1. Install Dokploy on your server
2. Follow the instructions in [DOKPLOY_DEPLOYMENT.md](DOKPLOY_DEPLOYMENT.md)
3. Configure environment variables based on [.env.dokploy.example](.env.dokploy.example)

### Resolved Issues and Improvements

The following issues have been resolved in recent versions:

#### 1. Environment Variables Issue
- **Issue**: Previously, API keys had to be stored in files
- **Resolution**: All API keys are now passed through environment variables for better security

#### 2. Container Health Checks
- **Issue**: Containers could start but the application would be unavailable
- **Resolution**: Reliable health checks have been added for both services

#### 3. CORS Configuration
- **Issue**: CORS errors when deploying on different domains
- **Resolution**: Improved CORS configuration with support for multiple domains

#### 4. Dependency Management
- **Issue**: Dependency caching problems during build
- **Resolution**: Optimized Dockerfiles for more efficient builds
