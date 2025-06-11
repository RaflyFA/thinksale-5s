export interface ProductVariant {
  ram: string;
  ssd: string;
  price: number;
}

// Tidak ada perubahan di sini karena kita menggunakan cara simpel untuk specs
// export interface ProductSpec {
//   heading?: string;
//   items?: string[];
// }

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
  specs: string[]; // Pastikan ini tetap string[] jika menggunakan cara simpel
  variants: ProductVariant[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}
