/**
 * @namespace sap.btp.app21.model
 */

/**
 * Format currency values
 */
export function formatCurrency(value: number): string {
    if (!value) {
        return "0.00";
    }
    return value.toFixed(2);
}

/**
 * Format date to readable format
 */
export function formatDate(sDate: string): string {
    if (!sDate) {
        return "";
    }
    
    const oDate = new Date(sDate);
    const iDay = String(oDate.getDate()).padStart(2, "0");
    const iMonth = String(oDate.getMonth() + 1).padStart(2, "0");
    const iYear = oDate.getFullYear();
    
    return `${iDay}/${iMonth}/${iYear}`;
}

/**
 * Format priority status
 */
export function formatPriorityState(sPriority: string): string {
    switch (sPriority) {
        case "URGENT":
            return "Error";
        case "HIGH":
            return "Warning";
        case "MEDIUM":
            return "Success";
        case "LOW":
            return "None";
        default:
            return "None";
    }
}

/**
 * Format status text
 */
export function formatStatusText(sStatus: string): string {
    switch (sStatus) {
        case "CREATED":
            return "Creado";
        case "APPROVED":
            return "Aprobado";
        case "IN_DELIVERY":
            return "En Entrega";
        case "DELIVERED":
            return "Entregado";
        case "CANCELLED":
            return "Cancelado";
        default:
            return sStatus;
    }
}

export default {
    formatCurrency,
    formatDate,
    formatPriorityState,
    formatStatusText
};
