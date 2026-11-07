-- =====================================================================
-- MyInv · Esquema de base de datos (PostgreSQL 16)
-- T02 - Modelo entidad-relación: Usuarios, Roles, Productos, Movimientos
-- Ejecutar sobre una base vacía:  psql -U postgres -d myinv -f 01_schema.sql
-- =====================================================================

USE DATABASE myinv;

BEGIN;

DROP TABLE IF EXISTS movimiento   CASCADE;
DROP TABLE IF EXISTS producto     CASCADE;
DROP TABLE IF EXISTS presentacion CASCADE;
DROP TABLE IF EXISTS marca        CASCADE;
DROP TABLE IF EXISTS categoria    CASCADE;
DROP TABLE IF EXISTS usuario      CASCADE;
DROP TABLE IF EXISTS rol          CASCADE;

-- ---------------------------------------------------------------------
-- Seguridad: roles y usuarios
-- ---------------------------------------------------------------------
CREATE TABLE rol (
    id      SMALLINT     GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre  VARCHAR(30)  NOT NULL,
    CONSTRAINT uq_rol_nombre UNIQUE (nombre),
    CONSTRAINT ck_rol_nombre CHECK (nombre IN ('ADMINISTRADOR', 'EMPLEADO'))
);

CREATE TABLE usuario (
    id               BIGINT        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username         VARCHAR(50)   NOT NULL,
    password_hash    VARCHAR(100)  NOT NULL,
    nombre_completo  VARCHAR(100)  NOT NULL,
    rol_id           SMALLINT      NOT NULL,
    activo           BOOLEAN       NOT NULL DEFAULT TRUE,
    creado_en        TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT uq_usuario_username UNIQUE (username),
    CONSTRAINT fk_usuario_rol FOREIGN KEY (rol_id) REFERENCES rol (id)
);

-- ---------------------------------------------------------------------
-- Catálogo: categoría, marca y presentación
-- ---------------------------------------------------------------------
CREATE TABLE categoria (
    id      INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre  VARCHAR(60)  NOT NULL,
    CONSTRAINT uq_categoria_nombre UNIQUE (nombre)
);

CREATE TABLE marca (
    id      INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre  VARCHAR(60)  NOT NULL,
    CONSTRAINT uq_marca_nombre UNIQUE (nombre)
);

CREATE TABLE presentacion (
    id           INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion  VARCHAR(60)  NOT NULL,
    CONSTRAINT uq_presentacion_descripcion UNIQUE (descripcion)
);

-- ---------------------------------------------------------------------
-- Productos (bebidas) con stock actual y umbral mínimo
-- ---------------------------------------------------------------------
CREATE TABLE producto (
    id               BIGINT         GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre           VARCHAR(120)   NOT NULL,
    categoria_id     INTEGER        NOT NULL,
    marca_id         INTEGER        NOT NULL,
    presentacion_id  INTEGER        NOT NULL,
    precio           NUMERIC(12,2)  NOT NULL DEFAULT 0,
    stock_actual     INTEGER        NOT NULL DEFAULT 0,
    stock_minimo     INTEGER        NOT NULL DEFAULT 0,
    activo           BOOLEAN        NOT NULL DEFAULT TRUE,
    creado_en        TIMESTAMPTZ    NOT NULL DEFAULT now(),
    actualizado_en   TIMESTAMPTZ    NOT NULL DEFAULT now(),
    CONSTRAINT fk_producto_categoria    FOREIGN KEY (categoria_id)    REFERENCES categoria (id),
    CONSTRAINT fk_producto_marca        FOREIGN KEY (marca_id)        REFERENCES marca (id),
    CONSTRAINT fk_producto_presentacion FOREIGN KEY (presentacion_id) REFERENCES presentacion (id),
    CONSTRAINT ck_producto_precio       CHECK (precio >= 0),
    CONSTRAINT ck_producto_stock_actual CHECK (stock_actual >= 0),
    CONSTRAINT ck_producto_stock_minimo CHECK (stock_minimo >= 0)
);

-- No puede haber dos productos activos con el mismo nombre, marca y presentación.
CREATE UNIQUE INDEX uq_producto_activo
    ON producto (lower(nombre), marca_id, presentacion_id)
    WHERE activo;

CREATE INDEX ix_producto_categoria ON producto (categoria_id);
CREATE INDEX ix_producto_marca     ON producto (marca_id);

-- ---------------------------------------------------------------------
-- Movimientos de stock: ENTRADA (compra a proveedor) / SALIDA (venta)
-- ---------------------------------------------------------------------
CREATE TABLE movimiento (
    id                BIGINT        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    producto_id       BIGINT        NOT NULL,
    usuario_id        BIGINT        NOT NULL,
    tipo              VARCHAR(10)   NOT NULL,
    cantidad          INTEGER       NOT NULL,
    stock_resultante  INTEGER       NOT NULL,
    proveedor         VARCHAR(120),
    observacion       VARCHAR(255),
    fecha             TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT fk_movimiento_producto FOREIGN KEY (producto_id) REFERENCES producto (id),
    CONSTRAINT fk_movimiento_usuario  FOREIGN KEY (usuario_id)  REFERENCES usuario (id),
    CONSTRAINT ck_movimiento_tipo     CHECK (tipo IN ('ENTRADA', 'SALIDA')),
    CONSTRAINT ck_movimiento_cantidad CHECK (cantidad > 0),
    CONSTRAINT ck_movimiento_stock    CHECK (stock_resultante >= 0)
);

CREATE INDEX ix_movimiento_fecha    ON movimiento (fecha DESC);
CREATE INDEX ix_movimiento_producto ON movimiento (producto_id);
CREATE INDEX ix_movimiento_tipo     ON movimiento (tipo);

COMMIT;
