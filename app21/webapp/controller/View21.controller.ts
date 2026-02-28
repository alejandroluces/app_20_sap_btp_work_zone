import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import MessageBox from "sap/m/MessageBox";
import MessageToast from "sap/m/MessageToast";
import formatter from "../model/formatter";

/**
 * @namespace sap.btp.app21.controller
 */
export default class View21 extends Controller {

    public formatter = formatter;
    private itemCounter: number = 5; // Start after sample items (0001-0004)

    /**
     * Controller initialization
     */
    public onInit(): void {
        // Initialize the purchase order model with default data
        const oModel = new JSONModel({
            vendors: [
                { vendorId: "V001", vendorName: "Proveedor ABC S.A." },
                { vendorId: "V002", vendorName: "Distribuidora XYZ Ltda." },
                { vendorId: "V003", vendorName: "Suministros Global Corp." },
                { vendorId: "V004", vendorName: "Materiales Express SpA" },
                { vendorId: "V005", vendorName: "Comercial Pacific Inc." }
            ],
            paymentTermsList: [
                { key: "NET30", text: "Neto 30 días" },
                { key: "NET60", text: "Neto 60 días" },
                { key: "NET90", text: "Neto 90 días" },
                { key: "IMMEDIATE", text: "Pago inmediato" },
                { key: "ADVANCE", text: "Anticipo 50%" }
            ],
            priorityList: [
                { key: "LOW", text: "Baja" },
                { key: "MEDIUM", text: "Media" },
                { key: "HIGH", text: "Alta" },
                { key: "URGENT", text: "Urgente" }
            ],
            poData: {
                poNumber: "PO-2024-001",
                vendorId: "V001",
                poDate: this._formatDate(new Date()),
                deliveryDate: this._formatDate(this._addDays(new Date(), 30)),
                poDate: new Date(),
                deliveryDate: this._addDays(new Date(), 30),
                deliveryAddress: "Av. Providencia 1234, Oficina 501\nProvidencia, Santiago\nRegión Metropolitana, Chile",
                contactPerson: "Juan Pérez - Jefe de Compras",
                paymentTerms: "NET30",
                priority: "HIGH",
                notes: "Entrega urgente para proyecto Q1 2024. Coordinar con bodega central.",
                items: [
                    {
                        itemNumber: "0001",
                        description: "Laptop Dell XPS 15 - Intel i7, 16GB RAM, 512GB SSD",
                        quantity: 5,
                        unitPrice: 1500.00,
                        total: 7500.00
                    },
                    {
                        itemNumber: "0002",
                        description: "Monitor LG 27 pulgadas 4K UHD con altura ajustable",
                        quantity: 10,
                        unitPrice: 450.00,
                        total: 4500.00
                    },
                    {
                        itemNumber: "0003",
                        description: "Teclado mecánico Logitech MX Keys - Retroiluminado",
                        quantity: 8,
                        unitPrice: 120.00,
                        total: 960.00
                    },
                    {
                        itemNumber: "0004",
                        description: "Mouse inalámbrico Logitech MX Master 3S",
                        quantity: 8,
                        unitPrice: 85.00,
                        total: 680.00
                    }
                ],
                subtotal: 13640.00,
                tax: 2591.60,
                total: 16231.60
            },
            showSummary: false,
            statusText: "",
            statusState: "None",
            summaryMessage: "",
            creator: "Comprador Demo" // In real scenario, get from user session
        });

        this.getView()?.setModel(oModel);
    }

    /**
     * Handle vendor selection change
     */
    public onVendorChange(): void {
        const oModel = this.getView()?.getModel() as JSONModel;
        const sVendor = oModel.getProperty("/poData/vendorId");
        
        if (sVendor) {
            const oVendor = oModel.getProperty("/vendors").find((v: any) => v.vendorId === sVendor);
            MessageToast.show(`${this._getText("vendorSelected")}: ${oVendor?.vendorName}`);
        }
    }

