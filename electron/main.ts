import { app, BrowserWindow, ipcMain, session } from 'electron';
import path from 'path';
import fs from 'fs';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import { ChatService } from './services/ChatService';
import { AutomationService } from './services/AutomationService';
import { WorkflowExecutionService } from './services/WorkflowExecutionService';
import { WorkflowID } from './services/WorkflowTypes';

// Load environment variables
dotenv.config();

let mainWindow: BrowserWindow | null = null;
const chatService = new ChatService();
const automationService = new AutomationService();
const workflowService = new WorkflowExecutionService();

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        title: 'KRACHET - a ShadowClone AI',
        frame: true,
        titleBarStyle: 'default'
    });

    const htmlPath = path.join(__dirname, '../../public/index.html');
    mainWindow.loadFile(htmlPath);

    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Minimal Chat IPC
ipcMain.handle('chat:send', async (event, message) => {
    const response = await chatService.processMessage(message, { profile: { name: 'User', tone: 'helpful' } });

    // Handle Desktop Automations
    if (response.type === 'action_request' && response.metadata) {
        try {
            await automationService.execute(response.metadata);
        } catch (error) {
            console.error('[Main] Action execution failed:', error);
        }
    }

    // Handle External n8n Workflows
    if (response.type === 'workflow_request' && response.metadata) {
        try {
            console.log(`[Main] External execution requested for: ${response.metadata.workflow_id}`);
            const result = await workflowService.runWorkflow(
                response.metadata.workflow_id as WorkflowID,
                response.metadata.params
            );

            // Append result for the frontend to render dynamically
            return {
                ...response,
                workflow_result: result
            };
        } catch (error: any) {
            console.error('[Main] Workflow error:', error.message);
            // Return system error to frontend
            return {
                ...response,
                content: `SYSTEM ERROR: ${error.message}. Please check your configuration or n8n instance.`,
                metadata: { error: true, original: response.metadata }
            };
        }
    }

    return response;
});

// Transcription IPC (Groq Whisper)
ipcMain.handle('ai:transcribe', async (event, { audioBuffer, mimeType }) => {
    try {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey || apiKey === 'your_actual_groq_api_key_here') {
            throw new Error('GROQ_API_KEY not configured');
        }

        const groq = new Groq({ apiKey });

        const pureMimeType = mimeType.split(';')[0].toLowerCase().trim();
        const mimeToExt: Record<string, string> = {
            'audio/webm': 'webm',
            'audio/wav': 'wav',
            'audio/mpeg': 'mp3',
            'audio/mp3': 'mpmp3',
            'audio/ogg': 'ogg',
            'audio/opus': 'opus',
            'audio/m4a': 'm4a',
            'audio/flac': 'flac'
        };

        const extension = mimeToExt[pureMimeType] || 'webm';
        const fileName = `speech.${extension}`;
        const buffer = Buffer.from(audioBuffer);
        const tempPath = path.join(app.getPath('temp'), fileName);

        fs.writeFileSync(tempPath, buffer);

        const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(tempPath),
            model: "whisper-large-v3",
            prompt: "Transcription for an AI assistant.",
            response_format: "json",
            language: "en"
        });

        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);

        return { success: true, text: transcription.text };
    } catch (error: any) {
        console.error('Transcription error:', error);
        return { success: false, error: error.message };
    }
});

app.whenReady().then(async () => {
    session.defaultSession.setPermissionCheckHandler((webContents, permission) => {
        if (permission === 'media') return true;
        return false;
    });

    session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
        if (permission === 'media') callback(true);
        else callback(false);
    });

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
