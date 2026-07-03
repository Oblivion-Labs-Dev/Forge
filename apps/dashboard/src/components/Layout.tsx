import React, { useEffect, useState } from 'react';
import { client } from '../lib/forge-client';
import type { HammerStrikeEvent } from '../lib/forge-client/types';

interface LayoutProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentPage, onPageChange, children }) => {
  const [recentStrike, setRecentStrike] = useState<HammerStrikeEvent | null>(null);

  useEffect(() => {
    const unsubscribe = client.subscribeToHammerStrikes((event) => {
      setRecentStrike(event);
      setTimeout(() => setRecentStrike(null), 3000);
    });
    return unsubscribe;
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: '🔥' },
    { id: 'dashboard-poc', label: 'POC Dashboard', icon: '🎯' },
    { id: 'timeline', label: 'Live Timeline', icon: '⏱️' },
    { id: 'arsenal', label: 'Arsenal Inventory', icon: '🛡️' },
    { id: 'forge', label: 'Forge Composer', icon: '🛠️' },
    { id: 'rules', label: 'Rule Compiler', icon: '📜' },
    { id: 'skills', label: 'Skills Gallery', icon: '⚡' },
    { id: 'artisans', label: 'Artisans Guild', icon: '👥' }
  ];

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div>
          <div className="brand-title glow-text-gold">FORGE OS</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            OPERATING SYSTEM FOR AI WORKERS
          </p>
        </div>
        <nav>
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                  onClick={() => onPageChange(item.id)}
                >
                  <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-glass)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 8px #10b981'
              }}
            ></span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Live Mock Connection</span>
          </div>
        </div>
      </aside>
      
      <main className="main-content">
        {recentStrike && (
          <div
            className="glass-panel"
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 1000,
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              borderColor: 'rgba(212, 175, 55, 0.4)',
              boxShadow: '0 4px 20px rgba(212, 175, 55, 0.15)',
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>🔨</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>HammerStrike Event</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {recentStrike.summary}
              </div>
            </div>
          </div>
        )}
        {children}
      </main>
    </div>
  );
};
export default Layout;
