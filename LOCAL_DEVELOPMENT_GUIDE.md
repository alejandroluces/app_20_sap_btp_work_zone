# 🛠️ Guía de Desarrollo Local - Apps SAP Fiori

## 🎯 Objetivo

Desarrollar y probar **app20** y **app21** localmente sin necesidad de desplegar constantemente a BTP, usando SAP Fiori Tools y Cloud Foundry CLI.

---

## 📋 Prerrequisitos

### ✅ Software Necesario

```bash
# 1. Node.js (v18 o superior)
node --version

# 2. SAP Fiori Tools (via npm)
npm install -g @sap/generator-fiori
npm install -g @ui5/cli

# 3. Cloud Foundry CLI
cf --version

# 4. MBT Build Tool
mbt --version
```

### 📦 Instalar Dependencias del Proyecto

```bash
# En el directorio raíz
npm install

# Para cada app
cd app20
npm install

cd ../app21
npm install

cd ../webina-mta-approuter
npm install
```

---

## 🚀 Opción 1: Desarrollo Local con SAP Fiori Tools

### Para App20 (Evaluación de Proveedores)

#### 1. Iniciar Preview Local

```bash
cd app20

# Opción A: Sin Fiori Launchpad
npm run start-noflp

# Opción B: Con Fiori Launchpad
npm start

# Opción C: Especificando puerto
npx fiori run --port 8080 --open "index.html"
```

#### 2. URLs de Acceso

```
Sin FLP:  http://localhost:8080/index.html
Con FLP:  http://localhost:8080/test/flp.html#app-preview
```

#### 3. Desarrollo con Hot Reload

El servidor de Fiori Tools incluye **live reload automático**:

- ✅ Cambios en `.ts` → Transpila automáticamente
- ✅ Cambios en `.xml` → Recarga la vista
- ✅ Cambios en `.properties` → Actualiza textos
- ✅ Cambios en `.css` → Aplica estilos

**No necesitas reiniciar el servidor** para ver cambios!

---

### Para App21 (Órdenes de Compra)

```bash
cd app21

# Sin FLP (recomendado para desarrollo)
npm run start-noflp

# Con FLP
npm start
```

---

## 🔧 Opción 2: Proxy Reverse Local (Simular BTP)

### Configurar Approuter Local

El `webina-mta-approuter` puede correr localmente para simular el routing de BTP.

#### 1. Crear archivo de configuración local

**Archivo**: `webina-mta-approuter/default-env.json`

```json
{
  "VCAP_SERVICES": {},
  "VCAP_APPLICATION": {
    "application_name": "webina-mta-approuter",
    "application_uris": ["localhost:5000"]
  },
  "destinations": [
    {
      "name": "app20",
      "url": "http://localhost:8080",
      "forwardAuthToken": false
    },
    {
      "name": "app21",
      "url": "http://localhost:8081",
      "forwardAuthToken": false
    }
  ]
}
```

#### 2. Iniciar Apps y Approuter

**Terminal 1 - App20:**
```bash
cd app20
npm run start-noflp -- --port 8080
```

**Terminal 2 - App21:**
```bash
cd app21
npm run start-noflp -- --port 8081
```

**Terminal 3 - Approuter:**
```bash
cd webina-mta-approuter
npm start
```

#### 3. Acceder via Approuter

```
Approuter:  http://localhost:5000
App20:      http://localhost:5000/app20
App21:      http://localhost:5000/app21
```

---

## 🧪 Opción 3: Testing con Cloud Foundry Tunnel

### Conectar a Servicios BTP sin Deploy

El **CF SSH tunnel** permite conectar tu app local a servicios reales de BTP (bases de datos, XSUAA, etc.).

#### 1. Login a Cloud Foundry

```bash
# Login
cf login -a https://api.cf.us10.hana.ondemand.com

# Seleccionar org y space
cf target -o <tu-org> -s <tu-space>
```

#### 2. Ver Apps Desplegadas

```bash
cf apps
```

#### 3. Crear Tunnel SSH

```bash
# Para conectar a un servicio específico
cf ssh webina-mta-app20 -L 8888:service-name.internal:443
```

#### 4. Usar Variables de Entorno Locales

**Archivo**: `app20/default-env.json`

```json
{
  "VCAP_SERVICES": {
    "xsuaa": [{
      "credentials": {
        "url": "http://localhost:8888",
        "clientid": "...",
        "clientsecret": "..."
      }
    }]
  }
}
```

---

## 📊 Opción 4: Mock Server para Datos

### Configurar Datos Mock Locales

#### 1. Crear carpeta de datos mock

```bash
mkdir -p app20/webapp/localService
mkdir -p app21/webapp/localService
```

#### 2. Crear mockdata

**Archivo**: `app20/webapp/localService/mockdata/Vendors.json`

