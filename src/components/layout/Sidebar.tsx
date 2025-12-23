import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, Workflow, History } from 'lucide-react';

export const Sidebar: React.FC = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Workspace', path: '/workspace' },
        { icon: FileText, label: 'MOM', path: '/mom' },
        { icon: Workflow, label: 'Workflows', path: '/workflows' },
        { icon: History, label: 'Activity', path: '/activity' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside className="w-64 border-r border-gray-200 bg-gray-50/50 flex flex-col h-full overflow-y-auto">
            <div className="p-6">
                <div className="flex items-center space-x-2 mb-8">
                    <div className="w-6 h-6 bg-gray-900 rounded rounded-tr-none"></div>
                    <span className="font-bold text-sm tracking-tight text-gray-900">KRACHET</span>
                </div>

                <nav className="space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                                ${isActive
                                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}
                            `}
                        >
                            <item.icon className="w-4 h-4" />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-gray-200 bg-white/50">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                        JD
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-900">John Doe</p>
                        <p className="text-[10px] text-gray-500">Free Plan</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};
