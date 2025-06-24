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
  discount_percentage integer DEFAULT 0,   -- ✅ DISKON: Persentase diskon variant (0-100)
  discount_start_date timestamptz,         -- ✅ DISKON: Tanggal mulai diskon variant
  discount_end_date timestamptz,           -- ✅ DISKON: Tanggal berakhir diskon variant
  is_discount_active boolean DEFAULT false, -- ✅ DISKON: Status aktif diskon variant
  created_at timestamptz DEFAULT now(),    -- ✅ BARU
  updated_at timestamptz DEFAULT now()     -- ✅ BARU
);

-- Stock Management (Terpisah dari product_variants untuk fleksibilitas lebih)
-- Memungkinkan tracking history, stock movements, dan fitur admin yang lebih detail
CREATE TABLE stock (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  product_id uuid NOT NULL REFERENCES products(id),
  variant_id uuid NULL REFERENCES product_variants(id),
  quantity integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
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
  order_number text UNIQUE NOT NULL,        -- ✅ ORDER: Nomor order unik (ORD-2025-001)
  user_id uuid REFERENCES users(id),        -- ✅ ORDER: Optional, untuk user yang login
  customer_name text NOT NULL,              -- ✅ ORDER: Nama customer
  customer_phone text,                      -- ✅ ORDER: Nomor telepon customer
  customer_address text NOT NULL,           -- ✅ ORDER: Alamat customer
  delivery_option text NOT NULL,            -- ✅ ORDER: 'cod' atau 'delivery'
  total_amount int NOT NULL,                -- ✅ ORDER: Total harga pesanan
  status text NOT NULL DEFAULT 'pending',   -- ✅ ORDER: pending, confirmed, processing, shipped, delivered, cancelled
  whatsapp_message text,                    -- ✅ ORDER: Pesan yang dikirim ke WhatsApp
  admin_notes text,                         -- ✅ ORDER: Catatan internal admin
  payment_status text DEFAULT 'pending',    -- ✅ ORDER: pending, paid, failed
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
  unit_price int NOT NULL,                  -- ✅ ORDER: Harga per unit
  total_price int NOT NULL,                 -- ✅ ORDER: Total harga item (unit_price * quantity)
  ram text,                                 -- ✅ ORDER: Konfigurasi RAM yang dipilih
  ssd text,                                 -- ✅ ORDER: Konfigurasi SSD yang dipilih
  created_at timestamptz DEFAULT now()
);

-- Order Status History
CREATE TABLE order_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id),
  status text NOT NULL,                     -- ✅ ORDER: Status yang diubah
  notes text,                               -- ✅ ORDER: Catatan perubahan status
  changed_by uuid REFERENCES users(id),     -- ✅ ORDER: Admin yang mengubah status
  created_at timestamptz DEFAULT now()
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
CREATE INDEX idx_stock_product ON stock(product_id);
CREATE INDEX idx_stock_variant ON stock(variant_id);
CREATE INDEX idx_settings_key ON settings(key);
CREATE INDEX idx_settings_category ON settings(category);

-- Indexes untuk Order Management
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer ON orders(customer_name, customer_phone);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
CREATE INDEX idx_order_status_history_order ON order_status_history(order_id);
CREATE INDEX idx_order_status_history_created ON order_status_history(created_at);

-- RLS Policies untuk Stock
CREATE POLICY "Users can view stock" 
ON public.stock 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Admins can manage stock" 
ON public.stock 
FOR ALL 
TO public 
USING (EXISTS (SELECT 1 FROM users WHERE (users.id = auth.uid()) AND (users.role = 'admin'::text)));