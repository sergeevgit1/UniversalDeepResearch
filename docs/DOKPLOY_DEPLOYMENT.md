# Развёртывание Universal Deep Research в Dokploy

Инструкция по полному развёртыванию UDR с помощью Dokploy и Docker.

## Предварительные условия
- Сервер с Docker и Docker Compose
- Установленный Dokploy
- Настроенные домены (желательно) и SSL (Dokploy может управлять сертификатами)
- Ключи API: Tavily (обязательно) и хотя бы один провайдер LLM (OpenRouter, NVIDIA или OpenAI)

## Подготовка Dokploy
1. Войдите в панель Dokploy и создайте проект `universal-deep-research`.
2. Убедитесь, что репозиторий доступен (SSH‑ключ Dokploy или токен для HTTPS).
3. Создайте два приложения:
   - **udr-backend**
   - **udr-frontend**

## Настройка backend (udr-backend)
1. **Основные параметры**
   - Источник: Git, ветка `main` (или своя)
   - Путь сборки: `./backend`
   - Dockerfile: `./Dockerfile`
2. **Порты**
   - Внутренний порт: `8000` (внешний Dokploy задаст сам)
3. **Переменные окружения** (пример)
   ```bash
   HOST=0.0.0.0
   PORT=8000
   LOG_LEVEL=info
   RELOAD=false
   TAVILY_API_KEY=your_tavily_api_key_here
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   NVDEV_API_KEY=your_nvidia_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   DEFAULT_MODEL=openrouter/openai/gpt-oss-120b-free
   LLM_BASE_URL=https://openrouter.ai/api/v1
   LLM_TEMPERATURE=0.2
   LLM_TOP_P=0.7
   LLM_MAX_TOKENS=2048
   FRONTEND_URL=https://your-frontend-domain.com
   ALLOW_CREDENTIALS=true
   MAX_TOPICS=1
   MAX_SEARCH_PHRASES=1
   MAX_SEARCH_RESULTS=10
   MOCK_DIRECTORY=mock_instances/stocks_24th_3_sections
   RANDOM_SEED=42
   LOG_DIR=logs
   TRACE_ENABLED=true
   COPY_INTO_STDOUT=false
   LONG_CONTEXT_CUTOFF=8192
   FORCE_LONG_CONTEXT=false
   MAX_ITERATIONS=1024
   INTERACTION_LEVEL=none
   ```
4. **Health‑check**
   - Путь: `/`
   - Interval: 30s, Timeout: 10s, Retries: 3, Start Period: 60s

## Настройка frontend (udr-frontend)
1. **Основные параметры**
   - Источник: Git, ветка `main`
   - Путь сборки: `./frontend`
   - Dockerfile: `./Dockerfile`
2. **Порты**
   - Внутренний порт: `3000`
3. **Переменные окружения** (пример)
   ```bash
   HOST=0.0.0.0
   PORT=3000
   BACKEND_URL=https://your-backend-domain.com
   NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.com
   ```
4. **Health‑check**
   - Путь: `/`
   - Interval: 30s, Timeout: 10s, Retries: 3, Start Period: 60s

## Процесс развёртывания
1. Добавьте оба приложения в проект Dokploy.
2. Настройте тома для логов и данных backend при необходимости.
3. Запустите сборку и деплой из панели Dokploy.
4. Подключите домены и включите SSL через встроенный менеджер сертификатов.

## Проверка после деплоя
- Откройте фронтенд домен — интерфейс должен загрузиться.
- Проверьте API: `https://<backend-domain>/docs`.
- В логах Dokploy убедитесь, что health‑checks проходят.

## Мониторинг и обслуживание
- Используйте логи Dokploy для анализа ошибок.
- Настройте уведомления о падении контейнеров.
- При обновлении кода триггерите новую сборку и деплой.

## Частые проблемы
- **Неверные ключи API** — перепроверьте значения в переменных окружения.
- **CORS** — убедитесь, что `FRONTEND_URL` указывает на боевой домен.
- **Порты/проброс** — внутренние порты должны совпадать с настройками контейнеров.
- **TLS** — если сертификат не выпускается, проверьте DNS и открытость 80/443.
