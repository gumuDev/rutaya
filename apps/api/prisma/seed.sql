-- =============================================================
-- RutaYa — Seed de datos realistas
-- Empresas bolivianas de transporte interprovincial
-- Ejecutar con: psql $DATABASE_URL -f seed.sql
-- =============================================================

BEGIN;

-- ─── Limpiar datos existentes (respeta FK order) ──────────────────────────────
TRUNCATE seat_reservations, reservations, schedules, routes, vehicles, cities, companies
  RESTART IDENTITY CASCADE;

-- =============================================================
-- CITIES
-- =============================================================
INSERT INTO cities (id, name, department) VALUES
  ('city_lpz', 'La Paz',       'La Paz'),
  ('city_cbba','Cochabamba',   'Cochabamba'),
  ('city_scz', 'Santa Cruz',   'Santa Cruz'),
  ('city_oru', 'Oruro',        'Oruro'),
  ('city_pot', 'Potosí',       'Potosí'),
  ('city_suc', 'Sucre',        'Chuquisaca'),
  ('city_tri', 'Trinidad',     'Beni'),
  ('city_tja', 'Tarija',       'Tarija'),
  ('city_uyu', 'Uyuni',        'Potosí'),
  ('city_cop', 'Copacabana',   'La Paz'),
  ('city_vil', 'Villazón',     'Potosí'),
  ('city_rbe', 'Riberalta',    'Beni'),
  ('city_gua', 'Guanay',       'La Paz'),
  ('city_car', 'Caranavi',     'La Paz'),
  ('city_pue', 'Puerto Suárez','Santa Cruz');

-- =============================================================
-- COMPANIES  (password = "rutaya2024" — bcrypt hash)
-- =============================================================
INSERT INTO companies (id, name, "taxId", phone, city, email, password, role,
                       "bankName", "bankAccount", "bankAccountHolder", "qrImageUrl",
                       "createdAt", "updatedAt") VALUES

-- ── Bolívar Bus ────────────────────────────────────────────────────────────────
('co_bolivar', 'Bolívar Bus', '1002345678', '+591 2 2441100', 'La Paz',
 'admin@bolivarbus.bo',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p362ln93yanxBGMBjRRxGG',
 'admin',
 'Banco Bisa', '1234567890', 'Bolívar Bus S.R.L.',
 NULL,
 NOW(), NOW()),

-- ── Trans Copacabana ───────────────────────────────────────────────────────────
('co_copacabana', 'Trans Copacabana', '1009876543', '+591 2 2115500', 'La Paz',
 'admin@transcopacabana.bo',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p362ln93yanxBGMBjRRxGG',
 'admin',
 'Banco Nacional de Bolivia', '9876543210', 'Trans Copacabana Ltda.',
 NULL,
 NOW(), NOW()),

-- ── El Dorado ──────────────────────────────────────────────────────────────────
('co_dorado', 'El Dorado', '1005554433', '+591 3 3441200', 'Santa Cruz',
 'admin@eldorado.bo',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p362ln93yanxBGMBjRRxGG',
 'admin',
 'Banco Mercantil Santa Cruz', '5544332211', 'El Dorado S.A.',
 NULL,
 NOW(), NOW()),

-- ── Flota Yungas ───────────────────────────────────────────────────────────────
('co_yungas', 'Flota Yungas', '1007778899', '+591 2 2319900', 'La Paz',
 'admin@flotayungas.bo',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p362ln93yanxBGMBjRRxGG',
 'admin',
 'Banco Bisa', '7778899001', 'Flota Yungas S.R.L.',
 NULL,
 NOW(), NOW()),

-- ── Jumbo Bus ──────────────────────────────────────────────────────────────────
('co_jumbo', 'Jumbo Bus', '1001122334', '+591 4 4651300', 'Cochabamba',
 'admin@jumbobus.bo',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p362ln93yanxBGMBjRRxGG',
 'admin',
 'Banco de Crédito de Bolivia', '1122334455', 'Jumbo Bus Cochabamba S.A.',
 NULL,
 NOW(), NOW()),

