// ===== Date Helpers =====
// Pure functions for all date calculations related to the challenge.

/**
 * Returns today's date as ISO string (YYYY-MM-DD) in local timezone.
 */
export function getTodayISO() {
    return new Date().toISOString().split('T')[0];
}

/**
 * Given a start date and a day number (1-indexed),
 * returns the ISO date string for that day.
 */
export function getDateForDay(startDate, dayNum) {
    if (!startDate) return null;
    const start = new Date(startDate + 'T00:00:00');
    const target = new Date(start);
    target.setDate(target.getDate() + (dayNum - 1));
    return target.toISOString().split('T')[0];
}

/**
 * Given a start date, returns the current day number (1-indexed).
 * Day 1 = the start date itself.
 */
export function getCurrentDay(startDate) {
    if (!startDate) return 1;
    const start = new Date(startDate + 'T00:00:00');
    const today = new Date(getTodayISO() + 'T00:00:00');
    const diffMs = today - start;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diffDays + 1;
}

/**
 * Given a start date and a target date ISO, returns the day index (1-indexed).
 */
export function getDayIndexForDate(startDate, dateISO) {
    if (!startDate) return '?';
    const start = new Date(startDate + 'T00:00:00');
    const target = new Date(dateISO + 'T00:00:00');
    const diff = Math.floor((target - start) / (1000 * 60 * 60 * 24));
    return diff + 1;
}

/**
 * Formats a Date object as a human-readable string.
 */
export function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
