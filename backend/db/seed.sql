-- Demo Data Seed for FinTrack

-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Demo User
INSERT INTO users (id, name, email, password) VALUES 
(gen_random_uuid(), 'Demo User', 'demo@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi') -- password: 'password'
ON CONFLICT (email) DO NOTHING;

-- Demo Transactions (for demo@example.com)
INSERT INTO transactions (id, user_id, amount, type, category, date) VALUES
(gen_random_uuid(), (SELECT id FROM users WHERE email='demo@example.com'), 5000.00, 'income', 'Salary', '2024-09-01'),
(gen_random_uuid(), (SELECT id FROM users WHERE email='demo@example.com'), 1200.00, 'expense', 'Rent', '2024-09-05'),
(gen_random_uuid(), (SELECT id FROM users WHERE email='demo@example.com'), 300.00, 'expense', 'Groceries', '2024-09-10'),
(gen_random_uuid(), (SELECT id FROM users WHERE email='demo@example.com'), 150.00, 'expense', 'Utilities', '2024-09-15'),
(gen_random_uuid(), (SELECT id FROM users WHERE email='demo@example.com'), 800.00, 'income', 'Freelance', '2024-09-20'),
(gen_random_uuid(), (SELECT id FROM users WHERE email='demo@example.com'), 200.00, 'expense', 'Dining', '2024-09-25')
ON CONFLICT DO NOTHING;

-- Demo Budgets
INSERT INTO budgets (id, user_id, month, "limit") VALUES
(gen_random_uuid(), (SELECT id FROM users WHERE email='demo@example.com'), '2024-09-01', 2500.00)
ON CONFLICT DO NOTHING;

-- Demo Investments
INSERT INTO investments (id, user_id, principal, rate, duration, current_value) VALUES
(gen_random_uuid(), (SELECT id FROM users WHERE email='demo@example.com'), 10000.00, 7.5, 5, 12500.00),
(gen_random_uuid(), (SELECT id FROM users WHERE email='demo@example.com'), 5000.00, 12.0, 3, 6200.00)
ON CONFLICT DO NOTHING;

SELECT 'Demo data seeded! Login: demo@example.com / password' as message;
