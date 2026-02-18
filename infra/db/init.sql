-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--------------------------------------------------------
-- TABELA: tenants
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

--------------------------------------------------------
-- TABELA: users
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'client',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_users_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);

--------------------------------------------------------
-- TABELA: orders
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  client_user_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_orders_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),

  CONSTRAINT fk_orders_user
    FOREIGN KEY (client_user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_orders_tenant ON orders(tenant_id);

--------------------------------------------------------
-- SEED: Tenant EV Volantes
--------------------------------------------------------
INSERT INTO tenants (id, name)
VALUES ('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'EV Volantes')
ON CONFLICT DO NOTHING;

--------------------------------------------------------
-- SEED: Usuário Administrador EV Volantes
--------------------------------------------------------
INSERT INTO users (id, tenant_id, name, email, password, role)
VALUES (
  'd4b3629f-12cf-4d8d-91c1-0bf671a95190',
  '3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab',
  'Administrador EV Volantes',
  'admin@evvolantes.com',
  'admin123',   -- senha em texto puro para o protótipo
  'admin'
)
ON CONFLICT DO NOTHING;

--------------------------------------------------------
-- SEED: Usuário Cliente EV Volantes
--------------------------------------------------------
INSERT INTO users (id, tenant_id, name, email, password, role)
VALUES (
  '5b458932-66ed-43b4-b9f9-4c55a13aa218',
  '3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab',
  'Cliente EV Volantes',
  'cliente@evvolantes.com',
  'cliente123',  -- senha em texto puro para o protótipo
  'client'
)
ON CONFLICT DO NOTHING;
