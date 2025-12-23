/**
 * WORKFLOW CONTRACTS
 * These types define exactly what KRACHET sends to n8n and what it expects back.
 */

export enum WorkflowID {
    MOM_GENERATOR = 'MOM_GENERATOR',
    // Future workflows will be added here
    // EMAIL_DRAFTER = 'EMAIL_DRAFTER',
}

/**
 * Input Schema for MOM_GENERATOR
 * Sent by KRACHET -> n8n
 */
export interface MOMGeneratorInput {
    meeting_notes: string;
}

/**
 * Output Schema for MOM_GENERATOR
 * Sent by n8n -> KRACHET
 */
export interface MOMGeneratorOutput {
    summary: string;
    decisions: string[];
    action_items: string[];
}

/**
 * Union of all workflow output types
 */
export type WorkflowOutput = MOMGeneratorOutput; // | EmailDrafterOutput | etc.
