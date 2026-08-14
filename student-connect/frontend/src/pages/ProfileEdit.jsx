import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import Avatar from "../components/Avatar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getLevels, getProgrammes } from "../data/programs.js";

const CAMPUSES = ["Bhopal", "Vellore", "Chennai", "Amravati"];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Alumni"];
const BATCH_OPTIONS = [
  "2022–26", "2023–27", "2024–28", "2025–29", "2026–30", "2027–31", "2028–32", "2029–33", "2030–34", "Other / Custom"
];

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wide text-ink/50 badge-chip">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

const inputClass =
  "w-full border border-line rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-forest";

export default function ProfileEdit() {
  const navigate = useNavigate();
  const { user: authUser, setUser } = useAuth();
  const [form, setForm] = useState(null);
  const [skillsInput, setSkillsInput] = useState("");
  const [interestsInput, setInterestsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Change email mini-flow
  const [emailStep, setEmailStep] = useState("idle"); // idle | editing | code-sent
  const [newEmail, setNewEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailMsg, setEmailMsg] = useState("");
  const [emailErr, setEmailErr] = useState("");

  const levels = form ? getLevels(form.campus) : [];
  const programmes = form ? getProgrammes(form.campus, form.programmeLevel) : [];

  useEffect(() => {
    api.get("/users/me").then(({ data }) => {
      const programmeLevel = data.programmeLevel || "";
      const programme = data.programme || data.branch || "";
      setForm({ ...data, programmeLevel, programme, batch: data.batch || "" });
      setSkillsInput((data.skills || []).join(", "));
      setInterestsInput((data.interests || []).join(", "));
    });
  }, []);

  function update(field, value) {
    setForm({ ...form, [field]: value });
  }

  function updateCampus(value) {
    const nextLevels = getLevels(value);
    const nextLevel = nextLevels.includes(form.programmeLevel) ? form.programmeLevel : (nextLevels[0] || "");
    const nextProgrammes = getProgrammes(value, nextLevel);
    setForm({
      ...form,
      campus: value,
      programmeLevel: nextLevel,
      programme: nextProgrammes.includes(form.programme) ? form.programme : (nextProgrammes[0] || ""),
      branch: nextProgrammes.includes(form.programme) ? form.programme : (nextProgrammes[0] || ""),
    });
  }

  function updateProgrammeLevel(value) {
    const nextProgrammes = getProgrammes(form.campus, value);
    const nextProgramme = nextProgrammes.includes(form.programme) ? form.programme : (nextProgrammes[0] || "");
    setForm({ ...form, programmeLevel: value, programme: nextProgramme, branch: nextProgramme });
  }

  function updateProgramme(value) {
    setForm({ ...form, programme: value, branch: value });
  }

  function updateClub(index, field, value) {
    const clubs = [...(form.clubs || [])];
    clubs[index] = { ...clubs[index], [field]: value };
    update("clubs", clubs);
  }

  function addClub() {
    update("clubs", [...(form.clubs || []), { clubName: "", team: "", position: "" }]);
  }

  function removeClub(index) {
    update("clubs", (form.clubs || []).filter((_, i) => i !== index));
  }

  async function requestEmailChange(e) {
    e.preventDefault();
    setEmailErr("");
    setEmailMsg("");
    setEmailLoading(true);
    try {
      const { data } = await api.post("/users/change-email/request", { newEmail });
      setEmailMsg(data.message);
      setEmailStep("code-sent");
    } catch (err) {
      setEmailErr(err.response?.data?.message || "Could not send verification code.");
    } finally {
      setEmailLoading(false);
    }
  }

  async function confirmEmailChange(e) {
    e.preventDefault();
    setEmailErr("");
    setEmailLoading(true);
    try {
      const { data } = await api.post("/users/change-email/confirm", { code: emailCode });
      setForm((f) => ({ ...f, email: data.user.email }));
      sessionStorage.setItem("user", JSON.stringify({ ...authUser, email: data.user.email }));
      setUser((u) => ({ ...u, email: data.user.email }));
      setEmailMsg("Email updated successfully.");
      setEmailStep("idle");
      setNewEmail("");
      setEmailCode("");
    } catch (err) {
      setEmailErr(err.response?.data?.message || "Invalid verification code.");
    } finally {
      setEmailLoading(false);
    }
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Please choose an image smaller than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 300;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        update("profilePic", canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const skills = skillsInput.split(",").map((s) => s.trim()).filter(Boolean);
      const interests = interestsInput.split(",").map((s) => s.trim()).filter(Boolean);
      const { data } = await api.put("/users/me", { ...form, skills, interests });
      sessionStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      navigate("/profile");
    } finally {
      setSaving(false);
    }
  }

  async function deleteAccount() {
    setDeleteError("");
    setDeleteLoading(true);
    try {
      await api.delete("/users/me", { data: { password: deletePassword } });
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      setUser(null);
      navigate("/", { replace: true });
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Could not delete your account.");
    } finally {
      setDeleteLoading(false);
    }
  }

  if (!form) return <p className="text-center mt-16 text-ink/50 font-body">Loading...</p>;

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-10 pb-16">
      <h1 className="font-display text-2xl text-navy mb-6">Edit your profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4 font-body">
        <div className="flex items-center gap-4">
          <Avatar name={form.name} src={form.profilePic} size={64} />
          <label className="text-sm text-forest cursor-pointer hover:underline">
            Change photo
            <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
          </label>
        </div>

        {/* Change email */}
        <div className="border border-line rounded-xl p-4 bg-paper/60">
          <p className="text-xs uppercase tracking-wide text-ink/50 badge-chip mb-1">Account email</p>
          <p className="text-sm text-ink font-medium mb-3">{form.email}</p>

          {emailStep === "idle" && (
            <button
              type="button"
              onClick={() => { setEmailStep("editing"); setEmailErr(""); setEmailMsg(""); }}
              className="text-sm text-forest hover:underline"
            >
              Change email
            </button>
          )}

          {emailStep === "editing" && (
            <form onSubmit={requestEmailChange} className="space-y-2">
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="new-email@vitbhopal.ac.in"
                className={inputClass}
              />
              {emailErr && <p className="text-xs text-rose">{emailErr}</p>}
              <div className="flex gap-2">
                <button type="submit" disabled={emailLoading} className="text-xs bg-navy text-white px-3 py-2 rounded-full disabled:opacity-50">
                  {emailLoading ? "Sending..." : "Send verification code"}
                </button>
                <button type="button" onClick={() => setEmailStep("idle")} className="text-xs border border-line px-3 py-2 rounded-full">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {emailStep === "code-sent" && (
            <form onSubmit={confirmEmailChange} className="space-y-2">
              <p className="text-xs text-forest">{emailMsg}</p>
              <input
                required
                inputMode="numeric"
                maxLength={6}
                value={emailCode}
                onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ""))}
                placeholder="6-digit code"
                className={inputClass}
              />
              {emailErr && <p className="text-xs text-rose">{emailErr}</p>}
              <div className="flex gap-2">
                <button type="submit" disabled={emailLoading} className="text-xs bg-navy text-white px-3 py-2 rounded-full disabled:opacity-50">
                  {emailLoading ? "Verifying..." : "Confirm new email"}
                </button>
                <button type="button" onClick={() => { setEmailStep("idle"); setEmailCode(""); }} className="text-xs border border-line px-3 py-2 rounded-full">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Campus">
            <select value={form.campus} onChange={(e) => updateCampus(e.target.value)} className={inputClass}>
              {CAMPUSES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Current year">
            <select value={form.year} onChange={(e) => update("year", e.target.value)} className={inputClass}>
              {YEARS.map((y) => <option key={y}>{y}</option>)}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Course / programme level">
            <select value={form.programmeLevel} onChange={(e) => updateProgrammeLevel(e.target.value)} className={inputClass}>
              {levels.map((level) => <option key={level}>{level}</option>)}
            </select>
          </Field>
          <Field label="Course / branch">
            <select value={form.programme} onChange={(e) => updateProgramme(e.target.value)} className={inputClass}>
              {programmes.map((programme) => <option key={programme}>{programme}</option>)}
              {!programmes.length && form.programme && <option>{form.programme}</option>}
            </select>
          </Field>
        </div>

        <Field label="Batch (for example B.Tech 2024–28)">
          <select value={form.batch || ""} onChange={(e) => update("batch", e.target.value)} className={inputClass}>
            <option value="">Select your batch</option>
            {BATCH_OPTIONS.map((batch) => <option key={batch} value={batch}>{batch === "Other / Custom" ? batch : `${batch} batch`}</option>)}
          </select>
          <p className="text-[11px] text-ink/45 mt-1.5">Your course and batch help other students find relevant peers and seniors.</p>
        </Field>

        <Field label="Specialization">
          <input value={form.specialization} onChange={(e) => update("specialization", e.target.value)} className={inputClass} />
        </Field>

        <Field label="About / Description">
          <textarea
            value={form.bio}
            onChange={(e) => update("bio", e.target.value)}
            maxLength={300}
            rows={3}
            placeholder="Tell people a bit about yourself..."
            className={inputClass}
          />
        </Field>

        <Field label="Interests (comma separated)">
          <input
            value={interestsInput}
            onChange={(e) => setInterestsInput(e.target.value)}
            placeholder="Photography, Startups, Basketball"
            className={inputClass}
          />
        </Field>

        <Field label="Skills (comma separated)">
          <input
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder="React, Node.js, Python"
            className={inputClass}
          />
        </Field>

        <div className="pt-2 border-t border-line" />

        <Field label="Phone number (private by default — people must request access)">
          <input
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+91 98765 43210"
            className={inputClass}
          />
        </Field>

        <Field label="LinkedIn URL">
          <input value={form.linkedin} onChange={(e) => update("linkedin", e.target.value)} placeholder="https://linkedin.com/in/..." className={inputClass} />
        </Field>

        <Field label="GitHub URL">
          <input value={form.github} onChange={(e) => update("github", e.target.value)} placeholder="https://github.com/..." className={inputClass} />
        </Field>

        <Field label="Instagram URL">
          <input value={form.instagram} onChange={(e) => update("instagram", e.target.value)} placeholder="https://instagram.com/..." className={inputClass} />
        </Field>

        <Field label="Telegram URL">
          <input value={form.telegram} onChange={(e) => update("telegram", e.target.value)} placeholder="https://t.me/..." className={inputClass} />
        </Field>

        <div className="pt-2 border-t border-line" />

        <div>
          <label className="text-xs uppercase tracking-wide text-ink/50 badge-chip">
            College clubs & positions
          </label>
          <div className="mt-2 space-y-3">
            {(form.clubs || []).map((club, i) => (
              <div key={i} className="border border-line rounded-lg p-3 space-y-2 bg-paper/40">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-ink/40">Entry {i + 1}</span>
                  <button type="button" onClick={() => removeClub(i)} className="text-xs text-rose hover:underline">
                    Remove
                  </button>
                </div>
                <input
                  value={club.clubName}
                  onChange={(e) => updateClub(i, "clubName", e.target.value)}
                  placeholder="Club name (e.g. Startup Club)"
                  className={inputClass}
                />
                <input
                  value={club.team}
                  onChange={(e) => updateClub(i, "team", e.target.value)}
                  placeholder="Team/department (e.g. Events Team)"
                  className={inputClass}
                />
                <input
                  value={club.position}
                  onChange={(e) => updateClub(i, "position", e.target.value)}
                  placeholder="Position/role (e.g. Head)"
                  className={inputClass}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addClub}
            className="mt-2 text-sm text-forest hover:underline"
          >
            + Add another club
          </button>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-navy text-white py-2.5 rounded-full hover:bg-forest transition-colors disabled:opacity-50 font-medium"
        >
          {saving ? "Saving..." : "Save profile"}
        </button>

        <div className="mt-8 pt-6 border-t border-rose/20">
          <p className="text-xs uppercase tracking-wide text-rose/70 badge-chip">Danger zone</p>
          <h2 className="font-display text-lg text-navy mt-2">Delete account permanently</h2>
          <p className="text-sm text-ink/60 mt-1 leading-relaxed">This permanently removes your profile, connections, messages, notifications, calls, verification records and other account data from VITPEERS. This cannot be undone.</p>
          {!deleteOpen ? (
            <button
              type="button"
              onClick={() => { setDeleteOpen(true); setDeleteError(""); }}
              className="mt-3 border border-rose/40 text-rose px-4 py-2 rounded-full text-sm hover:bg-rose/5 transition-colors"
            >
              Delete my account
            </button>
          ) : (
            <div className="mt-4 border border-rose/20 bg-rose/5 rounded-xl p-4 space-y-3">
              <p className="text-sm font-medium text-navy">Enter your current password to confirm permanent deletion.</p>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Current password"
                className={inputClass}
                autoComplete="current-password"
              />
              {deleteError && <p className="text-xs text-rose">{deleteError}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={deleteLoading || !deletePassword}
                  onClick={deleteAccount}
                  className="bg-rose text-white px-4 py-2 rounded-full text-sm disabled:opacity-50"
                >
                  {deleteLoading ? "Deleting..." : "Permanently delete"}
                </button>
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={() => { setDeleteOpen(false); setDeletePassword(""); setDeleteError(""); }}
                  className="border border-line px-4 py-2 rounded-full text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
