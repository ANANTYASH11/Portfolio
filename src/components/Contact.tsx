import { useState } from "react";
import { MdArrowOutward, MdCopyright } from "react-icons/md";
import { FiLock, FiTrash2, FiX } from "react-icons/fi";
import "./styles/Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Admin Dashboard State
  const [showAdmin, setShowAdmin] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [adminError, setAdminError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus("error");
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    setStatus("submitting");
    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
    try {
      const response = await fetch(`${API_BASE_URL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", company: "", message: "" });
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
        setErrorMessage(result.error || "Failed to submit message.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Connection failed. Is the server running?");
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
    try {
      const response = await fetch(`${API_BASE_URL}/api/messages`, {
        headers: {
          "x-admin-passcode": passcode
        }
      });
      const result = await response.json();
      if (response.ok) {
        setMessages(result.data);
        setIsAuthenticated(true);
      } else {
        setAdminError(result.error || "Unauthorized.");
      }
    } catch (err) {
      setAdminError("Unable to connect to server.");
    }
  };

  const handleDeleteMessage = async (id: string) => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
    try {
      const response = await fetch(`${API_BASE_URL}/api/messages/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-passcode": passcode
        }
      });
      if (response.ok) {
        setMessages(messages.filter((msg) => msg.id !== id));
      }
    } catch (err) {
      alert("Delete failed.");
    }
  };

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3 className="title">Hire Me</h3>
        
        <div className="contact-grid">
          {/* Query Form Section */}
          <div className="contact-form-box">
            <h4 className="form-title">Hire Me · Send a Message</h4>
            <form onSubmit={handleSubmit} className="query-form">
              <div className="form-group-row">
                <div className="form-field">
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    data-cursor="disable"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    data-cursor="disable"
                  />
                </div>
              </div>
              
              <div className="form-field">
                <label htmlFor="company">Company / Organization (Optional)</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your company name"
                  data-cursor="disable"
                />
              </div>

              <div className="form-field">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your query or proposal..."
                  rows={5}
                  required
                  data-cursor="disable"
                />
              </div>

              <button type="submit" className="submit-btn" disabled={status === "submitting"} data-cursor="disable">
                {status === "submitting" ? "Sending..." : "Hire Me / Send Message"}
              </button>

              {status === "success" && (
                <div className="form-alert success">
                  Your message has been sent successfully!
                </div>
              )}
              {status === "error" && (
                <div className="form-alert error">
                  {errorMessage}
                </div>
              )}
            </form>
          </div>

          {/* Contact Information & Credits */}
          <div className="contact-info-container">
            {/* Profile Photo */}
            <div className="contact-profile-card">
              <div className="contact-profile-img-wrap">
                <img
                  src="/images/anant.jpg"
                  alt="Anant Yash"
                  className="contact-profile-img"
                />
                <div className="contact-profile-glow"></div>
              </div>
              <div className="contact-profile-info">
                <h4 className="contact-profile-name">Anant Yash</h4>
                <p className="contact-profile-role">Available for Hire · Full Stack Developer · AI Engineer</p>
              </div>
            </div>

            <div className="contact-flex">
              <div className="contact-box">
                <h4>Email</h4>
                <p>
                  <a href="mailto:anantyashh21@gmail.com" data-cursor="disable">
                    anantyashh21@gmail.com
                  </a>
                  <a href="mailto:yashbuddy2021@gmail.com" data-cursor="disable">
                    yashbuddy2021@gmail.com
                  </a>
                </p>
                <h4>Phone</h4>
                <p>
                  <a href="tel:+919304892830" data-cursor="disable">
                    +91 93048 92830
                  </a>
                </p>
              </div>

              <div className="contact-box">
                <h4>Social</h4>
                <div className="contact-socials-list">
                  <a
                    href="https://github.com/ANANTYASH11"
                    target="_blank"
                    data-cursor="disable"
                    className="contact-social"
                  >
                    Github <MdArrowOutward />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/anantyash1111/"
                    target="_blank"
                    data-cursor="disable"
                    className="contact-social"
                  >
                    Linkedin <MdArrowOutward />
                  </a>
                </div>
              </div>

              <div className="contact-box">
                <h2>
                  Designed and Developed by <span>Anant Yash</span>
                </h2>
                <h5 className="copyright-label">
                  <MdCopyright /> 2026
                  <button 
                    className="admin-lock-btn" 
                    onClick={() => setShowAdmin(true)} 
                    title="Access Query Console"
                    data-cursor="disable"
                  >
                    <FiLock />
                  </button>
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-out Admin Dashboard Modal */}
      {showAdmin && (
        <div className="admin-overlay">
          <div className="admin-modal">
            <div className="admin-header">
              <h3>Query Control Panel</h3>
              <button className="close-btn" onClick={() => { setShowAdmin(false); setIsAuthenticated(false); setPasscode(""); }} data-cursor="disable">
                <FiX />
              </button>
            </div>

            {!isAuthenticated ? (
              <form onSubmit={handleAdminLogin} className="admin-login-form">
                <p>Enter the administrator passcode to access query database:</p>
                <input
                  type="password"
                  placeholder="Enter passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  required
                  data-cursor="disable"
                  autoFocus
                />
                <button type="submit" data-cursor="disable">Access Console</button>
                {adminError && <p className="admin-err-msg">{adminError}</p>}
              </form>
            ) : (
              <div className="admin-messages-list">
                <h4>Messages ({messages.length})</h4>
                {messages.length === 0 ? (
                  <p className="no-msgs-msg">No messages found in database.</p>
                ) : (
                  <div className="messages-scroll-area">
                    {messages.map((msg) => (
                      <div className="msg-card" key={msg.id}>
                        <div className="msg-card-header">
                          <h5>{msg.name}</h5>
                          <button className="delete-msg-btn" onClick={() => handleDeleteMessage(msg.id)} title="Delete message" data-cursor="disable">
                            <FiTrash2 />
                          </button>
                        </div>
                        {msg.company && <p className="msg-company"><strong>Company:</strong> {msg.company}</p>}
                        <p className="msg-email"><strong>Email:</strong> <a href={`mailto:${msg.email}`}>{msg.email}</a></p>
                        <p className="msg-text">{msg.message}</p>
                        <span className="msg-date">{new Date(msg.timestamp).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
