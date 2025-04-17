import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import statusMonitor from 'express-status-monitor';
import { metricsMiddleware, metricsRouter } from './config/metrics';
import multer from 'multer';
import { config } from 'dotenv';
import path from 'path';
import { applySecurityMiddleware } from "./config/securityMiddleware";
import { storage } from "./config/multer_config";
import routerArticles from "./uses-cases/articles";
import { articleController } from "./uses-cases/articles.poo";
// Importa la configuración de seguridad
// Detecta el entorno desde una variable de entorno global
const envFile = process.env.ENV === 'dev' ? '.env.dev' : '.env.local';
// Middlewares de seguridad
config({ path: envFile });



console.log('Usando env:', envFile);
const app = express();
app.use(statusMonitor({
    title: 'Monitor API AQUICREAMOS',
    path: '/status',
    spans: [
        { interval: 1, retention: 60 },   // cada segundo por 1 min
        { interval: 5, retention: 60 },   // cada 5s por 5 min
        { interval: 15, retention: 60 }   // cada 15s por 15 min
    ],
    chartVisibility: {
        cpu: true,
        mem: true,
        load: true,
        responseTime: true,
        rps: true,
        statusCodes: true
    },
}));


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use(metricsMiddleware); // Aplica medición
app.use(metricsRouter);     // Expone /metrics
// Sirve archivos subidos desde la carpeta 'uploads'
applySecurityMiddleware(app);
const upload = multer({ storage });

app.use(bodyParser.json());

// Usar las rutas de articles en la aplicación
app.use('/articles', routerArticles);
app.post('/acreate', articleController.create);
app.get('/asearch', articleController.search);
app.get('/agetAll', articleController.getAll);

app.get("/", (req: Request, res: Response) => {
    res.send("Hola Mundo!");
});

/*

*/
app.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.file);
    res.send('File uploaded');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Servidor corriendo en http://localhost:" + port);
});
