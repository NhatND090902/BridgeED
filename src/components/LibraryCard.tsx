import React from 'react';
import ProgressBar from './ProgressBar';
import type { BadgeData } from './BadgeIcon';

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
  badge?: BadgeData | null;
  onClick: () => void;
}

const LibraryCard: React.FC<LibraryCardProps> = ({
  card,
  completedTasks,
  badge,
  onClick,
}) => {
  const completedCount = completedTasks.filter(Boolean).length;
  const totalTasks = card.content.length;
  const progress = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  return (
    <div
      className={`library-card ${badge ? 'has-badge' : ''}`}
      onClick={onClick}
      style={{ '--card-color': card.color } as React.CSSProperties}
    >
      {/* Badge earned indicator */}
      {badge && (
        <div className="card-badge-earned" style={{ background: card.gradient }}>
          <i className={`bi ${badge.icon}`}></i>
          <span className="badge-earned-label">Đã nhận huy hiệu!</span>
        </div>
      )}

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
      
      {/* Completion badge */}
      {progress === 100 && (
        <div className="completion-badge" style={{ background: card.gradient }}>
          {badge ? (
            <i className={`bi ${badge.icon}`}></i>
          ) : (
            <i className="bi bi-check-lg"></i>
          )}
        </div>
      )}
    </div>
  );
};

export default LibraryCard;
