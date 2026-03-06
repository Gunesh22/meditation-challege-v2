// ===== Modal Component =====
// Reusable bottom-sheet style modal for mobile.

import { useEffect } from 'react';
import './Modal.css';

export function Modal({ isOpen, onClose, children, className = '' }) {
    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            className={`modal-overlay ${isOpen ? 'active' : ''}`}
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
        >
            <div className={`modal-card ${className}`}>
                {children}
            </div>
        </div>
    );
}
