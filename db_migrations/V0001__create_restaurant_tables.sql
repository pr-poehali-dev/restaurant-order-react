-- Create dishes table
CREATE TABLE t_p30410520_restaurant_order_rea.dishes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    old_price DECIMAL(10, 2),
    image VARCHAR(500),
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE t_p30410520_restaurant_order_rea.orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE t_p30410520_restaurant_order_rea.order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES t_p30410520_restaurant_order_rea.orders(id),
    dish_id INTEGER REFERENCES t_p30410520_restaurant_order_rea.dishes(id),
    dish_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Insert sample dishes
INSERT INTO t_p30410520_restaurant_order_rea.dishes (name, description, price, old_price, image, category) VALUES
('Caesar Salad', 'Fresh romaine lettuce with parmesan, croutons and Caesar dressing', 12.99, 15.99, 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=400&fit=crop', 'Salads'),
('Margherita Pizza', 'Classic Italian pizza with tomato, mozzarella and fresh basil', 18.99, NULL, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop', 'Main Courses'),
('Grilled Salmon', 'Premium salmon fillet with vegetables and lemon butter sauce', 24.99, NULL, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop', 'Main Courses'),
('Chocolate Lava Cake', 'Warm chocolate cake with molten center and vanilla ice cream', 8.99, NULL, 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=400&fit=crop', 'Desserts'),
('Greek Salad', 'Tomatoes, cucumbers, olives, feta cheese with olive oil', 11.99, NULL, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=400&fit=crop', 'Salads'),
('Beef Burger', 'Juicy beef patty with cheese, lettuce, tomato and special sauce', 16.99, 19.99, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop', 'Main Courses');