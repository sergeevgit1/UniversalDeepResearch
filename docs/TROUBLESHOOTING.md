# Руководство по устранению неполадок

Краткие шаги для поиска и решения проблем при развёртывании Universal Deep Research.

## Базовая диагностика
- Статус контейнеров: `docker compose ps`
- Логи: `docker compose logs backend` и `docker compose logs frontend`
- Проверка доступности:
  ```bash
  curl -f http://localhost:8000/ || echo "Backend недоступен"
  curl -I http://localhost:3000/ || echo "Frontend недоступен"
  ```

## Docker Compose
### Контейнеры не стартуют
1. Посмотрите логи сервисов.
2. Проверьте конфликты портов `netstat -tulpn | grep ':8000\|:3000'`.
3. Пересоберите образы: `docker compose up -d --build`.

### Контейнер unhealthy
- Убедитесь, что заполнены ключи в `.env`.
- Увеличьте `start_period` в `docker-compose.yml`, если запуск долгий.

## Dokploy
- Проверяйте логи в панели Dokploy для каждого приложения.
- Убедитесь, что внутренние порты 8000/3000 совпадают с настройками контейнеров.
- При ошибках TLS проверьте DNS и открытость 80/443.

## Backend
- Ошибка импорта: пересоберите контейнер (`docker compose up -d --build`).
- 5xx ответы: проверьте логи и корректность API‑ключей.

## Frontend
- Пустая страница или 404: перепроверьте `NEXT_PUBLIC_BACKEND_URL` и `BACKEND_URL`.
- Ошибки CORS: убедитесь, что `FRONTEND_URL` соответствует реальному домену.

## API и LLM
- Ошибки авторизации: проверьте ключи OpenRouter/Tavily/NVIDIA/OpenAI в `.env`.
- Неверная модель: обновите `DEFAULT_MODEL` на поддерживаемое значение.

## Сеть и производительность
- Медленные ответы: уменьшите `MAX_SEARCH_RESULTS` или снизьте параметры модели (`LLM_MAX_TOKENS`).
- Проблемы с подключением: убедитесь, что сервер имеет доступ к интернету и не блокирует исходящие запросы.

## Сбор информации
- Все логи: `docker compose logs -f`
- Конфигурация docker compose: `docker compose config`
- Переменные окружения в контейнере: `docker compose exec backend env | grep _URL`
