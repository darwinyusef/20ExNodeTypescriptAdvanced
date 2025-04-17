
# Guía paso a paso para configurar Node.js + TypeScript + Docker con Prisma y PostgreSQL

## 1. Crear la estructura de carpetas

Primero, crea una carpeta base:

```bash
mkdir node-ts-docker-app && cd node-ts-docker-app
```

La estructura de carpetas debe verse así:

```
node-ts-docker-app/
│
├── prisma/
│   └── schema.prisma
│
├── src/
│   └── index.ts
│
├── .dockerignore
├── .env
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
```

## 2. Crear `package.json`

Crea el archivo `package.json` con:

```bash
npm init -y
```

## 3. Instalar las dependencias

### Dependencias principales:

```bash
npm install express body-parser helmet zod jose
```

### Dependencias de desarrollo:

```bash
npm install -D typescript ts-node-dev @types/express @types/node @types/body-parser @types/helmet nodemon prisma
```

## 4. Configurar `tsconfig.json`

Ejecuta:

```bash
npx tsc --init
```

Luego reemplaza el contenido de `tsconfig.json` por lo siguiente:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

## 5. Crear el archivo `src/index.ts`

```ts
import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";

const app = express();

app.use(helmet());
app.use(bodyParser.json());

app.get("/", (_req, res) => {
  res.send("Hola mundo desde Docker + Node + TypeScript 😎");
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
```

## 6. Crear el archivo `Dockerfile`

```Dockerfile
# Base image
FROM node:20

# Set working directory
WORKDIR /app

# Copia dependencias
COPY package*.json ./
RUN npm install

# Copia el resto del código
COPY . .

# Compila TypeScript
RUN npm run build

# Exponer el puerto
EXPOSE 3000

# Comando para desarrollo
CMD ["npm", "run", "dev"]
```

## 7. Crear el archivo `.dockerignore`

```txt
node_modules
dist
.env
```

## 8. Configurar `docker-compose.yml`

```yaml
version: '3.9'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    env_file:
      - .env
    depends_on:
      - db
    command: npm run dev

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: mydb
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  pgdata:
```

## 9. Crear el archivo `.env`

```env
DATABASE_URL="postgresql://postgres:postgres@db:5432/mydb"
```

## 10. Configurar Prisma

### Inicializar Prisma

```bash
npx prisma init
```

### Configurar el archivo `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
}
```

## 11. Configurar los scripts en `package.json`

Agrega los siguientes scripts en el `package.json`:

```json
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js",
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate dev"
}
```

## 12. Levantar los contenedores de Docker

Primero, detén cualquier contenedor existente:

```bash
docker-compose down
```

Ahora, levanta los contenedores en segundo plano:

```bash
docker-compose up -d
```

Verifica los logs del contenedor de PostgreSQL:

```bash
docker-compose logs db
```

Ejecuta un ping a la base de datos para verificar la conexión:

```bash
docker-compose exec app ping db
```

Realiza la migración con Prisma:

```bash
docker-compose exec app npx prisma migrate dev --name init
```

Genera el cliente Prisma:

```bash
docker-compose exec app npx prisma generate
```

Accede a PostgreSQL para revisar la base de datos:

```bash
docker-compose exec db psql -U postgres -d pruebas
\dt
```
