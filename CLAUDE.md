# CLAUDE.md - AI Assistant Guide

This document provides comprehensive guidance for AI assistants working on the Theory of Change Interactive Diagram Builder codebase.

## Project Overview

**Theory of Change - Interactive Diagram Builder** is a web application for creating, editing, and visualizing Theory of Change diagrams. It helps users plan and document strategic pathways from activities to impact with support for drag-and-drop editing, change tracking, and multiple export formats.

**Key Features:**
- Interactive drag-and-drop editing
- Auto-save to localStorage
- Change tracking and comparison
- Export/Import (JSON, HTML, PNG)
- Responsive design with horizontal scrolling
- Modular, maintainable JavaScript architecture

**Live Deployment:** `https://bec-hawk.github.io/toc/`

## Technology Stack

- **Build Tool:** Vite 5.x - Fast development server with hot module replacement
- **JavaScript:** ES6+ modules, vanilla JavaScript (no framework)
- **Styling:** Modular CSS organized by concern
- **Storage:** Browser localStorage API for persistence
- **Export:** html-to-image library for PNG generation
- **Deployment:** GitHub Pages (auto-deployed on push)

## Repository Structure

```
toc_public/
├── src/                        # Source files
│   ├── js/                     # JavaScript modules
│   │   ├── main.js            # Entry point, app initialization
│   │   ├── state.js           # Global application state
│   │   ├── storage.js         # localStorage operations
│   │   ├── editor.js          # Edit mode & drag-and-drop
│   │   ├── export.js          # Export/import functionality
│   │   ├── ui.js              # UI interactions & change highlighting
│   │   └── data/
│   │       └── defaultContent.js  # Default diagram template
│   ├── css/                   # Stylesheets
│   │   ├── main.css           # Base styles & typography
│   │   ├── diagram.css        # Diagram layout & flow styles
│   │   ├── controls.css       # Buttons & toolbar styles
│   │   └── modal.css          # Modal & overlay styles
│   └── index.html             # HTML template
├── public/                    # Static assets
├── dist/                      # Production build output (git-ignored)
├── package.json               # Dependencies and scripts
├── vite.config.js            # Vite build configuration
├── test-build.sh             # Quick build test script
└── README.md                 # User-facing documentation
```

## Architecture & Design Patterns

### Module Organization

The codebase follows a **modular architecture** with clear separation of concerns:

1. **state.js** - Centralized application state
   - Single source of truth for app state
   - Exports `state` object and constants
   - No business logic, pure state management

2. **storage.js** - Data persistence layer
   - Handles all localStorage operations
   - Implements debounced auto-save (1 second delay)
   - Provides save indicator UI updates
   - Functions: `loadData()`, `saveData()`, `debouncedSave()`, `clearStorage()`

3. **editor.js** - Edit mode functionality
   - Drag-and-drop handlers
   - Box manipulation (edit, delete, move, add)
   - Column management
   - Modal handling
   - Cleanup utilities for temporary classes

4. **export.js** - Import/export operations
   - JSON export/import
   - HTML download (full page)
   - PNG generation using html-to-image
   - Data versioning

5. **ui.js** - UI interactions
   - Edit mode toggle
   - Change highlighting
   - Original vs current view toggle
   - Change detection and comparison logic

6. **main.js** - Application entry point
   - Initializes the app
   - Sets up event listeners
   - Imports all CSS files
   - Exposes functions to global scope for onclick handlers

### State Management Pattern

```javascript
// Centralized state in state.js
export const state = {
    editMode: false,
    currentEditingBox: null,
    draggedBox: null,
    columnCounter: 6,
    highlightingChanges: false,
    viewingOriginal: false,
    savedContent: null
};
```

- State is imported and mutated directly (no Redux/Vuex complexity)
- State changes trigger UI updates and auto-saves
- Simple and effective for this app's scope

### Data Persistence Pattern

```javascript
// Debounced save pattern
let saveTimeout;
export function debouncedSave() {
    updateSaveIndicator('Saving...', false);
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        saveData();
    }, 1000);
}
```

- All changes trigger debounced saves
- Prevents excessive localStorage writes
- User sees save indicator feedback

### Event Handling Pattern

- Event listeners registered in `main.js` `setupEventListeners()`
- Some functions exposed globally (`window.editBox`) for onclick handlers in dynamically created HTML
- Consistent event delegation for dynamic content

## Code Conventions

### JavaScript

1. **Module Format:** ES6 modules with named exports
   ```javascript
   export function functionName() { ... }
   ```

2. **Documentation:** JSDoc comments for all exported functions
   ```javascript
   /**
    * Load saved data or default content on page load
    */
   export function loadData() { ... }
   ```

3. **Naming Conventions:**
   - Functions: camelCase (`loadData`, `toggleEditMode`)
   - Variables: camelCase (`saveTimeout`, `currentEditingBox`)
   - Constants: UPPER_SNAKE_CASE (`STORAGE_KEY`)
   - DOM IDs: camelCase (`toggleEdit`, `downloadHTML`)

