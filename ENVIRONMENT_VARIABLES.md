# Переменные окружения

Этот документ описывает, как правильно работать с переменными окружения в проекте UniversalDeepResearch.

## Безопасность

**ВАЖНО:** Никогда не добавляйте файлы с реальными ключами API и другими чувствительными данными в систему контроля версий!

- Файл `.env` исключен из Git с помощью `.gitignore`
- Файлы с ключами (`tavily_api.txt`, `nvdev_api.txt`) также исключены
- Используйте только файлы-примеры (`.env.example`, `env.example`) в качестве шаблонов

## Настройка переменных окружения

### Способ 1: Использование файла .env (рекомендуется)

1. Скопируйте файл-шаблон:
   ```bash
   cp .env.example .env
   ```

2. Отредактируйте `.env` файл, добавив ваши реальные ключи API:
   ```bash
   # Обязательные переменные
   OPENROUTER_API_KEY=ваш-openrouter-api-ключ
   TAVILY_API_KEY=ваш-tavily-api-ключ
   
   # Опциональные переменные
   NVDEV_API_KEY=ваш-nvidia-api-ключ
   OPENAI_API_KEY=ваш-openai-api-ключ
   ```

### Способ 2: Использование текстовых файлов (альтернативный)

Для некоторых конфигураций можно использовать отдельные файлы для ключей:

1. Создайте файлы с ключами в директории `backend`:
   ```bash
   echo "your-tavily-api-key" > backend/tavily_api.txt
   echo "your-llm-api-key" > backend/nvdev_api.txt
   ```

2. Убедитесь, что эти файлы добавлены в `.gitignore`

### Способ 3: Установка переменных окружения напрямую

```bash
export OPENROUTER_API_KEY=ваш-openrouter-api-ключ
export TAVILY_API_KEY=ваш-tavily-api-ключ
```

## Обязательные переменные окружения

| Переменная | Описание | Где получить |
|------------|----------|-------------|
| `OPENROUTER_API_KEY` | Ключ для OpenRouter LLM провайдера | https://openrouter.ai/keys |
| `TAVILY_API_KEY` | Ключ для веб-поиска через Tavily | https://tavily.com/account |

## Опциональные переменные окружения

| Переменная | Описание | Где получить |
|------------|----------|-------------|
| `NVDEV_API_KEY` | Ключ для NVIDIA моделей | https://build.nvidia.com/ |
| `OPENAI_API_KEY` | Ключ для OpenAI моделей | https://platform.openai.com/api-keys |
| `DEFAULT_MODEL` | Модель по умолчанию | - |
| `BACKEND_PORT` | Порт бэкенда | - |
| `FRONTEND_URL` | URL фронтенда | - |
| `BACKEND_URL` | URL бэкенда | - |

## Примеры конфигурации

### Минимальная конфигурация (.env)

```bash
# Backend Configuration
BACKEND_PORT=8000
BACKEND_LOG_LEVEL=info

# Frontend Configuration
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000

# API Configuration (REQUIRED)
OPENROUTER_API_KEY=sk-or-v1-your-openrouter-api-key
TAVILY_API_KEY=tvly-your-tavily-api-key

# LLM Configuration
DEFAULT_MODEL=openrouter/openai/gpt-oss-120b-free
LLM_BASE_URL=https://openrouter.ai/api/v1

# Research Configuration
MAX_TOPICS=1
MAX_SEARCH_PHRASES=1
MAX_SEARCH_RESULTS=10
```

### Конфигурация для продакшена (.env)

```bash
# Backend Configuration
BACKEND_PORT=8000
BACKEND_LOG_LEVEL=warning

# Frontend Configuration
FRONTEND_URL=https://your-domain.com
BACKEND_URL=https://api.your-domain.com

# API Configuration (REQUIRED)
OPENROUTER_API_KEY=sk-or-v1-your-openrouter-api-key
TAVILY_API_KEY=tvly-your-tavily-api-key

# Optional API Keys
NVDEV_API_KEY=your-nvidia-api-key
OPENAI_API_KEY=sk-your-openai-api-key

# LLM Configuration
DEFAULT_MODEL=openrouter/anthropic/claude-3.5-sonnet
LLM_BASE_URL=https://openrouter.ai/api/v1
LLM_TEMPERATURE=0.2
LLM_TOP_P=0.7
LLM_MAX_TOKENS=2048

# Research Configuration
MAX_TOPICS=3
MAX_SEARCH_PHRASES=5
MAX_SEARCH_RESULTS=20
```

## Использование с Docker

При использовании Docker Compose переменные окружения автоматически считываются из файла `.env`:

```bash
docker-compose up -d
```

## Проверка конфигурации

Для проверки того, что переменные окружения установлены правильно:

1. В Docker:
   ```bash
   docker-compose exec backend env | grep API_KEY
   ```

2. Локально:
   ```bash
   env | grep API_KEY
   ```

## Рекомендации по безопасности

1. **Никогда не коммитьте `.env` файл** в систему контроля версий
2. **Используйте разные ключи** для разработки и продакшена
3. **Регулярно обновляйте ключи API** для повышения безопасности
4. **Ограничьте права доступа** к ключам API в панелях провайдеров
5. **Используйте переменные окружения** в CI/CD системах вместо файлов

## Устранение проблем

Если приложение не работает корректно:

1. Проверьте, что все обязательные переменные установлены
2. Убедитесь, что ключи API действительны
3. Проверьте права доступа к ключам API
4. Проверьте логи приложения на наличие ошибок аутентификации

## Дополнительные ресурсы

- [OpenRouter API Documentation](https://openrouter.ai/docs)
- [Tavily API Documentation](https://tavily.com/docs)
- [Docker Environment Variables](https://docs.docker.com/compose/environment-variables/)