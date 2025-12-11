# 1) Stage для сборки React-приложения
FROM node:18-alpine AS build

WORKDIR /app

# сначала зависимости
COPY package*.json ./
RUN npm install

# потом весь код
COPY . .

# production-сборка (скрипт "build" в package.json)
RUN npm run build

# 2) Stage для запуска — через Nginx
FROM nginx:1.25-alpine

# копируем готовый билд в nginx
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
