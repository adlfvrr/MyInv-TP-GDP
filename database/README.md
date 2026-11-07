# Database — MyInv

Scripts SQL de **PostgreSQL 16**. Son la única fuente del esquema: el backend **no** crea ni modifica tablas (`spring.jpa.hibernate.ddl-auto: none` en `application.yml`).

| Script | Contenido |
| :-- | :-- |
| `01_schema.sql` | Tablas `rol`, `usuario`, `categoria`, `marca`, `presentacion`, `producto` y `movimiento` con claves primarias, foráneas, restricciones `CHECK` e índices. Borra y recrea todo (re-ejecutable). |
| `02_seed.sql` | Datos de prueba: 2 roles, 2 usuarios, 7 categorías, 13 marcas, 9 presentaciones y 16 bebidas (4 de ellas ya en stock mínimo). |

## Ejecutar

```bash
psql -U postgres -c "CREATE DATABASE myinv;"
psql -U postgres -d myinv -f database/01_schema.sql
psql -U postgres -d myinv -f database/02_seed.sql
```

## Usuarios de prueba

| Usuario | Contraseña | Rol |
| :-- | :-- | :-- |
| `admin` | `Admin123!` | ADMINISTRADOR |
| `empleado` | `Empleado123!` | EMPLEADO |

## Modelo entidad-relación

```
rol 1 ─── N usuario 1 ─── N movimiento N ─── 1 producto
                                                 │
                    categoria 1 ─── N ───────────┤
                    marca     1 ─── N ───────────┤
                    presentacion 1 ─── N ────────┘
```

> Cualquier cambio de tablas se hace **solo** en estos scripts y se avisa al equipo (mitigación del riesgo R4).
