// ===== ReflectionsList =====
// Shows past meditation reflections.

import { useMemo } from 'react';
import { useChallengeContext } from '../../context/ChallengeContext';
import { getDayIndexForDate } from '../../utils/dateHelpers';
import { FEELINGS } from '../../constants';
import './ReflectionsList.css';

export function ReflectionsList() {
    const { state } = useChallengeContext();

    const entries = useMemo(() => {
        return Object.entries(state.reflections)
            .sort(([a], [b]) => b.localeCompare(a));
    }, [state.reflections]);

    if (entries.length === 0) return null;

    const feelingLabel = (value) => {
        const f = FEELINGS.find((f) => f.value === value);
        return f ? `${f.emoji} ${f.label}` : value;
    };

    return (
        <section className="reflections-section">
            <div className="section-header">
                <h3>Your Reflections</h3>
            </div>
            <div className="reflections-list">
                {entries.map(([date, data]) => {
                    const dayIdx = getDayIndexForDate(state.startDate, date);
                    return (
                        <div key={date} className="reflection-item">
                            <div className="reflection-item__header">
                                <span className="reflection-item__day">Day {dayIdx}</span>
                                <span className="reflection-item__feeling">
                                    {feelingLabel(data.feeling)}
                                </span>
                            </div>
                            {data.thought && (
                                <p className="reflection-item__thought">"{data.thought}"</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