4. **DOM Manipulation:**
   - Use `document.getElementById()` for specific elements
   - Use `document.querySelectorAll()` for collections
   - Cache DOM references when used multiple times

5. **Cleanup Pattern:**
   - Always clean up temporary CSS classes before saving
   - Remove event listeners when disabling features
   - Pattern seen in `cleanupPlaceholderClasses()` function

### CSS

1. **Organization by Concern:**
   - `main.css` - Base styles, layout, typography
   - `controls.css` - Buttons, toolbars, UI controls
   - `diagram.css` - Flow diagram, columns, boxes
   - `modal.css` - Modals, overlays, forms

2. **Naming Conventions:**
   - BEM-like patterns: `.box-controls`, `.box-btn-edit`
   - State classes: `.edit-mode`, `.active`, `.dragging-over`
   - Semantic class names: `.column`, `.stream-label`, `.actor`

3. **Responsive Design:**
   - Use flexbox for flow layout
   - Horizontal scrolling for wide diagrams
   - Mobile-friendly touch targets

### HTML

1. **Semantic Structure:**
   - Logical nesting: container → diagram → flow → column → box
   - Accessibility: proper button elements, labels

2. **Data Attributes:**
   - Used for state tracking in drag-and-drop
   - Temporary attributes cleaned up before saving

## Development Workflows

### Starting Development

```bash
# Install dependencies
npm install

# Start development server (opens at localhost:3000)
npm run dev
```

- Vite dev server provides hot module replacement
- Changes auto-reload in browser
- Fast iteration cycle

### Building for Production

```bash
# Build optimized bundle
npm run build

# Preview production build locally
npm run preview

# Quick test script
./test-build.sh
```

- Output goes to `dist/` directory
- Vite handles minification, bundling, and optimization
- `dist/` is git-ignored

### Testing Changes

**Recommended: GitHub Pages**
- App auto-deploys to `https://bec-hawk.github.io/toc/` on push
- Simply push changes and refresh browser
- No local build needed for testing

**Alternative: Local Build**
- Run `npm run build`
- Open `dist/index.html` in browser
- Fully offline-capable

### Git Workflow

1. **Current Branch:** `claude/claude-md-miaga7u3q0llyjfo-01NYMG4GvFWNsvfHWQx45WMB`
2. **Commit Style:** Clear, descriptive messages
   - Example: "Add files via upload"
   - Keep commits focused and atomic
3. **Push Target:** Always push to the designated Claude branch
4. **Deployment:** Automatic to GitHub Pages on push

## Common Tasks for AI Assistants

### Adding a New Feature

1. **Determine Module Placement:**
   - State changes? → Update `state.js`
   - UI interaction? → Add to `ui.js`
   - Edit functionality? → Add to `editor.js`
   - Export/Import? → Add to `export.js`
   - Persistence? → Update `storage.js`

2. **Update Event Listeners:**
   - Add event listener in `main.js` `setupEventListeners()`
   - Or expose function globally for onclick handlers

3. **Add UI Elements:**
   - Update `src/index.html` for new controls
   - Add styles to appropriate CSS file

4. **Test Auto-Save:**
   - Ensure changes trigger `debouncedSave()`
   - Verify data persists across page reloads

### Modifying Existing Features

1. **Read the Module First:**
   - Always read the entire module before making changes
   - Understand existing patterns and conventions
   - Maintain consistency with current code style

2. **Preserve Cleanup Logic:**
   - Respect the cleanup patterns for temporary classes
   - Don't persist drag-and-drop state classes
   - Call `cleanupPlaceholderClasses()` before saves

3. **Update Documentation:**
   - Update JSDoc comments if function signature changes
   - Update README.md if user-facing behavior changes

### Debugging Common Issues

1. **Drag-and-Drop Issues:**
   - Check for `.dragging`, `.dragging-over` class cleanup
   - Verify event listeners in `enableEditMode()`
   - Ensure `state.draggedBox` is set/cleared properly

2. **Save Issues:**
   - Check localStorage in browser DevTools
   - Verify `STORAGE_KEY` is correct
   - Ensure `debouncedSave()` is called on changes

3. **Export Issues:**
   - Verify cleanup before export (see `exportJSON()` pattern)
   - Check that temporary classes are removed
   - Test with browser's download handling

### Styling Guidelines

1. **Follow Existing Patterns:**
   - Use existing color variables/patterns
   - Match spacing and sizing conventions
   - Maintain responsive behavior

2. **CSS Organization:**
   - Add diagram styles to `diagram.css`
   - Add control styles to `controls.css`
   - Keep files focused on their concern

3. **Avoid Over-Engineering:**
   - Don't add CSS frameworks or preprocessors
   - Keep vanilla CSS for simplicity
   - Use modern CSS features (Grid, Flexbox)

## Important Implementation Details

### LocalStorage Structure

```javascript
{
  "html": "<div class='column'>...</div>",
  "columnCounter": 6,
  "timestamp": "2025-11-22T15:35:00.000Z"
}
```

