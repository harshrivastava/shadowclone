import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import CommandCenter from './components/CommandCenter';

function App() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    // Hardcoded profile for minimal version
    const userProfile = {
        name: 'User',
        tone: 'helpful'
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 flex flex-col ${isDarkMode ? 'bg-gray-950 text-gray-100' : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900'}`}>
            <header className={`border-b sticky top-0 z-10 backdrop-blur-sm transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'}`}>
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg"></div>
                        <div>
                            <h1 className="text-xl font-bold">ShadowAssistant</h1>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Minimal AI Assistant</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        {/* Theme Toggle */}
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`p-2 rounded-lg transition-all duration-300 ${isDarkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 border border-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'}`}
                            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 flex-1">
                <CommandCenter
                    userProfile={userProfile}
                    userAvatar={null}
                    themeColors={['#2563eb', '#7c3aed']}
                    isDarkMode={isDarkMode}
                />
            </main>

            <footer className={`border-t py-4 mt-auto transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'}`}>
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-center">
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                            ShadowAssistant • Minimal Voice/Text Mode
                        </p>
                        <span className="text-xs text-gray-400">v1.1.0-minimal</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