```json
[
  {
    "vendorId": "V001",
    "vendorName": "Proveedor ABC S.A.",
    "rating": 4.5,
    "quality": 90,
    "delivery": 85,
    "price": 88,
    "service": 92
  },
  {
    "vendorId": "V002",
    "vendorName": "Distribuidora XYZ Ltda.",
    "rating": 4.2,
    "quality": 85,
    "delivery": 90,
    "price": 85,
    "service": 88
  }
]
```

#### 3. Configurar ui5.yaml para usar mock

**Archivo**: `app20/ui5-local.yaml`

```yaml
server:
  customMiddleware:
    - name: sap-fe-mockserver
      beforeMiddleware: csp
      configuration:
        mountPath: /
        services:
          - urlPath: /sap/opu/odata/sap/API_BUSINESS_PARTNER
            metadataPath: ./webapp/localService/metadata.xml
            mockdataPath: ./webapp/localService/mockdata
            generateMockData: true
```

---

## 🔍 Debugging Local

### 1. Chrome DevTools

```bash
# Iniciar con debugging
npm start

# Abrir Chrome DevTools
# F12 → Sources → webpack://
```

### 2. VS Code Debugger

**Archivo**: `.vscode/launch.json`

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Debug App20",
      "url": "http://localhost:8080/index.html",
      "webRoot": "${workspaceFolder}/app20/webapp",
      "sourceMaps": true
    },
    {
      "type": "chrome",
      "request": "launch",
      "name": "Debug App21",
      "url": "http://localhost:8081/index.html",
      "webRoot": "${workspaceFolder}/app21/webapp",
      "sourceMaps": true
    }
  ]
}
```

### 3. Usar Breakpoints en TypeScript

```typescript
// En cualquier controlador
public onInit(): void {
    debugger; // El navegador se detendrá aquí
    console.log("Debugging app");
}
```

---

## 🚀 Workflow de Desarrollo Recomendado

### 📝 Proceso Diario

```bash
# 1. Iniciar app en desarrollo
cd app20  # o app21
npm run start-noflp

# 2. Hacer cambios en el código
# - Los cambios se reflejan automáticamente
# - No necesitas reiniciar el servidor

# 3. Testing en navegador
# - Abrir http://localhost:8080
# - Usar Chrome DevTools para debugging

# 4. Cuando estés satisfecho con los cambios
git add .
git commit -m "Feature: descripción del cambio"
git push

# 5. Deploy solo cuando necesites probar en BTP
mbt build
cf deploy mta_archives/webina-mta_0.0.1.mtar
```

### 🔄 Hot Reload Activado Para:

| Tipo de Archivo | Hot Reload | Acción |
|----------------|------------|--------|
| `*.ts` | ✅ Automático | Transpila y recarga |
| `*.xml` | ✅ Automático | Recarga vista |
| `*.properties` | ✅ Automático | Actualiza textos |
| `*.css` | ✅ Automático | Aplica estilos |
| `manifest.json` | ⚠️ Manual | Reiniciar servidor |
| `package.json` | ⚠️ Manual | `npm install` + reiniciar |

---

## 🎯 Comandos Útiles por App

### App20 (Evaluación de Proveedores)

```bash
# Desarrollo
cd app20
npm run start-noflp          # Sin FLP
npm start                    # Con FLP
npm run start-local          # Config local específica

# Testing
npm run lint                 # Verificar código
npm run ts-typecheck         # Verificar TypeScript
npm test                     # Ejecutar tests

# Build
npm run build                # Build local
npm run build:cf             # Build para CF
```

### App21 (Órdenes de Compra)

```bash
# Desarrollo (mismos comandos que app20)
cd app21
npm run start-noflp
npm start
npm run start-local

# Testing
npm run lint
npm run ts-typecheck
npm test

# Build
npm run build
npm run build:cf
```

---

## 📦 Testing Multi-App Local

### Probar ambas apps simultáneamente

**Script**: `test-local.sh` (crear en raíz)

```bash
#!/bin/bash

echo "🚀 Iniciando Apps Localmente..."

# Terminal 1 - App20
gnome-terminal -- bash -c "cd app20 && npm run start-noflp -- --port 8080; exec bash"

# Terminal 2 - App21
gnome-terminal -- bash -c "cd app21 && npm run start-noflp -- --port 8081; exec bash"

# Terminal 3 - Approuter
gnome-terminal -- bash -c "cd webina-mta-approuter && npm start; exec bash"

