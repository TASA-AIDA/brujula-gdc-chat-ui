import { useState, type ChangeEvent, type FormEvent } from "react";
import { Loader2, SendHorizontal } from "lucide-react";

// Definición de tipos para las props del componente
interface ChatInputProps {
  onSendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
}

export const ChatInput = ({
  onSendMessage,
  isLoading,
}: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex items-center gap-2.5 rounded-[22px] border border-slate-200 bg-slate-50 px-3 md:px-4 py-2 shadow-inner">
          <button
            type="button"
            aria-label="Agregar contexto"
            className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 text-xl flex items-center justify-center shrink-0 hover:bg-emerald-100 transition"
          >
            +
          </button>

          <input
            type="text"
            value={message}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
            placeholder="Describe la capacitación, el público o la necesidad de aprendizaje..."
            className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 text-sm"
          />

          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="rounded-xl bg-[#1AA56B] hover:bg-[#15925e] text-white font-semibold px-4 py-2 shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <span className="inline-flex items-center gap-2">
                Enviar
                <SendHorizontal className="h-4 w-4" />
              </span>
            )}
          </button>
        </div>

        <p className="text-xs text-slate-400 px-1">
          Ejemplo: Necesito diseñar una capacitación práctica para un equipo operativo.
        </p>
      </form>
    </div>
  );
};
