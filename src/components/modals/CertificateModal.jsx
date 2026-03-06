// ===== CertificateModal =====
// Shows a certificate after completing all 11 days.

import { useChallengeContext } from '../../context/ChallengeContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { formatDate } from '../../utils/dateHelpers';
import './CertificateModal.css';

export function CertificateModal({ isOpen, onClose }) {
    const { state } = useChallengeContext();

    const handleShare = async () => {
        const text = `🪷 I completed the TGF 11-Day Meditation Challenge!\n\n11 days of mindful practice. Grateful for this journey.\n\n#TGFMeditationChallenge #11DaysOfStillness`;

        if (navigator.share) {
            try {
                await navigator.share({ title: 'TGF Meditation Challenge — Certificate', text });
            } catch {
                // User cancelled share
            }
        } else {
            try {
                await navigator.clipboard.writeText(text);
                alert('Copied to clipboard!');
            } catch {
                // Fallback
            }
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="certificate-modal">
            <div className="certificate-wrapper">
                <div className="cert-border">
                    <div className="cert-content">
                        <div className="cert-lotus">🪷</div>
                        <p className="cert-pre">Certificate of Completion</p>
                        <h2 className="cert-title">11-Day Meditation Challenge</h2>
                        <div className="cert-divider" />
                        <p className="cert-awarded">Awarded to</p>
                        <h3 className="cert-name">{state.name || 'Meditator'}</h3>
                        <p className="cert-body">
                            For successfully completing 11 consecutive days of mindful meditation
                            practice as part of the TGF Meditation Challenge.
                        </p>
                        <div className="cert-divider" />
                        <p className="cert-date">{formatDate(new Date())}</p>
                        <p className="cert-org">TGF — The Growth Foundation</p>
                    </div>
                </div>
            </div>
            <div className="cert-actions">
                <Button variant="primary" onClick={handleShare}>
                    Share Certificate
                </Button>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </div>
        </Modal>
    );
}
