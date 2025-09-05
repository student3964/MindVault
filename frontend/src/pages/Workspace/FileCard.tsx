import React, { useState } from 'react';
import './Workspace.css';

interface FileCardProps {
  file: { id: string; name: string };
  isSelected: boolean;
}

const FileCard: React.FC<FileCardProps> = ({ file, isSelected }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className={`feature-card ${isSelected ? 'selected' : ''}`}>
      <span className="feature-card-title">{file.name}</span>
      <button onClick={() => setShowMenu(!showMenu)} className="primary-btn">⋮</button>
      {showMenu && (
        <ul className="file-actions">
          <li>Summarize</li>
          <li>MCQs</li>
          <li>Mindmap</li>
          <li>Move to Trash</li>
          <li>History</li>
        </ul>
      )}
    </div>
  );
};

export default FileCard;
