import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, Workflow, History, Calendar, Layers, ChevronRight } from 'lucide-react';

export const Sidebar: React.FC = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Workspace', path: '/workspace' },
        { icon: Calendar, label: 'Schedules', path: '/scheduler' },
        { icon: FileText, label: 'MOM', path: '/mom' },
        { icon: Workflow, label: 'Workflows', path: '/workflows' },
        { icon: History, label: 'Activity', path: '/activity' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside className="w-64 border-r border-white/5 bg-background/50 backdrop-blur-xl flex flex-col h-full overflow-y-auto relative z-20 transition-all">
            <div className="p-8">
                <div className="flex items-center space-x-3 mb-10 group cursor-pointer">
                    <div className="relative w-8 h-8 flex items-center justify-center">
                        <div className="absolute inset-0 bg-violet-600/30 rounded-lg blur-sm group-hover:bg-violet-500/50 transition-all"></div>
                        <div className="relative w-full h-full bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center border border-white/10 shadow-lg">
                            <Layers className="text-white w-4 h-4" />
                        </div>
                    </div>
                    <span className="font-display font-bold text-lg tracking-tight text-white group-hover:text-violet-200 transition-colors">KRACHET</span>
                </div>

                <nav className="space-y-1.5">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group/nav
                                ${isActive
                                    ? 'bg-white/10 text-white border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.03)]'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}
                            `}
                        >
                            <div className="flex items-center space-x-3">
                                <item.icon className="w-4 h-4 transition-transform group-hover/nav:scale-110" />
                                <span>{item.label}</span>
                            </div>
                            <ChevronRight className="w-3 h-3 opacity-0 group-hover/nav:opacity-100 transition-opacity" />
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-white/5 bg-white/5 backdrop-blur-sm">
                <div className="flex items-center space-x-3 p-2 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-lg border border-white/10 overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                            JD
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background shadow-glow"></div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-white group-hover:text-violet-200 transition-colors">John Doe</p>
                        <div className="flex items-center space-x-1.5">
                            <span className="text-[9px] font-bold text-violet-400 uppercase tracking-tighter">Premium Agent</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};
