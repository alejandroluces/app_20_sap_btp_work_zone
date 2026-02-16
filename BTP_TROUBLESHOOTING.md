# 🔧 Troubleshooting: AppRouter Crashed en SAP BTP

## 🚨 Problema Actual

**Error:** AppRouter con status "Crashed" (rojo) en BTP Cockpit
```
404 Not Found: Requested route ('b3e51a00trial-dev-webina-mta-approuter.cfapps.us10-001.hana.ondemand.com') does not exist.
```

## 🎯 Causa Raíz

El archivo `xs-app.json` tenía configuración con `"localDir"` que causaba que el approuter buscara aplicaciones localmente en lugar del HTML5 Apps Repository.

### Configuración Incorrecta que Causaba el Crash:

```json
{
  "routes": [
    {
      "source": "^/sapbtpapp20/(.*)$",
      "target": "$1",
      "localDir": "resources/sapbtpapp20",  // ❌ INCORRECTO - No existe localmente
      "authenticationType": "xsuaa"
    }
  ]
}
```

**Problema:** El approuter intentaba buscar `resources/sapbtpapp20` en su sistema de archivos local, pero las aplicaciones HTML5 están en el **HTML5 Apps Repository**, no en el approuter.

## ✅ Solución Correcta

### xs-app.json Corregido:

```json
{
  "welcomeFile": "/cp.portal",
  "authenticationMethod": "route",
  "sessionTimeout": 60,
  "routes": [
    {
      "source": "^/resources/(.*)$",
      "target": "/resources/$1",
      "authenticationType": "none",
      "destination": "ui5"
    },
    {
      "source": "^/test-resources/(.*)$",
      "target": "/test-resources/$1",
      "authenticationType": "none",
      "destination": "ui5"
    },
    {
      "source": "^(.*)$",
      "target": "$1",
      "service": "html5-apps-repo-rt",
      "authenticationType": "xsuaa"
    }
  ],
  "logout": {
    "logoutEndpoint": "/do/logout"
  }
}
```

### Explicación de la Configuración:

#### 1. Rutas UI5 (Sin Autenticación)
```json
{
  "source": "^/resources/(.*)$",
  "target": "/resources/$1",
  "authenticationType": "none",
  "destination": "ui5"
}
```
- **Propósito:** Servir librerías UI5 desde el CDN de SAP
- **Sin autenticación:** Recursos públicos
- **Destination:** Apunta a https://ui5.sap.com

#### 2. Ruta Catch-All para HTML5 Apps (Con Autenticación)
```json
{
  "source": "^(.*)$",
  "target": "$1",
  "service": "html5-apps-repo-rt",
  "authenticationType": "xsuaa"
}
```
- **Propósito:** Servir TODAS las aplicaciones HTML5 del repository
- **service:** `html5-apps-repo-rt` = HTML5 Apps Repository Runtime
- **Con autenticación:** Requiere login XSUAA
- **Dinámico:** Automáticamente sirve `sapbtpapp20`, `sapbtpapp21`, etc.

## 🔄 Pasos para Re-desplegar

### Método 1: Re-desplegar Solo el AppRouter (Más Rápido)

```bash
# 1. Navegar al directorio del approuter
cd webina-mta-approuter

# 2. Re-desplegar
cf push webina-mta-approuter

# 3. Verificar el estado
cf app webina-mta-approuter
```

**Tiempo estimado:** 2-3 minutos

### Método 2: Re-desplegar Todo el MTA (Más Seguro)

```bash
# 1. Limpiar builds anteriores (opcional)
rm -rf mta_archives

# 2. Construir el MTA
mbt build

# 3. Desplegar
cf deploy mta_archives/webina-mta_0.0.1.mtar
```

**Tiempo estimado:** 5-10 minutos

### Método 3: Desde SAP Business Application Studio

1. Abrir terminal en BAS
2. Ejecutar:
```bash
cd webina-mta-approuter
cf push webina-mta-approuter
```
3. Esperar a que termine el despliegue
4. Verificar en BTP Cockpit que el status sea "Started" (verde)

## 🔍 Verificación Post-Despliegue

### 1. Verificar Status de la Aplicación

```bash
cf apps
```

