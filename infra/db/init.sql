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


--------------------------------------------------------
-- TABELA: volantes (catálogo de tipos de volante)
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS volantes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,

  codigo VARCHAR(50) NOT NULL,
  descricao VARCHAR(255) NOT NULL,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_volantes_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),

  CONSTRAINT uq_volantes_codigo UNIQUE (tenant_id, codigo)
);

CREATE INDEX IF NOT EXISTS idx_volantes_tenant ON volantes(tenant_id);


--------------------------------------------------------
-- SEED: volantes iniciais para EV Volantes
--------------------------------------------------------

INSERT INTO volantes (tenant_id, codigo, descricao) VALUES 
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'EVR11', 'VOL GM ONIX AB - APLIQUE'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'EVR12', 'VOL GM ONIX AB - PU'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'EVR13', 'VOL GM COBALT AB - APLIQUE'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'EVR14', 'VOL GM COBALT AB - PU'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'EVR15', 'VOL GM CELTA NOVO'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'EVR16', 'VOL GM PRISMA'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'EVR17', 'VOL GM AGILE AB'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'EVR18', 'VOL GM ONIX CONTROLE'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'EVR19', 'VOL GM SPIN CONTROLE'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'EVR21', 'VOL FIAT UNO FIRE'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'EVR22', 'VOL FIAT VIVACE'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'EVR23', 'VOL FIAT IDEA AB'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'EVR24', 'VOL FIAT PALIO NOVO'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'EVR31', 'VOL FORD NEW KA'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'EVR32', 'VOL FORD FIESTA 2003'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'EVR33', 'VOL FORD ECO SPORT AB'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'EVR41', 'VOL RENAULT LOGAN 3 TRAVAS'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'EVR42', 'VOL RENAULT SANDERO'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'EVR51', 'VOL VW VOYAGE'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'EVR52', 'VOL VW GOL G4'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'EVR53', 'VOL VW GOL G5'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'EVR54', 'VOL VW GOL G7'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'EVR55', 'VOL VW GOL G6 TRÊS TRAVAS'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'EVR56', 'VOL VW GOL G6 DUAS TRAVAS'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'EVR57', 'VOL VW DELIVERY/CONSTELLATION'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'EVR61', 'VOL HYUNDAI HB20'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'EVR71', 'VOL MB 1620 PEQUENO'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'EVR72', 'VOL MB ATRON/EURO');


--------------------------------------------------------
-- TABELA: orders (pedidos do cliente)
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  client_user_id UUID NOT NULL,

  volante_id UUID NOT NULL,         
  numero_nota_fiscal VARCHAR(50) NOT NULL, 
  quantidade INT NOT NULL DEFAULT 1,

  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_orders_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),

  CONSTRAINT fk_orders_user
    FOREIGN KEY (client_user_id) REFERENCES users(id),

  CONSTRAINT fk_orders_volante
    FOREIGN KEY (volante_id) REFERENCES volantes(id)
);

CREATE INDEX IF NOT EXISTS idx_orders_tenant ON orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_orders_volante ON orders(volante_id);




