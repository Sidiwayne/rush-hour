# Rush Hour Puzzle

## Overview
Rush Hour is a puzzle-solving platform where players move cars on a 6x6 board to free the red car by moving it to the rightmost edge. This project is built as a **NestJS monorepo** with three microservices and uses **Kafka**, **Postgres**, and **Redis** for processing and storage.

## Features
1. **Create and manage game boards**.
2. **Track player moves and compute their quality** (Good/Waste/Blunder).
3. **Automated cleanup of inactive games using cron jobs**.

## Architecture
The project consists of three main microservices:
- **API**: Exposes endpoints for creating and playing games.
- **Consumer**: Listens to Kafka events and computes the minimum steps required to solve the puzzle from the current game state.
- **Cleaner**: Runs every 10 seconds to delete games inactive for more than 5 minutes.

## Tech Stack
- **Backend**: NestJS
- **Message Queue**: Kafka
- **Database**: PostgreSQL
- **Cache**: Redis
- **Monitoring Kafka**: [Provectus Kafka UI](https://github.com/provectus/kafka-ui) for visualizing Kafka topics and messages.
- **Monitoring Redis**: [Redis Insight](https://github.com/RedisInsight/RedisInsight) for visualizing Kafka topics and messages.
- **Containerization**: Docker

## Endpoints
- **GET /__internal__/heartbeat**: Health check endpoint.
- **POST /create-board**: Create a new game board.
- **POST /start-game/{boardId}**: Start a game for a given board.
- **GET /game/{gameId}**: Fetch the current state of a game.
- **PUT /move-car/{gameId}**: Move a car on the board. Determines if the move is good, wasteful, or a blunder.
- **GET /docs**: Access Swagger API documentation.

## Usage
### Docker Setup
1. Ensure **Docker** and **Docker Compose** are installed.
2. Build and start the containers:
   ```bash
   docker-compose up --build
   ```
3. Access the services:
   - API: `http://localhost:3000`
   - Swagger/OpenAPI: `http://localhost:3000/docs`
   - Kafka UI: `http://localhost:9999`
   - Redis Insight: `http://localhost:5540`
   - Postgres: Exposed on port `5434`
   - Redis: Exposed on port `6379`

### Environment Configuration
Each service can be configured with the following environment variables:
- **API Service**:
  - `DATABASE_URL`: Connection string for Postgres.
  - `KAFKA_BROKER`: Kafka broker URL.
  - `REDIS_HOST`: Redis host.
  - `REDIS_PORT`: Redis port.
- **Consumer**:
  - `KAFKA_BROKER`: Kafka broker URL.
  - `REDIS_HOST`: Redis host.
  - `REDIS_PORT`: Redis port.
- **Cleaner**:
  - `REDIS_HOST`: Redis host.
  - `REDIS_PORT`: Redis port.
  - `ITEM_MAX_AGE`: Time in minutes after which inactive games are deleted.

### Kafka Topics
- **car-moved**: Used to notify the consumer of player moves. Created automatically on startup.

### Game Workflow
1. **Create a Board**: Send a `POST` request to `/create-board` with a 6x6 matrix of integers. The red car is `1`.
2. **Start a Game**: Start a game by calling `POST /start-game/{boardId}`. The game ID will be returned.
3. **Move a Car**: Use `PUT /move-car/{gameId}` to update the board state of the game.
4. **Check Game State**: Fetch the current game state via `GET /game/{gameId}`.