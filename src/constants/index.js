// ===== Challenge Constants =====

// Define the challenges (Admin Panel mockup)
export const AVAILABLE_CHALLENGES = [
    {
        id: '11_day_intro',
        title: '11-Day Meditation Challenge',
        totalDays: 11,
        icon: '🪷',
        description: 'Begin your journey with 11 days of basic mindfulness and finding inner peace.',
        availableFrom: '2026-03-01'
    },
    {
        id: '21_day_deep',
        title: '21-Day Deep Silence',
        totalDays: 21,
        icon: '🌌',
        description: 'Dive deeper into stillness and expand your awareness with this advanced practice.',
        availableFrom: '2026-03-05'
    },
    {
        id: '7_day_sleep',
        title: '7-Day Better Sleep',
        totalDays: 7,
        icon: '🌙',
        description: 'Evening meditations designed to prepare your mind and body for restful sleep.',
        availableFrom: '2026-03-15' // Upcoming
    }
];

export const TOTAL_DAYS = 11; // Retaining temporarily for backward compatibility if missed during migration
export const STORAGE_KEY = 'tgf_meditation_challenge';

export const FEELINGS = [
    { value: 'peaceful', emoji: '☮️', label: 'Peaceful' },
    { value: 'distracted', emoji: '🌀', label: 'Distracted' },
    { value: 'deep', emoji: '🌊', label: 'Deep' },
    { value: 'calm', emoji: '🍃', label: 'Calm' },
    { value: 'difficult', emoji: '🪨', label: 'Difficult but meaningful' },
];

export const WISDOMS = [
    "Everything is a Game of Beliefs – Understanding is the whole thing",
    "Self-stabilization is the highest achievement.",
    "True prayer is not asking for what you want, but understanding what is.",
    "Meditation is the art of being aware of your own beliefs.",
    "Silence is not the absence of sound, but the presence of understanding.",
    "Your outer world is a reflection of your inner belief system.",
    "Understanding is the only way to lasting peace.",
    "Be a witness to your thoughts, not a slave to them.",
    "Every moment is an opportunity to re-evaluate your beliefs.",
    "The truth is simple; our beliefs make it complicated.",
    "Understanding the Self is the ultimate goal of life.",
];

export const SESSION_TIMES = [
    { time: '7:00 AM', label: 'IST', hourStart: 5, hourEnd: 12 },
    { time: '2:30 PM', label: 'IST', hourStart: 12, hourEnd: 18 },
    { time: '8:00 PM', label: 'IST', hourStart: 18, hourEnd: 21 },
    { time: '10:00 PM', label: 'IST', hourStart: 21, hourEnd: 24 },
    { time: '2:30 AM', label: 'IST', hourStart: 0, hourEnd: 5 },
];

export const INITIAL_STATE = {
    registered: false,
    name: '',
    email: '',
    phone: '',
    language: 'en',

    // Multi-Challenge Progress
    activeChallengeId: null, // '11_day_intro'
    challenges: {}, // { '11_day_intro': { startDate, completedDays, reflections } }
};
