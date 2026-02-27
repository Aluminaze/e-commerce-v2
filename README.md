# E-Commerce v2

> [https://example.com](https://example.com)

## Запуск локально

```bash
pnpm install
pnpm dev
```

Приложение запустится на [http://localhost:3000](http://localhost:3000).

## Переменные окружения

Опционально создайте файл `.env.local` в корне проекта:

```env
ACCESS_TOKEN_TTL_MINS=5
REFRESH_TOKEN_TTL_MINS=30
```

| Переменная               | Описание                          | По умолчанию |
| ------------------------ | --------------------------------- | ------------ |
| `ACCESS_TOKEN_TTL_MINS`  | Время жизни access-токена (мин.)  | `5`          |
| `REFRESH_TOKEN_TTL_MINS` | Время жизни refresh-токена (мин.) | `30`         |

Если файл `.env.local` не создан, используются значения по умолчанию.
