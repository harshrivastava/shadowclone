import React, { useState, useEffect } from 'react';
import { X, Clock, MapPin, AlignLeft, Calendar } from 'lucide-react';
import { Button } from './Button';
import { ScheduleEvent, EventType } from '../../types/scheduler';

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: ScheduleEvent) => void;
    onDelete?: (id: string) => void;
    event?: ScheduleEvent | null;
}

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, onDelete, event }) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState<EventType>('meeting');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (event) {
            setTitle(event.title);
            setType(event.type);
            const start = new Date(event.startTime);
            const end = new Date(event.endTime);
            setDate(start.toISOString().split('T')[0]);
            setStartTime(start.toTimeString().split(' ')[0].slice(0, 5));
            setEndTime(end.toTimeString().split(' ')[0].slice(0, 5));
            setLocation(event.location || '');
            setDescription(event.description || '');
        } else {
            setTitle('');
            setType('meeting');
            const now = new Date();
            setDate(now.toISOString().split('T')[0]);
            setStartTime('09:00');
            setEndTime('10:00');
            setLocation('');
            setDescription('');
        }
    }, [event, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const start = new Date(`${date}T${startTime}`);
        const end = new Date(`${date}T${endTime}`);

        const newEvent: ScheduleEvent = {
            id: event?.id || Math.random().toString(36).substr(2, 9),
            title,
            type,
            startTime: start.toISOString(),
            endTime: end.toISOString(),
            location,
            description,
            status: event?.status || 'scheduled'
        };

        onSave(newEvent);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#030014]/60 backdrop-blur-xl animate-in fade-in duration-500">
            <div className="glass-card w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 border border-white/10">
                <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div>
                        <h3 className="text-xl font-display font-bold text-gradient-metallic tracking-tight">{event ? 'Modify Horizon Point' : 'Initialize Event Horizon'}</h3>
                        <p className="text-[9px] font-display font-bold text-slate-500 uppercase tracking-widest mt-1">Temporal Alignment Matrix</p>
                    </div>
                    <button onClick={onClose} className="p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8 bg-background/40">
                    <div className="group">
                        <label className="block text-[9px] font-display font-bold text-slate-500 uppercase tracking-widest mb-3">Event Identity</label>
                        <input
                            type="text"
                            placeholder="Designate title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full text-2xl font-display font-bold bg-transparent border-none focus:ring-0 p-0 text-slate-100 placeholder:text-slate-800 transition-all"
                            required
                            autoFocus
                        />
                        <div className="w-full h-px bg-gradient-to-r from-violet-500/50 via-transparent to-transparent mt-2"></div>
                    </div>

                    <div className="flex items-center space-x-3">
                        {(['meeting', 'class', 'task'] as const).map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setType(t)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-display font-bold uppercase tracking-widest transition-all duration-300 border ${type === t
                                    ? 'bg-violet-600 border-violet-500 text-white shadow-glow'
                                    : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/10'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="flex items-center text-[9px] font-display font-bold text-slate-500 uppercase tracking-widest">
                                    <Calendar className="w-3.5 h-3.5 mr-2 text-violet-500/50" />
                                    Temporal Date
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-sm text-slate-200 focus:border-violet-500/30 focus:ring-0 transition-all custom-calendar-icon"
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="flex items-center text-[9px] font-display font-bold text-slate-500 uppercase tracking-widest">
                                    <Clock className="w-3.5 h-3.5 mr-2 text-violet-500/50" />
                                    Time Window
                                </label>
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-sm text-slate-200 focus:border-violet-500/30 focus:ring-0 transition-all custom-time-icon"
                                        required
                                    />
                                    <span className="text-slate-600 text-xs font-bold uppercase tracking-widest">to</span>
                                    <input
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-sm text-slate-200 focus:border-violet-500/30 focus:ring-0 transition-all custom-time-icon"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center text-[9px] font-display font-bold text-slate-500 uppercase tracking-widest">
                                <MapPin className="w-3.5 h-3.5 mr-2 text-violet-500/50" />
                                Spatial Coordinates
                            </label>
                            <input
                                type="text"
                                placeholder="Add physical or digital location..."
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-sm text-slate-200 focus:border-violet-500/30 focus:ring-0 transition-all placeholder:text-slate-700"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center text-[9px] font-display font-bold text-slate-500 uppercase tracking-widest">
                                <AlignLeft className="w-3.5 h-3.5 mr-2 text-violet-500/50" />
                                Protocol Metadata
                            </label>
                            <textarea
                                placeholder="Add descriptive protocol details..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-sm text-slate-200 focus:border-violet-500/30 focus:ring-0 h-32 resize-none transition-all placeholder:text-slate-700 font-light leading-relaxed"
                            />
                        </div>
                    </div>

                    <div className="pt-6 flex justify-end items-center space-x-4 border-t border-white/5">
                        {event && onDelete && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (window.confirm('Delete this point from the horizon?')) {
                                        onDelete(event.id);
                                    }
                                }}
                                className="mr-auto text-[10px] font-display font-bold text-red-500/70 hover:text-red-400 transition-colors uppercase tracking-[0.2em]"
                            >
                                Terminate Point
                            </button>
                        )}
                        <Button type="button" variant="ghost" onClick={onClose} className="font-display font-bold text-[10px] tracking-widest uppercase text-slate-500 hover:text-white">Abort</Button>
                        <Button type="submit" variant="premium" className="px-8 h-12 rounded-2xl font-display font-bold text-xs tracking-[0.1em] uppercase shadow-glow">Commit to Horizon</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
