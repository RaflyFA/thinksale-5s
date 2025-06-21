-- Seed data untuk database Supabase
-- Jalankan script ini di SQL Editor Supabase

-- Insert categories
INSERT INTO categories (id, name, slug, description, image_url, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'ThinkPad', 'thinkpad', 'Laptop bisnis premium dari Lenovo dengan performa tangguh dan keamanan tinggi', '/categories/thinkpad.jpg', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Dell', 'dell', 'Laptop berkualitas tinggi dari Dell dengan desain elegan dan performa optimal', '/categories/dell.jpg', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Gaming', 'gaming', 'Laptop gaming dengan performa tinggi untuk gaming dan multimedia', '/categories/gaming.jpg', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'Student', 'student', 'Laptop terjangkau untuk kebutuhan belajar dan tugas kuliah', '/categories/student.jpg', NOW(), NOW());

-- Insert products
INSERT INTO products (id, name, description, processor, category_id, image_url, images, ram_options, ssd_options, price_range, specs, is_featured, is_best_seller, rating, review_count, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440101', 'Lenovo Slim T470S Silver Edition', 'Lenovo ThinkPad Slim T470S - Performa Tangguh dalam Desain Elegan. Desainnya yang ultra-slim (hanya 18,8 mm) dan berat 1,32 kg dapat dibawa ke mana saja. Finishing silver-nya memberikan kesan elegan dan profesional. Ditenagai prosesor Intel Core i5/i7 dan RAM hingga 12GB, performanya lancar untuk multitasking, kerja harian, atau bahkan editing ringan. Layar 14 Full HD IPS. Fitur keamanannya lengkap, termasuk fingerprint reader dan TPM 2.0 untuk proteksi data. Port-nya beragam: USB-C, Thunderbolt, HDMI, dan dukungan WiFi 6 untuk koneksi stabil. Baterainya tahan lama dan mendukung hot-swapping.', 'Intel Core i5 Gen 7', '550e8400-e29b-41d4-a716-446655440001', '/putih 1.png', ARRAY['/putih 1.png', '/putih 2.png', '/putih 3.png', '/putih 4.png'], ARRAY['8 GB', '12 GB', '16 GB'], ARRAY['128 GB', '256 GB', '512 GB', '1 TB'], '3,8 JT - 5,2 JT', ARRAY['RAM : 8GB >', 'SSD :', '128GB 3.8jt', '256GB 3.9jt', '512GB 4.2jt', '1TB 4.9jt', 'RAM 12GB >', 'SSD : ', '128GB 3.9jt', '256GB 4jt', '512GB 4.3jt', '1TB 5jt', 'RAM 16GB >', 'SSD :', '128GB 4jt', '256GB 4.1jt', '512GB 4.5jt', '1TB 5.1jt'], true, true, 4.8, 127, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440102', 'Lenovo Yoga Touchscreen', 'Lenovo Yoga Touchscreen hadir dengan desain convertible dan layar sentuh elegan yang bikin kamu tampil beda. Ditenagai Intel Core i5 Gen 8 dan RAM 8GB, multitasking jadi lancar. SSD sampai 1TB bikin penyimpanan lega. Cocok buat kamu yang produktif, kreatif, dan pengin tampil stylish!', 'Intel Core i5 Gen 8', '550e8400-e29b-41d4-a716-446655440001', '/lenovo yoga.png', ARRAY['/lenovo yoga.png', '/lenovo yoga 1.png', '/lenovo yoga 2.png'], ARRAY['8 GB'], ARRAY['128 GB', '256 GB', '512 GB', '1 TB'], '3,5 JT - 4,6 JT', ARRAY['RAM : 8GB >', 'SSD :', '128GB 3.5jt', '256GB 3.6jt', '512GB 3.9jt', '1TB 4.6jt'], true, false, 4.6, 89, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440103', 'Lenovo T460 Dual VGA NVIDIA', 'Laptop tangguh untuk kerja berat! Lenovo T460 dilengkapi prosesor Core i7 Gen 6 dan VGA NVIDIA untuk performa visual maksimal. RAM hingga 16GB dan SSD sampai 1TB bikin multitasking dan penyimpanan makin lega. Cocok buat kamu yang suka editing, desain, atau sekadar ngerjain tugas berat tanpa lemot.', 'Core i7 Gen 6', '550e8400-e29b-41d4-a716-446655440001', '/lenovo hitam.png', ARRAY['/lenovo hitam 1.png', '/lenovo hitam 2.png', '/lenovo hitam 3.jpg', '/lenovo hitam 4.jpg'], ARRAY['4 GB', '8 GB', '16 GB'], ARRAY['128 GB', '256 GB', '512 GB', '1 TB'], '3,5 JT - 5,2 JT', ARRAY['RAM : 4GB >', ' SSD :', '- 128GB 3.5jt', '- 256GB 3.6jt', '- 512GB 3.9jt', '- 1TB 4.5jt', 'RAM 8GB >', 'SSD : ', '- 128GB 3.8jt', '- 256GB 3.9jt', '- 512GB 4.2jt', '- 1TB 4.9jt', 'RAM 16GB >', 'SSD :', '- 128GB 4.1jt', '- 256GB 4.2jt', '- 512GB 4.5jt', '- 1TB 5.2jt'], false, true, 4.7, 156, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440104', 'Lenovo X1 Carbon i5 Gen 6', 'Tipis dan ringan. Lenovo X1 Carbon dengan prosesor i5 Gen 6 dan RAM 8GB siap nemenin aktivitas produktif kamu. Cocok banget buat kamu yang mobile dan butuh performa cepat. SSD 128GB atau 256GB bikin loading cepet tanpa nunggu lama.', 'X1 i5 Gen 6', '550e8400-e29b-41d4-a716-446655440001', '/Lenovo X1 Carbon i5 gen 6 .png', ARRAY['/Lenovo X1 Carbon i5 gen 6 .png', '/Lenovo X1 Carbon i5 gen 6 (1).jpg'], ARRAY['8 GB'], ARRAY['128 GB', '256 GB'], '3.8 JT & 3.9 JT', ARRAY['RAM : 8GB >', 'SSD :', '- 128GB 3.8jt', '- 256GB 3.9jt'], true, false, 4.5, 78, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440105', 'Lenovo X1 Carbon i7 Gen 6', 'Lenovo X1 Carbon i7 Gen 6. Performa kencang dari RAM 8GB/16GB dan SSD hingga 256GB bikin multitasking anti-lag. Desain tipis dan premium bikin kamu tampil profesional kampus. Cocok untuk editing, presentasi, atau kerja berat lainnya.', 'X1 i7 Gen 6', '550e8400-e29b-41d4-a716-446655440001', '/X1 i7 Gen 6-copy.jpg', ARRAY['/X1 i7 Gen 6.jpg', '/X1 i7 Gen 6(1).jpg'], ARRAY['8 GB', '16 GB'], ARRAY['128 GB', '256 GB'], '4.4 JT - 4.8 JT', ARRAY['RAM : 8GB >', 'SSD :', '- 128GB 4.4jt', '- 256GB 4.5jt', 'RAM : 16GB >', 'SSD :', '- 128GB 4.7jt', '- 256GB 4.8jt'], false, true, 4.9, 203, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440106', 'Lenovo X1 Carbon i7 Gen 5', 'Dengan prosesor tangguh, RAM 8GB, dan SSD sampai 256GB, laptop ini siap temani kamu kerja cepat dan efisien. Desain tipis dan ringan.', 'X1 i7 Gen 5', '550e8400-e29b-41d4-a716-446655440001', '/Lenovo X1 Carbon i7 Gen 5.jpg', ARRAY['/Lenovo X1 Carbon i7 Gen 5.jpg', '/Lenovo X1 Carbon i7 Gen 5(1).jpg'], ARRAY['8 GB'], ARRAY['128 GB', '256 GB'], '4.1 JT & 4.2 JT', ARRAY['RAM : 8GB >', 'SSD :', '- 128GB 4.1jt', '- 256GB 4.2jt'], false, false, 4.3, 45, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440201', 'Dell Latitude 5410', 'Dell Latitude 5410 - Laptop bisnis premium dengan performa tangguh dan keamanan enterprise. Ditenagai Intel Core i5/i7 dan RAM hingga 16GB, cocok untuk kebutuhan bisnis dan profesional. Dilengkapi dengan fitur keamanan Dell Data Protection dan dukungan docking station.', 'Intel Core i5 Gen 10', '550e8400-e29b-41d4-a716-446655440002', '/dell-latitude-5410.jpg', ARRAY['/dell-latitude-5410.jpg', '/dell-latitude-5410-2.jpg'], ARRAY['8 GB', '16 GB'], ARRAY['256 GB', '512 GB', '1 TB'], '4,2 JT - 5,5 JT', ARRAY['RAM : 8GB >', 'SSD :', '256GB 4.2jt', '512GB 4.8jt', '1TB 5.2jt', 'RAM 16GB >', 'SSD :', '256GB 4.5jt', '512GB 5.1jt', '1TB 5.5jt'], true, true, 4.7, 134, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440202', 'Dell XPS 13', 'Dell XPS 13 - Laptop ultrabook premium dengan desain InfinityEdge bezel-less display. Performa tinggi dengan Intel Core i7 dan RAM 16GB, cocok untuk kreator dan profesional. Layar 13.4" 4K UHD dengan warna yang akurat.', 'Intel Core i7 Gen 11', '550e8400-e29b-41d4-a716-446655440002', '/dell-xps-13.jpg', ARRAY['/dell-xps-13.jpg', '/dell-xps-13-2.jpg'], ARRAY['8 GB', '16 GB'], ARRAY['256 GB', '512 GB', '1 TB'], '6,5 JT - 8,2 JT', ARRAY['RAM : 8GB >', 'SSD :', '256GB 6.5jt', '512GB 7.2jt', '1TB 7.8jt', 'RAM 16GB >', 'SSD :', '256GB 7.1jt', '512GB 7.8jt', '1TB 8.2jt'], true, false, 4.9, 189, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440301', 'ASUS ROG Strix G15', 'ASUS ROG Strix G15 - Laptop gaming dengan performa tinggi. Ditenagai AMD Ryzen 7 dan NVIDIA RTX 3060, cocok untuk gaming AAA dan streaming. Dilengkapi dengan layar 15.6" 144Hz dan RGB keyboard.', 'AMD Ryzen 7 5800H', '550e8400-e29b-41d4-a716-446655440003', '/asus-rog-strix-g15.jpg', ARRAY['/asus-rog-strix-g15.jpg', '/asus-rog-strix-g15-2.jpg'], ARRAY['8 GB', '16 GB'], ARRAY['512 GB', '1 TB'], '8,5 JT - 10,2 JT', ARRAY['RAM : 8GB >', 'SSD :', '512GB 8.5jt', '1TB 9.2jt', 'RAM 16GB >', 'SSD :', '512GB 9.5jt', '1TB 10.2jt'], false, true, 4.8, 267, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440401', 'Acer Aspire 5', 'Acer Aspire 5 - Laptop terjangkau untuk kebutuhan belajar dan tugas kuliah. Ditenagai Intel Core i3 dan RAM 4GB, cocok untuk browsing, office, dan tugas ringan. Dilengkapi dengan SSD untuk performa yang lebih cepat.', 'Intel Core i3 Gen 10', '550e8400-e29b-41d4-a716-446655440004', '/acer-aspire-5.jpg', ARRAY['/acer-aspire-5.jpg', '/acer-aspire-5-2.jpg'], ARRAY['4 GB', '8 GB'], ARRAY['128 GB', '256 GB'], '2,8 JT - 3,5 JT', ARRAY['RAM : 4GB >', 'SSD :', '128GB 2.8jt', '256GB 3.1jt', 'RAM 8GB >', 'SSD :', '128GB 3.2jt', '256GB 3.5jt'], false, false, 4.2, 56, NOW(), NOW());

-- Insert product variants
INSERT INTO product_variants (id, product_id, ram, ssd, price, stock, created_at, updated_at) VALUES
-- Lenovo T470S variants
('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440101', '8 GB', '128 GB', 3800000, 15, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440101', '8 GB', '256 GB', 3900000, 12, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440101', '8 GB', '512 GB', 4200000, 8, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440204', '550e8400-e29b-41d4-a716-446655440101', '8 GB', '1 TB', 4900000, 5, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440205', '550e8400-e29b-41d4-a716-446655440101', '12 GB', '128 GB', 3900000, 10, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440206', '550e8400-e29b-41d4-a716-446655440101', '12 GB', '256 GB', 4000000, 8, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440207', '550e8400-e29b-41d4-a716-446655440101', '12 GB', '512 GB', 4300000, 6, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440208', '550e8400-e29b-41d4-a716-446655440101', '12 GB', '1 TB', 5000000, 4, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440209', '550e8400-e29b-41d4-a716-446655440101', '16 GB', '128 GB', 4000000, 7, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440210', '550e8400-e29b-41d4-a716-446655440101', '16 GB', '256 GB', 4100000, 6, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440211', '550e8400-e29b-41d4-a716-446655440101', '16 GB', '512 GB', 4500000, 4, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440212', '550e8400-e29b-41d4-a716-446655440101', '16 GB', '1 TB', 5200000, 3, NOW(), NOW()),

-- Lenovo Yoga variants
('550e8400-e29b-41d4-a716-446655440213', '550e8400-e29b-41d4-a716-446655440102', '8 GB', '128 GB', 3500000, 20, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440214', '550e8400-e29b-41d4-a716-446655440102', '8 GB', '256 GB', 3600000, 15, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440215', '550e8400-e29b-41d4-a716-446655440102', '8 GB', '512 GB', 3900000, 10, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440216', '550e8400-e29b-41d4-a716-446655440102', '8 GB', '1 TB', 4600000, 8, NOW(), NOW()),

-- Lenovo T460 variants
('550e8400-e29b-41d4-a716-446655440217', '550e8400-e29b-41d4-a716-446655440103', '4 GB', '128 GB', 3500000, 25, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440218', '550e8400-e29b-41d4-a716-446655440103', '4 GB', '256 GB', 3600000, 20, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440219', '550e8400-e29b-41d4-a716-446655440103', '4 GB', '512 GB', 3900000, 15, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440220', '550e8400-e29b-41d4-a716-446655440103', '4 GB', '1 TB', 4500000, 10, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440221', '550e8400-e29b-41d4-a716-446655440103', '8 GB', '128 GB', 3800000, 18, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440222', '550e8400-e29b-41d4-a716-446655440103', '8 GB', '256 GB', 3900000, 15, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440223', '550e8400-e29b-41d4-a716-446655440103', '8 GB', '512 GB', 4200000, 12, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440224', '550e8400-e29b-41d4-a716-446655440103', '8 GB', '1 TB', 4900000, 8, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440225', '550e8400-e29b-41d4-a716-446655440103', '16 GB', '128 GB', 4100000, 10, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440226', '550e8400-e29b-41d4-a716-446655440103', '16 GB', '256 GB', 4200000, 8, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440227', '550e8400-e29b-41d4-a716-446655440103', '16 GB', '512 GB', 4500000, 6, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440228', '550e8400-e29b-41d4-a716-446655440103', '16 GB', '1 TB', 5200000, 4, NOW(), NOW()),

-- X1 Carbon i5 variants
('550e8400-e29b-41d4-a716-446655440229', '550e8400-e29b-41d4-a716-446655440104', '8 GB', '128 GB', 3800000, 12, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440230', '550e8400-e29b-41d4-a716-446655440104', '8 GB', '256 GB', 3900000, 10, NOW(), NOW()),

-- X1 Carbon i7 Gen 6 variants
('550e8400-e29b-41d4-a716-446655440231', '550e8400-e29b-41d4-a716-446655440105', '8 GB', '128 GB', 4400000, 8, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440232', '550e8400-e29b-41d4-a716-446655440105', '8 GB', '256 GB', 4500000, 6, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440233', '550e8400-e29b-41d4-a716-446655440105', '16 GB', '128 GB', 4700000, 5, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440234', '550e8400-e29b-41d4-a716-446655440105', '16 GB', '256 GB', 4800000, 4, NOW(), NOW()),

-- X1 Carbon i7 Gen 5 variants
('550e8400-e29b-41d4-a716-446655440235', '550e8400-e29b-41d4-a716-446655440106', '8 GB', '128 GB', 4100000, 15, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440236', '550e8400-e29b-41d4-a716-446655440106', '8 GB', '256 GB', 4200000, 12, NOW(), NOW()),

-- Dell Latitude variants
('550e8400-e29b-41d4-a716-446655440237', '550e8400-e29b-41d4-a716-446655440201', '8 GB', '256 GB', 4200000, 10, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440238', '550e8400-e29b-41d4-a716-446655440201', '8 GB', '512 GB', 4800000, 8, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440239', '550e8400-e29b-41d4-a716-446655440201', '8 GB', '1 TB', 5200000, 5, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440240', '550e8400-e29b-41d4-a716-446655440201', '16 GB', '256 GB', 4500000, 7, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440241', '550e8400-e29b-41d4-a716-446655440201', '16 GB', '512 GB', 5100000, 6, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440242', '550e8400-e29b-41d4-a716-446655440201', '16 GB', '1 TB', 5500000, 4, NOW(), NOW()),

-- Dell XPS 13 variants
('550e8400-e29b-41d4-a716-446655440243', '550e8400-e29b-41d4-a716-446655440202', '8 GB', '256 GB', 6500000, 6, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440244', '550e8400-e29b-41d4-a716-446655440202', '8 GB', '512 GB', 7200000, 5, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440245', '550e8400-e29b-41d4-a716-446655440202', '8 GB', '1 TB', 7800000, 3, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440246', '550e8400-e29b-41d4-a716-446655440202', '16 GB', '256 GB', 7100000, 4, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440247', '550e8400-e29b-41d4-a716-446655440202', '16 GB', '512 GB', 7800000, 3, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440248', '550e8400-e29b-41d4-a716-446655440202', '16 GB', '1 TB', 8200000, 2, NOW(), NOW()),

-- ASUS ROG Strix variants
('550e8400-e29b-41d4-a716-446655440249', '550e8400-e29b-41d4-a716-446655440301', '8 GB', '512 GB', 8500000, 8, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440250', '550e8400-e29b-41d4-a716-446655440301', '8 GB', '1 TB', 9200000, 6, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440251', '550e8400-e29b-41d4-a716-446655440301', '16 GB', '512 GB', 9500000, 5, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440252', '550e8400-e29b-41d4-a716-446655440301', '16 GB', '1 TB', 10200000, 4, NOW(), NOW()),

-- Acer Aspire variants
('550e8400-e29b-41d4-a716-446655440253', '550e8400-e29b-41d4-a716-446655440401', '4 GB', '128 GB', 2800000, 30, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440254', '550e8400-e29b-41d4-a716-446655440401', '4 GB', '256 GB', 3100000, 25, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440255', '550e8400-e29b-41d4-a716-446655440401', '8 GB', '128 GB', 3200000, 20, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440256', '550e8400-e29b-41d4-a716-446655440401', '8 GB', '256 GB', 3500000, 18, NOW(), NOW()); 