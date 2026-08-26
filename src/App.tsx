/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CourseProvider, useCourse } from './context/CourseContext';
import { Navbar } from './components/Navbar';
import { BroadcastBanner } from './components/BroadcastBanner';
import { CourseSuspensionBanner } from './components/CourseSuspensionBanner';
import { PublicSharedView } from './components/views/PublicSharedView';
import { DiscenteView } from './components/views/DiscenteView';
import { TecnicoView } from './components/views/TecnicoView';
import { FacultyView } from './components/views/FacultyView';
import { DirettoreView } from './components/views/DirettoreView';
import { OspiteView } from './components/views/OspiteView';
import { ScenariCatalogView } from './components/views/ScenariCatalogView';
import { NightScenarioView } from './components/views/NightScenarioView';
import { ProtesiCatalogView } from './components/views/ProtesiCatalogView';
import { CoursePreStartCountdown } from './components/CoursePreStartCountdown';
import { ModuleCalloutBanner } from './components/ModuleCalloutBanner';
import { SimulationQuickFloatingBar } from './components/SimulationQuickFloatingBar';
import { Activity, ShieldCheck, HeartPulse } from 'lucide-react';

const CourseMainContent: React.FC = () => {
  const { userRole, setUserRole, discenti, setSelectedDiscenteId, isCourseStarted, setIsSimulationModalOpen } = useCourse();
  const [currentTab, setCurrentTab] = useState<string>('main');

  // Check URL parameters for instant QR Code direct navigation (?discente=disc-1 or ?badge=DISC-01)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const discenteParam = params.get('discente') || params.get('id');
      const badgeParam = params.get('badge') || params.get('qr');
      const roleParam = params.get('role');

      if (discenteParam) {
        const found = discenti.find(
          (d) => d.id === discenteParam || d.badgeCode?.toLowerCase() === discenteParam.toLowerCase()
        );
        if (found) {
          setSelectedDiscenteId(found.id);
          setUserRole('discente');
        }
      } else if (badgeParam) {
        const found = discenti.find(
          (d) => d.badgeCode?.toLowerCase() === badgeParam.toLowerCase()
        );
        if (found) {
          setSelectedDiscenteId(found.id);
          setUserRole('discente');
        }
      } else if (roleParam === 'discente') {
        setUserRole('discente');
      }
    }
  }, [discenti, setSelectedDiscenteId, setUserRole]);

  const renderActiveView = () => {
    // Before official start date/time: ONLY countdown screen for Discenti and Public
    const isPublicOrDiscente = userRole === 'public' || userRole === 'discente';
    if (!isCourseStarted && isPublicOrDiscente) {
      return <CoursePreStartCountdown />;
    }

    if (userRole === 'tecnico') {
      if (currentTab === 'catalog') {
        return <ScenariCatalogView onOpenProtesi={() => setCurrentTab('protesi')} />;
      }
      if (currentTab === 'protesi') {
        return <ProtesiCatalogView />;
      }
      if (currentTab === 'night') {
        return <NightScenarioView />;
      }
    }

    // Main Role-based View
    switch (userRole) {
      case 'discente':
        return <DiscenteView />;
      case 'tecnico':
        return <TecnicoView />;
      case 'faculty':
        return <FacultyView />;
      case 'direttore':
        return <DirettoreView />;
      case 'ospite':
        return <OspiteView />;
      case 'public':
      default:
        return <PublicSharedView />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-orange-500 selection:text-black">
      {/* Real-time Suspension Emergency Banner (Highest Priority) */}
      <CourseSuspensionBanner />

      {/* Real-time Broadcast Audio & Visual Banner */}
      <BroadcastBanner />

      {/* 15-Minute Pre-Module Operator Callout & Team Assembly Countdown Banner */}
      <ModuleCalloutBanner />

      {/* Main Simulation Navigation & Control Bar */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Dynamic Content Body - Fluid & Adaptive across Mobile, Tablet, and Desktop */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-4 md:px-6 lg:px-8 pt-3 sm:pt-6 pb-12 transition-all">
        {renderActiveView()}
      </main>

      {/* Floating Simulation Quick Bar when acceleration is active */}
      <SimulationQuickFloatingBar onOpenFullModal={() => setIsSimulationModalOpen(true)} />

      {/* Trauma Center Footer - Responsive on all screen sizes */}
      <footer className="border-t-4 border-neutral-900 bg-neutral-950 py-5 sm:py-6 text-xs text-neutral-500 mt-auto">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-orange-500 text-black flex items-center justify-center font-black">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-neutral-300 tracking-wider uppercase">
                TRAUMA SIM DIRECTOR
              </span>
              <span className="text-neutral-500 ml-2 font-mono">
                // ADVANCED TRAUMA MANAGEMENT DAY 02 & DAY 03
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-neutral-400 font-mono text-[11px]">
            <span className="font-bold text-neutral-300">60 DISCENTI • 12 SQUADRE • 4 GRUPPI</span>
            <span>|</span>
            <span className="text-orange-400 font-bold uppercase tracking-wider">REAL-TIME MULTI-SCREEN SYNC</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <CourseProvider>
      <CourseMainContent />
    </CourseProvider>
  );
}
