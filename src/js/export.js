/**
 * Export/Import functionality for diagrams
 */

import { state } from './state.js';
import { updateSaveIndicator } from './storage.js';
import { cleanupPlaceholderClasses } from './editor.js';
import * as htmlToImage from 'html-to-image';

/**
 * Download current page as HTML file
 */
export function downloadHTML() {
    const htmlContent = document.documentElement.outerHTML;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `theory-of-change-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    updateSaveIndicator('Downloaded!', true);
    setTimeout(() => updateSaveIndicator('Auto-saved', true), 2000);
}

/**
 * Export diagram as JSON
 */
export function exportJSON() {
    // Clean up before exporting to prevent persisting temporary classes
    cleanupPlaceholderClasses();

    // Clean up any stuck dragging classes
    document.querySelectorAll('.dragging').forEach(el => {
        el.classList.remove('dragging');
    });
    document.querySelectorAll('.dragging-over').forEach(el => {
        el.classList.remove('dragging-over');
    });

    const data = {
        html: document.getElementById('flow').innerHTML,
        columnCounter: state.columnCounter,
        timestamp: new Date().toISOString(),
        version: '1.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `theory-of-change-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    updateSaveIndicator('Exported!', true);
    setTimeout(() => updateSaveIndicator('Auto-saved', true), 2000);
}

/**
 * Import diagram from JSON file
 */
export function importJSON(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const data = JSON.parse(event.target.result);
            document.getElementById('flow').innerHTML = data.html;
            state.columnCounter = data.columnCounter || 6;

            // Aggressively remove all placeholder classes from imported data
            document.querySelectorAll('.placeholder-added').forEach(el => {
                el.classList.remove('placeholder-added');
            });

            // Clean up any stuck dragging classes from imported data
            document.querySelectorAll('.dragging').forEach(el => {
                el.classList.remove('dragging');
            });
            document.querySelectorAll('.dragging-over').forEach(el => {
                el.classList.remove('dragging-over');
            });

            // Clean up any stray data attributes
            cleanupPlaceholderClasses();

            // Save and update indicator
            import('./storage.js').then(m => {
                m.saveData();
                updateSaveIndicator('Imported!', true);
                setTimeout(() => updateSaveIndicator('Auto-saved', true), 2000);
            });

            // Reattach event listeners if in edit mode
            if (state.editMode) {
                import('./editor.js').then(m => {
                    m.disableEditMode();
                    setTimeout(() => m.enableEditMode(), 100);
                });
            }
        } catch (error) {
            alert('Error importing file: ' + error.message);
        }
    };
    reader.readAsText(file);
}

/**
 * Download diagram as PNG
 */
export async function downloadPNG() {
    const btn = document.getElementById('downloadPNG');
    const originalText = btn.textContent;

    try {
        // Disable button and show loading state
        btn.disabled = true;
        btn.textContent = '⏳ Generating PNG...';
        updateSaveIndicator('Generating image...', false);

        // Wait a bit for UI to update
        await new Promise(resolve => setTimeout(resolve, 100));

        // Get the flow container
        const flowElement = document.getElementById('flow');

        // Use html-to-image to capture the element as PNG blob
        const blob = await htmlToImage.toBlob(flowElement, {
            quality: 1.0,
            pixelRatio: 2, // Higher quality (2x resolution)
            backgroundColor: '#ffffff',
            cacheBust: true,
            width: flowElement.scrollWidth,
            height: flowElement.scrollHeight
        });

        // Download the blob
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `theory-of-change-${new Date().toISOString().split('T')[0]}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Re-enable button
        btn.disabled = false;
        btn.textContent = originalText;
        updateSaveIndicator('PNG Downloaded!', true);
        setTimeout(() => updateSaveIndicator('Auto-saved', true), 2000);

    } catch (error) {
        console.error('Error generating PNG:', error);
        alert('Error generating PNG image. Please try again.');
        btn.disabled = false;
        btn.textContent = originalText;
        updateSaveIndicator('Error generating PNG', true);
        setTimeout(() => updateSaveIndicator('Auto-saved', true), 2000);
    }
}
