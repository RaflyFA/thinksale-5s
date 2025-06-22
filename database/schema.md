-- Category
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  image text NOT NULL
);

-- Product
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category_id uuid REFERENCES categories(id),
  processor text NOT NULL,
  description text,
  image text,
  images text[],
  ram_options text[],
  ssd_options text[],
  price_range text,
  specs text[],
  rating float,
  review_count int,
  is_featured boolean DEFAULT false,        -- ✅ BARU
  is_best_seller boolean DEFAULT false,    -- ✅ BARU
  discount_percentage integer DEFAULT 0,   -- ✅ DISKON: Persentase diskon produk (0-100)
  discount_start_date timestamptz,         -- ✅ DISKON: Tanggal mulai diskon
  discount_end_date timestamptz,           -- ✅ DISKON: Tanggal berakhir diskon
  is_discount_active boolean DEFAULT false, -- ✅ DISKON: Status aktif diskon
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Product Variant
CREATE TABLE product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id),
  ram text,
  ssd text,
  price int,
  stock integer DEFAULT 0,                 -- ✅ BARU
  discount_percentage integer DEFAULT 0,   -- ✅ DISKON: Persentase diskon variant (0-100)
  discount_start_date timestamptz,         -- ✅ DISKON: Tanggal mulai diskon variant
  discount_end_date timestamptz,           -- ✅ DISKON: Tanggal berakhir diskon variant
  is_discount_active boolean DEFAULT false, -- ✅ DISKON: Status aktif diskon variant
  created_at timestamptz DEFAULT now(),    -- ✅ BARU
  updated_at timestamptz DEFAULT now()     -- ✅ BARU
);

-- User
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  image text,
  password text,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Cart
CREATE TABLE carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Cart Item
CREATE TABLE cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id uuid REFERENCES carts(id),
  product_id uuid REFERENCES products(id),
  variant_id uuid REFERENCES product_variants(id),
  quantity int NOT NULL
);

-- Order
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  total int,
  status text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order Item
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id),
  product_id uuid REFERENCES products(id),
  variant_id uuid REFERENCES product_variants(id),
  quantity int NOT NULL,
  price int NOT NULL
);

-- Settings
CREATE TABLE settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  type text NOT NULL DEFAULT 'string', -- 'string', 'boolean', 'number', 'json'
  category text NOT NULL DEFAULT 'general', -- 'general', 'notification', 'system'
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Catatan: Kunci (key) yang disarankan untuk kategori 'general'
-- 'store_name': Nama Toko
-- 'store_description': Deskripsi singkat toko
-- 'contact_phone': Nomor telepon yang dapat dihubungi
-- 'store_logo': URL gambar untuk logo toko
-- 'hero_image': URL gambar utama (hero) di halaman depan

-- Indexes untuk performa
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_best_seller ON products(is_best_seller);
CREATE INDEX idx_products_discount ON products(is_discount_active, discount_end_date);
CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_discount ON product_variants(is_discount_active, discount_end_date);
CREATE INDEX idx_settings_key ON settings(key);
CREATE INDEX idx_settings_category ON settings(category);