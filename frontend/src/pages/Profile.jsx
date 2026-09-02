import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Linkedin, Github, Instagram, Send as TelegramIcon, Phone, MessageCircle, Lock } from "lucide-react";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "../components/Avatar.jsx";

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: me } = useAuth();
  const [profile, setProfile] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [connection, setConnection] = useState(null);
  const [phoneStatus, setPhoneStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [pendingPhoneRequests, setPendingPhoneRequests] = useState([]);

  const isOwnProfile = !id || id === me?._id;
  const targetId = id || me?._id;

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetId]);

  async function fetchProfile() {
    setLoading(true);
    try {
      if (isOwnProfile) {
        const { data } = await api.get("/users/me");
        setProfile(data);
        const { data: reqs } = await api.get("/phone-requests/received");
        setPendingPhoneRequests(reqs.filter((r) => r.status === "pending"));
      } else {
        const { data } = await api.get(`/users/${targetId}`);
        setProfile(data.user);
        setConnectionStatus(data.connectionStatus);
        setConnection(data.connection);
        setPhoneStatus(data.phoneRequestStatus);
      }
    } finally {
      setLoading(false);
    }
  }

  async function sendRequest() {
    setActionLoading(true);
    try {
      await api.post(`/connections/request/${targetId}`);
      setConnectionStatus("pending");
    } finally {
      setActionLoading(false);
    }
  }

  async function respondRequest(status) {
    setActionLoading(true);
    try {
      await api.put(`/connections/${connection._id}`, { status });
      setConnectionStatus(status);
    } finally {
      setActionLoading(false);
    }
  }

  async function requestPhone() {
    setActionLoading(true);
    try {
      await api.post(`/phone-requests/request/${targetId}`);
      setPhoneStatus("pending");
    } finally {
      setActionLoading(false);
    }
  }

  async function respondPhoneRequest(requestId, status) {
    await api.put(`/phone-requests/${requestId}`, { status });
    setPendingPhoneRequests((prev) => prev.filter((r) => r._id !== requestId));
  }

  if (loading) return <div className="vp-page-shell min-h-[calc(100vh-4rem)] flex items-start justify-center pt-16"><p className="text-ink/50 font-body">Loading...</p></div>;
  if (!profile) return <div className="vp-page-shell min-h-[calc(100vh-4rem)] flex items-start justify-center pt-16"><p className="text-ink/50 font-body">Profile not found.</p></div>;

  const isIncomingPending =
    connectionStatus === "pending" && connection?.recipient?.toString?.() === me?._id;
  const isConnected = connectionStatus === "accepted";

  return (
    <div className="vp-page-shell vp-page-shell-wide min-h-[calc(100vh-4rem)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6">
          <div className="flex items-end gap-4">
            <div className="vp-profile-avatar-ring rounded-full flex-shrink-0">
              <Avatar name={profile.name} src={profile.profilePic} size={96} />
            </div>
            <div className="pb-1">
              <h1 className="font-display text-2xl sm:text-3xl text-navy">{profile.name}</h1>
              <p className="text-sm text-ink/60 font-body">{profile.branch} · {profile.year}{profile.batch ? ` · Batch ${profile.batch}` : ""}</p>
              {profile.specialization && (
                <p className="text-sm text-orange font-body font-medium mt-0.5">{profile.specialization}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 pb-1 pt-3 sm:pt-0">
            <span className="badge-chip text-[10px] uppercase text-forest bg-forestLight px-3 py-1.5 rounded-full h-fit">
              VIT {profile.campus}
            </span>
            {isOwnProfile ? (
              <>
                <Link to="/profile/edit" className="bg-navy text-white px-4 py-2 rounded-full hover:bg-forest transition-colors font-body text-sm">
                  Edit profile
                </Link>
                <Link to="/settings" className="border border-line px-4 py-2 rounded-full hover:border-violet transition-colors font-body text-sm">
                  Choose your world
                </Link>
              </>
            ) : (
              <div className="font-body text-sm flex items-center gap-2">
                {isConnected && (
                  <>
                    <span className="text-forest font-medium">Connected</span>
                    <button onClick={() => navigate(`/messages/${targetId}`)}
                      className="flex items-center gap-1.5 bg-navy text-white px-4 py-2 rounded-full hover:bg-forest transition-colors">
                      <MessageCircle size={14} /> Message
                    </button>
                  </>
                )}
                {connectionStatus === "pending" && !isIncomingPending && (
                  <span className="text-ink/50">Request pending</span>
                )}
                {isIncomingPending && (
                  <div className="flex gap-2">
                    <button disabled={actionLoading} onClick={() => respondRequest("accepted")}
                      className="bg-forest text-white px-4 py-2 rounded-full hover:opacity-90">Accept</button>
                    <button disabled={actionLoading} onClick={() => respondRequest("rejected")}
                      className="border border-line px-4 py-2 rounded-full hover:bg-paper">Decline</button>
                  </div>
                )}
                {!connectionStatus && (
                  <button disabled={actionLoading} onClick={sendRequest}
                    className="bg-navy text-white px-4 py-2 rounded-full hover:bg-forest transition-colors disabled:opacity-50">
                    {actionLoading ? "Sending..." : "Connect"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Two-column body */}
        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6 pb-16">
          <div className="space-y-5">
            {profile.bio && (
              <div className="border border-line rounded-2xl bg-white p-5">
                <p className="text-xs uppercase tracking-wide text-ink/40 badge-chip mb-2">About</p>
                <p className="text-sm text-ink/80 font-body leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {(profile.interests?.length > 0 || profile.skills?.length > 0) && (
              <div className="border border-line rounded-2xl bg-white p-5">
                {profile.interests?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs uppercase tracking-wide text-ink/40 badge-chip mb-2">Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((s) => (
                        <span key={s} className="badge-chip text-[11px] bg-orangeLight text-orange rounded-full px-2.5 py-1">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.skills?.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-ink/40 badge-chip mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((s) => (
                        <span key={s} className="badge-chip text-[11px] border border-line rounded-full px-2.5 py-1 text-ink/70">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {profile.clubs?.length > 0 && (
              <div className="border border-line rounded-2xl bg-white p-5">
                <p className="text-xs uppercase tracking-wide text-ink/40 badge-chip mb-3">Clubs & Positions</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {profile.clubs.map((c, i) => (
                    <div key={i} className="border border-line rounded-xl px-3 py-2 bg-violetLight/40 text-xs font-body">
                      <p className="font-medium text-navy">{c.clubName}</p>
                      <p className="text-ink/50">{c.team && `${c.team} · `}{c.position}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social links */}
            {(profile.linkedin || profile.github || profile.instagram || profile.telegram) && (
              <div className="border border-line rounded-2xl bg-white p-5">
                <p className="text-xs uppercase tracking-wide text-ink/40 badge-chip mb-3">Elsewhere</p>
                <div className="flex items-center gap-3">
                  {profile.linkedin && (
                    <a href={profile.linkedin} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-forestLight text-forest flex items-center justify-center hover:opacity-80"><Linkedin size={16} /></a>
                  )}
                  {profile.github && (
                    <a href={profile.github} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-ink/10 text-ink flex items-center justify-center hover:opacity-80"><Github size={16} /></a>
                  )}
                  {profile.instagram && (
                    <a href={profile.instagram} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-rose/10 text-rose flex items-center justify-center hover:opacity-80"><Instagram size={16} /></a>
                  )}
                  {profile.telegram && (
                    <a href={profile.telegram} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-navy/10 text-navy flex items-center justify-center hover:opacity-80"><TelegramIcon size={16} /></a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: phone + requests */}
          <div className="space-y-5">
            {profile.phone && (
              <div className="border border-line rounded-2xl bg-white p-4">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-orangeLight text-orange flex items-center justify-center flex-shrink-0">
                    <Phone size={16} />
                  </span>
                  {isOwnProfile ? (
                    <div className="text-sm font-body min-w-0">
                      <p className="text-ink/40 text-xs">Your phone (only visible to people you approve)</p>
                      <p className="text-ink font-medium">{profile.phone}</p>
                    </div>
                  ) : phoneStatus === "approved" ? (
                    <div className="text-sm font-body min-w-0">
                      <p className="text-ink/40 text-xs">Phone number</p>
                      <p className="text-ink font-medium">{profile.phone}</p>
                    </div>
                  ) : (
                    <div className="flex-1 min-w-0 text-sm font-body">
                      <span className="text-ink/50 flex items-center gap-1 mb-2">
                        <Lock size={12} /> Phone number is private
                      </span>
                      {phoneStatus === "pending" ? (
                        <span className="text-ink/40 text-xs">Request sent</span>
                      ) : (
                        <button onClick={requestPhone} disabled={actionLoading}
                          className="text-xs bg-navy text-white px-3 py-1.5 rounded-full hover:bg-forest">
                          Request number
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {isOwnProfile && pendingPhoneRequests.length > 0 && (
              <div className="border border-line rounded-2xl bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-ink/40 badge-chip mb-3">
                  Phone number requests
                </p>
                <div className="space-y-2">
                  {pendingPhoneRequests.map((r) => (
                    <div key={r._id} className="flex items-center justify-between vp-surface-soft border border-line rounded-xl p-3 text-sm font-body">
                      <span className="text-ink">{r.requester.name} wants your number</span>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => respondPhoneRequest(r._id, "approved")} className="text-xs bg-forest text-white px-3 py-1.5 rounded-full">Allow</button>
                        <button onClick={() => respondPhoneRequest(r._id, "denied")} className="text-xs border border-line px-3 py-1.5 rounded-full">Deny</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
