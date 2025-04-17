// src/monitoring/metrics.ts
import client from 'prom-client';
import express, { Request, Response, Router } from 'express';

// Crea un registro de métricas
const register = new client.Registry();

// Habilita recolectores default: CPU, memoria, etc.
client.collectDefaultMetrics({ register });

// Métrica personalizada: tiempo de respuesta por ruta
const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duración de requests en ms',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [50, 100, 200, 300, 400, 500, 1000],
});

register.registerMetric(httpRequestDurationMicroseconds);

// Middleware para medir cada request
export function metricsMiddleware(req: Request, res: Response, next: () => void) {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        httpRequestDurationMicroseconds
            .labels(req.method, req.route?.path || req.path, res.statusCode.toString())
            .observe(duration);
    });

    next();
}

export const metricsRouter = Router();
// Endpoint para Prometheus
metricsRouter.get('/metrics', async (_: Request, res: Response) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});