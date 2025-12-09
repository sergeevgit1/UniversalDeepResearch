# Universal Deep Research (UDR)

Исследовательский прототип, совмещающий настраиваемые стратегии работы, интеллектуальный веб‑поиск, анализ контента и автоматическую генерацию отчётов с помощью больших языковых моделей. Репозиторий содержит FastAPI backend и Next.js frontend.

> Проект предназначен для демонстрации. Код и модели находятся в активной разработке и не рассчитаны на продакшен.

## Возможности
- **Интеллектуальное исследование** с использованием нескольких LLM‑провайдеров
- **Прогресс в реальном времени** через Server‑Sent Events
- **Современный веб‑интерфейс** для запуска исследований и просмотра результатов
- **Веб‑поиск** через Tavily API
- **Автоматическая генерация отчётов** по собранным данным
- **Продвинутая надёжность** (FrameV4) и модульная архитектура

## Структура проекта
```
/
├── turbo.json            # Настройка Turborepo пайплайнов
├── package.json          # Workspaces и команды верхнего уровня
├── apps/
│   ├── backend/          # Код backend сервиса (Python, FastAPI)
│   └── frontend/         # Код frontend приложения (Next.js)
├── packages/
│   ├── config/           # Общие конфигурации линтеров/форматтеров
│   └── infra/            # Общие скрипты/конфигурации инфраструктуры
├── docker-compose.yml    # Оркестрация сервисов
└── docs/                 # Вся документация (этот файл)
    ├── QUICKSTART.md
    ├── DOCKER.md
    ├── DEPLOYMENT.md
    ├── DOKPLOY_DEPLOYMENT.md
    ├── ENVIRONMENT_VARIABLES.md
    ├── TROUBLESHOOTING.md
    ├── OPENROUTER.md
    ├── sprint_roadmap.md     # Дорожная карта инфраструктурных спринтов
    ├── backend/          # Документация backend
    └── frontend/         # Документация frontend
```

## Быстрый старт
Используйте Docker Compose (рекомендуется) или ручной запуск.

### Вариант 1. Docker Compose (рекомендуется)
```bash
# 1. Клонируйте репозиторий
git clone https://github.com/sergeevgit1/UniversalDeepResearch.git
cd UniversalDeepResearch

# 2. Подготовьте переменные окружения
cp .env.example .env
# Заполните ключи и URL в .env (OpenRouter, Tavily, FRONTEND_URL, BACKEND_URL)

# 3. Запустите сервисы
docker compose up -d

# 4. Откройте приложение
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
```
Подробности см. в [QUICKSTART.md](QUICKSTART.md) и [DOCKER.md](DOCKER.md).

### Вариант 2. Ручная установка
1. Настройте backend (код в `apps/backend`) по инструкции [backend/README.md](backend/README.md)
2. Настройте frontend (код в `apps/frontend`) по инструкции [frontend/README.md](frontend/README.md)
3. Запустите оба сервиса и откройте `http://localhost:3000`

## Turborepo (монорепозиторий)

Проект организован как Turborepo: все приложения лежат в `apps/`, общая инфраструктура в `packages/infra`. Кеширование и зависимости отслеживаются едиными пайплайнами (см. [refactoring_proposals.md](refactoring_proposals.md)).

### Основные команды Turbo (из корня)

```bash
# Запуск дев-серверов фронтенда и бэкенда параллельно
npm run dev             # эквивалент turbo run dev --parallel

# Сборка всех приложений с учётом зависимостей между workspace
npm run build           # turbo run build

# Быстрая проверка кода (Next.js + compileall для Python)
npm run lint            # turbo run lint

# Точечный запуск конкретного приложения
turbo run dev --filter=apps/frontend
turbo run lint --filter=apps/backend
turbo run build --filter=packages/infra
```

### Workspaces
- `apps/frontend` — Next.js интерфейс
- `apps/backend` — FastAPI backend
- `packages/config` — общие конфигурации линтеров и форматтеров
- `packages/infra` — общие скрипты инфраструктуры, контейнеризация, CI заготовки

### Политика окружения и кеша
- `.env`/`.env.local` хранятся в соответствующих workspace (`apps/frontend/.env.local`, `apps/backend/.env`).
- Кеш Turborepo хранится локально в `.turbo` и может быть очищен командой `turbo prune` или удалением каталога `.turbo`.
- Запуски `dev` не кешируются (`persistent: true`), сборки и линтинг используют кеш, поэтому их лучше запускать через `turbo run ...`.
- Для удалённого кеша используйте переменные `TURBO_TOKEN` и `TURBO_TEAM` (при необходимости CI), но не храните их в репозитории.

### Troubleshooting Turborepo
- Несоответствие Node.js: убедитесь, что установлен Node.js версии из `packageManager` в `package.json`.
- Проблемы с зависимостями: выполните `rm -rf node_modules .turbo` и `npm install`.
- Ошибки путей после обновления структуры: проверьте, что команды выполняются из корня и фильтры указывают на `apps/*` или `packages/infra`.
- Если кеш повредился в CI, отключите его временно: `TURBO_CACHE=none turbo run build`.

## Поддерживаемые LLM‑провайдеры
- **NVIDIA NGC** (например, Llama 3.1 Nemotron 253B, Llama 3.1 8B Instruct)
- **OpenAI** (GPT‑4, GPT‑3.5 Turbo и др.)
- **OpenRouter** (единый API к Claude, GPT‑4, Llama и др.)
- **vLLM локально** с пользовательскими моделями

Подробнее о настройке провайдеров см. в [DEPLOYMENT.md](DEPLOYMENT.md) и [OPENROUTER.md](OPENROUTER.md).

## Полезные материалы
- [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md) — все переменные окружения
- [DOKPLOY_DEPLOYMENT.md](DOKPLOY_DEPLOYMENT.md) — продакшен через Dokploy
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) — типичные проблемы и решения
- [backend/CHANGELOG.md](backend/CHANGELOG.md) — изменения backend
- [frontend/CONTRIBUTING.md](frontend/CONTRIBUTING.md) — вклад в frontend

Приятной работы с Universal Deep Research!
