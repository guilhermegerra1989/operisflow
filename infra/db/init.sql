--------------------------------------------------------
-- EXTENSÃO UUID
--------------------------------------------------------
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
-- TABELA: marcas (ex: Chevrolet, Fiat, etc)
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS marcas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,

  nome VARCHAR(255) NOT NULL,
  descricao TEXT,

  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_marcas_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

CREATE INDEX IF NOT EXISTS idx_marcas_tenant ON marcas(tenant_id);

--------------------------------------------------------
-- TABELA: rotas
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS rotas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,

  nome VARCHAR(255) NOT NULL,
  descricao TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_rotas_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

CREATE INDEX IF NOT EXISTS idx_rotas_tenant ON rotas(tenant_id);

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
  rota_id UUID NULL,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_users_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),

  CONSTRAINT fk_users_rota
    FOREIGN KEY (rota_id) REFERENCES rotas(id)
);

CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);

--------------------------------------------------------
-- TABELA: volantes (catálogo de tipos de volante)
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS volantes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,

  marca_id UUID NOT NULL,  -- NOVO CAMPO: referência a marcas

  codigo VARCHAR(50) NOT NULL,
  descricao VARCHAR(255) NOT NULL,

  img VARCHAR(255) NOT NULL DEFAULT '/volantes/',

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_volantes_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),

  CONSTRAINT fk_volantes_marca
    FOREIGN KEY (marca_id) REFERENCES marcas(id),

  CONSTRAINT uq_volantes_codigo UNIQUE (tenant_id, codigo)
);

CREATE INDEX IF NOT EXISTS idx_volantes_tenant ON volantes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_volantes_marca ON volantes(marca_id);

--------------------------------------------------------
-- TABELA: orders (cabeçalho do pedido - SEM nota fiscal)
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  client_user_id UUID NOT NULL,
  numero_pedido INTEGER,

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
CREATE INDEX IF NOT EXISTS idx_orders_client ON orders(client_user_id);

--------------------------------------------------------
-- TABELA: order_items (itens do pedido)
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL,
  tenant_id UUID NOT NULL,

  volante_id UUID NOT NULL,
  quantidade INT NOT NULL DEFAULT 1,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_orderitems_order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,

  CONSTRAINT fk_orderitems_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),

  CONSTRAINT fk_orderitems_volante
    FOREIGN KEY (volante_id) REFERENCES volantes(id)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_tenant ON order_items(tenant_id);
CREATE INDEX IF NOT EXISTS idx_order_items_volante ON order_items(volante_id);

--------------------------------------------------------
-- SEEDS
--------------------------------------------------------

--------------------------------------------------------
-- SEED: Tenant EV Volantes
--------------------------------------------------------
INSERT INTO tenants (id, name)
VALUES ('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'EV Volantes')
ON CONFLICT (id) DO NOTHING;

--------------------------------------------------------
-- SEED: Marcas para EV Volantes
--------------------------------------------------------
INSERT INTO marcas (id, tenant_id, nome, descricao) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
 '3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab',
 'Chevrolet', 'Veículos da marca Chevrolet / GM'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
 '3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab',
 'Fiat', 'Veículos da marca Fiat'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
 '3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab',
 'Ford', 'Veículos da marca Ford'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',
 '3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab',
 'Renault', 'Veículos da marca Renault'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5',
 '3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab',
 'Volkswagen', 'Veículos da marca Volkswagen'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6',
 '3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab',
 'Hyundai', 'Veículos da marca Hyundai'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa7',
 '3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab',
 'Mercedes-Benz', 'Veículos da marca Mercedes-Benz')
ON CONFLICT (id) DO NOTHING;

--------------------------------------------------------
-- SEED: Rotas (Padrão, Sul, Centro Oeste)
--------------------------------------------------------
INSERT INTO rotas (id, tenant_id, nome, descricao) VALUES
('11111111-1111-1111-1111-111111111111',
 '3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab',
 'Rota Padrão', 'Rota inicial do sistema'),
('22222222-2222-2222-2222-222222222222',
 '3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab',
 'Rota Sul', 'Região Sul do Brasil'),
('33333333-3333-3333-3333-333333333333',
 '3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab',
 'Rota Centro Oeste', 'Região Centro Oeste do Brasil')
ON CONFLICT (id) DO NOTHING;

--------------------------------------------------------
-- SEED: Usuário Administrador EV Volantes
--------------------------------------------------------
INSERT INTO users (id, tenant_id, name, email, password, role, rota_id)
VALUES (
  'd4b3629f-12cf-4d8d-91c1-0bf671a95190',
  '3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab',
  'Administrador EV Volantes',
  'admin@evvolantes.com',
  'admin123',            -- para protótipo; em produção usar hash
  'admin',
  '11111111-1111-1111-1111-111111111111'
)
ON CONFLICT (id) DO NOTHING;

