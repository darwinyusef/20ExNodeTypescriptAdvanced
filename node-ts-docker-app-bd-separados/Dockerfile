# Base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the code
COPY . .

# Compile TypeScript (opcional si solo usas ts-node-dev)
RUN npm run build

# Expose app port
EXPOSE 3000

# Start app
CMD ["npm", "run", "dev"]
