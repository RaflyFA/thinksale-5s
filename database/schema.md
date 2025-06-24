CREATE TABLE public.carts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT carts_pkey PRIMARY KEY (id),
  CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id)
) TABLESPACE pg_default;

CREATE TABLE public.cart_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  cart_id uuid NULL,
  product_id uuid NULL,
  variant_id uuid NULL,
  quantity integer NOT NULL,
  CONSTRAINT cart_items_pkey PRIMARY KEY (id),
  CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES carts(id),
  CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT cart_items_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES product_variants(id)
) TABLESPACE pg_default;

CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  image text NOT NULL,
  CONSTRAINT categories_pkey PRIMARY KEY (id),
  CONSTRAINT categories_slug_key UNIQUE (slug)
) TABLESPACE pg_default;

CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NULL,
  product_id uuid NULL,
  variant_id uuid NULL,
  quantity integer NOT NULL,
  unit_price integer NOT NULL,
  total_price integer NOT NULL,
  ram text NULL,
  ssd text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT order_items_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES product_variants(id)
) TABLESPACE pg_default;

CREATE TABLE public.order_status_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NULL,
  status text NOT NULL,
  notes text NULL,
  changed_by uuid NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT order_status_history_pkey PRIMARY KEY (id),
  CONSTRAINT order_status_history_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES users(id),
  CONSTRAINT order_status_history_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_number text NOT NULL,
  user_id uuid NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text NOT NULL,
  delivery_option text NOT NULL,
  total_amount integer NOT NULL,
  status text NOT NULL DEFAULT 'pending'::text,
  whatsapp_message text NULL,
  admin_notes text NULL,
  payment_status text NULL DEFAULT 'pending'::text,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_order_number_key UNIQUE (order_number),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id)
) TABLESPACE pg_default;

CREATE TABLE public.product_variants (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id uuid NULL,
  ram text NULL,
  ssd text NULL,
  price integer NULL,
  stock integer NULL DEFAULT 0,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  discount_percentage integer NULL DEFAULT 0,
  discount_start_date timestamp with time zone NULL,
  discount_end_date timestamp with time zone NULL,
  is_discount_active boolean NULL DEFAULT false,
  CONSTRAINT product_variants_pkey PRIMARY KEY (id),
  CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id)
) TABLESPACE pg_default;

CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category_id uuid NULL,
  processor text NOT NULL,
  description text NULL,
  image text NULL,
  images text[] NULL,
  ram_options text[] NULL,
  ssd_options text[] NULL,
  price_range text NULL,
  specs text[] NULL,
  rating double precision NULL,
  review_count integer NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  is_featured boolean NULL DEFAULT false,
  is_best_seller boolean NULL DEFAULT false,
  discount_percentage integer NULL DEFAULT 0,
  discount_start_date timestamp with time zone NULL,
  discount_end_date timestamp with time zone NULL,
  is_discount_active boolean NULL DEFAULT false,
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(id)
) TABLESPACE pg_default;

CREATE TABLE public.settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  key text NOT NULL,
  value text NULL,
  type text NOT NULL DEFAULT 'string'::text,
  category text NOT NULL DEFAULT 'general'::text,
  description text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT settings_pkey PRIMARY KEY (id),
  CONSTRAINT settings_key_key UNIQUE (key)
) TABLESPACE pg_default;

<!-- CREATE TABLE public.stock (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  product_id uuid NOT NULL,
  variant_id uuid NULL,
  quantity integer NOT NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT stock_pkey PRIMARY KEY (id),
  CONSTRAINT stock_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT stock_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES product_variants(id)
) TABLESPACE pg_default; -->

CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  password text NOT NULL,
  role text NOT NULL DEFAULT 'user'::text,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  image text NULL,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_email_key UNIQUE (email)
) TABLESPACE pg_default;