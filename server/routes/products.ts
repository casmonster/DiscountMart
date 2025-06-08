// server/routes/products.ts

import { Router } from 'express';
import { db } from '../db';
import { products } from '../schema';
import { eq, desc } from 'drizzle-orm';

export const dbProductsRouter = Router();

dbProductsRouter.get('/', async (req, res) => {
  const allProducts = await db.select().from(products);
  res.json(allProducts);
});

// ➕ Add this
dbProductsRouter.get('/new', async (req, res) => {
  const newProducts = await db
    .select()
    .from(products)
    .orderBy(desc(products.id))
    .limit(6);
  res.json(newProducts);
});

// ➕ And this
dbProductsRouter.get('/featured', async (req, res) => {
  const featuredProducts = await db
    .select()
    .from(products)
    .where(eq(products.isFeatured, true))
    .limit(6);
  res.json(featuredProducts);
});
