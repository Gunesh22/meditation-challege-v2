// ===== FloatingParticles =====
// Decorative floating particles for the welcome screen background.

import { useEffect, useRef } from 'react';
import './FloatingParticles.css';

export function FloatingParticles({ count = 20 }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = `${Math.random() * 100}%`;
            p.style.animationDuration = `${6 + Math.random() * 10}s`;
            p.style.animationDelay = `${Math.random() * 8}s`;
            const size = 2 + Math.random() * 3;
            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            container.appendChild(p);
        }

        return () => { container.innerHTML = ''; };
    }, [count]);

    return <div className="floating-particles" ref={containerRef} />;
}
