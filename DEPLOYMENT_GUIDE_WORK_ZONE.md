# 🚀 Guía de Despliegue a SAP BTP Work Zone

## ✅ Estado del Proyecto

**LISTO PARA DESPLEGAR** ✓

Tu proyecto tiene **2 aplicaciones** configuradas correctamente:
- 📊 **App20**: Evaluación de Proveedores
- 🛒 **App21**: Órdenes de Compra (NUEVA)

---

## 📋 Checklist Pre-Despliegue

### ✅ Archivos Esenciales Verificados
- [x] `mta.yaml` - Configurado con app20 y app21
- [x] `xs-security.json` - Configuración de seguridad XSUAA
- [x] `app20/` - Aplicación existente funcionando
- [x] `app21/` - Nueva aplicación completa
- [x] `webina-mta-approuter/` - Approuter configurado
- [x] `package.json` - Dependencias del proyecto raíz

### ✅ Configuraciones Verificadas
- [x] CrossNavigation en manifest.json de ambas apps
- [x] Rutas en xs-app.json (app20 y app21)
- [x] Landing page con tiles para ambas apps
- [x] Build parameters en mta.yaml

---

## 🔧 Preparación del Entorno

### 1. Verificar Herramientas Instaladas

```bash
# Cloud Foundry CLI
cf --version

# MBT (Multi-Target Application Build Tool)
mbt --version

# Si no tienes MBT, instálalo:
npm install -g mbt
```

### 2. Login a SAP BTP

```bash
# Login a Cloud Foundry
cf login

# Introducir:
# - API Endpoint: https://api.cf.us10-001.hana.ondemand.com
# - Email: tu-email@dominio.com
# - Password: tu-password

# Verificar que estás en el org y space correctos
cf target
```

---

## 📦 Proceso de Build

### Opción 1: Build con MBT (RECOMENDADO)

```bash
# Desde la raíz del proyecto
mbt build

# Esto creará:
# - mta_archives/webina-mta_0.0.1.mtar
```

**Qué hace el build:**
1. ✅ Instala dependencias de app20 (`npm install`)
2. ✅ Instala dependencias de app21 (`npm install`)
3. ✅ Compila TypeScript a JavaScript
4. ✅ Ejecuta `npm run build:cf` en cada app
5. ✅ Crea archivos .zip de cada app
6. ✅ Empaqueta todo en un archivo .mtar

**Nota**: Las dependencias se instalan AUTOMÁTICAMENTE durante el build. No necesitas hacerlo manualmente.

### Opción 2: Build Manual (Alternativa)

```bash
# Build app20
cd app20
npm install
npm run build:cf
cd ..

# Build app21
cd app21
npm install
npm run build:cf
cd ..

# Build MTA
mbt build
```

---

## 🚀 Despliegue a Cloud Foundry

### Deploy Completo

```bash
# Desde la raíz del proyecto
cf deploy mta_archives/webina-mta_0.0.1.mtar

# O con más opciones:
cf deploy mta_archives/webina-mta_0.0.1.mtar -f
```

**El despliegue hará:**
1. ✅ Crear/actualizar servicios (XSUAA, HTML5 Repo, Destinations)
2. ✅ Desplegar approuter
3. ✅ Subir app20 al HTML5 Application Repository
4. ✅ Subir app21 al HTML5 Application Repository
5. ✅ Configurar rutas y bindings

**Duración estimada**: 5-10 minutos

### Verificar el Despliegue

```bash
# Ver todas las aplicaciones
cf apps

# Deberías ver:
# webina-mta-approuter  (running)

# Ver servicios
cf services

# Deberías ver:
# webina-mta-xsuaa-service
# webina-mta_html_repo_host
# webina-mta_html_repo_runtime
# webina-mta-destination-service

# Ver logs del approuter
cf logs webina-mta-approuter --recent

# Ver detalles de la app
cf app webina-mta-approuter
```

---

## 🌐 Acceder a las Aplicaciones

### URL del Approuter

```
https://[subdomain].cfapps.us10-001.hana.ondemand.com
```

Para obtener la URL exacta:

```bash
cf app webina-mta-approuter
# Busca la línea "routes:" o "urls:"
```

### URLs Directas de las Apps

