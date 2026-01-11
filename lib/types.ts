export interface ProductVariant {
  ram: string;
  ssd: string;
  price: number;
}


export interface Product {
  id: string;
  name: string;
  category: string;
  processor: string;
  description: string;
  image: string;
  images: string[];
  ramOptions: string[];
  ssdOptions: string[];
  priceRange: string;
  specs: string[];
  variants: ProductVariant[];
  rating?: number;
  reviewCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}
