// see OpenAi EasyInputMessage
export interface ConversationEntry {
	role: 'user' | 'assistant' | 'system' | 'developer';
	content: string;
}

export type Conversation = Array<ConversationEntry>;
