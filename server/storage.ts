import {
  categories, Category, InsertCategory,
  products, Product, InsertProduct,
  cartItems, CartItem, InsertCartItem,
  orders, Order, InsertOrder,
  orderItems, OrderItem, InsertOrderItem,
} from "../shared/schema";

export interface IStorage {
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;

  getProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductById(id: number): Promise<Product | undefined>; // ✅ Added
  searchProducts(query: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getNewProducts(): Promise<Product[]>;

  getCartItems(cartId: string): Promise<(CartItem & { product: Product })[]>;
  addCartItem(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<void>;
  clearCart(cartId: string): Promise<void>;

  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  placeOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>; // ✅ Added missing method
  getOrder(id: number): Promise<(Order & { items: (OrderItem & { product: Product })[] }) | undefined>;
}

export class MemStorage implements IStorage {
  private categories = new Map<number, Category>();
  private products = new Map<number, Product>();
  private cartItems = new Map<number, CartItem>();
  private orders = new Map<number, Order>();
  private orderItems = new Map<number, OrderItem>();

  private currentCategoryId = 1;
  private currentProductId = 1;
  private currentCartItemId = 1;
  private currentOrderId = 1;
  private currentOrderItemId = 1;

  constructor() {
    this.initSampleData();
  }

  // ----------- Categories -----------
  async getCategories(): Promise<Category[]> {
    return [...this.categories.values()];
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return [...this.categories.values()].find(c => c.slug === slug);
  }

  // ----------- Products -----------
  async getProducts(): Promise<Product[]> {
    return [...this.products.values()];
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return [...this.products.values()].filter(p => p.categoryId === categoryId);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return [...this.products.values()].find(p => p.slug === slug);
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const q = query.toLowerCase();
    return [...this.products.values()].filter(p =>
      p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return [...this.products.values()].filter(p => p.discountPrice !== null).slice(0, 8);
  }

  async getNewProducts(): Promise<Product[]> {
    return [...this.products.values()].filter(p => p.isNew).slice(0, 8);
  }

  // ----------- Cart -----------
  async getCartItems(cartId: string): Promise<(CartItem & { product: Product })[]> {
    return [...this.cartItems.values()]
      .filter(item => item.cartId === cartId)
      .map(item => {
        const product = this.products.get(item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);
        return { ...item, product };
      });
  }

  async addCartItem(item: InsertCartItem): Promise<CartItem> {
    const existing = [...this.cartItems.values()].find(
      c => c.cartId === item.cartId && c.productId === item.productId
    );

    if (existing) {
      existing.quantity += item.quantity;
      this.cartItems.set(existing.id, existing);
      return existing;
    }

    const id = this.currentCartItemId++;
    const newItem: CartItem = { ...item, id };
    this.cartItems.set(id, newItem);
    return newItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;
    item.quantity = quantity;
    this.cartItems.set(id, item);
    return item;
  }

  async removeCartItem(id: number): Promise<void> {
    this.cartItems.delete(id);
  }

  async clearCart(cartId: string): Promise<void> {
    for (const [id, item] of this.cartItems.entries()) {
      if (item.cartId === cartId) this.cartItems.delete(id);
    }
  }

  // ----------- Orders -----------
  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const id = this.currentOrderId++;
    const newOrder: Order = { ...order, id, createdAt: new Date() };
    this.orders.set(id, newOrder);

    for (const item of items) {
      const itemId = this.currentOrderItemId++;
      const newItem: OrderItem = { ...item, id: itemId, orderId: id };
      this.orderItems.set(itemId, newItem);
    }

    return newOrder;
  }

  // ✅ Added placeOrder method that was missing
  async placeOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    // This is similar to createOrder but can include additional business logic
    // like validating inventory, calculating totals, etc.
    const id = this.currentOrderId++;
    const newOrder: Order = { 
      ...order, 
      id, 
      createdAt: new Date(),
      status: "pending" // Assuming Order has a status field
    };
    
    this.orders.set(id, newOrder);

    // Create and store order items
    for (const item of items) {
      const itemId = this.currentOrderItemId++;
      const newItem: OrderItem = { 
        ...item, 
        id: itemId, 
        orderId: id 
      };
      this.orderItems.set(itemId, newItem);
    }

    // We could also clear the customer's cart here
    if (order.cartId) {
      this.clearCart(order.cartId);
    }

    return newOrder;
  }

  async getOrder(id: number): Promise<(Order & { items: (OrderItem & { product: Product })[] }) | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const items = [...this.orderItems.values()]
      .filter(item => item.orderId === id)
      .map(item => {
        const product = this.products.get(item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);
        return { ...item, product };
      });

    return { ...order, items };
  }

