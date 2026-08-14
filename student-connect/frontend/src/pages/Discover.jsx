import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import api from "../api.js";
import Avatar from "../components/Avatar.jsx";
import { CAMPUS_OPTIONS, YEARS, getLevels, getProgrammes } from "../data/programs.js";



const CAMPUS_COLORS = {
  Bhopal: "bg-forestLight text-forest",
  Vellore: "bg-orangeLight text-orange",
  Chennai: "bg-navy/10 text-navy",
  Amravati: "bg-rose/10 text-rose",
};

export default function Discover() {
  const [filters, setFilters] = useState({ campus: "", programmeLevel: "", branch: "", year: "", search: "" });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => fetchUsers(), 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  async function fetchUsers() {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const { data } = await api.get("/users/discover", { params });
      setUsers(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="bg-vm-gradient">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-8">
          <h1 className="font-display text-3xl text-white mb-1">Discover students</h1>
          <p className="text-sm text-white/70 font-body">
            Filter by campus, branch, or year to find the right seniors and peers.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-5">
        <div className="flex flex-wrap gap-3 mb-8 font-body bg-white border border-line rounded-2xl p-3 shadow-sm">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
            <input
              placeholder="Search by name, skill, specialization"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-9 border border-line rounded-full px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-forest"
            />
          </div>
          <select
            value={filters.campus}
            onChange={(e) => setFilters({ ...filters, campus: e.target.value, programmeLevel: "", branch: "" })}
            className="border border-line rounded-full px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-forest"
          >
            <option value="">All campuses</option>
            {CAMPUS_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <select
            value={filters.programmeLevel}
            onChange={(e) => setFilters({ ...filters, programmeLevel: e.target.value, branch: "" })}
            className="border border-line rounded-full px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-forest disabled:bg-paper"
            disabled={!filters.campus}
          >
            <option value="">All programme levels</option>
            {getLevels(filters.campus).map((level) => <option key={level}>{level}</option>)}
          </select>
          <select
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            className="border border-line rounded-full px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-forest"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>{y || "All years"}</option>
            ))}
          </select>
          <select
            value={filters.branch}
            onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
            className="max-w-xs border border-line rounded-full px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-forest disabled:bg-paper"
            disabled={!filters.campus || !filters.programmeLevel}
          >
            <option value="">All programmes</option>
            {getProgrammes(filters.campus, filters.programmeLevel).map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>

        {loading ? (
          <p className="text-ink/50 font-body pb-10">Loading students...</p>
        ) : users.length === 0 ? (
          <p className="text-ink/50 font-body pb-10">
            No students match these filters yet. Try widening your search.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
            {users.map((u) => (
              <Link
                to={`/profile/${u._id}`}
                key={u._id}
                className="block border border-line rounded-2xl bg-white p-4 hover:border-forest hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar name={u.name} src={u.profilePic} size={40} />
                    <span className="font-display text-base text-navy leading-tight">{u.name}</span>
                  </div>
                  <span className={`badge-chip text-[10px] uppercase px-2 py-1 rounded-full ${CAMPUS_COLORS[u.campus] || "bg-forestLight text-forest"}`}>
                    {u.campus}
                  </span>
                </div>
                <p className="text-sm text-ink/70 font-body">{u.branch}</p>
                <p className="text-sm text-ink/50 font-body">{u.year}</p>
                {u.batch && <p className="text-xs text-ink/45 font-body mb-2">Batch {u.batch}</p>}
                {u.specialization && (
                  <p className="text-xs text-orange font-body font-medium">{u.specialization}</p>
                )}
                {u.interests?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {u.interests.slice(0, 3).map((i) => (
                      <span key={i} className="badge-chip text-[10px] bg-paper border border-line rounded-full px-2 py-0.5 text-ink/60">
                        {i}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
