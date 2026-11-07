# Contrato de la API REST — MyInv

Versión 1.0 · Acordado por el equipo antes de programar (mitigación del riesgo **R1**).

Este documento define cómo se comunican el **frontend (React + TypeScript)** y el **backend (Java 17 + Spring Boot 3)**. Todo cambio en un endpoint se acuerda primero acá y después se programa.

---

## 1. Convenciones generales

| Tema | Regla |
| :-- | :-- |
| URL base | `http://localhost:8080/api` (en desarrollo, Vite redirige `/api` al puerto 8080) |
| Formato | JSON en UTF-8 (`Content-Type: application/json`) |
| Nombres de campos | `camelCase` en español (ej. `stockActual`, `categoriaId`) |
| Fechas | ISO-8601 con zona horaria (ej. `2026-11-07T10:30:00-03:00`) |
| Autenticación | Encabezado `Authorization: Bearer <token>` en todos los endpoints salvo los marcados como **público** |
| Roles | `ADMINISTRADOR` y `EMPLEADO` |
| Rendimiento | Toda consulta o actualización debe responder en **menos de 5 segundos** |

### 1.1. Formato estándar de error

Todos los errores devuelven el mismo cuerpo:

```json
{
  "timestamp": "2026-11-07T10:30:00-03:00",
  "status": 400,
  "error": "Bad Request",
  "mensaje": "Los datos enviados no son válidos",
  "ruta": "/api/productos",
  "errores": {
    "nombre": "El nombre es obligatorio"
  }
}
```

`errores` solo aparece cuando hay errores de validación por campo.

| Código | Cuándo se usa |
| :-: | :-- |
| `400` | Datos inválidos (validación) |
| `401` | Falta el token, es inválido o venció; o credenciales incorrectas en el login |
| `403` | El usuario está autenticado pero su rol no tiene permiso |
| `404` | El recurso no existe |
| `409` | Conflicto de negocio (ej. stock insuficiente, producto duplicado) |
| `500` | Error inesperado del servidor |

---

## 2. Estado del sistema — Módulo 1 (T01)

### `GET /api/health` — **público**

Verifica que el backend esté levantado y conectado a PostgreSQL.

**200 OK**
```json
{
  "estado": "OK",
  "baseDeDatos": "CONECTADA",
  "version": "1.0.0",
  "timestamp": "2026-11-07T10:30:00-03:00"
}
```
Si la base no responde: `"estado": "DEGRADADO"` y `"baseDeDatos": "DESCONECTADA"` (igualmente con 200).

---

## 3. Autenticación y roles — Módulo 1 (T03 / T04)

### `POST /api/auth/login` — **público**

**Request**
```json
{ "username": "admin", "password": "Admin123!" }
```

