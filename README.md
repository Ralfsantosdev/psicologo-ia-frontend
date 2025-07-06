
// ================= FRONTEND =================

// 🔹 /frontend/README.md
/*
# Psicólogo de Bolso com IA — Frontend

Este é o frontend do aplicativo "Psicólogo de Bolso com IA", desenvolvido com Next.js e TailwindCSS. Ele se comunica com um backend independente via API REST para fornecer sessões terapêuticas com inteligência artificial baseada em TCC (Terapia Cognitivo-Comportamental).

## 🧠 Funcionalidades
- Login com Supabase (e-mail)
- Interface de chat com IA
- Limite diário de uso gratuito
- Integração com backend via REST API

## 📦 Tecnologias Utilizadas
- [Next.js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Supabase Auth](https://supabase.com/)
- [OpenAI GPT](https://platform.openai.com/docs)

## 🚀 Instalação

```bash
npm install
npm run dev
```

## 📁 Estrutura de Pastas
- `pages/index.tsx`: Landing page com login
- `pages/chat.tsx`: Interface de sessão terapêutica com IA
- `services/api.ts`: Comunicação com o backend

## 🔐 Variáveis de Ambiente (.env.local)

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 🌐 Deploy
Recomendado: [Vercel](https://vercel.com)

*/

// 🔹 /frontend/pages/index.tsx – Landing Page com login
import Link from 'next/link';
import { useSession, signIn } from '@supabase/auth-helpers-react';

export default function Home() {
  const session = useSession();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-blue-100 to-white">
      <h1 className="text-3xl md:text-5xl font-bold text-center text-blue-800 mb-4">Seu Psicólogo de Bolso, 24h por dia</h1>
      <p className="text-center text-gray-700 max-w-xl mb-6">
        Fale com uma IA treinada com empatia e técnicas terapêuticas. Seguro, anônimo e imediato.
      </p>
      {session ? (
        <Link href="/chat" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl shadow-lg">
          Comece sua Sessão
        </Link>
      ) : (
        <button onClick={() => signIn()} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl shadow-lg">
          Entrar com e-mail
        </button>
      )}
    </main>
  );
}

// 🔹 /frontend/pages/chat.tsx – Interface com a IA
import { useState, useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { sendMessage } from '../services/api';

export default function Chat() {
  const user = useUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    if (user) fetch(`/api/check-usage?userId=${user.id}`).then(res => res.json()).then(data => setLimitReached(data.limit));
  }, [user]);

  async function handleSend() {
    if (!input.trim() || limitReached) return;
    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');

    const aiResponse = await sendMessage([...messages, userMessage]);
    setMessages([...messages, userMessage, aiResponse]);
    fetch('/api/log-usage', { method: 'POST', body: JSON.stringify({ userId: user.id }) });
  }

  return (
    <div className="p-4 max-w-2xl mx-auto min-h-screen bg-white">
      <h2 className="text-xl font-semibold text-center text-blue-700 mb-4">Sessão Terapêutica com IA</h2>
      {limitReached && <p className="text-red-600">Limite diário atingido. Faça upgrade.</p>}
      <div className="space-y-3 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`p-3 rounded-xl ${msg.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-grow border border-gray-300 p-2 rounded-xl"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Escreva sua preocupação aqui..."
        />
        <button onClick={handleSend} disabled={limitReached} className="bg-blue-600 text-white px-4 py-2 rounded-xl">Enviar</button>
      </div>
    </div>
  );
}

// 🔹 /frontend/services/api.ts – Comunicação com backend
export async function sendMessage(messages) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });
  const data = await res.json();
  return data.reply;
}

