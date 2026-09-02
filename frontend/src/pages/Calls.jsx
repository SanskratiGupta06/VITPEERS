import { useEffect, useState } from "react";
import { Video, Check, X, Flag, Clock3, Radio, ArrowUpRight } from "lucide-react";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "../components/Avatar.jsx";

function formatTime(iso) { return new Date(iso).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }); }

export default function Calls() {
  const { user } = useAuth(); const [calls, setCalls] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(() => { load(); }, []);
  async function load() { setLoading(true); try { const { data } = await api.get("/calls/schedule"); setCalls(data); } finally { setLoading(false); } }
  async function respond(id, status) { await api.put(`/calls/schedule/${id}`, { status }); setCalls((prev) => prev.map((c) => c._id === id ? { ...c, status } : c)); }
  function otherPerson(c) { return c.requester._id === user._id ? c.recipient : c.requester; }
  function join(roomId) { window.open(`https://meet.jit.si/${roomId}`, "_blank", "noopener,noreferrer"); }
  if (loading) return <div className="vp-page-shell min-h-[calc(100vh-4rem)] flex items-start justify-center pt-16"><p className="text-ink/50 font-body">Loading race control...</p></div>;
  return (
    <div className="vp-page-shell vp-calls-shell min-h-[calc(100vh-4rem)]"><div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <div className="vp-race-header"><div><span className="section-kicker">RACE CONTROL / VITPEERS</span><h1 className="font-display text-4xl sm:text-5xl mt-2">Call briefing.</h1><p className="font-body opacity-65 mt-3 max-w-xl">Your scheduled conversations, laid out like a race weekend briefing. Accept, decline or join without losing the useful details.</p></div><div className="vp-telemetry"><span /><span /><span /><b>LIVE</b></div></div>
      {calls.length === 0 ? <div className="vp-empty-state mt-8"><Radio size={22} /><p>No calls scheduled yet — propose one from a chat with a connection.</p></div> : <div className="grid gap-5 mt-8">{calls.map((c, index) => {
        const other = otherPerson(c); const isRecipient = c.recipient._id === user._id;
        return <article key={c._id} className={`vp-race-card status-${c.status}`}>
          <div className="vp-race-number">{String(index + 1).padStart(2, "0")}</div><div className="vp-race-main">
            <div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-4 min-w-0"><div className="vp-race-avatar"><Avatar name={other.name} src={other.profilePic} size={52} /></div><div className="min-w-0"><p className="text-[10px] uppercase tracking-[.16em] opacity-45 badge-chip">Opponent / peer</p><h2 className="font-display text-xl truncate mt-1">{other.name}</h2></div></div><span className="vp-race-status">{c.status === "accepted" ? "CONFIRMED" : c.status === "declined" ? "DECLINED" : "AWAITING RESPONSE"}</span></div>
            <div className="grid sm:grid-cols-2 gap-3 mt-6"><div className="vp-race-detail"><Clock3 size={15} /><div><span>START TIME</span><b>{formatTime(c.proposedTime)}</b></div></div><div className="vp-race-detail"><Flag size={15} /><div><span>FORMAT</span><b>{c.status === "accepted" ? "Live VITPEERS room" : "Scheduled conversation"}</b></div></div></div>
            {c.note && <div className="vp-race-note"><span>BRIEFING NOTE</span><p>“{c.note}”</p></div>}
            <div className="flex flex-wrap items-center gap-2 mt-5">{c.status === "pending" && isRecipient && <><button onClick={() => respond(c._id, "accepted")} className="vp-race-primary"><Check size={14}/> Accept briefing</button><button onClick={() => respond(c._id, "declined")} className="vp-race-secondary"><X size={14}/> Decline</button></>}{c.status === "pending" && !isRecipient && <span className="vp-race-muted">Waiting for {other.name} to respond.</span>}{c.status === "accepted" && <button onClick={() => join(c.roomId)} className="vp-race-primary"><Video size={14}/> Join call <ArrowUpRight size={14}/></button>}</div>
          </div>
        </article>;
      })}</div>}
    </div></div>
  );
}
