import { useState } from "react";
import { X } from "lucide-react";
import api from "../api.js";

export default function ScheduleCallModal({ recipientId, onClose, onScheduled }) {
  const [proposedTime, setProposedTime] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post(`/calls/schedule/${recipientId}`, { proposedTime, note });
      onScheduled?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Could not schedule the call");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm font-body">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg text-navy">Schedule a call</h2>
          <button onClick={onClose} className="text-ink/40 hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs uppercase tracking-wide text-ink/50 badge-chip">
              Proposed date & time
            </label>
            <input
              type="datetime-local"
              required
              value={proposedTime}
              onChange={(e) => setProposedTime(e.target.value)}
              className="w-full mt-1 border border-line rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-forest"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-ink/50 badge-chip">
              Note (optional)
            </label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What would you like to discuss?"
              className="w-full mt-1 border border-line rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-forest"
            />
          </div>

          {error && <p className="text-sm text-rose">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy text-white py-2.5 rounded-md hover:bg-forest transition-colors disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send proposal"}
          </button>
          <p className="text-xs text-ink/40 text-center">
            They'll need to accept before the call is confirmed.
          </p>
        </form>
      </div>
    </div>
  );
}
