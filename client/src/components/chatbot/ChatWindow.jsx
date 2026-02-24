import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Loader2 } from 'lucide-react';
import MessageBubble from './MessageBubble';

export default function ChatWindow({ messages, isLoading, onSend, onClose }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) { onSend(input.trim()); setInput(''); }
  };

  return (
    <div className="chat-window glass-modal">
      <div className="chat-header">
        <div className="chat-title">
          <div className="status-dot" />
          <span>QueryMind Assistant</span>
        </div>
        <button className="close-btn" onClick={onClose}><X size={18} /></button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, i) => <MessageBubble key={i} message={msg} />)}
        {isLoading && (
          <div className="typing-indicator"><span /><span /><span /></div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input" onSubmit={handleSubmit}>
        <input type="text" className="glass-input" placeholder="Ask about MongoDB..." value={input} onChange={e => setInput(e.target.value)} autoFocus />
        <button type="submit" className="glass-button glass-button-primary send-btn" disabled={!input.trim() || isLoading}>
          {isLoading ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
        </button>
      </form>

      <style jsx>{`
        .chat-window {
          position: fixed; bottom: 96px; right: 24px; width: 380px; max-height: 520px;
          display: flex; flex-direction: column; z-index: 1001;
          animation: slideUp 0.3s ease; overflow: hidden;
        }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .chat-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
        }
        .chat-title { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 0.95rem; color: var(--pearl); }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--pearl); box-shadow: 0 0 8px rgba(245,246,247,0.4); }
        .close-btn { color: var(--pearl-muted); padding: 4px; border-radius: 6px; transition: color 0.2s; }
        .close-btn:hover { color: var(--pearl); }
        .chat-messages { flex: 1; padding: 20px; overflow-y: auto; max-height: 340px; background: rgba(0,0,0,0.5); }
        .chat-input { display: flex; gap: 8px; padding: 16px 20px; border-top: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); }
        .send-btn { width: 42px; height: 42px; padding: 0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .typing-indicator { display: flex; gap: 4px; padding: 12px 16px; }
        .typing-indicator span { width: 8px; height: 8px; border-radius: 50%; background: var(--pearl-muted); animation: bounce 1.2s ease-in-out infinite; }
        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.3; } 30% { transform: translateY(-8px); opacity: 1; } }
        @media (max-width: 480px) { .chat-window { right: 8px; left: 8px; width: auto; bottom: 80px; } }
      `}</style>
    </div>
  );
}
