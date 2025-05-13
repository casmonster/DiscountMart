// types/index.ts
export interface Category {
    id: string;
    slug: string;
    name: string;
  }
  
  export interface Product {
    id: string;
    name: string;
    categoryId: string;
  }
    export interface CategoryResponse {
        data: Category;
    }
    
  