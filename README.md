# API REST E-commerce - Backend

Este proyecto es una API REST construida con **Node.js**, **Express** y **MongoDB** para gestionar un pequeño flujo de e-commerce. Incluye autenticación con JWT, control de acceso por roles, administración de usuarios, productos y categorías, y un flujo de carrito con reserva de stock para evitar problemas de concurrencia.

## Tecnologías Utilizadas

- **Runtime**: Node.js
- **Framework**: Express.js
- **Base de Datos**: MongoDB con Mongoose
- **Autenticación**: JWT, Bcrypt
- **Sesiones**: express-session
- **Configuración**: Dotenv

## Prerrequisitos

- **Node.js** instalado
- **MongoDB** disponible local o remoto

## Instalación y Configuración

1. **Clonar el repositorio**:

```bash
git clone <URL_DEL_REPOSITORIO>
cd UTN
```

2. **Instalar dependencias**:

```bash
npm install
```

3. **Configurar variables de entorno**:

Crear un archivo `.env` con una base similar a esta:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/utn
```

4. **Iniciar el servidor**:

- Desarrollo: `npm run dev`
- Producción: `npm run start`

## Estructura del Proyecto

```text
src/
├── config/         # Configuración general y conexión a MongoDB
├── controllers/    # Controladores HTTP
├── helpers/        # Helpers reutilizables
├── middlewares/    # Middlewares de auth y autorización
├── models/         # Modelos de Mongoose
├── routes/         # Endpoints de la API
├── services/       # Lógica de negocio
└── utils/          # Utilidades compartidas
```

## Funcionalidades Principales

1. **Gestión de usuarios y autenticación**
   - Registro de usuarios.
   - Login con JWT.
   - Roles disponibles: **administrador** y **cliente**.
   - Protección de rutas por token y rol.

2. **Administración de productos**
   - Crear, editar y eliminar productos solo para `administrador`.
   - Listado y detalle disponible para `administrador` y `cliente`.
   - Categoría asociada, estado, imagen, stock y margen de ganancia.

3. **Administración de categorías**
   - Crear, editar y eliminar categorías solo para `administrador`.
   - Listado disponible para `administrador` y `cliente`.

4. **Flujo de carrito de compra**
   - Un carrito activo por cliente.
   - Reserva de stock al agregar productos.
   - Modificación de cantidades con ajuste de stock.
   - Remoción de productos con devolución de stock.
   - Cancelación de carrito con restauración de stock.
   - Checkout final con detalle de compra.
   - Expiración automática por uso a los 30 minutos.

## Roles y Permisos

### Administrador

- Gestionar usuarios.
- Crear, listar, editar y eliminar productos.
- Crear, listar, editar y eliminar categorías.

### Cliente

- Listar productos.
- Listar categorías.
- Crear y operar su propio carrito.
- Finalizar compras.

## Rutas Base

Las rutas están montadas con estos prefijos:

- `user`: `/api/user`
- `product`: `/api/product`
- `category`: `/api/category`
- `cart`: `/api/cart`

## Ejemplos de Peticiones

### Registro de usuario

**Endpoint:** `POST /api/user`

```json
{
  "name": "Lucia",
  "lastName": "Martinez",
  "email": "lucia@moda.com",
  "password": "Moda123"
}
```

### Login

**Endpoint:** `POST /api/user/login`

```json
{
  "email": "lucia@moda.com",
  "password": "Moda123"
}
```

### Crear producto

**Endpoint:** `POST /api/product`

**Headers:**

```http
Authorization: Bearer <token_admin>
Content-Type: application/json
```

```json
{
  "name": "zapatillas urbanas",
  "price": 89999,
  "description": "zapatillas urbanas de cuero ecologico",
  "quantity": 12,
  "status": "DISPONIBLE",
  "category": "ID_CATEGORIA",
  "highlighted": true,
  "profitRate": 1.35,
  "image": "https://example.com/zapatillas-urbanas.jpg"
}
```

### Crear categoría

**Endpoint:** `POST /api/category`

**Headers:**

```http
Authorization: Bearer <token_admin>
Content-Type: application/json
```

```json
{
  "name": "calzado"
}
```

### Crear u obtener carrito activo

**Endpoint:** `POST /api/cart`

**Headers:**

```http
Authorization: Bearer <token_cliente>
```

### Agregar producto al carrito

**Endpoint:** `POST /api/cart/items`

**Headers:**

```http
Authorization: Bearer <token_cliente>
Content-Type: application/json
```

```json
{
  "productId": "ID_PRODUCTO",
  "quantity": 1
}
```

### Modificar cantidad de un ítem del carrito

**Endpoint:** `PATCH /api/cart/items/:productId`

```json
{
  "quantity": 3
}
```

### Remover producto del carrito

**Endpoint:** `DELETE /api/cart/items/:productId`

### Finalizar compra

**Endpoint:** `POST /api/cart/checkout`

### Cancelar carrito

**Endpoint:** `POST /api/cart/cancel`

## Formato General de Respuestas

Las operaciones de creación, actualización y eliminación suelen responder con:

```json
{
  "message": "Texto descriptivo",
  "data": {}
}
```

Las operaciones de lectura pueden devolver directamente un objeto o un array.

Los errores responden con:

```json
{
  "message": "Descripción del error"
}
```

## Errores Frecuentes

- `400`: request inválido, validación, stock insuficiente o token inválido.
- `401`: usuario no autenticado.
- `403`: rol sin permisos.
- `404`: recurso inexistente.
- `500`: error interno del servidor.

## Notas de Implementación

- El registro público crea usuarios con rol `cliente`.
- El carrito reserva stock al agregar productos para evitar sobreventa.
- El stock se devuelve si el carrito se cancela, se modifica a menor cantidad o expira.
- El checkout finaliza la compra usando el stock ya reservado.
- Los endpoints de productos y categorías están montados en singular: `/api/product` y `/api/category`.
