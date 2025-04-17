# 🚀 Guía para Desarrollar con Docker + Node.js + TypeScript


## 🐳 1. Crear un archivo `Dockerfile` (sin extensión)

```Dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

Ubícalo en la raíz de tu proyecto y sin extensión.

---

## 🛠️ 2. Crear `docker-compose.yml` para desarrollo

```yaml
version: "3.9"
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
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: mydb
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

---

## 🔁 3. Desarrollo en caliente con `ts-node-dev`

En tu `package.json`:

```json
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
  "build": "tsc"
}
```

---

## 🌍 4. Ver la app en el navegador

1. Corre el proyecto:

```bash
docker-compose up --build
```

2. Abre: [http://localhost:3000](http://localhost:3000)

---

## ✅ Verifica que funcione

En `src/index.ts`:

```ts
import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("Hola mundo desde Docker + Node + TypeScript 😎");
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
```

---

## 🧼 5. Solución a problemas comunes

- **Puerto ocupado:**  
  ```bash
  lsof -i :3000
  kill -9 <PID>
  ```

- **No carga cambios:**  
  Asegúrate de que `volumes` esté configurado correctamente en `docker-compose.yml`.

---

docker-compose exec app nc -zv db 5432