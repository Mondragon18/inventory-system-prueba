# inventory-system-prueba
Prueba Desarrollador API Rest con entrada y salida de tipo JSON de un inventario

# Sistema de Gestión de Inventario

Este es un sistema de gestión de inventario desarrollado con Node.js, Express y Sequelize. Permite administrar productos, categorías, y controlar el inventario de manera eficiente.

## Requisitos Previos

- Node.js (v14.x o superior)
- NPM (Node Package Manager)
- Base de Datos: PostgreSQL o MySQL

# Clonar el repositorio:**
   git clone https://github.com/tu-usuario/inventario.git
   cd inventario


## Instalación

1. **Ejecutar Migraciones de la Base de Datos:**
   Para crear las tablas necesarias en la base de datos, ejecuta:

   **npx sequelize-cli db**

2. **Configuración del Entorno:**

    Define la variable de entorno `JWT_SECRET` en tu sistema o en un archivo `.env` con una clave secreta para JWT.

3. **Inicio del Servidor:**
    Para iniciar el servidor, ejecuta:

    **npm start**

    El servidor estará disponible en http://localhost:3000 (puerto por defecto).

## Funcionalidades Principales

1. **Registro de Usuarios:**
- **Endpoint:** `POST /auth/register`
- **Descripción:** Permite registrar nuevos usuarios con roles de administrador o cliente.

2. **Inicio de Sesión:**
- **Endpoint:** `POST /auth/login`
- **Descripción:** Permite a los usuarios autenticarse y obtener un token JWT para acceder a funcionalidades protegidas.

3. **Gestión de Productos (Administradores):**
- **Endpoints CRUD:**
  - `POST /admin/products`
  - `PUT /admin/products/:id`
  - `DELETE /admin/products/:id`
  - `GET /admin/products`
- **Descripción:** Permite a los administradores crear, actualizar, eliminar y obtener productos del inventario.

4. **Realización de Compras (Clientes):**
- **Endpoint:** `POST /client/purchase`
- **Descripción:** Permite a los clientes realizar compras seleccionando productos y cantidades deseadas.

5. **Visualización de Historial de Compras (Clientes):**
- **Endpoint:** `GET /client/history`
- **Descripción:** Permite a los clientes ver un historial de las compras realizadas.

## Documentación Adicional

- La documentación detallada de cada endpoint está disponible en formato ApiDoc dentro del proyecto.
