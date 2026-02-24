import React from 'react';
import { MessageCircle, X } from 'lucide-react';
import useChatbot from '../../hooks/useChatbot';
import ChatWindow from './ChatWindow';

export default function ChatbotWidget() {
  const { messages, isLoading, isOpen, sendMessage, toggle, close } = useChatbot();

  return (
    <>
      {isOpen && <ChatWindow messages={messages} isLoading={isLoading} onSend={sendMessage} onClose={close} />}
      <button className="chat-fab" onClick={toggle} title="Chat with AI Assistant">
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        <style jsx>{`
          .chat-fab {
            position: fixed; bottom: 24px; right: 24px;
            width: 56px; height: 56px; border-radius: 16px;
            background: rgba(255,255,255,0.13);
            backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
            border: 1px solid rgba(255,255,255,0.3);
            color: var(--pearl); display: flex; align-items: center; justify-content: center;
            z-index: 1000;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.5);
            transition: all 0.3s ease; cursor: pointer;
          }
          .chat-fab:hover {
            background: rgba(255,255,255,0.2);
            transform: scale(1.05);
            box-shadow: 0 12px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.6);
          }
        `}</style>
      </button>
    </>
  );
}
