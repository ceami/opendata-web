FROM node:20

RUN npm install -g pnpm

WORKDIR /app/

COPY package.json .
COPY . .

RUN pnpm install

CMD ["pnpm","run","start"]