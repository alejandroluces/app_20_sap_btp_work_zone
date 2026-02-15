/**
 * Formatter functions for the Vendor Evaluation Survey application
 * @namespace sap.btp.app20.model
 */

export default {
    /**
     * Format the vendor rating to display text
     * @param {number} iRating - The rating value (1-5)
     * @returns {string} - Formatted rating text
     */
    formatRating: function(iRating: number): string {
        if (!iRating || iRating === 0) {
            return "No calificado";
        }
        
        const aRatingText = [
            "Muy deficiente",
            "Deficiente",
            "Regular",
            "Bueno",
            "Excelente"
        ];
        
        return `${iRating}/5 - ${aRatingText[iRating - 1]}`;
    },

    /**
     * Format date to display format
     * @param {Date} oDate - The date object
     * @returns {string} - Formatted date string
     */
    formatDate: function(oDate: Date): string {
        if (!oDate) {
            return "";
        }
        
        const oDateFormat = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        } as Intl.DateTimeFormatOptions;
        
        return new Intl.DateTimeFormat('es-CL', oDateFormat).format(oDate);
    },

    /**
     * Format percentage value
     * @param {number} fValue - The percentage value
     * @returns {string} - Formatted percentage
     */
    formatPercentage: function(fValue: number): string {
        return `${Math.round(fValue)}%`;
    },

    /**
     * Determine if vendor rating is critical
     * @param {number} fAverage - Average rating
     * @returns {boolean} - True if critical
     */
    isCritical: function(fAverage: number): boolean {
        return fAverage < 2.5;
    },

    /**
     * Get state based on average score
     * @param {number} fAverage - Average rating
     * @returns {string} - State (Success, Warning, Error)
     */
    getScoreState: function(fAverage: number): string {
        if (fAverage >= 4.0) {
            return "Success";
        } else if (fAverage >= 2.5) {
            return "Warning";
        } else {
            return "Error";
        }
    },

    /**
     * Get icon based on average score
     * @param {number} fAverage - Average rating
     * @returns {string} - Icon name
     */
    getScoreIcon: function(fAverage: number): string {
        if (fAverage >= 4.0) {
            return "sap-icon://accept";
        } else if (fAverage >= 2.5) {
            return "sap-icon://warning";
        } else {
            return "sap-icon://decline";
        }
    }
};
