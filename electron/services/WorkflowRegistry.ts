import { WorkflowID } from './WorkflowTypes';

/**
 * Workflow Registry
 * Maps internal Workflow IDs to environment variable keys.
 * This ensures no URLs are hardcoded in the codebase.
 */
const RegistryMap: Record<WorkflowID, string | undefined> = {
    [WorkflowID.MOM_GENERATOR]: process.env.MOM_GENERATOR_WEBHOOK_URL,
};

export class WorkflowRegistry {
    /**
     * Retrieves the webhook URL for a given workflow.
     * Throws if the URL is not configured in .env.
     */
    static getWebhookUrl(id: WorkflowID): string {
        const url = RegistryMap[id];

        if (!url || url.trim() === '') {
            throw new Error(`CONFIGURATION ERROR: Webhook URL for "${id}" is not defined in .env (expected MOM_GENERATOR_WEBHOOK_URL)`);
        }

        return url;
    }

    /**
     * Checks if a workflow is properly configured.
     */
    static isConfigured(id: WorkflowID): boolean {
        return !!RegistryMap[id];
    }
}
