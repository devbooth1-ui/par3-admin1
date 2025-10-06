import { useEffect, useState } from "react";
import AdminLayout from '../components/AdminLayout';

// Claim type
interface Claim {
  _id?: string;
  id?: string;
  playerEmail: string;
  course: string;
  date: string;
  status: 'pending' | 'verified' | 'rejected';
  videoRef?: string;
}

export default function ClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'verified' | 'rejected' | 'all'>('pending');

  useEffect(() => {
    fetch('/api/claims')
      .then(res => res.json())
      .then(data => {
        setClaims(Array.isArray(data.claims) ? data.claims : Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setClaims([]);
        setLoading(false);
      });
  }, []);

  // Filter claims by status
  const filteredClaims = claims.filter((claim: Claim) => {
    if (filter === 'all') return true;
    return claim.status === filter;
  });

  // Handler to verify/reject claims and send notification
  const updateStatus = async (id: string, status: 'pending' | 'verified' | 'rejected') => {
    await fetch(`/api/claims/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    // Optionally send notification to player (pseudo-code)
    // await fetch(`/api/notifications`, { method: 'POST', body: JSON.stringify({ playerId, status }) });
    // Refresh claims list
    const res = await fetch("/api/claims");
    const data = await res.json();
    setClaims(Array.isArray(data.claims) ? data.claims : Array.isArray(data) ? data : []);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading claims...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto py-8 px-2">
        <h1 className="text-2xl font-bold mb-6">Claims Verification</h1>
        <div className="mb-4 flex gap-2">
          <button className={`px-3 py-1 rounded ${filter==='pending'?'bg-blue-500 text-white':'bg-gray-200'}`} onClick={()=>setFilter('pending')}>Pending</button>
          <button className={`px-3 py-1 rounded ${filter==='verified'?'bg-green-500 text-white':'bg-gray-200'}`} onClick={()=>setFilter('verified')}>Verified</button>
          <button className={`px-3 py-1 rounded ${filter==='rejected'?'bg-red-500 text-white':'bg-gray-200'}`} onClick={()=>setFilter('rejected')}>Rejected</button>
          <button className={`px-3 py-1 rounded ${filter==='all'?'bg-black text-white':'bg-gray-200'}`} onClick={()=>setFilter('all')}>All</button>
        </div>
        <div className="space-y-4">
          {filteredClaims.length === 0 ? (
            <div className="text-center text-gray-500">No claims to review.</div>
          ) : (
            filteredClaims.map((claim) => (
              <div key={claim._id || claim.id} className="bg-white rounded shadow p-4 flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <div><strong>Player:</strong> {claim.playerEmail}</div>
                  <div><strong>Course:</strong> {claim.course}</div>
                  <div><strong>Date:</strong> {claim.date}</div>
                  <div><strong>Status:</strong> <span className={`font-bold ${claim.status==='verified'?'text-green-600':claim.status==='rejected'?'text-red-600':'text-yellow-600'}`}>{claim.status}</span></div>
                  {claim.videoRef && <div><strong>Video:</strong> <a href={claim.videoRef} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a></div>}
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  {claim.status === 'pending' && (claim._id || claim.id) && (
                    <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={()=>updateStatus((claim._id ?? claim.id)!, 'verified')}>Verify</button>
                  )}
                  {claim.status === 'pending' && (claim._id || claim.id) && (
                    <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={()=>updateStatus((claim._id ?? claim.id)!, 'rejected')}>Reject</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
