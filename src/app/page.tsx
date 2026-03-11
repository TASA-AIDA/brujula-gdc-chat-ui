import { Chat } from '@/components/chat/Chat';

export default function Home() {
  return (
    <div className="h-[100svh] bg-slate-100 overflow-hidden flex flex-col">
      <Chat />
    </div>
  );
}
