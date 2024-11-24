# API de Gestión de Reservas

Esta API permite la gestión de reservas de hoteles, incluyendo funcionalidades para registrar usuarios, autenticar, listar hoteles, crear reservas, gestionar pagos, y cancelaciones de reservas. Está construida con **Node.js**, **Express**, y **MongoDB**.

## Funcionalidades

### Usuarios
- **Registro de Usuarios**: Permite a los nuevos usuarios registrarse proporcionando un correo y una contraseña.
- **Autenticación**: Los usuarios pueden iniciar sesión para obtener un token JWT que les permite realizar acciones protegidas.

### Hoteles
- **Listar Hoteles**: Permite obtener una lista de todos los hoteles disponibles con detalles como:
  - Nombre del hotel.
  - Ubicación.
  - Descripción.
  - Amenidades.
  - Precio por noche.
  - Habitaciones disponibles.

### Reservas
- **Crear Reservas**: Permite a los usuarios crear reservas en un hotel, especificando:
  - Fecha de entrada.
  - Fecha de salida.
  - Tipo de habitación.
- **Listar Reservas**: Los usuarios pueden ver todas sus reservas activas.

### Pagos
- **Marcar una Reserva como Pagada**: Los usuarios pueden pagar por sus reservas. Una vez pagada, la reserva se actualiza con el estado de `pagada`.

### Cancelaciones
- **Cancelar una Reserva**: Permite a los usuarios cancelar sus reservas siempre que no estén pagadas. Al cancelar:
  - La reserva se elimina.
  - La cantidad de habitaciones disponibles en el hotel se actualiza automáticamente.

## Endpoints Principales

### Usuarios

| Método | Endpoint          | Descripción                      |
|--------|-------------------|----------------------------------|
| POST   | `/api/auth/register` | Registra un nuevo usuario.       |
| POST   | `/api/auth/login`    | Autentica un usuario y genera un token JWT. |

### Hoteles

| Método | Endpoint        | Descripción                      |
|--------|-----------------|----------------------------------|
| GET    | `/api/hotels`   | Obtiene la lista de hoteles disponibles. |

### Reservas

| Método | Endpoint            | Descripción                                |
|--------|---------------------|--------------------------------------------|
| POST   | `/api/bookings`     | Crea una nueva reserva.                    |
| GET    | `/api/bookings`     | Lista todas las reservas del usuario.      |
| PUT    | `/api/bookings/:id/pay` | Marca una reserva como pagada.              |
| DELETE | `/api/bookings/:id/cancel` | Cancela una reserva no pagada.             |

## Requisitos Previos

- Node.js instalado.
- MongoDB configurado (local o en la nube).
- Variables de entorno definidas en un archivo `.env`:
  ```env
  PORT=5000
  MONGO_URI=tu_uri_de_mongodb
  JWT_SECRET=tu_secreto_jwt
