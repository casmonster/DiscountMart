export class MemStorage {
    constructor() {
        this.categories = new Map();
        this.products = new Map();
        this.cartItems = new Map();
        this.orders = new Map();
        this.orderItems = new Map();
        this.currentCategoryId = 1;
        this.currentProductId = 1;
        this.currentCartItemId = 1;
        this.currentOrderId = 1;
        this.currentOrderItemId = 1;
        this.initSampleData();
    }
    // ----------- Categories -----------
    async getCategories() {
        return [...this.categories.values()];
    }
    async getCategoryBySlug(slug) {
        return [...this.categories.values()].find(c => c.slug === slug);
    }
    // ----------- Products -----------
    async getProducts() {
        return [...this.products.values()];
    }
    async getProductsByCategory(categoryId) {
        return [...this.products.values()].filter(p => p.categoryId === categoryId);
    }
    async getProductBySlug(slug) {
        return [...this.products.values()].find(p => p.slug === slug);
    }
    async getProductById(id) {
        return this.products.get(id);
    }
    async searchProducts(query) {
        const q = query.toLowerCase();
        return [...this.products.values()].filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    async getFeaturedProducts() {
        return [...this.products.values()].filter(p => p.discountPrice !== null).slice(0, 8);
    }
    async getNewProducts() {
        return [...this.products.values()].filter(p => p.isNew).slice(0, 8);
    }
    // ----------- Cart -----------
    async getCartItems(cartId) {
        return [...this.cartItems.values()]
            .filter(item => item.cartId === cartId)
            .map(item => {
            const product = this.products.get(item.productId);
            if (!product)
                throw new Error(`Product ${item.productId} not found`);
            return { ...item, product };
        });
    }
    async addCartItem(item) {
        const existing = [...this.cartItems.values()].find(c => c.cartId === item.cartId && c.productId === item.productId);
        if (existing) {
            existing.quantity += item.quantity ?? 0;
            this.cartItems.set(existing.id, existing);
            return existing;
        }
        const id = this.currentCartItemId++;
        const newItem = { ...item, id, quantity: item.quantity ?? 1 };
        this.cartItems.set(id, newItem);
        return newItem;
    }
    async updateCartItemQuantity(id, quantity) {
        const item = this.cartItems.get(id);
        if (!item)
            return undefined;
        item.quantity = quantity;
        this.cartItems.set(id, item);
        return item;
    }
    async removeCartItem(id) {
        this.cartItems.delete(id);
    }
    async clearCart(cartId) {
        for (const [id, item] of this.cartItems.entries()) {
            if (item.cartId === cartId)
                this.cartItems.delete(id);
        }
    }
    // ----------- Orders -----------
    async placeOrder(order, items) {
        const id = this.currentOrderId++;
        const newOrder = {
            ...order,
            id,
            createdAt: new Date(),
            status: "pending"
        };
        this.orders.set(id, newOrder);
        for (const item of items) {
            const itemId = this.currentOrderItemId++;
            const newItem = {
                ...item,
                id: itemId,
                orderId: id
            };
            this.orderItems.set(itemId, newItem);
        }
        if (order.cartId) {
            this.clearCart(order.cartId);
        }
        return newOrder;
    }
    async getOrder(id) {
        const order = this.orders.get(id);
        if (!order)
            return undefined;
        const items = [...this.orderItems.values()]
            .filter(item => item.orderId === id)
            .map(item => {
            const product = this.products.get(item.productId);
            if (!product)
                throw new Error(`Product ${item.productId} not found`);
            return { ...item, product };
        });
        return { ...order, items };
    }
    async updateOrderStatus(id, status) {
        const order = this.orders.get(id);
        if (!order) {
            return undefined;
        }
        const updatedOrder = { ...order, status };
        this.orders.set(id, updatedOrder);
        return updatedOrder;
    }
    async getAllOrders() {
        const allOrders = Array.from(this.orders.values());
        const ordersWithItems = allOrders.map(order => {
            const orderItemsList = Array.from(this.orderItems.values())
                .filter(item => item.orderId === order.id);
            const orderItemsWithProducts = orderItemsList.map(item => {
                const product = this.products.get(item.productId);
                if (!product) {
                    throw new Error(`Product with ID ${item.productId} not found`);
                }
                return { ...item, product };
            });
            return {
                ...order,
                items: orderItemsWithProducts,
            };
        });
        return ordersWithItems;
    }
    // ----------- Sample Data Seed -----------
    initSampleData() {
        const demoCategories = [
            {
                name: "Clothing",
                slug: "clothing",
                imageUrl: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg"
            },
            {
                name: "Tableware",
                slug: "tableware",
                imageUrl: "https://images.pexels.com/photos/7045694/pexels-photo-7045694.jpeg"
            },
            {
                name: "Kitchen",
                slug: "kitchen",
                imageUrl: "https://images.pexels.com/photos/3768162/pexels-photo-3768162.jpeg"
            },
            {
                name: "Home Decor",
                slug: "home-decor",
                imageUrl: "https://images.pexels.com/photos/2986011/pexels-photo-2986011.jpeg"
            }
        ];
        demoCategories.forEach(category => {
            const id = this.currentCategoryId++;
            this.categories.set(id, { ...category, id });
        });
    }
}
// ----------- Singleton Instance -----------
export const storage = new MemStorage();
// ----------- Global Async API Exports -----------
// Categories
export const getCategories = async () => storage.getCategories();
export const getCategoryBySlug = async (slug) => storage.getCategoryBySlug(slug);
// Products
export const getProducts = async () => storage.getProducts();
export const getProductsByCategory = async (categoryId) => storage.getProductsByCategory(categoryId);
export const getProductBySlug = async (slug) => storage.getProductBySlug(slug);
export const getProductById = async (id) => storage.getProductById(id);
export const searchProducts = async (query) => storage.searchProducts(query);
export const getFeaturedProducts = async () => storage.getFeaturedProducts();
export const getNewProducts = async () => storage.getNewProducts();
// Cart
export const getCartItems = async (cartId) => storage.getCartItems(cartId);
export const addCartItem = async (item) => storage.addCartItem(item);
export const updateCartItemQuantity = async (id, quantity) => storage.updateCartItemQuantity(id, quantity);
export const removeCartItem = async (id) => storage.removeCartItem(id);
export const clearCart = async (cartId) => storage.clearCart(cartId);
// Orders
export const placeOrder = async (order, items) => storage.placeOrder(order, items);
export const getOrder = async (id) => storage.getOrder(id);
