# Proyecto Cafetería ☕

[![Docker](https://img.shields.io/badge/Docker-enabled-blue?logo=docker&style=flat-square)](https://www.docker.com/)
[![Angular](https://img.shields.io/badge/Frontend-Angular-red?logo=angular&style=flat-square)](https://angular.io/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot-brightgreen?logo=springboot&style=flat-square)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/Database-MySQL-blue?logo=mysql&style=flat-square)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)](#licencia)

## Descripción

**Proyecto Cafetería** es una aplicación fullstack de gestión de cafetería que combina una interfaz Angular moderna con un backend Spring Boot robusto y una base de datos MySQL. Está diseñada para ser un proyecto de portafolio profesional enfocado en la gestión de usuarios, productos, categorías, pedidos y facturación.

> Un sistema realista para administrar operaciones de café, generar facturas en PDF, controlar inventario y manejar permisos de usuario.

## Demo

- **Frontend:** `http://localhost:82`
- **Backend API:** `http://localhost:8081`

### Capturas de pantalla sugeridas

1. Pantalla principal del dashboard
2. Gestión de productos y categorías
3. Flujo de facturación / PDF
4. Edición de usuarios y roles

> Inserta las imágenes en estas secciones cuando tengas capturas listas.

### Ejemplo de sección de imágenes

```md
![Dashboard](docs/screenshots/dashboard.png)
![Gestión de productos](docs/screenshots/products.png)
``` 

---

## Contenido

- [Características](#caracter%C3%ADsticas)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnolog%C3%ADas)
- [Estructura de carpetas](#estructura-de-carpetas)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalaci%C3%B3n)
- [Ejecución con Docker Compose](#ejecuci%C3%B3n-con-docker-compose)
- [Ejecución manual](#ejecuci%C3%B3n-manual)
- [Variables de entorno](#variables-de-entorno)
- [Endpoints principales](#endpoints-principales)
- [Mejoras futuras](#mejoras-futuras)
- [Buenas prácticas](#buenas-pr%C3%A1cticas-implementadas)
- [Deploy](#deploy)
- [Autor](#autor)
- [Licencia](#licencia)

---

## Características principales

- Gestión de usuarios con autenticación y roles
- CRUD completo de productos y categorías
- Reportes y facturas en PDF
- Dashboard con métricas clave
- Integración con MySQL y Spring Data JPA
- Interfaz responsiva con Angular + Angular Material
- Contenedores Docker para despliegue local rápido

## Arquitectura

Proyecto construido con una arquitectura clásica de 3 capas:

- **Frontend**: Angular SPA para interacción con usuarios y administración.
- **Backend**: Spring Boot REST API con seguridad, servicios y manejo de datos.
- **Base de datos**: MySQL para persistencia relacional de clientes, productos y facturas.

### Flujo de datos

1. El usuario interactúa con la aplicación Angular.
2. Angular consume la API REST expuesta por Spring Boot.
3. Spring Boot gestiona la lógica de negocio y persiste datos en MySQL.
4. El backend genera reportes PDF y maneja autenticación segura.

## Tecnologías usadas

| Capa | Herramienta | Propósito |
|---|---|---|
| Frontend | Angular 21 | Interfaz de usuario SPA |
| Backend | Spring Boot 4 | API REST y lógica de negocio |
| Base de datos | MySQL 8 | Persistencia relacional |
| Contenedores | Docker / Docker Compose | Despliegue local reproducible |
| Seguridad | Spring Security, JWT | Autenticación y autorización |
| PDFs | iText, PDFBox | Generación y manejo de facturas |
| Utilidades | Lombok, Guava, Gson | Productividad y JSON |

## Estructura de carpetas

```text
ProyectoCafeteria/
├── backend/                 # API Spring Boot
│   ├── src/main/java/...    # Código Java
│   ├── src/main/resources/  # Configuración y properties
│   ├── pom.xml              # Dependencias y build
│   └── mvnw                 # Wrapper Maven
├── frontend/                # Aplicación Angular
│   ├── src/                 # Código fuente Angular
│   ├── package.json         # Dependencias y scripts
│   └── angular.json         # Configuración del proyecto Angular
├── docker-compose.yml       # Definición de servicios Docker
└── .gitignore               # Archivos ignorados por Git
```

## Requisitos previos

- Docker y Docker Compose instalados
- Node.js >= 18 y npm
- Java 17
- Maven (si ejecutas backend manualmente)
- MySQL o Docker para la base de datos

---

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/<tu-usuario>/ProyectoCafeteria.git
cd ProyectoCafeteria
```

2. Instalar dependencias del frontend:

```bash
cd frontend
npm install
```

3. Verificar la configuración del backend:

```bash
cd ../backend
./mvnw dependency:resolve
```

> Si usas Windows, reemplaza `./mvnw` por `mvnw.cmd`.

---

## Ejecución con Docker Compose

### Opción 1: Iniciar los contenedores

```bash
docker compose up -d
```

### Opción 2: Con Docker Compose clásico

```bash
docker-compose up -d
```

### Servicios expuestos

- Frontend: `http://localhost:82`
- Backend: `http://localhost:8081`
- MySQL: `localhost:3307`

### Verificar estado

```bash
docker compose ps
```

> Nota: el archivo `docker-compose.yml` actual configura una variable de entorno externa en `./Backend-Proyecto-Cafeter-a/.env`. Asegúrate de que el archivo exista o actualiza la ruta según tu estructura.

---

## Ejecución manual

### Backend

1. Ir al directorio backend:

```bash
cd backend
```

2. Ejecutar con Maven Wrapper:

```bash
./mvnw spring-boot:run
```

3. Alternativa con paquete JAR:

```bash
./mvnw clean package
java -jar target/com.ec.cafe-0.0.1-SNAPSHOT.jar
```

### Frontend

1. Ir al directorio frontend:

```bash
cd frontend
```

2. Ejecutar Angular en modo desarrollo:

```bash
npm start
```

3. Acceder en el navegador:

```text
http://localhost:4200
```

> Si usas Docker Compose y quieres ejecutar solo frontend o backend, asegúrate de configurar la URL API en el frontend y el `spring.datasource.url` del backend.

---

## Variables de entorno

### Variables para Docker / `.env`

```env
MYSQL_DATABASE=cafeSystem
MYSQL_ROOT_PASSWORD=admin
MAIL_PASSWORD=<tu-mail-password>
```

### Variables en `backend/src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:mysql://db:3306/cafeSystem
spring.datasource.username=root
spring.datasource.password=admin
server.port=8081
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=frankandres002@gmail.com
spring.mail.password=${MAIL_PASSWORD}
```

### Ajuste local (si no usas Docker)

```properties
spring.datasource.url=jdbc:mysql://localhost:3307/cafeSystem?useSSL=false&serverTimezone=UTC
```

---

## Endpoints principales

Base URL: `http://localhost:8081`

| Recurso | Método | Ruta | Descripción |
|---|---|---|---|
| Usuarios | POST | `/user/signup` | Registro de usuario |
| Usuarios | POST | `/user/login` | Inicio de sesión |
| Usuarios | GET | `/user/get` | Obtener lista de usuarios |
| Usuarios | GET | `/user/checkToken` | Validar token |
| Usuarios | POST | `/user/update` | Actualizar usuario |
| Usuarios | POST | `/user/changePassword` | Cambiar contraseña |
| Usuarios | POST | `/user/forgotPassword` | Recuperar contraseña |
| Categorías | POST | `/category/add` | Crear categoría |
| Categorías | GET | `/category/get` | Obtener categorías |
| Categorías | POST | `/category/update` | Actualizar categoría |
| Productos | POST | `/product/add` | Crear producto |
| Productos | GET | `/product/get` | Listar productos |
| Productos | POST | `/product/update` | Actualizar producto |
| Productos | DELETE | `/product/delete/{id}` | Eliminar producto |
| Productos | POST | `/product/updateStatus` | Cambiar estado del producto |
| Productos | GET | `/product/getByCategory/{id}` | Productos por categoría |
| Productos | GET | `/product/getProductById/{id}` | Detalle de producto |
| Dashboard | GET | `/dashboard/details` | Métricas generales |
| Facturas | POST | `/factura/generateReport` | Generar factura/PDF |
| Facturas | GET | `/factura/getFacturas` | Obtener facturas |
| Facturas | POST | `/factura/getPdf` | Descargar PDF |
| Facturas | DELETE | `/factura/delete/{id}` | Eliminar factura |

---

## Deploy

Para un deployment profesional en producción, considera:

- Usar `docker compose` con `build` local o imágenes privadas.
- Configurar variables seguras en un `secrets` manager.
- Usar `Nginx` o `Cloudflare` para servir el frontend y manejar HTTPS.
- Implementar CI/CD para tests y despliegue automático.

## Mejoras futuras

- Autenticación con OAuth2 o social login
- Dashboard avanzado con gráficos y análisis de ventas
- Internationalization (i18n)
- Notificaciones en tiempo real
- Testing E2E y cobertura automatizada
- Despliegue en AWS / Azure / DigitalOcean

## Buenas prácticas implementadas

- Separación de frontend y backend
- Contenerización con Docker Compose
- Uso de `mvnw` y `npm` scripts para reproducibilidad
- Configuración de MySQL con volumen persistente
- Estructura modular en Angular y Spring Boot
- Manejo de errores en endpoints del backend
- Uso de `application.properties` para configuración

## Autor

- **Nombre:** Frank Andrés
- **Proyecto:** Proyecto Cafetería
- **Perfil:** Frontend Angular + Backend Spring Boot

> Este proyecto está preparado para mostrarse en un portafolio profesional. Destaca la integración de una SPA Angular con un backend Java sólido y un despliegue claro con Docker.

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo `LICENSE` si deseas agregarlo.
