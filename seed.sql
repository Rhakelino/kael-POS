-- Clean existing products to sync with full catalog
DELETE FROM products;

-- Ensure categories exist
INSERT OR IGNORE INTO categories (id, name, icon, sort_order, is_active, created_at) VALUES
('cat-coffee', 'Coffee', 'coffee', 1, 1, 1785663615000),
('cat-noncoffee', 'Non-Coffee', 'local_bar', 2, 1, 1785663615000),
('cat-food', 'Food', 'restaurant', 3, 1, 1785663615000),
('cat-dessert', 'Dessert', 'cake', 4, 1, 1785663615000);

-- Insert all 9 items matching local uploads
INSERT INTO products (id, category_id, name, price, sku, image_url, description, is_active, created_at, updated_at) VALUES
('prod-1', 'cat-coffee', 'Americano', 18000, 'COF-001', '/uploads/americano.jpeg', 'Espresso dengan air panas atau es', 1, 1785663615000, 1785663615000),
('prod-2', 'cat-coffee', 'Cafe Latte', 20000, 'COF-002', '/uploads/cafe latte.jpeg', 'Espresso lembut dengan susu steamed', 1, 1785663615000, 1785663615000),
('prod-3', 'cat-coffee', 'Cappuccino', 20000, 'COF-003', '/uploads/cappucino.jpeg', 'Espresso dengan foam susu tebal', 1, 1785663615000, 1785663615000),
('prod-4', 'cat-noncoffee', 'Matcha Latte', 20000, 'NCF-001', '/uploads/matcha.jpeg', 'Matcha Jepang dengan susu segar', 1, 1785663615000, 1785663615000),
('prod-5', 'cat-noncoffee', 'Chocolate Milk', 20000, 'NCF-002', '/uploads/chocolate milk.jpeg', 'Cokelat kaya rasa dengan susu hangat', 1, 1785663615000, 1785663615000),
('prod-6', 'cat-noncoffee', 'Iced Tea', 10000, 'NCF-003', '/uploads/iced tea.jpeg', 'Teh manis dingin menyegarkan', 1, 1785663615000, 1785663615000),
('prod-7', 'cat-food', 'Nasi Goreng', 15000, 'FOD-001', '/uploads/nasi-goreng.jpeg', 'Nasi goreng khas cafe dengan telur', 1, 1785663615000, 1785663615000),
('prod-8', 'cat-food', 'Croissant', 18000, 'BAK-001', '/uploads/croissant.jpeg', 'Roti croissant mentega yang renyah', 1, 1785663615000, 1785663615000),
('prod-9', 'cat-dessert', 'Cheesecake', 22000, 'DST-001', '/uploads/cheescake.jpeg', 'Kue keju lembut manis khas New York', 1, 1785663615000, 1785663615000);