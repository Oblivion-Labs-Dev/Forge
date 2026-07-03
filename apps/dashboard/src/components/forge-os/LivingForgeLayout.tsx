import React, { useEffect } from 'react';
import { NAV_ITEMS, navIndexForPage } from './constants';
import LivingSidebar from './LivingSidebar';
import SparkLayer from './SparkLayer';
import { useForgeSparks } from './useForgeSparks';
import { LivingForgeProvider } from './LivingForgeContext';

export interface ForgeStatlets {
  activeArtisans: string;
  workpieces: string;
  successRate: string;
  hammerstrikes: string;
}

interface Props {
  currentPage: string;
  onPageChange: (pageId: string) => void;
  statlets?: ForgeStatlets;
  children: React.ReactNode;
  layout?: 'dashboard' | 'page';
}

export const LivingForgeLayout: React.FC<Props> = ({
  currentPage,
  onPageChange,
  statlets,
  children,
  layout = 'page'
}) => {
  const sparks = useForgeSparks();

  useEffect(() => {
    document.documentElement.classList.add('forge-living');
    return () => {
      document.documentElement.classList.remove('forge-living');
    };
  }, []);

  const activeNav = navIndexForPage(currentPage);
  const appClass =
    layout === 'dashboard' ? 'living-app living-app-dashboard' : 'living-app living-app-page';

  return (
    <LivingForgeProvider value={sparks}>
      <SparkLayer particles={sparks.particles} toasts={sparks.toasts} />
      <div className={appClass}>
        <LivingSidebar
          activeNav={activeNav}
          onNavChange={(index) => onPageChange(NAV_ITEMS[index]?.id ?? 'dashboard')}
          statlets={statlets}
        />
        {layout === 'dashboard' ? children : <div className="living-main-slot">{children}</div>}
      </div>
    </LivingForgeProvider>
  );
};

export default LivingForgeLayout;
