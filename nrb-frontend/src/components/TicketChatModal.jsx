import { useEffect, useState, useRef } from "react";
import { getTicketMessages, sendTicketMessage } from "../services/ticketMessageService";
import { wsService } from "../services/websocketService";

function TicketChatModal({ ticket, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const currentUserEmail = localStorage.getItem("email") || "";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      const res = await getTicketMessages(ticket.id);
      setMessages(res.data || []);
    } catch (err) {
       console.error("Failed to load ticket messages:", err.response?.data || err);
    } finally {
      setLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  useEffect(() => {
    if (!ticket?.id) return;
    loadMessages();

    // Subscribe to live messages specifically for this ticket
    const topic = `/topic/ticket-messages/${ticket.id}`;
    
    wsService.connect(() => {
      wsService.subscribe(topic, (incomingData) => {
        try {
          const newMsg =
            typeof incomingData === "string"
              ? JSON.parse(incomingData)
              : incomingData?.body
              ? JSON.parse(incomingData.body)
              : incomingData;

          // Prevent duplicate message rendering if already present
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          setTimeout(scrollToBottom, 50);
        } catch (e) {
          console.error("Failed to parse incoming WebSocket message:", e);
        }
      });
    });

    return () => {
      wsService.unsubscribe(topic);
    };
  }, [ticket?.id]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = inputMessage.trim();
    if (!trimmed || sending) return;

    setSending(true);
    setInputMessage("");

    try {
      await sendTicketMessage(ticket.id, trimmed);
    } catch (err) {
      console.error("Failed to send message:", err.response?.data || err);
      setInputMessage(trimmed);
    } finally {
      setSending(false);
    }
  };

  // Helper formatting for timestamps
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!ticket) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col h-[580px] overflow-hidden border border-gray-100">
        
        {/* ================= MODAL HEADER ================= */}
        <div className="bg-[#8B0E12] px-6 py-4 flex items-center justify-between text-white shrink-0 shadow-sm">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-200">
                Ticket #{ticket.id}
              </span>
              <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {ticket.status}
              </span>
            </div>
            <h2 className="text-sm font-bold text-white tracking-tight line-clamp-1 mt-0.5">
              {ticket.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
            title="Close Chat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ================= MESSAGE THREAD ================= */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAFBFD]">
          {loading ? (
            <div className="flex items-center justify-center h-full text-xs text-gray-400">
              Loading discussion history...
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 p-6">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#9B1317] mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-xs font-bold text-gray-700">No coordination messages yet</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Start the conversation with the engineer or user below.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender?.email === currentUserEmail;
              const senderRole = msg.sender?.role?.replace("_", " ") || "USER";

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  <span className="text-[10px] font-bold text-gray-400 mb-0.5 px-1">
                    {isMe
                      ? "You"
                      : `${msg.sender?.firstName || "User"} (${senderRole})`}
                  </span>

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-xs leading-relaxed break-words ${
                      isMe
                        ? "bg-[#9B1317] text-white rounded-br-none"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                    }`}
                  >
                    {msg.message}
                  </div>

                  <span className="text-[9px] text-gray-400 mt-0.5 px-1">
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ================= MESSAGE INPUT BAR ================= */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your reply or coordination note..."
            className="flex-1 text-xs border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#9B1317] transition"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || sending}
            className="bg-[#9B1317] hover:bg-[#800f13] disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </form>

      </div>
    </div>
  );
}

export default TicketChatModal;