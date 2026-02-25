# 📊 Datos de Muestra - App21 Órdenes de Compra

## 🎯 Propósito

La aplicación app21 se inicializa con **datos de muestra precargados** para facilitar la demostración y prueba de la funcionalidad sin necesidad de ingresar datos manualmente.

---

## 📦 Orden de Compra de Ejemplo

### Información General

```javascript
Número de OC: PO-2024-001
Proveedor: V001 - Proveedor ABC S.A.
Fecha de Orden: [Fecha actual]
Fecha de Entrega: [30 días después]
Prioridad: Alta
Términos de Pago: Neto 30 días
```

### Información de Entrega

```
Dirección:
Av. Providencia 1234, Oficina 501
Providencia, Santiago
Región Metropolitana, Chile

Persona de Contacto:
Juan Pérez - Jefe de Compras
```

### Notas

```
Entrega urgente para proyecto Q1 2024. Coordinar con bodega central.
```

---

## 🛒 Ítems de la Orden (4 productos)

### Ítem 1: Equipos de Cómputo

| Campo | Valor |
|-------|-------|
| **Número** | 0001 |
| **Descripción** | Laptop Dell XPS 15 - Intel i7, 16GB RAM, 512GB SSD |
| **Cantidad** | 5 unidades |
| **Precio Unitario** | $1,500.00 USD |
| **Total** | $7,500.00 USD |

### Ítem 2: Monitores

| Campo | Valor |
|-------|-------|
| **Número** | 0002 |
| **Descripción** | Monitor LG 27 pulgadas 4K UHD con altura ajustable |
| **Cantidad** | 10 unidades |
| **Precio Unitario** | $450.00 USD |
| **Total** | $4,500.00 USD |

### Ítem 3: Teclados

| Campo | Valor |
|-------|-------|
| **Número** | 0003 |
| **Descripción** | Teclado mecánico Logitech MX Keys - Retroiluminado |
| **Cantidad** | 8 unidades |
| **Precio Unitario** | $120.00 USD |
| **Total** | $960.00 USD |

### Ítem 4: Mouse

| Campo | Valor |
|-------|-------|
| **Número** | 0004 |
| **Descripción** | Mouse inalámbrico Logitech MX Master 3S |
| **Cantidad** | 8 unidades |
| **Precio Unitario** | $85.00 USD |
| **Total** | $680.00 USD |

---

## 💰 Totales Calculados

```
Subtotal:        $13,640.00 USD
IVA (19%):       $ 2,591.60 USD
───────────────────────────────
TOTAL:           $16,231.60 USD
```

---

## 🔗 Relación con App20

Los **proveedores** en app21 son los mismos que en app20 (Evaluación de Proveedores):

| ID | Nombre del Proveedor |
|----|---------------------|
| V001 | Proveedor ABC S.A. |
| V002 | Distribuidora XYZ Ltda. |
| V003 | Suministros Global Corp. |
| V004 | Materiales Express SpA |
| V005 | Comercial Pacific Inc. |

**Proveedor precargado**: V001 - Proveedor ABC S.A.

Esto permite simular un flujo de trabajo realista:
1. Usuario evalúa proveedores en **app20**
2. Usuario crea órdenes de compra con proveedores evaluados en **app21**

---

## 🎨 Características Visuales

### Formulario Precargado

Al abrir la aplicación verás:

✅ **Todos los campos completados** con datos realistas  
✅ **4 ítems** en la tabla de productos  
✅ **Totales calculados** automáticamente  
✅ **Proveedor seleccionado** en el dropdown  
✅ **Fechas configuradas** (hoy + 30 días)

### Funcionalidad Interactiva

Puedes:
- ✏️ **Modificar** cualquier campo
- ➕ **Agregar** más ítems (botón "Agregar Ítem")
- 🗑️ **Eliminar** ítems (modo delete en tabla)
- 💾 **Crear** la orden (botón "Crear Orden de Compra")
- 🔄 **Limpiar** todo (botón "Limpiar Formulario")

### Recálculo Automático

Al cambiar **cantidad** o **precio unitario** de cualquier ítem:
- ✅ Total del ítem se recalcula
- ✅ Subtotal se actualiza
- ✅ IVA se recalcula (19%)
- ✅ Total general se actualiza

---

## 🧪 Casos de Uso de Prueba

### 1. Ver Datos de Muestra
```
Acción: Abrir la aplicación
Resultado: Formulario precargado con OC completa
```

### 2. Modificar Cantidad
```
Acción: Cambiar cantidad de ítem 1 a 10
Resultado: 
- Total ítem: $15,000.00
- Subtotal: $21,140.00
- IVA: $4,016.60
- Total: $25,156.60
```

