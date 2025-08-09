# Gestion Clientes

Proyecto full‑stack Flask + Angular.
# Client Management System (Angular 17 + Flask + MySQL + Docker)

Sistema Fullstack para gestión de clientes (personas fisicas y morales), desarrollado con **Angular 17** en el frontend y **Flask** en el backend, con base de datos **MySQL**.  
Incluye autenticación con JWT, validaciones en frontend y backend, subida de documentos y despliegue mediante Docker.

---

##  Características Principales

- **CRUD completo** para clientes (alta, baja, edición y consulta).
- **Tipos de persona**: Física o Moral.
- **Validaciones**:
  - RFC: formato y unicidad.
  - Email y teléfono: formato correcto.
- **Subida de documentos**:
  - Persona física → Identificación oficial.
  - Persona moral → Acta constitutiva.
- **Autenticación con JWT**:
  - Bloqueo de rutas si no hay sesión.
  - Expiración de sesión automática.
- **Diseño y estilos personalizados** para UI.
- **Ambiente QA** preconfigurado.
- **Docker Compose** para levantar todo el stack.

---

## Tecnologías Usadas

### Frontend
- **Angular**: v17.3.0
- HTML5, SCSS, TypeScript
- Angular Material

### Backend
- **Python** 3.11+
- **Flask** (API REST)
- flask-cors
- flask-mysqldb
- flask-jwt-extended (**JWT** para autenticación)
- python-dotenv

### Base de Datos
- MySQL 8.x
- Stored Procedures para Alta, Edición, Eliminación y Consulta

### Infraestructura y DevOps
- **Docker** y **Docker Compose** para contenerización y orquestación
- Ambiente QA listo

---

## Estructura del Proyecto

```
gestion-clientes/                  # Proyecto raiz
│
├── docker-compose.yml              # Orquestación Docker (backend, frontend, MySQL)
├── README.md                       # Documentación del proyecto
├── .env.example                    # Variables de entorno de ejemplo
│
├── backend/                        # API Flask (Python)
│   ├── app.py                       # Punto de entrada del backend
│   ├── db.py                        # Configuración de conexión MySQL
│   ├── Dockerfile                   # Imagen Docker del backend
│   ├── requirements.txt             # Dependencias Python
│   ├── stored_procedures.sql        # Scripts de SP para MySQL
│   │
│   ├── controllers/                 # Controladores de API REST
│   │   ├── auth_controller.py       # Login / Logout
│   │   └── cliente_controller.py    # CRUD clientes
│   │
│   ├── utils/                       # Funciones auxiliares
│   │   └── validators.py            # Validaciones RFC, email, teléfono
│   │
│   ├── tests/                       # Pruebas unitarias
│   │   ├── test_auth.py              # Tests de auth
│   │   ├── test_clientes.py          # Tests CRUD clientes
│   │   └── test_validaciones.py      # Tests de validaciones
│
├── frontend/                        # Aplicacion Angular
│   └── clientes-app/                # Proyecto Angular principal
│       ├── Dockerfile                # Imagen Docker del frontend
│       ├── angular.json              # Configuración Angular CLI
│       ├── package.json              # Dependencias y scripts
│       ├── package-lock.json         # Versiones exactas de dependencias
│       │
│       ├── src/                      # Codigo fuente Angular
│       │   ├── app/                  # Logica de la aplicación
│       │   │   ├── app.module.ts      # Modulo raiz
│       │   │   ├── auth.guard.ts      # Proteccion de rutas
│       │   │   ├── auth.interceptor.ts# Interceptor JWT
│       │   │   ├── auth.service.ts    # Servicio de autenticacion
│       │   │   │
│       │   │   ├── clientes/          # Modulo clientes
│       │   │   │   ├── clientes.component.ts        # Lista clientes
│       │   │   │   ├── cliente-form.component.ts    # Formulario alta/edicion
│       │   │   │   └── clientes.service.ts          # Servicio API clientes
│       │   │   │
│       │   │   ├── login/             # Modulo de login
│       │   │   │   └── login.component.ts
│       │   │   │
│       │   │   └── shared/            # Componentes reutilizables
│       │   │       └── confirm-dialog.component.ts  # Confirmacion eliminar
│       │   │
│       │   ├── environments/          # Configuraciones de ambiente
│       │   │   ├── environment.ts     # QA
│       │   │   └── environment.prod.ts# Produccion
│       │   │
│       │   ├── styles.scss            # Estilos globales
│       │   └── index.html             # HTML raiz
```

---

## Instalacion y Ejecucion

### Opcion 1 — Con Docker (Recomendada)
Asegúrate de tener **Docker** y **Docker Compose** instalados.
```bash
git clone <https://github.com/lizbeth-caldera/sistema-gestion-clientes.git>
cd gestion-clientes
docker compose up --build
```
Esto levantará:
- **Frontend Angular** en `http://localhost:4200`
- **Backend Flask** en `http://localhost:5000`
- **MySQL** en `localhost:3306`

---


##  Autenticacion y Seguridad

- Autenticacion por **JWT**.
- Rutas protegidas con `AuthGuard` en Angular.
- Interceptor HTTP (`auth.interceptor.ts`) para añadir el token a las peticiones.
- Si cierras sesion y vuelves a abrir la URL → no puedes acceder sin iniciar sesin.

---

## Estilos y UI
- Paleta personalizada.
- Angular Material con botones, dialogos y formularios estilizados.
- Máscaras para campos RFC y Teléfono.

---

## QA
- Configuracion de **ambiente QA** en `environment.ts` y `environment.prod.ts`.
- Scripts de prueba unitaria en backend con `pytest`.

---

## Base de Datos
- Tabla `clientes` con campos para personas fisicas y morales.
- Stored Procedures:
  - `sp_clientes_insert`
  - `sp_clientes_update`
  - `sp_clientes_delete`
  - `sp_clientes_select`

---

