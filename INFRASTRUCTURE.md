# Инфраструктура Workfly

## VPS

| Параметр | Значение |
|----------|----------|
| IP | 89.104.71.141 |
| SSH alias | `ssh filmber` |
| OS | Ubuntu |
| RAM | 4 ГБ |
| Swap | 2 ГБ |
| CPU | 2 ядра |
| Диск | 40 ГБ |

## Домены

| Домен | IP | DNS записи |
|-------|-----|------------|
| filmber.online | 89.104.71.141 | A @, A www |
| workfly.online | 89.104.71.141 | A @, A www |

## Порты

| Порт | Сервис |
|------|--------|
| 80 | Nginx (системный) |
| 443 | Nginx SSL (системный) |
| 3000 | filmber (Next.js) — НЕ ТРОГАТЬ |
| 3001 | workfly frontend (Docker) |
| 3002 | workfly backend (Docker) |

## Пути на сервере

| Путь | Назначение |
|------|------------|
| /var/www/filmber | Существующий проект — НЕ ТРОГАТЬ |
| /var/www/workfly | Проект Workfly |
| /etc/nginx/sites-available/filmber | Nginx конфиг filmber |
| /etc/nginx/sites-available/workfly | Nginx конфиг workfly |

## GitHub

| Параметр | Значение |
|----------|----------|
| Репозиторий | https://github.com/dmitrijovsjanik/workfly |
| Branch | main |
| CI/CD | GitHub Actions |

### Repository Secrets

| Secret | Описание |
|--------|----------|
| VPS_HOST | 89.104.71.141 |
| VPS_USER | root |
| VPS_SSH_KEY | SSH ключ (ed25519) для деплоя |

## SSH ключи

Ключ для GitHub Actions деплоя создан на VPS:
- Приватный: `/root/.ssh/workfly_deploy`
- Публичный: `/root/.ssh/workfly_deploy.pub` (добавлен в authorized_keys)

## Docker

Установлен на VPS:
- Docker version 29.1.5
- Docker Compose version v5.0.2

## Важно

- **НЕ ТРОГАТЬ** порт 3000 — используется filmber
- **НЕ ТРОГАТЬ** /var/www/filmber
- **НЕ ТРОГАТЬ** nginx конфиг filmber
- Workfly полностью изолирован в Docker
