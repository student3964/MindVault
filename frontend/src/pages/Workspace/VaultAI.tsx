import React, { useState, useRef, useEffect, useContext } from 'react';
import { marked } from 'marked';
import { useChatHistory } from './MainSection';
import './Workspace.css'; // Import the main workspace styles

interface Message {
    id: number;
    sender: 'user' | 'bot';
    content: string;
}

const VaultAI: React.FC = () => {
    // The initial messages are now separated into two distinct messages
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, sender: 'bot', content: "Hi there! I'm your AI helper. What would you like to do today?"},
        { id: 2, sender: 'bot', content: "**For example:**\n- `Summarize my DBMS notes (dbms.pdf)`\n- `Create MCQs from history-lecture.pdf`" },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const { addSession } = useChatHistory();

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        return () => { if (messages.length > 1) addSession({ id: Date.now(), messages }); };
    }, [messages, addSession]);

    const handleSendMessage = async () => {
    const command = inputValue.trim();
    if (!command || isLoading) return;

    setMessages(prev => [
        ...prev,
        { id: Date.now(), sender: 'user', content: command }
    ]);
    setInputValue('');
    setIsLoading(true);

    try {
        // 🔥 SEND MESSAGE TO YOUR BACKEND AI ENDPOINT
        const res = await fetch("http://127.0.0.1:5000/api/vaultai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: command })
        });

        const data = await res.json();

        // If backend sent an AI response
        let botText = data.response || "Sorry, backend gave no response.";

        setMessages(prev => [
            ...prev,
            { id: Date.now() + 1, sender: "bot", content: botText }
        ]);
    } catch (error) {
        setMessages(prev => [
            ...prev,
            { id: Date.now() + 1, sender: "bot", content: "Error reaching AI backend." }
        ]);
    }

    setIsLoading(false);
};


    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="p-8 h-full flex flex-col vault-ai-bg">
            <h1 className="text-4xl font-bold mb-2 text-white text-center">VaultAI</h1>
            <p className="text-gray-400 mb-6 text-center">Use natural language to interact with your uploaded files.</p>

            {/* Adjusted styles for the chat box */}
            <div className="flex-1 p-4 rounded-2xl bg-white/10 border border-white/20 overflow-y-auto custom-scrollbar flex flex-col gap-4 mx-auto w-full max-w-[80%] max-h-[70%]">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        {/* Apply different styles based on the message ID to target the example message */}
                        <div className={`break-words max-w-[70%] px-4 py-2 rounded-xl text-white ${msg.sender === "user" ? "bg-purple-600 rounded-tr-none" : "bg-gray-700 rounded-xl"} ${msg.id === 2 ? 'text-sm max-w-[60%]' : ''}`} dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }}></div>
                    </div>
                ))}
                {isLoading && (<div className="flex justify-start"><div className="bg-gray-700 px-4 py-2 rounded-xl flex gap-1">{[0, 150, 300].map((delay, index) => (<span key={index} className="bg-white w-2 h-2 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }}></span>))}</div></div>)}
                <div ref={chatEndRef} />
            </div>
            {/* End of adjusted styles */}

            <div className="mt-4 flex items-center gap-2 mx-auto w-full max-w-[80%]">
                <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyPress} placeholder="e.g., Summarize my DBMS notes (dbms.pdf)" className="flex-grow bg-slate-800/80 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500" disabled={isLoading}/>
                <button onClick={handleSendMessage} className="primary-btn h-[52px] w-[52px] flex items-center justify-center rounded-lg text-base font-semibold" disabled={isLoading}>➤</button>
            </div>
        </div>
    );
};

export default VaultAI;