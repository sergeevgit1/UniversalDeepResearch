# Быстрый старт с Docker Compose

Запустите Universal Deep Research за 3 шага.

## Необходимые инструменты
- Docker 20.10+ и Docker Compose 2.0+
- Ключ Tavily API (для веб‑поиска)
- Ключ OpenRouter API (для модели по умолчанию)

## Шаги
### 1. Настройте API‑ключи
Все ключи и URL задаются в файле `.env`.

1. Скопируйте пример:
```bash
cp .env.example .env
```
2. Откройте `.env` и заполните ключи и адреса сервисов. Для модели по умолчанию нужны `OPENROUTER_API_KEY` и `TAVILY_API_KEY`.
```env
# Пример содержимого .env
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
OPENROUTER_API_KEY=your-openrouter-api-key
TAVILY_API_KEY=your-tavily-api-key
```

### 2. Запустите сервисы
```bash
docker compose up -d
```
Команда соберёт образы backend и frontend, поднимет оба сервиса и настроит сеть/тома.

### 3. Откройте приложение
- Frontend: **http://localhost:3000**
- Backend API: **http://localhost:8000**

## Остановка сервисов
```bash
docker compose down
```

## Просмотр логов
```bash
# Все сервисы
docker compose logs -f

# Отдельный сервис
docker compose logs -f backend
docker compose logs -f frontend
```

## Если что-то пошло не так
1. Проверьте `docker compose ps`
2. Посмотрите логи: `docker compose logs`
3. Убедитесь, что ключи в `.env` корректны
4. Подробнее в [DOCKER.md](DOCKER.md)

## Что дальше
- Полное руководство: [DOCKER.md](DOCKER.md)
- Документация backend: [backend/README.md](backend/README.md)
- Документация frontend: [frontend/README.md](frontend/README.md)
