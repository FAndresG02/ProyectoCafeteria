# ☕ Backend Proyecto Cafetería

Backend desarrollado con Spring Boot para la gestión de una cafetería.

Permite administrar:

- Usuarios
- Productos
- Categorías
- Facturas
- Dashboard administrativo
- Autenticación con JWT

---

# 🚀 Tecnologías utilizadas

- Java 17
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA
- MariaDB / MySQL
- Maven
- Lombok
- REST API

---

# 📁 Arquitectura del proyecto

El proyecto está organizado siguiendo una arquitectura por capas:

```bash
src/main/java/com/ec/cafe
│
├── config        # Configuraciones globales
├── controller    # Endpoints REST
├── dto           # Objetos de transferencia de datos
├── entity        # Entidades JPA
├── repository    # Acceso a datos
├── response      # Respuestas personalizadas
├── security      # JWT y Spring Security
├── service       # Lógica de negocio
└── utils         # Utilidades
```

---

# 🔐 Seguridad

El sistema utiliza:

- Spring Security
- JWT Token Authentication
- Filtros personalizados
- Roles y autenticación

Archivos principales:

- `SecurityConfig`
- `JwtUtil`
- `JwtAuthenticationFilter`

---

# 🗄️ Base de datos

Base de datos utilizada:

- MariaDB / MySQL

Configuración en:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/cafeSystem
spring.datasource.username=root
spring.datasource.password=*****
```

---

# 📌 Funcionalidades

## 👤 Usuarios

- Registro
- Login
- Gestión de usuarios
- Roles

## 📦 Productos

- Crear productos
- Actualizar productos
- Eliminar productos
- Listar productos

## 🏷️ Categorías

- CRUD de categorías

## 🧾 Facturación

- Generación de facturas
- Historial de facturas

## 📊 Dashboard

- Estadísticas generales del sistema

---

# 🔗 Endpoints principales

## Auth

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/user/login` | Iniciar sesión |
| POST | `/user/signup` | Registrar usuario |

## Productos

| Método | Endpoint |
|---|---|
| GET | `/product/get` |
| POST | `/product/add` |
| POST | `/product/update` |
| POST | `/product/delete/{id}` |

## Categorías

| Método | Endpoint |
|---|---|
| GET | `/category/get` |
| POST | `/category/add` |

---

# ⚙️ Cómo ejecutar el proyecto

## 1. Clonar repositorio

```bash
git clone https://github.com/usuario/repositorio.git
```

## 2. Entrar al proyecto

```bash
cd Backend-Proyecto-Cafeteria
```

## 3. Configurar base de datos

Editar:

```properties
src/main/resources/application.properties
```

## 4. Ejecutar proyecto

```bash
./mvnw spring-boot:run
```

o

```bash
mvn spring-boot:run
```

---

# 🧪 Pruebas API

Puedes probar los endpoints usando:

- Postman
- Insomnia

---

# 📷 Capturas

## Estructura del proyecto

Agrega aquí tus imágenes:

```md
![estructura](docs/estructura.png)
```

---

# 📈 Mejoras futuras

- Dockerización
- Tests unitarios
- Swagger/OpenAPI
- Deploy en Render o Railway
- CI/CD

---

# 👨‍💻 Autor

Andres Guapisaca

Backend Developer Java + Spring Boot