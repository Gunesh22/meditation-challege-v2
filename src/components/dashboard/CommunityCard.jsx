// ===== CommunityCard =====
// Shows real community count from Firestore participant data.

import { useState, useEffect } from 'react';
import { countMeditatedToday, getTotalParticipants } from '../../services/firestore';
import { getTodayISO } from '../../utils/dateHelpers';
import './CommunityCard.css';

export function CommunityCard() {
    const [todayCount, setTodayCount] = useState(0);
    const [totalParticipants, setTotalParticipants] = useState(0);

    useEffect(() => {
        let cancelled = false;

        async function fetchCounts() {
            try {
                const [daily, total] = await Promise.all([
                    countMeditatedToday(getTodayISO()),
                    getTotalParticipants(),
                ]);
                if (!cancelled) {
                    setTodayCount(daily);
                    setTotalParticipants(total);
                }
            } catch {
                // Silently fail — shows 0
            }
        }

        fetchCounts();
        const interval = setInterval(fetchCounts, 30000);
        return () => { cancelled = true; clearInterval(interval); };
    }, []);

    return (
        <section className="community-section">
            <div className="community-card">
                <div className="community-card__glow" />
                <span className="community-card__leaf">🌿</span>
                <p className="community-card__number">{todayCount.toLocaleString()}</p>
                <p className="community-card__label">people meditated today</p>
                <p className="community-card__message">
                    You are part of this collective stillness.
                </p>
                {totalParticipants > 0 && (
                    <p className="community-card__total">
                        {totalParticipants.toLocaleString()} seekers have joined the challenge
                    </p>
                )}
            </div>
        </section>
    );
}
