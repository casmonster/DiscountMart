import "dotenv/config";
import { db } from "./db";
import { categories, products, users, orders, orderItems,cartItems, type InsertProduct, } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";


// Helper to generate slugs
const makeSlug = (name: string): string =>
  name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

const now = () => new Date();

const demoCategories = [
  {
    name: "Clothing",
    slug: makeSlug("Clothing"),
    imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    createdAt: now(),
  },
  {
    name: "Tableware",
    slug: makeSlug("Tableware"),
    imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    createdAt: now(),
  },
  {
    name: "Kitchen",
    slug: makeSlug("Kitchen"),
    imageUrl: "https://images.unsplash.com/photo-1565183928294-7063f23ce0f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    createdAt: now(),
  },
  {
    name: "Home Decor",
    slug: makeSlug("Home Decor"),
    imageUrl: "https://images.unsplash.com/photo-1567016432779-094069958ea5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    createdAt: now(),
  },
];

const rawProducts = [
   {
    name: "Blue Linen Shirt",
    slug: "blue-linen-shirt",
    description: "Comfortable blue linen shirt perfect for summer days.",
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    price: 49.99,
    discountPrice: 29.99,
    categorySlug: "clothing",
    inStock: true,
    stockLevel: 60,
    isNew: false,
    isFeatured: true,
    setPieces: 1,
    unitType: "piece",
  },
  {
    name: "Knit Sweater",
    slug: "knit-sweater",
    description: "Warm and cozy knit sweater for cold winter days.",
    imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    price: 50.99,
    discountPrice: 35.99,
    categorySlug: "clothing",
    inStock: true,
    stockLevel: 60,
    isNew: false,
    isFeatured: true,
    setPieces: 1,
    unitType: "piece",
    },
  {
    name: "Ceramic Dinner Plate",
    slug: "ceramic-dinner-plate",
    description: "Locally made ceramic plate, ideal for modern table settings.",
    price: 54.99,
    discountPrice: 49.99,
    imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    categorySlug: "tableware",
    isNew: false,
    stockLevel: 100,
    inStock: true,
    isFeatured: true,
    setPieces: 12,
    unitType: "set",
  },
  {
    name: "Crystal Glass Set",
    slug: "crystal-glass-set",
    description: "Elegant crystal glass set for your special occasions.",
    imageUrl:"https://images.unsplash.com/photo-1589365278144-c9e705f843ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    price: 29.99,
    discountPrice: null,
    categorySlug: "tableware",
    inStock: true,
    stockLevel: 100,
    isNew: true,
    isFeatured: false,
    setPieces: 6,
    unitType: "set",
  },
  {
    name: "Premium Cooking Pot Set",
    slug: "premium-cooking-pot-set",
    description:"High-quality stainless steel cooking pot set for all your kitchen needs.",
    imageUrl: "https://images.pexels.com/photos/6874235/pexels-photo-6874235.jpeg?auto=compress&cs=tinysrgb&w=500",
    price: 89.99,
    discountPrice: 69.99,
    categorySlug: "kitchen",
    inStock: true,
    stockLevel: 90,
    isNew: false,
    isFeatured: false,
    setPieces: 5,
     unitType: "set",
  },
  {
    name: "Glass Drinkware Collection",
    slug: "glass-drinkware-collection",
    description:"Elegant set of drinking glasses including water, wine, and cocktail glasses.",
    imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    price: 39.99,
    discountPrice: null,
    categorySlug:"kitchen",
    inStock: true,
    stockLevel: 200,
    isNew: true,
    isFeatured: false,
    setPieces: 8,
    unitType: "set",
  },
  {
    name: "Modern Lamp",
    slug: "modern-lamp",
    description: "Stylish modern lamp to light up your living space.",
    imageUrl:"https://images.pexels.com/photos/6970077/pexels-photo-6970077.jpeg?auto=compress&cs=tinysrgb&w=500",
    price: 49.99,
    discountPrice: 24.99,
    categorySlug: "home-decor",
    inStock: true,
    stockLevel: 100,
    isNew: false,
    isFeatured: true,
    setPieces: 1,
    unitType: "piece",
  },
  {
    name: "Wall Art Canvas Set",
    slug: "wall-art-canvas-set",
    description: "Modern abstract wall art canvas set of three pieces.",
    imageUrl:"https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    price: 89.99,
    discountPrice: 69.99,
    categorySlug: "home-decor",
    isNew: true,
    stockLevel: 50,
    inStock: true,
    isFeatured: true,
    setPieces: 3,
    unitType: "set",
  },
   
   {
    name: "Wool Scarf",
    slug: "wool-scarf",
    description: "Soft wool scarf to keep you warm during the winter.",
    imageUrl:"https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    price: 19.99,
    discountPrice: null,
    categorySlug: "clothing",
    inStock: true,
    stockLevel: 70,
    isNew: true,
    isFeatured: false,
    setPieces: 1,
     unitType: "piece",
  },
  {
    name: "Denim Jacket",
    slug: "denim-jacket",
    description: "Classic denim jacket for a timeless casual look.",
    imageUrl:"https://images.unsplash.com/photo-1544022613-e87ca75a784a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    price: 79.99,
    discountPrice: 59.99,
    categorySlug: "clothing",
    inStock: true,
    stockLevel: 50,
    isNew: false,
    isFeatured: true,
    setPieces: 1,
    unitType: "piece",
  },
  {
    name: "Cotton T-Shirt",
    slug: "cotton-t-shirt",
    description: "Premium cotton t-shirt for everyday comfort.",
    imageUrl:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    price: 24.99,
    discountPrice: null,
    categorySlug: "clothing",
    inStock: true,
    stockLevel: 200,
    isNew: true,
    isFeatured: false,
    setPieces: 2,
    unitType: "pack",
  },
  {
        name: "Leather Belt",
        slug: "leather-belt",
        description: "Genuine leather belt with classic buckle design.",
        imageUrl:"https://images.unsplash.com/photo-1624222247344-550fb60583dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        price: 39.99,
        discountPrice: 29.99,
        categorySlug: "clothing",
        inStock: true,
        stockLevel: 150,
        isNew: false,
        isFeatured: true,
        setPieces: 1,
        unitType: "piece",
      },
      {
        name: "Casual Pants",
        slug: "casual-pants",
        description: "Comfortable casual pants for relaxed style.",
        imageUrl:"https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        price: 64.99,
        discountPrice: 49.99,
        categorySlug: "clothing",
        inStock: true,
        stockLevel: 60,
        isNew: false,
        isFeatured: true,
        setPieces: 1,
        unitType: "piece",
      },
      {
        name: "Winter Coat",
        slug: "winter-coat",
        description: "Warm winter coat for cold weather protection.",
        imageUrl:"https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        price: 129.99,
        discountPrice: null,
        categorySlug: "clothing",
        inStock: true,
        stockLevel: 50,
        isNew: true,
        isFeatured: false,
        setPieces: 1,
        unitType: "piece",
      },
      {    
        name: "Porcelain Tea Set",
        slug: "porcelain-tea-set",
        description: "Fine porcelain tea set with elegant floral design.",
        imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        price: 79.99,
        discountPrice: 59.99,
        categorySlug: "tableware",
        inStock: true,
        stockLevel: 80,
        isNew: false,
        isFeatured:true,
        setPieces: 8,
        unitType: "set",
      },
      {
        name: "Stainless Steel Cutlery Set",
        slug: "stainless-steel-cutlery",
        description: "Professional-grade stainless steel cutlery set.",
        imageUrl:"https://images.pexels.com/photos/175765/pexels-photo-175765.jpeg?auto=compress&cs=tinysrgb&w=500",
        price: 89.99,
        discountPrice: 69.99,
        categorySlug: "tableware",
        inStock: true,
        stockLevel: 80,
        isNew: false,
        isFeatured: true,
        setPieces: 16,
        unitType: "set",
      },
      {
        name: "Bamboo Serving Tray",
        slug: "bamboo-serving-tray",
        description: "Eco-friendly bamboo serving tray for entertaining.",
        imageUrl:"https://images.unsplash.com/photo-1584473457406-6240486418e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        price: 34.99,
        discountPrice: null,
        categorySlug: "tableware",
        inStock: true,
        stockLevel: 200,
        isNew: true,
        isFeatured: false,
        setPieces: 1,
        unitType: "piece",
      },
      {
        name: "Wine Glass Collection",
        slug: "wine-glass-collection",
        description: "Professional wine glass collection for connoisseurs.",
        imageUrl:"https://images.pexels.com/photos/12268571/pexels-photo-12268571.jpeg?auto=compress&cs=tinysrgb&w=500",
        price: 54.99,
        discountPrice: 39.99,
        categorySlug: "tableware",
        inStock: true,
        stockLevel: 100,
        isNew: false,
        isFeatured: true,
        setPieces: 4,
        unitType: "set",

      },
      { 
        name: "Ceramic Plate Set",
        slug: "ceramic-plate-set",
        description:"Beautiful ceramic plates for everyday use or special occasions.",
        imageUrl:"https://images.pexels.com/photos/6270663/pexels-photo-6270663.jpeg?auto=compress&cs=tinysrgb&w=500",
        price: 49.99,
        discountPrice: 34.99,
        categorySlug:"kitchen",
        inStock: true,
        stockLevel: 400,
        isNew: false,
        isFeatured: true,
        setPieces: 6,
        unitType: "set",
      },
      {
        name: "Non-Stick Pan Set",
        slug: "non-stick-pan-set",
        description: "Professional non-stick pan set for perfect cooking.",
        imageUrl:"https://images.pexels.com/photos/7719169/pexels-photo-7719169.jpeg?auto=compress&cs=tinysrgb&w=500",
        price: 119.99,
        discountPrice: 89.99,
        categorySlug:"kitchen",
        inStock: true,
        stockLevel: 300,
        isNew: false,
        isFeatured: true,
        setPieces: 3,
        unitType: "set",
      },
      {
        name: "Kitchen Knife Set",
        slug: "kitchen-knife-set",
        description: "Professional chef knife set with wooden block.",
        imageUrl:"https://images.unsplash.com/photo-1593618998160-e34014e67546?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        price: 149.99,
        discountPrice: null,
        categorySlug:"kitchen",
        inStock: true,
        stockLevel: 80,
        isNew: true,
        isFeatured: false,
        setPieces: 7,
        unitType: "set",
      },
      {
        name: "Wooden Cutting Board",
        slug: "wooden-cutting-board",
        description: "Large bamboo cutting board with groove design.",
        imageUrl:"https://images.pexels.com/photos/32445973/pexels-photo-32445973.jpeg?auto=compress&cs=tinysrgb&w=500",
        price: 29.99,
        discountPrice: 19.99,
        categorySlug:"kitchen",
        inStock: true,
        stockLevel: 100,
        isNew: false,
        isFeatured: true,
        setPieces: 1,
        unitType: "piece",
      },
      {
        name: "Electric Coffee Maker",
        slug: "electric-coffee-maker",
        description: "Programmable coffee maker for perfect morning brew.",
        imageUrl:"https://images.pexels.com/photos/30689451/pexels-photo-30689451.jpeg?auto=compress&cs=tinysrgb&w=500",
        price: 179.99,
        discountPrice: null,
        categorySlug:"kitchen",
        inStock: true,
        stockLevel: 60,
        isNew: true,
        isFeatured: false,
        setPieces: 1,
        unitType: "piece",
      },
      {
        name: "Ceramic Vase Set",
        slug: "ceramic-vase-set",
        description: "Beautiful ceramic vase set for your home decor.",
        imageUrl: "https://images.pexels.com/photos/8989514/pexels-photo-8989514.jpeg?auto=compress&cs=tinysrgb&w=500",
        price: 34.99,
        discountPrice: null,
        categorySlug: "home-decor",
        inStock: true,
        stockLevel: 70,
        isNew: true,
        isFeatured: false,
        setPieces: 3,
        unitType: "set",
      },
      {
        name: "Cotton Throw Blanket",
        slug: "cotton-throw-blanket",
        description: "Soft cotton throw blanket for your cozy evenings.",
        imageUrl: "https://images.pexels.com/photos/8526713/pexels-photo-8526713.jpeg?auto=compress&cs=tinysrgb&w=500",
        price: 24.99,
        discountPrice: null,
        categorySlug: "home-decor",
        inStock: true,
        stockLevel: 50,
        isNew: true,
        isFeatured: false,
        setPieces: 1,
        unitType: "piece",
      },
      {
        name: "Decorative Mirror",
        slug: "decorative-mirror",
        description: "Round decorative mirror with golden frame.",
        imageUrl:"https://images.pexels.com/photos/2203743/pexels-photo-2203743.jpeg?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        price: 79.99,
        discountPrice: 59.99,
        categorySlug: "home-decor",
        inStock: true,
        stockLevel: 200,
        isNew: false,
        isFeatured: true,
        setPieces: 1,
        unitType: "piece",
      },
      {
        name: "Scented Candle Set",
        slug: "scented-candle-set",
        description: "Luxury scented candle set with relaxing fragrances.",
        imageUrl: "https://images.pexels.com/photos/20419182/pexels-photo-20419182.jpeg?auto=compress&cs=tinysrgb&w=500",
        price: 44.99,
        discountPrice: null,
        categorySlug: "home-decor",
        inStock: true,
        stockLevel: 100,
        isNew: true,
        isFeatured: false,
        setPieces: 4,
        unitType: "set",
      },
      {
        name: "Indoor Plant Collection",
        slug: "indoor-plant-collection",
        description: "Set of three low-maintenance indoor plants with pots.",
        imageUrl: "https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg?auto=compress&cs=tinysrgb&w=500",
        price: 54.99,
        discountPrice: null,
        categorySlug: "home-decor",
        inStock: true,
        stockLevel: 80,
        isNew: true,
        isFeatured: false,
        setPieces: 3,
        unitType: "set",
      }, 
];

