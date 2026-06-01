FROM node:24-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8787
ENV DATA_FILE=/app/data/minutes.json
ENV DB_FILE=/app/data/learning-ai.sqlite

COPY package.json ./
COPY server.mjs store.mjs ./

RUN mkdir -p /app/data \
  && addgroup -S learningai \
  && adduser -S learningai -G learningai \
  && chown -R learningai:learningai /app

USER learningai

EXPOSE 8787

CMD ["node", "server.mjs"]
