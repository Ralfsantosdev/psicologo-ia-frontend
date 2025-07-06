/frontend/pages/index.tsx – Landing Page com login
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
