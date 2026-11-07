
FROM node:26

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN mkdir -p uploads

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]
