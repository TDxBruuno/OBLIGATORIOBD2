# OBLIGATORIOBDII — Sistema de Ticketing Mundial 2026

Trabajo obligatorio de Bases de Datos II (UCU) — Sistema de ticketing Mundial 2026.

Backend en **Java 17 + Spring Boot**, frontend en **HTML/CSS/JS plano** (sin
framework ni build tool), persistencia en **MySQL**. La aplicación se sirve
completa desde el propio backend (Spring Boot expone el frontend como recursos
estáticos), por lo que no hace falta levantar nada por separado.

## 1. Requisitos previos

Instalar antes de intentar correr el proyecto:

- **JDK 17** (Java Development Kit, no solo el runtime). Verificar con `java -version`.
- **Maven 3.9+**. Verificar con `mvn -version`. Si no lo tenés instalado, instalalo
  desde [maven.apache.org](https://maven.apache.org/download.cgi) o con un
  gestor de paquetes (`choco install maven` en Windows, `brew install maven` en Mac).
- **PowerShell** para correr los scripts `.ps1` (en Windows ya viene instalado;
  en Mac/Linux se puede usar `pwsh` si se instala PowerShell Core).

## 2. Configurar las credenciales (`run.local.ps1`)

El repo solo trae **`run.ps1`**, que es una plantilla sin contraseñas reales

Pasos:

1. Dentro de la carpeta `java/`, hacé una copia de `run.ps1` y llamala
   `run.local.ps1`:

   ```powershell
   cd java
   Copy-Item run.ps1 run.local.ps1
   ```

2. Abrí `run.local.ps1` y completá las variables con los datos reales:

   ```powershell
   $env:TICKETING_DB_URL="jdbc:mysql://mysql.reto-ucu.net:50006/XR_Grupo3?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
   $env:TICKETING_DB_USER="xr_g3_admin"
   $env:TICKETING_DB_PASSWORD="<la contraseña real de la base>"
   $env:TICKETING_TOKEN_SECRET="<string secreto>"
   mvn spring-boot:run
   ```

## 3. Ejecutar el backend (y el frontend, que viene incluido)

Desde la carpeta `java/`:

```powershell
.\run.local.ps1
```

Esto exporta las variables de entorno y corre `mvn spring-boot:run`.


## 4. Usar la aplicación

Abrir en el navegador:

```
http://localhost:8080
```

El login del prototipo es **solo por mail** (no hay contraseña, es una demo).

## 5. Problemas comunes

- **"Communications link failure" / no conecta a la base**: revisar que la
  `TICKETING_DB_URL`, usuario y contraseña en `run.local.ps1` sean correctos, y
  que la base esté accesible desde tu red (la instancia remota puede tener
  restricciones de IP).
- **`mvn` no se reconoce como comando**: falta instalar Maven o agregarlo al
  `PATH`.
- **Error de versión de Java**: confirmar `java -version` → debe ser 17 o superior.
- **Puerto 8080 ocupado**: se puede cambiar seteando la variable de entorno
  `SERVER_PORT` antes de correr `run.local.ps1` (por ejemplo
  `$env:SERVER_PORT="8081"`).