```
# Landing Page
https://[subdomain].cfapps.us10-001.hana.ondemand.com/

# App20 - Evaluación de Proveedores
https://[subdomain].cfapps.us10-001.hana.ondemand.com/sapbtpapp20

# App21 - Órdenes de Compra
https://[subdomain].cfapps.us10-001.hana.ondemand.com/sapbtpapp21
```

---

## 📱 Configuración en SAP Work Zone

### Paso 1: Acceder a Work Zone

1. Ve a tu **SAP BTP Cockpit**
2. Navega a **Services > Instances and Subscriptions**
3. Busca **SAP Work Zone** o **SAP Build Work Zone, standard edition**
4. Haz clic en **Go to Application**

### Paso 2: Agregar Content Provider

1. En Work Zone, ve a **Channel Manager**
2. Haz clic en **Update Content** o **Refresh**
3. Las aplicaciones deberían aparecer automáticamente desde el HTML5 Application Repository

### Paso 3: Crear Site (si no existe)

1. Ve a **Site Directory**
2. Clic en **Create Site**
3. Nombre: "Módulo Logístico" o similar
4. Selecciona template

### Paso 4: Agregar Apps al Site

1. Ve a **Content Manager**
2. Selecciona **Content Explorer**
3. Selecciona **HTML5 Apps**
4. Deberías ver:
   - `sapbtpapp20` (Evaluación de Proveedores)
   - `sapbtpapp21` (Órdenes de Compra)
5. Marca ambas apps y haz clic en **Add to My Content**

### Paso 5: Crear Group (Opcional)

1. Ve a **Content Manager > My Content**
2. Clic en **Create > Group**
3. Nombre: "Módulo Logístico"
4. Agrega app20 y app21 al grupo
5. Asigna el grupo al Site

### Paso 6: Asignar Roles

1. Ve a **Content Manager > My Content**
2. Selecciona cada app
3. En la pestaña **Roles**, asigna los roles apropiados
4. Ejemplo: "Everyone" para testing

### Paso 7: Publicar el Site

1. Ve a **Site Directory**
2. Selecciona tu site
3. Clic en **Publish**
4. Espera a que se publique

---

## 🎨 Configuración de Tiles en Work Zone

### App20 - Evaluación de Proveedores

```json
{
  "title": "Evaluación de Proveedores",
  "subtitle": "Sistema de encuestas",
  "icon": "sap-icon://feedback",
  "info": "Evaluar proveedores del módulo logístico",
  "semanticObject": "hello20",
  "action": "ver"
}
```

### App21 - Órdenes de Compra

```json
{
  "title": "Órdenes de Compra",
  "subtitle": "Gestión de OC",
  "icon": "sap-icon://cart",
  "info": "Crear y gestionar órdenes de compra",
  "semanticObject": "PurchaseOrder",
  "action": "create"
}
```

---

## 🔄 Actualizar Aplicaciones

### Cuando hagas cambios en el código:

```bash
# 1. Build nuevamente
mbt build

# 2. Re-desplegar (con -f para forzar)
cf deploy mta_archives/webina-mta_0.0.1.mtar -f

# 3. En Work Zone, actualizar content
# Channel Manager > Update Content
```

### Deploy solo del approuter (más rápido)

```bash
cf push webina-mta-approuter
```

---

## 🐛 Troubleshooting

### Error: "Module build failed"

```bash
# Limpiar cache
rm -rf app20/dist app20/node_modules
rm -rf app21/dist app21/node_modules
rm -rf mta_archives

# Rebuild
mbt build
```

### Error: "Service already exists"

```bash
# Si el servicio ya existe
cf deploy mta_archives/webina-mta_0.0.1.mtar -f --strategy blue-green
```

### Apps no aparecen en Work Zone

1. Verifica que el HTML5 Application Repository esté creado:
   ```bash
   cf services | grep html5-apps-repo
   ```

2. Actualiza el content en Work Zone:
   - Channel Manager > Update Content

3. Verifica los manifests:
   ```bash
   # App20
   cat app20/webapp/manifest.json | grep crossNavigation

   # App21
   cat app21/webapp/manifest.json | grep crossNavigation
   ```

### Error de autenticación

```bash
# Revincula el servicio XSUAA
cf unbind-service webina-mta-approuter webina-mta-xsuaa-service
cf bind-service webina-mta-approuter webina-mta-xsuaa-service
cf restage webina-mta-approuter
```

