import type { Product, Category } from "./types"

// COMMENT: Ganti data produk sesuai dengan produk yang ingin ditampilkan
export const products: Product[] = [
  {
    id: "1",
    name: "Lenovo Slim T470S Silver Edition",
    category: "thinkpad",
    processor: "Intel Core i5 Gen 7",
    description: "Lenovo ThinkPad Slim T470S Silver Edition",
    image: "/placeholder.svg?height=200&width=200",
    images: [
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
    ],
    ramOptions: ["8 GB", "12 GB", "16 GB"],
    ssdOptions: ["128 GB", "256 GB", "512 GB", "1 TB"],
    priceRange: "3,8 JT - 5,2 JT",
    specs: [
      "RAM : 8GB > SSD : 128GB 3.8jt",
      ": 256GB 3.9jt",
      ": 512GB 4.2jt",
      ": 1TB 4.9jt",
      "RAM 12GB > SSD : 128GB 3.9jt",
      ": 256GB 4jt",
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
      { ram: "16 GB", ssd: "128 GB", price: 4100000 },
      { ram: "16 GB", ssd: "256 GB", price: 4200000 },
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
    image: "/placeholder.svg?height=200&width=200",
    images: ["/placeholder.svg?height=300&width=300", "/placeholder.svg?height=300&width=300"],
    ramOptions: ["8 GB", "16 GB"],
    ssdOptions: ["128 GB", "256 GB", "512 GB", "1 TB"],
    priceRange: "3,5 JT - 4,5 JT",
    specs: ["RAM : 8GB > SSD : 128GB 3.5jt", ": 256GB 3.7jt", ": 512GB 4.0jt", ": 1TB 4.3jt"],
    variants: [
      { ram: "8 GB", ssd: "128 GB", price: 3500000 },
      { ram: "8 GB", ssd: "256 GB", price: 3700000 },
      { ram: "8 GB", ssd: "512 GB", price: 4000000 },
      { ram: "8 GB", ssd: "1 TB", price: 4300000 },
      { ram: "16 GB", ssd: "128 GB", price: 3800000 },
      { ram: "16 GB", ssd: "256 GB", price: 4000000 },
      { ram: "16 GB", ssd: "512 GB", price: 4300000 },
      { ram: "16 GB", ssd: "1 TB", price: 4500000 },
    ],
  },
  {
    id: "3",
    name: "Lenovo T460 Dual VGA NVIDIA",
    category: "thinkpad",
    processor: "Core i7 Gen 6",
    description: "Lenovo ThinkPad T460 dengan dual VGA NVIDIA",
    image: "/placeholder.svg?height=200&width=200",
    images: ["/placeholder.svg?height=300&width=300", "/placeholder.svg?height=300&width=300"],
    ramOptions: ["4 GB", "8 GB", "16 GB"],
    ssdOptions: ["128 GB", "256 GB", "512 GB", "1 TB"],
    priceRange: "3,5 JT - 5,2 JT",
    specs: ["RAM : 4GB > SSD : 128GB 3.5jt", "RAM : 8GB > SSD : 256GB 4.0jt", "RAM : 16GB > SSD : 512GB 4.8jt"],
    variants: [
      { ram: "4 GB", ssd: "128 GB", price: 3500000 },
      { ram: "4 GB", ssd: "256 GB", price: 3700000 },
      { ram: "8 GB", ssd: "128 GB", price: 3800000 },
      { ram: "8 GB", ssd: "256 GB", price: 4000000 },
      { ram: "8 GB", ssd: "512 GB", price: 4500000 },
      { ram: "16 GB", ssd: "256 GB", price: 4700000 },
      { ram: "16 GB", ssd: "512 GB", price: 4800000 },
      { ram: "16 GB", ssd: "1 TB", price: 5200000 },
    ],
  },
  {
    id: "4",
    name: "DELL 3420",
    category: "dell",
    processor: "i5 gen 11",
    description: "DELL 3420 dengan performa tinggi",
    image: "/placeholder.svg?height=200&width=200",
    images: ["/placeholder.svg?height=300&width=300", "/placeholder.svg?height=300&width=300"],
    ramOptions: ["8 GB", "16 GB"],
    ssdOptions: ["256 GB", "512 GB"],
    priceRange: "4,7 JT",
    specs: ["RAM : 8GB > SSD : 512GB 4.7jt"],
    variants: [
      { ram: "8 GB", ssd: "256 GB", price: 4500000 },
      { ram: "8 GB", ssd: "512 GB", price: 4700000 },
      { ram: "16 GB", ssd: "256 GB", price: 4700000 },
      { ram: "16 GB", ssd: "512 GB", price: 4900000 },
    ],
  },
]

// COMMENT: Ganti kategori sesuai dengan kategori yang ingin ditampilkan
export const categories: Category[] = [
  {
    id: "1",
    name: "ThinkPad",
    slug: "thinkpad",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "2",
    name: "Dell",
    slug: "dell",
    image: "/placeholder.svg?height=80&width=80",
  },
]

// COMMENT: Ganti produk unggulan sesuai dengan produk yang ingin ditampilkan
export const featuredProduct = {
  id: "featured",
  title: "Laptop Bagus, Awet, Cocok Buat Kuliah, Kenapa Ngga?",
  description:
    "ThinkPad kuat buat Multitasking, Zoom, dan Desain. Pilih spesifikasi sesuai yang kamu butuh, tapi jangan sampai salah pilih ya!",
  image: "/placeholder.svg?height=200&width=300",
}