- Stores raw HTML for diagram content
- Tracks column counter for new column IDs
- Includes timestamp for debugging

### Drag-and-Drop Flow

1. `handleDragStart()` - Sets `state.draggedBox`, adds `.dragging` class
2. `handleDragOver()` - Prevents default, adds `.dragging-over` class
3. `handleDragLeave()` - Removes `.dragging-over` class
4. `handleDrop()` - Moves box, calls `debouncedSave()`, cleanup
5. `handleDragEnd()` - Clears state, removes all drag classes

### Change Tracking Logic

- Compares current HTML with `defaultContent`
- Detects added, modified, and removed boxes
- Highlights differences with CSS classes
- Inline diff view for side-by-side comparison

## Best Practices for AI Assistants

### DO:

✅ Read files before modifying them
✅ Maintain existing code style and patterns
✅ Use the existing module structure
✅ Add JSDoc comments for new functions
✅ Test changes with `npm run dev`
✅ Keep commits focused and atomic
✅ Update documentation for user-facing changes
✅ Follow the cleanup patterns for temporary state
✅ Use debounced saves for data changes
✅ Maintain responsive design considerations

### DON'T:

❌ Add new frameworks or libraries without discussion
❌ Create new architectural patterns when existing ones work
❌ Skip reading the existing code
❌ Persist temporary CSS classes like `.dragging`
❌ Add unnecessary complexity
❌ Break the modular structure
❌ Bypass the auto-save mechanism
❌ Remove or modify cleanup functions
❌ Add inline styles when CSS classes exist
❌ Create documentation files without explicit request

## Security Considerations

1. **XSS Prevention:**
   - User content is stored as HTML in localStorage
   - Be cautious with innerHTML assignments
   - Current implementation trusts user input (single-user app)

2. **Data Validation:**
   - Validate JSON structure on import
   - Handle corrupt localStorage gracefully

3. **Browser Compatibility:**
   - Test localStorage availability
   - Handle quota exceeded errors

## Performance Considerations

1. **Debounced Saves:**
   - Prevent excessive localStorage writes
   - 1-second delay balances UX and performance

2. **DOM Manipulation:**
   - Minimize reflows and repaints
   - Batch DOM updates when possible

3. **Event Listeners:**
   - Clean up listeners when disabling features
   - Use event delegation for dynamic content when appropriate

## Testing Checklist

When making changes, verify:

- [ ] Auto-save works (check localStorage)
- [ ] Page reload preserves data
- [ ] Edit mode enables/disables correctly
- [ ] Drag-and-drop works smoothly
- [ ] Export functions (JSON, HTML, PNG) work
- [ ] Import restores data correctly
- [ ] Change highlighting works
- [ ] Original view comparison works
- [ ] Clear saved data resets to default
- [ ] No console errors
- [ ] Responsive design maintained
- [ ] Cleanup functions remove temporary classes

## Vite Configuration

```javascript
export default defineConfig({
  root: 'src',              // Source files in src/
  publicDir: '../public',   // Static assets
  build: {
    outDir: '../dist',      // Build output
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    open: true,             // Auto-open browser
  },
});
```

- Root is `src/` so index.html is directly accessible
- Public dir for static assets (currently empty)
- Build output to project root's `dist/`
- Dev server on port 3000 with auto-open

## Deployment

- **Platform:** GitHub Pages
- **Trigger:** Automatic on push to repository
- **URL:** `https://bec-hawk.github.io/toc/`
- **Build:** GitHub Actions handles build process
- **Branch:** Deploys from configured branch

## Future Considerations

From README.md roadmap:

- Undo/redo functionality
- Collaborative editing
- Templates for different theories of change
- Advanced export options (PDF, SVG)
- Search and filter functionality
- Keyboard shortcuts
- TypeScript migration
- Unit tests and E2E tests

**For AI Assistants:** If implementing future features, maintain the existing modular architecture and vanilla JavaScript approach unless there's a compelling reason to change.

## Quick Reference

### Key Files to Read First

1. `src/js/main.js` - Understand app initialization
2. `src/js/state.js` - See available state
3. `src/index.html` - Understand HTML structure
4. `README.md` - User-facing documentation

### Common File Patterns

```javascript
// Module structure
import { state } from './state.js';
import { debouncedSave } from './storage.js';

export function featureName() {
    // Implementation
    debouncedSave(); // Trigger save if data changed
}
```

### Running Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
./test-build.sh      # Quick build test
```

## Getting Help

- Review `README.md` for user-facing documentation
- Check existing modules for implementation patterns
- Look at git history for recent changes
- Test in browser DevTools for debugging

## Document Maintenance

This CLAUDE.md should be updated when:

- Major architectural changes occur
- New modules are added
- Development workflows change
- New deployment processes are introduced
- Significant features alter the app structure

**Last Updated:** 2025-11-22
**Version:** 1.0.0
**Maintained By:** AI assistants working on this codebase