-- ── Expreso del Sur ────────────────────────────────────────────────────────────
('co_sur', 'Expreso del Sur', '1006677889', '+591 4 6641100', 'Tarija',
 'admin@expresodelsur.bo',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p362ln93yanxBGMBjRRxGG',
 'admin',
 'Banco Unión', '6677889900', 'Expreso del Sur Ltda.',
 NULL,
 NOW(), NOW()),

-- ── Pullman Potosí ─────────────────────────────────────────────────────────────
('co_potosi', 'Pullman Potosí', '1003344556', '+591 2 6223300', 'Potosí',
 'admin@pullmanpotosi.bo',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p362ln93yanxBGMBjRRxGG',
 'admin',
 'Banco Nacional de Bolivia', '3344556677', 'Pullman Potosí S.R.L.',
 NULL,
 NOW(), NOW()),

-- ── Santa Cruz Express ─────────────────────────────────────────────────────────
('co_scexpress', 'Santa Cruz Express', '1008899001', '+591 3 3561400', 'Santa Cruz',
 'admin@scruzexpress.bo',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p362ln93yanxBGMBjRRxGG',
 'admin',
 'Banco Mercantil Santa Cruz', '8899001122', 'SCZ Express S.A.',
 NULL,
 NOW(), NOW());

-- =============================================================
-- VEHICLES
-- =============================================================
INSERT INTO vehicles (id, plate, type, "serviceType", capacity, brand, year,
                      "driverName", "driverPhone", "companyId", "createdAt", "updatedAt") VALUES

-- Bolívar Bus
('veh_bol_1', 'B-1234', 'bus',    'cama',    42, 'Scania',   2022, 'Mario Quispe',     '+591 70011001', 'co_bolivar',   NOW(), NOW()),
('veh_bol_2', 'B-1235', 'bus',    'semicama', 50, 'Mercedes', 2021, 'Juan Mamani',      '+591 70011002', 'co_bolivar',   NOW(), NOW()),
('veh_bol_3', 'B-1236', 'bus',    'normal',   55, 'Volvo',    2020, 'Pedro Condori',    '+591 70011003', 'co_bolivar',   NOW(), NOW()),

-- Trans Copacabana
('veh_cop_1', 'C-2001', 'bus',    'cama',    40, 'Scania',   2023, 'Roberto Lima',     '+591 70022001', 'co_copacabana',NOW(), NOW()),
('veh_cop_2', 'C-2002', 'bus',    'semicama', 48, 'Marcopolo',2022, 'Luis Flores',      '+591 70022002', 'co_copacabana',NOW(), NOW()),
('veh_cop_3', 'C-2003', 'minibus','normal',   20, 'Toyota',   2021, 'Carlos Apaza',     '+591 70022003', 'co_copacabana',NOW(), NOW()),

-- El Dorado
('veh_dor_1', 'D-3001', 'bus',    'leito',   36, 'Scania',   2023, 'Rodrigo Vargas',   '+591 70033001', 'co_dorado',    NOW(), NOW()),
('veh_dor_2', 'D-3002', 'bus',    'cama',    42, 'Volvo',    2022, 'Fernando Cruz',    '+591 70033002', 'co_dorado',    NOW(), NOW()),
('veh_dor_3', 'D-3003', 'bus',    'semicama', 50, 'Mercedes', 2021, 'Hector Mendoza',   '+591 70033003', 'co_dorado',    NOW(), NOW()),

-- Flota Yungas
('veh_yun_1', 'Y-4001', 'minibus','normal',   20, 'Toyota',   2022, 'Willy Choque',     '+591 70044001', 'co_yungas',    NOW(), NOW()),
('veh_yun_2', 'Y-4002', 'minibus','normal',   18, 'Nissan',   2021, 'Gonzalo Poma',     '+591 70044002', 'co_yungas',    NOW(), NOW()),
('veh_yun_3', 'Y-4003', 'bus',    'normal',   45, 'Scania',   2020, 'Raul Alvarado',    '+591 70044003', 'co_yungas',    NOW(), NOW()),

