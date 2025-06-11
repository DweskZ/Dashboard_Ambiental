## Dashboard Backend

### Requisitos
- Node.js 18+
- PostgreSQL (corriendo en Docker)

### Instalación

```bash
npm install
cp .env.example .env


En weatherController.ts, cambia esto:

const apiKey = "tu_api_key_aqui";  Por la api que te da Openweather

Ejecutar el backend npm run dev

### Despliegue en Azure

El repositorio incluye un `Dockerfile` y un workflow de GitHub Actions
(`.github/workflows/azure.yml`) que construye una imagen de Docker y la despliega
en un **Azure Web App**. Para utilizarlo debes configurar los siguientes
secretos en tu repositorio:

- `ACR_NAME`, `ACR_USERNAME` y `ACR_PASSWORD`: credenciales de tu Azure
  Container Registry.
- `AZURE_WEBAPP_NAME`: nombre de la aplicación Web App que recibirá la imagen.

Al hacer push a la rama `main`, la acción construirá la imagen y la publicará en
el registro configurado, para luego actualizar la Web App.

