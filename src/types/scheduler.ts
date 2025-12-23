export type EventType = 'meeting' | 'class' | 'task';
export type EventStatus = 'scheduled' | 'cancelled' | 'completed';

export interface ScheduleEvent {
    id: string;
    title: string;
    type: EventType;
    startTime: string; // ISO
    endTime: string;   // ISO
    description?: string;
    location?: string;
    status: EventStatus;
}

export interface ScheduleAssistInput {
    intent: 'schedule_meeting';
    durationMinutes: number;
    constraints?: string;
    existingEvents: ScheduleEvent[];
}

export interface SuggestedSlot {
    start: string;
    end: string;
    reason: string;
}

export interface ScheduleAssistOutput {
    suggestedSlots: SuggestedSlot[];
    messageDraft: string;
}
