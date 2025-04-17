// articlesController.ts
import { Request, Response } from 'express';
import { Article, articleInputSchema, articleOutputSchema } from '../models/article.model';
import { articles } from '../mock/article.mock';

// Controlador de artículos
class ArticleController {
    constructor() {
        this.create = this.create.bind(this);
        this.search = this.search.bind(this);
        this.getAll = this.getAll.bind(this);
    }
    private articles: Article[] = articles;

    public create(req: Request, res: Response): void {
        try {
            const validatedInput = articleInputSchema.parse(req.body);
            const newArticle = new Article(
                Math.random().toString(36).slice(2, 11),
                validatedInput.title,
                validatedInput.content,
                validatedInput.authorId,
                new Date()
            );
            this.articles.push(newArticle);
            const validatedOutput = articleOutputSchema.parse(newArticle);
            res.status(201).json(validatedOutput);
        } catch (err: any) {
            res.status(400).json({ error: err.errors });
        }
    }

    public search(req: Request, res: Response): void {
        try {
            const searchTerm = req.query.searchTerm?.toString() || '';
            if (!searchTerm) {
                res.status(400).json({ message: 'Search term is required' });
            }
            const filteredArticles = this.articles.filter((article) =>
                article.title.toLowerCase().includes(searchTerm.toLowerCase())
            );

            console.log('Filtered Articles:', filteredArticles); // Debugging line
            if (filteredArticles.length === 0) {
                res.status(400).json({ message: 'No articles found' });
            }
            res.status(200).json(filteredArticles);
        } catch (err: any) {
            res.status(400).json({ error: err.errors });
        }
    }

    public getAll(_: Request, res: Response): void {
        try {
            const processedArticles = this.articles.map((article) => ({
                ...article,
                contentLength: article.content.length,
            }));
            res.status(200).json(processedArticles);
        } catch (err: any) {
            res.status(400).json({ error: err.errors });
        }
    }
}

export const articleController = new ArticleController();
