import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bell, MessageCircle, Users, Compass, Video, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api.js";
import Avatar from "./Avatar.jsx";
import Logo from "./Logo.jsx";

function NavBadgeLink({ to, icon, label, count }) {
  return (
    <NavLink to={to} className={({ isActive }) =>
      `relative flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-body transition-colors ${isActive ? "bg-white/15 text-white" : "text-white/75 hover:text-white hover:bg-white/10"}`
    }>
      {icon}<span className="hidden sm:inline">{label}</span>
      {count > 0 && <span className="absolute -top-1 -right-1 bg-orange text-white text-[10px] rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">{count > 9 ? "9+" : count}</span>}
    </NavLink>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [unreadMsgs, setUnreadMsgs] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchCounts();
    const interval = setInterval(fetchCounts, 15000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function fetchCounts() {
    try {
      const [n, m] = await Promise.all([api.get("/notifications/unread-count"), api.get("/messages/unread-count")]);
      setUnreadNotifs(n.data.count); setUnreadMsgs(m.data.count);
    } catch {}
  }

  return (
    <header className="bg-vm-gradient sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Logo size={34} wordmark wordmarkClass="text-xl text-white" />
        </Link>

        {user ? (
          <>
            <nav className="hidden md:flex items-center gap-1">
              <NavBadgeLink to="/discover" icon={<Compass size={18} />} label="Discover" />
              <NavBadgeLink to="/connections" icon={<Users size={18} />} label="Connections" />
              <NavBadgeLink to="/messages" icon={<MessageCircle size={18} />} label="Messages" count={unreadMsgs} />
              <NavBadgeLink to="/calls" icon={<Video size={18} />} label="Calls" />
              <NavBadgeLink to="/notifications" icon={<Bell size={18} />} label="Alerts" count={unreadNotifs} />
              <Link to="/profile" className="ml-1"><Avatar name={user.name} src={user.profilePic} size={32} /></Link>
              <button onClick={() => { logout(); navigate("/login"); }} className="text-xs text-white/70 hover:text-white ml-2 underline font-body">Log out</button>
            </nav>
            <button className="md:hidden text-white p-2" onClick={() => setOpen((v) => !v)} aria-label="Open navigation">{open ? <X /> : <Menu />}</button>
          </>
        ) : (
          <>
            <nav className="hidden md:flex items-center gap-3 font-body text-sm">
              <div className="flex items-center gap-5 mr-2">
                <a href="/#about" className="text-white/70 hover:text-white">About</a>
                <a href="/#why" className="text-white/70 hover:text-white">Why VITPEERS</a>
                <a href="/#how" className="text-white/70 hover:text-white">How it works</a>
                <a href="/#community" className="text-white/70 hover:text-white">Community</a>
              </div>
              <Link to="/login" className="text-white border border-white/20 hover:bg-white/10 px-4 py-2 rounded-full transition">Log in</Link>
              <Link to="/signup" className="bg-vm-warm text-white px-4 py-2 rounded-full hover:brightness-110 font-medium transition">Join VITPEERS</Link>
            </nav>
            <div className="md:hidden flex items-center gap-2">
              <Link to="/signup" className="bg-vm-warm text-white text-sm px-4 py-2 rounded-full font-medium">Join</Link>
              <button className="text-white p-2" onClick={() => setOpen((v) => !v)} aria-label="Open navigation">{open ? <X /> : <Menu />}</button>
            </div>
          </>
        )}

        {!user && open && (
          <div className="absolute top-16 left-0 right-0 bg-navy border-t border-white/10 p-3 md:hidden">
            <div className="grid gap-1">
              <a href="/#about" onClick={() => setOpen(false)} className="text-white/80 hover:text-white px-3 py-3 rounded-xl hover:bg-white/10">About</a>
              <a href="/#why" onClick={() => setOpen(false)} className="text-white/80 hover:text-white px-3 py-3 rounded-xl hover:bg-white/10">Why VITPEERS</a>
              <a href="/#how" onClick={() => setOpen(false)} className="text-white/80 hover:text-white px-3 py-3 rounded-xl hover:bg-white/10">How it works</a>
              <a href="/#community" onClick={() => setOpen(false)} className="text-white/80 hover:text-white px-3 py-3 rounded-xl hover:bg-white/10">Community</a>
              <Link to="/login" onClick={() => setOpen(false)} className="text-white/80 hover:text-white px-3 py-3 rounded-xl hover:bg-white/10">Log in</Link>
            </div>
          </div>
        )}

        {user && open && (
          <div className="absolute top-16 left-0 right-0 bg-navy border-t border-white/10 p-3 md:hidden">
            <div className="grid gap-1">
              {[["/discover","Discover"],["/connections","Connections"],["/messages","Messages"],["/calls","Calls"],["/notifications","Alerts"],["/profile","Profile"]].map(([to,label]) =>
                <Link key={to} to={to} onClick={() => setOpen(false)} className="text-white/80 hover:text-white px-3 py-3 rounded-xl hover:bg-white/10">{label}</Link>
              )}
              <button onClick={() => { logout(); navigate("/login"); setOpen(false); }} className="text-left text-white/60 px-3 py-3">Log out</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
