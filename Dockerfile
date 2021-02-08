from node:latest

ENV NODE_ENV=production

RUN mkdir /app

COPY . /app/
WORKDIR /app

RUN npm install --production

CMD ["node", "index.js"]
