@echo off
REM Step 1: Build Docker containers
echo Building Docker containers...
docker-compose build

REM Step 2: Run migrations in the Docker container
echo Running migrations...
docker-compose run --rm app npx sequelize-cli db:migrate

REM Step 3: Run tests in the Docker container
echo Running unit tests...
docker-compose run --rm app npm test

REM Step 4: Tear down and remove containers
echo Cleaning up and removing containers...
docker-compose down

