import React from 'react';
import { Sidebar } from './Sidebar';
import { Bell, Search } from 'lucide-react';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    return (
        <div className="flex h-screen bg-white">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-14 border-b border-gray-200 flex items-center justify-between px-8 bg-white/80 backdrop-blur-sm z-10">
                    <div className="flex items-center space-x-4">
                        <div className="text-xs font-medium text-gray-500 flex items-center">
                            <span>Workspace</span>
                            <span className="mx-2 text-gray-300">/</span>
                            <span className="text-gray-900">General</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                            <Search className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors relative">
                            <Bell className="w-4 h-4" />
                            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-gray-50/30">
                    {children}
                </main>
            </div>
        </div>
    );
};
