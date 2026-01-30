/**
 * Calendar rendering and navigation
 */

const Calendar = {
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth(),
    selectedDate: null,

    /**
     * Initialize the calendar
     */
    init() {
        this.render();
        this.setupEventListeners();
    },

    /**
     * Set up event listeners for navigation
     */
    setupEventListeners() {
        const prevBtn = document.getElementById('prevMonthBtn');
        const nextBtn = document.getElementById('nextMonthBtn');

        prevBtn.addEventListener('click', () => this.previousMonth());
        nextBtn.addEventListener('click', () => this.nextMonth());
    },

    /**
     * Render the calendar for current month
     */
    render() {
        this.updateMonthYearDisplay();
        this.renderDays();
    },

    /**
     * Update month/year display
     */
    updateMonthYearDisplay() {
        const display = document.getElementById('currentMonthYear');
        const monthName = Utils.getMonthName(this.currentMonth);
        display.textContent = `${monthName} ${this.currentYear}`;
    },

    /**
     * Render all day cells
     */
    renderDays() {
        const grid = document.getElementById('calendarGrid');

        // Remove existing day cells (keep headers)
        const existingCells = grid.querySelectorAll('.day-cell');
        existingCells.forEach(cell => cell.remove());

        // Get calendar data
        const firstDay = Utils.getFirstDayOfMonth(this.currentYear, this.currentMonth);
        const daysInMonth = Utils.getDaysInMonth(this.currentYear, this.currentMonth);
        const daysInPrevMonth = Utils.getDaysInMonth(
            this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear,
            this.currentMonth === 0 ? 11 : this.currentMonth - 1
        );

        const today = new Date();
        const events = Storage.getEventsByMonth(this.currentYear, this.currentMonth);

        // Create event lookup by date
        const eventsByDate = {};
        events.forEach(event => {
            if (!eventsByDate[event.date]) {
                eventsByDate[event.date] = [];
            }
            eventsByDate[event.date].push(event);
        });

        // Render previous month's trailing days
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const cell = this.createDayCell(day, true, null);
            grid.appendChild(cell);
        }

        // Render current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = Utils.formatDateISO(new Date(this.currentYear, this.currentMonth, day));
            const isToday = Utils.isSameDay(
                new Date(this.currentYear, this.currentMonth, day),
                today
            );
            const dayEvents = eventsByDate[dateStr] || [];

            const cell = this.createDayCell(day, false, dayEvents, isToday, dateStr);
            grid.appendChild(cell);
        }

        // Render next month's leading days
        const totalCells = firstDay + daysInMonth;
        const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

        for (let day = 1; day <= remainingCells; day++) {
            const cell = this.createDayCell(day, true, null);
            grid.appendChild(cell);
        }
    },

    /**
     * Create a day cell element
     * @param {number} day
     * @param {boolean} isOtherMonth
     * @param {Array|null} events
     * @param {boolean} isToday
     * @param {string} dateStr
     * @returns {HTMLElement}
     */
    createDayCell(day, isOtherMonth, events, isToday = false, dateStr = null) {
        const cell = document.createElement('div');
        cell.className = 'day-cell';

        if (isOtherMonth) {
            cell.classList.add('other-month');
        }

        if (isToday) {
            cell.classList.add('today');
        }

        // Day number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        cell.appendChild(dayNumber);

        // Add events if any
        if (events && events.length > 0 && !isOtherMonth) {
            const eventContainer = this.createEventIndicators(events);
            cell.appendChild(eventContainer);
        }

        // Add click handler for current month days
        if (!isOtherMonth && dateStr) {
            cell.setAttribute('data-date', dateStr);
            cell.setAttribute('tabindex', '0');
            cell.setAttribute('role', 'button');
            cell.setAttribute('aria-label', `${Utils.getMonthName(this.currentMonth)} ${day}, ${this.currentYear}`);

            cell.addEventListener('click', (e) => {
                // Check if clicked on an event item
                if (e.target.classList.contains('event-item')) {
                    const eventId = e.target.getAttribute('data-event-id');
                    this.handleEventClick(eventId);
                } else {
                    this.handleDayClick(dateStr);
                }
            });

            // Keyboard navigation
            cell.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleDayClick(dateStr);
                }
            });
        }

        return cell;
    },

    /**
     * Create event indicators for a day
     * @param {Array} events
     * @returns {HTMLElement}
     */
    createEventIndicators(events) {
        const container = document.createElement('div');

        if (events.length <= 3) {
            // Show event list
            container.className = 'event-list';
            events.forEach(event => {
                const eventItem = document.createElement('div');
                eventItem.className = 'event-item';
                eventItem.textContent = Utils.truncate(event.title, 20);
                eventItem.setAttribute('data-color', event.color);
                eventItem.setAttribute('data-event-id', event.id);
                eventItem.setAttribute('title', event.title);
                container.appendChild(eventItem);
            });
        } else {
            // Show badge with count
            container.className = 'event-indicators';
            const badge = document.createElement('div');
            badge.className = 'event-badge';
            badge.textContent = events.length;
            badge.setAttribute('title', `${events.length} events`);
            container.appendChild(badge);
        }

        return container;
    },

    /**
     * Handle day cell click
     * @param {string} dateStr
     */
    handleDayClick(dateStr) {
        this.selectedDate = dateStr;
        const events = Storage.getEventsByDate(dateStr);

        if (events.length > 0) {
            // Show events list or open first event
            Modal.openEditModal(events[0].id);
        } else {
            // Open modal to add new event
            Modal.openAddModal(dateStr);
        }
    },

    /**
     * Handle event item click
     * @param {string} eventId
     */
    handleEventClick(eventId) {
        Modal.openEditModal(eventId);
    },

    /**
     * Navigate to previous month
     */
    previousMonth() {
        if (this.currentMonth === 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else {
            this.currentMonth--;
        }
        this.render();
    },

    /**
     * Navigate to next month
     */
    nextMonth() {
        if (this.currentMonth === 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else {
            this.currentMonth++;
        }
        this.render();
    },

    /**
     * Refresh the calendar (after event changes)
     */
    refresh() {
        this.render();
    }
};

// Make Calendar available globally
window.Calendar = Calendar;
