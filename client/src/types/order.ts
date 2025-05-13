export interface Order {
    id: string;
    createdAt: string;
    totalAmount: number;
    status: string;
    customerEmail: string;
    customerPhone: string;
    items: OrderItem[];
  }
  
  export interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product: Product;
  }
  
  export interface Product {
    id: string;
    name: string;
    imageUrl: string;
  }
  