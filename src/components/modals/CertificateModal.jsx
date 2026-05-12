import { useRef, useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChallengeContext } from '../../context/ChallengeContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { t } from '../../utils/translations';
import certificateImgSrc from '../../assets/certificate.png';
import './CertificateModal.css';

export function CertificateModal({ isOpen, onClose }) {
    const {
        state,
        language,
        activeChallengeDef,
        availableChallenges,
        totalDays,
        isChallengeComplete,
        joinSpecificChallenge,
        selectChallenge,
        setCertificateName
    } = useChallengeContext();

    // Safety guard: never show the certificate unless the challenge is genuinely complete.
    // Allow test account to always see it for design testing.
    const isTestUser = state?.email === 'testkhoji@tgf.com';
    const safeIsOpen = isOpen && (isChallengeComplete || isTestUser);

    const navigate = useNavigate();
    const certRef = useRef(null);
    const [isSharing, setIsSharing] = useState(false);
    const [certImage, setCertImage] = useState(null); // Preloaded Image object

    // Local state to toggle between prompt and certificate view (for testing)
    const [isEditingName, setIsEditingName] = useState(!state.certificateName);

    // Local state for name entry
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    // Preload certificate image on mount so it's ready for Canvas export
    useEffect(() => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => setCertImage(img);
        img.onerror = () => console.warn('Failed to preload certificate image');
        img.src = certificateImgSrc;
    }, []);

    // Reset editing state when modal opens
    useEffect(() => {
        if (isOpen) {
            setIsEditingName(!state.certificateName || isTestUser);
        }
    }, [isOpen, state.certificateName, isTestUser]);

    const nextChallenges = useMemo(() => {
        return availableChallenges.filter(c => c.id !== activeChallengeDef?.id);
    }, [activeChallengeDef, availableChallenges]);

    const formatName = (str) => {
        if (!str) return '';
        const trimmed = str.trim();
        if (!trimmed) return '';
        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    };

    const handleGenerate = () => {
        const fName = formatName(firstName);
        const lName = formatName(lastName);
        const full = `${fName} ${lName}`.trim();
        
        if (fName.length === 0 || lName.length === 0) {
            // Basic validation: both fields required
            return;
        }
        
        setCertificateName(full);
    };

    const handleNextChallenge = (challengeId) => {
        const isJoined = !!state.challenges?.[challengeId];
        if (isJoined) {
            selectChallenge(challengeId);
        } else {
            joinSpecificChallenge(challengeId);
        }
        onClose();
        navigate('/dashboard');
    };

    const handleShare = async () => {
        if (isSharing) return;

        setIsSharing(true);
        const challengeName = activeChallengeDef?.title || t(language, 'certTitle');
        const text = language === 'hi'
            ? `🪷 मैंने तेज ज्ञान फाउंडेशन की "${challengeName}" चुनौती पूरी कर ली है!`
            : `🪷 I completed the Tej Gyan Foundation "${challengeName}"!`;

        try {
            // Ensure fonts are loaded before drawing to canvas
            try {
                if (document.fonts && document.fonts.load) {
                    await document.fonts.load('bold 16px Kelvinch');
                }
            } catch (fErr) {
                console.warn('Font loading failed, falling back to system fonts', fErr);
            }

            // Use the preloaded image; if not ready yet, load it now
            let img = certImage;
            if (!img) {
                img = await new Promise((resolve, reject) => {
                    const i = new Image();
                    i.crossOrigin = 'anonymous';
                    i.onload = () => resolve(i);
                    i.onerror = reject;
                    i.src = certificateImgSrc;
                });
            }

            // Draw certificate + name on Canvas (instant, no html-to-image needed)
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');

            // Draw the certificate background
            ctx.drawImage(img, 0, 0);

            // Draw the user's name — matches CSS: top 27%, centered
            const userName = state.certificateName || t(language, 'certDefaultName');
            const nameLen = userName.length;
            
            // DYNAMIC FONT SIZE: Scale down if name is long
            // Base size is 8% of width. We start scaling down after 18 characters.
            let sizeFactor = 0.08;
            if (nameLen > 18) {
                sizeFactor = 0.08 * (18 / nameLen);
                // Minimum size to keep it legible (roughly 4% of width)
                sizeFactor = Math.max(sizeFactor, 0.04);
            }
            
            const fontSize = Math.round(canvas.width * sizeFactor);
            ctx.font = `bold ${fontSize}px Kelvinch, "Playfair Display", Georgia, serif`;
            ctx.fillStyle = '#542539';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(userName, canvas.width / 2, canvas.height * 0.27);

            // Convert canvas to blob
            const blob = await new Promise((resolve) => {
                canvas.toBlob(resolve, 'image/png');
            });

            if (!blob) throw new Error("Could not generate image");

            const file = new File([blob], 'tgf-meditation-certificate.png', { type: 'image/png' });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'Meditation Certificate',
                    text: text,
                    files: [file],
                });
            } else {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'tgf-meditation-certificate.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                try {
                    await navigator.clipboard.writeText(text);
                    alert(t(language, 'certDownloaded'));
                } catch {
                    alert(t(language, 'certDownloadedNoText'));
                }
            }
        } catch (error) {
            // User cancelling the share dialog throws AbortError — not a real error
            if (error?.name === 'AbortError') return;
            console.error('Failed to share certificate:', error);
            alert(t(language, 'certError'));
        } finally {
            setIsSharing(false);
        }
    };

    if (!safeIsOpen) return null;

    // STEP 1: Enter Name (if not set OR if editing)
    if (isEditingName || (!state.certificateName && !isTestUser)) {
        return (
            <Modal isOpen={safeIsOpen} onClose={onClose} className="certificate-modal name-entry-modal">
                <div className="name-prompt-container">
                    <h3>{t(language, 'certNamePrompt')}</h3>
                    
                    <div className="cert-name-warning">
                        <p>⚠️ {t('en', 'certNameWarning')}</p>
                        <p style={{ marginTop: '8px', borderTop: '1px solid rgba(212, 175, 55, 0.2)', paddingTop: '8px' }}>
                            ⚠️ {t('hi', 'certNameWarning')}
                        </p>
                    </div>

                    <div className="name-fields">
                        <div className="field-group">
                            <label>{t(language, 'certFirstName')}</label>
                            <input 
                                type="text" 
                                value={firstName} 
                                onChange={(e) => setFirstName(e.target.value)} 
                                placeholder="e.g. John"
                                autoFocus
                            />
                        </div>
                        <div className="field-group">
                            <label>{t(language, 'certLastName')}</label>
                            <input 
                                type="text" 
                                value={lastName} 
                                onChange={(e) => setLastName(e.target.value)} 
                                placeholder="e.g. Doe"
                            />
                        </div>
                    </div>
                    <Button 
                        variant="primary" 
                        onClick={() => {
                            handleGenerate();
                            setIsEditingName(false);
                        }} 
                        className="full-width"
                        disabled={!firstName.trim() || !lastName.trim()}
                    >
                        {t(language, 'certNameSubmitBtn')}
                    </Button>
                </div>
            </Modal>
        );
    }

    // STEP 2: View Certificate
    return (
        <Modal isOpen={safeIsOpen} onClose={onClose} className="certificate-modal">
            <div className="certificate-wrapper" ref={certRef}>
                <div className="cert-image-container">
                    <img src={certificateImgSrc} alt="Certificate" className="cert-bg-image" />
                    <h3 
                        className="cert-dynamic-name"
                        style={{ 
                            fontSize: (state.certificateName?.length || 0) > 18 
                                ? `${8 * (18 / state.certificateName.length)}cqw` 
                                : '8cqw' 
                        }}
                    >
                        {state.certificateName}
                    </h3>
                </div>
            </div>

            <div className="cert-actions">
                <Button variant="primary" onClick={handleShare}>
                    {isSharing ? t(language, 'certGeneratingBtn') : t(language, 'certShareBtn')}
                </Button>
            </div>

            <div className="next-challenges-section">
                <h4>{t(language, 'nextJourneyTitle')}</h4>
                <div className="next-challenges-list">
                    {nextChallenges.map(challenge => (
                        <button
                            key={challenge.id}
                            className="next-challenge-item"
                            onClick={() => handleNextChallenge(challenge.id)}
                        >
                            <span className="next-item-icon">{challenge.icon}</span>
                            <div className="next-item-info">
                                <h6>{challenge.title}</h6>
                                <span>{challenge.totalDays} {t(language, 'days')}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="cert-footer-close">
                <Button variant="secondary" onClick={onClose} className="full-width">
                    {t(language, 'certCloseBtn')}
                </Button>
            </div>
        </Modal>
    );
}
