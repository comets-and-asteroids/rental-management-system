# Базовый образ для сборки
FROM node:18 AS builder

# Рабочая директория
WORKDIR /app

# Установка зависимостей
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Копирование исходного кода
COPY . .

# Сборка фронтенда
RUN npm run build

# Базовый образ для запуска
FROM node:18

# Установка переменных среды
ENV NODE_ENV=production

# Рабочая директория
WORKDIR /app

# Копирование собранного приложения
COPY --from=builder /app ./

# Установка только production-зависимостей
RUN npm install --only=production --legacy-peer-deps

# Открытие порта
EXPOSE 3000

# Команда запуска
CMD ["npm", "start"]
