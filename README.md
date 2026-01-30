# Calendar Application

A simple, responsive calendar application built with vanilla HTML, CSS, and JavaScript. Features full CRUD operations for events with persistent storage using browser's localStorage.

## Features

- **Month View Calendar**: Clean grid layout with current month display
- **Event Management**: Create, read, update, and delete events
- **Persistent Storage**: All events saved in browser's localStorage
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Form Validation**: Comprehensive validation for all event fields
- **Accessibility**: Keyboard navigation, ARIA labels, and focus management
- **Today Highlight**: Current date is highlighted in the calendar
- **Event Indicators**: Visual indicators show events on calendar days

## Technologies Used

- HTML5
- CSS3 (Grid, Flexbox, CSS Variables)
- JavaScript (ES6+)
- LocalStorage API

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools or dependencies required

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. That's it! The application is ready to use.

### File Structure

```
Calendar-App-Demo/
├── index.html              # Main HTML file
├── css/
│   ├── main.css           # Base styles & variables
│   ├── calendar.css       # Calendar grid styling
│   ├── modal.css          # Modal/form styling
│   └── responsive.css     # Media queries
├── js/
│   ├── app.js             # App initialization
│   ├── calendar.js        # Calendar rendering
│   ├── events.js          # Event CRUD operations
│   ├── storage.js         # LocalStorage wrapper
│   ├── modal.js           # Modal management
│   └── utils.js           # Helper functions
└── README.md              # This file
```

## Usage

### Adding an Event

1. Click the "Add Event" button in the header, or
2. Click on any day in the calendar
3. Fill in the event details:
   - **Title** (required): Event name (max 100 characters)
   - **Description** (optional): Event details (max 500 characters)
   - **Date** (required): Event date
   - **Start Time** (required): Event start time
   - **End Time** (required): Event end time (must be after start time)
   - **Color** (optional): Event color for visual identification
4. Click "Save"

### Editing an Event

1. Click on an event indicator in the calendar
2. Modify the event details in the form
3. Click "Save" to update

### Deleting an Event

1. Click on an event to open the edit form
2. Click the "Delete" button
3. Confirm the deletion

### Navigation

- Use the **< >** arrows to navigate between months
- Current month is displayed in the header
- Today's date is highlighted in yellow

## Data Model

Events are stored as JSON objects in localStorage with the following structure:

```javascript
{
  id: "evt_1706635200000_abc123",  // Unique identifier
  title: "Team Meeting",            // Required
  description: "Weekly standup",    // Optional
  date: "2026-01-30",              // ISO format (YYYY-MM-DD)
  startTime: "14:00",              // 24-hour format (HH:mm)
  endTime: "15:00",                // 24-hour format (HH:mm)
  color: "#4CAF50",                // Hex color code
  createdAt: 1706635200000,        // Timestamp
  updatedAt: 1706635200000         // Timestamp
}
```

## Validation Rules

| Field | Rule |
|-------|------|
| Title | Required, 1-100 characters |
| Description | Optional, max 500 characters |
| Date | Required, valid date format |
| Start Time | Required, valid time format |
| End Time | Required, must be after start time |
| Color | Optional, valid hex format |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility Features

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support (Tab, Enter, ESC)
- Focus management and focus trap in modal
- WCAG AA color contrast compliance
- Screen reader friendly

## Known Limitations

- Events are stored in browser's localStorage (limited to ~5-10MB)
- Data is browser-specific and not synced across devices
- No recurring events support
- Single-day events only (no multi-day events)
- Times are in local timezone only

## Future Enhancements

- Week and day views
- Recurring events
- Event categories/tags
- Search and filter functionality
- Export to ICS format
- Dark mode theme
- Drag and drop event moving
- Cloud sync

## License

This project is open source and available for educational purposes.

## Contributing

Feel free to fork this project and submit pull requests for improvements.

## Support

For issues or questions, please create an issue in the project repository.

---

Built with vanilla JavaScript - No frameworks, no build tools, just pure web technologies.
