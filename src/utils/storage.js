// ===== LocalStorage Abstraction =====

import { STORAGE_KEY, INITIAL_STATE } from '../constants';

/**
 * Loads challenge state from localStorage.
 * Returns INITIAL_STATE if nothing stored or parse fails.
 */
export function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            // Ensure all required fields exist (migration safety)
            return {
                ...INITIAL_STATE,
                ...parsed,
                completedDays: parsed.completedDays || {},
                reflections: parsed.reflections || {},
            };
        }
    } catch (e) {
        console.warn('[Storage] Failed to load state:', e);
    }
    return { ...INITIAL_STATE };
}

/**
 * Persists challenge state to localStorage.
 */
export function saveState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.warn('[Storage] Failed to save state:', e);
    }
}

/**
 * Clears all challenge data from localStorage.
 */
export function clearState() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.warn('[Storage] Failed to clear state:', e);
    }
}
