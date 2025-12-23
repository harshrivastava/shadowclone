import { shell } from 'electron';
import { exec } from 'child_process';
import path from 'path';

export class AutomationService {
    /**
     * Opens a URL in the default browser.
     * Used for Google Search, YouTube, Spotify, etc.
     */
    async openUrl(url: string): Promise<{ success: boolean; error?: string }> {
        try {
            await shell.openExternal(url);
            return { success: true };
        } catch (error: any) {
            console.error('[AutomationService] Failed to open URL:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Performs a Google search.
     */
    async googleSearch(query: string): Promise<{ success: boolean; error?: string }> {
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        return this.openUrl(url);
    }

    /**
     * Plays music on YouTube.
     */
    async playYouTube(query: string): Promise<{ success: boolean; error?: string }> {
        const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        return this.openUrl(url);
    }

    /**
     * Launches a specific application.
     * This is a basic implementation for common Windows apps.
     */
    async launchApp(appName: string): Promise<{ success: boolean; error?: string }> {
        return new Promise((resolve) => {
            const commonApps: Record<string, string> = {
                'notepad': 'notepad.exe',
                'calc': 'calc.exe',
                'calculator': 'calc.exe',
                'chrome': 'start chrome',
                'browser': 'start chrome',
                'edge': 'start msedge',
                'code': 'code'
            };

            const command = commonApps[appName.toLowerCase()] || appName;

            exec(command, (error) => {
                if (error) {
                    console.error(`[AutomationService] Failed to launch ${appName}:`, error);
                    resolve({ success: false, error: error.message });
                } else {
                    resolve({ success: true });
                }
            });
        });
    }

    /**
     * Executes an action based on type and params.
     */
    async execute(action: { type: string; params: any }): Promise<any> {
        console.log('[AutomationService] Executing action:', action);

        switch (action.type) {
            case 'web_search':
                return this.googleSearch(action.params.query);
            case 'play_music':
                return this.playYouTube(action.params.query);
            case 'launch_app':
                return this.launchApp(action.params.appName);
            default:
                throw new Error(`Unsupported action type: ${action.type}`);
        }
    }
}
