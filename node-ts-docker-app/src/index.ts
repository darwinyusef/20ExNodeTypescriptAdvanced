import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(helmet());
app.use(bodyParser.json());

app.get("/", (_req: Request, res: Response) => {
    res.send("Hola mundo desde Docker + Node + TypeScript 😎");
});

app.get("/pepito", (_req: Request, res: Response) => {
    res.send("Hola pepito how are you?");
});

// Ruta para crear un nuevo usuario
app.post("/user", async (req: Request, res: Response) => {
    const { email, name } = req.body;

    try {
        const user = await prisma.user.create({
            data: {
                email,
                name,
            },
        });

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el usuario" });
    }
});

// Ruta para consultar todos los usuarios
app.get("/users", async (_req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los usuarios" });
    }
});


app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
