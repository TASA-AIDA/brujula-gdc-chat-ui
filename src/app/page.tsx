import { Chat } from '@/components/chat/Chat';

export default function Home() {
  return (
    // Use a dynamic viewport height to avoid the "100vh" bug on mobile browsers and
    // avoid clipping vertical content.  The `svh` unit refers to the visible
    // portion of the viewport (also known as the small viewport). By using
    // `min-h-[100svh]` the container always occupies at least the visible
    // viewport height while still allowing it to grow if needed.  We also avoid
    // hiding vertical overflow so the hero card and conversation area aren't
    // clipped when the content grows beyond the viewport【355490015329951†L46-L66】.
    <div className="min-h-[100svh] bg-slate-100 overflow-hidden flex flex-col">
      <Chat />
    </div>
  );
}
