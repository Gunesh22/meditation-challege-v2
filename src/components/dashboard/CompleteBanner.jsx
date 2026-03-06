// ===== CompleteBanner =====
// Shown when all 11 days are completed. Links to certificate.

import { useChallengeContext } from '../../context/ChallengeContext';
import './CompleteBanner.css';

export function CompleteBanner({ onViewCertificate }) {
    const { isChallengeComplete } = useChallengeContext();

    if (!isChallengeComplete) return null;

    return (
        <section className="challenge-complete-banner">
            <div className="complete-card">
                <span className="complete-card__icon">🏆</span>
                <h3>Challenge Complete!</h3>
                <p>You completed 11 days of mindful meditation. Your dedication is inspiring.</p>
                <button className="btn-view-cert" onClick={onViewCertificate}>
                    <span>🪷</span>
                    <span>View Certificate</span>
                </button>
            </div>
        </section>
    );
}
