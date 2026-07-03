import React from 'react';
import { NAV_ITEMS } from './constants';
import type { ForgeStatlets } from './LivingForgeLayout';

interface Props {
  activeNav: number;
  onNavChange: (index: number) => void;
  statlets?: ForgeStatlets;
}

const DEFAULT_STATLETS: ForgeStatlets = {
  activeArtisans: '7',
  workpieces: '18',
  successRate: '94%',
  hammerstrikes: '1,284'
};

export const LivingSidebar: React.FC<Props> = ({ activeNav, onNavChange, statlets = DEFAULT_STATLETS }) => (
  <aside className="panel sidebar" data-testid="forge-sidebar">
    <div className="brand">
      <div>
        <div className="seal">
          <b>⚒</b>
        </div>
        <h1>FORGE OS</h1>
        <p className="kicker">AI Worker Command</p>
      </div>
    </div>
    <nav className="nav">
      {NAV_ITEMS.map((item, index) => (
        <button
          key={`${item.id}-${item.label}`}
          type="button"
          className={index === activeNav ? 'active' : ''}
          onClick={() => onNavChange(index)}
        >
          <span>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
    <div className="panel mini">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span className="kicker">Forge State</span>
        <span className="pill" data-testid="forge-page-summary">
          ● LIVE
        </span>
      </div>
      <div className="mini-grid">
        <div className="radar" />
        <div>
          <p className="muted">
            Active Artisans <b style={{ float: 'right', color: 'white' }}>{statlets.activeArtisans}</b>
          </p>
          <p className="muted">
            Workpieces <b style={{ float: 'right', color: 'white' }}>{statlets.workpieces}</b>
          </p>
          <p className="muted">
            Success <b style={{ float: 'right', color: 'white' }}>{statlets.successRate}</b>
          </p>
        </div>
      </div>
    </div>
  </aside>
);

export default LivingSidebar;
