# 📌 Frontend - Aplicación de Gestión de Tareas  

Este proyecto es una aplicación de gestión de tareas desarrollada con React y Vite. La aplicación permite a los usuarios registrarse, iniciar sesión, y gestionar sus tareas (agregar, editar, eliminar, marcar como completadas, y marcar como favoritas).  

## 🚀 Tecnologías utilizadas  

- **React**: Biblioteca de JavaScript para construir interfaces de usuario.
- **Vite**: Herramienta de construcción rápida para proyectos de frontend.
- **React Router**: Librería para el enrutamiento en aplicaciones de React.
- **React Query**: Librería para el manejo de datos asíncronos en React.
- **Material-UI**: Librería de componentes de interfaz de usuario para React.
- **Tailwind CSS**: Framework de CSS para diseño rápido.
- **Formik**: Librería para la gestión de formularios en React.
- **Yup**: Librería para la validación de esquemas de datos.
- **Axios**: Cliente HTTP para realizar peticiones a la API.
- **SweetAlert2**: Librería para mostrar alertas bonitas.
- **React Toastify**: Librería para mostrar notificaciones.  

## 📂 Instalación y configuración  

### 1️⃣ Clonar el repositorio  

```sh
git clone https://github.com/21martisch/Frontend-GestionDeTareas-SICORP.git
cd frontend
```

### 2️⃣ Instalar dependencias  

```sh
npm install
```

### 3️⃣ Configurar variables de entorno  

Crea un archivo **.env** en la raíz del backend y define las siguientes variables:  

```env
VITE_API_URL=https://backend-gestiondetareas-sicorp.onrender.com/api
```


### 4️⃣ Ejecutar el servidor  

```sh
npm start
```

El backend se ejecutará en `http://localhost:5173` 🚀  

---
## Descripción de Archivos y Directorios

- **src/**: Contiene todo el código fuente de la aplicación.
- **components/**: Componentes reutilizables de la aplicación.
- **Auth/**: Componentes relacionados con la autenticación (Login, Register).
- **Private/**: Componentes para rutas privadas.
- **Tasks/**: Componentes relacionados con la gestión de tareas (Dashboard, TaskCard, TaskModal, Sidebar).
- **context/**: Contextos de React para manejar el estado global (AuthContext).
- **hooks/**: Hooks personalizados de React (useAuth).
