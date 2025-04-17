// src/config/securityMiddleware.ts
import { Application } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import helmet from "helmet";
import { helmetConfig } from "./security";
import morgan from 'morgan';
// CORS options
const corsOptions = {
    origin: ['https://aquicreamos.com', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Disposition'],
    credentials: true,
};

// Rate limiter
const apiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutos
    max: 10, // Máximo 100 requests por IP
    message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.',
    standardHeaders: true,
    legacyHeaders: false,
});

export function applySecurityMiddleware(app: Application): void {
    app.use(cors(corsOptions));
    app.use(apiLimiter);
    app.use(helmet(helmetConfig));
    app.use(hpp()); 
    app.use(morgan('dev'));// Previene ataques HTTP Parameter Pollution
}