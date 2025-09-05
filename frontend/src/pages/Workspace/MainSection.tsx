import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { marked } from 'marked';

// --- ActionCard component (for the Dashboard) ---
// FIX: The border style is now always dashed and purple, the isFeatured prop is no longer needed.
const ActionCard = ({ title, description, icon, buttonText, onButtonClick }: { title: string; description: string; icon: string; buttonText?: string; onButtonClick?: () => void; }) => {
  const borderStyle = "border-purple-500 border-dashed"; // Applied to all cards now
  
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
      {buttonText && onButtonClick && (<button onClick={onButtonClick} className="primary-btn w-full mt-6 py-2">{buttonText}</button>)}
    </div>
  );
};

// --- Different Views ---

const DashboardView: React.FC<{ setCurrentView: (view: string) => void }> = ({ setCurrentView }) => {
    const navigate = useNavigate();
    const handleUploadNotesClick = () => navigate('/upload-notes');
    const handleActionRequiringFile = () => setCurrentView('myVault');

    return (
        <div className="p-8 lg:p-12">
          <h1 className="text-4xl font-bold mb-2 text-white">Welcome, Vaidehi!</h1>
          <p className="text-gray-400 mb-10">Ready to supercharge your studies? Get started below.</p>
          <div>
            <h2 className="text-2xl font-semibold text-white mb-5">Create</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* The isFeatured prop is no longer necessary */}
              <ActionCard title="Upload & Unlock Insights" description="Upload your notes in PDF, PPT, or image formats and instantly get concise summaries and visual mind maps powered by AI — no more endless scrolling through pages." icon="✨" buttonText="Upload Notes" onButtonClick={handleUploadNotesClick} />
              <ActionCard title="Quiz yourself on any supported documents" description="Turn your study material into personalized quizzes and flashcards in seconds. Practice smarter with auto-generated questions that reinforce key concepts." icon="🧠" buttonText="Generate Quizzes" onButtonClick={handleActionRequiringFile} />
              <ActionCard title="Chat & Ask Questions with AI" description="Stuck on a topic? Ask your doubts directly to our intelligent chatbot trained on your uploaded content and get clear, contextual answers instantly." icon="🤖" buttonText="Ask Anything, Anytime" onButtonClick={handleActionRequiringFile} />
              <ActionCard title="Organize, Save & Access Anywhere" description="Save your processed notes, summaries, and quizzes in one place. Organize everything neatly and access your personal knowledge vault whenever you need it." icon="📱" buttonText="Save Notes" onButtonClick={handleActionRequiringFile} />
            </div>
          </div>
        </div>
    );
};

interface MyFile { name: string; type: string; size: number; date: string; }

