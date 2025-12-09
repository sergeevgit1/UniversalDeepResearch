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
├── backend/              # Код backend сервиса (Python, FastAPI)
├── frontend/             # Код frontend приложения (Next.js)
├── docker-compose.yml    # Оркестрация сервисов
└── docs/                 # Вся документация (этот файл)
    ├── QUICKSTART.md
    ├── DOCKER.md
    ├── DEPLOYMENT.md
    ├── DOKPLOY_DEPLOYMENT.md
    ├── ENVIRONMENT_VARIABLES.md
    ├── TROUBLESHOOTING.md
    ├── OPENROUTER.md
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
1. Настройте backend по инструкции в [backend/README.md](backend/README.md)
2. Настройте frontend по инструкции в [frontend/README.md](frontend/README.md)
3. Запустите оба сервиса и откройте `http://localhost:3000`

## Turborepo (монорепозиторий)

Проект организован как Turborepo: backend и frontend остаются самостоятельными приложениями, но теперь собираются и проверяются
едиными командами с кешированием и параллельным выполнением (см. рекомендации в [refactoring_proposals.md](refactoring_proposals.md)).

Команды верхнего уровня (выполняются из корня репозитория):

```bash
# Запуск обеих частей в режиме разработки с параллельным выводом
npm run dev

# Сборка обеих частей с учётом зависимостей
npm run build

# Базовая проверка синтаксиса (Next.js + быстрая проверка Python через compileall)
npm run lint
```

Каждый workspace также можно запускать отдельно: `npm run dev --workspace frontend` или `npm run lint --workspace backend`.

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
