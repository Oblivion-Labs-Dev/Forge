import React from 'react';
import { motion } from 'framer-motion';
import {
  Archive,
  BarChart3,
  BookOpen,
  Flame,
  Hammer,
  LayoutDashboard,
  Plus,
  Settings,
  Shield,
  Target,
  Timer,
  Users,
  Zap
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const NAV_SECTIONS = [
  {
    label: 'Command',
    items: [
      { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
      { id: 'dashboard-poc', label: 'POC Dashboard', icon: Target },
      { id: 'timeline', label: 'Live Timeline', icon: Timer }
    ]
  },
  {
    label: 'Workshop',
    items: [
      { id: 'arsenal', label: 'Arsenal Inventory', icon: Shield },
      { id: 'forge', label: 'Forge Composer', icon: Hammer },
      { id: 'rules', label: 'Rule Compiler', icon: BookOpen }
    ]
  },
  {
    label: 'Guild',
    items: [
      { id: 'skills', label: 'Artisans Guild', icon: Users },
      { id: 'skills-matrix', label: 'Skills Matrix', icon: Zap },
      { id: 'archive', label: 'Memory Archive', icon: Archive }
    ]
  },
  {
    label: 'System',
    items: [
      { id: 'metrics', label: 'System Metrics', icon: BarChart3 },
      { id: 'settings', label: 'Settings', icon: Settings }
    ]
  }
];

export const ForgeSidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  return (
    <aside data-testid="forge-sidebar" className="forge-sidebar">
      <div className="forge-sidebar-brand">
        <div className="forge-sidebar-logo">
          <Flame size={18} strokeWidth={1.75} color="var(--accent-ember)" />
        </div>
        <div>
          <div className="forge-sidebar-title">Forge OS</div>
          <div className="forge-sidebar-tagline">AI worker orchestration</div>
        </div>
      </div>

      <div className="forge-sidebar-nav">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="forge-sidebar-section">
            <div className="forge-sidebar-section-label">{section.label}</div>
            {section.items.map((item) => {
              const isActive = currentPage === item.id;
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => onPageChange(item.id)}
                  className={`forge-sidebar-link ${isActive ? 'forge-sidebar-link-active' : ''}`}
                  whileHover={{ x: isActive ? 0 : 4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active-pill"
                      className="forge-sidebar-active-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="forge-sidebar-link-icon">
                    <Icon size={15} strokeWidth={1.75} />
                  </span>
                  <span>{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="forge-sidebar-footer">
        <div className="forge-sidebar-forge-card">
          <div className="forge-sidebar-forge-info">
            <span className="forge-sidebar-forge-icon">
              <Users size={13} strokeWidth={1.75} />
            </span>
            <div>
              <div className="forge-sidebar-forge-label">Current Forge</div>
              <div className="forge-sidebar-forge-name">Demo Forge</div>
            </div>
          </div>
          <div className="forge-sidebar-forge-meta">
            <Plus size={11} color="var(--accent-gold)" strokeWidth={2} />
            <span>v0.1.0</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ForgeSidebar;
