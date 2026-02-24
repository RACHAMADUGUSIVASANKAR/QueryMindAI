import React from 'react';
import { Bot, User } from 'lucide-react';

export default function MessageBubble({ message }) {
  const isBot = message.role === 'assistant';

  return (
    <div className={`message ${isBot ? 'bot' : 'user'}`}>
      <div className="avatar">
        {isBot ? <Bot size={16} /> : <User size={16} />}
      </div>
      <div className="bubble">
        <p>{message.content}</p>
      </div>

      <style jsx>{`
        .message { display: flex; gap: 10px; margin-bottom: 16px; align-items: flex-start; }
        .message.user { flex-direction: row-reverse; }
        .avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; color: var(--pearl-dim);
        }
        .message.user .avatar { background: rgba(255,255,255,0.15); }
        .bubble { max-width: 75%; padding: 12px 16px; border-radius: 16px; font-size: 0.88rem; line-height: 1.6; }
        .bot .bubble {
          background: rgba(255,255,255,0.1); backdrop-filter: blur(15px);
          border: 1px solid rgba(255,255,255,0.2); color: var(--pearl);
          border-bottom-left-radius: 4px;
        }
        .user .bubble {
          background: rgba(255,255,255,0.18);
          border: 1px solid rgba(255,255,255,0.3); color: var(--pearl);
          border-bottom-right-radius: 4px;
        }
        .bubble p { margin: 0; color: inherit; }
      `}</style>
    </div>
  );
}
