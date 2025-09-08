import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { marked } from 'marked';
import VaultAI from './VaultAI';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MyVaultView from './MyVaultView'; // FIX: Correctly import MyVaultView

// ------------------ Context for Trash ------------------
export interface MyFile {
    name: string;
    type?: string;
    id: string;
    size?: number;
    date?: string;
}

export interface TrashContextType {
    trash: MyFile[];
    moveToTrash: (file: MyFile) => void;
    clearTrash: () => void;
}

export const TrashContext = createContext<TrashContextType | null>(null);

export const useTrash = () => {
    const context = useContext(TrashContext);
    if (!context) throw new Error('useTrash must be used within TrashProvider');
    return context;
};

export const TrashProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [trash, setTrash] = useState<MyFile[]>([]);
    
    const moveToTrash = (file: MyFile) => {
        setTrash(prevTrash => [...prevTrash, file]);
    };
    
    const clearTrash = () => {
        setTrash([]);
    };

    return (
        <TrashContext.Provider value={{ trash, moveToTrash, clearTrash }}>
            {children}
        </TrashContext.Provider>
    );
};

// ------------------ Context for Chat History ------------------
interface Message {
    id: number;
    sender: 'user' | 'bot';
    content: string;
}

interface ChatSession {
    id: number;
    messages: Message[];
}

interface ChatHistoryContextType {
    history: ChatSession[];
    addSession: (session: ChatSession) => void;
}

export const ChatHistoryContext = createContext<ChatHistoryContextType | null>(null);

export const useChatHistory = () => {
    const context = useContext(ChatHistoryContext);
    if (!context) throw new Error('useChatHistory must be used within ChatHistoryProvider');
    return context;
};

export const ChatHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [history, setHistory] = useState<ChatSession[]>([]);

    const addSession = (session: ChatSession) => {
        setHistory(prev => [...prev, session]);
    };

    return (
        <ChatHistoryContext.Provider value={{ history, addSession }}>
            {children}
        </ChatHistoryContext.Provider>
    );
};

// ------------------ ActionCard for Dashboard ------------------
const ActionCard = ({
    title,
    description,
    icon,
    buttonText,
    onButtonClick,
}: {
    title: string;
    description: string;
    icon: string;
    buttonText?: string;
    onButtonClick?: () => void;
}) => {
    const borderStyle = 'border-purple-500 border-dashed';

    return (
        <div
            className={`group relative p-6 rounded-2xl bg-[#18181b] border hover:border-purple-500 transition-all duration-300 flex flex-col ${borderStyle}`}
        >
            <div className="flex-grow">
                <div className="flex items-start space-x-5">
                    <div className="text-3xl mt-1">{icon}</div>
                    <div>
                        <h3 className="font-bold text-lg text-white mb-1">{title}</h3>
                        <p className="text-slate-400 text-sm">{description}</p>
                    </div>
                </div>
            </div>
            {buttonText && onButtonClick && (
                <button
                    onClick={onButtonClick}
                    className="primary-btn w-full mt-6 py-2"
                >
                    {buttonText}
                </button>
            )}
        </div>
    );
};

// ------------------ Views ------------------

