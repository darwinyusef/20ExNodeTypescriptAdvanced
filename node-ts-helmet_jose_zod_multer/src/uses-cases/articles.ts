import { Request, Response, Router } from 'express';

import {
    articleInputSchema,
    articleOutputSchema,
    titleRegexSchema,
    articlesMapSchema,
    articleSearchSchema
} from '../models/article.model';
import { articles } from '../mock/article.mock';


const routerArticles = Router();

// Ruta POST para crear un nuevo artículo
routerArticles.post('/create', (req: Request, res: Response) => {
    try {
        const validatedInput = articleInputSchema.parse(req.body); // Validación de entrada con Zod

        // Validación de título con expresiones regulares
        titleRegexSchema.parse(validatedInput.title);

        // Crear artículo con datos validados
        const newArticle = {
            ...validatedInput,
            id: Math.random().toString(36).substr(2, 9),  // Generamos un ID aleatorio
            createdAt: new Date(),
        };

        // Validamos y respondemos con la estructura de salida
        const validatedOutput = articleOutputSchema.parse(newArticle);
        articles.push(validatedOutput);

        res.status(201).json(validatedOutput);
    } catch (err: any) {
        res.status(400).json({ error: err.errors });
    }
});

// Ruta GET para obtener artículos filtrados por un término de búsqueda
routerArticles.get('/search', (req: Request, res: Response) => {
    try {
        const validatedSearch = articleSearchSchema.parse(req.query);  // Validación de entrada para búsqueda

        // Filtrar artículos que contienen el término de búsqueda en el título
        const filteredArticles = articles.filter(article =>
            article.title.toLowerCase().includes(validatedSearch.searchTerm.toLowerCase())
        );

        res.status(200).json(filteredArticles);
    } catch (err: any) {
        res.status(400).json({ error: err.errors });
    }
});


// Ruta GET para obtener todos los artículos procesados en un map
routerArticles.get('/all', (req: Request, res: Response) => {
    try {
        // Validación de artículos con Zod
        const validatedArticles = articlesMapSchema.parse(articles);

        // Procesar artículos en un map (en este caso, solo los estamos validando)
        const processedArticles = validatedArticles.map(article => ({
            ...article,
            contentLength: article.content.length,  // Por ejemplo, añadir longitud del contenido
        }));

        res.status(200).json(processedArticles);
    } catch (err: any) {
        res.status(400).json({ error: err.errors });
    }
});

export default routerArticles;
