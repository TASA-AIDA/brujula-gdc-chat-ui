'use client';

/**
 * Chat Component
 * --------------
 * Contenedor principal para un chat de texto con respuesta en streaming.
 */

import { useState } from 'react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { chatApi } from '@/lib/api';
import { Message } from '@/types/chat';

export const Chat = () => {
  // Estado para almacenar los mensajes
  const [messages, setMessages] = useState<Message[]>([]);
  // Estado para indicar si se está cargando
  const [isLoading, setIsLoading] = useState(false);
  // Estado para almacenar el mensaje que se está transmitiendo
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  // Estado para mostrar errores de red o del backend
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Función para enviar un mensaje
  const handleSendMessage = async (content: string) => {
    const newMessage: Message = {
      role: 'user',
      content,
    };

    try {
      setIsLoading(true);
      setErrorMessage(null);
      setMessages((prev: Message[]) => [...prev, newMessage]);
      setStreamingMessage('');

      await chatApi.sendMessage([...messages, newMessage], (chunk) => {
        if (chunk.status === 'streaming' && chunk.content) {
          setStreamingMessage(chunk.content);
        } else if (chunk.status === 'done' && chunk.content) {
          const assistantMessage: Message = {
            role: 'assistant',
            content: chunk.content,
          };
          setMessages((prev: Message[]) => [...prev, assistantMessage]);
          setStreamingMessage('');
        } else if (chunk.status === 'error') {
          setStreamingMessage('');
          setErrorMessage(chunk.error ?? 'Ocurrió un error al procesar tu mensaje.');
        }
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setErrorMessage('No se pudo conectar con el servidor. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      <div className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-32 py-4">
        <div className="max-w-3xl mx-auto">
          <MessageList messages={messages} streamingMessage={streamingMessage} />
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto">
          {errorMessage && (
            <div className="mx-4 mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
              {errorMessage}
            </div>
          )}
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
