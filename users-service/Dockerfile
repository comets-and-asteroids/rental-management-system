# Базовый образ
FROM node:18

# Установка рабочего каталога
WORKDIR .

# Копирование package.json и установка зависимостей
COPY package*.json ./
RUN npm install

# Копирование исходного кода
COPY . .

# Открытие порта
EXPOSE 3000

# Запуск сервиса
CMD ["npm", "start"]
