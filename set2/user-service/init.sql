CREATE TABLE IF NOT EXISTS user_profiles (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  username     VARCHAR(50),
  email        VARCHAR(100),
  role         VARCHAR(20) DEFAULT 'user',
  display_name VARCHAR(100),
  bio          TEXT,
  avatar_url   VARCHAR(255),
  created_at   TIMESTAMP DEFAULT NOW(),
  updated_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS logs (
  id         SERIAL PRIMARY KEY,
  level      VARCHAR(10)  NOT NULL,
  event      VARCHAR(100) NOT NULL,
  user_id    INTEGER,
  message    TEXT,
  meta       JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();