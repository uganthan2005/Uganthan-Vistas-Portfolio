"use client";

import React, { useState } from "react";
import { useDesktopStore } from "@/store/useDesktopStore";

export default function WindowsMail() {
  const { showSecurityModal } = useDesktopStore();
  
  const [formData, setFormData] = useState({
    to: "Mitchell Ivin <mitchellivin@gmail.com>",
    from: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSend = () => {
    // Generate mailto link
    // Note: The 'to' address is hardcoded to the user's preferred contact email.
    // I am using the user's email from the StartMenu (uganthanmariappan@gmail.com)
    // Wait, the reference image had Mitchell Ivin. I should use uganthanmariappan@gmail.com.
    const targetEmail = "uganthanmariappan@gmail.com";
    const subject = encodeURIComponent(formData.subject || "Message from Portfolio");
    
    // Include the sender's email in the body since mailto 'from' isn't universally supported/reliable
    let bodyText = `From: ${formData.from || "Not provided"}\n\n`;
    bodyText += `${formData.message}`;
    
    const body = encodeURIComponent(bodyText);
    
    const mailtoUrl = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
    
    // Creating an anchor and clicking it is more reliable for mailto
    const a = document.createElement("a");
    a.href = mailtoUrl;
    a.click();
  };

  const menuStyle: React.CSSProperties = {
    padding: "2px 8px",
    fontSize: 12,
    color: "#000",
    cursor: "default",
  };

  const toolbarBtnStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    background: "transparent",
    border: "1px solid transparent",
    padding: "4px 8px",
    fontSize: 12,
    cursor: "pointer",
    color: "#333",
  };

  const inputRowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    marginBottom: 8,
  };

  const labelStyle: React.CSSProperties = {
    width: 60,
    fontSize: 13,
    color: "#000",
    textAlign: "right",
    marginRight: 8,
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: "4px 6px",
    border: "1px solid #a0a0a0",
    borderTopColor: "#666",
    borderLeftColor: "#666",
    fontSize: 13,
    fontFamily: "Arial, sans-serif",
    background: "white",
    color: "#000",
    outline: "none",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#f0f0f0", // Fallback
        fontFamily: "'Tahoma', 'Segoe UI', sans-serif",
      }}
    >
      {/* Menu Bar */}
      <div style={{ display: "flex", background: "#f5f5f5", borderBottom: "1px solid #ccc", padding: "2px 4px" }}>
        <div style={menuStyle}>File</div>
        <div style={menuStyle}>Edit</div>
        <div style={menuStyle}>View</div>
        <div style={menuStyle}>Tools</div>
        <div style={menuStyle}>Help</div>
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px", background: "#f5f5f5", borderBottom: "1px solid #d0d0d0", boxShadow: "0 1px 0 white inset" }}>
        <button 
          style={{ ...toolbarBtnStyle }} 
          onMouseOver={(e) => { e.currentTarget.style.border = "1px solid #b0b0b0"; e.currentTarget.style.background = "#e5e5e5"; }}
          onMouseOut={(e) => { e.currentTarget.style.border = "1px solid transparent"; e.currentTarget.style.background = "transparent"; }}
          onClick={handleSend}
        >
          <span style={{ fontSize: 20, color: "#4a86e8" }}>📨</span> Send Message
        </button>
        <button 
          style={{ ...toolbarBtnStyle }}
          onMouseOver={(e) => { e.currentTarget.style.border = "1px solid #b0b0b0"; e.currentTarget.style.background = "#e5e5e5"; }}
          onMouseOut={(e) => { e.currentTarget.style.border = "1px solid transparent"; e.currentTarget.style.background = "transparent"; }}
        >
          <span style={{ fontSize: 20, color: "#888" }}>📄</span> New Message
        </button>
        <div style={{ width: 1, height: 24, background: "#ccc", margin: "0 4px" }} />
        <button style={{ ...toolbarBtnStyle, padding: "4px" }} title="Cut">✂️</button>
        <button style={{ ...toolbarBtnStyle, padding: "4px" }} title="Copy">📋</button>
        <button style={{ ...toolbarBtnStyle, padding: "4px" }} title="Paste">📝</button>
        <div style={{ width: 1, height: 24, background: "#ccc", margin: "0 4px" }} />
        <button 
          style={{ ...toolbarBtnStyle, fontWeight: "bold" }}
          onClick={() => showSecurityModal("https://linkedin.com/in/uganthanm")}
        >
          <span style={{ background: "#0077b5", color: "white", padding: "2px 4px", borderRadius: 2 }}>in</span> LinkedIn
        </button>
      </div>

      {/* Main Body with Grid Background */}
      <div style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column", 
        padding: "16px",
        background: "white",
        // CSS Grid pattern to mimic classic Windows composition window background
        backgroundImage: "linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)",
        backgroundSize: "4px 4px",
      }}>
        
        {/* Form Fields */}
        <div style={inputRowStyle}>
          <div style={labelStyle}>To:</div>
          <input 
            type="text" 
            name="to" 
            value="Uganthan M <uganthanmariappan@gmail.com>" 
            readOnly 
            style={{ ...inputStyle, background: "#f0f0f0", color: "#333", border: "1px solid #b0b0b0" }} 
          />
        </div>
        
        <div style={inputRowStyle}>
          <div style={labelStyle}>From:</div>
          <input 
            type="text" 
            name="from" 
            placeholder="Your email address" 
            value={formData.from}
            onChange={handleChange}
            style={inputStyle} 
          />
        </div>

        <div style={inputRowStyle}>
          <div style={labelStyle}>Subject:</div>
          <input 
            type="text" 
            name="subject" 
            placeholder="Subject of your message" 
            value={formData.subject}
            onChange={handleChange}
            style={inputStyle} 
          />
        </div>

        <hr style={{ border: 0, borderTop: "1px solid #a0a0a0", borderBottom: "1px solid white", margin: "12px 0", marginLeft: 68 }} />

        {/* Message Area */}
        <div style={{ display: "flex", flex: 1 }}>
          <div style={{ width: 68 }}></div>
          <textarea 
            name="message"
            placeholder="Write your message here..."
            value={formData.message}
            onChange={handleChange}
            style={{
              flex: 1,
              resize: "none",
              border: "1px solid #a0a0a0",
              borderTopColor: "#666",
              borderLeftColor: "#666",
              padding: "8px",
              fontFamily: "Arial, sans-serif",
              fontSize: 14,
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Status Bar */}
      <div style={{
        padding: "2px 8px",
        background: "#f0f0f0",
        borderTop: "1px solid #ccc",
        fontSize: 11,
        color: "#333",
      }}>
        Compose a message to Uganthan M
      </div>
    </div>
  );
}
