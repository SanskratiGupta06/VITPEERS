import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Send, Phone, Video, CalendarClock } from "lucide-react";
import api from "../api.js";
import Avatar from "../components/Avatar.jsx";
import ScheduleCallModal from "../components/ScheduleCallModal.jsx";

export default function Messages() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [showSchedule, setShowSchedule] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (!userId) {
      setActiveUser(null);
      setMessages([]);
      return;
    }
    loadThread(userId);
    const interval = setInterval(() => loadThread(userId, true), 4000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadConversations() {
    setLoadingConvos(true);
    try {
      const { data } = await api.get("/messages/conversations");
      setConversations(data);
    } finally {
      setLoadingConvos(false);
    }
  }

  async function loadThread(id, silent = false) {
    try {
      const [threadRes, userRes] = await Promise.all([
        api.get(`/messages/thread/${id}`),
        !silent || !activeUser ? api.get(`/users/${id}`) : Promise.resolve(null),
      ]);
      setMessages(threadRes.data);
      if (userRes) setActiveUser(userRes.data.user);
      if (!silent) loadConversations();
    } catch {
      // ignore transient poll errors
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const content = text;
    setText("");
    try {
      const { data } = await api.post(`/messages/thread/${userId}`, { content });
      setMessages((prev) => [...prev, data]);
      loadConversations();
    } catch (err) {
      alert(err.response?.data?.message || "Could not send message");
    }
  }

  function startCall(video) {
    const roomBase = `vitpeers-call-${[userId].sort().join("")}`;
    api.post(`/calls/instant/${userId}`).then(({ data }) => {
      const url = `https://meet.jit.si/${data.roomId}#config.startWithVideoMuted=${!video}`;
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 h-[calc(100vh-140px)] min-h-[500px]">
        {/* Conversation list */}
        <div className={`border border-line rounded-xl bg-white overflow-y-auto ${userId ? "hidden md:block" : ""}`}>
          <div className="p-4 border-b border-line">
            <h1 className="font-display text-lg text-navy">Messages</h1>
          </div>
          {loadingConvos ? (
            <p className="p-4 text-sm text-ink/40 font-body">Loading...</p>
          ) : conversations.length === 0 ? (
            <p className="p-4 text-sm text-ink/40 font-body">
              No conversations yet. Connect with someone first, then message them here.
            </p>
          ) : (
            conversations.map((c) => (
              <Link
                key={c._id}
                to={`/messages/${c._id}`}
                className={`flex items-center gap-3 p-3 border-b border-line/60 hover:bg-forestLight transition-colors ${
                  userId === c._id ? "bg-forestLight" : ""
                }`}
              >
                <Avatar name={c.user.name} src={c.user.profilePic} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm font-medium text-ink truncate">
                      {c.user.name}
                    </span>
                    {c.unreadCount > 0 && (
                      <span className="bg-orange text-white text-[10px] rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink/50 truncate">{c.lastMessage}</p>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Chat thread */}
        <div className="border border-line rounded-xl bg-white flex flex-col overflow-hidden">
          {!userId || !activeUser ? (
            <div className="flex-1 flex items-center justify-center text-ink/40 font-body text-sm">
              Select a conversation to start chatting
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-3 border-b border-line">
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    onClick={() => navigate("/messages")}
                    className="md:hidden text-ink/50 mr-1"
                  >
                    ←
                  </button>
                  <Link to={`/profile/${activeUser._id}`} className="flex items-center gap-2 min-w-0">
                    <Avatar name={activeUser.name} src={activeUser.profilePic} size={36} />
                    <div className="min-w-0">
                      <p className="font-body text-sm font-medium text-ink truncate">{activeUser.name}</p>
                      <p className="text-xs text-ink/40 truncate">{activeUser.branch}, VIT {activeUser.campus}</p>
                    </div>
                  </Link>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    title="Voice call"
                    onClick={() => startCall(false)}
                    className="w-9 h-9 rounded-full bg-forestLight text-forest flex items-center justify-center hover:opacity-80"
                  >
                    <Phone size={16} />
                  </button>
                  <button
                    title="Video call"
                    onClick={() => startCall(true)}
                    className="w-9 h-9 rounded-full bg-forestLight text-forest flex items-center justify-center hover:opacity-80"
                  >
                    <Video size={16} />
                  </button>
                  <button
                    title="Schedule a call"
                    onClick={() => setShowSchedule(true)}
                    className="w-9 h-9 rounded-full bg-orangeLight text-orange flex items-center justify-center hover:opacity-80"
                  >
                    <CalendarClock size={16} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-paper/50">
                {messages.map((m) => {
                  const mine = m.sender === activeUser._id ? false : true;
                  return (
                    <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm font-body ${
                          mine
                            ? "bg-navy text-white rounded-br-sm"
                            : "bg-white border border-line text-ink rounded-bl-sm"
                        }`}
                      >
                        {m.content}
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              <form onSubmit={handleSend} className="p-3 border-t border-line flex gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-line rounded-full px-4 py-2 text-sm font-body bg-white focus:outline-none focus:ring-2 focus:ring-forest"
                />
                <button
                  type="submit"
                  className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center hover:bg-forest transition-colors flex-shrink-0"
                >
                  <Send size={16} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {showSchedule && (
        <ScheduleCallModal
          recipientId={userId}
          onClose={() => setShowSchedule(false)}
          onScheduled={() => alert("Call proposal sent!")}
        />
      )}
    </div>
  );
}
