import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import WorldSelector from "../theme/WorldSelector.jsx";

export default function Settings() {
  return (
    <div className="vp-page-shell min-h-[calc(100vh-4rem)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
        <Link to="/profile" className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 mb-8 vp-selector-sub">
          <ArrowLeft size={16} /> Back to profile
        </Link>

        <WorldSelector />
      </div>
    </div>
  );
}
