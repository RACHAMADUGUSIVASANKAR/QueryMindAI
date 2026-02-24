import React from 'react';

export default function Button({ children, variant = 'default', size = 'md', className = '', ...props }) {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const glassClass = variant === 'primary' ? 'glass-button glass-button-primary' : 'glass-button';

  return (
    <button className={`${glassClass} ${sizeClass} ${className}`} {...props}>
      {children}
      <style jsx>{`
        .btn-sm { padding: 8px 18px; font-size: 0.82rem; }
        .btn-lg { padding: 14px 32px; font-size: 1rem; }
      `}</style>
    </button>
  );
}
