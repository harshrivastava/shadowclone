import Groq from 'groq-sdk';
import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
    type?: 'text' | 'action_request';
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
                content: parsed.reply || responseContent,
                timestamp: Date.now(),
                type: parsed.action ? 'action_request' : 'text',
                metadata: parsed.action || null
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

        return `You are a helpful and intelligent AI desktop assistant named ShadowAssistant.
        
        CAPABILITIES:
        1. Web Search: Searching Google for information.
        2. Music: Playing music on YouTube.
        3. App Launching: Opening common Windows apps (Notepad, Chrome, Calculator).
        
        INSTRUCTIONS:
        - If the user asks for a simple chat, respond conversationally.
        - If the user asks to perform a task (search, play music, open app), you MUST respond in JSON format.
        
        JSON FORMAT:
        {
            "reply": "Friendly text confirmation of the action",
            "action": {
                "type": "web_search" | "play_music" | "launch_app",
                "params": {
                    "query": "search term or music query",
                    "appName": "notepad" | "chrome" | "calc"
                }
            }
        }
        
        If no action is needed, return "action": null.
        Always return valid JSON.
        You are talking to ${userName}.`;
    }

    clearHistory() {
        this.history = [];
    }
}
