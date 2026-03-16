-- 📁 auth-service/init.sql
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50) UNIQUE NOT NULL,
  email         VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20) DEFAULT 'member',
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Seed ข้อมูล Admin/User สำหรับทดสอบที่นี่ที่เดียว
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@lab.local', '$2b$10$P9Z9P9S9XyG3V.A.W.vBeM7vQ7.v7N6G6M3N6M3N6M3N6M3N6M3N', 'admin'),
('alice', 'alice@lab.local', '$2b$10$B00T7P7S9XyG3V.A.W.vBeM7vQ7.v7N6G6M3N6M3N6M3N6M3N6M3N', 'member')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS logs (
  id SERIAL PRIMARY KEY,
  level VARCHAR(10) NOT NULL,
  event VARCHAR(100) NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);