FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force
RUN npm install

COPY . .

RUN npm run build

FROM node:22-alpine

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["sh", "-c", "sleep 15 && npm run start:prod"]
