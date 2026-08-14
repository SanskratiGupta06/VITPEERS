import { useEffect, useState } from "react";
import { Video, Check, X } from "lucide-react";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "../components/Avatar.jsx";

function formatTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function Calls() {
  const { user } = useAuth();
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get("/calls/schedule");
      setCalls(data);
    } finally {
      setLoading(false);
    }
  }

  async function respond(id, status) {
    await api.put(`/calls/schedule/${id}`, { status });
    setCalls((prev) => prev.map((c) => (c._id === id ? { ...c, status } : c)));
  }

  function otherPerson(c) {
    return c.requester._id === user._id ? c.recipient : c.requester;
  }

  function join(roomId) {
    window.open(`https://meet.jit.si/${roomId}`, "_blank", "noopener,noreferrer");
  }

  if (loading) return <p className="text-center mt-16 text-ink/50 font-body">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 font-body">
      <h1 className="font-display text-3xl text-navy mb-8">Scheduled calls</h1>

      {calls.length === 0 ? (
        <p className="text-sm text-ink/50">
          No calls scheduled yet — propose one from a chat with a connection.
        </p>
      ) : (
        <div className="space-y-3">
          {calls.map((c) => {
            const other = otherPerson(c);
            const isRecipient = c.recipient._id === user._id;
            return (
              <div key={c._id} className="border border-line rounded-xl bg-white p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar name={other.name} src={other.profilePic} size={36} />
                  <div>
                    <p className="text-sm font-medium text-ink">{other.name}</p>
                    <p className="text-xs text-ink/50">{formatTime(c.proposedTime)}</p>
                  </div>
                </div>
                {c.note && <p className="text-sm text-ink/70 mb-2">"{c.note}"</p>}

                {c.status === "pending" && isRecipient && (
                  <div className="flex gap-2">
                    <button onClick={() => respond(c._id, "accepted")} className="flex items-center gap-1 text-xs bg-forest text-white px-3 py-1.5 rounded-full">
                      <Check size={12} /> Accept
                    </button>
                    <button onClick={() => respond(c._id, "declined")} className="flex items-center gap-1 text-xs border border-line px-3 py-1.5 rounded-full">
                      <X size={12} /> Decline
                    </button>
                  </div>
                )}
                {c.status === "pending" && !isRecipient && (
                  <span className="text-xs text-ink/40">Waiting for {other.name} to respond</span>
                )}
                {c.status === "accepted" && (
                  <button onClick={() => join(c.roomId)} className="flex items-center gap-1.5 text-xs bg-navy text-white px-3 py-1.5 rounded-full">
                    <Video size={12} /> Join call
                  </button>
                )}
                {c.status === "declined" && <span className="text-xs text-rose">Declined</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
