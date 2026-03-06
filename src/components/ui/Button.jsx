// ===== Button Component =====
// Reusable button with primary/secondary/ghost variants.

import './Button.css';

export function Button({
    variant = 'primary',
    icon,
    children,
    className = '',
    ...props
}) {
    return (
        <button
            className={`btn btn--${variant} ${className}`}
            {...props}
        >
            {icon && <span className="btn__icon">{icon}</span>}
            <span>{children}</span>
        </button>
    );
}
