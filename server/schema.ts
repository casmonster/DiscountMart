// server/schema.ts

import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z, ZodRawShape} from "zod";
import { relations, sql } from "drizzle-orm";

// Category schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  imageUrl: text("image_url").notNull(),
});
export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});
// Product schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  price: doublePrecision("price").notNull(),
  discountPrice: doublePrecision("discount_price").default(sql`null`),
  categoryId: integer("category_id").notNull(),
  inStock: boolean("in_stock").notNull().default(true),
  stockLevel: integer("stock_level").notNull().default(0),
  isFeatured: boolean('is_featured').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  isNew: boolean("is_new").default(false),
  setPieces: integer("set_pieces").notNull().default(1), // Number of pieces per set
  unitType: text("unit_type").notNull().default("piece"), // e.g., "piece", "pack", "box"
});
export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
})
// Cart Item schema
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: text("cart_id").notNull(),
  productId: integer("product_id")
  .notNull()
  .references(() => products.id),
  quantity: integer("quantity").notNull().default(1),
});

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));
export const productRelations = relations(products, ({ many }) => ({
  cartItems: many(cartItems),
}));

export const insertCartItemSchema = createInsertSchema(cartItems)
  .omit({ id: true })
  .extend({
    quantity: z.number().int().positive() as any, // force compatibility
  });
// Used for array validation in order creation

// src/db/schema.ts
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Order schema
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  totalAmount: doublePrecision("total_amount").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  cartId: text("cart_id").notNull(), 
});
export const insertOrderSchema = createInsertSchema(orders)
  .omit({
    id: true,
    createdAt: true,
  })
  .extend({
    status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]).optional() as any,
  });
// Order Item schema
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: doublePrecision("price").notNull(),
});
// Fix: Create the base schema first, then derive the insert schema
const baseOrderItemSchema = createInsertSchema(orderItems);
export const insertOrderItemSchema = baseOrderItemSchema.omit({
  id: true,
  orderId: true,
});
// Alternative fix: Create a pure Zod schema for order items
  
  export const orderItemValidationSchema = z.object({
  orderId: z.number().int(),
  productId: z.number().int(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});
  
// Optional but recommended: relations for admin order fetch
export const orderRelations = relations(orders, ({ many }) => ({
  orderItems: many(orderItems),
}));

export const orderItemRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
// Create Order validation schema used in routes
export const createOrderSchema = z.object({
  customerName: z.string(),
  customerEmail: z.string().email(),
  customerPhone: z.string(),
  
  cartId: z.string().uuid(),
  items: z.array(
    z.object({
      productId: z.number().int(),
      quantity: z.number().int().positive(),
    })
  ),
});

// For the array validation in routes.ts, use this:
export const orderItemsArraySchema = z.array(orderItemValidationSchema);
// Export types using Drizzle's built-in type inference
export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;
export type User = typeof users.$inferSelect;