-- Jumbo Bus
('veh_jum_1', 'J-5001', 'bus',    'cama',    40, 'Scania',   2023, 'Oscar Torrico',    '+591 70055001', 'co_jumbo',     NOW(), NOW()),
('veh_jum_2', 'J-5002', 'bus',    'semicama', 46, 'Volvo',    2022, 'Fabio Gutierrez',  '+591 70055002', 'co_jumbo',     NOW(), NOW()),

-- Expreso del Sur
('veh_sur_1', 'S-6001', 'bus',    'cama',    40, 'Mercedes', 2022, 'Nelson Camacho',   '+591 70066001', 'co_sur',       NOW(), NOW()),
('veh_sur_2', 'S-6002', 'bus',    'semicama', 48, 'Scania',   2021, 'Dante Salinas',    '+591 70066002', 'co_sur',       NOW(), NOW()),

-- Pullman Potosí
('veh_pot_1', 'P-7001', 'bus',    'normal',   52, 'Volvo',    2020, 'Sixto Marca',      '+591 70077001', 'co_potosi',    NOW(), NOW()),
('veh_pot_2', 'P-7002', 'minibus','normal',   22, 'Toyota',   2021, 'Efrain Ticona',    '+591 70077002', 'co_potosi',    NOW(), NOW()),

-- Santa Cruz Express
('veh_scx_1', 'X-8001', 'bus',    'leito',   36, 'Scania',   2023, 'Miguel Suarez',    '+591 70088001', 'co_scexpress', NOW(), NOW()),
('veh_scx_2', 'X-8002', 'bus',    'cama',    42, 'Marcopolo',2022, 'Alfredo Rojas',    '+591 70088002', 'co_scexpress', NOW(), NOW());

-- =============================================================
-- ROUTES
-- =============================================================
INSERT INTO routes (id, origin, destination, "basePrice", "companyId", "createdAt", "updatedAt") VALUES

-- Bolívar Bus
('rt_bol_1', 'La Paz',     'Cochabamba', 80.00,  'co_bolivar',    NOW(), NOW()),
('rt_bol_2', 'La Paz',     'Santa Cruz', 150.00, 'co_bolivar',    NOW(), NOW()),
('rt_bol_3', 'La Paz',     'Oruro',      40.00,  'co_bolivar',    NOW(), NOW()),

-- Trans Copacabana
('rt_cop_1', 'La Paz',     'Copacabana', 35.00,  'co_copacabana', NOW(), NOW()),
('rt_cop_2', 'La Paz',     'Oruro',      40.00,  'co_copacabana', NOW(), NOW()),
('rt_cop_3', 'La Paz',     'Cochabamba', 85.00,  'co_copacabana', NOW(), NOW()),

-- El Dorado
('rt_dor_1', 'Santa Cruz', 'La Paz',     160.00, 'co_dorado',     NOW(), NOW()),
('rt_dor_2', 'Santa Cruz', 'Cochabamba', 90.00,  'co_dorado',     NOW(), NOW()),
('rt_dor_3', 'Santa Cruz', 'Sucre',      110.00, 'co_dorado',     NOW(), NOW()),

-- Flota Yungas
('rt_yun_1', 'La Paz',     'Caranavi',   45.00,  'co_yungas',     NOW(), NOW()),
('rt_yun_2', 'La Paz',     'Guanay',     60.00,  'co_yungas',     NOW(), NOW()),
('rt_yun_3', 'Caranavi',   'Riberalta',  120.00, 'co_yungas',     NOW(), NOW()),

-- Jumbo Bus
('rt_jum_1', 'Cochabamba', 'Santa Cruz', 95.00,  'co_jumbo',      NOW(), NOW()),
('rt_jum_2', 'Cochabamba', 'La Paz',     80.00,  'co_jumbo',      NOW(), NOW()),
('rt_jum_3', 'Cochabamba', 'Sucre',      70.00,  'co_jumbo',      NOW(), NOW()),

-- Expreso del Sur
('rt_sur_1', 'Tarija',     'Potosí',     90.00,  'co_sur',        NOW(), NOW()),
('rt_sur_2', 'Tarija',     'Sucre',      85.00,  'co_sur',        NOW(), NOW()),
('rt_sur_3', 'Tarija',     'Villazón',   50.00,  'co_sur',        NOW(), NOW()),

