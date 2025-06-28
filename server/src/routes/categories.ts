// server/routes/categories.ts
import { Request, Response } from "express";
import { Router } from 'express';
import { db } from '../db.js'; 
import { categories, products } from '../schema.js';


export const dbCategoriesRouter = Router();

// ✅ GET /api/categories - fetch all categories
dbCategoriesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const allCategories = await db.select().from(categories);
    res.json(allCategories);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ✅ GET /api/categories/:slug - fetch a category by slug with its products
dbCategoriesRouter.get('/:slug', async (req:  Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    // Get the category by slug
    const category = await db.query.categories.findFirst({
      where: (cat, { eq }) => eq(cat.slug, slug),
    });

    if (!category) {
       res.status(404).json({ message: 'Category not found' });
       return;
    }

    // Get all products under this category
    const categoryProducts = await db.query.products.findMany({
      where: (prod, { eq }) => eq(prod.categoryId, category.id),
    });

    // Return combined result
    res.json({
      ...category,
      products: categoryProducts,
    });
  } catch (error) {
    console.error(`Failed to fetch category '${req.params.slug}':`, error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
