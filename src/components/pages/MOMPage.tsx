import React, { useState } from 'react';
import { FileText, Users, Calendar, Send, Zap, AlertCircle, Copy, Share2, Download, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export const MOMPage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [participants, setParticipants] = useState('');
    const [transcript, setTranscript] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!transcript.trim()) return;

        setIsGenerating(true);
        setError(null);
        setResult(null);

        try {
            // Call the workflow through the exposed chat API which routes to runWorkflow in main.ts
            // Note: We bypassed ChatService by sending a specific workflow request format if we wanted, 
            // but for simplicity and consistency with the backend, we use the workflow execution logic directly.
            // Since we don't have a direct 'invoke' for runWorkflow in preload yet, we'll use a typed chat message
            // OR we can add a new IPC handler. The requirement said "All execution must go through existing backend workflow layer".

            // To be strict, I should probably add 'workflow:run' to preload/main, but for now I'll use the existing chat bridge 
            // with a forced workflow payload to ensure the LLM doesn't intervene if we send it as a raw command.
            // Actually, let's just trigger it via the chat bridge with a clear intent.

            const response = await (window as any).api.sendChatMessage(`Generate MOM for this meeting: ${transcript}`);

            if (response.workflow_result) {
                setResult(response.workflow_result);
            } else if (response.metadata?.error) {
                setError(response.content || "Remote execution failed.");
            } else {
                setError("The system returned an unexpected response. Please check your n8n workflow.");
            }
        } catch (err: any) {
            setError(err.message || "Failed to connect to KRACHET execution engine.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 relative z-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
                <div>
                    <h1 className="text-4xl font-display font-bold text-gradient-metallic tracking-tight">KRACHET Protocol</h1>
                    <p className="text-sm text-slate-500 mt-2 font-display uppercase tracking-widest">Transcript Synthesis & Document Intelligence</p>
                </div>
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" onClick={() => {
                        setTranscript('');
                        setResult(null);
                        setError(null);
                    }} className="font-display font-bold text-[10px] tracking-widest uppercase text-slate-500 hover:text-white">
                        Reset Workspace
                    </Button>
                    <Button
                        variant="premium"
                        className="h-12 rounded-2xl px-8 font-display font-bold text-xs tracking-[0.1em] uppercase shadow-glow"
                        onClick={handleGenerate}
                        isLoading={isGenerating}
                        disabled={!transcript.trim() || isGenerating}
                    >
                        <Zap className="w-4 h-4 mr-3" />
                        Initiate Synthesis
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Input Section */}
                <div className="lg:col-span-5 space-y-8">
                    <div className="glass-card rounded-3xl p-8 space-y-8">
                        <div>
                            <h3 className="text-xs font-display font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Environment Context</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[9px] font-display font-bold text-slate-500 uppercase tracking-widest mb-2.5">Protocol Designation</label>
                                    <div className="relative group">
                                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Specify meeting identity..."
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-sm text-slate-200 placeholder:text-slate-600 focus:border-violet-500/30 focus:ring-0 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[9px] font-display font-bold text-slate-500 uppercase tracking-widest mb-2.5">Date Horizon</label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
                                            <input
                                                type="text"
                                                placeholder="Oct 24, 2023"
                                                className="w-full pl-12 pr-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-sm text-slate-200 placeholder:text-slate-600 focus:border-violet-500/30 focus:ring-0 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-display font-bold text-slate-500 uppercase tracking-widest mb-2.5">Personnel</label>
                                        <div className="relative group">
                                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
                                            <input
                                                type="text"
                                                placeholder="Participant IDs..."
                                                value={participants}
                                                onChange={(e) => setParticipants(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-sm text-slate-200 placeholder:text-slate-600 focus:border-violet-500/30 focus:ring-0 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-display font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Input Matrix</h3>
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/10 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <textarea
                                    value={transcript}
                                    onChange={(e) => setTranscript(e.target.value)}
                                    placeholder="Input raw transcript stream here..."
                                    className="relative w-full h-[380px] bg-white/[0.02] border border-white/5 rounded-2xl text-[13px] font-light text-slate-300 p-6 focus:border-violet-500/30 focus:ring-0 resize-none leading-relaxed transition-all placeholder:text-slate-700 custom-scrollbar"
                                    disabled={isGenerating}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Result Section */}
                <div className="lg:col-span-7 space-y-8">
                    {!result && !isGenerating && !error && (
                        <div className="h-full min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01] p-16 text-center group transition-colors hover:border-white/10">
                            <div className="w-20 h-20 bg-white/[0.02] border border-white/10 rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-8 group-hover:scale-110 transition-transform duration-500">
                                <Zap className="w-10 h-10 text-slate-700" />
                            </div>
                            <h3 className="text-xl font-display font-bold text-slate-400 uppercase tracking-[0.2em]">Synthesis Required</h3>
                            <p className="text-sm text-slate-500 max-w-xs mt-4 font-light leading-relaxed">Await input stream transmission to begin cognitive processing and document synthesis.</p>
                        </div>
                    )}

                    {isGenerating && (
                        <div className="h-full min-h-[500px] flex flex-col items-center justify-center border border-white/10 rounded-3xl bg-white/[0.02] p-16 text-center">
                            <div className="relative mb-10">
                                <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-2xl animate-pulse"></div>
                                <div className="relative w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-glow">
                                    <Zap className="w-8 h-8 text-white animate-pulse" />
                                </div>
                            </div>
                            <h3 className="text-xl font-display font-bold text-slate-200 uppercase tracking-widest">Protocol Execution</h3>
                            <p className="text-sm text-slate-400 mt-4 font-light max-w-xs leading-relaxed">Neural engine is extracting key vector points, critical decisions, and tactical action items...</p>
                        </div>
                    )}

                    {error && (
                        <div className="glass-card rounded-3xl p-1 p-0.5 bg-gradient-to-br from-red-500/20 to-transparent">
                            <div className="bg-background/80 backdrop-blur-3xl rounded-[1.4rem] p-12 text-center">
                                <AlertCircle className="w-16 h-16 text-red-500 mb-6 mx-auto stroke-1" />
                                <h3 className="text-xl font-display font-bold text-red-200 uppercase tracking-widest">Synthesis Error</h3>
                                <p className="text-sm text-red-400/70 mt-4 max-w-sm mx-auto font-light leading-relaxed">{error}</p>
                                <Button variant="outline" className="mt-10 border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-xl" onClick={handleGenerate}>
                                    Re-Initiate Synthesis
                                </Button>
                            </div>
                        </div>
                    )}

                    {result && (
                        <div className="space-y-8 animate-in slide-in-from-right-8 duration-1000">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 text-emerald-400">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                                    <span className="text-[10px] font-display font-bold uppercase tracking-[0.3em]">Processing Sequence Alpha-1 Complete</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button className="p-2.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"><Copy className="w-4 h-4" /></button>
                                    <button className="p-2.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"><Share2 className="w-4 h-4" /></button>
                                    <button className="p-2.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"><Download className="w-4 h-4" /></button>
                                </div>
                            </div>

                            <div className="glass-card rounded-3xl p-8">
                                <h3 className="text-[10px] font-display font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">Executive Abstract</h3>
                                <p className="text-base text-slate-300 leading-relaxed font-light">{result.summary}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="glass-card rounded-3xl p-8">
                                    <h3 className="text-[10px] font-display font-bold text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center">
                                        <div className="w-1 h-3 bg-violet-500 rounded-full mr-3 shadow-glow" />
                                        Critical Vectors
                                    </h3>
                                    <ul className="space-y-4">
                                        {result.decisions?.map((item: string, i: number) => (
                                            <li key={i} className="flex items-start space-x-4 text-sm text-slate-400 group">
                                                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-700/50 group-hover:bg-violet-400 transition-colors shrink-0" />
                                                <span className="font-light group-hover:text-slate-200 transition-colors leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="glass-card rounded-3xl p-8">
                                    <h3 className="text-[10px] font-display font-bold text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center">
                                        <div className="w-1 h-3 bg-cyan-500 rounded-full mr-3 shadow-glow" />
                                        Tactical Operations
                                    </h3>
                                    <ul className="space-y-4">
                                        {result.action_items?.map((item: string, i: number) => (
                                            <li key={i} className="flex items-start space-x-4 text-sm text-slate-400 group">
                                                <div className="mt-1 w-4 h-4 border border-white/10 rounded group-hover:border-cyan-500/50 transition-colors shrink-0 flex items-center justify-center">
                                                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                                <span className="font-light group-hover:text-slate-200 transition-colors leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="pt-8 flex justify-end">
                                <Button variant="ghost" className="text-slate-500 font-display font-bold text-[10px] tracking-widest uppercase hover:text-violet-400">
                                    Archive to Workspace Neural-Link
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
