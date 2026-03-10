# Brujula de Aprendizaje UI

Frontend en Next.js para un chatbot de texto con respuestas en streaming (SSE).

## Requisitos

- Node.js 18+
- npm

## Configuracion

1. Crea o revisa `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000/api
```

2. Instala dependencias:

```bash
npm install
```

3. Ejecuta el frontend:

```bash
npm run dev
```

## Despliegue en Vercel

1. Importa este repositorio en Vercel y selecciona la carpeta `brujula-chat-ui` como Root Directory.
2. En Settings > Environment Variables agrega:

```env
NEXT_PUBLIC_API_URL=https://tu-backend-publico.com/api
```

3. Haz deploy.

Nota: No uses `http://127.0.0.1` en Vercel. Debe ser una URL publica de tu backend.

## Estructura principal

- `src/components/chat/Chat.tsx`: estado del chat y manejo de streaming.
- `src/components/chat/ChatInput.tsx`: input de texto y envio.
- `src/components/chat/MessageList.tsx`: render de mensajes y autoscroll.
- `src/lib/api.ts`: cliente SSE para `POST /chat`.
- `src/types/chat.ts`: tipos de mensajes y chunks de respuesta.
