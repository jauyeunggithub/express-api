@echo off

REM Step 1: Build Docker containers (without cache)
echo Building Docker containers (no cache)...
docker-compose build --no-cache

REM Step 2: Start the containers in the background
echo Starting containers...
docker-compose up -d

REM Step 4: Run migrations in the Docker container
echo Running migrations...
docker-compose exec app npx sequelize-cli db:migrate

REM Step 5: Run tests in the Docker container
echo Running unit tests...
docker-compose exec app npm test

REM Step 6: Tear down and remove containers
echo Cleaning up and removing containers...
docker-compose down
