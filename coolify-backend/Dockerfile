FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8787
ENV DATA_FILE=/app/data/minutes.json

COPY package.json ./
RUN npm install --omit=dev

COPY server.mjs db.mjs curriculum-seed.json ./

RUN mkdir -p /app/data \
  && addgroup -S learningai \
  && adduser -S learningai -G learningai \
  && chown -R learningai:learningai /app

USER learningai

EXPOSE 8787

CMD ["node", "server.mjs"]