// Dashboard
const DashboardView: React.FC<{ setCurrentView: (view: string) => void }> = ({ setCurrentView }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleNavigateToUpload = () => navigate('/upload-notes');
    const handleActionRequiringFile = () => setCurrentView('myVault');

    return (
        <div className="p-8 lg:p-12">
            <h1 className="text-4xl font-bold mb-2 text-white">Welcome, {user?.firstName || 'User'}!</h1>
            <p className="text-gray-400 mb-10">
                Ready to supercharge your studies? Get started below.
            </p>

            <div>
                <h2 className="text-2xl font-semibold text-white mb-5">Create</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ActionCard
                        title="Summarize Instantly"
                        description="Upload your notes in PDF, PPT, or image formats and get concise AI-powered summaries that highlight the most important points."
                        icon="✨"
                        buttonText="Summarize Notes"
                        onButtonClick={handleNavigateToUpload}
                    />
                    <ActionCard
                        title="Generate MCQs"
                        description="Turn your study material into personalized multiple-choice questions. Practice smarter with auto-generated quizzes that reinforce key concepts."
                        icon="🧠"
                        buttonText="Generate MCQs"
                        onButtonClick={handleNavigateToUpload}
                    />
                    <ActionCard
                        title="Mind Map"
                        description="Visualize your notes as interactive mind maps. See connections, explore relationships, and strengthen your understanding at a glance."
                        icon="🗺️"
                        buttonText="Create Mind Map"
                        onButtonClick={handleNavigateToUpload}
                    />
                    <ActionCard
                        title="Save Notes"
                        description="Store your processed notes, summaries, and quizzes in one secure place. Organize everything neatly and access your personal vault anytime."
                        icon="📱"
                        buttonText="Save Notes"
                        onButtonClick={handleActionRequiringFile}
                    />
                </div>
            </div>
        </div>
    );
};

