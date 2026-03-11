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
  const hasConversation = messages.length > 0 || Boolean(streamingMessage);

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
    // Replace the fixed `h-screen` height with a dynamic viewport height so the
    // layout adapts to mobile browsers where `100vh` can over-report the
    // available space when the address bar is visible【355490015329951†L46-L66】.  We also
    // remove `overflow-hidden` and instead restrict only horizontal overflow
    // so vertical content isn't clipped【560733345096033†L90-L92】.  Switching from a grid
    // layout to `flex flex-col` simplifies the layout and avoids row height
    // quirks that can cause the hero card to collapse.  The `flex-1` on the
    // `main` element below allows it to expand and scroll when necessary.
    <div className="min-h-[100svh] bg-slate-100 relative overflow-x-hidden flex flex-col">
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full border-[24px] border-sky-700" />
        <div className="absolute top-28 right-[-120px] w-[420px] h-[420px] rounded-full border-[18px] border-teal-600" />
        <div className="absolute bottom-[-160px] left-1/3 w-[520px] h-[520px] rounded-full border-[20px] border-blue-900" />
      </div>

      <header className="relative z-10 bg-[#0C3D63] text-white shadow-lg border-b border-white/10 shrink-0">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 md:py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center shadow-inner border border-white/15 shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-300 to-emerald-300 flex items-center justify-center text-[#0C3D63] text-lg shadow">
                🧭
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-base md:text-xl font-bold tracking-tight truncate">Brújula de Aprendizaje</h1>
              <p className="text-xs md:text-sm text-blue-100/90 truncate">Gestión del conocimiento en TASA</p>
            </div>
          </div>

          <button
            onClick={handleResetChat}
            className="rounded-2xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs md:text-sm hover:bg-white/15 transition shrink-0"
          >
            Reiniciar
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto w-full px-4 md:px-6 py-2 md:py-2.5 flex-1 flex flex-col gap-2 overflow-y-auto">
        <section>
          <div className="rounded-[18px] bg-gradient-to-r from-[#0C3D63] to-[#1D6E8C] text-white p-2.5 md:p-3 shadow-xl border border-white/10">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full bg-white/15 px-2 py-0.5 text-[10px] md:text-xs font-medium mb-1.5">
                Diseña experiencias que conectan conocimiento con acción
              </span>
              <h2 className="text-base md:text-xl font-bold leading-tight mb-1">
                Aprende, comparte y transforma conocimiento
              </h2>
              <p className="text-xs md:text-sm text-blue-50/90 leading-relaxed line-clamp-1 md:line-clamp-2">
                Te acompaño a diseñar experiencias de aprendizaje claras, útiles y aplicables al contexto laboral de TASA.
              </p>
            </div>
          </div>
        </section>

        <div className="flex-1 min-h-0 rounded-[22px] border border-slate-200 bg-white/85 backdrop-blur shadow-2xl overflow-hidden flex flex-col">
          <div className="px-4 md:px-6 py-2 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-slate-800 font-semibold text-sm md:text-base">Asistente de aprendizaje</h3>
              <p className="text-slate-500 text-xs">Acompaño el diseño de capacitaciones y herramientas de transferencia de conocimiento</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Disponible
            </div>
          </div>

          <div className={`flex-1 min-h-0 px-4 md:px-6 py-2.5 md:py-3 bg-[linear-gradient(180deg,rgba(248,250,252,0.92),rgba(241,245,249,0.78))] ${hasConversation ? 'overflow-y-auto' : 'overflow-y-hidden'}`}>
            <MessageList
              messages={messages}
              streamingMessage={streamingMessage}
              quickActions={quickActions}
              onQuickAction={handleSendMessage}
              quickActionsDisabled={isLoading}
            />
          </div>

          <div className="border-t border-slate-200 bg-white p-2.5 md:p-3">
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
