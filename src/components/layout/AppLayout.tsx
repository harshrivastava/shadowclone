import React from 'react';
import { Sidebar } from './Sidebar';
import { Bell, Search } from 'lucide-react';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden relative">
            {/* Background elements inherited from Landing (but more subtle) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 right-0 h-[400px] bg-aurora opacity-30"></div>
                <div className="absolute top-[5%] left-[10%] w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[100px]"></div>
            </div>

            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-background/50 backdrop-blur-md z-10 transition-all">
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
                                <span>Core</span>
                                <span className="mx-2 opacity-30">/</span>
                                <span className="text-slate-300">Workspace</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                            <div className="w-1 h-1 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">System Nominal</span>
                        </div>
                        <div className="h-6 w-[1px] bg-white/5 mx-1"></div>
                        <button className="p-2 text-slate-400 hover:text-white transition-colors group">
                            <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-white transition-colors relative group">
                            <Bell className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-violet-500 rounded-full border border-background shadow-[0_0_8px_rgba(124,58,237,0.5)]"></span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-transparent relative">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-40"></div>
                    <div className="relative h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
