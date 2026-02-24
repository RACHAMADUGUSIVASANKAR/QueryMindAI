import React from 'react';

export default function ToggleSwitch({ checked, onChange, label }) {
    return (
        <label className="toggle-wrapper">
            {label && <span className="toggle-label">{label}</span>}
            <div className={`toggle-track ${checked ? 'active' : ''}`} onClick={() => onChange(!checked)}>
                <div className="toggle-thumb" />
            </div>
            <style jsx>{`
        .toggle-wrapper {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          user-select: none;
        }
        .toggle-label {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--charcoal-50);
        }
        .toggle-track {
          width: 44px;
          height: 24px;
          background: rgba(47, 47, 51, 0.15);
          border-radius: 12px;
          position: relative;
          transition: background 0.3s ease;
          cursor: pointer;
        }
        .toggle-track.active {
          background: var(--accent);
        }
        .toggle-thumb {
          width: 18px;
          height: 18px;
          background: #fff;
          border-radius: 50%;
          position: absolute;
          top: 3px;
          left: 3px;
          transition: transform 0.3s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }
        .toggle-track.active .toggle-thumb {
          transform: translateX(20px);
        }
      `}</style>
        </label>
    );
}
