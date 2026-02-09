/*
  La documentación se hizo como la que se muestra a continuación, 
  sin embargo tambien hay otras opciones con plugins 
  e inferir de los handlers los datos
*/

import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResult> => {

  const requestPath = event.rawPath || "";

  if (requestPath === '/swagger.json' || requestPath === '/swagger.yaml') {
    try {
      const openapiPath = path.join(__dirname, '../../../../../docs/openapi/openapi.yml');
      const openapiContent = fs.readFileSync(openapiPath, 'utf8');


      if (!fs.existsSync(openapiPath)) {
        const errorMsg = `Archivo no encontrado en la ruta calculada: ${openapiPath}`;
        console.error(errorMsg);
        throw new Error(errorMsg);
      }

      if (requestPath === '/swagger.json') {
        const openapiJson = yaml.load(openapiContent);
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify(openapiJson, null, 2)
        };
      }

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/x-yaml',
          'Access-Control-Allow-Origin': '*'
        },
        body: openapiContent
      };

    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error loading OpenAPI spec' })
      };
    }
  }

  const apiUrl = `https://${event.requestContext.domainName}`;


  const swaggerUIHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Medical Appointment API - Swagger UI</title>
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
  <style>
    html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
    *, *:before, *:after { box-sizing: inherit; }
    body { margin:0; padding:0; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: "${apiUrl}/swagger.json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      });
      window.ui = ui;
    };
  </script>
</body>
</html>
  `;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
      'Access-Control-Allow-Origin': '*'
    },
    body: swaggerUIHtml
  };
};