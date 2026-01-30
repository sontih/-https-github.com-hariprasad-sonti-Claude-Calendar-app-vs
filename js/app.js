/**
 * Main application initialization and coordination
 */

const App = {
    /**
     * Initialize the application
     */
    init() {
        // Check if localStorage is available
        if (!Storage.isAvailable()) {
            alert('LocalStorage is not available. Events will not be saved.');
            return;
        }

        // Initialize modules
        Calendar.init();
        Modal.init();

        // Set up Add Event button
        this.setupAddEventButton();

        // Log initialization
        console.log('Calendar App initialized successfully');
    },

    /**
     * Set up the Add Event button
     */
    setupAddEventButton() {
        const addEventBtn = document.getElementById('addEventBtn');
        addEventBtn.addEventListener('click', () => {
            Modal.openAddModal();
        });
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}

// Make App available globally
window.App = App;
