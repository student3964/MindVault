import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Home.css';
import './uploadNotes.css';

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
  const [fileId, setFileId] = useState<string | null>(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // States for caching results
  const [summary, setSummary] = useState('');
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  // ---
  const [error, setError] = useState('');
  const [isMindMapPopupOpen, setIsMindMapPopupOpen] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});

  const uploadFileToBackend = async (file: File) => {
    // Get token and add it to headers
    const token = localStorage.getItem('token');
    
    if (!token) {
      // If token is truly missing, force re-login
      navigate('/login');
      throw new Error("User not authenticated. Redirecting to login.");
    }

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      headers: {
        // CRITICAL FIX: Include the authentication token
        'x-auth-token': token,
      },
      body: formData,
    });
    
    const data = await res.json();
    if (res.ok) {
      setFileId(data.fileId);
    } else if (res.status === 401) {
      // If server explicitly says token is invalid/expired
      navigate('/login');
      throw new Error(data.error || 'Authentication failed. Please log in again.');
    } else {
      throw new Error(data.error || 'Upload failed');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setIsFileUploaded(true);
      setSummary('');
      setMcqs([]);
      setSelectedAnswers({});
      setError('');
      try {
        setIsLoading(true);
        await uploadFileToBackend(file);
      } catch (err: any) {
        // Redirection should be handled by uploadFileToBackend for 401
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSummaryClick = async () => {
    if (!fileId) return;

    // Caching Logic: If summary exists, just clear MCQs (to switch view) and return.
    if (summary) {
      setMcqs([]);
      setError('');
      return;
    }

    setIsLoading(true);
    setError('');
    setMcqs([]);

    // Retrieve token for the request
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      setError('Session expired. Please log in.');
      setIsLoading(false);
      return;
    }
    // END of token check

    try {
      const res = await fetch(`http://localhost:5000/api/summarize/${fileId}`, {
        method: 'GET',
        headers: {
          'x-auth-token': token, // CRITICAL: Add token header
        },
      });
      const data = await res.json();
      if (res.ok) {
        setSummary(data.summary);
      } else if (res.status === 401) {
        navigate('/login');
        setError(data.error || 'Authentication failed. Please log in again.');
      } else {
        setError(data.error || 'Failed to summarize');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateMcqsClick = async () => {
    if (!fileId) return;

    // Caching Logic: If MCQs exist, just clear summary (to switch view) and return.
    if (mcqs.length > 0) {
      setSummary('');
      setError('');
      return;
    }

    setIsLoading(true);
    setError('');
    setSummary('');
    setSelectedAnswers({});

    // Retrieve token for the request
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      setError('Session expired. Please log in.');
      setIsLoading(false);
      return;
    }
    // END of token check

    try {
      const res = await fetch(`http://localhost:5000/api/mcqs/${fileId}`, {
        method: 'GET',
        headers: {
          'x-auth-token': token, // CRITICAL: Add token header
        },
      });
      const data = await res.json();
      if (res.ok) {
        setMcqs(data.mcqs);
      } else if (res.status === 401) {
        navigate('/login');
        setError(data.error || 'Authentication failed. Please log in again.');
      } else {
        setError(data.error || 'Failed to generate MCQs');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (qIndex: number, option: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: option }));
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
      <Navbar activePage="workspace" isLoggedIn={true} />

      {/* 🟣 NEW: Back Button */}
      <button
        onClick={() => navigate('/workspace')}
        className="back-to-workspace-btn"
      >
        &larr; Back to Workspace
      </button>

      <div className="pt-24">
        {/* 💡 HEADING CHANGE: Using new class 'light-heading' */}
        <h1 className="light-heading text-3xl">Supported File Types</h1>
        <div className="slider-container">
          <div
            className="slider-bar-bg"
            ref={sliderBarRef}
            style={
              {
                '--active-tab-width': `${activeTabWidth}px`,
                '--active-tab-left': `${activeTabLeft}px`,
              } as React.CSSProperties
            }
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`file-type ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
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
                <button className="select-files-btn" onClick={handleSummaryClick}>
                  Summary
                </button>
                <button className="select-files-btn" onClick={handleMindMapClick}>
                  MindMap
                </button>
                <button className="select-files-btn" onClick={handleGenerateMcqsClick}>
                  Generate MCQs
                </button>
              </div>
              {isLoading && <p className="loading-message">Generating...</p>}
              {error && <p className="error-message">{error}</p>}
              {summary && (
                <div className="summary-card">
                  <h3 className="summary-title">📄 Generated Summary</h3>
                  <ul className="summary-list">
                    {summary.split('. ').map((point, i) => (
                      <li key={i}>{point.trim()}</li>
                    ))}
                  </ul>
                </div>
              )}
              {mcqs.length > 0 && (
                <div className="summary-container mcq-container">
                  <h3>Generated MCQs</h3>
                  <div className="mcq-grid">
                    {mcqs.map((mcq, index) => (
                      <div key={index} className="mcq-card">
                        <p className="mcq-question">
                          <strong>Q{index + 1}:</strong> {mcq.question}
                        </p>
                        <ul className="mcq-options">
                          {mcq.options.map((option, i) => {
                            const isSelected = selectedAnswers[index] === option;
                            const isCorrect = option === mcq.correctAnswer;
                            return (
                              <li
                                key={i}
                                className={`mcq-option ${
                                  isSelected
                                    ? isCorrect
                                      ? 'correct'
                                      : 'incorrect'
                                    : ''
                                }`}
                                onClick={() => handleAnswerSelect(index, option)}
                              >
                                <span className="option-label">
                                  {String.fromCharCode(65 + i)}.
                                </span>{' '}
                                {option}
                              </li>
                            );
                          })}
                        </ul>
                        {selectedAnswers[index] && (
                          <p
                            className={`mcq-feedback ${
                              selectedAnswers[index] === mcq.correctAnswer
                                ? 'feedback-correct'
                                : 'feedback-incorrect'
                            }`}
                          >
                            {selectedAnswers[index] === mcq.correctAnswer
                              ? '✅ Correct!'
                              : `❌ Incorrect. Correct Answer: ${mcq.correctAnswer}`}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="upload-box-large">
              <div className="pin-emoji">📌</div>
              <p className="text-lg font-medium mb-3">
                Drag & drop a {activeTab} file to upload
              </p>
              <input
                type="file"
                id="file-upload"
                className="hidden-file-input"
                onChange={handleFileChange}
                accept={
                  activeTab === 'PDF'
                    ? '.pdf'
                    : activeTab === 'PowerPoint'
                    ? '.pptx,.ppt'
                    : activeTab === 'Image'
                    ? 'image/*'
                    : '.txt'
                }
              />
              <br />
              <label htmlFor="file-upload" className="select-files-btn">
                Select Files
              </label>
              <img
                src="/getStartedimg.png"
                alt="mascot"
                className="mascot-glow mascot-overlap"
              />
            </div>
          )}
        </div>
        {isMindMapPopupOpen && (
          <div className="popup-overlay">
            <div className="popup-content">
              <button onClick={closeMindMapPopup} className="popup-close-btn">
                &times;
              </button>
              <h2 className="popup-title">Feature Coming Soon!</h2>
              <p className="popup-message">
                MindMap generation is in development. Check back later!
              </p>
              <div className="popup-actions">
                <button className="select-files-btn" onClick={closeMindMapPopup}>
                  Okay
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadNotes;