import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "../components/Avatar.jsx";

export default function Connections() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/connections").then(({ data }) => {
      setConnections(data);
      setLoading(false);
    });
  }, []);

  async function respond(id, status) {
    await api.put(`/connections/${id}`, { status });
    setConnections((prev) => prev.map((c) => (c._id === id ? { ...c, status } : c)));
  }

  if (loading) return <p className="text-center mt-16 text-ink/50 font-body">Loading...</p>;

  const incoming = connections.filter((c) => c.status === "pending" && c.recipient._id === user._id);
  const outgoing = connections.filter((c) => c.status === "pending" && c.requester._id === user._id);
  const accepted = connections.filter((c) => c.status === "accepted");

  function otherPerson(c) {
    return c.requester._id === user._id ? c.recipient : c.requester;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 font-body">
      <h1 className="font-display text-3xl text-navy mb-8">Your connections</h1>

      {incoming.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm uppercase tracking-wide text-ink/50 badge-chip mb-3">
            Requests to review
          </h2>
          <div className="space-y-2">
            {incoming.map((c) => (
              <div key={c._id} className="flex items-center justify-between border border-line rounded-xl bg-white p-3">
                <Link to={`/profile/${otherPerson(c)._id}`} className="flex items-center gap-3 text-sm min-w-0">
                  <Avatar name={otherPerson(c).name} src={otherPerson(c).profilePic} size={36} />
                  <span className="truncate">
                    <span className="font-medium text-ink">{otherPerson(c).name}</span>
                    <span className="text-ink/50"> · {otherPerson(c).branch}, {otherPerson(c).campus}</span>
                  </span>
                </Link>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => respond(c._id, "accepted")} className="text-xs bg-forest text-white px-3 py-1.5 rounded-full">
                    Accept
                  </button>
                  <button onClick={() => respond(c._id, "rejected")} className="text-xs border border-line px-3 py-1.5 rounded-full">
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8">
        <h2 className="text-sm uppercase tracking-wide text-ink/50 badge-chip mb-3">
          Connected ({accepted.length})
        </h2>
        {accepted.length === 0 ? (
          <p className="text-sm text-ink/50">No connections yet — go discover some students!</p>
        ) : (
          <div className="space-y-2">
            {accepted.map((c) => (
              <div key={c._id} className="flex items-center justify-between border border-line rounded-xl bg-white p-3 hover:border-forest transition-colors">
                <Link to={`/profile/${otherPerson(c)._id}`} className="flex items-center gap-3 text-sm min-w-0">
                  <Avatar name={otherPerson(c).name} src={otherPerson(c).profilePic} size={36} />
                  <span className="truncate">
                    <span className="font-medium text-ink">{otherPerson(c).name}</span>
                    <span className="text-ink/50"> · {otherPerson(c).branch}, {otherPerson(c).campus}</span>
                  </span>
                </Link>
                <button
                  onClick={() => navigate(`/messages/${otherPerson(c)._id}`)}
                  className="w-9 h-9 rounded-full bg-forestLight text-forest flex items-center justify-center hover:opacity-80 flex-shrink-0"
                  title="Message"
                >
                  <MessageCircle size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {outgoing.length > 0 && (
        <section>
          <h2 className="text-sm uppercase tracking-wide text-ink/50 badge-chip mb-3">
            Pending (sent by you)
          </h2>
          <div className="space-y-2">
            {outgoing.map((c) => (
              <div key={c._id} className="flex items-center gap-3 border border-line rounded-xl bg-white p-3 text-sm">
                <Avatar name={otherPerson(c).name} src={otherPerson(c).profilePic} size={32} />
                <span>
                  <span className="font-medium text-ink">{otherPerson(c).name}</span>
                  <span className="text-ink/50"> · awaiting response</span>
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
