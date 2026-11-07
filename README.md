# MyInv — Gestión de inventario y control de stock de bebidas

Sistema web para la distribuidora **"La previa"** (25 de Mayo y 9 de Julio). Reemplaza el registro manual en carpetas A4 por un catálogo digital, movimientos de entrada/salida en tiempo real y alertas automáticas de reposición.

**Trabajo Integrador Final** · Gestión de Desarrollo de Software · UTN Facultad Regional Paraná · Docente: Oscar Londero

| Integrante | Legajo | GitHub | Módulos |
| :-- | :-: | :-- | :-- |
| Adolfo Vera | 18265 | [@adlfvrr](https://github.com/adlfvrr) | M1 (compartido) · M2 Productos |
| Lucas Vitale | 18313 | [@Vitale71](https://github.com/Vitale71) | M1 (compartido) · M3 Movimientos |
| Gabriel Aguirre | 18296 | [@GabiAguirre07](https://github.com/GabiAguirre07) | M1 (compartido) · M4 Reportes y alertas |

📋 **Tablero de seguimiento:** https://github.com/users/adlfvrr/projects/4
📄 **Contrato de la API:** [`docs/contrato-api.md`](docs/contrato-api.md)

## Stack

| Capa | Tecnología |
| :-- | :-- |
| Backend | Java 17 · Spring Boot 3.5 (Web, Data JPA, Validation) |
| Base de datos | PostgreSQL 16 |
| Frontend | React 18 · TypeScript · Vite |

## Estructura

```
/backend    API REST en Java (Spring Boot + Maven)
/frontend   Aplicación web en React + TypeScript (Vite)
/database   Scripts SQL de PostgreSQL: 01_schema.sql (tablas) y 02_seed.sql (datos de prueba)
/docs       Contrato de la API y capturas de evidencia
```

## Cómo levantar el proyecto en local

**Requisitos:** JDK 17, Maven (o IntelliJ IDEA, que lo trae incluido), Node.js 20+ y PostgreSQL 16.

### 1. Base de datos
```bash
psql -U postgres -c "CREATE DATABASE myinv;"
psql -U postgres -d myinv -f database/01_schema.sql
psql -U postgres -d myinv -f database/02_seed.sql
```
Usuarios de prueba: `admin` / `Admin123!` (ADMINISTRADOR) y `empleado` / `Empleado123!` (EMPLEADO). Más detalles en [`database/README.md`](database/README.md).

### 2. Backend (puerto 8080)
```bash
cd backend
mvn spring-boot:run
```
Si tu usuario o contraseña de PostgreSQL no es `postgres`/`postgres`, definí antes las variables de entorno `DB_USER` y `DB_PASSWORD` (o `DB_URL` para otra base). También podés ejecutar `MyinvApplication` desde IntelliJ.

Comprobación: http://localhost:8080/api/health debe responder `"baseDeDatos": "CONECTADA"`.

### 3. Frontend (puerto 5173)
```bash
cd frontend
npm install
npm run dev
```
Abrir http://localhost:5173. En desarrollo, Vite redirige `/api` al backend.

## Flujo de trabajo

- Una rama por módulo: `feature/modulo-1`, `feature/modulo-2`, `feature/modulo-3`, `feature/modulo-4`. Se integran a `main` con *Pull Request*.
- Commits descriptivos que referencian la issue, por ejemplo `feat(auth): login con JWT y roles (#3)`.
