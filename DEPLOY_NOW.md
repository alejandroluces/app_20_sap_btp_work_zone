# 🚀 GUÍA DE DESPLIEGUE - Webina MTA

## ✅ Archivos Creados/Corregidos

1. ✅ `webina-mta-approuter/resources/` - Carpeta creada
2. ✅ `webina-mta-approuter/resources/index.html` - Landing page profesional
3. ✅ `webina-mta-approuter/xs-app.json` - Configurado con `localDir: "resources"`
4. ✅ `xs-security.json` - Configurado con redirect URIs

## 📋 Estructura Final

```
webina-mta-approuter/
├── resources/
│   └── index.html          ✅ CREADO
├── xs-app.json             ✅ ACTUALIZADO
└── package.json            ✅ Ya existe
```

## 🎯 Comandos de Despliegue

### Opción 1: Re-push Solo del Approuter (MÁS RÁPIDO - 2 minutos)

```bash
# Desde la raíz del proyecto
cd webina-mta-approuter
cf push webina-mta-approuter
```

**Ventajas:**
- ⚡ Más rápido (2-3 minutos)
- 📦 Solo actualiza el approuter
- 🔄 No toca los servicios XSUAA

**Cuándo usar:** Cuando solo cambiaste archivos del approuter

---

### Opción 2: Re-deploy del MTA Completo (MÁS SEGURO - 10 minutos)

```bash
# 1. Actualizar también el servicio XSUAA con redirect URIs
cf update-service webina-mta-xsuaa-service -c xs-security.json

# 2. Build del MTA
mbt build

# 3. Deploy
cf deploy mta_archives/webina-mta_0.0.1.mtar
```

**Ventajas:**
- ✅ Actualiza TODO (approuter + XSUAA)
- 🔐 Aplica las redirect URIs al XSUAA
- 🎯 Más completo y seguro

**Cuándo usar:** Primera vez o cuando cambies xs-security.json

---

## 🔍 Verificar Despliegue

### 1. Ver status de la app
```bash
cf app webina-mta-approuter
```

Debe mostrar:
```
requested state: started
instances: 1/1
usage: 256M x 1 instances
routes: b3e51a00trial-dev-webina-mta-approuter.cfapps.us10-001.hana.ondemand.com
     #0   running
```

### 2. Ver logs en tiempo real
```bash
cf logs webina-mta-approuter --recent
```

**Buscar estas líneas (indican éxito):**
```
✓ Approuter started on port XXXX
✓ No "Service Tag unknown" errors
✓ No 503 errors
```

### 3. Probar en el navegador

**URL Principal:**
```
https://b3e51a00trial-dev-webina-mta-approuter.cfapps.us10-001.hana.ondemand.com
```

**Debe mostrar:**
- ✅ Login de SAP (XSUAA)
- ✅ Landing page "Webina MTA - SAP BTP" después del login
- ✅ Card con link a "Evaluación de Proveedores"
- ✅ NO errores 503 o "Service Tag unknown"

**App de Evaluación:**
```
https://b3e51a00trial-dev-webina-mta-approuter.cfapps.us10-001.hana.ondemand.com/sapbtpapp20
```

---

## ⚡ COMANDO RÁPIDO RECOMENDADO

Si solo quieres que funcione **AHORA** (sin actualizar XSUAA todavía):

```bash
cd webina-mta-approuter
cf push webina-mta-approuter
```

Espera 2-3 minutos y prueba la URL.

---

## 🎯 Resultado Esperado

### Antes (❌ Error):
- 503 Service Temporarily Unavailable
- "Service Tag index is unknown"
- "Service Tag cp is unknown"

### Después (✅ Funcionando):
- Login SAP aparece
- Landing page hermosa se carga
- Link a "Evaluación de Proveedores" funciona
- Toda la app funciona correctamente

---

## 🐛 Troubleshooting

### Si sigue dando 503:

1. **Verificar que la carpeta resources existe:**
```bash
ls webina-mta-approuter/resources/
```
Debe mostrar: `index.html`

2. **Verificar logs del approuter:**
```bash
cf logs webina-mta-approuter --recent
```

3. **Restart manual:**
```bash
cf restart webina-mta-approuter
```

### Si el login falla (OpenID error):

Ejecutar:
```bash
cf update-service webina-mta-xsuaa-service -c xs-security.json
cf restage webina-mta-approuter
```

---

## 📱 URLs Finales

| Tipo | URL |
|------|-----|
| **Landing Page** | `https://b3e51a00trial-dev-webina-mta-approuter.cfapps.us10-001.hana.ondemand.com` |
| **App Evaluación** | `https://...cfapps.us10-001.hana.ondemand.com/sapbtpapp20` |
| **Logout** | `https://...cfapps.us10-001.hana.ondemand.com/do/logout` |

---

## ✅ Checklist Final

- [ ] Ejecutar comando de deploy
- [ ] Esperar 2-3 minutos
- [ ] Verificar `cf app webina-mta-approuter` (debe estar verde)
- [ ] Abrir URL en navegador
- [ ] Hacer login con usuario SAP
- [ ] Ver landing page hermosa
- [ ] Click en "Evaluación de Proveedores"
- [ ] Probar la encuesta end-to-end

---

## 🎉 ¡Listo!

Una vez desplegado, tendrás:
1. ✅ Landing page profesional con info del sistema
2. ✅ Autenticación XSUAA funcionando
3. ✅ Link directo a la app de Evaluación de Proveedores
4. ✅ Todo funcionando sin errores 503

**¡Tu aplicación SAP BTP está lista para producción!** 🚀
