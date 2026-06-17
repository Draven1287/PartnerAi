FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8787

# Install production deps. (No package-lock.json shipped, so use npm install.)
COPY package.json ./
RUN npm install --omit=dev

# App source (verbatim from the Claude Design backend export).
COPY server.js schema.sql make-admin.sql ./

RUN addgroup -S learningai \
  && adduser -S learningai -G learningai \
  && chown -R learningai:learningai /app

USER learningai

EXPOSE 8787

CMD ["node", "server.js"]
