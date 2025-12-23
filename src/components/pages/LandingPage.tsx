import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
            {/* HERO SKELETON */}
            <header className="max-w-4xl w-full text-center space-y-8 mb-20 animate-in fade-in duration-700">
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 bg-gray-900 rounded-xl rounded-tr-none shadow-lg"></div>
                </div>

                <h1 className="text-6xl font-black text-gray-900 tracking-tighter leading-none">
                    KRACHET
                </h1>

                <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                    [Hero Tagline Placeholder]
                </p>

                <div className="flex items-center justify-center gap-4">
                    <Link to="/workspace">
                        <Button size="lg" className="px-10 h-14 text-base font-bold tracking-tight">
                            Launch Workspace
                        </Button>
                    </Link>
                    <Button variant="outline" size="lg" className="px-10 h-14 text-base font-bold tracking-tight">
                        Read Docs
                    </Button>
                </div>
            </header>

            {/* FEATURES SKELETON */}
            <section className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 py-20 border-t border-gray-100">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-8 border border-gray-100 rounded-2xl bg-gray-50/50">
                        <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg mb-6 shadow-sm flex items-center justify-center">
                            <div className="w-4 h-4 bg-gray-300 rounded-sm"></div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Feature {i} Title</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            [Describe the value proposition of feature {i} here. Keep it professional and concise.]
                        </p>
                    </div>
                ))}
            </section>

            {/* FOOTER SKELETON */}
            <footer className="mt-auto py-8 text-[10px] font-black uppercase tracking-widest text-gray-300">
                © 2023 KRACHET • A ShadowClone AI Production
            </footer>
        </div>
    );
};
