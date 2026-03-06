// ===== Community Count Generator =====
// Simulates community meditation counts based on time of day.

/**
 * Generates a simulated community count for the welcome screen.
 */
export function generateWelcomeCount() {
    const base = 1800 + Math.floor(Math.random() * 800);
    return base;
}

/**
 * Generates a simulated "people meditated today" count
 * that varies by time of day for realism.
 */
export function generateDailyCount() {
    const hour = new Date().getHours();
    let base;

    if (hour >= 6 && hour < 10) base = 2400;
    else if (hour >= 10 && hour < 14) base = 1800;
    else if (hour >= 14 && hour < 18) base = 1500;
    else if (hour >= 18 && hour < 22) base = 3200;
    else base = 800;

    const offset = Math.floor(Math.random() * 400) - 200;
    return base + offset;
}
