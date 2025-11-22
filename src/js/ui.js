/**
 * UI interactions, event handlers, and change highlighting
 */

import { state } from './state.js';
import { saveData } from './storage.js';
import { enableEditMode, disableEditMode, dragDropHandlers } from './editor.js';
import { defaultContent } from './data/defaultContent.js';

/**
 * Toggle edit mode
 */
export function toggleEditMode() {
    state.editMode = !state.editMode;
    const btn = document.getElementById('toggleEdit');
    const statusText = document.getElementById('editStatus');
    const addColumnBtn = document.getElementById('addColumn');
    const container = document.querySelector('.diagram');

    if (state.editMode) {
        btn.textContent = 'Disable Edit Mode';
        btn.classList.remove('inactive');
        btn.classList.add('active');
        statusText.textContent = 'Editing';
        addColumnBtn.style.display = 'block';
        container.classList.add('edit-mode');
        enableEditMode();
    } else {
        btn.textContent = 'Enable Edit Mode';
        btn.classList.remove('active');
        btn.classList.add('inactive');
        statusText.textContent = 'Viewing';
        addColumnBtn.style.display = 'none';
        container.classList.remove('edit-mode');
        disableEditMode();
        saveData(); // Save when exiting edit mode
    }
}

/**
 * Highlight changes functionality
 */
export function toggleHighlightChanges() {
    state.highlightingChanges = !state.highlightingChanges;
    const btn = document.getElementById('highlightChanges');

    if (state.highlightingChanges) {
        btn.classList.add('active');
        btn.textContent = '🔍 Hide Highlights';
        applyChangeHighlights();
    } else {
        btn.classList.remove('active');
        btn.textContent = '🔍 Highlight Changes';
        clearChangeHighlights();
    }
}

/**
 * View original functionality - inline diff view
 */
export function toggleViewOriginal() {
    state.viewingOriginal = !state.viewingOriginal;
    const btn = document.getElementById('viewOriginal');

    if (state.viewingOriginal) {
        btn.classList.add('active');
        btn.textContent = '👁️ View Current';
        showOriginalInline();
    } else {
        btn.classList.remove('active');
        btn.textContent = '👁️ View Original';
        restoreCurrentInline();
    }
}

/**
 * Show original content inline
 */
function showOriginalInline() {
    const originalContainer = document.createElement('div');
    originalContainer.innerHTML = defaultContent;

    const normalizeText = (text) => text.replace(/\s+/g, ' ').trim();
    const getLabelText = (label) => {
        const clone = label.cloneNode(true);
        const controls = clone.querySelector('.stream-label-controls');
        if (controls) controls.remove();
        return normalizeText(clone.textContent);
    };

    // Build maps of original content
    const originalBoxMap = new Map();
    originalContainer.querySelectorAll('.box').forEach(box => {
        const title = normalizeText(box.querySelector('.box-title')?.textContent || '');
        const titleHTML = box.querySelector('.box-title')?.innerHTML || '';
        const contentHTML = box.querySelector('.box-content')?.innerHTML || '';
        if (title) {
            originalBoxMap.set(title, { titleHTML, contentHTML });
        }
    });

    const originalLabelMap = new Map();
    originalContainer.querySelectorAll('.stream-label').forEach(label => {
        const text = getLabelText(label);
        if (text) {
            originalLabelMap.set(text, text);
        }
    });

    // Process current boxes
    document.querySelectorAll('.box').forEach(box => {
        const title = normalizeText(box.querySelector('.box-title')?.textContent || '');

        if (title && originalBoxMap.has(title)) {
            // Box existed in original - show original content
            const original = originalBoxMap.get(title);
            box.dataset.currentTitleHTML = box.querySelector('.box-title').innerHTML;
            box.dataset.currentContentHTML = box.querySelector('.box-content').innerHTML;
            box.querySelector('.box-title').innerHTML = original.titleHTML;
            box.querySelector('.box-content').innerHTML = original.contentHTML;
            originalBoxMap.delete(title); // Mark as found
        } else {
            // Box is new - show as placeholder
            box.classList.add('placeholder-added');
            box.dataset.wasPlaceholder = 'true';
        }
    });

    // Process current labels
    document.querySelectorAll('.stream-label').forEach(label => {
        const text = getLabelText(label);
        const textNode = Array.from(label.childNodes).find(node => node.nodeType === Node.TEXT_NODE);

        if (text && !originalLabelMap.has(text)) {
            // Label is new - show as placeholder
            label.classList.add('placeholder-added');
            label.dataset.wasPlaceholder = 'true';
        } else if (textNode) {
            // Store current text
            label.dataset.currentText = textNode.textContent.trim();
        }
    });

    // Handle removed boxes - add them at the bottom of each column
    if (originalBoxMap.size > 0) {
        const flowDiv = document.getElementById('flow');
        const deletedContainer = document.createElement('div');
        deletedContainer.className = 'deleted-items-container';
        deletedContainer.id = 'deleted-items';
        deletedContainer.innerHTML = '<h4>Removed from Original:</h4>';

        originalBoxMap.forEach((original, title) => {
            const deletedBox = document.createElement('div');
            deletedBox.className = 'box highlight-removed';
            deletedBox.draggable = true; // Always draggable when viewing original
            deletedBox.innerHTML = `
                <div class="box-controls">
                    <button class="box-btn box-btn-up" onclick="window.moveBoxUp(this)">↑</button>
                    <button class="box-btn box-btn-down" onclick="window.moveBoxDown(this)">↓</button>
                    <button class="box-btn box-btn-edit" onclick="window.editBox(this)">✏️</button>
                    <button class="box-btn box-btn-delete" onclick="window.deleteBox(this)">×</button>
                </div>
                <div class="box-title">${original.titleHTML}</div>
                <div class="box-content">${original.contentHTML}</div>
            `;

            // Make deleted boxes both draggable (to move back) and drop targets (for merging)
            deletedBox.addEventListener('dragstart', dragDropHandlers.handleDragStart);
            deletedBox.addEventListener('dragend', dragDropHandlers.handleDragEnd);
            deletedBox.addEventListener('dragover', dragDropHandlers.handleBoxDragOver);
            deletedBox.addEventListener('dragleave', dragDropHandlers.handleBoxDragLeave);
            deletedBox.addEventListener('drop', dragDropHandlers.handleBoxMerge);

            deletedContainer.appendChild(deletedBox);
        });

        flowDiv.appendChild(deletedContainer);
    }

    // Handle removed labels by checking what's in original but not current
    const currentLabels = Array.from(document.querySelectorAll('.stream-label')).map(l => getLabelText(l));
    const removedLabels = Array.from(originalContainer.querySelectorAll('.stream-label'))
        .map(l => getLabelText(l))
        .filter(text => text && !currentLabels.includes(text));

    if (removedLabels.length > 0) {
        let deletedContainer = document.getElementById('deleted-items');
        if (!deletedContainer) {
            deletedContainer = document.createElement('div');
            deletedContainer.className = 'deleted-items-container';
            deletedContainer.id = 'deleted-items';
            deletedContainer.innerHTML = '<h4>Removed from Original:</h4>';
            document.getElementById('flow').appendChild(deletedContainer);
        }

        removedLabels.forEach(labelText => {
            const deletedLabel = document.createElement('div');
            deletedLabel.className = 'stream-label highlight-removed';
            deletedLabel.textContent = labelText;
            deletedContainer.appendChild(deletedLabel);
        });
    }
}

