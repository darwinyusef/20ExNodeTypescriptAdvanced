import express, { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma-client/client";
import bodyParser from "body-parser";
import helmet from "helmet";
import multer from 'multer';
import path from 'path';
import { config } from 'dotenv';

// Detecta el entorno desde una variable de entorno global
const envFile = process.env.ENV === 'docker' ? '.env.docker' : '.env.local';
config({ path: envFile });

console.log('Usando env:', envFile);

const app = express();
const prisma = new PrismaClient();

const upload = multer({ dest: 'uploads/' }); 

app.use(helmet());
app.use(bodyParser.json());


app.get("/", (_req: Request, res: Response) => {
    res.send("Hola mundo desde Docker + Node + TypeScript 😎");
});


app.post('/upload', upload.single('file'), (req, res) => {
    console.log('Archivo recibido:', req.file);
    res.send({ message: 'Archivo subido con éxito', file: req.file });
});

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get("/pepito", (_req: Request, res: Response) => {
    res.send("Hola pepito how are you?");
});

// Ruta para crear un nuevo usuario
app.post("/user", async (req: Request, res: Response) => {
    const { email, name, tenantId } = req.body;

    try {
        const user = await prisma.useras.create({
            data: {
                email,
                tenantId,
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
        const users = await prisma.useras.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los usuarios" });
    }
});

app.get("/user/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await prisma.useras.findUnique({
            where: { id: Number(id) },
        });
        res.json({
            email: user?.email
        });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los usuarios" });
    }
});


app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
