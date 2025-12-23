import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    description?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, description }) => {
    return (
        <div className={`bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden ${className}`}>
            {(title || description) && (
                <div className="px-6 py-4 border-b border-gray-100">
                    {title && <h3 className="text-sm font-semibold text-gray-900">{title}</h3>}
                    {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
                </div>
            )}
            <div className="px-6 py-4">
                {children}
            </div>
        </div>
    );
};
