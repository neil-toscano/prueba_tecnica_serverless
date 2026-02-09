# Sistema de Agendamiento de Citas Médicas
## A. 📄 Documentación de Referencia

* [📄Descargar PDF de la Prueba Técnica](https://drive.google.com/file/d/1LFsRnRGON5aI_UJjt_q12t8L2E4YwrDJ/view?usp=sharing)

* 🌐 Url del proyecto desplegado [https://ahirwzro79.execute-api.us-east-1.amazonaws.com/swagger](https://ahirwzro79.execute-api.us-east-1.amazonaws.com/swagger)

### B. Arquitectura usada en el proyecto
Acontinuación se detalla la arquitectura usada.

* **Arquitectura Hexagonal (Ports & Adapters):** El núcleo del negocio (dominio) está aislado de las tecnologías externas (AWS, Bases de Datos). 

* **Domain-Driven Design (DDD)** Se utilizan conceptos de entidades y repositorios para organizar la lógica de negocio de manera clara y orientada al dominio.


# C.⚡ Poner en Marcha el proyecto

## 🛠️ Requisitos Previos

* Node.js v22.x o superior.
* Cuenta de AWS configurada localmente y tener los (`permisos`) que se indican en el archivo serverles.yml - iam .
* Serverless Framework instalado (`npm install -g serverless`).

## Para poder continuar es necesario crear la instancia RDS(MYSQL)
Para este proyecto, utilizamos una única instancia de **Amazon RDS** que aloja dos bases de datos.
Crear una instancia RDS(MYSQL) y conectarse a dicha instancia y crear los bases de datos, como se indica a continuación.

### 1. Crear base de Datos Perú (`medical_db_peru`) y la tabla (`appointments_pe`)

```sql
CREATE DATABASE IF NOT EXISTS medical_db_peru;
USE medical_db_peru;

CREATE TABLE appointments_pe (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id VARCHAR(36) NOT NULL UNIQUE,
    insured_id VARCHAR(5) NOT NULL,
    schedule_id INT NOT NULL,
    country_iso VARCHAR(2) NOT NULL DEFAULT 'PE',
    status VARCHAR(20) NOT NULL DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. Crear base de Datos Chile (`medical_db_chile`) y la tabla (`appointments_cl`)

```sql
CREATE DATABASE IF NOT EXISTS medical_db_chile;
USE medical_db_chile;

CREATE TABLE appointments_cl (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id VARCHAR(36) NOT NULL UNIQUE,
    insured_id VARCHAR(5) NOT NULL,
    schedule_id INT NOT NULL,
    country_iso VARCHAR(2) NOT NULL DEFAULT 'CL',
    status VARCHAR(20) NOT NULL DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```


## D. 🚀 Instalación y Despliegue

1. **Clonar el proyecto:**
   ```bash
   git clone https...
   ```
   ```bash
   cd prueba_tecnica_serverless
   ```
2. **Instalar dependencias:**
   ```bash
    npm install
   ```
3. **Configurar variables de entorno: Renombra el archivo (`.env.template`) a (`.env`) y configura las credenciales que se requieren**

4. **Ejecutar las pruebas:**
    ```sh
    npm run test:watch
    ```
    ```sh
    npm run test:coverage
    ```

5. **Construir la app(dist):**
    ```sh
    npm run build
    ```
6. **Desplegar a la nube**
    ```ssh
    npx serverless deploy
    ```

## 📖 Documentación de la API (Swagger)

El proyecto incluye integración nativa con **Swagger**. Tras el despliegue, puedes acceder a la interfaz interactiva con la url, aqui la url del proyecto desplegado.
[Url de despliegue del proyecto](https://ahirwzro79.execute-api.us-east-1.amazonaws.com/swagger)


* **POST /appointment**: Registra una solicitud de cita.
* **GET /appointment/{insuredId}**: Consulta el historial del asegurado.

  ## Cobertura de pruebas unitarias

<img width="1531" height="525" alt="image" src="https://github.com/user-attachments/assets/4b6a6335-f3fe-4112-be49-f29f8918f997" />

### Resumen de Cobertura:
* Business Logic (Use Cases): 100% Statements
* Infrastructure (SNS/EventBridge, dynamaoDB): 77% Statements.
* Domain Entities: 100% Statements.

