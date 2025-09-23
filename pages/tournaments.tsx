import React, { useEffect, useState } from "react";
import AdminLayout from '../components/AdminLayout';

type Tournament = {
  _id?: string;
  name: string;
  date: string;
  location: string;
  registration: string;
  insurance: string;
};

export default function TournamentsPage() {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [form, setForm] = useState<Tournament>({
    name: "",
    date: "",
    location: "",
    registration: "",
    insurance: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Fetch tournament on mount
  useEffect(() => {
    fetchTournament();
    // eslint-disable-next-line
  }, []);

  async function fetchTournament() {
    setLoading(true);
    const res = await fetch("/api/tournaments");
    const data = await res.json();
    if (data.tournament) {
      setTournament(data.tournament);
      setForm({
        name: data.tournament.name || "",
        date: data.tournament.date || "",
        location: data.tournament.location || "",
        registration: data.tournament.registration || "",
        insurance: data.tournament.insurance || "",
        _id: data.tournament._id,
      });
    } else {
      setTournament(null);
      setForm({
        name: "",
        date: "",
        location: "",
        registration: "",
        insurance: "",
      });
    }
    setLoading(false);
    setEditMode(false);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    const body = { ...form };
    const res = await fetch("/api/tournaments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.success) {
      setMessage("Saved!");
      await fetchTournament();
    } else {
      setMessage("Error: " + data.error);
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!tournament?._id) return;
    if (!window.confirm("Are you sure you want to delete this tournament?")) return;
    setDeleting(true);
    const res = await fetch(`/api/tournaments?id=${tournament._id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.success) {
      setMessage("Deleted.");
      setTournament(null);
      setForm({
        name: "",
        date: "",
        location: "",
        registration: "",
        insurance: "",
      });
    } else {
      setMessage("Error: " + data.error);
    }
    setDeleting(false);
    setEditMode(false);
    await fetchTournament();
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-lg">Loading...</div>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Tournament Management</h1>

        {/* Live Preview Section */}
        {(editMode || !tournament) && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-2">Live Preview</h2>
            <div className="mb-2"><span className="font-semibold">Name:</span> {form.name || <span className="text-gray-400">(none)</span>}</div>
            <div className="mb-2"><span className="font-semibold">Date:</span> {form.date || <span className="text-gray-400">(none)</span>}</div>
            <div className="mb-2"><span className="font-semibold">Location:</span> {form.location || <span className="text-gray-400">(none)</span>}</div>
            <div className="mb-2"><span className="font-semibold">Registration:</span> {form.registration || <span className="text-gray-400">(none)</span>}</div>
            <div className="mb-2"><span className="font-semibold">Insurance:</span> {form.insurance || <span className="text-gray-400">(none)</span>}</div>
          </div>
        )}

        {/* Existing tournament display */}
        {tournament && !editMode && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="mb-2"><span className="font-semibold">Name:</span> {tournament.name}</div>
            <div className="mb-2"><span className="font-semibold">Date:</span> {tournament.date}</div>
            <div className="mb-2"><span className="font-semibold">Location:</span> {tournament.location}</div>
            <div className="mb-2"><span className="font-semibold">Registration:</span> {tournament.registration}</div>
            <div className="mb-2"><span className="font-semibold">Insurance:</span> {tournament.insurance}</div>
            <div className="flex gap-2 mt-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setEditMode(true)}
              >
                Edit
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        )}

        {(editMode || !tournament) && (
          <form
            className="bg-gray-100 p-6 rounded-lg shadow"
            onSubmit={handleSubmit}
          >
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Name</label>
              <input
                className="w-full p-2 border rounded"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Date</label>
              <input
                className="w-full p-2 border rounded"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Location</label>
              <input
                className="w-full p-2 border rounded"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Registration</label>
              <input
                className="w-full p-2 border rounded"
                name="registration"
                value={form.registration}
                onChange={handleChange}
                required
                placeholder="e.g. 34/50"
                disabled={loading}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Insurance</label>
              <input
                className="w-full p-2 border rounded"
                name="insurance"
                value={form.insurance}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={loading}
              >
                {tournament ? "Save Changes" : "Add Tournament"}
              </button>
              {tournament && (
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  onClick={() => setEditMode(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
            </div>
            {message && (
              <div className="mt-4 text-center text-blue-700">{message}</div>
            )}
          </form>
        )}
      </div>
    </AdminLayout>
  );
}