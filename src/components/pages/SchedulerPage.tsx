import React, { useState } from 'react';
import {
    Calendar as CalendarIcon,
    Plus,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    MoreVertical,
    Clock,
    MapPin,
    Users,
    AlertCircle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { EventModal } from '../ui/EventModal';
import { useSchedule } from '../../hooks/useSchedule';
import { ScheduleEvent, ScheduleAssistOutput, SuggestedSlot } from '../../types/scheduler';

export const SchedulerPage: React.FC = () => {
    const { events, addEvent, updateEvent, deleteEvent } = useSchedule();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isAssistantOpen, setIsAssistantOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);

    // Filter events for the current month
    const currentMonthEvents = events.filter(event => {
        const eventDate = new Date(event.startTime);
        return eventDate.getMonth() === currentDate.getMonth() &&
            eventDate.getFullYear() === currentDate.getFullYear();
    });

    // Calendar generation logic
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const firstDayOfMonth = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

    const days = [];
    // Previous month padding
    const prevMonthDays = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth() - 1);
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        days.push({ day: prevMonthDays - i, currentMonth: false, date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthDays - i) });
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({ day: i, currentMonth: true, date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i) });
    }
    // Next month padding
    const remainingSlots = 42 - days.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingSlots; i++) {
        days.push({ day: i, currentMonth: false, date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i) });
    }

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const getEventsForDate = (date: Date) => {
        return events.filter(event => {
            const eventDate = new Date(event.startTime);
            return eventDate.getDate() === date.getDate() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getFullYear() === date.getFullYear();
        });
    };

    const [intent, setIntent] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiResult, setAiResult] = useState<ScheduleAssistOutput | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!intent.trim()) return;

        setIsAnalyzing(true);
        setError(null);
        setAiResult(null);

        try {
            const { ScheduleAssistantService } = await import('../../services/ScheduleAssistant');

            // 1. Find available slots (Deterministic)
            const availableSlots = ScheduleAssistantService.findAvailableSlots(events, 45); // Default 45 mins

            // 2. Get AI Decision (Groq)
            const result = await ScheduleAssistantService.getAIDecision({
                intent: 'schedule_meeting',
                durationMinutes: 45,
                constraints: intent,
                existingEvents: events
            }, availableSlots);

            setAiResult(result);
        } catch (err: any) {
            setError(err.message || "Failed to analyze schedule.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSaveEvent = (event: ScheduleEvent) => {
        if (editingEvent) {
            updateEvent(event);
        } else {
            addEvent(event);
        }
        setIsModalOpen(false);
        setEditingEvent(null);
    };

    const openNewEventModal = () => {
        setEditingEvent(null);
        setIsModalOpen(true);
    };

    const handleEditEvent = (event: ScheduleEvent) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };

    const handleDeleteEvent = (id: string) => {
        deleteEvent(id);
        setIsModalOpen(false);
        setEditingEvent(null);
    };

    return (
        <div className="flex h-screen bg-transparent">
            <EventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveEvent}
                onDelete={handleDeleteEvent}
                event={editingEvent}
            />
            {/* Main Content */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-500 relative z-10 ${isAssistantOpen ? 'mr-[450px]' : ''}`}>
                {/* Top Bar */}
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-background/50 backdrop-blur-md z-20">
                    <div className="flex items-center space-x-8">
                        <div className="flex items-center space-x-5">
                            <h2 className="text-2xl font-display font-bold text-gradient-metallic">
                                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </h2>
                            <div className="flex items-center border border-white/10 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm">
                                <button onClick={prevMonth} className="p-2 hover:bg-white/5 text-slate-400 hover:text-white transition-all border-r border-white/10">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button onClick={nextMonth} className="p-2 hover:bg-white/5 text-slate-400 hover:text-white transition-all">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())} className="font-display font-bold text-[11px] tracking-widest uppercase text-slate-500 hover:text-white">
                            Jump to Today
                        </Button>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Button
                            variant="secondary"
                            className={`rounded-xl px-5 h-11 font-display font-bold text-xs tracking-wider uppercase transition-all duration-300 ${isAssistantOpen ? 'bg-violet-600/20 text-violet-300 border-violet-500/30' : ''}`}
                            onClick={() => setIsAssistantOpen(!isAssistantOpen)}
                        >
                            <Sparkles className={`w-4 h-4 mr-2 ${isAssistantOpen ? 'animate-pulse' : ''}`} />
                            {isAssistantOpen ? 'Active Analysis' : 'Neural Schedule'}
                        </Button>
                        <Button onClick={openNewEventModal} variant="primary" className="h-11 rounded-xl px-6 font-display font-bold text-xs tracking-wider uppercase shadow-lg">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Event
                        </Button>
                    </div>
                </header>

                {/* Main Section */}
                <div className="flex-1 overflow-hidden flex">
                    {/* Calendar Grid */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-transparent">
                        <div className="grid grid-cols-7 gap-[1px] bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="bg-white/[0.03] py-4 text-center text-[10px] font-display font-bold text-slate-500 uppercase tracking-[0.2em] border-b border-white/5">
                                    {day}
                                </div>
                            ))}
                            {days.map((dayData, i) => {
                                const dayEvents = getEventsForDate(dayData.date);
                                const isToday = dayData.date.toDateString() === new Date().toDateString();

                                return (
                                    <div key={i} className={`bg-white/[0.01] min-h-[140px] p-3 hover:bg-white/[0.03] transition-all duration-300 group relative border-white/5 overflow-hidden ${!dayData.currentMonth ? 'opacity-20 pointer-events-none' : ''}`}>
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`text-sm font-display font-medium transition-colors duration-300 ${isToday ? 'bg-violet-600 text-white w-7 h-7 flex items-center justify-center rounded-lg shadow-glow' : 'text-slate-500 group-hover:text-slate-200'}`}>
                                                {dayData.day}
                                            </span>
                                        </div>
                                        <div className="space-y-1.5 min-h-[60px]">
                                            {dayEvents.slice(0, 3).map(event => (
                                                <div
                                                    key={event.id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditEvent(event);
                                                    }}
                                                    className={`text-[10px] px-2.5 py-1.5 rounded-lg border leading-tight cursor-pointer transition-all duration-300 group/event hover:scale-[1.02] hover:shadow-xl ${event.type === 'meeting' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20' :
                                                        event.type === 'class' ? 'bg-violet-500/10 border-violet-500/20 text-violet-300 hover:bg-violet-500/20' :
                                                            'bg-pink-500/10 border-pink-500/20 text-pink-300 hover:bg-pink-500/20'
                                                        }`}
                                                >
                                                    <span className="truncate block font-medium opacity-80 group-hover/event:opacity-100">{event.title}</span>
                                                </div>
                                            ))}
                                            {dayEvents.length > 3 && (
                                                <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest pl-1 mt-1">
                                                    + {dayEvents.length - 3} additional
                                                </div>
                                            )}
                                        </div>
                                        {/* Subtle hover indicator */}
                                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-violet-500/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Upcoming Events List */}
                    <div className="w-96 border-l border-white/5 bg-white/[0.01] backdrop-blur-xl p-8 overflow-y-auto custom-scrollbar">
                        <h3 className="text-[10px] font-display font-bold text-slate-500 uppercase tracking-[0.2em] mb-8 border-b border-white/5 pb-4">Timeline Horizon</h3>
                        <div className="space-y-6">
                            {currentMonthEvents.length > 0 ? (
                                currentMonthEvents.map(event => (
                                    <div
                                        key={event.id}
                                        onClick={() => handleEditEvent(event)}
                                        className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 group cursor-pointer relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-violet-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="flex items-start justify-between relative z-10">
                                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-display font-bold uppercase tracking-widest border ${event.type === 'meeting' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' :
                                                event.type === 'class' ? 'bg-violet-500/10 border-violet-500/20 text-violet-400' :
                                                    'bg-pink-500/10 border-pink-500/20 text-pink-400'
                                                }`}>
                                                {event.type}
                                            </span>
                                            <button className="text-slate-600 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <h4 className="font-display font-semibold text-slate-100 mt-4 line-clamp-1 group-hover:text-white transition-colors uppercase tracking-tight">{event.title}</h4>
                                        <div className="mt-4 space-y-2 relative z-10">
                                            <div className="flex items-center text-xs text-slate-400 font-light">
                                                <Clock className="w-3.5 h-3.5 mr-2.5 text-slate-500" />
                                                {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            {event.location && (
                                                <div className="flex items-center text-xs text-slate-400 font-light">
                                                    <MapPin className="w-3.5 h-3.5 mr-2.5 text-slate-500" />
                                                    {event.location}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 opacity-30">
                                    <CalendarIcon className="w-12 h-12 text-slate-600 mx-auto mb-4 stroke-1" />
                                    <p className="text-sm font-display font-medium text-slate-400">Empty timeline horizon</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Assistant Side Panel */}
            <aside className={`fixed right-0 top-0 h-full w-[450px] bg-background/60 backdrop-blur-3xl border-l border-white/5 shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-30 overflow-hidden ${isAssistantOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* Visual accents */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="h-full flex flex-col relative z-10">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-glow">
                                <Sparkles className="w-5 h-5 text-white animate-pulse" />
                            </div>
                            <div>
                                <h3 className="font-display font-bold text-slate-100 uppercase tracking-tight">Neural Scheduler</h3>
                                <p className="text-[9px] font-display font-bold text-violet-400 uppercase tracking-widest leading-none mt-1">Cognitive Analysis Engine</p>
                            </div>
                        </div>
                        <button onClick={() => setIsAssistantOpen(false)} className="text-slate-500 hover:text-white p-2 hover:bg-white/5 rounded-xl transition-all">
                            <Plus className="w-6 h-6 transform rotate-45" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                            <label className="block text-[10px] font-display font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Input Intent Matrix</label>
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <textarea
                                    value={intent}
                                    onChange={(e) => setIntent(e.target.value)}
                                    placeholder="Execute natural language scheduling command..."
                                    className="relative w-full h-40 p-5 bg-white/[0.02] border border-white/10 rounded-2xl text-[14px] font-light text-slate-200 focus:border-violet-500/50 focus:ring-0 resize-none transition-all placeholder:text-slate-600"
                                    disabled={isAnalyzing}
                                />
                            </div>
                            <Button
                                className="w-full mt-6 h-14 rounded-2xl font-display font-bold tracking-[0.1em] uppercase shadow-glow"
                                variant="premium"
                                onClick={handleAnalyze}
                                isLoading={isAnalyzing}
                                disabled={!intent.trim() || isAnalyzing}
                            >
                                <Sparkles className="w-4 h-4 mr-3" />
                                Initiate Synthesis
                            </Button>
                            {error && (
                                <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center text-xs text-red-400 font-bold uppercase tracking-widest animate-in zoom-in-95 duration-300">
                                    <AlertCircle className="w-4 h-4 mr-3" />
                                    {error}
                                </div>
                            )}
                        </div>

                        <div className="space-y-8 pb-32">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-white/5"></div>
                                </div>
                                <div className="relative flex justify-center text-[9px] font-display font-bold uppercase tracking-[0.3em]">
                                    <span className="bg-[#030014] px-4 text-slate-600">Cognitive Output</span>
                                </div>
                            </div>

                            {aiResult ? (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-display font-bold text-slate-500 uppercase tracking-widest">Calculated Optimal Slots</h4>
                                        {aiResult.suggestedSlots.map((slot: SuggestedSlot, idx: number) => (
                                            <div key={idx} className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 group cursor-pointer relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                                    <Clock className="w-16 h-16 text-white -rotate-12 translate-x-8 -translate-y-8" />
                                                </div>
                                                <div className="flex items-center justify-between mb-4 relative z-10">
                                                    <div className="flex items-center text-sm font-semibold text-white">
                                                        <Clock className="w-4 h-4 mr-3 text-violet-400" />
                                                        {new Date(slot.start).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-violet-500/20 group-hover:text-violet-300 transition-all">
                                                        <Plus className="w-4 h-4 text-slate-500" />
                                                    </div>
                                                </div>
                                                <p className="text-xs text-slate-400 leading-relaxed font-light border-l-2 border-violet-500/30 pl-4 py-1">
                                                    {slot.reason}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-display font-bold text-slate-500 uppercase tracking-widest">Protocol Communication Draft</h4>
                                        <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01] relative group backdrop-blur-sm">
                                            <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed font-light">
                                                {aiResult.messageDraft}
                                            </p>
                                            <button className="absolute bottom-4 right-4 p-2 text-slate-600 hover:text-white hover:bg-white/5 rounded-xl transition-all opacity-0 group-hover:opacity-100 flex items-center space-x-2 border border-transparent hover:border-white/5 shadow-xl bg-[#030014]/80">
                                                <span className="text-[9px] font-bold uppercase tracking-widest">Copy Protocol</span>
                                                <Plus className="w-3.5 h-3.5 rotate-45" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : !isAnalyzing && (
                                <div className="text-center py-24 opacity-20">
                                    <Clock className="w-16 h-16 text-slate-300 mx-auto mb-6 stroke-[1]" />
                                    <p className="text-sm font-display font-medium text-slate-400 max-w-[240px] mx-auto tracking-wide">Await intent matrix input to begin cognitive scheduling synthesis.</p>
                                </div>
                            )}

                            {isAnalyzing && (
                                <div className="space-y-6 animate-pulse">
                                    <div className="h-32 bg-white/[0.02] rounded-2xl border border-white/5"></div>
                                    <div className="h-32 bg-white/[0.02] rounded-2xl border border-white/5"></div>
                                    <div className="h-48 bg-white/[0.02] rounded-2xl border border-white/5"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Backdrop for AI Assistant */}
            {isAssistantOpen && (
                <div
                    className="fixed inset-0 bg-[#030014]/40 backdrop-blur-[4px] z-20 transition-all duration-500 ease-out"
                    onClick={() => setIsAssistantOpen(false)}
                />
            )}
        </div>
    );
};
