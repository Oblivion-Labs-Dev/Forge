import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ id: string; label: string }>;
}

export const ForgedSelect: React.FC<SelectProps> = ({ options, ...props }) => {
  return (
    <select
      {...props}
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid rgba(255, 122, 24, 0.3)',
        borderRadius: '6px',
        color: '#fff',
        padding: '6px 12px',
        fontSize: '0.8rem',
        cursor: 'pointer',
        outline: 'none',
        boxShadow: '0 0 10px rgba(255, 122, 24, 0.05)',
        ...props.style
      }}
    >
      {options.map((opt) => (
        <option key={opt.id} value={opt.id} style={{ background: 'var(--bg-secondary)', color: '#fff' }}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};
export default ForgedSelect;
