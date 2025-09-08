import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import './MyVaultView.css';
import { useTrash } from './MainSection'; // FIX: Import the real useTrash hook

// --- Component Definition ---
export interface MyFile {
    name: string;
    type?: string;
    id: string;
    size?: number;
    date?: string;
}

const MyVaultView: React.FC = () => {
    const [isGrid, setIsGrid] = useState<boolean>(true);
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState<boolean>(false);
    const [selectedType, setSelectedType] = useState<string>("Type");
    const [files, setFiles] = useState<MyFile[]>([]);
    const [openFileDropdown, setOpenFileDropdown] = useState<string | null>(null);
    const [activeFileChat, setActiveFileChat] = useState<MyFile | null>(null);

    const { moveToTrash } = useTrash();

    const typeDropdownRef = useRef<HTMLDivElement | null>(null);
    const fileDropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const [flipLeftDropdowns, setFlipLeftDropdowns] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
                setIsTypeDropdownOpen(false);
            }
            if (openFileDropdown !== null) {
                const currentDropdownRef = fileDropdownRefs.current[openFileDropdown];
                if (currentDropdownRef && !currentDropdownRef.contains(event.target as Node)) {
                    setOpenFileDropdown(null);
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openFileDropdown]);
    
    useEffect(() => {
        if (openFileDropdown !== null) {
            const dropdownEl = fileDropdownRefs.current[openFileDropdown];
            if (dropdownEl) {
                const rect = dropdownEl.getBoundingClientRect();
                if (rect.right + 160 > window.innerWidth) {
                    setFlipLeftDropdowns((prev) => ({ ...prev, [openFileDropdown]: true }));
                } else {
                    setFlipLeftDropdowns((prev) => ({ ...prev, [openFileDropdown]: false }));
                }
            }
        }
    }, [openFileDropdown, files]);

    const handleTypeSelect = (type: string) => {
        setSelectedType(type);
        setIsTypeDropdownOpen(false);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFiles = event.target.files ? Array.from(event.target.files) : [];
        setFiles((prevFiles) => [
            ...prevFiles,
            ...uploadedFiles.map((file) => ({
                name: file.name,
                type: selectedType === "Type" ? "Unknown" : selectedType,
                id: Math.random().toString(36).substring(7),
            })),
        ]);
        event.target.value = "";
    };

    const toggleFileDropdown = (id: string) => {
        setOpenFileDropdown(openFileDropdown === id ? null : id);
    };

    const openSmartChat = (file: MyFile) => {
        setActiveFileChat(file);
        setOpenFileDropdown(null);
    };

    const openHistory = (file: MyFile) => {
        console.log("Open History for:", file.name);
        setOpenFileDropdown(null);
    };

    const handleMoveToTrash = (file: MyFile) => {
        moveToTrash(file);
        setFiles(files.filter((f) => f.id !== file.id));
        setOpenFileDropdown(null);
    };

    const EmptyVaultState = () => (
        <div className="empty-vault-box">
            <div className="file-icons">
                <div className="file-icon-circle">📄</div>
                <div className="file-icon-circle">📂</div>
                <div className="file-icon-circle">💬</div>
            </div>
            <h3>Your Vault is empty!</h3>
            <p>
                Upload files and boost learning with interactive study modes, <br />
                practice quizzes and AI chat conversations.
            </p>
            <button className="upload-btn" onClick={() => document.getElementById("file-upload-input")?.click()}>
                Upload Files
            </button>
        </div>
    );

    const renderFiles = () => {
        if (files.length === 0) return <EmptyVaultState />;

        return (
            <div className="vault-bg-box">
                {isGrid ? (
                    <div className="files-grid-container">
                        {files.map((file) => (
                            <div key={file.id} className="file-item-grid">
                                <div
                                    className="file-options-container"
                                    ref={(el) => { fileDropdownRefs.current[file.id] = el; }}
                                >
                                    <button className="file-options-btn" onClick={() => toggleFileDropdown(file.id)}>⋮</button>
                                    {openFileDropdown === file.id && (
                                        <ul className={`file-dropdown-menu ${flipLeftDropdowns[file.id] ? "flip-left" : ""}`}>
                                            <li onClick={() => openSmartChat(file)}>Smart Chat</li>
                                            <li onClick={() => openHistory(file)}>History</li>
                                            <li className="move-to-trash" onClick={() => handleMoveToTrash(file)}>Move to Trash</li>
                                        </ul>
                                    )}
                                </div>
                                <div className="file-icon">{file.type === "PDF" ? "📄" : "📊"}</div>
                                <p className="file-name">{file.name}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="files-details-container">
                        {files.map((file) => (
                            <div key={file.id} className="file-item-details">
                                <div className="file-icon">{file.type === "PDF" ? "📄" : "📊"}</div>
                                <p className="file-name">{file.name}</p>
                                <div
                                    className="file-options-container-details"
                                    ref={(el) => { fileDropdownRefs.current[file.id] = el; }}
                                >
                                    <button className="file-options-btn" onClick={() => toggleFileDropdown(file.id)}>⋮</button>
                                    {openFileDropdown === file.id && (
                                        <ul className={`file-dropdown-menu ${flipLeftDropdowns[file.id] ? "flip-left" : ""}`}>
                                            <li onClick={() => openSmartChat(file)}>Smart Chat</li>
                                            <li onClick={() => openHistory(file)}>History</li>
                                            <li className="move-to-trash" onClick={() => handleMoveToTrash(file)}>Move to Trash</li>
                                        </ul>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderFileChatModal = () => {
        if (!activeFileChat) return null;

        return (
            <div className="file-chat-modal">
                <div className="file-chat-header">
                    <button className="back-btn" onClick={() => setActiveFileChat(null)}>← Back</button>
                    <span>{activeFileChat.name}</span>
                    <div className="chat-header-actions">
                        <button className="name-chat-btn">Name this chat</button>
                        <button className="save-chat-btn">Save</button>
                    </div>
                </div>
                <div className="file-chat-body">
                    <p className="file-chat-placeholder">Ask anything about this file...</p>
                </div>
                <div className="file-chat-input-container">
                    <div className="file-chat-actions">
                        <button>Summarize</button>
                        <button>Get MCQs</button>
                        <button>Generate Quiz</button>
                    </div>
                    <div className="file-chat-input-wrapper">
                        <input
                            className="file-chat-input"
                            placeholder={`Ask anything about ${activeFileChat.name}`}
                        />
                        <button className="file-chat-send-btn">↑</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="my-vault-container">
            {!activeFileChat && (
                <>
                    <div className="search-container">
                        <input className="search-input" placeholder="Search for anything in your vault..." />
                    </div>
                    <div className="panel-header">
                        <h2 className="panel-header-title">Files</h2>
                        <div className="panel-action-buttons">
                            <button
                                className="select-multiple-btn"
                                onClick={() => {
                                    const input = document.getElementById("file-upload-input") as HTMLInputElement;
                                    if (input) {
                                        input.setAttribute('multiple', 'true');
                                        input.click();
                                    }
                                }}
                            >
                                Select Multiple
                            </button>
                            <button
                                className="create-plus-btn"
                                onClick={() => {
                                    const input = document.getElementById("file-upload-input") as HTMLInputElement;
                                    if (input) {
                                        input.removeAttribute('multiple');
                                        input.click();
                                    }
                                }}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="filter-controls">
                        <div className="dropdown-container" ref={typeDropdownRef}>
                            <button
                                className={`dropdown-button ${isTypeDropdownOpen ? "active" : ""}`}
                                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                            >
                                {selectedType} <span className="dropdown-arrow">▼</span>
                            </button>
                            {isTypeDropdownOpen && (
                                <ul className="dropdown-menu">
                                    <li onClick={() => handleTypeSelect("PDF")}>PDF</li>
                                    <li onClick={() => handleTypeSelect("PPT")}>PPT</li>
                                </ul>
                            )}
                        </div>
                        <div className="view-buttons">
                            <button className={isGrid ? "active" : ""} onClick={() => setIsGrid(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                            </button>
                            <button className={!isGrid ? "active" : ""} onClick={() => setIsGrid(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                            </button>
                        </div>
                    </div>

                    <input
                        id="file-upload-input"
                        type="file"
                        accept={selectedType === "PDF" ? ".pdf" : selectedType === "PPT" ? ".ppt,.pptx" : "*"}
                        onChange={handleFileUpload}
                        style={{ display: "none" }}
                    />
                    <div className="file-content-wrapper">{renderFiles()}</div>
                </>
            )}
            {activeFileChat && renderFileChatModal()}
        </div>
    );
};

export default MyVaultView;