const MyVaultView = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedFileType, setSelectedFileType] = useState('Type');
    const [files, setFiles] = useState<MyFile[]>([]);
    const [viewMode, setViewMode] = useState('grid');
    const [openFileDropdownIndex, setOpenFileDropdownIndex] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);

    const handleCreateClick = () => { fileInputRef.current?.click(); };
    const handleSelectMultiple = () => { /* Logic for selecting multiple files */ };
    const handleFilesFromInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
            const newFiles = Array.from(selectedFiles).map((file) => ({
                name: file.name, type: file.type, size: file.size, date: new Date().toLocaleDateString(),
            }));
            setFiles(prevFiles => [...prevFiles, ...newFiles]);
        }
    };
    const toggleFileDropdown = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenFileDropdownIndex(prevIndex => (prevIndex === index ? null : index));
    };
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!dropdownRefs.current.some(ref => ref?.contains(event.target as Node))) {
                setOpenFileDropdownIndex(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="p-8">
            <div className="search-container ml-[-1rem] mr-[-1rem]"><input type="text" placeholder="Search for anything in your vault..." className="search-input" /></div>
            <div className="panel-header"><h2 className="panel-header-title">Files</h2><div className="panel-action-buttons"><button onClick={handleSelectMultiple}>Select multiple</button><button className="create-plus-btn" onClick={handleCreateClick}>+</button></div></div>
            <div className="filter-controls"><div className="dropdown-container"><button className="dropdown-button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>{selectedFileType} <span className="dropdown-arrow">▼</span></button>{isDropdownOpen && (<ul className="dropdown-menu"><li onClick={() => setSelectedFileType('PDF')}>PDF</li><li onClick={() => setSelectedFileType('PPT')}>PPT</li></ul>)}</div><div className="view-buttons"><button onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'active' : ''}>❐</button><button onClick={() => setViewMode('details')} className={viewMode === 'details' ? 'active' : ''}>≡</button></div></div>
            <input type="file" ref={fileInputRef} onChange={handleFilesFromInput} style={{ display: 'none' }} multiple />
            {files.length === 0 ? (<div className="centered-content-container"><div className="create-materials-section"><div className="file-icons"><div className="file-icon-circle">📄</div><div className="file-icon-circle">📂</div><div className="file-icon-circle">💬</div></div><h3>Your vault is empty!</h3><p>Upload files to get started with summaries, quizzes, and AI chat.</p><button className="create-btn" onClick={handleCreateClick}>Upload File</button></div></div>) : (<div className={viewMode === 'grid' ? 'files-grid-container' : 'files-details-container'}>{files.map((file, index) => (<div key={index} className={viewMode === 'grid' ? 'file-item-grid' : 'file-item-details'}><span className="file-icon">📄</span><p className="flex-grow text-left">{file.name}</p><div className="relative" ref={el => { dropdownRefs.current[index] = el; }}><button className="file-options-btn" onClick={(e) => toggleFileDropdown(index, e)}>⋮</button>{openFileDropdownIndex === index && (<ul className="file-dropdown-menu"><li>Summarize</li><li>Get MCQs</li><li>MindMap</li><li>Move to Trash</li><li>History</li></ul>)}</div></div>))}</div>)}
        </div>
    );
};

const TrashView = () => (
    <div className="p-8 h-full flex flex-col items-center justify-center text-center">
        <div className="text-8xl mb-4">🗑️</div>
        <h2 className="text-3xl font-bold text-white">Trash is empty</h2>
        <p className="text-gray-400 mt-2 max-w-xs">When you delete files, they will appear here.</p>
    </div>
);

const PlannerView: React.FC = () => {
    const [plan, setPlan] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const handleGeneratePlan = async () => {
        const goal = textAreaRef.current?.value.trim();
        if (!goal) return;
        setIsLoading(true);
        setPlan('');
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const mockResponse = `### Study Plan: Week of Sep 8, 2025\n\n**Monday:**\n- **AM:** History Research for WWII paper.\n- **PM:** Algebra review problems.\n\n**Tuesday:**\n- **AM:** Draft History paper introduction.\n- **PM:** Calculus practice exercises.`;
            const htmlContent = await marked.parse(mockResponse);
            setPlan(htmlContent);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            setPlan(`<p class="text-red-400">Error: ${errorMessage}</p>`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 lg:p-12">
            <h1 className="text-4xl font-bold mb-2 funky-font-title">AI Study Planner ✨</h1>
            <p className="text-gray-400 mb-8">Tell the AI your goals, and it will generate a custom plan.</p>
            <div className="p-6 rounded-2xl bg-[#18181b] border border-gray-700">
                <textarea ref={textAreaRef} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500" rows={5} placeholder="e.g., I have a math test on Friday and a history paper due next Monday..."></textarea>
                <button onClick={handleGeneratePlan} className="primary-btn mt-4 w-full md:w-auto" disabled={isLoading}>
                    {isLoading ? 'Generating Plan...' : 'Generate Plan'}
                </button>
            </div>
            {plan && (<div className="mt-8 p-6 rounded-2xl bg-[#18181b] border border-gray-700"><h2 className="text-2xl font-semibold text-white mb-4">Your Custom Study Plan</h2><div className="prose-custom max-w-none" dangerouslySetInnerHTML={{ __html: plan }}></div></div>)}
        </div>
    );
};

// --- Main Section Component ---
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
            case 'dashboard':
            default:
                return <DashboardView setCurrentView={setCurrentView} />;
        }
    };
    return (<main className="flex-1 overflow-y-auto main-content-area">{renderContent()}</main>);
};

export default MainSection;