### Ver logs detallados

```bash
# Approuter
cf logs webina-mta-approuter --recent

# Todos los logs del deploy
cf logs webina-mta-approuter
```

---

## 📊 Monitoreo Post-Despliegue

### Dashboard de Cloud Foundry

```bash
# Ver uso de recursos
cf app webina-mta-approuter

# Ver métricas
cf app webina-mta-approuter --guid
# Luego ve al cockpit con ese GUID
```

### Verificar HTML5 Apps

```bash
# API para verificar apps en el repo
# Desde el cockpit:
# HTML5 Applications > [tu-repo] > Ver aplicaciones
```

---

## ✅ Checklist Final de Verificación

Después del despliegue, verifica:

- [ ] Approuter está running: `cf apps`
- [ ] Servicios están bound: `cf services`
- [ ] Landing page carga: `https://[subdomain].cfapps.../`
- [ ] App20 funciona: `/sapbtpapp20`
- [ ] App21 funciona: `/sapbtpapp21`
- [ ] Autenticación XSUAA funciona
- [ ] Apps aparecen en Work Zone Content Manager
- [ ] Tiles se ven en Work Zone Site
- [ ] Navigation entre apps funciona

---

## 🎯 Resumen Rápido

```bash
# PASO 1: Login
cf login

# PASO 2: Build
mbt build

# PASO 3: Deploy
cf deploy mta_archives/webina-mta_0.0.1.mtar

# PASO 4: Obtener URL
cf app webina-mta-approuter

# PASO 5: Configurar en Work Zone
# - Channel Manager > Update Content
# - Content Manager > Add apps
# - Crear Group "Módulo Logístico"
# - Publicar Site

# ✅ LISTO!
```

---

## 📞 Comandos Útiles

```bash
# Ver todas las apps
cf apps

# Ver servicios
cf services

# Ver detalles del approuter
cf app webina-mta-approuter

# Ver logs
cf logs webina-mta-approuter --recent

# Restart approuter
cf restart webina-mta-approuter

# Scale approuter (si es necesario)
cf scale webina-mta-approuter -i 2 -m 512M

# Eliminar todo (para re-deploy limpio)
cf undeploy webina-mta --delete-services

# Ver eventos
cf events webina-mta-approuter
```

---

## 🎓 Notas Importantes

### ✅ Ventajas de tu Configuración MTA

1. **No necesitas instalar dependencias manualmente**: El comando `mbt build` lo hace automáticamente
2. **Deploy atómico**: Todo se despliega junto, reduciendo errores
3. **Rollback fácil**: Si algo falla, puedes volver a la versión anterior
4. **Servicios compartidos**: XSUAA, HTML5 Repo se comparten entre apps
5. **Zero-downtime**: Usa estrategia blue-green para actualizaciones sin tiempo de inactividad

### ⚠️ Consideraciones

- **Trial Account**: Tiene límites de memoria (2GB por org)
- **Build time**: Primera vez tarda más (10-15 min)
- **Cache**: Cloud Foundry cachea node_modules
- **TypeScript**: Se compila durante el build, no antes

### 🚀 Next Steps Recomendados

1. **Deploy a producción** ✓
2. **Configurar CI/CD** con GitHub Actions
3. **Agregar monitoring** con SAP Cloud ALM
4. **Crear app22** (Dashboard de Analíticas)
5. **Integrar con backend** OData/REST APIs

---

## 📚 Documentación de Referencia

- [MTA Documentation](https://help.sap.com/docs/BTP/65de2977205c403bbc107264b8eccf4b/d04fc0e2ad894545aebfd7126384307c.html)
- [Cloud Foundry CLI](https://docs.cloudfoundry.org/cf-cli/)
- [SAP Work Zone](https://help.sap.com/docs/WZ)
- [HTML5 Application Repository](https://help.sap.com/docs/BTP/65de2977205c403bbc107264b8eccf4b/11d77aa154f64c2e83cc9652a78bb985.html)

---

**🎉 ¡Tu proyecto está 100% listo para desplegar a SAP BTP Work Zone!**

Las 2 aplicaciones (app20 y app21) funcionarán perfectamente en la nube.

---

_Última actualización: Febrero 24, 2026_  
_Versión: 1.0_