**Resultado esperado:**
```
name                     requested state   instances   memory   disk
webina-mta-approuter     started           1/1         256M     256M
```

Status debe ser **"started"** y color **verde** en BTP Cockpit.

### 2. Verificar Logs del AppRouter

```bash
cf logs webina-mta-approuter --recent
```

**Buscar estas líneas (indican éxito):**
```
Approuter started on port XXXX
Successfully loaded XSUAA configuration
HTML5 Application Repository service bound
```

**Errores a evitar:**
```
❌ Error: Cannot find module 'resources/sapbtpapp20'
❌ ENOENT: no such file or directory
❌ Service binding not found
```

### 3. Verificar Bindings de Servicios

```bash
cf env webina-mta-approuter
```

**Debe mostrar estos servicios bound:**
- ✅ `webina-mta-xsuaa-service` (XSUAA)
- ✅ `webina-mta_html_repo_runtime` (HTML5 Apps Repository)
- ✅ `webina-mta-destination-service` (Destinations)

### 4. Probar la URL Directamente

```bash
curl -I https://b3e51a00trial-dev-webina-mta-approuter.cfapps.us10-001.hana.ondemand.com
```

**Resultado esperado:**
```
HTTP/1.1 302 Found
Location: https://...authentication...
```

El código **302** indica que está redirigiendo al login (correcto).
El código **404** indica que la app no existe (error).

### 5. Probar con un Navegador

Acceder a:
```
https://b3e51a00trial-dev-webina-mta-approuter.cfapps.us10-001.hana.ondemand.com
```

**Flujo esperado:**
1. ✅ Redirige al login de SAP (XSUAA)
2. ✅ Después del login, muestra Work Zone o la app
3. ✅ No muestra errores 404 o 500

## 🎯 URLs de Acceso

### Desde Work Zone (Recomendado)
```
https://b3e51a00trial.launchpad.cfapps.us10-001.hana.ondemand.com/site
```

### Directamente al AppRouter
```
https://b3e51a00trial-dev-webina-mta-approuter.cfapps.us10-001.hana.ondemand.com
```

### Aplicación Específica (Evaluación Proveedores)
```
https://b3e51a00trial-dev-webina-mta-approuter.cfapps.us10-001.hana.ondemand.com/sapbtpapp20
```

## ⚠️ Errores Comunes y Soluciones

### Error 1: AppRouter sigue "Crashed" después de re-desplegar

**Diagnóstico:**
```bash
cf logs webina-mta-approuter --recent
```

**Soluciones posibles:**

#### A. Servicios no bound correctamente
```bash
# Verificar bindings
cf services

# Re-bind XSUAA
cf bind-service webina-mta-approuter webina-mta-xsuaa-service

# Re-bind HTML5 Repo
cf bind-service webina-mta-approuter webina-mta_html_repo_runtime

# Re-bind Destinations
cf bind-service webina-mta-approuter webina-mta-destination-service

# Restage
cf restage webina-mta-approuter
```

#### B. Aplicación HTML5 no desplegada en el repository
```bash
# Verificar apps en HTML5 repository
cf html5-list -d webina-mta_html_repo_host -u

# Si no aparece sapbtpapp20, re-desplegar el deployer
cf push webina-mta_ui_deployer
```

#### C. Memoria insuficiente
```bash
# Aumentar memoria del approuter
cf scale webina-mta-approuter -m 512M
cf restart webina-mta-approuter
```

### Error 2: "Application not found" en HTML5 Repository

**Solución:**
```bash
# Re-desplegar el UI deployer
cd app20
npm run build:cf

cd ..
cf push webina-mta_ui_deployer
```

### Error 3: Redirect URI mismatch en XSUAA

**Solución:**

1. Actualizar `xs-security.json` con las URLs correctas:
```json
{
  "xsappname": "webina-mta",
  "tenant-mode": "dedicated",
  "oauth2-configuration": {
    "redirect-uris": [
      "https://*.cfapps.us10-001.hana.ondemand.com/**",
      "https://*.hana.ondemand.com/**"
    ]
  }
}
```

2. Re-crear el servicio XSUAA:
```bash
cf unbind-service webina-mta-approuter webina-mta-xsuaa-service
cf delete-service webina-mta-xsuaa-service
cf create-service xsuaa application webina-mta-xsuaa-service -c xs-security.json
cf bind-service webina-mta-approuter webina-mta-xsuaa-service
cf restage webina-mta-approuter
```

