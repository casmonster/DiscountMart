import "dotenv/config";
import { db } from "./db";
import { categories, products } from "./schema";
import { eq } from "drizzle-orm";
import { pathToFileURL } from "url";
import { resolve } from "path";

// Helper to generate slugs
const slugify = (name: string) =>
  name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

const demoCategories = [
  {
    name: "Clothing",
    slug: slugify("Clothing"),
    imageUrl: "https://images.pexels.com/photos/977659/pexels-photo-977659.jpeg",
  },
  {
    name: "Dinnerware",
    slug: slugify("Dinnerware"),
    imageUrl: "https://images.pexels.com/photos/5638742/pexels-photo-5638742.jpeg",
  },
  {
    name: "Kitchen Tools",
    slug: slugify("Kitchen Tools"),
    imageUrl: "https://images.pexels.com/photos/3952040/pexels-photo-3952040.jpeg",
  },
  {
    name: "Home Decor",
    slug: slugify("Home Decor"),
    imageUrl: "https://images.pexels.com/photos/1409937/pexels-photo-1409937.jpeg",
  },
];

const rawProducts = [
  {
    name: "Handwoven Basket",
    slug: "handwoven-basket",
    description: "Beautifully crafted Rwandan basket made from natural sisal and sweetgrass.",
    price: 15000,
    discountPrice: null,
    imageUrl: "https://images.pexels.com/photos/1409937/pexels-photo-1409937.jpeg",
    categoryId: 4,
    isNew: true,
    stockLevel: 50,
    inStock: true,
    isFeatured: null,
  },
  {
    name: "Ceramic Dinner Plate",
    slug: "ceramic-dinner-plate",
    description: "Locally made ceramic plate, ideal for modern table settings.",
    price: 12000,
    discountPrice: 10000,
    imageUrl: "https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg",
    categoryId: 2,
    isNew: false,
    stockLevel: 100,
    inStock: true,
    isFeatured: null,
  },
  {
    name: "Woven Wall Art",
    slug: "woven-wall-art",
    description: "Traditional wall decor made from banana leaves and raffia.",
    price: 20000,
    discountPrice: 18000,
    imageUrl: "https://images.pexels.com/photos/1166642/pexels-photo-1166642.jpeg",
    categoryId: 4,
    isNew: true,
    stockLevel: 100,
    inStock: true,
    isFeatured: null,
  },
  {
    name: "Cooking Spoon Set",
    slug: "cooking-spoon-set",
    description: "Hand-carved spoon set made from sustainable hardwood.",
    price: 8000,
    discountPrice: null,
    imageUrl: "https://images.pexels.com/photos/3952040/pexels-photo-3952040.jpeg",
    categoryId: 3,
    isNew: false,
    stockLevel: 60,
    inStock: true,
    isFeatured: null,
  },
  {
    name: "Cotton Wrap Skirt",
    slug: "cotton-wrap-skirt",
    description: "Colorful African print skirt made from 100% cotton fabric.",
    price: 22000,
    discountPrice: 20000,
    imageUrl: "https://images.pexels.com/photos/977659/pexels-photo-977659.jpeg",
    categoryId: 1,
    isNew: true,
    stockLevel: 30,
    inStock: true,
    isFeatured: null,
  },
  {
    name: "Luxury Woven Blanket",
    slug: "luxury-woven-blanket",
    description: "Soft handwoven blanket crafted from local cotton, perfect for cozy evenings.",
    price: 40000,
    discountPrice: 35000,
    imageUrl: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg",
    categoryId: 1,
    isNew: false,
    stockLevel: 50,
    inStock: true,
    isFeatured: null,
  },
  {
    name: "Handcrafted Teak Tray",
    slug: "handcrafted-teak-tray",
    description: "Elegant serving tray made from polished teak wood.",
    price: 25000,
    discountPrice: null,
    imageUrl: "https://images.pexels.com/photos/5946733/pexels-photo-5946733.jpeg",
    categoryId: 3,
    isNew: true,
    stockLevel: 100,
    inStock: true,
    isFeatured: null,
  },
  {
    name: "Gold-Trimmed Ceramic Bowl",
    slug: "gold-ceramic-bowl",
    description: "Luxury bowl with 24k gold trim, fired in small artisan batches.",
    price: 30000,
    discountPrice: 28000,
    imageUrl: "https://images.pexels.com/photos/5638742/pexels-photo-5638742.jpeg",
    categoryId: 2,
    isNew: false,
    stockLevel: 100,
    inStock: true,
    isFeatured: null,
  },
  {
    name: "Rwandan Coffee Gift Box",
    slug: "coffee-gift-box",
    description: "Premium Arabica coffee with handmade cup set — perfect for gifting.",
    price: 35000,
    discountPrice: 30000,
    imageUrl: "https://images.pexels.com/photos/3394654/pexels-photo-3394654.jpeg",
    categoryId: 4,
    isNew: true,
    stockLevel: 60,
    inStock: true,
    isFeatured: null,
  },
];

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear previous data
  await db.delete(products);
  await db.delete(categories);

  // Insert categories first
  await db.insert(categories).values(demoCategories);
  console.log("✅ Seeded categories");

  // Insert products
  await db.insert(products).values(rawProducts);
  console.log("✅ Seeded products");

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed", err);
  process.exit(1);
});
