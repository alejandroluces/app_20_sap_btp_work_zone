# 🔧 Solución: Error de Preview en BTP Application Modeler

## ❌ Error Encontrado

```
An error occurred when starting the preview. Details:
Cannot read properties of undefined (reading 'customMiddleware')
Source: SAP Fiori Tools - Application Modeler
```

## ✅ Solución Aplicada

### Problema
El archivo `ui5-local.yaml` de app21 estaba incompleto y no contenía la configuración necesaria de `server.customMiddleware`, lo cual es requerido por el Application Modeler de SAP BTP.

### Archivos Corregidos

#### 1. `app21/ui5-local.yaml` ✅
Se agregó la configuración completa del servidor:

```yaml
specVersion: '4.0'
metadata:
  name: sap.btp.app21
type: application
server:
  customMiddleware:
    - name: fiori-tools-proxy
      afterMiddleware: compression
      configuration:
        ignoreCertErrors: false
        ui5:
          path:
            - /resources
            - /test-resources
          url: https://ui5.sap.com
    - name: fiori-tools-appreload
      afterMiddleware: compression
      configuration:
        port: 35729
        path: webapp
        delay: 300
    - name: fiori-tools-preview
      afterMiddleware: fiori-tools-appreload
      configuration:
        flp:
          theme: sap_horizon
    - name: ui5-tooling-transpile-middleware
      afterMiddleware: compression
      configuration:
        debug: true
        transformModulesToUI5:
          overridesToOverride: true
        excludePatterns:
          - /Component-preload.js
builder:
  customTasks:
    - name: ui5-tooling-transpile-task
      afterTask: replaceVersion
      configuration:
        debug: true
        transformModulesToUI5:
          overridesToOverride: true
```

#### 2. `app21/xs-app.json` ✅ (Creado)
Se creó el archivo de configuración del approuter para app21:

```json
{
  "welcomeFile": "/index.html",
  "authenticationMethod": "route",
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
  ]
}
```

---

## 🚀 Cómo Probar el Preview

### Opción 1: Desde BTP Application Modeler (Recomendado)

1. En SAP Business Application Studio
2. Click derecho en `app21` o `app21/webapp`
3. Selecciona **"Preview Application"**
4. El preview debería cargar sin errores

### Opción 2: Desde Terminal

```bash
# Navegar a app21
cd app21

# Iniciar preview
npm start

# O con configuración local
npm run start-local
```

### Opción 3: Con Fiori Tools

```bash
cd app21
fiori run --open "test/flp.html#app-preview"
```

---

## 🔍 Verificaciones Post-Corrección

### ✅ Checklist
- [x] `ui5-local.yaml` tiene configuración completa de `server`
- [x] `xs-app.json` existe en app21
- [x] `package.json` tiene scripts de start
- [x] `manifest.json` tiene crossNavigation configurado
- [x] Estructura webapp está completa

### 📂 Archivos Necesarios para Preview
```
app21/
├── ui5.yaml              ✅ Build en producción
├── ui5-local.yaml        ✅ Preview local (CORREGIDO)
├── ui5-deploy.yaml       ✅ Deploy a CF
├── xs-app.json          ✅ Routing (NUEVO)
├── package.json         ✅ Dependencias
├── manifest.json        ✅ Configuración app
└── webapp/
    ├── index.html       ✅ Entry point
    ├── Component.ts     ✅ Componente principal
    ├── view/            ✅ Vistas XML
    ├── controller/      ✅ Controladores
    ├── model/           ✅ Modelos
    └── i18n/            ✅ Textos
```

---

## 🐛 Otros Errores Comunes de Preview

### Error: "Module not found"
```bash
# Solución: Instalar dependencias
cd app21
npm install
```

### Error: "Port already in use"
```bash
# Solución: Cambiar puerto en ui5-local.yaml
# O matar el proceso en ese puerto
npx kill-port 35729
```

### Error: "Cannot find UI5 resources"
```bash
# Solución: Verificar conexión a https://ui5.sap.com
# O usar CDN alternativo en ui5.yaml
```

### Error: "TypeScript compilation failed"
```bash
# Solución: Verificar tsconfig.json
npm run ts-typecheck
```

---

## 📝 Diferencias entre Archivos UI5

### `ui5.yaml` (Producción)
- Usado para `npm run build`
- Usado para despliegue a CF
- Incluye todas las configuraciones

### `ui5-local.yaml` (Desarrollo Local)
- Usado para `npm start` y preview
- Debe tener configuración de `server`
- **ERA EL QUE ESTABA INCOMPLETO** ⚠️

### `ui5-deploy.yaml` (Deploy)
- Usado específicamente para `npm run build:cf`
- Incluye configuración de zipper
- Configuración de transpile

---

## 🎯 Comandos Útiles para Debugging

```bash
# Ver configuración UI5 actual
cd app21
npx ui5 serve --config ui5-local.yaml --verbose

# Verificar manifest
cat webapp/manifest.json | grep -A 10 crossNavigation

# Verificar routing
cat xs-app.json

# Test TypeScript
npm run ts-typecheck

# Limpiar y reinstalar
rm -rf node_modules dist
npm install
```

---

## ✅ Estado Final

| Archivo | Estado | Notas |
|---------|--------|-------|
| `ui5-local.yaml` | ✅ CORREGIDO | Ahora tiene `customMiddleware` completo |
| `xs-app.json` | ✅ CREADO | Necesario para routing en BTP |
| `ui5.yaml` | ✅ OK | Ya estaba correcto |
| `ui5-deploy.yaml` | ✅ OK | Ya estaba correcto |
| `package.json` | ✅ OK | Scripts configurados |
| `manifest.json` | ✅ OK | CrossNavigation correcto |

---

## 🚀 Próximos Pasos

1. **Intentar preview nuevamente** en BTP Application Modeler
2. Si funciona: Continuar con desarrollo
3. Si persiste error: Revisar logs en terminal
4. **Build y Deploy** cuando esté listo:
   ```bash
   mbt build
   cf deploy mta_archives/webina-mta_0.0.1.mtar
   ```

---

## 📚 Referencias

- [UI5 Tooling Configuration](https://sap.github.io/ui5-tooling/pages/Configuration/)
- [Fiori Tools](https://help.sap.com/docs/SAP_FIORI_tools)
- [BAS Preview Issues](https://help.sap.com/docs/SAP%20Business%20Application%20Studio/9d1db9835307451daa8c930fbd9ab264/troubleshooting.html)

---

**✅ El problema del preview debería estar resuelto ahora.**

Intenta hacer preview nuevamente desde BTP Application Modeler.

---

_Última actualización: Febrero 25, 2026_  
_Problema resuelto: Error de customMiddleware en ui5-local.yaml_