## 📱 Integración con Work Zone

Una vez que el approuter esté funcionando (verde):

### 1. Agregar Contenido en Work Zone

```bash
# Content Manager → Content Explorer → HTML5 Apps
1. Buscar "sapbtpapp20"
2. Click en "+" para agregar a "My Content"
```

### 2. Crear Grupo

```bash
# My Content → Create → Group
Nombre: "Módulo Logístico"
Descripción: "Aplicaciones del módulo logístico SAP"
```

### 3. Asignar Apps al Grupo

```bash
# Editar el grupo creado
1. Click en "Edit"
2. Sección "Assignments"
3. Buscar "sapbtpapp20"
4. Click en "+"
5. Save
```

### 4. Crear o Actualizar Site

```bash
# Site Directory → Create Site o Edit existing
1. Agregar el grupo "Módulo Logístico"
2. Save
3. Abrir el site
```

## 📊 Arquitectura de Routing

```
Usuario
  ↓
Work Zone (Launchpad)
  ↓
AppRouter (webina-mta-approuter)
  ├── /resources/** → UI5 CDN (sin auth)
  ├── /test-resources/** → UI5 CDN (sin auth)
  └── /** → HTML5 Apps Repository (con XSUAA auth)
         ├── /sapbtpapp20 → App Evaluación Proveedores
         ├── /sapbtpapp21 → App 2 (futura)
         └── /sapbtpappXX → Apps adicionales
```

## 🎓 Conceptos Clave

### ¿Por qué NO usar "localDir"?

**Incorrecto (causa crash):**
```json
{
  "source": "^/sapbtpapp20/(.*)$",
  "localDir": "resources/sapbtpapp20"  // ❌
}
```

**Razones:**
1. Las aplicaciones HTML5 NO están en el approuter
2. Están en el **HTML5 Apps Repository** (servicio separado)
3. El approuter solo es un **proxy/router**
4. `localDir` solo se usa para recursos estáticos simples

### ¿Cómo funciona html5-apps-repo-rt?

```json
{
  "source": "^(.*)$",
  "service": "html5-apps-repo-rt"  // ✅
}
```

1. El approuter recibe una solicitud: `/sapbtpapp20/index.html`
2. Consulta al HTML5 Apps Repository service
3. El repository devuelve el contenido de la app
4. El approuter sirve el contenido al usuario

**Ventajas:**
- Escalabilidad (apps en servicio centralizado)
- Fácil actualización (solo redeploy el deployer)
- Múltiples apps sin modificar el approuter

## 🚀 Siguiente Paso: Agregar Más Aplicaciones

Cuando quieras agregar `app21`, `app22`, etc.:

1. **NO necesitas modificar** `xs-app.json` del approuter
2. La ruta catch-all `"^(.*)$"` ya las manejará
3. Solo necesitas:
   - Crear la nueva app
   - Agregarla al `mta.yaml`
   - Build y deploy

**Ejemplo:**
```yaml
# En mta.yaml
- name: sapbtpapp21-orders
  type: html5
  path: app21
```

El approuter automáticamente servirá:
- `/sapbtpapp20` → App Evaluación
- `/sapbtpapp21` → App Órdenes
- `/sapbtpappXX` → Cualquier app futura

## ✅ Checklist Final

Antes de considerar el problema resuelto:

- [ ] AppRouter status = "Started" (verde) en BTP Cockpit
- [ ] `cf logs webina-mta-approuter --recent` sin errores
- [ ] URL del approuter responde (aunque redirija a login)
- [ ] Puede hacer login con tu usuario SAP
- [ ] La app `sapbtpapp20` se carga correctamente
- [ ] Work Zone muestra la app en Content Explorer
- [ ] La app funciona end-to-end (puede responder la encuesta)

---

**Con esta configuración, el approuter debería arrancar correctamente.** 🚀

Si el problema persiste, por favor comparte:
1. Los logs del approuter: `cf logs webina-mta-approuter --recent`
2. El status completo: `cf app webina-mta-approuter`
3. Los servicios bound: `cf env webina-mta-approuter`
