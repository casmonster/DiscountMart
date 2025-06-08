// server/routes/categories.ts

import { Router } from 'express';
import { db } from '../db';
import { categories } from '../schema';

export const dbCategoriesRouter = Router();

dbCategoriesRouter.get('/', async (req, res) => {
  const allCategories = await db.select().from(categories);
  res.json(allCategories);
});
