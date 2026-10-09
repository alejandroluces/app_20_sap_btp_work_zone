# App_Cv_Aluces

Aplicación SAPUI5 del currículum de Alejandro Luces González, basada en el CV de septiembre de 2026. Incluye perfil, cinco experiencias profesionales, proyectos, formación, contacto, búsqueda y versión imprimible.

La interfaz sigue el patrón SAP Fiori Object Page con `sap.uxap.ObjectPageLayout`: cabecera de perfil, campos informativos, acciones y barra de navegación por secciones. Utiliza el tema Horizon y sus colores, tipografía y controles estándar.

La sección Cursos y credenciales incorpora las diez entradas consultadas en LinkedIn, con institución, fechas, identificador y enlace directo. Las fechas de vencimiento se reproducen tal como figuran en el perfil; no se ha validado la vigencia con los emisores. Femxa no muestra fechas. La entrada de ABAP figura con institución Udemy y enlaza a Logali; se conserva esa información de origen. Los cursos existentes de CVOSOFT permanecen en Formación.

Es un proyecto independiente dentro de este repositorio. Tiene su propio `mta.yaml` y no modifica el despliegue de `app20` ni necesita ABAP, Destinations, XSUAA o HANA. Las bibliotecas SAPUI5 se cargan desde el CDN oficial y requieren acceso a Internet.

## Ejecutar en SAP Business Application Studio

Se necesita Node.js 22 o 24. Comprueba `node -v` antes de instalar. El SAP Application Router 23.3.0 no admite Node 20. Selecciona una versión compatible mediante el gestor de versiones disponible en tu Dev Space.

Desde la raíz del repositorio:

```bash
cd App_Cv_Aluces
npm ci
npm start
```

En BAS, abre el puerto **8080** cuando aparezca la notificación. Si no aparece, usa el comando **Ports: Preview** de la paleta y selecciona ese puerto. En tu equipo local: `http://localhost:8080`.

No ejecutes `npx fiori run` para esta app: la previsualización utiliza directamente SAP Application Router. Puedes modificar el contenido y recargar el navegador. Los recursos propios se revalidan para mostrar las actualizaciones del CV.

## Desplegar en BTP Trial con Cloud Foundry

La aplicación está configurada para acceso público, sin inicio de sesión. La página incluye nombre, ciudad, experiencia y correo profesional. La descarga ofrece el PDF original proporcionado por el titular, con todo su contenido, sin modificaciones.

Prerrequisitos: entorno Cloud Foundry habilitado, organización y espacio con cuota suficiente (256 MB de memoria para esta app), CF CLI y una sesión iniciada en la región correcta. Elige **una** de las dos rutas de despliegue.

### Opción A: CF CLI

Desde `App_Cv_Aluces`:

```bash
cf login -a <API_ENDPOINT_DE_TU_ENTORNO_CLOUD_FOUNDRY>
cf target
npm ci
npm test
npm run build
cf push
cf app app-cv-aluces
```

Sustituye el marcador de API por el endpoint que muestra BTP Cockpit. `cf target` permite comprobar la organización y el espacio antes del despliegue. El `manifest.yml` sube únicamente `dist/` y crea una ruta aleatoria para evitar colisiones de nombre. La URL aparece en `cf app app-cv-aluces`; añade `https://` a la ruta mostrada para abrirla.

### Opción B: MTA desde BAS

Necesita Cloud MTA Build Tool (`mbt`), `make` y el plugin MultiApps de CF (`cf deploy`). Comprueba `mbt --version` y `cf plugins`. BAS suele proporcionar las herramientas de desarrollo BTP; verifica su disponibilidad en tu Dev Space.

```bash
npm ci
npm test
npm run build:mta
cf deploy mta_archives/app-cv-aluces.mtar
cf app app-cv-aluces
```

Ejecuta estos comandos en **App_Cv_Aluces**, no sobre el `mta.yaml` de la raíz del repositorio. Este MTA solo despliega el CV. No se ha realizado ningún despliegue automáticamente.

Para un error de arranque: `cf logs app-cv-aluces --recent`. Para falta de memoria/cuota: revisa el espacio y las otras apps antes de desplegar. La disponibilidad depende de que el entorno Trial y la aplicación estén activos.

## Agregar a SAP Build Work Zone

Después de obtener la URL, puedes agregarla como aplicación de tipo **URL** en el contenido local de Work Zone, asignarla al rol correspondiente y colocarla en una página/espacio de tu sitio. Elige abrir en una pestaña nueva para evitar restricciones de integración en iframe. Esta ruta no registra automáticamente el CV en HTML5 Application Repository.

El descriptor SAPUI5 contiene además el intent `AlejandroLucesCV-display` para una futura integración por componente. La publicación inicial utiliza la URL de Cloud Foundry.

## Editar el CV

- `webapp/model/cv.json`: nombre, textos, correo, experiencia, proyectos y formación. Las fechas y los cursos reflejan el documento de septiembre de 2026; actualiza “Actualidad” si cambia tu situación.
- `webapp/view/Main.view.xml`: distribución de las secciones.
- `webapp/css/style.css`: colores, adaptación móvil e impresión.
- `webapp/controller/Main.controller.js`: navegación, búsqueda, correo e impresión.

**Imprimir** abre el diálogo del navegador con todas las experiencias y detalles, incluso cuando hay una búsqueda activa. Al cerrar el diálogo, se restaura el filtro y las secciones abiertas.

**Descargar CV en PDF** descarga el documento original `CV A.LUCES CL 09.2026.pdf`, almacenado en `webapp/documents/CV-Alejandro-Luces.pdf`. No genera un PDF de la página. Para actualizar la descarga, sustituye ese archivo y vuelve a compilar y desplegar.

Los enlaces de credenciales son los indicados en el CV; su disponibilidad externa no está garantizada. Los proyectos se describen sin enlaces a repositorios porque el documento no los aporta.

## Comprobaciones

```bash
npm test
npm run build
```

La compilación copia únicamente los archivos de ejecución a `dist/`. `npm start` usa los fuentes; para probar el resultado compilado, entra en `dist`, ejecuta `npm ci --omit=dev` y `npm start` con el servidor anterior detenido.

Referencias: [SAP Application Router](https://www.npmjs.com/package/@sap/approuter), [Cloud MTA Build Tool](https://github.com/SAP/cloud-mta-build-tool/blob/master/docs/docs/configuration.md), [Aplicaciones URL en SAP Build Work Zone](https://help.sap.com/docs/build-work-zone-standard-edition/sap-build-work-zone-standard-edition/url-and-dynamic-url-apps?locale=en-US).
