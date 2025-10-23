import { useEffect, useState } from 'react';
import { apiGet, apiPatch } from '../../lib/api';

type Claim = {
  id: string;
  type: 'BIRDIE' | 'HIO';
  entryId: string;
  playerName?: string;
  courseName?: string;
  hole?: number;
  teeTime?: string;
  outfit?: string;
  videoUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'DENIED';
};

export default function ClaimsQueue() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      const data = await apiGet<Claim[]>('/api/v1/claims?status=pending');
      setClaims(data);
    } catch (e:any) {
      setError(e.message || 'Failed to load');
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function decide(id:string, approved:boolean) {
    try {
      await apiPatch(`/api/v1/claims/${id}/decision`, { approved });
      await load();
    } catch (e:any) {
      alert(e.message || 'Decision failed');
    }
  }

  if (loading) return <p className="p-6">Loading…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Claims Queue</h1>
      {claims.length === 0 && <p>No pending claims.</p>}
      <ul className="grid gap-4">
        {claims.map(c => (
          <li key={c.id} className="rounded-2xl border p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-semibold">{c.type} — {c.playerName ?? 'Player'} • {c.courseName ?? 'Course'} {c.hole ? ` (Hole ${c.hole})` : ''}</div>
                <div className="text-sm text-gray-600">Tee time: {c.teeTime ?? '—'} • Outfit: {c.outfit ?? '—'}</div>
                {c.videoUrl && <a className="text-blue-600 underline" href={c.videoUrl} target="_blank" rel="noreferrer">Video evidence</a>}
              </div>
              <div className="flex gap-2">
                <button onClick={()=>decide(c.id,true)} className="px-3 py-2 rounded-xl bg-green-600 text-white">Approve</button>
                <button onClick={()=>decide(c.id,false)} className="px-3 py-2 rounded-xl bg-red-600 text-white">Deny</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
