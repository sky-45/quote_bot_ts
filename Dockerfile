# FISRT STAGE FOR BUILDING
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy project files
COPY . .

# Build TypeScript
RUN npm run compile

# Second stage for productions
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/dist ./dist

ARG MONGO_CONNECTION
ENV MONGO_CONNECTION $MONGO_CONNECTION

ARG DISCORD_TOKEN
ENV DISCORD_TOKEN $DISCORD_TOKEN

ARG URL_JOKE_API
ENV URL_JOKE_API $URL_JOKE_API

ARG CLIENT_ID
ENV CLIENT_ID $CLIENT_ID

ARG CLIENT_SECRET
ENV CLIENT_SECRET $CLIENT_SECRET



RUN apk add --no-cache tzdata
ENV TZ America/Lima


RUN npm install

EXPOSE 3000

CMD ["node", "--import=specifier-resolution-node/register", "dist/index.js"]

