import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    description?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, description }) => {
    return (
        <div className={`glass-card rounded-2xl overflow-hidden transition-all duration-300 ${className}`}>
            {(title || description) && (
                <div className="px-8 py-5 border-b border-white/5 bg-white/[0.02]">
                    {title && <h3 className="text-xs font-display font-bold text-slate-400 uppercase tracking-[0.2em]">{title}</h3>}
                    {description && <p className="text-[11px] text-slate-500 mt-1.5 font-light tracking-wide">{description}</p>}
                </div>
            )}
            <div className="px-8 py-6">
                {children}
            </div>
        </div>
    );
};
