export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  content?: string;
  status: 'streaming' | 'done' | 'error';
  error?: string;
}
