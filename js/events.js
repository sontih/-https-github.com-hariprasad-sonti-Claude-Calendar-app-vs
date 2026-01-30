/**
 * Event management and validation
 */

const Events = {
    /**
     * Validate event data
     * @param {Object} eventData
     * @returns {Object} { isValid, errors }
     */
    validateEvent(eventData) {
        const errors = {};

        // Title: required, 1-100 chars
        if (!eventData.title || !eventData.title.trim()) {
            errors.title = 'Title is required';
        } else if (eventData.title.length > 100) {
            errors.title = 'Title must be less than 100 characters';
        }

        // Description: optional, max 500 chars
        if (eventData.description && eventData.description.length > 500) {
            errors.description = 'Description must be less than 500 characters';
        }

        // Date: required, valid format
        if (!eventData.date) {
            errors.date = 'Date is required';
        } else if (!Utils.isValidDate(eventData.date)) {
            errors.date = 'Valid date is required';
        }

        // Start time: required, valid format
        if (!eventData.startTime) {
            errors.startTime = 'Start time is required';
        } else if (!Utils.isValidTime(eventData.startTime)) {
            errors.startTime = 'Valid start time is required';
        }

        // End time: required, valid format, must be after start time
        if (!eventData.endTime) {
            errors.endTime = 'End time is required';
        } else if (!Utils.isValidTime(eventData.endTime)) {
            errors.endTime = 'Valid end time is required';
        } else if (eventData.startTime && !Utils.isEndTimeAfterStartTime(eventData.startTime, eventData.endTime)) {
            errors.endTime = 'End time must be after start time';
        }

        // Color: optional, must be valid hex if provided
        if (eventData.color && !Utils.isValidHexColor(eventData.color)) {
            errors.color = 'Valid color is required';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    },

    /**
     * Create a new event
     * @param {Object} eventData
     * @returns {Object|null} Created event or null if validation fails
     */
    createEvent(eventData) {
        // Validate
        const validation = this.validateEvent(eventData);
        if (!validation.isValid) {
            return { success: false, errors: validation.errors };
        }

        // Create event object
        const event = {
            id: Utils.generateId(),
            title: eventData.title.trim(),
            description: eventData.description?.trim() || '',
            date: eventData.date,
            startTime: eventData.startTime,
            endTime: eventData.endTime,
            color: eventData.color || '#4CAF50',
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        // Save to storage
        const success = Storage.addEvent(event);

        return {
            success,
            event: success ? event : null,
            errors: success ? {} : { general: 'Failed to save event' }
        };
    },

    /**
     * Update an existing event
     * @param {string} eventId
     * @param {Object} eventData
     * @returns {Object}
     */
    updateEvent(eventId, eventData) {
        // Validate
        const validation = this.validateEvent(eventData);
        if (!validation.isValid) {
            return { success: false, errors: validation.errors };
        }

        // Prepare updated data
        const updatedData = {
            title: eventData.title.trim(),
            description: eventData.description?.trim() || '',
            date: eventData.date,
            startTime: eventData.startTime,
            endTime: eventData.endTime,
            color: eventData.color || '#4CAF50'
        };

        // Update in storage
        const success = Storage.updateEvent(eventId, updatedData);

        return {
            success,
            errors: success ? {} : { general: 'Failed to update event' }
        };
    },

    /**
     * Delete an event
     * @param {string} eventId
     * @returns {boolean}
     */
    deleteEvent(eventId) {
        return Storage.deleteEvent(eventId);
    },

    /**
     * Get event by ID
     * @param {string} eventId
     * @returns {Object|null}
     */
    getEvent(eventId) {
        return Storage.getEventById(eventId);
    },

    /**
     * Get events for a specific date
     * @param {string} date
     * @returns {Array}
     */
    getEventsByDate(date) {
        return Storage.getEventsByDate(date);
    },

    /**
     * Get events for a specific month
     * @param {number} year
     * @param {number} month (0-11)
     * @returns {Array}
     */
    getEventsByMonth(year, month) {
        return Storage.getEventsByMonth(year, month);
    },

    /**
     * Display validation errors in the form
     * @param {Object} errors
     */
    displayErrors(errors) {
        // Clear all previous errors
        this.clearErrors();

        // Display new errors
        Object.keys(errors).forEach(field => {
            const errorElement = document.getElementById(`${field}Error`);
            const inputElement = document.getElementById(`event${field.charAt(0).toUpperCase() + field.slice(1)}`);

            if (errorElement) {
                errorElement.textContent = errors[field];
            }

            if (inputElement) {
                inputElement.classList.add('error');
            }
        });
    },

    /**
     * Clear all validation errors from the form
     */
    clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(el => el.textContent = '');

        const inputElements = document.querySelectorAll('.error');
        inputElements.forEach(el => el.classList.remove('error'));
    }
};

// Make Events available globally
window.Events = Events;
