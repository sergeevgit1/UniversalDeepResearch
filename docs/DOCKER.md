# Руководство по развертыванию в Docker

Этот документ описывает запуск Universal Deep Research через Docker Compose.

## Требования
- **Docker** 20.10+
- **Docker Compose** 2.0+
- **API‑ключи**: Tavily (обязательно) и хотя бы один ключ LLM‑провайдера (NVIDIA, OpenAI или OpenRouter)

Проверьте установку:
```bash
docker --version
docker compose version
```

## Быстрый запуск
Docker Compose автоматически собирает и стартует backend и frontend.

### Шаг 1. Клонируйте репозиторий
```bash
git clone https://github.com/sergeevgit1/UniversalDeepResearch.git
cd UniversalDeepResearch
```

### Шаг 2. Настройте ключи
Файл `.env` (загружается `docker-compose.yml`) хранит URL и ключи.
```bash
cp .env.example .env
```
Заполните `.env`, минимум нужны `OPENROUTER_API_KEY` и `TAVILY_API_KEY`:
```env
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
OPENROUTER_API_KEY=your-openrouter-api-key
TAVILY_API_KEY=your-tavily-api-key
# Необязательные ключи
NVDEV_API_KEY=
OPENAI_API_KEY=
```
`.env` должен лежать в корне проекта и не попадать в git.

### Шаг 3. Запустите сервисы
```bash
docker compose up -d
```
Команда собирает образы, создаёт контейнеры, настраивает сеть и тома.

### Шаг 4. Откройте приложение
- Frontend: **http://localhost:3000**
- Backend API: **http://localhost:8000**
- Документация API: **http://localhost:8000/docs**

## Настройка
### Переменные окружения
Настраиваются в `.env`: порты, уровни логов, параметры моделей и исследования. Скопируйте пример `cp .env.example .env` и измените нужные значения.

### Свои порты
```bash
# Пример: фронтенд на 8080
FRONTEND_PORT=8080 docker compose up -d
```

## Управление сервисами
### Логи
```bash
docker compose logs -f              # все сервисы
docker compose logs -f backend      # только backend
docker compose logs -f frontend     # только frontend
```

### Остановка
```bash
docker compose down         # остановить
docker compose down -v      # остановить и удалить тома
```

### Перезапуск
```bash
docker compose restart            # все сервисы
docker compose restart backend    # конкретный сервис
```

### Пересборка после изменений
```bash
docker compose up -d --build
```

## Хранение данных
В качестве томов монтируются директории:
- `backend/logs` — логи приложения
- `backend/instances` — данные исследований
- `backend/mock_instances` — тестовые данные

## Частые проблемы
### Нет соединения с backend
1. Убедитесь, что оба сервиса запущены: `docker compose ps`
2. Проверьте здоровье backend: `docker compose logs backend`
3. Проверьте CORS и значения URL во фронтенде

### Ошибки API‑ключей
1. Убедитесь, что ключи указаны в `.env`
2. Проверьте, что нет лишних пробелов
3. Посмотрите итоговую конфигурацию: `docker compose config`

### Конфликт портов
1. Проверьте, заняты ли 3000/8000: `netstat -an | grep LISTEN`
2. Освободите порты или измените их в `docker-compose.yml`

### Права на тома
Если появляются ошибки прав, поправьте владельца:
```bash
sudo chown -R $USER:$USER backend/logs backend/instances
```

## Режим разработки
Для «горячей» перезагрузки смонтируйте исходники в `docker-compose.dev.yml`:
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
Запуск:
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## Продакшен
- Используйте отдельные `.env` для сред
- Добавьте HTTPS (Nginx/Traefik)
- Ограничьте ресурсы контейнеров
- Храните секреты в менеджере секретов
- Настройте мониторинг и обновления

## Безопасность
Проект исследовательский и не готов к продакшену без доработок.
- Ключи в `.env` хранятся открыто
- Нет аутентификации и авторизации
- CORS настроен для локальной разработки
- Контейнеры используют стандартные настройки безопасности

Для продакшена добавьте управление секретами, аутентификацию, TLS, сетевую изоляцию и сканирование образов.

## Дополнительно
- [Документация Docker](https://docs.docker.com/)
- [Документация Docker Compose](https://docs.docker.com/compose/)
- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)

## Поддержка
- Смотрите логи: `docker compose logs`
- Основная справка: [README.md](README.md)
- При проблемах создайте issue в репозитории
