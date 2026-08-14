import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({ id, label = "Password", value, onChange, required = true, minLength = 6, placeholder = "" }) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="text-xs uppercase tracking-wide text-ink/50 badge-chip">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          id={id}
          type={visible ? "text" : "password"}
          required={required}
          minLength={minLength}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border border-line rounded-xl px-3 py-2.5 pr-11 bg-white focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-ink/45 hover:text-navy hover:bg-paper transition-colors"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
