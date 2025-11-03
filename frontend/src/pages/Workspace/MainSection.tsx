import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import VaultAI from './VaultAI';
import MyVaultView from './MyVaultView';
import { marked } from 'marked';

// ✅ Planner imports
import AIStudyPlan from '../../pages/Planner/AIStudyPlan';
import MyTasks from '../../pages/Planner/MyTasks';
import UpcomingDeadlines from '../../pages/Planner/UpcomingDeadlines';
import AlertsBox from '../../pages/Planner/AlertsBox';
import CalendarBox from "../../pages/Planner/CalendarBox";
import { createEvent, fetchEvents } from '../../api/planner';

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

  const moveToTrash = (file: MyFile) => setTrash(prev => [...prev, file]);
  const clearTrash = () => setTrash([]);

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
  const addSession = (session: ChatSession) => setHistory(prev => [...prev, session]);
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
          className="primary-btn w-full mt-6 py-2 transition-transform duration-200 ease-in-out"
          style={{ transform: 'scale(1)' }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

// ------------------ Dashboard ------------------
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
          <ActionCard title="Summarize Instantly" description="Upload your notes in PDF, PPT, or image formats and get concise AI-powered summaries." icon="✨" buttonText="Summarize Notes" onButtonClick={handleNavigateToUpload} />
          <ActionCard title="Generate MCQs" description="Turn your study material into personalized multiple-choice questions." icon="🧠" buttonText="Generate MCQs" onButtonClick={handleNavigateToUpload} />
          <ActionCard title="Mind Map" description="Visualize your notes as interactive mind maps." icon="🗺️" buttonText="Create Mind Map" onButtonClick={handleNavigateToUpload} />
          <ActionCard title="Save Notes" description="Store your processed notes securely." icon="📱" buttonText="Save Notes" onButtonClick={handleActionRequiringFile} />
        </div>
      </div>
    </div>
  );
};

// ------------------ Trash ------------------
const TrashView = () => {
  const { trash, clearTrash } = useTrash();
  const [filesInTrash, setFilesInTrash] = useState(trash);
  useEffect(() => setFilesInTrash(trash), [trash]);

  const handleRestore = (file: MyFile) => console.log(`Restoring file: ${file.name}`);
  const handleDeletePermanently = (fileToDelete: MyFile) => setFilesInTrash(prev => prev.filter(f => f.id !== fileToDelete.id));
  const handleClearAll = () => { setFilesInTrash([]); clearTrash(); };

  return (
    <div className="p-8 h-full flex flex-col relative">
      <button className="absolute top-4 right-4 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm shadow" onClick={handleClearAll}>
        Clean Trash
      </button>
      {filesInTrash.length > 0 ? (
        <div className="w-full mt-8">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">Files in Trash</h2>
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
            <ul className="text-gray-400 flex flex-col gap-2">
              {filesInTrash.map((file, i) => (
                <li key={i} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                  <div className="flex items-center gap-2">
                    <div className="text-xl">🗑️</div>
                    <span>{file.name} ({file.type || 'File'})</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleRestore(file)} className="text-xl text-gray-400 hover:text-white">🔄</button>
                    <button onClick={() => handleDeletePermanently(file)} className="text-xl text-gray-400 hover:text-red-500">🗑️</button>
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

// ------------------ PLANNER VIEW ------------------
const PlannerView: React.FC = () => {
  const [refreshTasks, setRefreshTasks] = useState(0);
  const [refreshAlerts, setRefreshAlerts] = useState(0);
  const [refreshDeadlines, setRefreshDeadlines] = useState(0);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const now = new Date();
        const fr = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const to = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
        const res = await fetchEvents(fr, to);
        setEvents(res.events || []);
      } catch (e) {
        console.error(e);
      }
    };
    loadEvents();
  }, []);

  return (
    <div className="p-8 lg:p-12 space-y-8">
      <p className="text-center text-gray-300 text-sm italic">
        “A goal without a plan is just a wish.”
      </p>

      <AIStudyPlan />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CalendarBox
          onTasksUpdate={() => setRefreshTasks((prev) => prev + 1)}
          onAlertsUpdate={() => setRefreshAlerts((prev) => prev + 1)}
          onDeadlinesUpdate={() => setRefreshDeadlines((prev) => prev + 1)}
        />
        <div className="flex flex-col gap-6">
          <UpcomingDeadlines refreshTrigger={refreshDeadlines} />
          <AlertsBox refreshTrigger={refreshAlerts} />
        </div>
        <MyTasks refreshTrigger={refreshTasks} />
      </div>
    </div>
  );
};

// ------------------ VaultAI ------------------
const VaultAIView = VaultAI;

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
      case 'vaultAI':
        return <VaultAIView />;
      case 'dashboard':
      default:
        return <DashboardView setCurrentView={setCurrentView} />;
    }
  };

  return (
    <ChatHistoryProvider>
      <TrashProvider>
        <main className="flex-1 overflow-y-auto main-content-area">{renderContent()}</main>
      </TrashProvider>
    </ChatHistoryProvider>
  );
};

export default MainSection;
