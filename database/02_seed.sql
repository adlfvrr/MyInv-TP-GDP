-- =====================================================================
-- MyInv · Datos de prueba (seed data)
-- T02 - Mitigación del riesgo R5: bebidas reales para no depender de la
--       entrega de datos del cliente "La previa".
-- Ejecutar después de 01_schema.sql:  psql -U postgres -d myinv -f 02_seed.sql
-- =====================================================================

BEGIN;

-- Roles ---------------------------------------------------------------
INSERT INTO rol (nombre) VALUES ('ADMINISTRADOR'), ('EMPLEADO');

-- Usuarios de prueba (contraseñas cifradas con BCrypt) -----------------
--   admin    / Admin123!     -> ADMINISTRADOR
--   empleado / Empleado123!  -> EMPLEADO
INSERT INTO usuario (username, password_hash, nombre_completo, rol_id) VALUES
    ('admin',    '$2b$10$rTh42145xpRxjUGG5ZbBbeJuYbWSsjEaALP9VTJa.fJBmPFVgERmm', 'Administrador La previa',
        (SELECT id FROM rol WHERE nombre = 'ADMINISTRADOR')),
    ('empleado', '$2b$10$GDZEc..GCHwK5gJevgy5KOITN.U5saFrRIqlqh0KZwuXXDJarLBvq', 'Empleado de mostrador',
        (SELECT id FROM rol WHERE nombre = 'EMPLEADO'));

-- Catálogo --------------------------------------------------------------
INSERT INTO categoria (nombre) VALUES
    ('Cervezas'), ('Gaseosas'), ('Aguas'), ('Vinos'), ('Aperitivos'), ('Jugos'), ('Envases');

INSERT INTO marca (nombre) VALUES
    ('Quilmes'), ('Brahma'), ('Stella Artois'), ('Coca-Cola'), ('Sprite'), ('Pepsi'),
    ('Villavicencio'), ('Villa del Sur'), ('Toro'), ('Alma Mora'), ('Fernet Branca'),
    ('Cepita'), ('Genérico');

INSERT INTO presentacion (descripcion) VALUES
    ('Lata 473 ml'), ('Botella 1 L retornable'), ('Botella 340 ml'), ('Botella 2,25 L'),
    ('Botella 1,5 L'), ('Botella 2 L'), ('Botella 750 ml'), ('Tetra 1 L'), ('Cajón x 12 unidades');

-- Productos ---------------------------------------------------------------
INSERT INTO producto (nombre, categoria_id, marca_id, presentacion_id, precio, stock_actual, stock_minimo)
SELECT p.nombre, c.id, m.id, pr.id, p.precio, p.stock_actual, p.stock_minimo
FROM (VALUES
    ('Cerveza Quilmes Clásica',       'Cervezas',   'Quilmes',       'Lata 473 ml',             1500.00,  96, 24),
    ('Cerveza Quilmes Clásica',       'Cervezas',   'Quilmes',       'Botella 1 L retornable',  2300.00,  60, 24),
    ('Cerveza Brahma Chopp',          'Cervezas',   'Brahma',        'Lata 473 ml',             1400.00,  20, 24),
    ('Cerveza Stella Artois',         'Cervezas',   'Stella Artois', 'Botella 340 ml',          1900.00,  48, 12),
    ('Cerveza Stella Artois',         'Cervezas',   'Stella Artois', 'Lata 473 ml',             2100.00,  36, 12),
    ('Coca-Cola Original',            'Gaseosas',   'Coca-Cola',     'Botella 2,25 L',          3200.00,  40, 12),
    ('Coca-Cola Sin Azúcar',          'Gaseosas',   'Coca-Cola',     'Botella 1,5 L',           2600.00,  18, 12),
    ('Sprite Lima-Limón',             'Gaseosas',   'Sprite',        'Botella 2,25 L',          2900.00,  10, 12),
    ('Pepsi Black',                   'Gaseosas',   'Pepsi',         'Botella 2 L',             2500.00,  30, 10),
    ('Agua mineral sin gas',          'Aguas',      'Villavicencio', 'Botella 2 L',             1600.00,   3, 12),
    ('Agua mineral con gas',          'Aguas',      'Villa del Sur', 'Botella 1,5 L',           1300.00,  25, 10),
    ('Vino tinto',                    'Vinos',      'Toro',          'Tetra 1 L',               1800.00,  50, 15),
    ('Vino Malbec',                   'Vinos',      'Alma Mora',     'Botella 750 ml',          5200.00,  14,  6),
    ('Fernet Branca',                 'Aperitivos', 'Fernet Branca', 'Botella 750 ml',         11500.00,  22,  8),
    ('Jugo de naranja',               'Jugos',      'Cepita',        'Tetra 1 L',               1700.00,   8, 10),
    ('Cajón plástico para botellas',  'Envases',    'Genérico',      'Cajón x 12 unidades',     6000.00,  15,  5)
) AS p (nombre, categoria, marca, presentacion, precio, stock_actual, stock_minimo)
JOIN categoria    c  ON c.nombre       = p.categoria
JOIN marca        m  ON m.nombre       = p.marca
JOIN presentacion pr ON pr.descripcion = p.presentacion;

COMMIT;