// Example users
const rawUsers = [
  {
    name: "Alice Doe",
    email: "alice@example.com",
    password: "alicepass123", // plaintext before hashing
    phone: "+250788528067",
  },
  {
    name: "Bob Smith",
    email: "bob@example.com",
    password: "bobsecure456",
    phone: "+250788528068",
  },
];
async function seed() {
  console.log("🌱 Seeding database...");
  
  await db.delete(cartItems);
  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(products);
  await db.delete(categories);
  await db.delete(users);
  
  // Insert categories
  await db.insert(categories).values(demoCategories);
  console.log("✅ Categories seeded");

  // Fetch category IDs dynamically
  const categoryRecords = await db.select().from(categories);
  const categoryMap = Object.fromEntries(
    categoryRecords.map((cat) => [cat.slug, cat.id])
  );

  // Insert products with resolved categoryId
  const productData = rawProducts.map((prod) => ({
    ...prod,
    categoryId: categoryMap[prod.categorySlug],
    createdAt: now(),
  }));

  await db.insert(products).values(productData);
  console.log("✅ Products seeded");

  // Hash user passwords and insert
  const userData = await Promise.all(
    rawUsers.map(async (u) => ({
      name: u.name,
      email: u.email,
      phone: u.phone,
      password: await bcrypt.hash(u.password, 10),
      createdAt: now(),
    }))
  );
  await db.insert(users).values(userData)

  console.log("✅ Users seeded");

  // Simulate order for first user
  const insertedUsers = await db.select().from(users);
  const insertedProducts = await db.select().from(products);

  const exampleOrder = {
    userId: insertedUsers[0].id,
    cartId: "example-cart-id", 
    customerName: insertedUsers[0].name, // Add customer name
    customerEmail: insertedUsers[0].email, // Add customer email
    customerPhone: insertedUsers[0].phone, // Add customer phone
    status: "pending",
    totalAmount: insertedProducts[0].price + insertedProducts[1].price,
    createdAt: now(),
  };
  const [order] = await db.insert(orders).values(exampleOrder).returning();

  const orderItemsData = [
    {
      orderId: order.id,
      productId: insertedProducts[0].id,
      quantity: 1,
      price: insertedProducts[0].price,
      createdAt: now(),
    },
    {
      orderId: order.id,
      productId: insertedProducts[1].id,
      quantity: 2,
      price: insertedProducts[1].price,
      createdAt: now(),
    },
  ];
  await db.insert(orderItems).values(orderItemsData);
  console.log("✅ Orders and order items seeded");

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed", err);
  process.exit(1);
});