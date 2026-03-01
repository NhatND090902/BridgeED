import React from 'react';
import ProgressBar from './ProgressBar';

export interface LibraryCardData {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  content: string[];
}

interface LibraryCardProps {
  card: LibraryCardData;
  completedTasks: boolean[];
  onClick: () => void;
}

const LibraryCard: React.FC<LibraryCardProps> = ({
  card,
  completedTasks,
  onClick,
}) => {
  const completedCount = completedTasks.filter(Boolean).length;
  const totalTasks = card.content.length;
  const progress = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  return (
    <div
      className="library-card"
      onClick={onClick}
      style={{ '--card-color': card.color } as React.CSSProperties}
    >
      <div className="card-icon-wrapper" style={{ background: card.gradient }}>
        <i className={`bi ${card.icon}`}></i>
      </div>
      <div className="card-content">
        <h4 className="card-title">{card.title}</h4>
        <p className="card-description">{card.description}</p>
        
        {/* Progress Section */}
        <div className="card-progress-section mb-3">
          <ProgressBar
            progress={progress}
            completedTasks={completedCount}
            totalTasks={totalTasks}
            gradient={card.gradient}
            height="6px"
          />
        </div>

        <div className="card-action">
          <span className="action-text">Xem chi tiết</span>
          <i className="bi bi-arrow-right"></i>
        </div>
      </div>
      <div className="card-decoration" style={{ background: card.gradient }}></div>
      
      {/* Progress badge */}
      {progress === 100 && (
        <div className="completion-badge" style={{ background: card.gradient }}>
          <i className="bi bi-check-lg"></i>
        </div>
      )}
    </div>
  );
};

export default LibraryCard;