    /**
     * Add new item to purchase order
     */
    public onAddItem(): void {
        const oModel = this.getView()?.getModel() as JSONModel;
        const aItems = oModel.getProperty("/poData/items");
        
        const oNewItem = {
            itemNumber: String(this.itemCounter++).padStart(4, "0"),
            description: "",
            quantity: 1,
            unitPrice: 0,
            total: 0
        };

        aItems.push(oNewItem);
        oModel.setProperty("/poData/items", aItems);
        
        MessageToast.show(this._getText("itemAdded"));
    }

    /**
     * Delete item from purchase order
     */
    public onDeleteItem(oEvent: any): void {
        const oModel = this.getView()?.getModel() as JSONModel;
        const oItem = oEvent.getParameter("listItem");
        const sPath = oItem.getBindingContext().getPath();
        const iIndex = parseInt(sPath.split("/").pop());
        
        const aItems = oModel.getProperty("/poData/items");
        aItems.splice(iIndex, 1);
        oModel.setProperty("/poData/items", aItems);
        
        this._calculateTotals();
        MessageToast.show(this._getText("itemDeleted"));
    }

    /**
     * Handle item change (quantity or price)
     */
    public onItemChange(): void {
        this._calculateTotals();
    }

    /**
     * Calculate totals for the purchase order
     */
    private _calculateTotals(): void {
        const oModel = this.getView()?.getModel() as JSONModel;
        const aItems = oModel.getProperty("/poData/items");
        
        let fSubtotal = 0;
        
        // Calculate total for each item
        aItems.forEach((oItem: any) => {
            const fQuantity = parseFloat(oItem.quantity) || 0;
            const fUnitPrice = parseFloat(oItem.unitPrice) || 0;
            oItem.total = fQuantity * fUnitPrice;
            fSubtotal += oItem.total;
        });
        
        // Calculate tax (19% - configurable)
        const fTax = fSubtotal * 0.19;
        const fTotal = fSubtotal + fTax;
        
        oModel.setProperty("/poData/subtotal", fSubtotal);
        oModel.setProperty("/poData/tax", fTax);
        oModel.setProperty("/poData/total", fTotal);
        oModel.setProperty("/poData/items", aItems);
    }

    /**
     * Create purchase order
     */
    public onCreatePurchaseOrder(): void {
        const oModel = this.getView()?.getModel() as JSONModel;
        const oData = oModel.getProperty("/poData");

        // Validation
        if (!this._validatePurchaseOrder(oData)) {
            return;
        }

        // Show confirmation dialog
        MessageBox.confirm(this._getText("confirmCreate"), {
            title: this._getText("confirmation"),
            onClose: (sAction: string | null) => {
                if (sAction === MessageBox.Action.OK) {
                    this._processPurchaseOrder(oData);
                }
            },
            styleClass: "sapUiSizeCompact"
        });
    }

    /**
     * Validate purchase order data
     */
    private _validatePurchaseOrder(oData: any): boolean {
        // Check required fields
        if (!oData.poNumber) {
            MessageBox.warning(this._getText("poNumberRequired"));
            return false;
        }

        if (!oData.vendorId) {
            MessageBox.warning(this._getText("vendorRequired"));
            return false;
        }

        if (!oData.poDate) {
            MessageBox.warning(this._getText("poDateRequired"));
            return false;
        }

        if (!oData.deliveryDate) {
            MessageBox.warning(this._getText("deliveryDateRequired"));
            return false;
        }

        if (!oData.deliveryAddress) {
            MessageBox.warning(this._getText("deliveryAddressRequired"));
            return false;
        }

        if (!oData.items || oData.items.length === 0) {
            MessageBox.warning(this._getText("itemsRequired"));
            return false;
        }

        // Validate items
        for (const oItem of oData.items) {
            if (!oItem.description || oItem.quantity <= 0 || oItem.unitPrice <= 0) {
                MessageBox.warning(this._getText("itemsIncomplete"));
                return false;
            }
        }

        return true;
    }

