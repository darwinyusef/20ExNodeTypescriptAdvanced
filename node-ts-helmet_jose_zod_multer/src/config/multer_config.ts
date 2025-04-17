import multer from 'multer';
import path from 'path';
import fs from 'fs';
// Configurar almacenamiento de archivos con multer

export// Configurar almacenamiento de archivos con multer
    const storage = multer.diskStorage({
        destination: (req, file, exit) => {
            const tenantId = req.query.tenantId;
            if (!tenantId) {
                return exit(new Error('tenantId is required'), "Falso generacion");
            }

            // Crear carpeta para el tenantId si no existe
            // const dir = `./uploads/${tenantId}`;
            const dir = `./uploads/tenantId${tenantId}`;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            exit(null, dir); // Carpeta de destino
        },
        filename: (req, file, exit) => {
            // Agregar fecha y extensión al nombre del archivo
            const tenantId = req.body.tenantId;
            const date = new Date().toISOString().replace(/[:.]/g, '-'); // Reemplazar los dos puntos y puntos
            const ext = path.extname(file.originalname); // Extensión del archivo
            const newName = `${tenantId}-${date}${ext}`;

            exit(null, newName); // Nombre final del archivo
        }
    });