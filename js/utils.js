/**
 * Utility functions for date/time operations and validation
 */

const Utils = {
    /**
     * Get the number of days in a specific month
     * @param {number} year
     * @param {number} month (0-11)
     * @returns {number}
     */
    getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    },

    /**
     * Get the first day of the month (0-6, Sun-Sat)
     * @param {number} year
     * @param {number} month (0-11)
     * @returns {number}
     */
    getFirstDayOfMonth(year, month) {
        return new Date(year, month, 1).getDay();
    },

    /**
     * Get today's date in ISO format (YYYY-MM-DD)
     * @returns {string}
     */
    getTodayISO() {
        const today = new Date();
        return this.formatDateISO(today);
    },

    /**
     * Format a Date object to ISO date string (YYYY-MM-DD)
     * @param {Date} date
     * @returns {string}
     */
    formatDateISO(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    /**
     * Parse ISO date string to Date object
     * @param {string} dateString (YYYY-MM-DD)
     * @returns {Date}
     */
    parseISODate(dateString) {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    },

    /**
     * Check if a date string is valid ISO format
     * @param {string} dateString
     * @returns {boolean}
     */
    isValidDate(dateString) {
        if (!dateString || typeof dateString !== 'string') return false;
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateString)) return false;

        const date = this.parseISODate(dateString);
        return date instanceof Date && !isNaN(date.getTime());
    },

    /**
     * Check if a time string is valid HH:mm format
     * @param {string} timeString
     * @returns {boolean}
     */
    isValidTime(timeString) {
        if (!timeString || typeof timeString !== 'string') return false;
        const regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
        return regex.test(timeString);
    },

    /**
     * Check if end time is after start time
     * @param {string} startTime (HH:mm)
     * @param {string} endTime (HH:mm)
     * @returns {boolean}
     */
    isEndTimeAfterStartTime(startTime, endTime) {
        if (!this.isValidTime(startTime) || !this.isValidTime(endTime)) {
            return false;
        }

        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);

        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;

        return endMinutes > startMinutes;
    },

    /**
     * Check if a color is valid hex format
     * @param {string} color
     * @returns {boolean}
     */
    isValidHexColor(color) {
        if (!color || typeof color !== 'string') return false;
        const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        return regex.test(color);
    },

    /**
     * Get month name from month number
     * @param {number} month (0-11)
     * @returns {string}
     */
    getMonthName(month) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[month];
    },

    /**
     * Check if two dates are the same day
     * @param {Date} date1
     * @param {Date} date2
     * @returns {boolean}
     */
    isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    },

    /**
     * Generate a unique ID
     * @returns {string}
     */
    generateId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 9);
        return `evt_${timestamp}_${random}`;
    },

    /**
     * Truncate text with ellipsis
     * @param {string} text
     * @param {number} maxLength
     * @returns {string}
     */
    truncate(text, maxLength) {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },

    /**
     * Format time to 12-hour format with AM/PM
     * @param {string} time24 (HH:mm)
     * @returns {string}
     */
    formatTime12Hour(time24) {
        if (!this.isValidTime(time24)) return time24;

        const [hour, minute] = time24.split(':').map(Number);
        const period = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;

        return `${hour12}:${String(minute).padStart(2, '0')} ${period}`;
    },

    /**
     * Check if a year is a leap year
     * @param {number} year
     * @returns {boolean}
     */
    isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }
};

// Make Utils available globally
window.Utils = Utils;
