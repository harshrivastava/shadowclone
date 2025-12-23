import { contextBridge, ipcRenderer } from 'electron';

// Expose minimal API for chatbot functionality
contextBridge.exposeInMainWorld('api', {
    // Chat methods
    sendChatMessage: (message: string) => ipcRenderer.invoke('chat:send', message),

    // Voice / Transcription
    transcribe: (audioData: { audioBuffer: Uint8Array, mimeType: string }) =>
        ipcRenderer.invoke('ai:transcribe', audioData),

    // AI Scheduler
    scheduleAssist: (data: any) => ipcRenderer.invoke('ai:schedule-assist', data),

    // Utility
    on: (channel: string, func: (...args: any[]) => void) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
});
