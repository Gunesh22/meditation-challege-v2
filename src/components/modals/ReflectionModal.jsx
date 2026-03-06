// ===== ReflectionModal =====
// 3-step flow: Confirm → Reflect → Complete.
// Works with any day number (not just today).

import { useState, useCallback } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useChallengeContext } from '../../context/ChallengeContext';
import { FEELINGS, WISDOMS } from '../../constants';
import './ReflectionModal.css';

const STEPS = { CONFIRM: 'confirm', REFLECT: 'reflect', COMPLETE: 'complete' };

export function ReflectionModal({ isOpen, onClose, dayNum, onComplete }) {
    const { completeDay } = useChallengeContext();
    const [step, setStep] = useState(STEPS.CONFIRM);
    const [feeling, setFeeling] = useState('');
    const [thought, setThought] = useState('');

    const handleConfirmYes = useCallback(() => {
        setStep(STEPS.REFLECT);
    }, []);

    const handleSubmit = useCallback(() => {
        completeDay(dayNum, feeling || 'peaceful', thought.trim());
        setStep(STEPS.COMPLETE);
    }, [dayNum, feeling, thought, completeDay]);

    const handleDone = useCallback(() => {
        setStep(STEPS.CONFIRM);
        setFeeling('');
        setThought('');
        onClose();
        if (onComplete) onComplete();
    }, [onClose, onComplete]);

    const handleClose = useCallback(() => {
        setStep(STEPS.CONFIRM);
        setFeeling('');
        setThought('');
        onClose();
    }, [onClose]);

    const wisdom = WISDOMS[Math.min((dayNum || 1) - 1, WISDOMS.length - 1)];

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className="reflection-modal">
            <button className="modal-close" onClick={handleClose}>&times;</button>

            {/* Step 1: Confirm */}
            {step === STEPS.CONFIRM && (
                <div className="modal-step">
                    <div className="modal-icon">🌿</div>
                    <h3>Did you complete Day {dayNum}'s meditation?</h3>
                    <p>Be honest with yourself. Every moment of silence counts.</p>
                    <div className="confirm-buttons">
                        <Button variant="confirm" onClick={handleConfirmYes}>
                            Yes, I did
                        </Button>
                        <Button variant="danger" onClick={handleClose}>
                            Not yet
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 2: Reflect */}
            {step === STEPS.REFLECT && (
                <div className="modal-step">
                    <div className="modal-icon">💭</div>
                    <h3>How did it feel?</h3>
                    <div className="feeling-options">
                        {FEELINGS.map((f) => (
                            <label key={f.value} className="feeling-chip">
                                <input
                                    type="radio"
                                    name="feeling"
                                    value={f.value}
                                    checked={feeling === f.value}
                                    onChange={() => setFeeling(f.value)}
                                />
                                <span>{f.emoji} {f.label}</span>
                            </label>
                        ))}
                    </div>
                    <div className="thought-group">
                        <label htmlFor="thought-input">
                            Share a thought <span className="optional-tag">(optional)</span>
                        </label>
                        <textarea
                            id="thought-input"
                            placeholder="What came to mind during your practice..."
                            rows={3}
                            maxLength={280}
                            value={thought}
                            onChange={(e) => setThought(e.target.value)}
                        />
                    </div>
                    <Button variant="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </div>
            )}

            {/* Step 3: Complete */}
            {step === STEPS.COMPLETE && (
                <div className="modal-step">
                    <div className="completion-animation">
                        <svg className="checkmark-svg" viewBox="0 0 52 52">
                            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                        </svg>
                    </div>
                    <div className="modal-icon">🌿</div>
                    <h3>Beautiful.</h3>
                    <p className="completion-day">Day {dayNum} completed.</p>
                    <p className="completion-wisdom">{wisdom}</p>
                    <Button variant="primary" onClick={handleDone}>
                        Continue
                    </Button>
                </div>
            )}
        </Modal>
    );
}
