# Переменные окружения

Как безопасно настраивать ключи и параметры Universal Deep Research.

## Безопасность
- Никогда не коммитьте реальные ключи API.
- `.env` и файлы ключей исключены через `.gitignore`.
- Используйте только шаблоны (`.env.example`, `env.example`) как образцы.

## Настройка
### Вариант 1. Файл `.env` (рекомендуется)
1. Скопируйте шаблон:
   ```bash
   cp .env.example .env
   ```
2. Заполните реальные значения:
   ```bash
   # Обязательные
   OPENROUTER_API_KEY=ваш-openrouter-api-ключ
   TAVILY_API_KEY=ваш-tavily-api-ключ

   # Опционально
   NVDEV_API_KEY=ваш-nvidia-api-ключ
   OPENAI_API_KEY=ваш-openai-api-ключ
   ```

### Вариант 2. Текстовые файлы (альтернатива)
```bash
echo "your-tavily-api-key" > apps/backend/tavily_api.txt
echo "your-llm-api-key" > apps/backend/nvdev_api.txt
```
Убедитесь, что файлы остаются в `.gitignore`.

### Вариант 3. Установка напрямую
```bash
export OPENROUTER_API_KEY=...
export TAVILY_API_KEY=...
```

## Обязательные переменные
| Переменная | Описание | Где получить |
|------------|----------|--------------|
| `OPENROUTER_API_KEY` | Ключ для OpenRouter | https://openrouter.ai/keys |
| `TAVILY_API_KEY` | Ключ Tavily для веб‑поиска | https://tavily.com/account |

## Опциональные переменные
| Переменная | Описание |
|------------|----------|
| `NVDEV_API_KEY` | Ключ для моделей NVIDIA |
| `OPENAI_API_KEY` | Ключ для моделей OpenAI |
| `DEFAULT_MODEL` | Модель LLM по умолчанию |
| `BACKEND_PORT` | Порт бэкенда |
| `FRONTEND_URL` | URL фронтенда |
| `BACKEND_URL` | URL бэкенда |

## Примеры `.env`
### Минимальный
```bash
BACKEND_PORT=8000
BACKEND_LOG_LEVEL=info
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
OPENROUTER_API_KEY=sk-or-v1-your-openrouter-api-key
TAVILY_API_KEY=tvly-your-tavily-api-key
DEFAULT_MODEL=openrouter/openai/gpt-oss-120b-free
LLM_BASE_URL=https://openrouter.ai/api/v1
MAX_TOPICS=1
MAX_SEARCH_PHRASES=1
MAX_SEARCH_RESULTS=10
```

### Продакшен
```bash
BACKEND_PORT=8000
BACKEND_LOG_LEVEL=warning
FRONTEND_URL=https://your-domain.com
BACKEND_URL=https://api.your-domain.com
OPENROUTER_API_KEY=sk-or-v1-your-openrouter-api-key
TAVILY_API_KEY=tvly-your-tavily-api-key
NVDEV_API_KEY=your-nvidia-api-key
OPENAI_API_KEY=sk-your-openai-api-key
DEFAULT_MODEL=openrouter/anthropic/claude-3.5-sonnet
LLM_BASE_URL=https://openrouter.ai/api/v1
LLM_TEMPERATURE=0.2
LLM_TOP_P=0.7
LLM_MAX_TOKENS=2048
MAX_TOPICS=3
MAX_SEARCH_PHRASES=5
MAX_SEARCH_RESULTS=20
```

## Работа с Docker
Docker Compose автоматически читает `.env`:
```bash
docker compose up -d
```

## Проверка конфигурации
- В контейнере: `docker compose exec backend env | grep API_KEY`
- Локально: `env | grep API_KEY`

## Рекомендации по безопасности
1. Не добавляйте `.env` в репозиторий.
2. Используйте разные ключи для разработки и продакшена.
3. Регулярно обновляйте ключи.
4. Ограничивайте права в панелях провайдеров.
5. В CI/CD передавайте секреты через переменные, а не файлы.

## Устранение проблем
1. Проверьте, что обязательные переменные заданы.
2. Убедитесь, что ключи действительны.
3. Посмотрите логи на ошибки аутентификации.

## Полезные ссылки
- [OpenRouter API](https://openrouter.ai/docs)
- [Tavily API](https://tavily.com/docs)
- [Переменные в Docker Compose](https://docs.docker.com/compose/environment-variables/)
