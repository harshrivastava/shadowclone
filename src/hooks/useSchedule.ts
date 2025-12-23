import { useState, useEffect } from 'react';
import { ScheduleEvent } from '../types/scheduler';

const STORAGE_KEY = 'krachet_scheduled_events';

export const useSchedule = () => {
    const [events, setEvents] = useState<ScheduleEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedEvents = localStorage.getItem(STORAGE_KEY);
        if (storedEvents) {
            try {
                setEvents(JSON.parse(storedEvents));
            } catch (error) {
                console.error('Failed to parse scheduled events:', error);
            }
        } else {
            // Seed with mock data
            const now = new Date();
            const mockEvents: ScheduleEvent[] = [
                {
                    id: '1',
                    title: 'Strategic Planning with Mentor',
                    type: 'meeting',
                    startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10, 0).toISOString(),
                    endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 11, 0).toISOString(),
                    description: 'Discuss Q4 goals',
                    location: 'Zoom',
                    status: 'scheduled'
                },
                {
                    id: '2',
                    title: 'Advanced AI Architectures',
                    type: 'class',
                    startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 14, 0).toISOString(),
                    endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 16, 0).toISOString(),
                    location: 'Room 402',
                    status: 'scheduled'
                },
                {
                    id: '3',
                    title: 'Review System Design Docs',
                    type: 'task',
                    startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 0).toISOString(),
                    endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 30).toISOString(),
                    status: 'scheduled'
                }
            ];
            saveEvents(mockEvents);
        }
        setIsLoading(false);
    }, []);

    const saveEvents = (newEvents: ScheduleEvent[]) => {
        setEvents(newEvents);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents));
    };

    const addEvent = (event: ScheduleEvent) => {
        const updated = [...events, event];
        saveEvents(updated);
    };

    const updateEvent = (updatedEvent: ScheduleEvent) => {
        const updated = events.map(e => e.id === updatedEvent.id ? updatedEvent : e);
        saveEvents(updated);
    };

    const deleteEvent = (id: string) => {
        const updated = events.filter(e => e.id !== id);
        saveEvents(updated);
    };

    return {
        events,
        isLoading,
        addEvent,
        updateEvent,
        deleteEvent
    };
};