-- Pullman Potosí
('rt_pot_1', 'Potosí',     'Oruro',      50.00,  'co_potosi',     NOW(), NOW()),
('rt_pot_2', 'Potosí',     'Uyuni',      45.00,  'co_potosi',     NOW(), NOW()),
('rt_pot_3', 'Potosí',     'La Paz',     90.00,  'co_potosi',     NOW(), NOW()),

-- Santa Cruz Express
('rt_scx_1', 'Santa Cruz', 'Trinidad',   130.00, 'co_scexpress',  NOW(), NOW()),
('rt_scx_2', 'Santa Cruz', 'Puerto Suárez',140.00,'co_scexpress', NOW(), NOW()),
('rt_scx_3', 'Santa Cruz', 'La Paz',     160.00, 'co_scexpress',  NOW(), NOW());

-- =============================================================
-- SCHEDULES  (days: Mon-Sun = 0-6 en formato PostgreSQL text[])
-- =============================================================
INSERT INTO schedules (id, "routeId", "vehicleId", "companyId", "departureTime", days, price, active, "createdAt", "updatedAt") VALUES

-- ── Bolívar Bus — La Paz → Cochabamba ─────────────────────────────────────────
('sch_bol_1', 'rt_bol_1', 'veh_bol_1', 'co_bolivar',  '08:00', ARRAY['sun','mon','tue','wed','thu','fri','sat'], 85.00,  true, NOW(), NOW()),
('sch_bol_2', 'rt_bol_1', 'veh_bol_2', 'co_bolivar',  '14:00', ARRAY['sun','mon','tue','wed','thu','fri','sat'], 80.00,  true, NOW(), NOW()),
('sch_bol_3', 'rt_bol_1', 'veh_bol_3', 'co_bolivar',  '22:00', ARRAY['sun','mon','tue','wed','thu','fri','sat'], 75.00,  true, NOW(), NOW()),

-- ── Bolívar Bus — La Paz → Santa Cruz ────────────────────────────────────────
('sch_bol_4', 'rt_bol_2', 'veh_bol_1', 'co_bolivar',  '18:00', ARRAY['mon','wed','fri'],               155.00, true, NOW(), NOW()),
('sch_bol_5', 'rt_bol_2', 'veh_bol_2', 'co_bolivar',  '20:30', ARRAY['sun','tue','thu','sat'],            150.00, true, NOW(), NOW()),

-- ── Bolívar Bus — La Paz → Oruro ─────────────────────────────────────────────
('sch_bol_6', 'rt_bol_3', 'veh_bol_3', 'co_bolivar',  '07:00', ARRAY['sun','mon','tue','wed','thu','fri','sat'], 42.00,  true, NOW(), NOW()),
('sch_bol_7', 'rt_bol_3', 'veh_bol_3', 'co_bolivar',  '13:00', ARRAY['sun','mon','tue','wed','thu','fri','sat'], 40.00,  true, NOW(), NOW()),

-- ── Trans Copacabana — La Paz → Copacabana ───────────────────────────────────
('sch_cop_1', 'rt_cop_1', 'veh_cop_3', 'co_copacabana','07:30', ARRAY['sun','mon','tue','wed','thu','fri','sat'], 35.00, true, NOW(), NOW()),
('sch_cop_2', 'rt_cop_1', 'veh_cop_3', 'co_copacabana','11:00', ARRAY['sun','mon','tue','wed','thu','fri','sat'], 35.00, true, NOW(), NOW()),
('sch_cop_3', 'rt_cop_1', 'veh_cop_3', 'co_copacabana','15:30', ARRAY['sun','mon','tue','wed','thu','fri','sat'], 35.00, true, NOW(), NOW()),

-- ── Trans Copacabana — La Paz → Oruro ────────────────────────────────────────
('sch_cop_4', 'rt_cop_2', 'veh_cop_1', 'co_copacabana','08:30', ARRAY['sun','mon','tue','wed','thu','fri','sat'], 45.00, true, NOW(), NOW()),
('sch_cop_5', 'rt_cop_2', 'veh_cop_2', 'co_copacabana','19:00', ARRAY['sun','mon','tue','wed','thu','fri','sat'], 42.00, true, NOW(), NOW()),

