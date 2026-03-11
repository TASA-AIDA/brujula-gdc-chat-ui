// Importaciones necesarias para el componente
import { Message } from "@/types/chat";
import { clsx } from "clsx";
import Markdown from "react-markdown";
import { useRef, useEffect } from "react";

// Definición de tipos para las props del componente
interface MessageListProps {
  messages: Message[];
  streamingMessage?: string;
  quickActions?: string[];
  onQuickAction?: (action: string) => void;
  quickActionsDisabled?: boolean;
}

export const MessageList = ({
  messages,
  streamingMessage,
  quickActions = [],
  onQuickAction,
  quickActionsDisabled = false,
}: MessageListProps) => {
  // Referencia para el scroll automático
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Función para desplazar la vista al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Efecto para hacer scroll cuando hay nuevos mensajes o streaming
  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const isEmpty = messages.length === 0 && !streamingMessage;

  return (
    <div className="flex flex-col space-y-3 py-0.5">
      {isEmpty && (
        <>
          <div className="flex items-start gap-2.5 max-w-4xl">
            <div className="w-10 h-10 rounded-2xl bg-[#0C3D63] text-white flex items-center justify-center text-base shadow-md shrink-0">
              🧭
            </div>
            <div className="rounded-[20px] rounded-tl-md bg-[#EAF4FB] border border-sky-100 px-4 py-2.5 md:py-3 shadow-sm">
              <p className="text-slate-800 text-base md:text-lg font-medium mb-1">Hola, soy Brújula de Aprendizaje.</p>
              <p className="text-slate-600 leading-relaxed text-sm">
                Puedo ayudarte a diseñar capacitaciones, estructurar experiencias de aprendizaje o crear herramientas para compartir conocimiento dentro del equipo.
              </p>
              <p className="text-slate-700 mt-1.5 leading-relaxed text-sm">
                Si lo necesitas, primero resumiré lo que entendí de tu solicitud para asegurar que vamos por buen camino.
              </p>
              <p className="text-slate-800 mt-1.5 font-medium text-sm">¿Qué te gustaría construir o mejorar hoy?</p>
            </div>
          </div>

          {quickActions.length > 0 && (
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3 max-w-6xl">
              {quickActions.map((item) => (
                <button
                  key={item}
                  type="button"
                  disabled={quickActionsDisabled}
                  onClick={() => onQuickAction?.(item)}
                  className="text-left rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-slate-800 font-medium text-sm">{item}</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Mapeo de los mensajes existentes */}
      {messages.map((message, index) => (
        <div
          key={index}
          className={clsx("flex", {
            // Alineación de mensajes según el rol
            "justify-end": message.role === "user",
            "justify-start": message.role === "assistant",
          })}
        >
          <div
            className={clsx("max-w-[88%] rounded-2xl px-4 py-3 shadow-sm", {
              // Estilos condicionales según el rol del mensaje
              "bg-[#1AA56B] text-white rounded-br-md": message.role === "user",
              "bg-white border border-slate-200 text-slate-800 rounded-bl-md":
                message.role === "assistant",
            })}
          >
            {/* Renderizado del contenido markdown del mensaje */}
            <Markdown
              components={{
                // Configuración personalizada para imágenes en markdown
                img: ({ ...props }) => {
                  return <img {...props} className="rounded-xl my-2.5" />;
                },
              }}
              className="prose prose-sm max-w-none prose-p:my-2 prose-pre:rounded-xl prose-pre:bg-slate-900 prose-headings:my-3"
            >
              {message.content}
            </Markdown>
          </div>
        </div>
      ))}
      
      {/* Renderizado del mensaje en streaming */}
      {streamingMessage && (
        <div className="flex justify-start">
          <div className="max-w-[88%] rounded-2xl rounded-bl-md px-4 py-3 bg-white border border-slate-200 text-slate-800 shadow-sm">
            <Markdown className="prose prose-sm max-w-none prose-p:my-2">{streamingMessage}</Markdown>
          </div>
        </div>
      )}
      
      {/* Elemento de referencia para el scroll automático */}
      <div ref={messagesEndRef} />
    </div>
  );
};
