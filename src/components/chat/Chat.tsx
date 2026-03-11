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
  const quickActions = [
    'Diseñar una capacitación',
    'Crear toolkit de transferencia',
    'Mejorar una experiencia de aprendizaje',
    'Diseñar storytelling para capacitación',
  ];

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

  const handleResetChat = () => {
    setMessages([]);
    setStreamingMessage('');
    setErrorMessage(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full border-[24px] border-sky-700" />
        <div className="absolute top-28 right-[-120px] w-[420px] h-[420px] rounded-full border-[18px] border-teal-600" />
        <div className="absolute bottom-[-160px] left-1/3 w-[520px] h-[520px] rounded-full border-[20px] border-blue-900" />
      </div>

      <header className="relative z-10 bg-[#0C3D63] text-white shadow-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center shadow-inner border border-white/15 shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-300 to-emerald-300 flex items-center justify-center text-[#0C3D63] text-xl shadow">
                🧭
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight truncate">Brújula de Aprendizaje</h1>
              <p className="text-sm md:text-base text-blue-100/90 truncate">Gestión del conocimiento en TASA</p>
            </div>
          </div>

          <button
            onClick={handleResetChat}
            className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-sm hover:bg-white/15 transition shrink-0"
          >
            Reiniciar
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex flex-col min-h-[calc(100vh-88px)] gap-6">
        <section>
          <div className="rounded-[28px] bg-gradient-to-r from-[#0C3D63] to-[#1D6E8C] text-white p-6 md:p-8 shadow-xl border border-white/10">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs md:text-sm font-medium mb-4">
                Diseña experiencias que conectan conocimiento con acción
              </span>
              <h2 className="text-2xl md:text-4xl font-bold leading-tight mb-3">
                Aprende, comparte y transforma conocimiento
              </h2>
              <p className="text-sm md:text-base text-blue-50/90 leading-relaxed">
                Te acompaño a diseñar experiencias de aprendizaje claras, útiles y aplicables al contexto laboral de TASA.
              </p>
            </div>
          </div>
        </section>

        <div className="flex-1 rounded-[32px] border border-slate-200 bg-white/85 backdrop-blur shadow-2xl overflow-hidden flex flex-col min-h-[480px]">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-slate-800 font-semibold text-lg">Asistente de aprendizaje</h3>
              <p className="text-slate-500 text-sm">Acompaño el diseño de capacitaciones y herramientas de transferencia de conocimiento</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Disponible
            </div>
          </div>

          <div className="flex-1 px-4 md:px-6 py-6 md:py-8 bg-[linear-gradient(180deg,rgba(248,250,252,0.92),rgba(241,245,249,0.78))] overflow-y-auto">
            <MessageList
              messages={messages}
              streamingMessage={streamingMessage}
              quickActions={quickActions}
              onQuickAction={handleSendMessage}
              quickActionsDisabled={isLoading}
            />
          </div>

          <div className="border-t border-slate-200 bg-white p-4 md:p-5">
            {errorMessage && (
              <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {errorMessage}
              </div>
            )}
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
};
