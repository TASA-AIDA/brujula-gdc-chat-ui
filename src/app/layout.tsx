import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brujula de Aprendizaje",
  description: "Chatbot con streaming en tiempo real para acompanar procesos de aprendizaje.",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body
        className="antialiased h-full overflow-hidden"
      >
        {children}
      </body>
    </html>
  );
}