  // ----------- Sample Data Seed -----------
  private initSampleData() {
    const demoCategories: InsertCategory[] =  [
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
  
    const demoProducts: InsertProduct[] = [
      {
        name: "Handwoven Basket",
        slug: "handwoven-basket",
        description: "Beautifully crafted Rwandan basket made from natural sisal and sweetgrass.",
        price: 15000,
        discountPrice: null,
        imageUrl: "https://images.pexels.com/photos/1409937/pexels-photo-1409937.jpeg",
        categoryId: 4,
        isNew: true
      },
      {
        name: "Ceramic Dinner Plate",
        slug: "ceramic-dinner-plate",
        description: "Locally made ceramic plate, ideal for modern table settings.",
        price: 12000,
        discountPrice: 10000,
        imageUrl: "https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg",
        categoryId: 2,
        isNew: false
      },
      {
        name: "Woven Wall Art",
        slug: "woven-wall-art",
        description: "Traditional wall decor made from banana leaves and raffia.",
        price: 20000,
        discountPrice: 18000,
        imageUrl: "https://images.pexels.com/photos/1166642/pexels-photo-1166642.jpeg",
        categoryId: 4,
        isNew: true
      },
      {
        name: "Cooking Spoon Set",
        slug: "cooking-spoon-set",
        description: "Hand-carved spoon set made from sustainable hardwood.",
        price: 8000,
        discountPrice: null,
        imageUrl: "https://images.pexels.com/photos/3952040/pexels-photo-3952040.jpeg",
        categoryId: 3,
        isNew: false
      },
      {
        name: "Cotton Wrap Skirt",
        slug: "cotton-wrap-skirt",
        description: "Colorful African print skirt made from 100% cotton fabric.",
        price: 22000,
        discountPrice: 20000,
        imageUrl: "https://images.pexels.com/photos/977659/pexels-photo-977659.jpeg",
        categoryId: 1,
        isNew: true
      },
      // --- Premium & Discounted Products Below ---
      {
        name: "Luxury Woven Blanket",
        slug: "luxury-woven-blanket",
        description: "Soft handwoven blanket crafted from local cotton, perfect for cozy evenings.",
        price: 40000,
        discountPrice: 35000,
        imageUrl: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg",
        categoryId: 1,
        isNew: false
      },
      {
        name: "Handcrafted Teak Tray",
        slug: "handcrafted-teak-tray",
        description: "Elegant serving tray made from polished teak wood.",
        price: 25000,
        discountPrice: null,
        imageUrl: "https://images.pexels.com/photos/5946733/pexels-photo-5946733.jpeg",
        categoryId: 3,
        isNew: true
      },
      {
        name: "Gold-Trimmed Ceramic Bowl",
        slug: "gold-ceramic-bowl",
        description: "Luxury bowl with 24k gold trim, fired in small artisan batches.",
        price: 30000,
        discountPrice: 28000,
        imageUrl: "https://images.pexels.com/photos/5638742/pexels-photo-5638742.jpeg",
        categoryId: 2,
        isNew: false
      },
      {
        name: "Rwandan Coffee Gift Box",
        slug: "coffee-gift-box",
        description: "Premium Arabica coffee with handmade cup set — perfect for gifting.",
        price: 35000,
        discountPrice: 30000,
        imageUrl: "https://images.pexels.com/photos/3394654/pexels-photo-3394654.jpeg",
        categoryId: 4,
        isNew: true
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
export const getCategoryBySlug = async (slug: string) => storage.getCategoryBySlug(slug);

// Products
export const getProducts = async () => storage.getProducts();
export const getProductsByCategory = async (categoryId: number) => storage.getProductsByCategory(categoryId);
export const getProductBySlug = async (slug: string) => storage.getProductBySlug(slug);
export const getProductById = async (id: number) => storage.getProductById(id);
export const searchProducts = async (query: string) => storage.searchProducts(query);
export const getFeaturedProducts = async () => storage.getFeaturedProducts();
export const getNewProducts = async () => storage.getNewProducts();

// Cart
export const getCartItems = async (cartId: string) => storage.getCartItems(cartId);
export const addCartItem = async (item: InsertCartItem) => storage.addCartItem(item);
export const updateCartItemQuantity = async (id: number, quantity: number) => storage.updateCartItemQuantity(id, quantity);
export const removeCartItem = async (id: number) => storage.removeCartItem(id);
export const clearCart = async (cartId: string) => storage.clearCart(cartId);

// Orders
export const createOrder = async (order: InsertOrder, items: InsertOrderItem[]) => storage.createOrder(order, items);
export const placeOrder = async (order: InsertOrder, items: InsertOrderItem[]) => storage.placeOrder(order, items); // ✅ Added missing export
export const getOrder = async (id: number) => storage.getOrder(id);