/**
 * Edit mode, drag & drop, and box manipulation functions
 */

import { state } from './state.js';
import { debouncedSave } from './storage.js';

/**
 * Enable edit mode
 */
export function enableEditMode() {
    // Make column headers editable
    document.querySelectorAll('.column-header').forEach(header => {
        header.contentEditable = true;
        header.addEventListener('blur', debouncedSave);
    });

    // Make stream labels editable
    document.querySelectorAll('.stream-label').forEach(label => {
        label.contentEditable = true;
        label.addEventListener('blur', debouncedSave);
    });

    // Ensure all boxes have control buttons
    document.querySelectorAll('.box').forEach(box => {
        // Check if box-controls already exist
        if (!box.querySelector('.box-controls')) {
            const controls = document.createElement('div');
            controls.className = 'box-controls';
            controls.innerHTML = `
                <button class="box-btn box-btn-up" onclick="window.moveBoxUp(this)">↑</button>
                <button class="box-btn box-btn-down" onclick="window.moveBoxDown(this)">↓</button>
                <button class="box-btn box-btn-edit" onclick="window.editBox(this)">✏️</button>
                <button class="box-btn box-btn-delete" onclick="window.deleteBox(this)">×</button>
            `;
            box.insertBefore(controls, box.firstChild);
        }

        box.draggable = true;
        box.addEventListener('dragstart', handleDragStart);
        box.addEventListener('dragend', handleDragEnd);
    });

    // Ensure all stream labels have control buttons
    document.querySelectorAll('.stream-label').forEach(label => {
        // Check if stream-label-controls already exist
        if (!label.querySelector('.stream-label-controls')) {
            const controls = document.createElement('div');
            controls.className = 'stream-label-controls';
            controls.innerHTML = `
                <button class="stream-btn" onclick="window.moveSectionUp(this)">↑</button>
                <button class="stream-btn" onclick="window.moveSectionDown(this)">↓</button>
            `;
            label.insertBefore(controls, label.firstChild);
        }
    });

    // Make columns drop targets
    document.querySelectorAll('.stream-container').forEach(container => {
        container.addEventListener('dragover', handleDragOver);
        container.addEventListener('drop', handleDrop);
        container.addEventListener('dragleave', handleDragLeave);
    });

    // Make deleted items container droppable for merging
    const deletedContainer = document.getElementById('deleted-items');
    if (deletedContainer) {
        deletedContainer.addEventListener('dragover', handleDragOver);
        deletedContainer.addEventListener('drop', handleDrop);
    }
}

/**
 * Disable edit mode
 */
export function disableEditMode() {
    // Make column headers non-editable
    document.querySelectorAll('.column-header').forEach(header => {
        header.contentEditable = false;
        header.removeEventListener('blur', debouncedSave);
    });

    // Make stream labels non-editable
    document.querySelectorAll('.stream-label').forEach(label => {
        label.contentEditable = false;
        label.removeEventListener('blur', debouncedSave);
    });

    // Make boxes non-draggable
    document.querySelectorAll('.box').forEach(box => {
        box.draggable = false;
        box.removeEventListener('dragstart', handleDragStart);
        box.removeEventListener('dragend', handleDragEnd);
    });

    // Remove drop targets
    document.querySelectorAll('.stream-container').forEach(container => {
        container.removeEventListener('dragover', handleDragOver);
        container.removeEventListener('drop', handleDrop);
        container.removeEventListener('dragleave', handleDragLeave);
    });

    // Clean up any stray placeholder classes
    cleanupPlaceholderClasses();

    // Clean up any stuck dragging classes
    document.querySelectorAll('.dragging').forEach(el => {
        el.classList.remove('dragging');
    });
    document.querySelectorAll('.dragging-over').forEach(el => {
        el.classList.remove('dragging-over');
    });
}

/**
 * Drag and drop handlers
 */
function handleDragStart(e) {
    state.draggedBox = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    document.querySelectorAll('.column').forEach(col => {
        col.classList.remove('dragging-over');
    });
    debouncedSave();
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    this.closest('.column').classList.add('dragging-over');
    return false;
}

function handleDragLeave(e) {
    this.closest('.column').classList.remove('dragging-over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    const column = this.closest('.column');
    if (column) {
        column.classList.remove('dragging-over');
    }

    if (state.draggedBox) {
        // Remove any highlight classes when dragging from deleted section
        state.draggedBox.classList.remove('highlight-removed');

        // Find the add box zone in this container
        const addZone = this.querySelector('.add-box-zone');
        if (addZone) {
            this.insertBefore(state.draggedBox, addZone);
        } else {
            this.appendChild(state.draggedBox);
        }

        debouncedSave();
    }

    return false;
}

/**
 * Box merging handlers
 */
function handleBoxDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'copy';
    this.style.outline = '3px solid #3498db';
    return false;
}

function handleBoxDragLeave(e) {
    this.style.outline = '';
}

function handleBoxMerge(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    e.preventDefault();

    this.style.outline = '';

    if (state.draggedBox && state.draggedBox !== this) {
        // Check if dragging a placeholder-added box onto a deleted box
        if (state.draggedBox.classList.contains('placeholder-added') && this.classList.contains('highlight-removed')) {
            // Merge: replace the added box's content with deleted box's content
            const deletedTitle = this.querySelector('.box-title').innerHTML;
            const deletedContent = this.querySelector('.box-content').innerHTML;

            state.draggedBox.querySelector('.box-title').innerHTML = deletedTitle;
            state.draggedBox.querySelector('.box-content').innerHTML = deletedContent;
            state.draggedBox.classList.remove('placeholder-added');

            // Remove this deleted box from the removed section
            this.remove();

            // Clean up the deleted items container if empty
            const deletedContainer = document.getElementById('deleted-items');
            if (deletedContainer && deletedContainer.querySelectorAll('.box').length === 0) {
                deletedContainer.remove();
            }

            debouncedSave();
        }
    }

    return false;
}

/**
 * Edit box
 */
export function editBox(btn) {
    const box = btn.closest('.box');
    state.currentEditingBox = box;

    const title = box.querySelector('.box-title').textContent;
    const content = box.querySelector('.box-content').innerHTML;

    document.getElementById('boxTitle').value = title;
    document.getElementById('boxContent').value = content;

    document.getElementById('editModal').style.display = 'block';
}

/**
 * Delete box
 */
export function deleteBox(btn) {
    if (confirm('Are you sure you want to delete this box?')) {
        btn.closest('.box').remove();
        debouncedSave();
    }
}

/**
 * Move box up
 */
export function moveBoxUp(btn) {
    const box = btn.closest('.box');
    const prevElement = box.previousElementSibling;

    // Skip over add-box-zones and stream-labels to find previous box
    let prevBox = prevElement;
    while (prevBox && !prevBox.classList.contains('box')) {
        prevBox = prevBox.previousElementSibling;
    }

    if (prevBox) {
        box.parentNode.insertBefore(box, prevBox);
        debouncedSave();
    }
}

/**
 * Move box down
 */
export function moveBoxDown(btn) {
    const box = btn.closest('.box');
    let nextElement = box.nextElementSibling;

    // Skip over add-box-zones and stream-labels to find next box
    while (nextElement && !nextElement.classList.contains('box')) {
        nextElement = nextElement.nextElementSibling;
    }

    if (nextElement) {
        box.parentNode.insertBefore(nextElement, box);
        debouncedSave();
    }
}

/**
 * Move section up
 */
export function moveSectionUp(btn) {
    const streamLabel = btn.closest('.stream-label');
    const container = streamLabel.parentNode;

    // Find all elements in this section (until next stream-label or end)
    const sectionElements = [streamLabel];
    let nextEl = streamLabel.nextElementSibling;
    while (nextEl && !nextEl.classList.contains('stream-label')) {
        sectionElements.push(nextEl);
        nextEl = nextEl.nextElementSibling;
    }

    // Find the previous stream-label
    let prevStreamLabel = streamLabel.previousElementSibling;
    while (prevStreamLabel && !prevStreamLabel.classList.contains('stream-label')) {
        prevStreamLabel = prevStreamLabel.previousElementSibling;
    }

    if (prevStreamLabel) {
        // Insert all section elements before the previous stream-label
        // Insert in reverse order to maintain correct sequence
        for (let i = sectionElements.length - 1; i >= 0; i--) {
            container.insertBefore(sectionElements[i], prevStreamLabel);
        }

        debouncedSave();
    }
}

/**
 * Move section down
 */
export function moveSectionDown(btn) {
    const streamLabel = btn.closest('.stream-label');
    const container = streamLabel.parentNode;

    // Find all elements in this section (until next stream-label or end)
    const sectionElements = [streamLabel];
    let nextEl = streamLabel.nextElementSibling;
    while (nextEl && !nextEl.classList.contains('stream-label')) {
        sectionElements.push(nextEl);
        nextEl = nextEl.nextElementSibling;
    }

    // Find the next stream-label
    let nextStreamLabel = nextEl;

    if (nextStreamLabel) {
        // Find all elements in the next section
        let afterNextSection = nextStreamLabel.nextElementSibling;
        while (afterNextSection && !afterNextSection.classList.contains('stream-label')) {
            afterNextSection = afterNextSection.nextElementSibling;
        }

        // Insert current section after the next section
        if (afterNextSection) {
            // Insert in reverse order to maintain correct sequence
            for (let i = sectionElements.length - 1; i >= 0; i--) {
                container.insertBefore(sectionElements[i], afterNextSection);
            }
        } else {
            // If no section after, append to end (forward order is correct for appendChild)
            sectionElements.forEach(el => {
                container.appendChild(el);
            });
        }

        debouncedSave();
    }
}

