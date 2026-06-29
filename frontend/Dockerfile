FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .

ENV NEXT_PUBLIC_API_URL=http://localhost:3000

RUN npm run build || true

EXPOSE 3001

CMD sh -c "npm run start -- --hostname 0.0.0.0 -p 3001 || npm run start -- --host 0.0.0.0 || npm run dev -- --hostname 0.0.0.0 -p 3001 || npm run dev -- --host 0.0.0.0"
