export interface ProductVariant {
  id: string;
  ram: string;
  ssd: string;
  price: number;
  stock?: number;
  created_at?: string;
  updated_at?: string;
}


export interface Product {
  id: string;
  name: string;
  category: Category;
  processor: string;
  description: string;
  image: string;
  images: string[];
  ramOptions: string[];
  ssdOptions: string[];
  priceRange: string;
  specs: string[]; // Pastikan ini tetap string[] jika menggunakan cara simpel
  variants: ProductVariant[];
  rating?: number; // <--- TAMBAHKAN INI
  reviewCount?: number; // <--- TAMBAHKAN INI
  is_featured?: boolean;
  is_best_seller?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}
