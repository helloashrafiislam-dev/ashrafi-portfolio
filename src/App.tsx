import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WorkSection from './components/WorkSection';
import StackMarquee from './components/StackMarquee';
import RecordSection from './components/RecordSection';
import AboutSection from './components/AboutSection';
import ContactFooter from './components/ContactFooter';
import AgentBuildEngine from './components/AgentBuildEngine';

export default function App() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      <Navbar />
      <main>
        <Hero />
        <WorkSection />
        <StackMarquee />
        <RecordSection />
        <AboutSection />
      </main>
      <ContactFooter />
      <AgentBuildEngine />
    </div>
  );
}
