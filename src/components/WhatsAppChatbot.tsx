import { useState, useRef, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { IoSend } from "react-icons/io5";
import { MdVerified, MdArrowForward } from "react-icons/md";
import "./styles/WhatsAppChatbot.css";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  actionUrl?: string;
  actionText?: string;
}

const WHATSAPP_PHONE = "919304892830";

const WhatsAppChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-1",
      sender: "bot",
      text: "Hello! 👋 I'm Anant Yash's assistant. How can I assist your recruitment or project inquiry today?",
      time: getCurrentTime(),
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleOpenChat = () => {
    setIsOpen(!isOpen);
    if (hasUnread) {
      setHasUnread(false);
    }
  };

  const handleQuickPrompt = (promptType: string) => {
    const time = getCurrentTime();
    let userText = "";
    let botReply = "";
    let waText = "";
    let actionText = "";

    switch (promptType) {
      case "job":
        userText = "💼 I'd like to discuss a job or project opportunity";
        botReply =
          "Awesome! Anant is actively available for Full Stack Developer & AI Engineer roles (Full-time, Contract, or Freelance). Let's connect directly on WhatsApp so he can review your requirements!";
        waText = "Hi Anant, I came across your portfolio and would like to discuss an opportunity with you.";
        actionText = "Continue on WhatsApp";
        break;

      case "resume":
        userText = "📄 Tell me about your background & experience";
        botReply =
          "Anant is a Computer Science Engineer from LPU with a Minor in CS from IIT Guwahati. He is an AI Fellow at 1M1B and ML Trainee at Infosys with experience building full-stack web architectures and machine learning systems.";
        waText = "Hi Anant, I'd like to review your resume and discuss your background.";
        actionText = "Request Resume on WhatsApp";
        break;

      case "tech":
        userText = "🛠️ What is your core tech stack?";
        botReply =
          "Anant's core stack includes: React, Next.js, Node.js, Express, TypeScript, Three.js, Python, PyTorch, LangChain, PostgreSQL, Docker, and AWS. Let's discuss your technical needs!";
        waText = "Hi Anant, I saw your tech stack and would like to discuss a technical project.";
        actionText = "Chat Tech on WhatsApp";
        break;

      case "direct":
        userText = "💬 I want to chat directly with Anant on WhatsApp";
        botReply =
          "Connecting you straight to Anant's WhatsApp! Click the green button below to launch WhatsApp instantly.";
        waText = "Hi Anant, I am reaching out from your portfolio and would love to chat.";
        actionText = "Launch WhatsApp Chat";
        break;

      default:
        return;
    }

    const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(waText)}`;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: userText,
        time,
      },
    ]);

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: botReply,
          time: getCurrentTime(),
          actionUrl: waUrl,
          actionText,
        },
      ]);
    }, 450);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    const time = getCurrentTime();
    setInputMessage("");

    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: userText,
        time,
      },
    ]);

    setIsTyping(true);

    const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(userText)}`;

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: `Thanks for your message! Click below to send this directly to Anant's WhatsApp.`,
          time: getCurrentTime(),
          actionUrl: waUrl,
          actionText: "Send to Anant's WhatsApp",
        },
      ]);

      // Proactively open WhatsApp in a new tab
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }, 400);
  };

  return (
    <div className="whatsapp-widget-container">
      {/* Floating Action Button */}
      <button
        className="whatsapp-launcher-btn"
        onClick={handleOpenChat}
        aria-label="Open WhatsApp Chat"
        title="Chat with Anant on WhatsApp"
        data-cursor="disable"
      >
        <FaWhatsapp />
        <span className="whatsapp-pulse-ring"></span>
        {hasUnread && <span className="whatsapp-unread-badge">1</span>}
      </button>

      {/* Hover Tooltip */}
      {!isOpen && (
        <div className="whatsapp-launcher-tooltip">
          <span className="tooltip-online-dot"></span>
          <span>Chat with Anant on WhatsApp</span>
        </div>
      )}

      {/* Interactive Chat Window Modal */}
      {isOpen && (
        <div className="whatsapp-chat-window">
          {/* Header */}
          <div className="whatsapp-chat-header">
            <div className="whatsapp-header-user">
              <div className="whatsapp-avatar-wrap">
                <img
                  src="/images/anant.jpg"
                  alt="Anant Yash"
                  className="whatsapp-avatar-img"
                />
                <span className="whatsapp-online-indicator"></span>
              </div>
              <div className="whatsapp-user-details">
                <h4>
                  Anant Yash <MdVerified className="whatsapp-verified-icon" />
                </h4>
                <p className="whatsapp-user-status">Online · Replies in minutes</p>
              </div>
            </div>
            <button
              className="whatsapp-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close Chat"
              data-cursor="disable"
            >
              <FiX />
            </button>
          </div>

          {/* Messages Body */}
          <div className="whatsapp-messages-body">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-msg-row ${msg.sender}`}>
                <div className="chat-msg-bubble">
                  <p style={{ margin: 0 }}>{msg.text}</p>
                  {msg.actionUrl && (
                    <a
                      href={msg.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bubble-wa-action-btn"
                      data-cursor="disable"
                    >
                      <FaWhatsapp style={{ fontSize: "13px" }} />
                      <span>{msg.actionText || "Open WhatsApp"}</span>
                      <MdArrowForward style={{ fontSize: "11px" }} />
                    </a>
                  )}
                  <span className="chat-msg-time">{msg.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-msg-row bot">
                <div className="chat-msg-bubble" style={{ padding: "8px 14px", fontStyle: "italic", opacity: 0.8 }}>
                  Anant is typing...
                </div>
              </div>
            )}

            {/* Quick Action Chips (Shown when 3 or fewer messages) */}
            {messages.length <= 3 && !isTyping && (
              <div className="whatsapp-quick-chips">
                <button
                  className="whatsapp-chip-btn"
                  onClick={() => handleQuickPrompt("job")}
                  data-cursor="disable"
                >
                  <span>💼 Discuss a Job / Project Role</span>
                  <MdArrowForward className="whatsapp-chip-arrow" />
                </button>
                <button
                  className="whatsapp-chip-btn"
                  onClick={() => handleQuickPrompt("resume")}
                  data-cursor="disable"
                >
                  <span>📄 View Resume & Background</span>
                  <MdArrowForward className="whatsapp-chip-arrow" />
                </button>
                <button
                  className="whatsapp-chip-btn"
                  onClick={() => handleQuickPrompt("tech")}
                  data-cursor="disable"
                >
                  <span>🛠️ Tech Stack & Capabilities</span>
                  <MdArrowForward className="whatsapp-chip-arrow" />
                </button>
                <button
                  className="whatsapp-chip-btn"
                  onClick={() => handleQuickPrompt("direct")}
                  data-cursor="disable"
                >
                  <span>💬 Chat directly on WhatsApp</span>
                  <MdArrowForward className="whatsapp-chip-arrow" />
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div className="whatsapp-chat-footer">
            <form onSubmit={handleSendMessage} className="whatsapp-input-form">
              <input
                type="text"
                placeholder="Type your message to Anant..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="whatsapp-text-input"
                data-cursor="disable"
              />
              <button
                type="submit"
                className="whatsapp-send-btn"
                disabled={!inputMessage.trim()}
                title="Send & Open on WhatsApp"
                data-cursor="disable"
              >
                <IoSend />
              </button>
            </form>

            <div className="whatsapp-direct-link-bar">
              <span>Direct WhatsApp:</span>
              <a
                href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Hi Anant, I'm reaching out from your portfolio!")}`}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="disable"
              >
                <FaWhatsapp /> +91 93048 92830
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppChatbot;
