import { useEffect, useState } from "react";
import { apiGet, apiPatch } from "../../lib/api";

type Claim = {
  id: string;
  type: "BIRDIE" | "HIO";
  entryId: string;
  playerName?: string;
  courseName?: string;
  hole?: number;
  teeTime?: string;   // ISO string or human
  outfit?: string;
  videoUrl?: string;  // link to evidence
  status: "PENDING" | "APPROVED" | "DENIED";
};

export default function ClaimsQueue() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      const data = await apiGet<Claim[]>("/api/claims?status=pending");
      setClaims(data);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function decide(id: string, approved: boolean) {
    try {
      await apiPatch(`/api/claims/${id}`, { approved });
      await load();
    } catch (e: any) {
      alert(e.message || "Decision failed");
    }
  }

  if (loading) return <p className="p-6">Loading…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Claims Queue</h1>
        <button
          onClick={load}
          className="rounded-xl px-3 py-2 border hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {claims.length === 0 && (
        <p className="rounded-xl border p-4">No pending claims.</p>
      )}

      <ul className="grid gap-4">
        {claims.map((c) => (
          <li key={c.id} className="rounded-2xl border p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="font-semibold">
                  {c.type} — {c.playerName ?? "Player"} •{" "}
                  {c.courseName ?? "Course"} {c.hole ? `(Hole ${c.hole})` : ""}
                </div>
                <div className="text-sm text-gray-600">
                  Tee time: {c.teeTime ?? "—"} • Outfit: {c.outfit ?? "—"}
                </div>
                <div className="text-sm">
                  Entry ID: <span className="font-mono">{c.entryId}</span>
                </div>
                {c.videoUrl && (
                  <a
                    className="text-blue-600 underline"
                    href={c.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Video evidence
                  </a>
                )}
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => decide(c.id, true)}
                  className="px-3 py-2 rounded-xl bg-green-600 text-white"
                >
                  Approve
                </button>
                <button
                  onClick={() => decide(c.id, false)}
                  className="px-3 py-2 rounded-xl bg-red-600 text-white"
                >
                  Deny
                </button>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Status: {c.status}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
