
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install             # incluye @angular/material, cdk, animations
RUN npm install -g @angular/cli@17

COPY . .

EXPOSE 4200
CMD ["ng", "serve", "--host", "0.0.0.0"]
