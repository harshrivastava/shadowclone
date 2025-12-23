import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    Zap,
    ChevronRight,
    BookOpen,
    Layers,
    Shield,
    Cpu,
    BrainCircuit,
    ArrowRight,
    Lock,
    Search,
    Sparkles,
    Code,
    Terminal
} from 'lucide-react';
import { Button } from '../ui/Button';

export const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen font-body selection:bg-violet-500/30 selection:text-white overflow-x-hidden bg-background text-foreground">
            {/* Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 right-0 h-[800px] bg-aurora opacity-60"></div>
                <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[128px] animate-pulse-slow"></div>
                <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black_70%,transparent_100%)]"></div>
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/5 bg-[#030014]/70 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <div className="absolute inset-0 bg-violet-600/30 rounded-xl blur-md group-hover:bg-violet-500/50 transition-all"></div>
                            <div className="relative w-full h-full bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center border border-white/10 shadow-lg">
                                <Layers className="text-white w-5 h-5" />
                            </div>
                        </div>
                        <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-violet-200 transition-colors">KRACHET</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                        <a className="hover:text-white transition-colors py-2" href="#features">Features</a>
                        <a className="hover:text-white transition-colors py-2" href="#tech">Technology</a>
                        <a className="hover:text-white transition-colors py-2" href="#docs">Docs</a>
                        <a className="hover:text-white transition-colors py-2" href="#pricing">Pricing</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                            <Search className="w-5 h-5" />
                        </button>
                        <button className="px-5 py-2.5 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm">
                            Sign In
                        </button>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 flex flex-col items-center pt-32 pb-20 px-6">
                <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center mt-12 md:mt-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 animate-fade-in-up">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                        </span>
                        <span className="text-xs font-medium text-violet-200 tracking-wide uppercase">System V2.0 Online</span>
                    </div>

                    <h1 className="font-display font-bold text-6xl md:text-8xl tracking-tight leading-[1.1] mb-8 relative">
                        <span className="text-gradient-metallic drop-shadow-2xl">Your AI Executive</span>
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-300 to-indigo-400 opacity-90">Assistant.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl font-light leading-relaxed mb-12">
                        KRACHET orchestrates your workflow with intelligent automation, voice interaction, and neural-powered decision making.
                        Experience <span className="text-white font-medium">seamless productivity</span>.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto items-center justify-center">
                        <Link to="/workspace">
                            <button className="group relative px-8 py-4 bg-white text-black font-display font-bold tracking-wide rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)]">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    Launch Workspace
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </Link>
                        <button className="group px-8 py-4 bg-transparent border border-white/20 text-white font-display font-medium tracking-wide rounded-full hover:bg-white/5 hover:border-white/40 transition-all backdrop-blur-md flex items-center gap-2 text-sm">
                            <BookOpen className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                            Documentation
                        </button>
                    </div>
                </div>

                {/* Dashboard Visualization */}
                <div className="relative w-full max-w-6xl mt-24 mb-12 group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-3xl blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
                    <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl bg-[#0a0a12]/80 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl">
                        <div className="h-10 border-b border-white/5 flex items-center px-4 gap-2 bg-white/5">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                            </div>
                            <div className="mx-auto text-xs text-slate-500 font-mono flex items-center gap-2">
                                <Lock className="w-3.5 h-3.5" />
                                krachet_core_v2.tsx
                            </div>
                        </div>

                        <div className="p-8 grid grid-cols-12 gap-6 h-full font-mono text-xs md:text-sm text-slate-400/80">
                            <div className="col-span-3 border-r border-white/5 pr-6 hidden md:block space-y-4">
                                <div className="h-2 w-20 bg-white/10 rounded mb-6"></div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-violet-400 bg-violet-500/10 p-2 rounded border border-violet-500/20">
                                        <Layers className="w-3.5 h-3.5" /> Neural_Net
                                    </div>
                                    <div className="flex items-center gap-2 p-2 rounded hover:bg-white/5 cursor-pointer transition-colors">
                                        <Cpu className="w-3.5 h-3.5" /> Memory_Bank
                                    </div>
                                    <div className="flex items-center gap-2 p-2 rounded hover:bg-white/5 cursor-pointer transition-colors">
                                        <Shield className="w-3.5 h-3.5" /> Encryption
                                    </div>
                                    <div className="flex items-center gap-2 p-2 rounded hover:bg-white/5 cursor-pointer transition-colors">
                                        <Zap className="w-3.5 h-3.5" /> API_Gateway
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-12 md:col-span-9 space-y-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="h-8 w-48 bg-white/5 rounded border border-white/5 flex items-center px-3 text-slate-500 text-[10px]">
                                        $ init_sequence --force
                                    </div>
                                    <div className="h-4 w-4 bg-green-500/20 rounded-full flex items-center justify-center animate-pulse">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="h-32 bg-white/5 border border-white/5 rounded-xl p-4 relative overflow-hidden group/card transition-all hover:bg-white/10">
                                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                                        <div className="w-8 h-8 rounded bg-violet-500/20 mb-3 flex items-center justify-center"><Zap className="w-4 h-4 text-violet-400" /></div>
                                        <div className="text-white text-sm mb-1">Latency</div>
                                        <div className="text-xs text-slate-500 font-mono">12ms <span className="text-green-500 ml-1">↓ 2%</span></div>
                                    </div>
                                    <div className="h-32 bg-white/5 border border-white/5 rounded-xl p-4 relative overflow-hidden group/card transition-all hover:bg-white/10">
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                                        <div className="w-8 h-8 rounded bg-cyan-500/20 mb-3 flex items-center justify-center"><Layers className="w-4 h-4 text-cyan-400" /></div>
                                        <div className="text-white text-sm mb-1">Sync Status</div>
                                        <div className="text-xs text-slate-500 font-mono">Active</div>
                                    </div>
                                    <div className="h-32 bg-white/5 border border-white/5 rounded-xl p-4 relative overflow-hidden group/card transition-all hover:bg-white/10">
                                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                                        <div className="w-8 h-8 rounded bg-pink-500/20 mb-3 flex items-center justify-center"><Shield className="w-4 h-4 text-pink-400" /></div>
                                        <div className="text-white text-sm mb-1">Security</div>
                                        <div className="text-xs text-slate-500 font-mono">Encrypted</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-24 w-full">
                    <div className="glass-card p-8 rounded-2xl group relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none">
                            <BrainCircuit className="w-24 h-24 text-violet-500/20 -rotate-12 translate-x-12 -translate-y-12" />
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                            <BrainCircuit className="text-violet-300 w-6 h-6" />
                        </div>
                        <h3 className="font-display font-semibold text-xl mb-3 text-white tracking-wide">Neural Synthesis</h3>
                        <p className="text-slate-400 text-sm leading-relaxed font-light">
                            Advanced cognitive modeling replicating decision patterns with extreme fidelity. The system learns your intent, not just your commands.
                        </p>
                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                    </div>

                    <div className="glass-card p-8 rounded-2xl group relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none">
                            <Layers className="w-24 h-24 text-cyan-500/20 -rotate-12 translate-x-12 -translate-y-12" />
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                            <Layers className="text-cyan-300 w-6 h-6" />
                        </div>
                        <h3 className="font-display font-semibold text-xl mb-3 text-white tracking-wide">Deep Integration</h3>
                        <p className="text-slate-400 text-sm leading-relaxed font-light">
                            Seamlessly connects with your codebase and IDEs. Krachet lives in your terminal, observing and assisting without interruption.
                        </p>
                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                    </div>

                    <div className="glass-card p-8 rounded-2xl group relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none">
                            <Lock className="w-24 h-24 text-pink-500/20 -rotate-12 translate-x-12 -translate-y-12" />
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                            <Shield className="text-pink-300 w-6 h-6" />
                        </div>
                        <h3 className="font-display font-semibold text-xl mb-3 text-white tracking-wide">Quantum Security</h3>
                        <p className="text-slate-400 text-sm leading-relaxed font-light">
                            Enterprise-grade personality matrix encryption. Your digital twin's data model never leaves your local environment.
                        </p>
                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pink-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 bg-[#030014] py-12 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                        <Layers className="w-5 h-5 text-white" />
                        <p className="text-slate-400 text-sm">© 2024 Krachet AI Inc.</p>
                    </div>
                    <div className="flex gap-8 text-sm font-medium text-slate-500">
                        <a className="hover:text-white transition-colors" href="#">Privacy</a>
                        <a className="hover:text-white transition-colors" href="#">Terms</a>
                        <a className="hover:text-white transition-colors" href="#">Status</a>
                    </div>
                    <div className="flex gap-6">
                        <a className="text-slate-500 hover:text-white transition-colors" href="#">
                            <span className="sr-only">Twitter</span>
                            <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                            </svg>
                        </a>
                        <a className="text-slate-500 hover:text-white transition-colors" href="#">
                            <span className="sr-only">GitHub</span>
                            <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fill-rule="evenodd"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
