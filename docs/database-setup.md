# Database Setup Guide

## Langkah-langkah Setup Database

### 1. Buat Database Schema

Jalankan script SQL berikut di SQL Editor Supabase untuk membuat tabel-tabel yang diperlukan:

```sql
-- Buat tabel categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Buat tabel products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  processor VARCHAR(255),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  image_url TEXT,
  images TEXT[],
  ram_options TEXT[],
  ssd_options TEXT[],
  price_range VARCHAR(255),
  specs TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Buat tabel product_variants
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  ram VARCHAR(50) NOT NULL,
  ssd VARCHAR(50) NOT NULL,
  price INTEGER NOT NULL,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Buat index untuk performa
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_best_seller ON products(is_best_seller);
CREATE INDEX idx_variants_product ON product_variants(product_id);
```

### 2. Masukkan Data Sample

Jalankan script `database/seed-data.sql` di SQL Editor Supabase untuk memasukkan data sample.

### 3. Verifikasi Data

Setelah menjalankan script, Anda dapat memverifikasi data dengan query berikut:

```sql
-- Cek jumlah kategori
SELECT COUNT(*) FROM categories;

-- Cek jumlah produk
SELECT COUNT(*) FROM products;

-- Cek jumlah variant
SELECT COUNT(*) FROM product_variants;

-- Cek produk unggulan
SELECT name, is_featured, is_best_seller FROM products WHERE is_featured = true OR is_best_seller = true;
```

## Struktur Data

### Categories
- `id`: UUID primary key
- `name`: Nama kategori (ThinkPad, Dell, Gaming, Student)
- `slug`: URL slug untuk routing
- `description`: Deskripsi kategori
- `image_url`: URL gambar kategori

### Products
- `id`: UUID primary key
- `name`: Nama produk
- `description`: Deskripsi produk
- `processor`: Spesifikasi processor
- `category_id`: Foreign key ke categories
- `image_url`: URL gambar utama
- `images`: Array URL gambar tambahan
- `ram_options`: Array opsi RAM
- `ssd_options`: Array opsi SSD
- `price_range`: Range harga dalam format string
- `specs`: Array spesifikasi detail
- `is_featured`: Boolean untuk produk unggulan
- `is_best_seller`: Boolean untuk produk terlaris
- `rating`: Rating produk (0-5)
- `review_count`: Jumlah review

### Product Variants
- `id`: UUID primary key
- `product_id`: Foreign key ke products
- `ram`: Kapasitas RAM
- `ssd`: Kapasitas SSD
- `price`: Harga dalam rupiah
- `stock`: Stok tersedia

## Troubleshooting

### Error: "relation does not exist"
Pastikan Anda menjalankan script CREATE TABLE terlebih dahulu sebelum INSERT data.

### Error: "duplicate key value violates unique constraint"
Data sudah ada di database. Anda bisa menghapus data lama terlebih dahulu dengan:

```sql
DELETE FROM product_variants;
DELETE FROM products;
DELETE FROM categories;
```

### Error: "foreign key constraint"
Pastikan data categories dimasukkan terlebih dahulu sebelum products, dan products sebelum variants.

## Testing

Setelah setup database selesai, Anda dapat menguji implementasi dengan:

1. Buka website di browser
2. Pastikan halaman utama menampilkan data dari database
3. Test fitur pencarian
4. Test navigasi ke halaman produk berdasarkan kategori 