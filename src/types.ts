export interface UserProfile {
    name: string;
    tone: string;
}

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
    type?: 'text' | 'action_request';
    metadata?: any;
}

declare global {
    interface Window {
        api: {
            // Chat
            sendChatMessage: (message: string) => Promise<ChatMessage>;

            // Voice
            transcribe: (audioData: { audioBuffer: Uint8Array, mimeType: string }) => Promise<{ success: boolean, text?: string, error?: string }>;

            // Utility methods
            on: (channel: string, func: (...args: any[]) => void) => void;
        };
    }
}