/**
 * Restore current content from viewing original
 */
function restoreCurrentInline() {
    // First, aggressively remove ALL placeholder-added classes
    document.querySelectorAll('.placeholder-added').forEach(el => {
        el.classList.remove('placeholder-added');
    });

    // Restore boxes
    document.querySelectorAll('.box').forEach(box => {
        if (box.dataset.wasPlaceholder === 'true') {
            delete box.dataset.wasPlaceholder;
        } else if (box.dataset.currentTitleHTML) {
            box.querySelector('.box-title').innerHTML = box.dataset.currentTitleHTML;
            box.querySelector('.box-content').innerHTML = box.dataset.currentContentHTML;
            delete box.dataset.currentTitleHTML;
            delete box.dataset.currentContentHTML;
        }
    });

    // Restore labels
    document.querySelectorAll('.stream-label').forEach(label => {
        if (label.dataset.wasPlaceholder === 'true') {
            delete label.dataset.wasPlaceholder;
        } else if (label.dataset.currentText) {
            const textNode = Array.from(label.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
            if (textNode) {
                textNode.textContent = label.dataset.currentText;
            }
            delete label.dataset.currentText;
        }
    });

    // Remove deleted items container
    const deletedContainer = document.getElementById('deleted-items');
    if (deletedContainer) {
        deletedContainer.remove();
    }

    // Final cleanup to ensure everything is clean
    import('./editor.js').then(m => m.cleanupPlaceholderClasses());
}

/**
 * Apply change highlights
 */
function applyChangeHighlights() {
    clearChangeHighlights();

    const originalContainer = document.createElement('div');
    const currentContainer = document.createElement('div');

    originalContainer.innerHTML = defaultContent;
    currentContainer.innerHTML = document.getElementById('flow').innerHTML;

    // Helper function to normalize text for comparison
    const normalizeText = (text) => {
        return text.replace(/\s+/g, ' ').trim();
    };

    // Helper function to get stream label text (excluding controls)
    const getLabelText = (label) => {
        const clone = label.cloneNode(true);
        // Remove the controls div
        const controls = clone.querySelector('.stream-label-controls');
        if (controls) {
            controls.remove();
        }
        return normalizeText(clone.textContent);
    };

    // Helper function to get box content HTML (for accurate comparison)
    const getBoxContentHTML = (box) => {
        const content = box.querySelector('.box-content');
        return content ? normalizeText(content.innerHTML) : '';
    };

    // Map original boxes by title for comparison
    const originalBoxMap = new Map();
    originalContainer.querySelectorAll('.box').forEach(box => {
        const title = normalizeText(box.querySelector('.box-title')?.textContent || '');
        const content = getBoxContentHTML(box);
        if (title) {
            originalBoxMap.set(title, content);
        }
    });

    // Highlight boxes
    document.querySelectorAll('.box').forEach(box => {
        const title = normalizeText(box.querySelector('.box-title')?.textContent || '');
        const content = getBoxContentHTML(box);

        if (title) {
            if (!originalBoxMap.has(title)) {
                // New box
                box.classList.add('highlight-added');
            } else if (originalBoxMap.get(title) !== content) {
                // Modified box
                box.classList.add('highlight-modified');
            }
        }
    });

    // Map original stream labels
    const originalLabels = Array.from(originalContainer.querySelectorAll('.stream-label'))
        .map(l => getLabelText(l));

    // Highlight stream labels
    document.querySelectorAll('.stream-label').forEach(label => {
        const text = getLabelText(label);
        if (!originalLabels.includes(text)) {
            label.classList.add('highlight-added');
        }
    });
}

/**
 * Clear change highlights
 */
function clearChangeHighlights() {
    document.querySelectorAll('.highlight-added, .highlight-modified, .highlight-removed').forEach(el => {
        el.classList.remove('highlight-added', 'highlight-modified', 'highlight-removed');
    });
}
