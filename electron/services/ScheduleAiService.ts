import Groq from 'groq-sdk';
import { ScheduleAssistOutput, SuggestedSlot } from '../../src/types/scheduler';

export class ScheduleAiService {
    private groq: Groq;

    constructor() {
        this.groq = new Groq({
            apiKey: process.env.GROQ_API_KEY || 'dummy_key'
        });
    }

    async getScheduleDecision(
        intent: string,
        userInput: string,
        availableSlots: SuggestedSlot[],
        existingEvents: any[]
    ): Promise<ScheduleAssistOutput> {
        const systemPrompt = `You are KRACHET, an AI Executive Assistant. 
        Your task is to help the user decide WHEN and HOW to schedule a meeting based on their intent and available slots.
        
        CRITICAL RULES:
        1. DO NOT book anything.
        2. DO NOT suggest slots that aren't in the provided available list.
        3. Provide clear REASONING for each suggestion (e.g., "This gives you a deep work block in the morning").
        4. Generate a polite, professional message draft the user can send.
        
        OUTPUT FORMAT (JSON):
        {
          "suggestedSlots": [
            { "start": "ISO", "end": "ISO", "reason": "Reasoning..." }
          ],
          "messageDraft": "The draft text..."
        }`;

        const context = `
        User Intent: ${intent}
        Additional Constraints: ${userInput}
        
        Available Time Slots (Deterministic):
        ${JSON.stringify(availableSlots, null, 2)}
        
        Existing Schedule (Context Only):
        ${JSON.stringify(existingEvents.slice(0, 5), null, 2)}
        `;

        try {
            const completion = await this.groq.chat.completions.create({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: context }
                ],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.5,
                response_format: { type: "json_object" }
            });

            const content = completion.choices[0]?.message?.content || "{}";
            return JSON.parse(content) as ScheduleAssistOutput;
        } catch (error: any) {
            console.error('Groq Scheduler AI Error:', error);
            throw new Error(`AI Reasoning failed: ${error.message}`);
        }
    }
}