    /**
     * Process and save purchase order
     */
    private _processPurchaseOrder(oData: any): void {
        const oModel = this.getView()?.getModel() as JSONModel;
        
        // Prepare payload for backend
        const oPayload = {
            poNumber: oData.poNumber,
            vendorId: oData.vendorId,
            poDate: oData.poDate,
            deliveryDate: oData.deliveryDate,
            deliveryAddress: oData.deliveryAddress,
            contactPerson: oData.contactPerson,
            paymentTerms: oData.paymentTerms,
            priority: oData.priority,
            notes: oData.notes,
            items: oData.items,
            subtotal: oData.subtotal,
            tax: oData.tax,
            total: oData.total,
            creator: oModel.getProperty("/creator"),
            createdAt: new Date().toISOString(),
            status: "CREATED"
        };

        // Log to console (in real app, this would be an OData/REST call)
        console.log("Purchase Order Payload (would be sent to backend):", JSON.stringify(oPayload, null, 2));

        // Show success and update UI
        oModel.setProperty("/showSummary", true);
        oModel.setProperty("/statusText", this._getText("poCreatedStatus"));
        oModel.setProperty("/statusState", "Success");
        oModel.setProperty("/summaryMessage", 
            `${this._getText("poCreatedMessage")} ${oData.poNumber}\n` +
            `${this._getText("totalAmount")}: $${oData.total.toFixed(2)} USD`
        );

        MessageBox.success(this._getText("poCreatedSuccess"), {
            details: this._buildPODetails(oData),
            styleClass: "sapUiSizeCompact"
        });

        MessageToast.show(this._getText("dataSaved"));
    }

    /**
     * Build purchase order details for display
     */
    private _buildPODetails(oData: any): string {
        const oModel = this.getView()?.getModel() as JSONModel;
        const sVendorName = oModel.getProperty("/vendors").find((v: any) => v.vendorId === oData.vendorId)?.vendorName || "";
        
        return `${this._getText("poNumber")}: ${oData.poNumber}\n` +
               `${this._getText("vendor")}: ${sVendorName}\n` +
               `${this._getText("poDate")}: ${oData.poDate}\n` +
               `${this._getText("deliveryDate")}: ${oData.deliveryDate}\n` +
               `${this._getText("itemCount")}: ${oData.items.length}\n` +
               `${this._getText("subtotal")}: $${oData.subtotal.toFixed(2)}\n` +
               `${this._getText("tax")}: $${oData.tax.toFixed(2)}\n` +
               `${this._getText("total")}: $${oData.total.toFixed(2)}`;
    }

    /**
     * Clear form and reset to initial state
     */
    public onClearForm(): void {
        MessageBox.confirm(this._getText("confirmClear"), {
            onClose: (sAction: string | null) => {
                if (sAction === MessageBox.Action.OK) {
                    const oModel = this.getView()?.getModel() as JSONModel;
                    this.itemCounter = 1;
                    
                    oModel.setProperty("/poData", {
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
                    });
                    
                    oModel.setProperty("/showSummary", false);
                    MessageToast.show(this._getText("formCleared"));
                }
            }
        });
    }

    /**
     * Format date to yyyy-MM-dd
     */
    private _formatDate(oDate: Date): string {
        const iYear = oDate.getFullYear();
        const iMonth = String(oDate.getMonth() + 1).padStart(2, "0");
        const iDay = String(oDate.getDate()).padStart(2, "0");
        return `${iYear}-${iMonth}-${iDay}`;
    }

    /**
     * Add days to a date
     */
    private _addDays(oDate: Date, iDays: number): Date {
        const oResult = new Date(oDate);
        oResult.setDate(oResult.getDate() + iDays);
        return oResult;
    }

    /**
     * Get i18n text
     */
    private _getText(sKey: string): string {
        const oResourceBundle = (this.getView()?.getModel("i18n") as any)?.getResourceBundle();
        return oResourceBundle?.getText(sKey) || sKey;
    }
}
