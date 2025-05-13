// src/types/category.ts
export interface Category {
    id: string;
    slug: string;
    name: string;
    description?: string;
  }
  
  export interface Product {
    id: string;
    name: string;
    categoryId: string;
    // other product fields...
  }
  export interface CategoryResponse {
    data: Category;
  }
  
  export interface ProductsResponse {
    data: Product[];
  }
    