**200 OK**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tipo": "Bearer",
  "expiraEn": 28800,
  "usuario": {
    "id": 1,
    "username": "admin",
    "nombreCompleto": "Administrador La previa",
    "rol": "ADMINISTRADOR"
  }
}
```
`expiraEn` está en segundos (8 horas).

**401** si el usuario no existe, está inactivo o la contraseña es incorrecta (mismo mensaje en los tres casos: `"Usuario o contraseña incorrectos"`).

### `GET /api/auth/me` — ADMINISTRADOR, EMPLEADO

Devuelve el usuario dueño del token (mismo formato que `usuario` del login). Se usa para restaurar la sesión al recargar la página.

### Permisos por rol

| Recurso | EMPLEADO | ADMINISTRADOR |
| :-- | :-: | :-: |
| Consultar productos y catálogos | ✅ | ✅ |
| Crear / modificar / eliminar productos | ❌ | ✅ |
| Crear categorías, marcas y presentaciones | ❌ | ✅ |
| Registrar movimientos de entrada y salida | ✅ | ✅ |
| Consultar historial, alertas y reportes | ✅ | ✅ |

---

## 4. Catálogo de productos — Módulo 2 (T05 / T06)

### 4.1. Catálogos auxiliares

| Método y ruta | Rol | Descripción |
| :-- | :-- | :-- |
| `GET /api/categorias` | Ambos | Lista de categorías ordenadas por nombre |
| `POST /api/categorias` | ADMINISTRADOR | Crea una categoría |
| `GET /api/marcas` | Ambos | Lista de marcas ordenadas por nombre |
| `POST /api/marcas` | ADMINISTRADOR | Crea una marca |
| `GET /api/presentaciones` | Ambos | Lista de presentaciones ordenadas por descripción |
| `POST /api/presentaciones` | ADMINISTRADOR | Crea una presentación |

**Respuesta de cada elemento**
```json
{ "id": 1, "nombre": "Cervezas" }
```
(para presentaciones el campo es `"descripcion"`, ej. `"Lata 473 ml"`).

**Request de alta**: `{ "nombre": "Aguas" }` o `{ "descripcion": "Botella 2,25 L" }`. Responde **201** con el elemento creado; **409** si ya existe.

### 4.2. Productos

#### `GET /api/productos` — Ambos

Filtros opcionales por *query string*: `categoriaId`, `marcaId`, `presentacionId`, `q` (texto contenido en el nombre, sin distinguir mayúsculas), `soloActivos` (por defecto `true`).

**200 OK**
```json
[
  {
    "id": 1,
    "nombre": "Cerveza Quilmes Clásica",
    "categoria": { "id": 1, "nombre": "Cervezas" },
    "marca": { "id": 1, "nombre": "Quilmes" },
    "presentacion": { "id": 2, "descripcion": "Lata 473 ml" },
    "precio": 1500.00,
    "stockActual": 48,
    "stockMinimo": 24,
    "enStockMinimo": false,
    "activo": true
  }
]
```
`enStockMinimo` es `true` cuando `stockActual <= stockMinimo`.

#### `GET /api/productos/{id}` — Ambos
Devuelve un producto (mismo formato). **404** si no existe.

#### `POST /api/productos` — ADMINISTRADOR

```json
{
  "nombre": "Cerveza Quilmes Clásica",
  "categoriaId": 1,
  "marcaId": 1,
  "presentacionId": 2,
  "precio": 1500.00,
  "stockActual": 48,
  "stockMinimo": 24
}
```
Reglas: `nombre` obligatorio (máx. 120); `categoriaId`, `marcaId` y `presentacionId` obligatorios y existentes; `precio >= 0`; `stockActual >= 0` (stock inicial); `stockMinimo >= 0`.
Responde **201** con el producto creado. **409** si ya existe un producto activo con el mismo nombre, marca y presentación.

#### `PUT /api/productos/{id}` — ADMINISTRADOR

Mismo cuerpo que el alta **sin** `stockActual`: una vez creado el producto, el stock solo cambia mediante **movimientos** (Módulo 3). Responde **200** con el producto actualizado.

#### `DELETE /api/productos/{id}` — ADMINISTRADOR

Baja lógica (`activo = false`) para conservar el historial de movimientos. Responde **204**.

---

## 5. Movimientos de stock — Módulo 3 (T07 / T08)

#### `POST /api/movimientos` — Ambos

```json
{
  "productoId": 1,
  "tipo": "ENTRADA",
  "cantidad": 24,
  "proveedor": "Distribuidora Norte",
  "observacion": "Compra semanal"
}
```
- `tipo`: `ENTRADA` (compra a proveedor) o `SALIDA` (venta).
- `cantidad` entero `> 0`.
- `proveedor` recomendado para `ENTRADA`; `observacion` opcional.
- Se ejecuta en una **transacción**: suma o descuenta el stock del producto.
- **409** si es una `SALIDA` y la cantidad supera el stock actual (`"Stock insuficiente: disponible 10, solicitado 12"`).

**201 Created**
```json
{
  "id": 15,
  "producto": { "id": 1, "nombre": "Cerveza Quilmes Clásica" },
  "tipo": "ENTRADA",
  "cantidad": 24,
  "stockResultante": 72,
  "proveedor": "Distribuidora Norte",
  "observacion": "Compra semanal",
  "fecha": "2026-11-07T10:30:00-03:00",
  "usuario": "empleado",
  "alertaStockMinimo": false
}
```

#### `GET /api/movimientos` — Ambos (T11)

Filtros opcionales: `tipo` (`ENTRADA`/`SALIDA`), `desde` y `hasta` (fechas `YYYY-MM-DD`, inclusive), `productoId`. Ordenado del más reciente al más antiguo. Devuelve una lista con el formato anterior.

---

## 6. Alertas y reportes — Módulo 4 (T09 / T10)

#### `GET /api/alertas` — Ambos

Productos activos con `stockActual <= stockMinimo`, ordenados por el faltante (mayor primero).

```json
[
  {
    "productoId": 7,
    "nombre": "Agua Villavicencio sin gas",
    "marca": "Villavicencio",
    "presentacion": "Botella 2 L",
    "stockActual": 3,
    "stockMinimo": 12,
    "faltante": 9
  }
]
```

#### `GET /api/reportes/existencias` — Ambos

```json
{
  "generadoEn": "2026-11-07T10:30:00-03:00",
  "totalProductos": 20,
  "totalUnidades": 812,
  "productosEnStockMinimo": 3,
  "porCategoria": [
    { "categoria": "Cervezas", "productos": 6, "unidades": 320 }
  ]
}
```
