# Theory of Change - Interactive Diagram Builder

An interactive web application for creating, editing, and visualizing Theory of Change diagrams. This tool helps you plan and document strategic pathways from activities to impact, with support for drag-and-drop editing, change tracking, and multiple export formats.

## Features

- **Interactive Editing** - Drag-and-drop boxes, edit content inline, and reorganize your diagram
- **Auto-save** - Changes are automatically saved to your browser's localStorage
- **Change Tracking** - Highlight changes from the original, compare versions
- **Export/Import** - Save and load diagrams as JSON, export as HTML or PNG
- **Responsive Design** - Works on various screen sizes with horizontal scrolling for large diagrams
- **Modular Architecture** - Clean, maintainable codebase built with modern JavaScript

## Project Structure

```
toc/
├── src/
│   ├── js/
│   │   ├── main.js              # Entry point, initializes app
│   │   ├── state.js             # Global application state
│   │   ├── storage.js           # LocalStorage operations
│   │   ├── editor.js            # Edit mode & drag-and-drop
│   │   ├── export.js            # Export/import functionality
│   │   ├── ui.js                # UI interactions & change highlighting
│   │   └── data/
│   │       └── defaultContent.js # Default diagram content
│   ├── css/
│   │   ├── main.css             # Base styles
│   │   ├── diagram.css          # Diagram & flow styles
│   │   ├── controls.css         # Buttons & controls
│   │   └── modal.css            # Modal & overlays
│   └── index.html               # HTML template
├── public/                      # Static assets
├── dist/                        # Production build output
├── package.json
├── vite.config.js              # Build configuration
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Testing on Claude Code Web

**Easy Way - Live Preview (Recommended):**

The app is automatically deployed to GitHub Pages whenever changes are pushed. Just visit the live URL and refresh to see updates!

**URL:** `https://bec-hawk.github.io/toc/`

After I make changes and push, just refresh your browser - no downloads needed! ✨

**Alternative - Local Testing:**

If you want to test locally:

1. Build the production version:
   ```bash
   npm run build
   ```

2. Download the `dist` folder from your file explorer

3. Open `dist/index.html` in your web browser

The built app works completely offline.

**Quick test command:**
```bash
./test-build.sh
```

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd toc
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server with hot reload:

```bash
npm run dev
```

This will start Vite's dev server at `http://localhost:3000` (or another port if 3000 is taken). The page will automatically reload when you make changes to the source files.

### Building for Production

Build the optimized production bundle:

```bash
npm run build
```

The build output will be in the `dist/` directory. You can deploy these files to any static web host.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Development Guide

### Code Organization

#### State Management (`state.js`)
Global application state including edit mode, current editing box, drag state, and view modes.

#### Storage (`storage.js`)
Handles all localStorage operations for persisting diagram data, including:
- `loadData()` - Load saved or default content
- `saveData()` - Save current diagram to localStorage
- `debouncedSave()` - Debounced save (1 second delay)

#### Editor (`editor.js`)
All editing functionality:
- `enableEditMode()` / `disableEditMode()` - Toggle edit capabilities
- `editBox()`, `deleteBox()`, `moveBoxUp()`, `moveBoxDown()` - Box manipulation
- `addNewBox()`, `addColumn()`, `removeColumn()` - Add/remove elements
- Drag-and-drop handlers

#### Export (`export.js`)
Import/export functionality:
- `downloadHTML()` - Export complete HTML file
- `exportJSON()` - Export diagram data as JSON
- `importJSON()` - Import diagram from JSON
- `downloadPNG()` - Generate and download PNG image

#### UI (`ui.js`)
UI interactions and features:
- `toggleEditMode()` - Switch between view and edit modes
- `toggleHighlightChanges()` - Show/hide change highlights
- `toggleViewOriginal()` - Toggle between current and original content
- Change highlighting logic

### Adding New Features

1. **State Changes**: Update `src/js/state.js` if you need new global state
2. **New UI Elements**: Add HTML to `src/index.html` and styles to appropriate CSS file
3. **Event Handlers**: Wire up events in `src/js/main.js`'s `setupEventListeners()`
4. **Persistence**: If data needs to be saved, update `storage.js`

### Styling

CSS is organized by concern:
- **main.css**: Base styles, typography, container
- **controls.css**: Buttons, toolbars, controls
- **diagram.css**: Flow diagram, columns, boxes, streams
- **modal.css**: Modals and forms

Use existing CSS classes when possible. Follow the established naming conventions.

## Usage

### Edit Mode

1. Click "Enable Edit Mode" to start editing
2. Click and drag boxes to move them between columns or within a column
3. Use arrow buttons (↑↓) to reorder boxes or sections
4. Click the edit button (✏️) to modify box content
5. Click the delete button (×) to remove boxes

### Saving & Loading

- **Auto-save**: Changes are automatically saved to your browser
- **Export JSON**: Download your diagram as a JSON file for backup or sharing
- **Import JSON**: Load a previously exported diagram
- **Download HTML**: Export a standalone HTML file with your diagram
- **Download PNG**: Generate a high-quality image of your diagram

### Change Tracking

- **Highlight Changes**: Show visual indicators of added, modified, or removed items
- **View Original**: Compare your current diagram with the original template
- **Clear Saved**: Reset to the default diagram (deletes all changes)

## Technologies

- **Vite** - Fast build tool and dev server
- **ES Modules** - Modern JavaScript module system
- **html-to-image** - PNG export functionality
- **LocalStorage API** - Client-side data persistence
- **Drag and Drop API** - Native browser drag-and-drop

## Browser Support

Works in all modern browsers that support:
- ES6+ JavaScript
- CSS Grid and Flexbox
- LocalStorage
- Native Drag and Drop API

Tested in Chrome, Firefox, Safari, and Edge.

## Contributing

When contributing, please:

1. Follow the existing code style and organization
2. Test your changes in multiple browsers
3. Update documentation if adding new features
4. Keep commits focused and write clear commit messages

## License

[Add your license here]

## Future Roadmap Ideas

- Undo/redo functionality
- Collaborative editing
- Templates for different types of theories of change
- Advanced export options (PDF, SVG)
- Search and filter functionality
- Keyboard shortcuts
- TypeScript migration for better type safety
- Unit tests and E2E tests
