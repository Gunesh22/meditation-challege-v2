// ===== StreakBar =====
// Displays current streak with reset message when broken.

import { useChallengeContext } from '../../context/ChallengeContext';
import './StreakBar.css';

export function StreakBar() {
    const { streak } = useChallengeContext();

    return (
        <div className="streak-wrapper">
            <div className={`streak-bar ${streak.streakBroken ? 'streak-bar--lost' : ''}`}>
                <span className="streak-bar__icon">🔥</span>
                <span className="streak-bar__text">
                    Current Streak: <strong>{streak.streak}</strong> Days
                </span>
            </div>
            {streak.streakBroken && (
                <p className="streak-message">
                    Streak reset. But your awareness continues.
                </p>
            )}
        </div>
    );
}
