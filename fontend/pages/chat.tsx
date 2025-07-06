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

