export interface Order {
    id: string;
    createdAt: string;
    totalAmount: number;
    status: "pending" | "completed" | "cancelled";
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    items: OrderItem[];
  }
  
  export interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product: Product;
    orderId?: number;
    productId: number;
  }
  
  export interface Product {
    id: string;
    name: string;
    imageUrl: string;
  }
  