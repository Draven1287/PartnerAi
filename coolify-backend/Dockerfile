FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV DATA_FILE=/app/data/minutes.json

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY server.mjs db.mjs curriculum-seed.json ./

RUN mkdir -p /app/data \
  && addgroup -S learningai \
  && adduser -S learningai -G learningai \
  && chown -R learningai:learningai /app

USER learningai

EXPOSE 8080

CMD ["node", "server.mjs"]
