export interface CartItem {
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
