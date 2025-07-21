# Step 1: Set up Node.js image
FROM node:18

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and install dependencies
COPY package.json ./
RUN npm install
RUN npm install -g sequelize-cli

# Step 5: Rebuild sqlite3 to ensure native bindings are correct

# Step 6: Create directory for SQLite database
RUN mkdir -p /app/data

# Step 7: Copy the rest of the application code
COPY . .

# Step 8: Expose the app port
EXPOSE 3000

# Step 9: Run the app
CMD ["node", "server.js"]
