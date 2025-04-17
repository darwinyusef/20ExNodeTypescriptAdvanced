import { z } from 'zod';

export class Article {
    constructor(
        public id: string,
        public title: string,
        public content: string,
        public authorId: string,
        public createdAt: Date
    ) { }
}

// Aqui deberíamos definir el esquema de validación de Zod para los artículos
// y los filtros de entrada y salida. Esto es un ejemplo básico, puedes ajustarlo según tus necesidades.
// pero se va a dejar así para que lo veas como ejemplo de cómo se puede hacer

// Filtro de entrada con Zod (Validación del cuerpo de la solicitud)
export const articleInputSchema = z.object({
    title: z.string().min(1, 'Title is required'),  // Título no vacío
    content: z.string().min(10, 'Content must be at least 10 characters long'),  // Contenido mínimo de 10 caracteres
    authorId: z.string().uuid('Invalid author ID format'),  // ID del autor debe ser un UUID válido
});


// Filtro de salida con Zod (Estructura del artículo que devolvemos al cliente)
export const articleOutputSchema = z.object({
    id: z.string().uuid('Invalid ID format'),
    title: z.string(),
    content: z.string(),
    authorId: z.string(),
    createdAt: z.date(),
});

// Filtro con expresiones regulares validado con Zod
export const titleRegexSchema = z.string().regex(/^[a-zA-Z0-9 ]+$/, 'Title can only contain alphanumeric characters and spaces');

// Mapeo y procesamiento validado con Zod
export const articlesMapSchema = z.array(
    z.object({
        id: z.string().uuid('Invalid article ID format'),
        title: z.string(),
        content: z.string(),
        authorId: z.string(),
        createdAt: z.date(),
    })
);

// Filtro con `filter` para buscar dentro de un map algo, validado con Zod
export const articleSearchSchema = z.object({
    searchTerm: z.string().min(1, 'Search term must not be empty'),
});