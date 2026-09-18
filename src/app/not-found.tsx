import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
      <p className="text-5xl">🌾</p>
      <h1 className="mt-4 text-2xl font-bold text-plum">Página no encontrada</h1>
      <p className="mt-2 text-ink/60">Lo que buscabas no está aquí, pero el camino sigue.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="rounded-full bg-plum px-5 py-2 text-sm font-semibold text-white">
          Inicio
        </Link>
        <Link href="/foros" className="rounded-full border border-plum/25 px-5 py-2 text-sm font-semibold text-plum">
          Foros
        </Link>
      </div>
    </div>
  );
}