### 3. Agregar Nuevo Ítem
```
Acción: Click en "Agregar Ítem"
Resultado: Nuevo ítem 0005 agregado a la tabla
```

### 4. Eliminar Ítem
```
Acción: Click en icono delete de un ítem
Resultado: Ítem eliminado, totales recalculados
```

### 5. Crear Orden
```
Acción: Click en "Crear Orden de Compra"
Resultado: 
- Dialog de confirmación
- Success message con detalles
- Payload logged en consola
- Panel de resumen mostrado
```

### 6. Limpiar Formulario
```
Acción: Click en "Limpiar Formulario" → Confirmar
Resultado: Formulario vacío, listo para nueva OC
```

### 7. Cambiar Proveedor
```
Acción: Seleccionar V002 en dropdown
Resultado: Toast message confirmando cambio
```

---

## 📝 Estructura de Datos (JSON)

```json
{
  "poData": {
    "poNumber": "PO-2024-001",
    "vendorId": "V001",
    "poDate": "2024-02-25",
    "deliveryDate": "2024-03-26",
    "deliveryAddress": "Av. Providencia 1234...",
    "contactPerson": "Juan Pérez - Jefe de Compras",
    "paymentTerms": "NET30",
    "priority": "HIGH",
    "notes": "Entrega urgente para proyecto Q1 2024...",
    "items": [
      {
        "itemNumber": "0001",
        "description": "Laptop Dell XPS 15...",
        "quantity": 5,
        "unitPrice": 1500.00,
        "total": 7500.00
      },
      // ... más ítems
    ],
    "subtotal": 13640.00,
    "tax": 2591.60,
    "total": 16231.60
  }
}
```

---

## 🔧 Configuración del Counter

El `itemCounter` inicia en **5** para que los nuevos ítems agregados continúen la numeración:

```typescript
private itemCounter: number = 5; // Start after sample items (0001-0004)
```

Entonces:
- Ítems de muestra: 0001, 0002, 0003, 0004
- Nuevos ítems: 0005, 0006, 0007, ...

---

## 🎯 Beneficios de los Datos de Muestra

### Para Desarrollo
- ✅ Testing inmediato sin configuración
- ✅ Verificación visual de la UI
- ✅ Validación de cálculos
- ✅ Debug más fácil con datos conocidos

### Para Demostración
- ✅ Impresión profesional
- ✅ Muestra todas las capacidades
- ✅ No requiere setup manual
- ✅ Datos realistas y creíbles

### Para Producción
- ✅ Template listo para copiar
- ✅ Ejemplo de estructura de datos
- ✅ Referencia para validaciones
- ✅ Fácil reemplazar con datos reales

---

## 🔄 Cómo Cambiar a Formulario Vacío

Si prefieres iniciar con un formulario vacío (para producción):

**Archivo**: `app21/webapp/controller/View21.controller.ts`

**Cambiar de:**
```typescript
poData: {
    poNumber: "PO-2024-001",
    vendorId: "V001",
    // ... datos precargados
}
```

**A:**
```typescript
poData: {
    poNumber: "",
    vendorId: "",
    poDate: this._formatDate(new Date()),
    deliveryDate: this._formatDate(this._addDays(new Date(), 30)),
    deliveryAddress: "",
    contactPerson: "",
    paymentTerms: "NET30",
    priority: "MEDIUM",
    notes: "",
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0
}
```

Y cambiar el counter a:
```typescript
private itemCounter: number = 1;
```

---

## 📊 Comparación: Con vs Sin Datos de Muestra

| Aspecto | Con Muestra | Sin Muestra |
|---------|------------|-------------|
| **Primera impresión** | ✅ Completa y profesional | ❌ Formulario vacío |
| **Testing** | ✅ Inmediato | ⏱️ Requiere entrada manual |
| **Demostración** | ✅ Lista para mostrar | ⏱️ Necesita preparación |
| **Comprensión** | ✅ Ejemplo claro | ❓ Requiere explicación |
| **Producción** | ⚠️ Cambiar a vacío | ✅ Listo |

---

## 🎓 Conclusión

Los datos de muestra en app21 facilitan:
1. **Desarrollo rápido** - Ver resultados inmediatamente
2. **Testing efectivo** - Validar toda la funcionalidad
3. **Demos impresionantes** - Mostrar capacidades completas
4. **Documentación viva** - Ejemplo de uso real

**Para BTP Work Zone**: Los datos de muestra hacen que la aplicación sea instantly useful al desplegarla, mejorando la experiencia de usuario y facilitando la adopción.

---

_Última actualización: Febrero 25, 2026_  
_Total de ítems de muestra: 4_  
_Total de la orden de ejemplo: $16,231.60 USD_