-- ── Trans Copacabana — La Paz → Cochabamba ───────────────────────────────────
('sch_cop_6', 'rt_cop_3', 'veh_cop_1', 'co_copacabana','09:00', ARRAY['mon','tue','wed','thu','fri'],        90.00, true, NOW(), NOW()),
('sch_cop_7', 'rt_cop_3', 'veh_cop_2', 'co_copacabana','21:00', ARRAY['sun','mon','tue','wed','thu','fri','sat'], 85.00, true, NOW(), NOW()),

-- ── El Dorado — Santa Cruz → La Paz ──────────────────────────────────────────
('sch_dor_1', 'rt_dor_1', 'veh_dor_1', 'co_dorado',   '17:00', ARRAY['mon','wed','fri','sat'],            175.00, true, NOW(), NOW()),
('sch_dor_2', 'rt_dor_1', 'veh_dor_2', 'co_dorado',   '19:30', ARRAY['sun','tue','thu'],                165.00, true, NOW(), NOW()),

-- ── El Dorado — Santa Cruz → Cochabamba ──────────────────────────────────────
('sch_dor_3', 'rt_dor_2', 'veh_dor_3', 'co_dorado',   '08:00', ARRAY['sun','mon','tue','wed','thu','fri','sat'], 95.00, true, NOW(), NOW()),
('sch_dor_4', 'rt_dor_2', 'veh_dor_2', 'co_dorado',   '20:00', ARRAY['sun','mon','tue','wed','thu','fri','sat'], 90.00, true, NOW(), NOW()),

-- ── El Dorado — Santa Cruz → Sucre ───────────────────────────────────────────
('sch_dor_5', 'rt_dor_3', 'veh_dor_1', 'co_dorado',   '21:00', ARRAY['mon','wed','fri'],               120.00, true, NOW(), NOW()),

-- ── Flota Yungas — La Paz → Caranavi ─────────────────────────────────────────
('sch_yun_1', 'rt_yun_1', 'veh_yun_1', 'co_yungas',   '06:00', ARRAY['sun','mon','tue','wed','thu','fri','sat'], 48.00, true, NOW(), NOW()),
('sch_yun_2', 'rt_yun_1', 'veh_yun_2', 'co_yungas',   '09:00', ARRAY['sun','mon','tue','wed','thu','fri','sat'], 45.00, true, NOW(), NOW()),
('sch_yun_3', 'rt_yun_1', 'veh_yun_1', 'co_yungas',   '14:00', ARRAY['sun','mon','tue','wed','thu','fri','sat'], 45.00, true, NOW(), NOW()),

-- ── Flota Yungas — La Paz → Guanay ───────────────────────────────────────────
('sch_yun_4', 'rt_yun_2', 'veh_yun_3', 'co_yungas',   '07:00', ARRAY['mon','wed','fri','sat'],            65.00, true, NOW(), NOW()),

-- ── Flota Yungas — Caranavi → Riberalta ──────────────────────────────────────
('sch_yun_5', 'rt_yun_3', 'veh_yun_3', 'co_yungas',   '05:00', ARRAY['mon','thu'],                   125.00, true, NOW(), NOW()),

-- ── Jumbo Bus — Cochabamba → Santa Cruz ──────────────────────────────────────
('sch_jum_1', 'rt_jum_1', 'veh_jum_1', 'co_jumbo',    '08:30', ARRAY['sun','mon','tue','wed','thu','fri','sat'], 100.00,true, NOW(), NOW()),
('sch_jum_2', 'rt_jum_1', 'veh_jum_2', 'co_jumbo',    '20:00', ARRAY['sun','mon','tue','wed','thu','fri','sat'], 95.00, true, NOW(), NOW()),

