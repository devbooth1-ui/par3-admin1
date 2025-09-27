import React, { useEffect, useState } from "react";
import AdminLayout from '../components/AdminLayout';

export default function ClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch claims from backend API
    const fetchClaims = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/claims");
        const data = await res.json();
        setClaims(data);
      } catch (error) {
        console.error('Failed to fetch claims:', error)
        setClaims([])
      } finally {
        setLoading(false)
      }
    };
    fetchClaims();
  }, []);

  // Handler to verify/reject claims
  const updateStatus = async (id, status) => {
    await fetch(`/api/claims/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    // Refresh claims list
    const res = await fetch("/api/claims");
    setClaims(await res.json());
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
        <div className="space-y-4">
          {claims.length === 0 ? (
            <div className="text-center text-gray-500">No claims to review.</div>
          ) : (
            claims.map((claim) => (
              <div key={claim.id} className="bg-white rounded shadow p-4 flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <div className="font-semibold text-blue-900">{claim.playerName} ({claim.playerEmail})</div>
                  <div className="text-xs text-gray-600">
                    Outfit: {claim.outfitDescription}<br />
                    Date: {claim.teeDate} Time: {claim.teeTime}<br />
                    Course: {claim.course} Hole: {claim.hole}<br />
                    Payment: {claim.paymentMethod}
                  </div>
                  <div className="text-xs font-semibold mt-2">
                    Status: <span className={claim.status === "verified" ? "text-green-600" : claim.status === "rejected" ? "text-red-600" : "text-yellow-600"}>{claim.status}</span>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 mt-2 sm:mt-0 sm:ml-4">
                  {claim.status === "pending" && (
                    <>
                      <button className="bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold"
                        onClick={() => updateStatus(claim.id, "verified")}>
                        Verify
                      </button>
                      <button className="bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold"
                        onClick={() => updateStatus(claim.id, "rejected")}>
                        Reject
                      </button>
                    </>
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
