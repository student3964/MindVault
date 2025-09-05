// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';

const ChatModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const chatMessagesRef = useRef<HTMLDivElement>(null);
    const chatInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async () => {
        const input = chatInputRef.current;
        if (!input || !input.value.trim() || isLoading) return;

        const message = input.value.trim();
        appendMessage(message, 'user');
        input.value = '';
        setIsLoading(true);
        
        appendTypingIndicator();

        try {
            // This is a placeholder for your Gemini API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            const mockResponse = `The **American Revolution** (1775–1783) was an ideological and political revolution that occurred in British America. The key causes included disputes over British parliamentary sovereignty and taxes, such as the Stamp Act and the Townshend Acts, without colonial representation.`;
            
            removeTypingIndicator();
            appendMessage(mockResponse, 'bot');
        } catch (error) {
            removeTypingIndicator();
            appendMessage(`Sorry, an error occurred: ${error.message}`, 'bot', true);
        } finally {
            setIsLoading(false);
            input.focus();
        }
    };
    
    const appendMessage = (text, sender, isError = false) => {
        const messagesContainer = chatMessagesRef.current;
        if (!messagesContainer) return;
        const messageWrapper = document.createElement('div');
        const content = marked.parse(text);

        if (sender === 'user') {
            messageWrapper.innerHTML = `<div class="flex items-start space-x-3 justify-end"><div class="bg-purple-600 px-4 py-2 rounded-lg rounded-br-none"><div class="prose-custom max-w-none text-white">${content}</div></div></div>`;
        } else {
            const bgColor = isError ? 'bg-red-700/50' : 'bg-slate-700/50';
            messageWrapper.innerHTML = `<div class="flex items-start space-x-3"><div class="bg-purple-500/20 p-2 rounded-full"><span class="text-lg">🤖</span></div><div class="${bgColor} px-4 py-2 rounded-lg rounded-tl-none prose-custom prose-sm max-w-none">${content}</div></div>`;
        }
        messagesContainer.appendChild(messageWrapper);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };
    
    const appendTypingIndicator = () => {
        const messagesContainer = chatMessagesRef.current;
        if (!messagesContainer) return;
        const indicator = document.createElement('div');
        indicator.id = 'typing-indicator';
        indicator.innerHTML = `<div class="flex items-start space-x-3"><div class="bg-purple-500/20 p-2 rounded-full"><span class="text-lg">🤖</span></div><div class="bg-slate-700/50 px-4 py-3 rounded-lg rounded-tl-none"><div class="flex items-center space-x-1"><div class="w-2 h-2 bg-slate-400 rounded-full dot-bounce dot-1"></div><div class="w-2 h-2 bg-slate-400 rounded-full dot-bounce dot-2"></div><div class="w-2 h-2 bg-slate-400 rounded-full dot-bounce dot-3"></div></div></div></div>`;
        messagesContainer.appendChild(indicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    const removeTypingIndicator = () => {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    };

    return (
        <>
            <div id="chat-widget" className="fixed bottom-8 right-8 z-50">
                <button onClick={() => setIsOpen(true)} className="primary-btn w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                </button>
            </div>

            {isOpen && (
                <div id="chat-modal" className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center" onClick={() => setIsOpen(false)}>
                    <div className="w-full max-w-2xl h-[70vh] bg-[#18181b] border border-gray-700 rounded-2xl flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <header className="p-4 border-b border-gray-700 flex items-center justify-between">
                            <h3 className="text-lg font-semibold flex items-center text-white">✨ Smart Chat</h3>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white text-2xl">&times;</button>
                        </header>
                        <div ref={chatMessagesRef} className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
                             <div className="flex items-start space-x-3"><div className="bg-purple-500/20 p-2 rounded-full"><span className="text-lg">🤖</span></div><div className="bg-slate-700/50 px-4 py-2 rounded-lg rounded-tl-none"><p className="text-sm">Hi there! Ask me anything about your studies.</p></div></div>
                        </div>
                        <div className="p-4 border-t border-gray-700">
                            <div className="flex items-center space-x-2">
                                <input ref={chatInputRef} type="text" className="flex-grow bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none" placeholder="Ask a question..." onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} />
                                <button onClick={handleSendMessage} className="primary-btn h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0">
                                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
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