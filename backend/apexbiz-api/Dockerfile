FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY prisma ./prisma

RUN if [ -d prisma ]; then npx prisma generate; fi

COPY . .

RUN npm run build

EXPOSE 3000

CMD sh -c "if [ -d prisma ]; then npx prisma db push; fi && npm run start:prod"
