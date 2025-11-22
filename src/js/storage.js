/**
 * LocalStorage operations for persisting diagram data
 */

import { state, STORAGE_KEY } from './state.js';
import { defaultContent } from './data/defaultContent.js';
import { cleanupPlaceholderClasses } from './editor.js';

/**
 * Update save indicator UI
 */
export function updateSaveIndicator(text, success = true) {
    const indicator = document.getElementById('saveIndicator');
    const icon = document.getElementById('saveIcon');
    const textElem = document.getElementById('saveText');

    if (success) {
        indicator.classList.remove('saving');
        icon.textContent = '✓';
        textElem.textContent = text;
    } else {
        indicator.classList.add('saving');
        icon.textContent = '⟳';
        textElem.textContent = text;
    }
}

/**
 * Load saved data or default content on page load
 */
export function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const flowDiv = document.getElementById('flow');

    if (saved) {
        const data = JSON.parse(saved);
        flowDiv.innerHTML = data.html;
        state.columnCounter = data.columnCounter || 6;
        updateSaveIndicator('Loaded from browser', true);

        // Aggressively remove all placeholder classes from saved data
        document.querySelectorAll('.placeholder-added').forEach(el => {
            el.classList.remove('placeholder-added');
        });

        // Clean up any stuck dragging classes from saved data
        document.querySelectorAll('.dragging').forEach(el => {
            el.classList.remove('dragging');
        });
        document.querySelectorAll('.dragging-over').forEach(el => {
            el.classList.remove('dragging-over');
        });

        // Clean up any stray data attributes
        cleanupPlaceholderClasses();
    } else {
        flowDiv.innerHTML = defaultContent;
        saveData(); // Save default content
    }
}

/**
 * Save data to localStorage
 */
export function saveData() {
    // Clean up before saving to prevent persisting temporary classes
    cleanupPlaceholderClasses();

    // Clean up any stuck dragging classes
    document.querySelectorAll('.dragging').forEach(el => {
        el.classList.remove('dragging');
    });
    document.querySelectorAll('.dragging-over').forEach(el => {
        el.classList.remove('dragging-over');
    });

    const flowDiv = document.getElementById('flow');
    const data = {
        html: flowDiv.innerHTML,
        columnCounter: state.columnCounter,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    updateSaveIndicator('Auto-saved', true);
}

/**
 * Debounced save function
 */
let saveTimeout;
export function debouncedSave() {
    updateSaveIndicator('Saving...', false);
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        saveData();
    }, 1000);
}

/**
 * Clear saved data from localStorage
 */
export function clearStorage() {
    if (confirm('Are you sure you want to clear all saved data? This will reload the original diagram.')) {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    }
}
