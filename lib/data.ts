import type { Product, Category } from "./types";

// COMMENT: Ganti data produk sesuai dengan produk yang ingin ditampilkan
export const products: Product[] = [
  {
    id: "1",
    name: "Lenovo Slim T470S Silver Edition",
    category: "thinkpad",
    processor: "Intel Core i5 Gen 7",
    description: "Lenovo ThinkPad Slim T470S Silver Edition",
    image: "/putih 1.png", // Dihapus ?height=200&width=200
    images: [
      "/putih 1.png", // Dihapus ?height=300&width=300
      "/putih 2.png", // Dihapus ?height=300&width=300
      "/putih 3.png", // Dihapus ?height=300&width=300
      "/putih 4.png", // Dihapus ?height=300&width=300
    ],
    ramOptions: ["8 GB", "12 GB", "16 GB"],
    ssdOptions: ["128 GB", "256 GB", "512 GB", "1 TB"],
    priceRange: "3,8 JT - 5,2 JT",
    specs: [
      "RAM : 8GB >",
      "SSD :",
      "128GB 3.8jt",
      "256GB 3.9jt",
      "512GB 4.2jt",
      "1TB 4.9jt",
      "RAM 12GB >",
      "SSD : ",
      "128GB 3.9jt",
      "256GB 4jt",
      "512GB 4.3jt",
      "1TB 5jt",
      "RAM 16GB >",
      "SSD :",
      "128GB 4jt",
      "256GB 4.1jt",
      "512GB 4.5jt",
      "1TB 5.1jt",
    ],
    variants: [
      { ram: "8 GB", ssd: "128 GB", price: 3800000 },
      { ram: "8 GB", ssd: "256 GB", price: 3900000 },
      { ram: "8 GB", ssd: "512 GB", price: 4200000 },
      { ram: "8 GB", ssd: "1 TB", price: 4900000 },
      { ram: "12 GB", ssd: "128 GB", price: 3900000 },
      { ram: "12 GB", ssd: "256 GB", price: 4000000 },
      { ram: "12 GB", ssd: "512 GB", price: 4300000 },
      { ram: "12 GB", ssd: "1 TB", price: 5000000 },
      { ram: "16 GB", ssd: "128 GB", price: 4000000 },
      { ram: "16 GB", ssd: "256 GB", price: 4100000 },
      { ram: "16 GB", ssd: "512 GB", price: 4500000 },
      { ram: "16 GB", ssd: "1 TB", price: 5200000 },
    ],
  },
  {
    id: "2",
    name: "Lenovo Yoga Touchscreen",
    category: "thinkpad",
    processor: "Intel Core i5 Gen 8",
    description: "Lenovo Yoga dengan layar sentuh dan desain convertible",
    image: "/lenovo yoga.png", // Dihapus ?height=200&width=200
    images: ["/lenovo yoga.png", "/lenovo yoga 1.png", "/lenovo yoga 2.png"], // Dihapus ?height=200&width=200, ?height=300&width=300
    ramOptions: ["8 GB"],
    ssdOptions: ["128 GB", "256 GB", "512 GB", "1 TB"],
    priceRange: "3,5 JT - 4,6 JT",
    specs: [
      "RAM : 8GB >",
      "SSD :",
      "128GB 3.5jt",
      "256GB 3.6jt",
      "512GB 3.9jt",
      "1TB 4.6jt",
    ],

    variants: [
      { ram: "8 GB", ssd: "128 GB", price: 3500000 },
      { ram: "8 GB", ssd: "256 GB", price: 3600000 },
      { ram: "8 GB", ssd: "512 GB", price: 3900000 },
      { ram: "8 GB", ssd: "1 TB", price: 4600000 },
    ],
  },
  {
    id: "3",
    name: "Lenovo T460 Dual VGA NVIDIA",
    category: "thinkpad",
    processor: "Core i7 Gen 6",
    description: "Lenovo ThinkPad T460 dengan dual VGA NVIDIA",
    image: "/lenovo hitam.png",
    images: ["/lenovo hitam 1.png", "/lenovo hitam 2.png", "/lenovo hitam 3.jpg", "/lenovo hitam 4.jpg"],
    ramOptions: ["4 GB", "8 GB", "16 GB"],
    ssdOptions: ["128 GB", "256 GB", "512 GB", "1 TB"],
    priceRange: "3,5 JT - 5,2 JT",
    specs: [
      "RAM : 4GB >",
      " SSD :",
      "- 128GB 3.5jt",
      "- 256GB 3.6jt",
      "- 512GB 3.9jt",
      "- 1TB 4.5jt",
      "RAM 8GB >",
      "SSD : ",
      "- 128GB 3.8jt",
      "- 256GB 3.9jt",
      "- 512GB 4.2jt",
      "- 1TB 4.9jt",
      "RAM 16GB >",
      "SSD :",
      "- 128GB 4.1jt",
      "- 256GB 4.2jt",
      "- 512GB 4.5jt",
      "- 1TB 5.2jt",
    ],
    variants: [
      { ram: "4 GB", ssd: "128 GB", price: 3500000 },
      { ram: "4 GB", ssd: "256 GB", price: 3600000 },
      { ram: "4 GB", ssd: "512 GB", price: 3900000 },
      { ram: "4 GB", ssd: "1 TB", price: 4500000 },
      { ram: "8 GB", ssd: "128 GB", price: 3800000 },
      { ram: "8 GB", ssd: "256 GB", price: 3900000 },
      { ram: "8 GB", ssd: "512 GB", price: 4200000 },
      { ram: "8 GB", ssd: "1 TB", price: 4900000 },
      { ram: "16 GB", ssd: "128 GB", price: 4100000 },
      { ram: "16 GB", ssd: "256 GB", price: 4200000 },
      { ram: "16 GB", ssd: "512 GB", price: 4500000 },
      { ram: "16 GB", ssd: "1 TB", price: 5200000 },
    ],
  },

  {
    id: "4",
    name: "Lenovo X1 Carbon",
    category: "thinkpad",
    processor: "X1 i5 Gen 6",
    description: "Lenovo X1 dengan performa tinggi",
    image: "/Lenovo X1 Carbon i5 gen 6 .png", // Dihapus ?height=200&width=200
    images: [
      "/Lenovo X1 Carbon i5 gen 6 .png",
      "/Lenovo X1 Carbon i5 gen 6 (1).jpg",
    ],
    ramOptions: ["8 GB"],
    ssdOptions: ["128 GB", "256 GB"],
    priceRange: "3.8 JT & 3.9 JT",
    specs: ["RAM : 8GB >", "SSD :", "- 128GB 3.8jt", "- 256GB 3.9jt"],
    variants: [
      { ram: "8 GB", ssd: "128 GB", price: 3800000 },
      { ram: "8 GB", ssd: "256 GB", price: 3900000 },
    ],
  },
  {
    id: "5",
    name: "Lenovo X1 Carbon",
    category: "thinkpad",
    processor: "X1 i7 Gen 6",
    description: "Lenovo X1 dengan performa tinggi",
    image: "/X1 i7 Gen 6.jpg", // Dihapus ?height=200&width=200
    images: [
      "/X1 i7 Gen 6.jpg",
      "/X1 i7 Gen 6(1).jpg",
    ], // Dihapus ?height=300&width=300
    ramOptions: ["8 GB", "16 GB"],
    ssdOptions: ["128 GB", "256 GB"],
    priceRange: "4.4 JT - 4.8 JT",
    specs: [
      "RAM : 8GB >",
      "SSD :",
      "- 128GB 4.4jt",
      "- 256GB 4.5jt",
      "RAM : 16GB >",
      "SSD :",
      "- 128GB 4.7jt",
      "- 256GB 4.8jt",
    ],
    variants: [
      { ram: "8 GB", ssd: "128 GB", price: 4400000 },
      { ram: "8 GB", ssd: "256 GB", price: 4500000 },
      { ram: "16 GB", ssd: "128 GB", price: 4700000 },
      { ram: "16 GB", ssd: "256 GB", price: 4800000 },
    ],
  },
  {
    id: "6",
    name: "Lenovo X1 Carbon",
    category: "thinkpad",
    processor: "X1 i7 Gen 5",
    description: "Lenovo X1 dengan performa tinggi",
    image: "/Lenovo X1 Carbon i7 Gen 5.jpg", // Dihapus ?height=200&width=200
    images: [
      "/Lenovo X1 Carbon i7 Gen 5.jpg",
      "/public/Lenovo X1 Carbon i7 Gen 5(1).jpg",
    ], // Dihapus ?height=300&width=300
    ramOptions: ["8 GB"],
    ssdOptions: ["128 GB", "256 GB"],
    priceRange: "4.1 JT & 4.2 JT",
    specs: ["RAM : 8GB >", "SSD :", "- 128GB 4.1jt", "- 256GB 4.2jt"],
    variants: [
      { ram: "8 GB", ssd: "128 GB", price: 4400000 },
      { ram: "8 GB", ssd: "256 GB", price: 4500000 },
      { ram: "16 GB", ssd: "128 GB", price: 4700000 },
      { ram: "16 GB", ssd: "256 GB", price: 4800000 },
    ],
  },
  {
    id: "7",
    name: "DELL 3420",
    category: "dell",
    processor: "i5 gen 11",
    description: "DELL 3420 dengan performa tinggi",
    image: "/Dell 3420 i5 gen11 .png", // Dihapus ?height=200&width=200
    images: ["/Dell_3420_i5_gen11__(1).png", "/Dell_3420_i5_gen11__(2).png", "/Dell 3420 i5 gen11 (1).png"],
    ramOptions: ["8 GB"],
    ssdOptions: ["512 GB"],
    priceRange: "4,7 JT",
    specs: ["RAM : 8GB > SSD : 512GB 4.7jt"],
    variants: [{ ram: "8 GB", ssd: "512 GB", price: 4700000 }],
  },
  {
    id: "8",
    name: "DELL LATITUDE 7490",
    category: "dell",
    processor: "i5 gen 8",
    description: "DELL 3420 dengan performa tinggi",
    image: "/Dell Latitude 7490 i5 gen 8.png", // Dihapus ?height=200&width=200
    images: [
      "/Dell Latitude 7490 i5 gen 8.png",
      "/Dell Latitude 7490 i5 gen 8 (1).jpg",
      "/Dell Latitude 7490 i5 gen 8 (2).jpg",
      "/Dell Latitude 7490 i5 gen 8 (3).jpg",
    ], // Dihapus ?height=200&width=200, ?height=300&width=300
    ramOptions: ["8 GB", "16 GB"],
    ssdOptions: ["128 GB", "256 GB"],
    priceRange: "3.9 JT - 4.3 JT",
    specs: [
      "RAM : 8GB >",
      "SSD :",
      "128GB 3.9jt",
      "256GB 4jt",
      "RAM : 16GB >",
      "SSD :",
      "128GB 4.2jt",
      "256GB 4.3jt",
    ],
    variants: [
      { ram: "8 GB", ssd: "128 GB", price: 3900000 },
      { ram: "8 GB", ssd: "256 GB", price: 4000000 },
      { ram: "16 GB", ssd: "128 GB", price: 4200000 },
      { ram: "16 GB", ssd: "256 GB", price: 4300000 },
    ],
  },
];

// COMMENT: Ganti kategori sesuai dengan kategori yang ingin ditampilkan
export const categories: Category[] = [
  {
    id: "1",
    name: "ThinkPad",
    slug: "thinkpad",
    image: "/putih 1.png", // Dihapus ?height=80&width=80
  },
  {
    id: "2",
    name: "Dell",
    slug: "dell",
    image: "/Dell Latitude 7490 i5 gen 8.png", // Dihapus ?height=80&width=80
  },
];

// COMMENT: Ganti produk unggulan sesuai dengan produk yang ingin ditampilkan
export const featuredProduct = {
  id: "featured",
  title: "Laptop Bagus, Awet, Cocok Buat Kuliah, Kenapa Ngga?",
  description:
    "ThinkPad kuat buat Multitasking, Zoom, dan Desain. Pilih spesifikasi sesuai yang kamu butuh, tapi jangan sampai salah pilih ya!",
  image: "/putih 1.png", // Dihapus ?height=200&width=300
};
