// ===== TodayCard =====
// Main action card. Shows the selected day's status and "I Meditated" button.

import { useChallengeContext } from '../../context/ChallengeContext';
import './TodayCard.css';

export function TodayCard({ selectedDay, onMeditateClick }) {
    const { isDayCompleted, isChallengeComplete } = useChallengeContext();

    const dayCompleted = isDayCompleted(selectedDay);

    let heading, subtext, btnText, btnIcon, btnClass;

    if (isChallengeComplete) {
        heading = "You've completed the challenge! 🎉";
        subtext = "All 11 days of mindful practice. Beautiful.";
        btnText = "Challenge Complete";
        btnIcon = "🏆";
        btnClass = "btn-meditate completed";
    } else if (dayCompleted) {
        heading = `Day ${selectedDay} — Practice complete ✨`;
        subtext = "This day is done. Select another day or rest.";
        btnText = "Already Completed";
        btnIcon = "✓";
        btnClass = "btn-meditate completed";
    } else {
        heading = `Day ${selectedDay} — Ready to meditate`;
        subtext = "Take a moment. Close your eyes. Begin.";
        btnText = "I Meditated Today";
        btnIcon = "✦";
        btnClass = "btn-meditate";
    }

    return (
        <section className="main-action-section">
            <div className="today-card">
                <div className="today-card__inner">
                    <div className="today-card__status">
                        <div className={`breath-circle ${dayCompleted || isChallengeComplete ? 'breath-circle--still' : ''}`}>
                            <div className="breath-circle__inner">
                                <span className="breath-circle__icon">🧘</span>
                            </div>
                        </div>
                        <h3>{heading}</h3>
                        <p>{subtext}</p>
                    </div>
                    <button className={btnClass} onClick={onMeditateClick}>
                        <span className="btn-meditate__icon">{btnIcon}</span>
                        <span>{btnText}</span>
                    </button>
                </div>
            </div>
        </section>
    );
}
