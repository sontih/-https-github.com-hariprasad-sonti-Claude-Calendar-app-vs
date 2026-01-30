/**
 * Modal management for event creation and editing
 */

const Modal = {
    modalElement: null,
    formElement: null,
    currentEventId: null,
    isEditMode: false,
    focusedElementBeforeModal: null,

    /**
     * Initialize the modal
     */
    init() {
        this.modalElement = document.getElementById('eventModal');
        this.formElement = document.getElementById('eventForm');
        this.setupEventListeners();
    },

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Close button
        document.getElementById('closeModalBtn').addEventListener('click', () => this.close());

        // Cancel button
        document.getElementById('cancelBtn').addEventListener('click', () => this.close());

        // Overlay click
        this.modalElement.querySelector('.modal-overlay').addEventListener('click', () => this.close());

        // Delete button
        document.getElementById('deleteEventBtn').addEventListener('click', () => this.handleDelete());

        // Form submission
        this.formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modalElement.classList.contains('active')) {
                this.close();
            }
        });

        // Clear errors on input
        const inputs = this.formElement.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('error');
                const errorElement = document.getElementById(`${input.name}Error`);
                if (errorElement) {
                    errorElement.textContent = '';
                }
            });
        });

        // Color picker update
        const colorInput = document.getElementById('eventColor');
        const colorLabel = document.getElementById('colorLabel');
        colorInput.addEventListener('input', (e) => {
            colorLabel.textContent = e.target.value.toUpperCase();
        });

        // Focus trap
        this.modalElement.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.handleTabKey(e);
            }
        });
    },

    /**
     * Open modal to add new event
     * @param {string} date Optional pre-filled date
     */
    openAddModal(date = null) {
        this.isEditMode = false;
        this.currentEventId = null;

        // Update modal title
        document.getElementById('modalTitle').textContent = 'Add Event';

        // Hide delete button
        document.getElementById('deleteEventBtn').style.display = 'none';

        // Reset form
        this.formElement.reset();
        Events.clearErrors();

        // Pre-fill date if provided
        if (date) {
            document.getElementById('eventDate').value = date;
        } else {
            document.getElementById('eventDate').value = Utils.getTodayISO();
        }

        // Set default color
        document.getElementById('eventColor').value = '#1a73e8';
        document.getElementById('colorLabel').textContent = '#1A73E8';

        this.open();
    },

    /**
     * Open modal to edit existing event
     * @param {string} eventId
     */
    openEditModal(eventId) {
        const event = Events.getEvent(eventId);
        if (!event) {
            console.error('Event not found:', eventId);
            return;
        }

        this.isEditMode = true;
        this.currentEventId = eventId;

        // Update modal title
        document.getElementById('modalTitle').textContent = 'Edit Event';

        // Show delete button
        document.getElementById('deleteEventBtn').style.display = 'block';

        // Reset form and errors
        this.formElement.reset();
        Events.clearErrors();

        // Fill form with event data
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventDescription').value = event.description || '';
        document.getElementById('eventDate').value = event.date;
        document.getElementById('eventStartTime').value = event.startTime;
        document.getElementById('eventEndTime').value = event.endTime;
        document.getElementById('eventColor').value = event.color;
        document.getElementById('colorLabel').textContent = event.color.toUpperCase();

        this.open();
    },

    /**
     * Open the modal
     */
    open() {
        // Save currently focused element
        this.focusedElementBeforeModal = document.activeElement;

        // Show modal
        this.modalElement.classList.add('active');
        document.body.classList.add('modal-open');

        // Focus first input
        setTimeout(() => {
            document.getElementById('eventTitle').focus();
        }, 100);
    },

    /**
     * Close the modal
     */
    close() {
        this.modalElement.classList.remove('active');
        document.body.classList.remove('modal-open');

        // Reset form
        this.formElement.reset();
        Events.clearErrors();
        this.currentEventId = null;
        this.isEditMode = false;

        // Restore focus
        if (this.focusedElementBeforeModal) {
            this.focusedElementBeforeModal.focus();
        }
    },

    /**
     * Handle form submission
     */
    handleSubmit() {
        // Get form data
        const formData = {
            title: document.getElementById('eventTitle').value,
            description: document.getElementById('eventDescription').value,
            date: document.getElementById('eventDate').value,
            startTime: document.getElementById('eventStartTime').value,
            endTime: document.getElementById('eventEndTime').value,
            color: document.getElementById('eventColor').value
        };

        let result;

        if (this.isEditMode) {
            // Update existing event
            result = Events.updateEvent(this.currentEventId, formData);
        } else {
            // Create new event
            result = Events.createEvent(formData);
        }

        if (result.success) {
            // Close modal and refresh calendar
            this.close();
            Calendar.refresh();
        } else {
            // Display validation errors
            Events.displayErrors(result.errors);
        }
    },

    /**
     * Handle delete button click
     */
    handleDelete() {
        if (!this.currentEventId) return;

        const confirmed = confirm('Are you sure you want to delete this event?');
        if (confirmed) {
            Events.deleteEvent(this.currentEventId);
            this.close();
            Calendar.refresh();
        }
    },

    /**
     * Handle Tab key for focus trap
     * @param {KeyboardEvent} e
     */
    handleTabKey(e) {
        const focusableElements = this.modalElement.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const focusableArray = Array.from(focusableElements);
        const firstElement = focusableArray[0];
        const lastElement = focusableArray[focusableArray.length - 1];

        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
};

// Make Modal available globally
window.Modal = Modal;
