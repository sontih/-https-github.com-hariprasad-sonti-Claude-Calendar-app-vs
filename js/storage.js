/**
 * LocalStorage wrapper for managing calendar events
 */

const Storage = {
    STORAGE_KEY: 'calendar_events',

    /**
     * Get all events from localStorage
     * @returns {Array}
     */
    getEvents() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (!data) return [];

            const events = JSON.parse(data);
            return Array.isArray(events) ? events : [];
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            // If JSON is corrupted, clear it and return empty array
            this.clearEvents();
            return [];
        }
    },

    /**
     * Save events to localStorage
     * @param {Array} events
     * @returns {boolean} Success status
     */
    saveEvents(events) {
        try {
            if (!Array.isArray(events)) {
                console.error('Events must be an array');
                return false;
            }

            const json = JSON.stringify(events);
            localStorage.setItem(this.STORAGE_KEY, json);
            return true;
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                console.error('LocalStorage quota exceeded');
                alert('Storage quota exceeded. Please delete some events.');
            } else {
                console.error('Error saving to localStorage:', error);
            }
            return false;
        }
    },

    /**
     * Add a new event
     * @param {Object} event
     * @returns {boolean} Success status
     */
    addEvent(event) {
        const events = this.getEvents();
        events.push(event);
        return this.saveEvents(events);
    },

    /**
     * Update an existing event
     * @param {string} eventId
     * @param {Object} updatedEvent
     * @returns {boolean} Success status
     */
    updateEvent(eventId, updatedEvent) {
        const events = this.getEvents();
        const index = events.findIndex(e => e.id === eventId);

        if (index === -1) {
            console.error('Event not found:', eventId);
            return false;
        }

        events[index] = { ...events[index], ...updatedEvent, updatedAt: Date.now() };
        return this.saveEvents(events);
    },

    /**
     * Delete an event
     * @param {string} eventId
     * @returns {boolean} Success status
     */
    deleteEvent(eventId) {
        const events = this.getEvents();
        const filteredEvents = events.filter(e => e.id !== eventId);

        if (events.length === filteredEvents.length) {
            console.error('Event not found:', eventId);
            return false;
        }

        return this.saveEvents(filteredEvents);
    },

    /**
     * Get event by ID
     * @param {string} eventId
     * @returns {Object|null}
     */
    getEventById(eventId) {
        const events = this.getEvents();
        return events.find(e => e.id === eventId) || null;
    },

    /**
     * Get events for a specific date
     * @param {string} date ISO format (YYYY-MM-DD)
     * @returns {Array}
     */
    getEventsByDate(date) {
        const events = this.getEvents();
        return events.filter(e => e.date === date);
    },

    /**
     * Get events for a specific month
     * @param {number} year
     * @param {number} month (0-11)
     * @returns {Array}
     */
    getEventsByMonth(year, month) {
        const events = this.getEvents();
        return events.filter(e => {
            const eventDate = Utils.parseISODate(e.date);
            return eventDate.getFullYear() === year && eventDate.getMonth() === month;
        });
    },

    /**
     * Clear all events
     * @returns {boolean} Success status
     */
    clearEvents() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    },

    /**
     * Check if localStorage is available
     * @returns {boolean}
     */
    isAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            console.error('LocalStorage not available:', error);
            return false;
        }
    }
};

// Make Storage available globally
window.Storage = Storage;
