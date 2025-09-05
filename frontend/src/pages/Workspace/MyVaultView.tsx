import React, { useState, useRef, useEffect } from 'react';

interface MyFile { name: string; type: string; size: number; date: string; }

const MyVaultView = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedFileType, setSelectedFileType] = useState('Type');
    const [files, setFiles] = useState<MyFile[]>([]);
    const [viewMode, setViewMode] = useState('grid');
    const [openFileDropdownIndex, setOpenFileDropdownIndex] = useState<number | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);

    const handleFileTypeSelect = (type: string) => { /* ... */ };
    const handleCreateClick = () => fileInputRef.current?.click();
    const handleSelectMultiple = () => { /* ... */ };
    const handleFilesFromInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
            const newFiles = Array.from(selectedFiles).map((file) => ({
                name: file.name,
                type: file.type,
                size: file.size,
                date: new Date().toLocaleDateString(),
            }));
            setFiles(prevFiles => [...prevFiles, ...newFiles]);
        }
    };
    const toggleFileDropdown = (index: number, e: React.MouseEvent) => {
      e.stopPropagation();
      setOpenFileDropdownIndex(prev => (prev === index ? null : index));
    };

    return (
        <div className="p-8">
            <div className="search-container ml-[-1rem] mr-[-1rem]">
                <input type="text" placeholder="Search for anything" className="search-input" />
            </div>
            <div className="panel-header">
                <h2 className="panel-header-title">Files</h2>
                <div className="panel-action-buttons">
                    <button onClick={handleSelectMultiple}>Select multiple</button>
                    <button className="create-plus-btn" onClick={handleCreateClick}>+</button>
                </div>
            </div>
            <div className="filter-controls">
                <div className="dropdown-container">
                    <button className="dropdown-button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        {selectedFileType} <span className="dropdown-arrow">▼</span>
                    </button>
                    {isDropdownOpen && (
                        <ul className="dropdown-menu">
                            <li onClick={() => handleFileTypeSelect('PDF')}>PDF</li>
                            <li onClick={() => handleFileTypeSelect('PPT')}>PPT</li>
                        </ul>
                    )}
                </div>
                <div className="view-buttons">
                    <button onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'active' : ''}>❐</button>
                    <button onClick={() => setViewMode('details')} className={viewMode === 'details' ? 'active' : ''}>≡</button>
                </div>
            </div>

            <input type="file" ref={fileInputRef} onChange={handleFilesFromInput} style={{ display: 'none' }} multiple />

            {files.length === 0 ? (
                <div className="centered-content-container">
                    <div className="create-materials-section">
                        <div className="file-icons">
                            <div className="file-icon-circle">📄</div>
                            <div className="file-icon-circle">📂</div>
                            <div className="file-icon-circle">💬</div>
                        </div>
                        <h3>Create materials!</h3>
                        <p>Boost learning with practice tests, interactive study modes, and AI chat conversations.</p>
                        <button className="create-btn" onClick={handleCreateClick}>Create</button>
                    </div>
                </div>
            ) : (
                <div className={viewMode === 'grid' ? 'files-grid-container' : 'files-details-container'}>
                    {files.map((file, index) => (
                        <div key={index} className={viewMode === 'grid' ? 'file-item-grid' : 'file-item-details'}>
                            <span className="file-icon">📄</span>
                            <p className="flex-grow text-left">{file.name}</p>
                            <div className="relative" ref={el => { dropdownRefs.current[index] = el; }}>
                                <button className="file-options-btn" onClick={(e) => toggleFileDropdown(index, e)}>⋮</button>
                                {openFileDropdownIndex === index && (
                                    <ul className="file-dropdown-menu">
                                        <li>Summarize</li><li>Get MCQs</li><li>MindMap</li><li>Move to Trash</li><li>History</li>
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

export default MyVaultView;