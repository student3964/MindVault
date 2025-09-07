// frontend/src/pages/Workspace/ChatModal.tsx

import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import './ChatModal.css'; // Import the new CSS file

// Define a type for our message objects
interface Message {
    text: string;
    sender: 'user' | 'bot';
    isError?: boolean;
}

const ChatModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // The chat history is now managed by React state
    const [messages, setMessages] = useState<Message[]>([
        { text: "Hi there! Ask me anything about your studies.", sender: 'bot' }
    ]);

    const chatMessagesRef = useRef<HTMLDivElement>(null);
    const chatInputRef = useRef<HTMLInputElement>(null);

    // Effect to scroll to the bottom when new messages are added
    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSendMessage = async () => {
        const input = chatInputRef.current;
        if (!input || !input.value.trim() || isLoading) return;

        const userMessage: Message = { text: input.value.trim(), sender: 'user' };
        setMessages(prev => [...prev, userMessage]);

        input.value = '';
        setIsLoading(true);

        try {
            // This is a placeholder for your Gemini API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            const mockResponse = `The **American Revolution** (1775–1783) was an ideological and political revolution that occurred in British America. The key causes included disputes over British parliamentary sovereignty and taxes, such as the Stamp Act and the Townshend Acts, without colonial representation.`;

            const botMessage: Message = { text: mockResponse, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            const botMessage: Message = { text: `Sorry, an error occurred: ${errorMessage}`, sender: 'bot', isError: true };
            setMessages(prev => [...prev, botMessage]);
        } finally {
            setIsLoading(false);
            input.focus();
        }
    };

    return (
        <>
            {/* The Floating Button */}
            {!isOpen && (
                <div id="chat-widget" className="fixed bottom-8 right-8 z-50">
                    <button onClick={() => setIsOpen(true)} className="bg-purple-600 hover:bg-purple-700 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                    </button>
                </div>
            )}

            {/* The Modal Window */}
            {isOpen && (
                <div id="chat-modal" className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center">
                    <div className="w-full max-w-2xl h-[80vh] bg-[#18181b] border border-gray-700 rounded-2xl flex flex-col shadow-2xl">
                        <header className="p-4 border-b border-gray-700 flex items-center justify-between flex-shrink-0">
                            <h3 className="text-lg font-semibold flex items-center text-white">✨ Smart Chat</h3>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white text-2xl">&times;</button>
                        </header>

                        {/* Messages are now rendered from the state array */}
                        <div ref={chatMessagesRef} className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                    {msg.sender === 'bot' && <div className="bg-purple-500/20 p-2 rounded-full"><span className="text-lg">🤖</span></div>}
                                    <div
                                        className={`px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-purple-600 rounded-br-none' : (msg.isError ? 'bg-red-700/50' : 'bg-slate-700/50')} rounded-tl-none`}
                                        dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) }}
                                    ></div>
                                </div>
                            ))}
                            {/* The typing indicator is now rendered based on state */}
                            {isLoading && (
                                <div id="typing-indicator">
                                    <div className="flex items-start space-x-3">
                                        <div className="bg-purple-500/20 p-2 rounded-full"><span className="text-lg">🤖</span></div>
                                        <div className="bg-slate-700/50 px-4 py-3 rounded-lg rounded-tl-none">
                                            <div className="flex items-center space-x-1">
                                                <div className="w-2 h-2 bg-slate-400 rounded-full dot-bounce dot-1"></div>
                                                <div className="w-2 h-2 bg-slate-400 rounded-full dot-bounce dot-2"></div>
                                                <div className="w-2 h-2 bg-slate-400 rounded-full dot-bounce dot-3"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* <div className="p-4 border-t border-gray-700 flex-shrink-0">
                            <div className="flex items-center space-x-2">
                                <input ref={chatInputRef} type="text" className="flex-grow bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none" placeholder="Ask a question..." onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} disabled={isLoading} />
                                <button onClick={handleSendMessage} className="bg-purple-600 hover:bg-purple-700 h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0" disabled={isLoading}>
                                   <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </button>
                            </div>
                        </div> */}
                        {/* This is the corrected code block */}
                        <div className="p-4 border-t border-gray-700 flex-shrink-0">
                            <div className="flex items-center space-x-2">
                                <input ref={chatInputRef} type="text" className="flex-grow bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Ask a question..." onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} disabled={isLoading} />
                                <button onClick={handleSendMessage} className="bg-purple-600 hover:bg-purple-700 h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors" disabled={isLoading}>
                                    {/* CORRECTED "Send" icon SVG */}
                                    <svg className="w-6 h-6 text-white transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatModal;