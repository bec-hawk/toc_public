/**
 * Global application state
 */

export const state = {
    editMode: false,
    currentEditingBox: null,
    draggedBox: null,
    columnCounter: 6,
    highlightingChanges: false,
    viewingOriginal: false,
    savedContent: null, // Store current content when viewing original
};

export const STORAGE_KEY = 'theory_of_change_data';
