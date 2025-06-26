import { eq, ilike, or, isNotNull } from "drizzle-orm";
import { db } from "./db";
import { categories, products, cartItems, orders, orderItems } from "./schema";
export class DatabaseStorage {
    // Categories
    async getCategories() {
        return await db.select().from(categories);
    }
    async getCategoryBySlug(slug) {
        const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
        return category || undefined;
    }
    // Products
    async getProducts() {
        return await db.select().from(products);
    }
    async getProductsByCategory(categoryId) {
        return await db.select().from(products).where(eq(products.categoryId, categoryId));
    }
    async getProductBySlug(slug) {
        const [product] = await db.select().from(products).where(eq(products.slug, slug));
        return product || undefined;
    }
    async searchProducts(query) {
        return await db.select().from(products).where(or(ilike(products.name, `%${query}%`), ilike(products.description, `%${query}%`)));
    }
    async getFeaturedProducts() {
        // Return products with discounts as featured
        return await db.select().from(products).where(isNotNull(products.discountPrice)).limit(8);
    }
    async getNewProducts() {
        return await db.select().from(products).where(eq(products.isNew, true)).limit(8);
    }
    // Cart
    async getCartItems(cartId) {
        const items = await db
            .select({
            id: cartItems.id,
            cartId: cartItems.cartId,
            productId: cartItems.productId,
            quantity: cartItems.quantity,
            product: products
        })
            .from(cartItems)
            .innerJoin(products, eq(cartItems.productId, products.id))
            .where(eq(cartItems.cartId, cartId));
        return items;
    }
    async addCartItem(item) {
        const [newItem] = await db.insert(cartItems).values(item).returning();
        return newItem;
    }
    async updateCartItemQuantity(id, quantity) {
        const [updatedItem] = await db
            .update(cartItems)
            .set({ quantity })
            .where(eq(cartItems.id, id))
            .returning();
        return updatedItem || undefined;
    }
    async removeCartItem(id) {
        await db.delete(cartItems).where(eq(cartItems.id, id));
    }
    async clearCart(cartId) {
        await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
    }
    // Orders
    async createOrder(order, items) {
        const [newOrder] = await db.insert(orders).values(order).returning();
        // Insert order items
        const orderItemsWithOrderId = items.map(item => ({
            ...item,
            orderId: newOrder.id
        }));
        await db.insert(orderItems).values(orderItemsWithOrderId);
        return newOrder;
    }
    async getOrder(id) {
        const [order] = await db.select().from(orders).where(eq(orders.id, id));
        if (!order)
            return undefined;
        const items = await db
            .select({
            id: orderItems.id,
            orderId: orderItems.orderId,
            productId: orderItems.productId,
            quantity: orderItems.quantity,
            price: orderItems.price,
            product: products
        })
            .from(orderItems)
            .innerJoin(products, eq(orderItems.productId, products.id))
            .where(eq(orderItems.orderId, id));
        return {
            ...order,
            items
        };
    }
    async updateOrderStatus(id, status) {
        const [updatedOrder] = await db
            .update(orders)
            .set({ status })
            .where(eq(orders.id, id))
            .returning();
        return updatedOrder || undefined;
    }
    async getAllOrders() {
        const allOrders = await db.select().from(orders);
        const ordersWithItems = await Promise.all(allOrders.map(async (order) => {
            const items = await db
                .select({
                id: orderItems.id,
                orderId: orderItems.orderId,
                productId: orderItems.productId,
                quantity: orderItems.quantity,
                price: orderItems.price,
                product: products,
            })
                .from(orderItems)
                .innerJoin(products, eq(orderItems.productId, products.id))
                .where(eq(orderItems.orderId, order.id));
            return {
                ...order,
                items,
            };
        }));
        return ordersWithItems;
    }
    async getProductById(id) {
        const [product] = await db.select().from(products).where(eq(products.id, id));
        return product;
    }
    async placeOrder(order, items) {
        const [createdOrder] = await db.insert(orders).values(order).returning();
        await db.insert(orderItems).values(items.map((item) => ({
            orderId: createdOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
        })));
        return createdOrder;
    }
}
