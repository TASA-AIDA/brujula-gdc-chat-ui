import { Message, ChatResponse } from '@/types/chat';

/**
 * @fileoverview API Client para la comunicación con el backend de Brujula de Aprendizaje
 * 
 * Este módulo proporciona la interfaz principal para la comunicación entre el frontend
 * y el servidor del chatbot. Maneja específicamente:
 * 
 * - Comunicación en tiempo real con el servidor mediante Server-Sent Events (SSE)
 * - Procesamiento de mensajes del chat con streaming de respuestas
 * 
 * Interactúa con los siguientes componentes:
 * - Components/Chat: Utiliza este cliente para enviar/recibir mensajes
 * - Types/chat.ts: Define las interfaces Message y ChatResponse utilizadas aquí
 * - Backend API: Se comunica con el endpoint de chat
 * 
 * El flujo típico de datos es:
 * 1. El usuario envía un mensaje
 * 2. El mensaje se transmite al servidor vía POST
 * 3. El servidor responde con un stream de datos con texto progresivo y finalización
 * 
 * @see {@link Message} para la estructura de los mensajes
 * @see {@link ChatResponse} para los tipos de respuesta posibles
 */

export const chatApi = {
  // Función principal para enviar mensajes al API
  // Acepta un array de mensajes y una función opcional para manejar chunks de respuesta
  sendMessage: async (messages: Message[], onChunk: (chunk: ChatResponse) => void): Promise<ChatResponse> => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      throw new Error('Missing NEXT_PUBLIC_API_URL. Configure it in your environment variables.');
    }

    const response = await fetch(`${apiUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`Chat request failed with status ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let accumulatedMessage = '';
    let buffer = '';
    let doneEmitted = false;

    if (!reader) throw new Error('Failed to get response reader');

    const splitEvents = (source: string): { events: string[]; rest: string } => {
      if (source.includes('\r\n\r\n')) {
        const parts = source.split('\r\n\r\n');
        return { events: parts.slice(0, -1), rest: parts[parts.length - 1] ?? '' };
      }

      if (source.includes('\n\n')) {
        const parts = source.split('\n\n');
        return { events: parts.slice(0, -1), rest: parts[parts.length - 1] ?? '' };
      }

      // Algunos backends/proxies envian los separadores como texto escapado: "\\n\\n"
      if (source.includes('\\n\\n')) {
        const parts = source.split('\\n\\n');
        return { events: parts.slice(0, -1), rest: parts[parts.length - 1] ?? '' };
      }

      return { events: [], rest: source };
    };

    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });

      const split = splitEvents(buffer);
      const events = split.events;
      buffer = split.rest;

      for (const event of events) {
        const lines = event.includes('\\n') ? event.split('\\n') : event.split(/\r?\n/);
        for (const line of lines) {
          if (!line.startsWith('data:')) {
            continue;
          }

          const jsonStr = line.slice(5).trimStart();
          try {
            const data = JSON.parse(jsonStr);

            if (data.status === 'streaming' && data.content) {
              accumulatedMessage += data.content;
              onChunk({ content: accumulatedMessage, status: 'streaming' });
            } else if (data.status === 'done') {
              doneEmitted = true;
              onChunk({ content: accumulatedMessage, status: 'done' });
              return { content: accumulatedMessage, status: 'done' };
            } else if (data.status === 'error') {
              doneEmitted = true;
              const error = typeof data.error === 'string' ? data.error : 'Unknown chat error';
              onChunk({ status: 'error', error });
              return { status: 'error', error };
            }
          } catch (e) {
            console.error('Failed to parse SSE chunk:', e);
          }
        }
      }

      if (done) break;
    }

    if (!doneEmitted && accumulatedMessage) {
      onChunk({ content: accumulatedMessage, status: 'done' });
    }

    return { content: accumulatedMessage, status: 'done' };
  },
};