-- ── Jumbo Bus — Cochabamba → La Paz ──────────────────────────────────────────
('sch_jum_3', 'rt_jum_2', 'veh_jum_1', 'co_jumbo',    '07:00', ARRAY['sun','mon','tue','wed','thu','fri','sat'], 82.00, true, NOW(), NOW()),
('sch_jum_4', 'rt_jum_2', 'veh_jum_2', 'co_jumbo',    '15:00', ARRAY['sun','mon','tue','wed','thu','fri','sat'], 80.00, true, NOW(), NOW()),
('sch_jum_5', 'rt_jum_2', 'veh_jum_2', 'co_jumbo',    '22:30', ARRAY['sun','mon','tue','wed','thu','fri','sat'], 78.00, true, NOW(), NOW()),

-- ── Jumbo Bus — Cochabamba → Sucre ───────────────────────────────────────────
('sch_jum_6', 'rt_jum_3', 'veh_jum_1', 'co_jumbo',    '19:00', ARRAY['mon','wed','fri','sat'],            75.00, true, NOW(), NOW()),

-- ── Expreso del Sur — Tarija → Potosí ────────────────────────────────────────
('sch_sur_1', 'rt_sur_1', 'veh_sur_1', 'co_sur',      '18:00', ARRAY['sun','mon','tue','wed','thu','fri','sat'], 95.00, true, NOW(), NOW()),
('sch_sur_2', 'rt_sur_1', 'veh_sur_2', 'co_sur',      '20:30', ARRAY['sun','tue','thu','sat'],            90.00, true, NOW(), NOW()),

-- ── Expreso del Sur — Tarija → Sucre ─────────────────────────────────────────
('sch_sur_3', 'rt_sur_2', 'veh_sur_1', 'co_sur',      '17:00', ARRAY['mon','wed','fri'],               88.00, true, NOW(), NOW()),

-- ── Expreso del Sur — Tarija → Villazón ──────────────────────────────────────
('sch_sur_4', 'rt_sur_3', 'veh_sur_2', 'co_sur',      '08:00', ARRAY['sun','mon','tue','wed','thu','fri','sat'], 52.00, true, NOW(), NOW()),
('sch_sur_5', 'rt_sur_3', 'veh_sur_2', 'co_sur',      '14:00', ARRAY['sun','mon','tue','wed','thu','fri','sat'], 50.00, true, NOW(), NOW()),

-- ── Pullman Potosí — Potosí → Oruro ──────────────────────────────────────────
('sch_pot_1', 'rt_pot_1', 'veh_pot_1', 'co_potosi',   '06:30', ARRAY['sun','mon','tue','wed','thu','fri','sat'], 52.00, true, NOW(), NOW()),
('sch_pot_2', 'rt_pot_1', 'veh_pot_2', 'co_potosi',   '12:00', ARRAY['sun','mon','tue','wed','thu','fri','sat'], 50.00, true, NOW(), NOW()),
('sch_pot_3', 'rt_pot_1', 'veh_pot_1', 'co_potosi',   '18:00', ARRAY['sun','mon','tue','wed','thu','fri','sat'], 50.00, true, NOW(), NOW()),

-- ── Pullman Potosí — Potosí → Uyuni ──────────────────────────────────────────
('sch_pot_4', 'rt_pot_2', 'veh_pot_2', 'co_potosi',   '07:00', ARRAY['sun','mon','tue','wed','thu','fri','sat'], 48.00, true, NOW(), NOW()),
('sch_pot_5', 'rt_pot_2', 'veh_pot_2', 'co_potosi',   '13:00', ARRAY['sun','tue','thu','sat'],            45.00, true, NOW(), NOW()),

-- ── Pullman Potosí — Potosí → La Paz ─────────────────────────────────────────
('sch_pot_6', 'rt_pot_3', 'veh_pot_1', 'co_potosi',   '19:30', ARRAY['sun','mon','tue','wed','thu','fri','sat'], 92.00, true, NOW(), NOW()),

-- ── Santa Cruz Express — Santa Cruz → Trinidad ────────────────────────────────
('sch_scx_1', 'rt_scx_1', 'veh_scx_1', 'co_scexpress','16:00', ARRAY['mon','thu','sat'],               140.00, true, NOW(), NOW()),

