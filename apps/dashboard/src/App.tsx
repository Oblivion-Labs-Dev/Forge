import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import ForgeShell from './components/forge-ui/ForgeShell';
import LivingForgeLayout from './components/forge-os/LivingForgeLayout';
import { pageTransition } from './components/forge-ui/motionPresets';
import DashboardPage, { useDashboardStatlets } from './pages/DashboardPage';
import PocDashboardPage from './pages/PocDashboardPage';
import TimelinePage from './pages/TimelinePage';
import ArsenalPage from './pages/ArsenalPage';
import ForgePage from './pages/ForgePage';
import RulesPage from './pages/RulesPage';
import SkillsPage from './pages/SkillsPage';
import ArtisansPage from './pages/ArtisansPage';
import ScriptsPage from './pages/ScriptsPage';
import CampaignHistoryPage from './pages/CampaignHistoryPage';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const statlets = useDashboardStatlets();

  const goToTimeline = () => setCurrentPage('timeline');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
      case 'metrics':
      case 'settings':
        return <DashboardPage onViewTimeline={goToTimeline} />;
      case 'dashboard-poc':
        return <PocDashboardPage />;
      case 'timeline':
      case 'archive':
        return <TimelinePage />;
      case 'arsenal':
        return <ArsenalPage />;
      case 'scripts':
        return <ScriptsPage />;
      case 'campaign-history':
        return <CampaignHistoryPage />;
      case 'forge':
        return <ForgePage />;
      case 'rules':
        return <RulesPage />;
      case 'skills':
        return <SkillsPage />;
      case 'artisans':
        return <ArtisansPage />;
      default:
        return <DashboardPage onViewTimeline={goToTimeline} />;
    }
  };

  const isDashboard = ['dashboard', 'metrics', 'settings'].includes(currentPage);

  return (
    <ForgeShell livingMode>
      <LivingForgeLayout
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        statlets={statlets}
        layout={isDashboard ? 'dashboard' : 'page'}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            className="forge-page-shell"
            initial={pageTransition.initial}
            animate={pageTransition.animate}
            exit={pageTransition.exit}
            transition={pageTransition.transition}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </LivingForgeLayout>
    </ForgeShell>
  );
}

export default App;
