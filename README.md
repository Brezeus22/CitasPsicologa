# 💼 Proyecto de Implantación

# 🧠 Sistema Psicológico de Consultas

---

## ❓ ¿Qué es?

El **Sistema Psicológico de Consultas** es una plataforma moderna diseñada para gestionar y organizar consultas psicológicas de manera eficiente. Permite a los usuarios (pacientes y psicólogos) agendar, modificar y llevar un registro de las sesiones, facilitando la comunicación y el seguimiento de los casos.

---

## ⚙️ ¿Cómo funciona?

1. 👤 **Registro de usuarios:** Pacientes y psicólogos pueden crear una cuenta en el sistema.
2. 📅 **Agendamiento de consultas:** Los pacientes solicitan citas según la disponibilidad de los psicólogos.
3. 📝 **Gestión de sesiones:** Los psicólogos registran notas, diagnósticos y el historial de cada paciente.
4. 🔔 **Notificaciones:** El sistema envía recordatorios automáticos de las próximas consultas.
5. 🔒 **Seguridad:** Toda la información se almacena de forma segura y confidencial.

---

## 🛠️ Tecnologías Utilizadas

- ⚛️ **Nicepage(HTML5-CSS)** (Frontend)
- 🐍 **Python** (Backend)
- 🗄️ **Mysql** (Base de datos)
- ☁️ **Flask** (Api)
- 📧 **Email API** (Notificaciones)

---

## 👥 Integrantes

- [@Shai Colmenarez](https://github.com/Shairacc)
- [@Aaron Arraez](https://github.com/Brezeus22)
- [@Michael Sangronis](https://github.com/05Michael03)
- [@Jose Alvarez](https://github.com/alejoprograming26)
- [@Kevin Rodriguez](https://github.com/kevinwar)

# Guía de Instalación y Configuración

Este apartado te guiará paso a paso en la instalación y configuración del entorno necesario para ejecutar el proyecto.

## 📥 1. Descargar e Instalar XAMPP con PHP

### Descargar XAMPP

1. Visita la [página oficial de XAMPP](https://www.apachefriends.org/es/index.html).
2. Descarga el instalador para tu sistema operativo.

### Instalar XAMPP

1. Ejecuta el instalador descargado
2. Selecciona los componentes a instalar (mínimo Apache, MySQL y PHP)
3. Elige directorio de instalación (ej: C:\xampp)
4. Completa el proceso de instalación

### Verificar la instalación

1. Una vez que XAMPP se haya instalado, abre el **Panel de Control de XAMPP** (se encuentra en el directorio donde lo instalaste, como `C:\xampp\xampp-control.exe`).

2. Inicia los servicios **Apache** y **MySQL** desde el panel de control.

3. Abre tu navegador y escribe en la barra de direcciones:

- [`http://localhost`](http://localhost)
- [`http://localhost/phpmyadmin/`](http://localhost/phpmyadmin/)

Deberías ver la página de inicio de XAMPP o phpMyAdmin.

### Verificar la versión de PHP

Ejecuta el siguiente comando en la terminal (**CMD**):

```sh
php --version
```

Deberías ver la versión de PHP instalada en tu sistema.

## 📥 2. Descargar e Instalar Git

### 1. Descargar Git

🌐 Visita la página oficial de descarga de Git: [Descargar Git](https://git-scm.com/downloads)  
🔻 Selecciona la versión compatible con tu sistema operativo.

### 2. Instalar Git

🛠️ Sigue estos pasos:

- Ejecuta el instalador descargado
- Acepta los términos de licencia
- **Importante:** Selecciona la opción:  
  `Git from the command line and also from 3rd-party software`  
  (Esto integra Git con la línea de comandos de Windows)
- Completa el proceso con las configuraciones predeterminadas

### 3. Verificar la instalación de Git

✅ Para confirmar que Git se instaló correctamente:

1. Abre el símbolo del sistema (**CMD**)
2. Ejecuta:
   ```sh
   git --version
   ```

Deberías ver la versión de Git instalada en tu sistema.

## 🐙 3. Clonar un Repositorio de GitHub

### 1. Obtener la URL del repositorio

🔹 Ve al repositorio en GitHub que deseas clonar

```plaintext
(https://github.com/Brezeus22/CitasPsicologa)
```

[Link de este repositorio](https://github.com/Brezeus22/CitasPsicologa)

🔹 Haz clic en el botón verde **"Code"**  
🔹 Copia la URL HTTPS

### 2. Clonar el repositorio

🖥️ Desde la terminal (**CMD**):

1. Navega al directorio htdocs de XAMPP:

```sh
cd C:\xampp\htdocs
```

También puedes navegar manualmente a:

```sh
C:\xampp\htdocs
```

2. Ejecuta el comando de clonación:

```sh
git clone https://github.com/Brezeus22/CitasPsicologa
```

### 3. Acceder al directorio del proyecto

📂 Después de clonar:

```sh
cd CitasPsicologa
```

O ingresa a la carpeta `htdocs` para verificar el repositorio.