// Trash
const TrashView = () => {
    const { trash, clearTrash } = useTrash();
    const [filesInTrash, setFilesInTrash] = useState(trash);
    
    // FIX: useEffect to synchronize local state with context changes
    useEffect(() => {
        setFilesInTrash(trash);
    }, [trash]);

    const handleRestore = (file: MyFile) => {
        console.log(`Restoring file: ${file.name}`);
    };

    const handleDeletePermanently = (fileToDelete: MyFile) => {
        setFilesInTrash(prevFiles => prevFiles.filter(file => file.id !== fileToDelete.id));
    };

    const handleClearAll = () => {
        setFilesInTrash([]);
        clearTrash();
    };

    return (
        <div className="p-8 h-full flex flex-col relative">
            <button
                className="absolute top-4 right-4 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm shadow"
                onClick={handleClearAll}
            >
                Clean Trash
            </button>

            {filesInTrash.length > 0 ? (
                <div className="w-full mt-8">
                    <h2 className="text-3xl font-bold text-white mb-4 text-center">Files in Trash</h2>
                    <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
                        <ul className="text-gray-400 flex flex-col gap-2">
                            {filesInTrash.map((file, index) => (
                                <li
                                    key={index}
                                    className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="text-xl">🗑️</div>
                                        <span>{file.name} ({file.type || 'File'})</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleRestore(file)}
                                            className="text-xl text-gray-400 hover:text-white transition-colors"
                                            title="Restore"
                                        >
                                            🔄
                                        </button>
                                        <button
                                            onClick={() => handleDeletePermanently(file)}
                                            className="text-xl text-gray-400 hover:text-red-500 transition-colors"
                                            title="Delete Permanently"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center flex-1">
                    <div className="text-8xl mb-4">🗑️</div>
                    <h2 className="text-3xl font-bold text-white text-center">Trash is empty</h2>
                    <p className="text-gray-400 mt-2 text-center">
                        When you remove files from your Vault, they’ll appear here.
                    </p>
                </div>
            )}
        </div>
    );
};

// History
const HistoryView = () => (
    <div className="p-8 h-full flex flex-col text-center relative">
        <button className="absolute top-4 right-4 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm shadow">
            Clear History
        </button>

        <div className="flex flex-col items-center justify-center flex-1 mt-18">
            <div className="text-8xl mb-4">💬</div>
            <h2 className="text-3xl font-bold text-white">No history yet</h2>
            <p className="text-gray-400 mt-2">
                Start a conversation with the AI Bot to see it here.
            </p>
        </div>
    </div>
);

// Planner
const PlannerView: React.FC = () => {
    const [plan, setPlan] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const calendarRef = useRef<HTMLDivElement>(null);
    const [goalsInput, setGoalsInput] = useState('');
    const [subjectsInput, setSubjectsInput] = useState('');
    const [timeFrameInput, setTimeFrameInput] = useState('');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setIsCalendarOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [calendarRef]);

    const handleGeneratePlan = async () => {
        const goal = goalsInput.trim() || subjectsInput.trim() || timeFrameInput.trim();
        if (!goal) return;
        setIsLoading(true);
        setPlan('');
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const mockResponse = `### Study Plan: Week of Sep 8, 2025\n\n**Monday:**\n- **AM:** History Research for WWII paper.\n- **PM:** Algebra review problems.\n\n**Tuesday:**\n- **AM:** Draft History paper introduction.\n- **PM:** Calculus practice exercises.`;
            const htmlContent = await marked.parse(mockResponse);
            setPlan(htmlContent);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            setPlan(`<p class="text-red-400">Error: ${errorMessage}</p>`);
        } finally {
            setIsLoading(false);
        }
    };

    const renderFullCalendar = () => {
        const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
        const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
        const days = Array.from({ length: firstDayOfMonth }, (_, i) => <div key={`empty-${i}`}></div>);

        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            days.push(
                <button key={i} onClick={() => { setSelectedDate(date); setIsCalendarOpen(false); }} className={`p-2 rounded-lg text-white font-semibold transition-colors text-sm ${isSelected ? 'bg-purple-600' : 'hover:bg-slate-700'}`}>
                    {i}
                </button>
            );
        }
        return (
            <div ref={calendarRef} className="absolute z-10 w-80 right-0 top-full mt-2">
                <div className="bg-[#1f1f22] border border-gray-700 rounded-lg p-4 shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>←</button>
                        <span className="font-bold">{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>→</button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="text-gray-400 font-bold">{day}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center mt-2">{days}</div>
                    <button onClick={() => setIsCalendarOpen(false)} className="w-full mt-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Done</button>
                </div>
            </div>
        );
    };

    const renderDateContent = () => {
        if (!selectedDate) return <p className="text-gray-400 text-center">Select a date to see details.</p>;
        const formattedDate = selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        return (
            <div>
                <h3 className="text-lg font-bold text-white mb-4">Plan for {formattedDate}</h3>
                <div className="space-y-4">
                    <div><label className="block text-gray-400 mb-1">Add a Reminder</label><input type="text" placeholder="e.g., Study for history test" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"/></div>
                    <div><label className="block text-gray-400 mb-1">Add a Deadline</label><input type="text" placeholder="e.g., Finish math homework by 5 PM" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"/></div>
                    <div><label className="block text-gray-400 mb-1">To-Do List</label><textarea rows={3} placeholder="1. Read Chapter 5&#10;2. Complete practice problems" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"/></div>
                    <button className="w-full mt-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Done</button>
                </div>
            </div>
        );
    };

    return (
        <div className="p-8 lg:p-12">
            <div className="text-center mb-8"><h1 className="text-4xl font-bold text-white">Your AI Planner</h1><p className="text-gray-400 mt-2">A goal without a plan is just a wish.</p></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 p-6 rounded-2xl bg-white/10 border border-gray-700 h-min relative">
                    <div className="flex justify-between items-center relative">
                        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Bradley Hand ITC' }}>Calendar</h2>
                        <button onClick={() => setIsCalendarOpen(!isCalendarOpen)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"><span className="text-xl">📅</span></button>
                        {isCalendarOpen && renderFullCalendar()}
                    </div>
                    <div className="mt-6">{renderDateContent()}</div>
                </div>
                <div className="lg:col-span-2 p-6 rounded-2xl bg-white/10 border border-gray-700">
                    <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Bradley Hand ITC' }}>Create a Study Plan</h2>
                    <div className="space-y-4 mb-6">
                        <div><label htmlFor="goals" className="block text-gray-400 mb-1">Goals</label><textarea id="goals" value={goalsInput} onChange={(e) => setGoalsInput(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500" rows={3} placeholder="e.g., Get an A on my final exam."></textarea></div>
                        <div><label htmlFor="subjects" className="block text-gray-400 mb-1">Key Subjects</label><input id="subjects" type="text" value={subjectsInput} onChange={(e) => setSubjectsInput(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g., History, Math, Science"/></div>
                        <div><label htmlFor="timeframe" className="block text-gray-400 mb-1">Time Frame</label><input id="timeframe" type="text" value={timeFrameInput} onChange={(e) => setTimeFrameInput(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g., Next 2 weeks"/></div>
                    </div>
                    <button onClick={handleGeneratePlan} className="primary-btn w-full md:w-auto" disabled={isLoading}>{isLoading ? 'Generating Plan...' : 'Generate Plan'}</button>
                    {plan && (<div className="mt-8"><h2 className="text-2xl font-semibold text-white mb-4">Your Custom Study Plan</h2><div className="prose-custom max-w-none" dangerouslySetInnerHTML={{ __html: plan }}></div></div>)}
                </div>
            </div>
        </div>
    );
};

// VaultAI / AIBot View
const VaultAIView: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, sender: 'bot', content: "Hi there! I'm your AI helper. What would you like to do today?\n\n**For example:**\n- `Summarize my DBMS notes (dbms.pdf)`\n- `Create MCQs from history-lecture.pdf`" },
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

        setMessages(prev => [...prev, { id: Date.now(), sender: 'user', content: command }]);
        setInputValue('');
        setIsLoading(true);

        await new Promise(resolve => setTimeout(resolve, 1000));

        let botResponseContent: string;
        if (command.toLowerCase().includes('summarize')) {
            botResponseContent = 'Okay, summarizing **dbms.pdf** for you...';
        } else {
            botResponseContent = "Sorry, I can't do that yet.";
        }
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', content: botResponseContent }]);
        setIsLoading(false);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="p-8 h-full flex flex-col">
            <h1 className="text-4xl font-bold mb-2 text-white text-center">VaultAI</h1>
            <p className="text-gray-400 mb-6 text-center">Use natural language to interact with your uploaded files.</p>

            <div className="flex-1 p-4 rounded-2xl bg-white/10 border border-white/20 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] px-4 py-2 rounded-xl text-white break-words ${msg.sender === "user" ? "bg-purple-600 rounded-tr-none" : "bg-gray-700 rounded-xl"}`} dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }}></div>
                    </div>
                ))}
                {isLoading && (<div className="flex justify-start"><div className="bg-gray-700 px-4 py-2 rounded-xl flex gap-1">{[0, 150, 300].map((delay, index) => (<span key={index} className="bg-white w-2 h-2 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }}></span>))}</div></div>)}
                <div ref={chatEndRef} />
            </div>
            <div className="mt-4 flex items-center gap-2">
                <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyPress} placeholder="e.g., Summarize my DBMS notes (dbms.pdf)" className="flex-grow bg-slate-800/80 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500" disabled={isLoading}/>
                <button onClick={handleSendMessage} className="primary-btn h-[52px] w-[52px] flex items-center justify-center rounded-lg text-base font-semibold" disabled={isLoading}>➤</button>
            </div>
        </div>
    );
};

// ------------------ Main Section ------------------
interface MainSectionProps {
    currentView: string;
    setCurrentView: (view: string) => void;
}

const MainSection: React.FC<MainSectionProps> = ({ currentView, setCurrentView }) => {
    const renderContent = () => {
        switch (currentView) {
            case 'myVault':
                return <MyVaultView />;
            case 'trash':
                return <TrashView />;
            case 'planner':
                return <PlannerView />;
            case 'aiBot':
            case 'vaultAI': // Renamed from aiBot to match friend's version for consistency
                return <VaultAI />;
            case 'history':
                return <HistoryView />;
            case 'dashboard':
            default:
                return <DashboardView setCurrentView={setCurrentView} />;
        }
    };

    return (
        // The providers wrap the main content, making context available to all views
        <ChatHistoryProvider>
            <TrashProvider>
                <main className="flex-1 overflow-y-auto main-content-area">
                    {renderContent()}
                </main>
            </TrashProvider>
        </ChatHistoryProvider>
    );
};

export default MainSection;