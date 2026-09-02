import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowUpRight, GraduationCap, MapPin, Sparkles } from "lucide-react";
import api from "../api.js";
import Avatar from "../components/Avatar.jsx";
import { CAMPUS_OPTIONS, YEARS, getLevels, getProgrammes } from "../data/programs.js";

const CAMPUS_COLORS = { Bhopal: "bg-forestLight text-forest", Vellore: "bg-orangeLight text-orange", Chennai: "bg-navy/10 text-navy", Amravati: "bg-rose/10 text-rose" };

export default function Discover() {
  const [filters, setFilters] = useState({ campus: "", programmeLevel: "", branch: "", year: "", search: "" });
  const [users, setUsers] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(() => { const timeout = setTimeout(() => fetchUsers(), 300); return () => clearTimeout(timeout); }, [filters]);
  async function fetchUsers() { setLoading(true); try { const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v)); const { data } = await api.get("/users/discover", { params }); setUsers(data); } finally { setLoading(false); } }

  return (
    <div className="vp-page-shell vp-discover-shell min-h-[calc(100vh-4rem)]">
      <div className="vp-discover-hero"><div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-10">
        <span className="section-kicker">VITPEERS / NETWORK SEARCH</span>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mt-2">
          <div><h1 className="font-display text-4xl sm:text-5xl text-white">Find your next connection.</h1><p className="text-sm sm:text-base text-white/65 font-body mt-3 max-w-2xl">Search the VIT network by campus, programme, year and interests — then open a profile like a driver card.</p></div>
          <div className="vp-page-status"><span /> NETWORK ONLINE</div>
        </div>
      </div></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 relative z-10">
        <div className="vp-filter-panel">
          <div className="relative flex-1 min-w-[220px]"><Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-45" /><input placeholder="Search by name, skill, specialization" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="w-full pl-10 pr-4 py-3 rounded-xl" /></div>
          <select value={filters.campus} onChange={(e) => setFilters({ ...filters, campus: e.target.value, programmeLevel: "", branch: "" })} className="vp-filter-control"><option value="">All campuses</option>{CAMPUS_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select>
          <select value={filters.programmeLevel} onChange={(e) => setFilters({ ...filters, programmeLevel: e.target.value, branch: "" })} className="vp-filter-control" disabled={!filters.campus}><option value="">All programme levels</option>{getLevels(filters.campus).map((level) => <option key={level}>{level}</option>)}</select>
          <select value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value })} className="vp-filter-control">{YEARS.map((y) => <option key={y} value={y}>{y || "All years"}</option>)}</select>
          <select value={filters.branch} onChange={(e) => setFilters({ ...filters, branch: e.target.value })} className="vp-filter-control" disabled={!filters.campus || !filters.programmeLevel}><option value="">All programmes</option>{getProgrammes(filters.campus, filters.programmeLevel).map((p) => <option key={p}>{p}</option>)}</select>
        </div>
        <div className="flex items-center justify-between mt-8 mb-4"><p className="vp-result-label">{loading ? "Scanning the network…" : `${users.length} profiles found`}</p><span className="vp-result-hint hidden sm:inline">PROFILE MODE / {filters.campus || "ALL CAMPUSES"}</span></div>
        {loading ? <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-16">{[1,2,3,4,5,6].map((n) => <div key={n} className="vp-driver-skeleton" />)}</div> : users.length === 0 ? <div className="vp-empty-state"><Sparkles size={22} /><p>No students match these filters yet. Try widening your search.</p></div> : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-16">
            {users.map((u, i) => <Link to={`/profile/${u._id}`} key={u._id} className="vp-driver-card group" style={{ "--card-delay": `${i * 55}ms` }}>
              <div className="vp-driver-topline"><span>DRIVER {String(i + 1).padStart(2, "0")}</span><span className="vp-driver-dot" /></div>
              <div className="flex items-center gap-4 mt-5"><div className="vp-driver-avatar"><Avatar name={u.name} src={u.profilePic} size={64} /></div><div className="min-w-0"><h2 className="font-display text-xl truncate">{u.name}</h2><p className="text-sm opacity-60 font-body truncate">{u.specialization || u.branch || "VIT student"}</p></div></div>
              <div className="grid grid-cols-2 gap-2 mt-6"><div className="vp-driver-stat"><span><MapPin size={13} /></span><b>{u.campus || "VIT"}</b></div><div className="vp-driver-stat"><span><GraduationCap size={13} /></span><b>{u.year || "—"}</b></div></div>
              <div className="flex items-center justify-between mt-5"><span className={`badge-chip text-[10px] uppercase px-2.5 py-1 rounded-full ${CAMPUS_COLORS[u.campus] || "bg-violetLight text-violet"}`}>{u.campus || "VIT"}</span><span className="vp-driver-open">View profile <ArrowUpRight size={14} /></span></div>
              {u.interests?.length > 0 && <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-current/10">{u.interests.slice(0, 4).map((x) => <span key={x} className="vp-driver-tag">{x}</span>)}</div>}
            </Link>)}
          </div>
        )}
      </div>
    </div>
  );
}
