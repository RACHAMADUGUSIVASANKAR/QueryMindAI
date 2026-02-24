import React from 'react';

export default function Input({ value, onChange, placeholder, icon, className = '', type = 'text', multiline = false, rows = 3, ...props }) {
    const Component = multiline ? 'textarea' : 'input';

    return (
        <div className={`input-wrapper ${className}`}>
            {icon && <span className="input-icon">{icon}</span>}
            <Component
                className={`glass-input ${icon ? 'has-icon' : ''}`}
                type={!multiline ? type : undefined}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={multiline ? rows : undefined}
                {...props}
            />
            <style jsx>{`
        .input-wrapper {
          position: relative;
          width: 100%;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(47, 47, 51, 0.4);
          display: flex;
          align-items: center;
          z-index: 1;
          pointer-events: none;
        }
        .has-icon {
          padding-left: 42px;
        }
        textarea.glass-input {
          resize: vertical;
          min-height: 80px;
        }
      `}</style>
        </div>
    );
}
