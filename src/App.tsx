import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import CommandCenter from './components/CommandCenter';
import { MOMPage } from './components/pages/MOMPage';
import { LandingPage } from './components/pages/LandingPage';

// Mock views for future pages
const PlaceholderPage = ({ title }: { title: string }) => (
    <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
        <div className="bg-white border border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center text-gray-500">
            <p>This page is currently under development.</p>
        </div>
    </div>
);

function App() {
    // Hardcoded profile for minimal version
    const userProfile = {
        name: 'User',
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
                                <CommandCenter
                                    userProfile={userProfile}
                                    userAvatar={null}
                                    themeColors={['#000000', '#4b5563']}
                                />
                            </div>
                        } />
                        <Route path="/mom" element={<MOMPage />} />
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
