// ===== AlreadyDoneModal =====
// Shown when user tries to mark meditation after already completing today.

import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export function AlreadyDoneModal({ isOpen, onClose }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="small-modal">
            <div className="modal-step">
                <div className="modal-icon">✨</div>
                <h3>You've already meditated today!</h3>
                <p>Rest now. Tomorrow brings a new moment of stillness.</p>
                <Button variant="primary" onClick={onClose}>
                    Okay
                </Button>
            </div>
        </Modal>
    );
}
