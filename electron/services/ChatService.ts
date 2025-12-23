import Groq from 'groq-sdk';
import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
    type?: 'text' | 'action_request' | 'workflow_request';
    metadata?: any;
}

export class ChatService {
    private groq: Groq;
    private history: ChatMessage[] = [];
    private maxHistory = 20;

    constructor() {
        const apiKey = process.env.GROQ_API_KEY;
        console.log('[ChatService] Initializing...');
        console.log('[ChatService] API Key present:', !!apiKey);
        if (apiKey) console.log('[ChatService] API Key length:', apiKey.length);

        this.groq = new Groq({
            apiKey: apiKey || 'dummy_key',
            dangerouslyAllowBrowser: true // Just in case, though this is Node
        });
    }

    async processMessage(userMessage: string, context?: any): Promise<ChatMessage> {
        this.history.push({
            role: 'user',
            content: userMessage,
            timestamp: Date.now()
        });

        try {
            const systemPrompt = this.buildSystemPrompt(context);

            const completion = await this.groq.chat.completions.create({
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...this.history.map(h => ({ role: h.role as any, content: h.content }))
                ],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.7,
                max_tokens: 1024,
                response_format: { type: "json_object" }
            });

            const responseContent = completion.choices[0]?.message?.content || "{}";
            console.log('[ChatService] Raw Response:', responseContent);

            let parsed;
            try {
                parsed = JSON.parse(responseContent);
            } catch (e) {
                console.error('[ChatService] JSON Parse Error. Falling back to text.', e);
                parsed = { reply: responseContent, action: null };
            }

            const reply: ChatMessage = {
                role: 'assistant',
                content: parsed.reply || (typeof parsed === 'string' ? parsed : "I've processed your request."),
                timestamp: Date.now(),
                type: parsed.type === 'workflow' ? 'workflow_request' : (parsed.type === 'action' || parsed.action ? 'action_request' : 'text'),
                metadata: parsed.type === 'workflow' ? { workflow_id: parsed.workflow_id, params: parsed.params } : (parsed.action || parsed.metadata || null)
            };

            this.history.push(reply);

            if (this.history.length > this.maxHistory) {
                this.history = this.history.slice(this.history.length - this.maxHistory);
            }

            return reply;

        } catch (error: any) {
            console.error('ChatService Error:', error);
            return {
                role: 'assistant',
                content: "I'm having trouble processing that request. Please try again.",
                timestamp: Date.now()
            };
        }
    }

    private buildSystemPrompt(context?: any): string {
        const userName = context?.profile?.name || 'User';

        return `You are a professional AI Executive Assistant named KRACHET (a ShadowClone AI).
        
        INTENT ROUTING:
        Your job is to determine if the user wants to chat or trigger a specific WORKFLOW.

        AVAILABLE WORKFLOWS:
        1. MOM_GENERATOR: Use this when the user provides meeting notes, transcripts, or raw discussion text and wants Minutes of Meeting (Summary, Decisions, Action Items).
           - REQUIRED PARAMS: { "meeting_notes": "..." }

        LEGACY AUTOMATIONS (Use "action" type):
        1. web_search, play_music, launch_app

        JSON RESPONSE FORMAT (MANDATORY):
        You MUST respond with a single JSON object in one of these formats:

        1. FOR WORKFLOWS:
        {
            "type": "workflow",
            "workflow_id": "MOM_GENERATOR",
            "params": { "meeting_notes": "The meeting text" },
            "reply": "I've received your notes and am generating the MOM for you now."
        }

        2. FOR BUILT-IN ACTIONS:
        {
            "type": "action",
            "action": { "type": "web_search", "params": { "query": "..." } },
            "reply": "Friendly confirmation."
        }

        3. FOR CHAT:
        {
            "type": "chat",
            "reply": "Conversational response"
        }

        Strictly adhere to the parameter names. No preamble. No markdown outside the JSON.
        Talk to ${userName}.`;
    }

    clearHistory() {
        this.history = [];
    }
}
