import { db } from './src/db';
import { products } from './src/schema'; // adjust path if needed

async function testConnection() {
  try {
    const allProducts = await db.select().from(products).limit(1);
    console.log("✅ Database connected. Sample product:", allProducts);
  } catch (error) {
    console.error("❌ DB connection failed:", error);
  } finally {
    process.exit();
  }
}

testConnection();
