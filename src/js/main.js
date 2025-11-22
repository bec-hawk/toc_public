/**
 * Main entry point for the Theory of Change application
 */

import '../css/main.css';
import '../css/controls.css';
import '../css/diagram.css';
import '../css/modal.css';

import { loadData, clearStorage, saveData } from './storage.js';
import {
    editBox,
    deleteBox,
    moveBoxUp,
    moveBoxDown,
    moveSectionUp,
    moveSectionDown,
    closeModal,
    saveBoxEdit,
    addNewBox,
    addColumn,
    removeColumn,
    cleanupEmptyLabels,
    cleanupPlaceholderClasses
} from './editor.js';
import { downloadHTML, exportJSON, importJSON, downloadPNG } from './export.js';
import { toggleEditMode, toggleHighlightChanges, toggleViewOriginal } from './ui.js';

/**
 * Initialize the application
 */
function init() {
    // Load saved data or default content
    loadData();

    // Set up event listeners
    setupEventListeners();

    // Make functions globally available for onclick handlers in HTML
    window.editBox = editBox;
    window.deleteBox = deleteBox;
    window.moveBoxUp = moveBoxUp;
    window.moveBoxDown = moveBoxDown;
    window.moveSectionUp = moveSectionUp;
    window.moveSectionDown = moveSectionDown;
    window.closeModal = closeModal;
    window.addNewBox = addNewBox;
    window.removeColumn = removeColumn;

    // Clean up any empty labels and stray placeholder classes after a short delay
    setTimeout(() => {
        cleanupEmptyLabels();

        // Aggressively remove any remaining placeholder classes
        document.querySelectorAll('.placeholder-added').forEach(el => {
            el.classList.remove('placeholder-added');
        });

        // Clean up any stuck dragging classes
        document.querySelectorAll('.dragging').forEach(el => {
            el.classList.remove('dragging');
        });
        document.querySelectorAll('.dragging-over').forEach(el => {
            el.classList.remove('dragging-over');
        });

        cleanupPlaceholderClasses();
    }, 100);
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Edit mode toggle
    document.getElementById('toggleEdit').addEventListener('click', toggleEditMode);

    // Add column button
    document.getElementById('addColumn').addEventListener('click', addColumn);

    // Download HTML
    document.getElementById('downloadHTML').addEventListener('click', downloadHTML);

    // Download PNG
    document.getElementById('downloadPNG').addEventListener('click', downloadPNG);

    // Export JSON
    document.getElementById('exportJSON').addEventListener('click', exportJSON);

    // Import JSON
    document.getElementById('importButton').addEventListener('click', function() {
        document.getElementById('importFile').click();
    });

    document.getElementById('importFile').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            importJSON(file);
        }
        e.target.value = ''; // Reset file input
    });

    // Clear storage
    document.getElementById('clearStorage').addEventListener('click', clearStorage);

    // Highlight changes
    document.getElementById('highlightChanges').addEventListener('click', toggleHighlightChanges);

    // View original
    document.getElementById('viewOriginal').addEventListener('click', toggleViewOriginal);

    // Modal form submission
    document.getElementById('editForm').addEventListener('submit', saveBoxEdit);

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const editModal = document.getElementById('editModal');
        if (e.target === editModal) {
            closeModal();
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
