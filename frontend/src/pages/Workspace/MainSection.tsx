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
  previewUrl?: string | null; 
  mime_type?: string;
}

export interface TrashContextType {
  trash: MyFile[];
  moveToTrash: (file: MyFile) => void;
  clearTrash: () => void;
  deletePermanently: (fileId: string) => void;
  restoreFile: (fileId: string) => MyFile | undefined;
}

export const TrashContext = createContext<TrashContextType | null>(null);

export const useTrash = () => {
  const context = useContext(TrashContext);
  if (!context) throw new Error('useTrash must be used within TrashProvider');
  return context;
};

export const TrashProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trash, setTrash] = useState<MyFile[]>([]);

  const token = localStorage.getItem("token") || "";

  const moveToTrash = (file: MyFile) => setTrash(prev => [...prev, file]);

  // ✅ UPDATED: CLEAR TRASH NOW CALLS BACKEND DELETE
  const clearTrash = async () => {
    try {
      for (const file of trash) {
        await fetch(`http://localhost:5000/api/vault/file/${file.id}/delete`, {
          method: "DELETE",
          headers: { "x-auth-token": token }
        });
      }
    } catch (e) {
      console.error("Clear Trash Error:", e);
    }
    setTrash([]);
  };

  // ✅ UPDATED: PERMANENT DELETE CALLS BACKEND
  const deletePermanently = async (fileId: string) => {
    try {
      await fetch(`http://localhost:5000/api/vault/file/${fileId}/delete`, {
        method: "DELETE",
        headers: { "x-auth-token": token }
      });
    } catch (e) {
      console.error("Permanent Delete Error:", e);
    }

    setTrash(prev => prev.filter(f => f.id !== fileId));
  };

  const restoreFile = (fileId: string): MyFile | undefined => {
    const fileToRestore = trash.find(f => f.id === fileId);
    if (fileToRestore) {
      setTrash(prev => prev.filter(f => f.id !== fileId));
      return fileToRestore;
    }
    return undefined;
  };

  return (
    <TrashContext.Provider value={{ trash, moveToTrash, clearTrash, deletePermanently, restoreFile }}>
      {children}
    </TrashContext.Provider>
  );
};

// ------------------ Context for Chat History (unchanged)
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

// ------------------ ActionCard (unchanged)
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
    <div className={`group relative p-6 rounded-2xl bg-[#18181b] border hover:border-purple-500 transition-all duration-300 flex flex-col ${borderStyle}`}>
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

// ------------------ Dashboard (unchanged)
const DashboardView: React.FC<{ setCurrentView: (view: string) => void }> = ({ setCurrentView }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNavigateToUpload = () => navigate('/upload-notes');
  const handleActionRequiringFile = () => setCurrentView('myVault');

  return (
    <div className="p-8 lg:p-12">
      <h1 className="text-4xl font-bold mb-2 text-white">Welcome, {user?.firstName || 'User'}!</h1>
      <p className="text-gray-400 mb-10">Ready to supercharge your studies? Get started below.</p>

      <div>
        <h2 className="text-2xl font-semibold text-white mb-5">Create</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ActionCard title="Summarize Instantly" description="Upload notes to get summaries." icon="✨" buttonText="Summarize Notes" onButtonClick={handleNavigateToUpload} />
          <ActionCard title="Generate MCQs" description="Turn notes into MCQs." icon="🧠" buttonText="Generate MCQs" onButtonClick={handleNavigateToUpload} />
          <ActionCard title="Mind Map" description="Make interactive mind maps." icon="🗺️" buttonText="Create Mind Map" onButtonClick={handleNavigateToUpload} />
          <ActionCard title="Save Notes" description="Store notes in Vault." icon="📱" buttonText="Save Notes" onButtonClick={handleActionRequiringFile} />
        </div>
      </div>
    </div>
  );
};

// ------------------ Trash ------------------
const TrashView: React.FC<{ setRestoredFile: (file: MyFile) => void }> = ({ setRestoredFile }) => {
  const { trash, clearTrash, deletePermanently, restoreFile } = useTrash();
  const [filesInTrash, setFilesInTrash] = useState(trash);
  const [fileToDelete, setFileToDelete] = useState<MyFile | null>(null);

  useEffect(() => setFilesInTrash(trash), [trash]);

  const handleClearAll = () => {
    clearTrash();
    setFilesInTrash([]);
  };

  const handleRestore = (file: MyFile) => {
    const restored = restoreFile(file.id);
    if (restored) {
      setRestoredFile(restored);
      setFilesInTrash(prev => prev.filter(f => f.id !== file.id));
    }
  };

  const handleDeletePermanentlyConfirmed = (file: MyFile) => {
    deletePermanently(file.id);
    setFileToDelete(null);
  };

  const ConfirmationModal = () => {
    if (!fileToDelete) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-[#18181b] p-6 rounded-xl shadow-2xl max-w-sm w-full border border-red-500">
          <h3 className="text-xl font-bold text-red-400 mb-4">Confirm Permanent Deletion</h3>
          <p className="text-gray-300 mb-6">
            Are you sure you want to permanently delete **{fileToDelete.name}**? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setFileToDelete(null)} className="px-4 py-2 text-white rounded-lg bg-gray-600 hover:bg-gray-700">
              Cancel
            </button>
            <button onClick={() => handleDeletePermanentlyConfirmed(fileToDelete)} className="px-4 py-2 text-white rounded-lg bg-red-600 hover:bg-red-700">
              Yes, Delete Permanently
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 h-full flex flex-col relative">
      <ConfirmationModal />

      <button className="absolute top-4 right-4 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm shadow" onClick={handleClearAll}>
        Clean Trash
      </button>

      {filesInTrash.length > 0 ? (
        <div className="w-full mt-8">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">Files in Trash</h2>
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
            <ul className="text-gray-400 flex flex-col gap-2">
              {filesInTrash.map((file, i) => (
                <li key={file.id} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                  <div className="flex items-center gap-2">
                    <div className="text-xl">🗑️</div>
                    <span>{file.name} ({file.type || 'File'})</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleRestore(file)} className="text-xl text-gray-400 hover:text-white" title="Restore">🔄</button>
                    <button onClick={() => setFileToDelete(file)} className="text-xl text-gray-400 hover:text-red-500" title="Delete Permanently">🗑️</button>
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

// ------------------ Planner View (unchanged)
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
      <p className="text-center text-gray-300 text-sm italic">“A goal without a plan is just a wish.”</p>

      <AIStudyPlan />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CalendarBox
          onTasksUpdate={() => setRefreshTasks(prev => prev + 1)}
          onAlertsUpdate={() => setRefreshAlerts(prev => prev + 1)}
          onDeadlinesUpdate={() => setRefreshDeadlines(prev => prev + 1)}
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

// ------------------ VaultAI (unchanged)
const VaultAIView = VaultAI;

// ------------------ Main Section ------------------
interface MainSectionProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const MainSection: React.FC<MainSectionProps> = ({ currentView, setCurrentView }) => {
  const [restoredFile, setRestoredFile] = useState<MyFile | null>(null);

  const renderContent = () => {
    switch (currentView) {
      case 'myVault':
        return <MyVaultView restoredFile={restoredFile} clearRestoredFile={() => setRestoredFile(null)} />;
      case 'trash':
        return <TrashView setRestoredFile={setRestoredFile} />;
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