-- ── Santa Cruz Express — Santa Cruz → Puerto Suárez ──────────────────────────
('sch_scx_2', 'rt_scx_2', 'veh_scx_2', 'co_scexpress','08:00', ARRAY['mon','wed','fri'],               145.00, true, NOW(), NOW()),

-- ── Santa Cruz Express — Santa Cruz → La Paz ─────────────────────────────────
('sch_scx_3', 'rt_scx_3', 'veh_scx_1', 'co_scexpress','18:30', ARRAY['sun','tue','thu','sat'],            170.00, true, NOW(), NOW()),
('sch_scx_4', 'rt_scx_3', 'veh_scx_2', 'co_scexpress','21:00', ARRAY['mon','wed','fri'],               160.00, true, NOW(), NOW());

-- =============================================================
-- RESERVATIONS de ejemplo (varias rutas y estados)
-- =============================================================
INSERT INTO reservations (id, code, "scheduleId", "companyId", "passengerName", "passengerPhone",
                          quantity, status, "paymentMethod", "travelDate",
                          "createdAt", "updatedAt", "expiresAt") VALUES
('res_001','AABB1122','sch_bol_1','co_bolivar',  'Elena Rodriguez',  '+591 70111001', 1, 'confirmed',      'bank_transfer', '2026-06-05', NOW(), NOW(), NOW() + INTERVAL '1 day'),
('res_002','CCDD3344','sch_bol_1','co_bolivar',  'Marco Villegas',   '+591 70111002', 2, 'pending',        'qr',            '2026-06-05', NOW(), NOW(), NOW() + INTERVAL '2 hours'),
('res_003','EEFF5566','sch_cop_4','co_copacabana','Sofía Mamani',     '+591 70111003', 1, 'confirmed',      'bank_transfer', '2026-06-04', NOW(), NOW(), NOW() + INTERVAL '1 day'),
('res_004','GGHH7788','sch_dor_3','co_dorado',   'Juan Pérez',       '+591 70111004', 1, 'pending_payment','bank_transfer', '2026-06-06', NOW(), NOW(), NOW() + INTERVAL '30 minutes'),
('res_005','IIJJ9900','sch_jum_3','co_jumbo',    'Ana Flores',       '+591 70111005', 3, 'confirmed',      'qr',            '2026-06-04', NOW(), NOW(), NOW() + INTERVAL '1 day'),
('res_006','KKLL1122','sch_sur_4','co_sur',      'Carlos Choque',    '+591 70111006', 1, 'boarded',        'bank_transfer', '2026-06-03', NOW(), NOW(), NOW() + INTERVAL '1 day'),
('res_007','MMNN3344','sch_pot_4','co_potosi',   'Rosa Condori',     '+591 70111007', 2, 'cancelled',      'qr',            '2026-06-03', NOW(), NOW(), NOW() + INTERVAL '1 day'),
('res_008','OOPP5566','sch_yun_1','co_yungas',   'Julio Quispe',     '+591 70111008', 1, 'confirmed',      'bank_transfer', '2026-06-05', NOW(), NOW(), NOW() + INTERVAL '1 day'),
('res_009','QQRR7788','sch_scx_3','co_scexpress','Patricia Soria',   '+591 70111009', 2, 'pending',        'bank_transfer', '2026-06-07', NOW(), NOW(), NOW() + INTERVAL '3 hours'),
('res_010','SSTT9900','sch_bol_4','co_bolivar',  'Diego Torrez',     '+591 70111010', 1, 'confirmed',      'qr',            '2026-06-06', NOW(), NOW(), NOW() + INTERVAL '1 day');

COMMIT;

-- =============================================================
-- Verificación rápida
-- =============================================================
SELECT 'companies'    AS tabla, COUNT(*) AS total FROM companies    UNION ALL
SELECT 'vehicles',              COUNT(*)           FROM vehicles     UNION ALL
SELECT 'routes',                COUNT(*)           FROM routes       UNION ALL
SELECT 'schedules',             COUNT(*)           FROM schedules    UNION ALL
SELECT 'reservations',          COUNT(*)           FROM reservations UNION ALL
SELECT 'cities',                COUNT(*)           FROM cities;
