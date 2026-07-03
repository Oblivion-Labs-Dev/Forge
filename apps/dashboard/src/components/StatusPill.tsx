import React from 'react';

interface StatusPillProps {
  status: string;
}

const STATUS_CLASS: Record<string, string> = {
  active: 'status-pill-active',
  idle: 'status-pill-idle',
  success: 'status-pill-success',
  info: 'status-pill-info',
  warn: 'status-pill-warn',
  error: 'status-pill-error',
  compiled: 'status-pill-success',
  pending: 'status-pill-warn',
  failed: 'status-pill-error',
  stable: 'status-pill-success',
  beta: 'status-pill-info'
};

const STATUS_LABEL: Record<string, string> = {
  active: 'ACTIVE',
  idle: 'IDLE',
  success: 'SUCCESS',
  info: 'INFO',
  warn: 'WARN',
  error: 'ERROR'
};

export const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  const normalized = status.toLowerCase();
  const pillClass = STATUS_CLASS[normalized] ?? 'status-pill-default';
  const label = STATUS_LABEL[normalized] ?? status.toUpperCase();
  const showDot = normalized === 'active' || normalized === 'idle';

  return (
    <span className={`status-pill ${pillClass}`}>
      {showDot && <span className="status-pill-dot" />}
      {label}
    </span>
  );
};

export default StatusPill;
