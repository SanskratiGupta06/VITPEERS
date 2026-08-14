import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, UserCheck, Phone, PhoneCall, CalendarClock, MessageCircle } from "lucide-react";
import api from "../api.js";

const CONFIG = {
  connection_request: { icon: UserPlus, text: (n) => `${n.sender.name} sent you a connection request`, to: (n) => `/profile/${n.sender._id}` },
  connection_accepted: { icon: UserCheck, text: (n) => `${n.sender.name} accepted your connection request`, to: (n) => `/profile/${n.sender._id}` },
  phone_request: { icon: Phone, text: (n) => `${n.sender.name} requested your phone number`, to: () => `/profile` },
  phone_approved: { icon: Phone, text: (n) => `${n.sender.name} shared their phone number with you`, to: (n) => `/profile/${n.sender._id}` },
  call_scheduled: { icon: CalendarClock, text: (n) => `${n.sender.name} proposed a call`, to: () => `/calls` },
  call_responded: { icon: PhoneCall, text: (n) => `${n.sender.name} responded to your call request`, to: () => `/calls` },
  new_message: { icon: MessageCircle, text: (n) => `${n.sender.name} sent you a message`, to: (n) => `/messages/${n.sender._id}` },
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data);
      await api.put("/notifications/read-all");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p className="text-center mt-16 text-ink/50 font-body">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto px-6 py-10 font-body">
      <h1 className="font-display text-3xl text-navy mb-8">Notifications</h1>

      {notifications.length === 0 ? (
        <p className="text-sm text-ink/50">
          Nothing yet — you'll see updates here about connections, phone
          requests, and calls.
        </p>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const config = CONFIG[n.type] || CONFIG.connection_request;
            const Icon = config.icon;
            return (
              <Link
                key={n._id}
                to={config.to(n)}
                className={`flex items-center gap-3 border rounded-xl p-3 text-sm transition-colors ${
                  n.read ? "border-line bg-white" : "border-orange/40 bg-orangeLight"
                }`}
              >
                <span className="w-9 h-9 rounded-full bg-forestLight text-forest flex items-center justify-center flex-shrink-0">
                  <Icon size={16} />
                </span>
                <div>
                  <p className="text-ink">{config.text(n)}</p>
                  {n.sender?.branch && (
                    <p className="text-xs text-ink/40 mt-0.5">
                      {n.sender.branch}, VIT {n.sender.campus}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
