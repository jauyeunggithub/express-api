# Step 1: Set up Node.js image
FROM node:18

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Step 4: Copy the rest of the application code
COPY . .

# Step 5: Expose the app port
EXPOSE 3000

# Step 6: Run the app
CMD ["node", "server.js"]
