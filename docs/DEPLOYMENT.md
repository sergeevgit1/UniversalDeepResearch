# Руководство по развёртыванию

Документ описывает варианты запуска Universal Deep Research и ключевые настройки.

## Варианты
1. **Docker Compose (локально)** — быстрое развёртывание для разработки и тестов
2. **Dokploy (продакшен)** — надёжный запуск с готовыми health‑чеками и управлением окружением
3. **Ручной запуск** — при необходимости индивидуальных настроек

## Быстрый старт с Docker Compose
1. Клонируйте репозиторий и перейдите в каталог проекта:
   ```bash
   git clone https://github.com/sergeevgit1/UniversalDeepResearch.git
   cd UniversalDeepResearch
   ```
2. Создайте `.env` и заполните переменные:
   ```bash
   cp .env.example .env
   ```
   Обязательные значения:
   - `OPENROUTER_API_KEY` — ключ OpenRouter (модель по умолчанию)
   - `TAVILY_API_KEY` — ключ Tavily (веб‑поиск)

   Опционально:
   - `NVDEV_API_KEY` — ключ NVIDIA
   - `OPENAI_API_KEY` — ключ OpenAI
   - `DEFAULT_MODEL` — модель по умолчанию (по умолчанию `openrouter/openai/gpt-oss-120b-free`)
3. Запустите сервисы:
   ```bash
   docker compose up -d --build
   ```
4. Проверьте статус:
   ```bash
   docker compose ps
   ```
5. Откройте приложение:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## Устранение неполадок
### Backend unhealthy
1. Посмотрите логи: `docker compose logs backend`
2. Проверьте `.env` — обязательно `TAVILY_API_KEY` и, для модели по умолчанию, `OPENROUTER_API_KEY`
3. Проверьте healthcheck вручную: `docker compose exec backend curl -f http://localhost:8000/`
4. Если сервер стартует медленно, увеличьте `start_period` в `docker-compose.yml`

### Ошибки импорта модулей
1. Пересоберите контейнеры:
   ```bash
   docker compose down
   docker compose up -d --build
   ```
2. Убедитесь, что зависимости из `requirements.txt` установлены

### Остановка
```bash
docker compose down        # остановка
docker compose down -v     # остановка с удалением томов
```

## Развёртывание через Dokploy (рекомендуется для продакшена)
Подробности в [DOKPLOY_DEPLOYMENT.md](DOKPLOY_DEPLOYMENT.md). Ключевые преимущества:
- Автоматические SSL‑сертификаты
- Мониторинг состояния и перезапуски
- Управление переменными окружения и логами

Быстрый старт: установите Dokploy, следуйте инструкции в `DOKPLOY_DEPLOYMENT.md`, настройте переменные по образцу `.env.dokploy.example`.

## Улучшения последних версий
- **Переменные окружения** — вместо файлов ключи хранятся в `.env`
- **Health‑checks** — добавлены проверки для обоих сервисов
- **CORS** — улучшена поддержка нескольких доменов
- **Сборка** — оптимизированы Dockerfile и кеширование зависимостей
