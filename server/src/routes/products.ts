import { Router, Request, Response} from 'express';
import { db } from '../db.js';
import { products, categories } from '../schema.js';
import { eq, desc } from 'drizzle-orm';

export const dbProductsRouter = Router();

// GET all products
dbProductsRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const allProducts = await db.select().from(products);
    res.json(allProducts);
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET newest 6 products
dbProductsRouter.get('/new', async (_req: Request, res: Response) => {
  try {
    const newProducts = await db
      .select()
      .from(products)
      .orderBy(desc(products.createdAt))
      .limit(6);
    res.json(newProducts);
  } catch (error) {
    console.error("Error fetching new products:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET featured products (limit 6)
dbProductsRouter.get('/featured', async (_req: Request, res: Response) => {
  try {
    const featuredProducts = await db
      .select()
      .from(products)
      .where(eq(products.isFeatured, true))
      .limit(6);
    res.json(featuredProducts);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET products by category slug
dbProductsRouter.get(
  '/category/:slug',
  async (req: Request<{ slug: string }>, res: Response): Promise<void> => {
    try {
      const { slug } = req.params;

      const category = await db.query.categories.findFirst({
        where: (cat, { eq }) => eq(cat.slug, slug),
      });

      if (!category) {
         res.status(404).json({ error: 'Category not found' });
          return;
      }

      const productsInCategory = await db
        .select()
        .from(products)
        .where(eq(products.categoryId, category.id));

      res.json({
        category,
        products: productsInCategory,
      });
    } catch (error) {
      console.error("Error fetching products by category slug:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET product by slug with category joined
dbProductsRouter.get('/:slug', async (req: Request<{ slug: string }>, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const product = await db.query.products.findFirst({
      where: (prod, { eq }) => eq(prod.slug, slug),
    });

    if (!product) {
       res.status(404).json({ error: 'Product not found' });
        return;
    }

    const category = await db.query.categories.findFirst({
      where: (cat, { eq }) => eq(cat.id, product.categoryId),
    });

    res.json({
      ...product,
      category,
    });
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
