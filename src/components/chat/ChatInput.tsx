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
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-x-2 p-4 bg-white dark:bg-transparent"
      >
        <div className="flex-1">
          <input
            type="text"
            value={message}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
            placeholder="Escribe un mensaje"
            className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-700 p-2 
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
              focus:outline-none focus:border-[#0ad17b] dark:focus:border-[#0ad17b] focus:ring-2 transition focus:ring-[#0ce989] dark:focus:ring-[#07b56a]
              placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="p-2.5 bg-[#07b56a] text-white rounded-lg 
            hover:bg-[#09995b] dark:hover:bg-[#09995b]
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <SendHorizontal className="h-6 w-6" />
          )}
        </button>
      </form>
    </div>
  );
};
