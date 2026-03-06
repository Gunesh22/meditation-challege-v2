// ===== useChallenge Hook =====
// localStorage (instant) → Firestore (async, 1 retry).

import { useState, useCallback, useMemo, useEffect } from 'react';
import { TOTAL_DAYS, INITIAL_STATE } from '../constants';
import { loadState, saveState, clearState } from '../utils/storage';
import { getTodayISO, getCurrentDay, getDateForDay } from '../utils/dateHelpers';
import * as firestore from '../services/firestore';

export function useChallenge() {
    const [state, setState] = useState(() => loadState());

    // Sync from Firestore on mount (if registered)
    useEffect(() => {
        if (!state.registered || !state.phone) return;
        let cancelled = false;

        (async () => {
            try {
                const remote = await firestore.getParticipant(state.phone);
                if (remote && !cancelled) {
                    const merged = {
                        ...state,
                        completedDays: { ...state.completedDays, ...remote.completedDays },
                        reflections: { ...state.reflections, ...remote.reflections },
                    };
                    setState(merged);
                    saveState(merged);
                }
            } catch (err) {
                console.warn('[Sync] Firestore sync failed:', err.message);
            }
        })();

        return () => { cancelled = true; };
    }, []); // once on mount

    // --- Derived values ---
    const currentDay = useMemo(() => getCurrentDay(state.startDate), [state.startDate]);
    const completedCount = useMemo(() => Object.keys(state.completedDays).length, [state.completedDays]);
    const isChallengeComplete = completedCount >= TOTAL_DAYS;

    // --- Persist to localStorage ---
    const persist = useCallback((nextState) => {
        setState(nextState);
        saveState(nextState);
    }, []);

    // --- Register ---
    const register = useCallback(async (name, email, phone) => {
        // 1. localStorage (instant)
        const next = {
            ...state,
            registered: true,
            name,
            email,
            phone,
            startDate: getTodayISO(),
        };
        persist(next);

        // 2. Firestore (async, 1 retry)
        firestore.registerParticipant({
            name,
            email,
            phone,
            startDate: getTodayISO(),
        });
    }, [state, persist]);

    // --- Complete a day ---
    const completeDay = useCallback(async (dayNum, feeling, thought) => {
        const dateForDay = getDateForDay(state.startDate, dayNum);
        if (!dateForDay) return;

        // 1. localStorage (instant)
        const next = {
            ...state,
            completedDays: { ...state.completedDays, [dateForDay]: true },
            reflections: { ...state.reflections, [dateForDay]: { feeling, thought } },
        };
        persist(next);

        // 2. Firestore (async, 1 retry)
        if (state.phone) {
            firestore.completeDay(state.phone, dateForDay, feeling, thought);
        }
    }, [state, persist]);

    // --- Reset ---
    const resetChallenge = useCallback(() => {
        clearState();
        setState({ ...INITIAL_STATE });
    }, []);

    // --- Check day ---
    const isDayCompleted = useCallback((dayNum) => {
        const dateForDay = getDateForDay(state.startDate, dayNum);
        return dateForDay ? !!state.completedDays[dateForDay] : false;
    }, [state.startDate, state.completedDays]);

    return {
        state,
        currentDay: Math.min(currentDay, TOTAL_DAYS),
        completedCount,
        isChallengeComplete,
        register,
        completeDay,
        resetChallenge,
        isDayCompleted,
    };
}
