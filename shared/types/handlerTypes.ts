export type AskGptOptions = {
    messages?: any[];
    max_tokens: number;
    model: string;
    temperature?: number;
    n?: number;
}