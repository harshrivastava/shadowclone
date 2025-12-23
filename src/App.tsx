import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import CommandCenter from './components/CommandCenter';
import { MOMPage } from './components/pages/MOMPage';
import { LandingPage } from './components/pages/LandingPage';
import { SchedulerPage } from './components/pages/SchedulerPage';

// Mock views for future pages
const PlaceholderPage = ({ title }: { title: string }) => (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] p-12 animate-in fade-in duration-1000">
        <div className="glass-card max-w-lg w-full rounded-[2.5rem] p-16 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"></div>

            <div className="relative mb-10">
                <div className="absolute inset-0 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="relative w-24 h-24 bg-white/[0.02] border border-white/10 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-700">
                    <div className="w-12 h-12 rounded-xl bg-violet-600/20 flex items-center justify-center">
                        <div className="w-3 h-3 bg-violet-500 rounded-full animate-ping"></div>
                    </div>
                </div>
            </div>

            <h1 className="text-3xl font-display font-bold text-gradient-metallic tracking-tight mb-4">{title}</h1>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8">
                <span className="text-[9px] font-display font-bold text-violet-400 uppercase tracking-[0.2em]">Module Status: In-Development</span>
            </div>

            <p className="text-sm text-slate-500 font-light leading-relaxed max-w-[280px] mx-auto mb-10">
                This synaptic node is currently undergoing neural calibration. Protocol activation expected soon.
            </p>

            <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500/30 w-1/3 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

function App() {
    // Hardcoded profile for minimal version
    const userProfile = {
        name: 'Operator',
        tone: 'professional'
    };

    return (
        <Routes>
            {/* Landing page is top-level (no sidebar/header) */}
            <Route path="/" element={<LandingPage />} />

            {/* Application pages are wrapped in AppLayout */}
            <Route path="/*" element={
                <AppLayout>
                    <Routes>
                        <Route path="/workspace" element={
                            <div className="p-0 h-full">
                                <CommandCenter userProfile={userProfile} />
                            </div>
                        } />
                        <Route path="/mom" element={<MOMPage />} />
                        <Route path="/scheduler" element={<SchedulerPage />} />
                        <Route path="/workflows" element={<PlaceholderPage title="Workflows" />} />
                        <Route path="/activity" element={<PlaceholderPage title="Activity History" />} />
                        <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
                    </Routes>
                </AppLayout>
            } />
        </Routes>
    );
}

export default App;
