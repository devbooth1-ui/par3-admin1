import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-8 space-y-6">
      <h1 className="text-3xl font-bold">Par 3 Admin</h1>
      <div className="space-x-3">
        <Link href="/claims" className="inline-block rounded-2xl px-4 py-2 bg-black text-white">Review Claims</Link>
      </div>
      <p className="text-gray-600">Backend: {process.env.NEXT_PUBLIC_API_URL || 'not set'}</p>
    </main>
  );
}
