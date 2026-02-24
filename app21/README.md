# 🛒 App21 - Órdenes de Compra (Purchase Orders)

## 📋 Descripción

Aplicación SAP Fiori para la gestión y creación de órdenes de compra dentro del módulo logístico de SAP BTP. Permite a los compradores crear órdenes de compra para proveedores evaluados, gestionar ítems, calcular totales automáticamente y mantener un registro completo de las transacciones.

## 🎯 Características Principales

### ✅ Gestión de Órdenes de Compra
- Creación de nuevas órdenes de compra
- Selección de proveedores del sistema
- Gestión de fechas de orden y entrega
- Configuración de términos de pago
- Establecimiento de prioridades

### 📦 Gestión de Ítems
- Agregar múltiples ítems por orden
- Especificar cantidad y precio unitario
- Cálculo automático de totales por ítem
- Eliminar ítems de la orden
- Validación de datos completos

### 💰 Cálculos Automáticos
- Subtotal de todos los ítems
- Cálculo de IVA (19% configurable)
- Total general de la orden
- Actualización dinámica al modificar cantidades o precios

### 📍 Información de Entrega
- Dirección de entrega detallada
- Persona de contacto para recepción
- Notas adicionales sobre la entrega

## 🏗️ Arquitectura

```
app21/
├── webapp/
│   ├── controller/
│   │   ├── App.controller.ts          # Controlador principal
│   │   └── View21.controller.ts       # Lógica de órdenes de compra
│   ├── view/
│   │   ├── App.view.xml               # Vista principal
│   │   └── View21.view.xml            # Vista de gestión de OC
│   ├── model/
│   │   ├── models.ts                  # Modelos de datos
│   │   └── formatter.ts               # Formateadores
│   ├── i18n/
│   │   └── i18n.properties            # Textos en español
│   ├── css/
│   │   └── style.css                  # Estilos personalizados
│   ├── Component.ts                    # Componente UI5
│   ├── manifest.json                   # Descriptor de la app
│   └── index.html                      # Punto de entrada
├── package.json                        # Dependencias Node.js
├── ui5.yaml                           # Configuración UI5
├── ui5-deploy.yaml                    # Configuración de despliegue
└── tsconfig.json                      # Configuración TypeScript
```

## 📊 Modelo de Datos

### Estructura de Orden de Compra
```json
{
  "poNumber": "PO-2024-001",
  "vendorId": "V001",
  "poDate": "2024-02-24",
  "deliveryDate": "2024-03-24",
  "deliveryAddress": "Calle Principal 123, Ciudad",
  "contactPerson": "Juan Pérez",
  "paymentTerms": "NET30",
  "priority": "MEDIUM",
  "notes": "Entrega en horario de oficina",
  "items": [
    {
      "itemNumber": "0001",
      "description": "Laptop Dell XPS 15",
      "quantity": 5,
      "unitPrice": 1500.00,
      "total": 7500.00
    }
  ],
  "subtotal": 7500.00,
  "tax": 1425.00,
  "total": 8925.00,
  "status": "CREATED",
  "creator": "Comprador Demo",
  "createdAt": "2024-02-24T23:00:00Z"
}
```

## 🔄 Flujo de Trabajo

1. **Información Básica**
   - Usuario ingresa número de OC
   - Selecciona proveedor
   - Define fechas de orden y entrega
   - Establece prioridad

2. **Información de Entrega**
   - Ingresa dirección completa
   - Define persona de contacto
   - Selecciona términos de pago

3. **Agregar Ítems**
   - Clic en "Agregar Ítem"
   - Completa: descripción, cantidad, precio
   - Totales se calculan automáticamente
   - Puede agregar múltiples ítems

4. **Revisión y Creación**
   - Sistema valida todos los campos
   - Muestra resumen con totales
   - Usuario confirma creación
   - Sistema guarda la orden

## 🎨 Componentes UI

### Formulario Principal
- **SimpleForm**: Datos generales de la orden
- **DatePicker**: Selección de fechas
- **Select**: Listas desplegables (proveedor, pago, prioridad)
- **TextArea**: Campos de texto largo

### Tabla de Ítems
- **Table**: Lista de ítems con capacidad de edición inline
- **Input**: Campos editables por ítem
- **ObjectNumber**: Visualización de montos
- Modo Delete para eliminar ítems

### Resumen
- **Panel**: Resumen de la orden creada
- **ObjectStatus**: Estado de la operación
- **Bar**: Subtotales, impuestos y total

## 🔧 Funcionalidades Técnicas

### Validaciones
- ✅ Campos obligatorios completos
- ✅ Al menos un ítem en la orden
- ✅ Ítems con datos válidos
- ✅ Cantidades y precios > 0
- ✅ Fecha de entrega posterior a fecha de orden

### Cálculos
- Subtotal: Suma de todos los ítems
- IVA: 19% del subtotal
- Total: Subtotal + IVA
- Actualización en tiempo real

### Formateo
- Monedas: 2 decimales, formato USD
- Fechas: dd/MM/yyyy
- Números: Separadores de miles

## 📱 Responsive Design

- **Desktop**: Layout de 2 columnas
- **Tablet**: Layout de 1 columna adaptativo
- **Mobile**: Layout vertical optimizado
- Tabla con demandPopin para pantallas pequeñas

## 🚀 Comandos

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm start

# Construir para producción
npm run build

# Construir para Cloud Foundry
npm run build:cf

# Verificar TypeScript
npm run ts-typecheck
```

## 🔗 Integración con otras Apps

### Con App20 (Evaluación de Proveedores)
- Comparte la misma lista de proveedores
- Puede consultar evaluaciones antes de crear OC
- Los proveedores mejor evaluados aparecen destacados

### Navegación Cross-App
```javascript
// Navegar desde App20 a App21
this.getOwnerComponent().getRouter().navTo("PurchaseOrder-create", {
    vendorId: "V001"
});
```

## 📊 KPIs y Métricas

- Total de órdenes creadas
- Monto promedio por orden
- Proveedores más utilizados
- Tiempo promedio de entrega
- Distribución por prioridad

## 🔐 Seguridad

- Autenticación vía XSUAA
- Validación de inputs
- Sanitización de datos
- Logs de auditoría

## 🎯 Próximas Mejoras

- [ ] Integración con backend OData
- [ ] Workflow de aprobación
- [ ] Notificaciones automáticas
- [ ] Dashboard de órdenes
- [ ] Exportación a PDF
- [ ] Tracking de entregas
- [ ] Historial de órdenes

## 👥 Usuarios Target

- **Compradores**: Creación de órdenes
- **Gerentes de Compras**: Aprobación y supervisión
- **Recepción**: Consulta de entregas esperadas
- **Contabilidad**: Información de pagos

## 📞 Soporte

Para reportar problemas o sugerencias, contactar al equipo de desarrollo del módulo logístico.

---

**Versión**: 0.0.1  
**Última actualización**: Febrero 2024  
**Módulo**: Logístico - SAP BTP Work Zone
