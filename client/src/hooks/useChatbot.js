import { useState, useCallback, useRef } from 'react';
import { sendChatMessage } from '../utils/api';

export default function useChatbot() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I\'m QueryMind AI assistant. Ask me anything about MongoDB queries, database concepts, or how to use this tool.' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const historyRef = useRef([]);

    const sendMessage = useCallback(async (text) => {
        if (!text.trim() || isLoading) return;

        const userMsg = { role: 'user', content: text };
        setMessages(prev => [...prev, userMsg]);
        historyRef.current.push(userMsg);
        setIsLoading(true);

        try {
            const data = await sendChatMessage(text, historyRef.current);
            const assistantMsg = { role: 'assistant', content: data.reply || data.message || 'Sorry, I could not process that.' };
            setMessages(prev => [...prev, assistantMsg]);
            historyRef.current.push(assistantMsg);
        } catch (err) {
            const errorMsg = { role: 'assistant', content: `I'm having trouble connecting. Please try again later. (${err.message})` };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    const toggle = useCallback(() => setIsOpen(prev => !prev), []);
    const close = useCallback(() => setIsOpen(false), []);

    return { messages, isLoading, isOpen, sendMessage, toggle, close };
}
