import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Home.css';
import './uploadNotes.css';

// Type for the MCQ structure
interface MCQ {
  question: string;
  options: string[];
  correctAnswer: string;
}

const UploadNotes: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('PDF');
    const [activeTabWidth, setActiveTabWidth] = useState(0);
    const [activeTabLeft, setActiveTabLeft] = useState(0);
    const sliderBarRef = useRef<HTMLDivElement>(null);
    const tabs = ['PDF', 'PowerPoint', 'Image', 'Text'];

    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [summary, setSummary] = useState('');
    const [error, setError] = useState('');
    const [isMindMapPopupOpen, setIsMindMapPopupOpen] = useState(false);
    const [mcqs, setMcqs] = useState<MCQ[]>([]);

    // This function can be uncommented when your backend is ready
    // const uploadFileToBackend = async (file: File) => { ... };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile(file);
            setIsFileUploaded(true);
            setSummary('');
            setMcqs([]);
            setError('');
        }
    };

    const handleSummaryClick = async () => {
        if (!uploadedFile) return;
        setIsLoading(true);
        setError('');
        setSummary('');
        setMcqs([]);

        // MOCKED API CALL FOR DEMONSTRATION
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSummary("This is a sample summary of your document. It highlights the key concepts, main arguments, and important conclusions found within the text, allowing for a quick and efficient review.");
        setIsLoading(false);
    };

    // --- FIX: This function now works with a mock response ---
    const handleGenerateMcqsClick = async () => {
        if (!uploadedFile) {
            setError('Please upload a file first.');
            return;
        }
        setIsLoading(true);
        setError('');
        setSummary('');
        setMcqs([]);

        try {
            // MOCKED API CALL FOR DEMONSTRATION
            await new Promise(resolve => setTimeout(resolve, 2000));
            const mockResponse = [
                { question: "What is the primary function of the mitochondria?", options: ["Photosynthesis", "Cellular Respiration", "DNA Replication", "Protein Synthesis"], correctAnswer: "Cellular Respiration" },
                { question: "Who wrote 'To Kill a Mockingbird'?", options: ["Harper Lee", "J.K. Rowling", "George Orwell", "Mark Twain"], correctAnswer: "Harper Lee" },
            ];
            setMcqs(mockResponse);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMindMapClick = () => setIsMindMapPopupOpen(true);
    const closeMindMapPopup = () => setIsMindMapPopupOpen(false);

    useEffect(() => {
        if (sliderBarRef.current) {
            const activeTabElement = sliderBarRef.current.querySelector('.file-type.active');
            if (activeTabElement) {
                const htmlElement = activeTabElement as HTMLElement;
                setActiveTabWidth(htmlElement.clientWidth);
                setActiveTabLeft(htmlElement.offsetLeft);
            }
        }
    }, [activeTab]);

    return (
        <div className="home-container">
            {/* --- FIX: Navbar is now the same as the Workspace page --- */}
            <Navbar activePage="workspace" isLoggedIn={true} />

            <div className="pt-24">
                <h1 className="supported-types text-3xl">Supported File Types</h1>
                <div className="slider-container">
                    <div
                        className="slider-bar-bg"
                        ref={sliderBarRef}
                        style={{'--active-tab-width': `${activeTabWidth}px`, '--active-tab-left': `${activeTabLeft}px`} as React.CSSProperties}
                    >
                        {tabs.map((tab) => (
                            <button key={tab} className={`file-type ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="description-box">
                    <h3 className="text-xl mb-2 funky-font">AI {activeTab} Tools</h3>
                    <p>Upload any {activeTab} file and MindVault will instantly help you study smarter.</p>
                </div>
                <div className="upload-flex-container">
                    {isFileUploaded ? (
                        <div className="uploaded-file-info">
                            <p className="uploaded-file-name">Ready: {uploadedFile?.name}</p>
                            <div className="uploaded-buttons">
                                <button className="select-files-btn" onClick={handleSummaryClick}>Summary</button>
                                <button className="select-files-btn" onClick={handleMindMapClick}>MindMap</button>
                                <button className="select-files-btn" onClick={handleGenerateMcqsClick}>Generate MCQs</button>
                            </div>
                            {isLoading && <p className="loading-message">Generating...</p>}
                            {error && <p className="error-message">{error}</p>}
                            {summary && (
                                <div className="summary-container">
                                    <h3>Summary</h3>
                                    <p>{summary}</p>
                                </div>
                            )}
                            {mcqs.length > 0 && (
                                <div className="summary-container mcq-container">
                                    <h3>Generated MCQs</h3>
                                    <ol className="mcq-list">
                                        {mcqs.map((mcq, index) => (
                                            <li key={index} className="mcq-item">
                                                <p className="mcq-question">{mcq.question}</p>
                                                <ul className="mcq-options">
                                                    {mcq.options.map((option, i) => (
                                                        <li key={i}>{option}</li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="upload-box-large">
                            <div className="pin-emoji">📌</div>
                            <p className="text-lg font-medium mb-3">Drag & drop a {activeTab} file to upload</p>
                            <input type="file" id="file-upload" className="hidden-file-input" onChange={handleFileChange} accept={activeTab === 'PDF' ? '.pdf' : activeTab === 'PowerPoint' ? '.pptx,.ppt' : activeTab === 'Image' ? 'image/*' : '.txt'}/>
                            <br></br>
                            <label htmlFor="file-upload" className="select-files-btn">Select Files</label>
                            <img src="/getStartedimg.png" alt="mascot" className="mascot-glow mascot-overlap" />
                        </div>
                    )}
                </div>
                {isMindMapPopupOpen && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <button onClick={closeMindMapPopup} className="popup-close-btn">&times;</button>
                            <h2 className="popup-title">Feature Coming Soon!</h2>
                            <p className="popup-message">MindMap generation is in development. Check back later!</p>
                            <div className="popup-actions">
                                <button className="select-files-btn" onClick={closeMindMapPopup}>Okay</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadNotes;