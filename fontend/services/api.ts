
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
