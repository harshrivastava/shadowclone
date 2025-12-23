import { ScheduleEvent, ScheduleAssistInput, ScheduleAssistOutput, SuggestedSlot } from '../types/scheduler';

export class ScheduleAssistantService {
    /**
     * Deterministically find available slots in the next 7 days.
     */
    static findAvailableSlots(events: ScheduleEvent[], durationMinutes: number): SuggestedSlot[] {
        const slots: SuggestedSlot[] = [];
        const now = new Date();
        const searchEnd = new Date();
        searchEnd.setDate(now.getDate() + 7); // Search window: next 7 days

        // For simplicity in this version, we'll check hourly slots between 9 AM and 6 PM
        let current = new Date(now);
        current.setMinutes(0, 0, 0);

        while (current < searchEnd) {
            const hour = current.getHours();
            if (hour >= 9 && hour <= 18) {
                const slotEnd = new Date(current.getTime() + durationMinutes * 60000);

                // Check if this slot conflicts with any existing event
                const isConflict = events.some(event => {
                    const eventStart = new Date(event.startTime);
                    const eventEnd = new Date(event.endTime);
                    return (current < eventEnd && slotEnd > eventStart);
                });

                if (!isConflict) {
                    slots.push({
                        start: current.toISOString(),
                        end: slotEnd.toISOString(),
                        reason: "Available slot" // Placeholder, LLM will refine this
                    });
                }
            }

            // Move to next hour
            current.setHours(current.getHours() + 1);
            if (slots.length >= 10) break; // Limit to 10 suggestions
        }

        return slots;
    }

    /**
     * Use AI to reason about the slots and generate a draft message.
     */
    static async getAIDecision(input: ScheduleAssistInput, availableSlots: SuggestedSlot[]): Promise<ScheduleAssistOutput> {
        // We'll call a specialized IPC handler for this
        try {
            const response = await (window as any).api.scheduleAssist({
                intent: input.intent,
                userInput: input.constraints,
                availableSlots,
                existingEvents: input.existingEvents
            });

            if (!response || response.error) {
                throw new Error(response?.error || "AI Assistant failed to respond.");
            }

            return response as ScheduleAssistOutput;
        } catch (error) {
            console.error('Schedule Assistant AI Error:', error);
            throw error;
        }
    }
}