/**
 * Close modal
 */
export function closeModal() {
    document.getElementById('editModal').style.display = 'none';
    state.currentEditingBox = null;
}

/**
 * Save box edit
 */
export function saveBoxEdit(e) {
    e.preventDefault();

    if (state.currentEditingBox) {
        const title = document.getElementById('boxTitle').value;
        const content = document.getElementById('boxContent').value;

        state.currentEditingBox.querySelector('.box-title').textContent = title;
        state.currentEditingBox.querySelector('.box-content').innerHTML = content;
        debouncedSave();
    }

    closeModal();
}

/**
 * Add new box
 */
export function addNewBox(addZone) {
    const newBox = document.createElement('div');
    newBox.className = 'box';
    newBox.draggable = state.editMode;
    if (state.editMode) {
        newBox.addEventListener('dragstart', handleDragStart);
        newBox.addEventListener('dragend', handleDragEnd);
    }

    newBox.innerHTML = `
        <div class="box-controls">
            <button class="box-btn box-btn-up" onclick="window.moveBoxUp(this)">↑</button>
            <button class="box-btn box-btn-down" onclick="window.moveBoxDown(this)">↓</button>
            <button class="box-btn box-btn-edit" onclick="window.editBox(this)">✏️</button>
            <button class="box-btn box-btn-delete" onclick="window.deleteBox(this)">×</button>
        </div>
        <div class="box-title">New Box</div>
        <div class="box-content">
            Click the edit button to add content
        </div>
    `;

    addZone.parentElement.insertBefore(newBox, addZone);
    debouncedSave();
}

/**
 * Add new column
 */
export function addColumn() {
    state.columnCounter++;
    const newColumn = document.createElement('div');
    newColumn.className = 'column';
    newColumn.setAttribute('data-column-id', 'col-' + state.columnCounter);
    newColumn.style.background = '#f0f0f0';

    newColumn.innerHTML = `
        <div class="column-header" contenteditable="${state.editMode}">New Column</div>
        <div class="column-controls">
            <button class="btn btn-remove" onclick="window.removeColumn(this)">Remove Column</button>
        </div>
        <div class="stream-container">
            <div class="add-box-zone" onclick="window.addNewBox(this)">+ Add Box</div>
        </div>
    `;

    // Add drag and drop listeners if in edit mode
    if (state.editMode) {
        const container = newColumn.querySelector('.stream-container');
        container.addEventListener('dragover', handleDragOver);
        container.addEventListener('drop', handleDrop);
        container.addEventListener('dragleave', handleDragLeave);

        const header = newColumn.querySelector('.column-header');
        header.addEventListener('blur', debouncedSave);
    }

    document.getElementById('flow').appendChild(newColumn);
    // Save immediately for column operations to prevent data loss
    setTimeout(() => import('./storage.js').then(m => m.saveData()), 100);
}

/**
 * Remove column
 */
export function removeColumn(btn) {
    if (confirm('Are you sure you want to remove this entire column?')) {
        btn.closest('.column').remove();
        // Save immediately for column operations to prevent data loss
        setTimeout(() => import('./storage.js').then(m => m.saveData()), 100);
    }
}

/**
 * Clean up stray placeholder classes
 */
export function cleanupPlaceholderClasses() {
    // Remove any placeholder-added classes that shouldn't be there
    document.querySelectorAll('.placeholder-added').forEach(el => {
        // Only remove if we're not in "viewing original" mode
        if (!state.viewingOriginal) {
            el.classList.remove('placeholder-added');
            delete el.dataset.wasPlaceholder;
        }
    });

    // Clean up any leftover data attributes
    document.querySelectorAll('.box, .stream-label').forEach(el => {
        if (!state.viewingOriginal) {
            delete el.dataset.currentTitleHTML;
            delete el.dataset.currentContentHTML;
            delete el.dataset.currentText;
            delete el.dataset.wasPlaceholder;
        }
    });
}

/**
 * Clean up empty stream labels
 */
export function cleanupEmptyLabels() {
    document.querySelectorAll('.stream-label').forEach(label => {
        const clone = label.cloneNode(true);
        const controls = clone.querySelector('.stream-label-controls');
        if (controls) controls.remove();
        const text = clone.textContent.trim();

        if (!text || text.length === 0) {
            // Remove empty label and any add-box-zone that immediately follows
            const next = label.nextElementSibling;
            label.remove();
            if (next && next.classList.contains('add-box-zone')) {
                next.remove();
            }
        }
    });
}

// Export handlers for use in HTML onclick attributes
export const dragDropHandlers = {
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleBoxDragOver,
    handleBoxDragLeave,
    handleBoxMerge
};