echo "✅ Apps corriendo:"
echo "   App20:     http://localhost:8080"
echo "   App21:     http://localhost:8081"
echo "   Approuter: http://localhost:5000"
```

**Uso**:
```bash
chmod +x test-local.sh
./test-local.sh
```

---

## 🔒 Simular Autenticación XSUAA Local

### Opción 1: Usar Mock User

**Archivo**: `app20/webapp/test/flp.html`

```javascript
// Agregar mock de usuario
window["sap-ushell-config"] = {
  defaultRenderer: "fiori2",
  applications: {
    "app20-preview": {
      additionalInformation: "SAPUI5.Component=sap.btp.app20",
      applicationType: "URL",
      url: "../",
      title: "Evaluación de Proveedores"
    }
  },
  services: {
    Container: {
      adapter: {
        config: {
          id: "test-user",
          firstName: "Test",
          lastName: "User",
          email: "test@example.com"
        }
      }
    }
  }
};
```

### Opción 2: Bypass Auth en Desarrollo

**Archivo**: `xs-app.json` (versión local)

```json
{
  "authenticationMethod": "none",
  "routes": [
    {
      "source": "^(.*)$",
      "target": "$1",
      "authenticationType": "none"
    }
  ]
}
```

---

## 🐛 Troubleshooting Local

### Problema: Puerto ya en uso

```bash
# Encontrar proceso
lsof -i :8080

# Matar proceso
kill -9 <PID>

# O usar otro puerto
npm run start-noflp -- --port 8090
```

### Problema: Cambios no se reflejan

```bash
# Limpiar cache
cd app20
rm -rf dist node_modules
npm install
npm run start-noflp
```

### Problema: Error de TypeScript

```bash
# Verificar errores
npm run ts-typecheck

# Ver detalles
npx tsc --noEmit
```

### Problema: CORS en desarrollo

Agregar a `ui5-local.yaml`:

```yaml
server:
  customMiddleware:
    - name: fiori-tools-proxy
      configuration:
        ignoreCertErrors: true
        backend:
          - path: /sap
            url: https://tu-backend.com
            client: "100"
```

---

## 📊 Monitoreo de Performance Local

### 1. UI5 Inspector

```bash
# Instalar extensión de Chrome
# "UI5 Inspector" from Chrome Web Store

# Usar en:
http://localhost:8080
```

### 2. Network Analysis

```javascript
// En manifest.json, activar debug
{
  "sap.ui5": {
    "routing": {
      "config": {
        "async": true,
        "bypassHomeHash": true
      }
    }
  }
}
```

### 3. Console Logging

```typescript
// En cualquier controlador
console.time("loadData");
// ... tu código
console.timeEnd("loadData");
```

---

## ✅ Checklist de Desarrollo Local

Antes de hacer deploy a BTP:

- [ ] `npm run lint` sin errores
- [ ] `npm run ts-typecheck` sin errores
- [ ] `npm test` todos los tests pasan
- [ ] Testing manual en http://localhost:8080
- [ ] Verificar en Chrome DevTools sin errores de consola
- [ ] Testing responsive (mobile/tablet/desktop)
- [ ] Verificar i18n (textos correctos)
- [ ] Build local exitoso: `npm run build`
- [ ] Commit y push a Git
- [ ] Solo entonces: `mbt build && cf deploy`

---

## 🎓 Best Practices

### 1. Usar Variables de Entorno

```javascript
// En Component.ts
const isDevelopment = window.location.hostname === "localhost";

if (isDevelopment) {
    console.log("Running in DEVELOPMENT mode");
    // Usar datos mock
} else {
    console.log("Running in PRODUCTION mode");
    // Usar servicios reales
}
```

### 2. Separar Configuraciones

```
app20/
├── ui5.yaml              # Producción
├── ui5-local.yaml        # Desarrollo local
├── ui5-deploy.yaml       # Deploy a CF
└── xs-app.json           # Routing
```

### 3. Git Ignore para Desarrollo Local

```gitignore
# .gitignore
default-env.json
*.local.yaml
.env
node_modules/
dist/
mta_archives/
```

---

## 🚀 Deploy Solo Cuando Sea Necesario

```bash
# Desarrollo: 99% del tiempo
npm run start-noflp

# Deploy: Solo para testing en BTP o producción
mbt build
cf deploy mta_archives/webina-mta_0.0.1.mtar

# Frecuencia recomendada de deploy:
# - Desarrollo activo: 1-2 veces por día
# - Testing: 1 vez por semana
# - Producción: Solo releases oficiales
```

---

## 📚 Recursos Adicionales

- [SAP Fiori Tools Documentation](https://help.sap.com/docs/SAP_FIORI_tools)
- [UI5 Tooling](https://sap.github.io/ui5-tooling/)
- [Cloud Foundry CLI](https://docs.cloudfoundry.org/cf-cli/)
- [UI5 Inspector Chrome Extension](https://chrome.google.com/webstore/detail/ui5-inspector)

---

**✅ Con esta guía puedes desarrollar completamente en local y solo desplegar a BTP cuando sea realmente necesario!**

---

_Última actualización: Febrero 25, 2026_  
_Modo recomendado: Desarrollo local con SAP Fiori Tools + Deploy ocasional a BTP_
