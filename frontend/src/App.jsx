import { useEffect, useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { ArrowRight, Search, MessageCircle, Video, ShieldCheck, Users, Compass, GraduationCap, BriefcaseBusiness, Sparkles, Trophy, Zap, Building2 } from "lucide-react";
import HeroIllustration from "./components/HeroIllustration.jsx";
import Logo from "./components/Logo.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Discover from "./pages/Discover.jsx";
import Profile from "./pages/Profile.jsx";
import ProfileEdit from "./pages/ProfileEdit.jsx";
import Connections from "./pages/Connections.jsx";
import Notifications from "./pages/Notifications.jsx";
import Messages from "./pages/Messages.jsx";
import Calls from "./pages/Calls.jsx";
import Settings from "./pages/Settings.jsx";
import Mascot from "./theme/Mascot.jsx";
import WorldFx from "./theme/WorldFx.jsx";
import { useAuth } from "./context/AuthContext.jsx";

const CAMPUS_DATA = [
  {
    key: "vellore",
    name: "VIT Vellore",
    tone: "campus-blue",
    emoji: "🟦",
    tagline: "The original campus community",
    established: "Founded 1984",
    facts: [
      "The founding campus of VIT — originally established as Vellore Engineering College",
      "The largest and most established of the four campuses, with the widest range of programmes",
      "Home to VIT's oldest student clubs, chapters and long-running fests",
    ],
  },
  {
    key: "chennai",
    name: "VIT Chennai",
    tone: "campus-green",
    emoji: "🟩",
    tagline: "Build your Chennai circle",
    established: "Founded 2010",
    facts: [
      "Located in Tamil Nadu's capital, with strong industry and internship connections in the city",
      "Known for a research-focused academic environment across engineering, management and sciences",
      "A growing, tight-knit student community compared to the older Vellore campus",
    ],
  },
  {
    key: "amaravati",
    name: "VIT-AP",
    tone: "campus-yellow",
    emoji: "🟨",
    tagline: "Connect across Amaravati",
    established: "Founded 2017",
    facts: [
      "A rapidly expanding campus in Amaravati, Andhra Pradesh",
      "Newer campus with modern infrastructure and a fast-growing student body",
      "Part of the same VIT academic and placement network as the other three campuses",
    ],
  },
  {
    key: "bhopal",
    name: "VIT Bhopal",
    tone: "campus-red",
    emoji: "🟥",
    tagline: "Meet your Bhopal network",
    established: "Founded 2017",
    facts: [
      "Located on the Bhopal-Indore expressway in Madhya Pradesh",
      "One of VIT's two newest campuses, built with a fresh, modern campus design",
      "A growing community — VITPEERS is especially useful here for finding early batches of seniors",
    ],
  },
];

function CampusSection() {
  const [active, setActive] = useState(null);
  const activeCampus = CAMPUS_DATA.find((c) => c.key === active);

  return (
    <section id="campuses" className="campus-band">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28 vp-floating-panel">
        <div className="max-w-2xl">
          <span className="section-kicker">Four campuses · one community</span>
          <h2 className="section-title">Wherever you study, you have a VITPEERS.</h2>
          <p className="body-copy mt-4">Tap a campus to see what makes it different — find people who share your campus, programme, interests and goals.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          {CAMPUS_DATA.map((c, i) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setActive(active === c.key ? null : c.key)}
              className={`campus-card ${c.tone} lift-card group text-left w-full ${active === c.key ? "ring-2 ring-navy" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span className="badge-chip text-xs opacity-70">0{i + 1}</span>
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{c.emoji}</span>
              </div>
              <h3 className="font-display text-xl text-navy mt-10">{c.name}</h3>
              <p className="text-sm text-ink/60 font-body mt-2 leading-6">{c.tagline}</p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-navy mt-6">
                {active === c.key ? "Hide details" : "Explore campus"}
                <ArrowRight size={15} className={`transition-transform ${active === c.key ? "rotate-90" : "group-hover:translate-x-1"}`} />
              </span>
            </button>
          ))}
        </div>

        {activeCampus && (
          <div className="mt-6 bg-white border border-line rounded-2xl p-6 sm:p-8 reveal">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{activeCampus.emoji}</span>
              <div>
                <h3 className="font-display text-xl text-navy">{activeCampus.name}</h3>
                <p className="text-xs text-ink/40 badge-chip">{activeCampus.established}</p>
              </div>
            </div>
            <ul className="grid sm:grid-cols-2 gap-3">
              {activeCampus.facts.map((f) => (
                <li key={f} className="text-sm text-ink/65 font-body leading-6 flex gap-2">
                  <span className="text-orange">•</span>{f}
                </li>
              ))}
            </ul>
            <Link to="/signup" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy mt-5 hover:text-forest">
              Find your {activeCampus.name} network <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

const trustPoints = [
  [ShieldCheck, "VIT community", "Built for students and alumni across the VIT network."],
  [Users, "Real connections", "Find peers, seniors, teammates and mentors who get your journey."],
  [Compass, "Discover smarter", "Search by campus, programme, year and interests."],
  [Sparkles, "Your world", "Switch between four visual worlds without losing any features."],
];

function Landing() {
  const { user } = useAuth();

  const features = [
    [Users, "Find the right senior", "Discover seniors and peers from your campus, year and programme.", "text-violet bg-violetLight"],
    [MessageCircle, "Ask & collaborate", "Start conversations around academics, projects, internships and campus life.", "text-blue bg-blueLight"],
    [Compass, "Campus-based discovery", "Search across Vellore, Chennai, Amaravati and Bhopal without the noise of a generic network.", "text-orange bg-orangeLight"],
    [BriefcaseBusiness, "Learn from experience", "Connect with people who have already walked the path you're starting.", "text-pink bg-pinkLight"],
    [Sparkles, "Give back", "Seniors can share experience while building meaningful connections of their own.", "text-forest bg-forestLight"],
    [ShieldCheck, "Designed for VIT", "A student-focused space built around the way VIT students actually find people.", "text-violet bg-violetLight"]
  ];

  useEffect(() => {
    // Render the complete landing page immediately. Avoid the old
    // scroll-triggered reveal because it made every section feel like a
    // separate page loading while the user scrolled.
    document.querySelectorAll(".scroll-reveal").forEach((el) => {
      el.classList.remove("scroll-reveal");
      el.classList.add("is-visible");
    });
  }, [user]);

  if (user) return <Navigate to="/discover" replace />;

  return (
    <main className="vp-home-shell">
      <section className="vp-hero vp-home-section">
        <div className="vp-hero-grid max-w-7xl mx-auto px-5 sm:px-8 pt-12 sm:pt-20 lg:pt-24 pb-20 sm:pb-24 grid lg:grid-cols-[1.02fr_.98fr] gap-12 items-center">
          <div className="reveal">
            <span className="vp-eyebrow badge-chip text-[10px] uppercase tracking-[0.16em] px-3.5 py-2 rounded-full">
              Vellore · Chennai · Amaravati · Bhopal
            </span>
            <h1 className="vp-hero-title text-[3.4rem] sm:text-6xl lg:text-[5.6rem] mt-7 leading-[.94] max-w-3xl">
              Your people.<br />
              <span className="gradient-text">Your campus.</span><br />
              Your next move.
            </h1>
            <p className="vp-hero-copy font-body text-base sm:text-lg max-w-xl mt-7 leading-7">
              VITPEERS helps you find seniors, friends, teammates and mentors who actually understand your VIT journey.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Link to="/signup" className="vp-primary-btn group text-white px-6 py-3.5 rounded-full font-body font-bold inline-flex items-center gap-2 hover:-translate-y-0.5 transition">
                Join VITPEERS <ArrowRight size={17} className="group-hover:translate-x-0.5 transition" />
              </Link>
              <Link to="/login" className="vp-secondary-btn px-6 py-3.5 rounded-full font-body font-semibold hover:-translate-y-0.5 transition">Log in</Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-10 max-w-2xl">
              {[
                [Users, "4", "VIT Campuses"],
                [Building2, "50+", "Programmes"],
                [GraduationCap, "All", "Years & batches"],
                [Sparkles, "1", "Connected community"],
              ].map(([Icon, stat, label], i) => (
                <div key={label} className="vp-stat rounded-2xl p-3.5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-lg vp-purple flex items-center justify-center"><Icon size={15} /></span>
                    <span className="badge-chip text-[9px] text-black/35">0{i + 1}</span>
                  </div>
                  <p className="vp-stat-accent font-display font-bold text-xl leading-none">{stat}</p>
                  <p className="text-[#5E566D] text-[11px] font-body mt-1 leading-4">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[430px] sm:min-h-[500px] flex items-center justify-center reveal" style={{ animationDelay: "120ms" }}>
            <div className="vp-hero-orb-1 absolute w-[360px] h-[360px] sm:w-[470px] sm:h-[470px] rounded-full bg-[#7028EF] opacity-95 right-2 top-8" />
            <div className="vp-hero-orb-2 absolute w-[180px] h-[180px] rounded-full bg-[#B7FF00] right-0 bottom-4 blur-[2px]" />
            <div className="vp-visual-card relative w-full max-w-[500px] rounded-[2rem] p-5 sm:p-7 rotate-[1deg]">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="font-display font-bold text-[#21153F] text-lg">Find your circle</p>
                  <p className="text-xs text-[#6B6378] font-body mt-1">People matched to your VIT journey</p>
                </div>
                <span className="vp-lime rounded-full px-3 py-1.5 text-[10px] font-bold">LIVE NETWORK</span>
              </div>

              <div className="relative rounded-[1.5rem] bg-[#F7F0FF] p-5 sm:p-6 overflow-hidden min-h-[330px]">
                <div className="vp-visual-orbit absolute inset-7 rounded-full" />
                <div className="vp-visual-orbit absolute inset-20 rounded-full opacity-60" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full vp-purple flex items-center justify-center shadow-xl shadow-purple-900/20">
                  <Logo size={52} />
                </div>

                <div className="absolute left-5 top-8 bg-white vp-preview-card rounded-2xl p-3 shadow-lg w-40 rotate-[-4deg]">
                  <div className="flex items-center gap-2"><span className="w-9 h-9 rounded-full vp-coral flex items-center justify-center text-sm font-bold">A</span><div><p className="font-display text-xs font-bold text-[#21153F]">Aarav</p><p className="text-[10px] text-[#7A7286]">CSE · 3rd year</p></div></div>
                  <span className="inline-block mt-2 text-[9px] badge-chip text-[#7028EF] bg-[#F0E8FF] px-2 py-1 rounded-full">project buddy</span>
                </div>

                <div className="absolute right-4 top-16 bg-[#21153F] text-white rounded-2xl p-3 shadow-lg w-44 rotate-[4deg]">
                  <div className="flex items-center gap-2"><span className="w-9 h-9 rounded-full vp-lime flex items-center justify-center text-sm font-bold">S</span><div><p className="font-display text-xs font-bold">Shreya</p><p className="text-[10px] text-white/60">ECE · 4th year</p></div></div>
                  <span className="inline-block mt-2 text-[9px] badge-chip text-[#21153F] bg-[#B7FF00] px-2 py-1 rounded-full">senior guide</span>
                </div>

                <div className="absolute left-8 bottom-7 bg-white vp-preview-card rounded-2xl p-3 shadow-lg w-44 rotate-[3deg]">
                  <div className="flex items-center gap-2"><span className="w-9 h-9 rounded-full vp-purple flex items-center justify-center text-sm font-bold text-white">R</span><div><p className="font-display text-xs font-bold text-[#21153F]">Riya</p><p className="text-[10px] text-[#7A7286]">Bhopal · 2nd year</p></div></div>
                  <span className="inline-block mt-2 text-[9px] badge-chip text-[#FF5A60] bg-[#FFF0EF] px-2 py-1 rounded-full">hackathon team</span>
                </div>

                <div className="absolute right-5 bottom-8 bg-white vp-preview-card rounded-2xl p-3 shadow-lg w-40 rotate-[-3deg]">
                  <div className="flex items-center gap-2"><span className="w-9 h-9 rounded-full bg-[#6F7BFF] flex items-center justify-center text-sm font-bold text-white">K</span><div><p className="font-display text-xs font-bold text-[#21153F]">Karan</p><p className="text-[10px] text-[#7A7286]">Vellore · 1st year</p></div></div>
                  <span className="inline-block mt-2 text-[9px] badge-chip text-[#7028EF] bg-[#F0E8FF] px-2 py-1 rounded-full">same interests</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 px-1">
                <span className="text-xs text-[#6B6378] font-body">Connect around academics, projects & careers.</span>
                <span className="vp-coral rounded-full px-3 py-1.5 text-[10px] font-bold">4 campuses</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* overlapping trust strip */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8 -mt-10 sm:-mt-12 relative z-10 vp-home-trust-wrap">
        <div className="vp-trust rounded-2xl sm:rounded-[1.75rem] grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-line overflow-hidden">
          {trustPoints.map(([Icon, title, copy], i) => (
            <div key={title} className={`p-4 sm:p-5 flex items-start gap-3 ${i % 2 === 1 ? "" : ""}`}>
              <span className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${["text-violet bg-violetLight", "text-blue bg-blueLight", "text-orange bg-orangeLight", "text-pink bg-pinkLight"][i]}`}>
                <Icon size={16} />
              </span>
              <div>
                <p className="font-display text-sm text-navy leading-tight">{title}</p>
                <p className="text-xs text-ink/50 font-body mt-0.5 leading-4">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section id="about" className="vp-home-section">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28 vp-floating-panel">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="section-kicker">About VITPEERS</span>
            <h2 className="section-title">One VIT. <span className="gradient-text">One community.</span></h2>
            <p className="body-copy mt-5">
              VIT is a huge network spread across campuses, branches and years. But the person who can answer your question is often just one connection away.
            </p>
            <p className="body-copy mt-4">
              VITPEERS makes that connection easier — discover people, understand their journey and start conversations that are actually useful.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["Multiple campuses", "Multiple programmes", "Across every year", "One connected community"].map((x, i) => (
              <div key={x} className="rounded-2xl border border-line bg-white p-5 min-h-32 flex flex-col justify-between">
                <span className="text-xs badge-chip text-orange">0{i + 1}</span>
                <span className="font-display text-navy">{x}</span>
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      <section id="why" className="vp-home-section">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28 vp-floating-panel">
          <div className="max-w-2xl">
            <span className="section-kicker">Why VITPEERS</span>
            <h2 className="section-title">More useful than <span className="gradient-text">another social feed.</span></h2>
            <p className="body-copy mt-4">Every part of the product is designed around a simple question: who can help you take your next step?</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {features.map(([Icon, title, copy, tone], i) => (
              <div key={title} className="feature-card reveal" style={{ animationDelay: `${i * 80}ms` }}>
                <div className={`icon-box ${tone}`}><Icon size={20} /></div>
                <h3 className="font-display text-lg text-navy mt-5">{title}</h3>
                <p className="text-sm text-ink/60 font-body mt-2 leading-6">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="vp-home-section">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28 vp-floating-panel">
          <div className="text-center max-w-2xl mx-auto">
          <span className="section-kicker">How it works</span>
          <h2 className="section-title">From “I need help” to <span className="gradient-text">“I know someone.”</span></h2>
        </div>
        <div className="grid md:grid-cols-4 gap-4 mt-12">
          {[
            ["01", "Create your profile", "Choose your campus, programme, year and interests."],
            ["02", "Find your people", "Use campus, programme, year and search filters."],
            ["03", "Connect", "Send a request and start a conversation once connected."],
            ["04", "Grow together", "Chat, collaborate and schedule calls when useful."]
          ].map(([n, t, c]) => (
            <div key={n} className="relative p-6 border border-line rounded-2xl bg-white lift-card">
              <span className="badge-chip text-orange text-xs">{n}</span>
              <h3 className="font-display text-lg text-navy mt-8">{t}</h3>
              <p className="text-sm text-ink/60 font-body mt-2 leading-6">{c}</p>
            </div>
          ))}
        </div>
        </div>
      </section>

      <section id="journey" className="vp-home-section">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28 vp-floating-panel grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="section-kicker">Built around your VIT journey</span>
            <h2 className="section-title">Different year. Different question. <span className="gradient-text">Same community.</span></h2>
            <p className="body-copy mt-4">Whether you are finding your footing or preparing for what comes after college, the right conversation can save time and open doors.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              [GraduationCap, "First year", "Find seniors who can help you understand campus life."],
              [Search, "Academics", "Find people from your programme and learn from their experience."],
              [BriefcaseBusiness, "Projects & internships", "Meet students with similar interests and experience."],
              [Video, "Guidance", "Take a conversation beyond text with a scheduled call."]
            ].map(([Icon, title, copy]) => (
              <div key={title} className="bg-white vp-surface-card border border-line rounded-2xl p-5">
                <Icon size={20} className="text-orange" />
                <h3 className="font-display text-navy mt-4">{title}</h3>
                <p className="text-sm text-ink/60 font-body mt-2 leading-6">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CampusSection />

      <section id="community" className="vp-home-section">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <div className="rounded-[2rem] vp-community-panel bg-vm-gradient text-white p-8 sm:p-12 grid lg:grid-cols-2 gap-10 items-center overflow-hidden">
          <div>
            <span className="section-kicker text-white/60">The community</span>
            <h2 className="font-display text-3xl sm:text-4xl mt-2">Ask. <span className="gradient-text">Share. Help. Grow.</span></h2>
            <p className="text-white/70 font-body mt-4 max-w-lg leading-7">
              VITPEERS is not meant to be another feed to scroll forever. It is a place to find the people behind the answers.
            </p>
          </div>
          <div className="grid gap-3">
            {[
              "Which subjects should I focus on this semester?",
              "Looking for teammates for a hackathon.",
              "Anyone from CSE interested in AI?",
              "How did you prepare for your internship?"
            ].map((q) => (
              <div key={q} className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 font-body text-sm text-white/85">{q}</div>
            ))}
          </div>
        </div>
        </div>
      </section>

      <section id="cta-final" className="vp-home-section">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 text-center vp-floating-panel">
          <span className="section-kicker">Start here</span>
          <h2 className="font-display text-4xl sm:text-5xl text-navy mt-2">Your VIT network is <span className="gradient-text">bigger than your classroom.</span></h2>
          <p className="body-copy max-w-xl mx-auto mt-4">Find the people who can help you learn, collaborate and grow.</p>
          <Link to="/signup" className="inline-flex items-center gap-2 bg-vm-warm text-white px-7 py-3.5 rounded-full mt-7 font-body font-semibold hover:brightness-110 transition shadow-lg shadow-pink/20">
            Join VITPEERS <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <footer className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2"><Logo size={32} wordmark wordmarkClass="text-xl text-white" /></div>
            <p className="text-sm text-white/55 font-body mt-4 max-w-sm">A student networking space built around the VIT community.</p>
          </div>
          <div><p className="badge-chip text-[10px] text-white/40 uppercase">Product</p><div className="flex flex-col gap-2 mt-3 text-sm text-white/65"><a href="#why">Features</a><a href="#how">How it works</a><a href="#community">Community</a></div></div>
          <div><p className="badge-chip text-[10px] text-white/40 uppercase">Explore</p><div className="flex flex-col gap-2 mt-3 text-sm text-white/65"><a href="#about">About</a><Link to="/login">Log in</Link><Link to="/signup">Join VITPEERS</Link></div></div>
        </div>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-5 border-t border-white/10 text-xs text-white/40 font-body">© 2026 VITPEERS</div>
      </footer>
    </main>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-paper vp-page-shell">
      <Navbar />
      <WorldFx />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile/edit" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
        <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/connections" element={<ProtectedRoute><Connections /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/messages/:userId" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/calls" element={<ProtectedRoute><Calls /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
      <Mascot />
    </div>
  );
}
