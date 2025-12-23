import { WorkflowID, WorkflowOutput } from './WorkflowTypes';
import { WorkflowRegistry } from './WorkflowRegistry';

export class WorkflowExecutionService {
    private readonly TIMEOUT_MS = 30000; // 30 second timeout for external workflows

    /**
     * Executes an external n8n workflow.
     * @param id The ID of the workflow to execute
     * @param payload The data to send (must match the contract)
     * @returns The structured response from n8n
     */
    async runWorkflow<T extends WorkflowOutput>(id: WorkflowID, payload: any): Promise<T> {
        const url = WorkflowRegistry.getWebhookUrl(id);

        console.log(`[WorkflowExecutionService] Initializing ${id} execution...`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    workflow_id: id,
                    timestamp: new Date().toISOString(),
                    data: payload
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`REMOTE EXECUTION FAILED (${response.status}): ${errorBody || 'No error details provided'}`);
            }

            const result = await response.json();

            // Note: n8n is expected to return a JSON matching the Output Schema defined in WorkflowTypes.ts
            return result as T;

        } catch (error: any) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new Error(`EXECUTION TIMEOUT: The workflow "${id}" took longer than ${this.TIMEOUT_MS / 1000}s to respond.`);
            }

            console.error(`[WorkflowExecutionService] ${id} error:`, error.message);
            throw error;
        }
    }
}