--------------------------------------------------------
-- SEED: Usuário Cliente EV Volantes
--------------------------------------------------------
INSERT INTO users (id, tenant_id, name, email, password, role, rota_id)
VALUES (
  '5b458932-66ed-43b4-b9f9-4c55a13aa218',
  '3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab',
  'Cliente EV Volantes',
  'cliente@evvolantes.com',
  'cliente123',          -- para protótipo; em produção usar hash
  'client',
  '11111111-1111-1111-1111-111111111111'
)
ON CONFLICT (id) DO NOTHING;

--------------------------------------------------------
-- SEED: Volantes iniciais para EV Volantes
-- Agora com marca_id preenchido
--------------------------------------------------------
INSERT INTO volantes (tenant_id, marca_id, codigo, descricao, img) VALUES 

-- Chevrolet / GM
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'EVR11', 'VOL GM ONIX AB - APLIQUE','/volantes/CHEVROLET/EVR11.png'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'EVR12', 'VOL GM ONIX AB - PU','/volantes/CHEVROLET/EVR12.png'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'EVR13', 'VOL GM COBALT AB - APLIQUE','/volantes/CHEVROLET/EVR13.png'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'EVR14', 'VOL GM COBALT AB - PU','/volantes/CHEVROLET/EVR14.png'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'EVR15', 'VOL GM CELTA NOVO','/volantes/CHEVROLET/EVR15.png'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'EVR16', 'VOL GM PRISMA','/volantes/CHEVROLET/EVR16.png'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'EVR17', 'VOL GM AGILE AB','/volantes/CHEVROLET/EVR17.png'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'EVR18', 'VOL GM ONIX CONTROLE','/volantes/CHEVROLET/EVR18.png'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'EVR19', 'VOL GM SPIN CONTROLE','/volantes/CHEVROLET/EVR19.png'),

-- Fiat
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'EVR21', 'VOL FIAT UNO FIRE','/volantes/FIAT/EVR21.png'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'EVR22', 'VOL FIAT VIVACE','/volantes/FIAT/EVR22.png'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'EVR23', 'VOL FIAT IDEA AB','/volantes/FIAT/EVR23.png'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'EVR24', 'VOL FIAT PALIO NOVO','/volantes/FIAT/EVR24.png'),

-- Ford
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'EVR31', 'VOL FORD NEW KA','/volantes/FORD/EVR31.png'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'EVR32', 'VOL FORD FIESTA 2003','/volantes/FORD/EVR32.png'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'EVR33', 'VOL FORD ECO SPORT AB','/volantes/FORD/EVR33.png'),

-- Renault
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'EVR41', 'VOL RENAULT LOGAN 3 TRAVAS','/volantes/RENAULT/EVR41.png'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'EVR42', 'VOL RENAULT SANDERO','/volantes/RENAULT/EVR42.png'),

-- Volkswagen
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'EVR51', 'VOL VW VOYAGE','/volantes/VOLKSWAGEN/EVR51.png'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'EVR52', 'VOL VW GOL G4','/volantes/VOLKSWAGEN/EVR52.png'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'EVR53', 'VOL VW GOL G5','/volantes/VOLKSWAGEN/EVR53.png'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'EVR54', 'VOL VW GOL G7','/volantes/VOLKSWAGEN/EVR54.png'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'EVR55', 'VOL VW GOL G6 TRÊS TRAVAS','/volantes/VOLKSWAGEN/EVR55.png'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'EVR56', 'VOL VW GOL G6 DUAS TRAVAS','/volantes/VOLKSWAGEN/EVR56.png'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'EVR57', 'VOL VW DELIVERY/CONSTELLATION','/volantes/VOLKSWAGEN/EVR57.png'),

-- Hyundai
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'EVR61', 'VOL HYUNDAI HB20','/volantes/HYUNDAI/EVR61.png'),

-- Mercedes-Benz
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa7', 'EVR71', 'VOL MB 1620 PEQUENO','/volantes/MERCEDES/EVR71.png'),
('3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa7', 'EVR72', 'VOL MB ATRON/EURO','/volantes/MERCEDES/EVR72.png')
ON CONFLICT DO NOTHING;


CREATE OR REPLACE FUNCTION generate_order_number_per_tenant()
RETURNS TRIGGER AS $$
DECLARE
  seq_name TEXT;
  next_number INTEGER;
BEGIN
  -- sequence por tenant
  seq_name := 'order_seq_' || replace(NEW.tenant_id::text, '-', '');

  -- cria sequence se não existir
  EXECUTE 'CREATE SEQUENCE IF NOT EXISTS ' || seq_name || ' START 1';

  -- pega próximo número
  EXECUTE 'SELECT nextval(''' || seq_name || ''')'
  INTO next_number;

  NEW.numero_pedido := next_number;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_order_number_per_tenant
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION generate_order_number_per_tenant();