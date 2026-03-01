import React from 'react';
import ProgressBar from './ProgressBar';
import type { LibraryCardData } from './LibraryCard';
import type { BadgeData } from './BadgeIcon';

interface LibraryModalProps {
  card: LibraryCardData;
  completedTasks: boolean[];
  badge?: BadgeData | null;
  onClose: () => void;
  onToggleTask: (taskIndex: number) => void;
}

const LibraryModal: React.FC<LibraryModalProps> = ({
  card,
  completedTasks,
  badge,
  onClose,
  onToggleTask,
}) => {
  const completedCount = completedTasks.filter(Boolean).length;
  const totalTasks = card.content.length;
  const progress = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="library-modal-overlay" onClick={handleOverlayClick}>
      <div className="library-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header-custom" style={{ background: card.gradient }}>
          <div className="modal-icon">
            <i className={`bi ${card.icon}`}></i>
          </div>
          <h3 className="modal-title">{card.title}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body-custom">
          <p className="modal-description">{card.description}</p>

          {/* Badge display if earned */}
          {badge && (
            <div className="modal-badge-section mb-4">
              <div className="modal-badge-card" style={{ background: `${card.color}10` }}>
                <div className="modal-badge-icon" style={{ background: card.gradient }}>
                  <i className={`bi ${badge.icon}`}></i>
                </div>
                <div className="modal-badge-info">
                  <div className="modal-badge-label">
                    <i className="bi bi-patch-check-fill me-1" style={{ color: card.color }}></i>
                    Huy hiệu đã nhận
                  </div>
                  <h5 className="modal-badge-name" style={{ color: card.color }}>
                    {badge.name} {badge.emoji}
                  </h5>
                  <small className="text-muted">
                    <i className="bi bi-calendar-check me-1"></i>
                    Đạt được ngày {badge.earnedDate}
                  </small>
                </div>
              </div>
            </div>
          )}

          {/* Progress in modal */}
          <div className="modal-progress-section mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-semibold">Tiến độ của bạn</span>
              <span className="badge" style={{ background: card.gradient, color: 'white' }}>
                {Math.round(progress)}%
              </span>
            </div>
            <ProgressBar
              progress={progress}
              completedTasks={completedCount}
              totalTasks={totalTasks}
              gradient={card.gradient}
              height="10px"
            />
          </div>

          {/* Task Checklist */}
          <div className="modal-task-list">
            <h5 className="task-list-title mb-3">
              <i className="bi bi-list-check me-2" style={{ color: card.color }}></i>
              Danh sách nhiệm vụ
            </h5>
            {card.content.map((task, index) => (
              <div
                key={index}
                className={`task-item ${completedTasks[index] ? 'completed' : ''}`}
                onClick={() => onToggleTask(index)}
              >
                <div
                  className="task-checkbox"
                  style={{
                    borderColor: completedTasks[index] ? card.color : '#dee2e6',
                    background: completedTasks[index] ? card.gradient : 'transparent',
                  }}
                >
                  {completedTasks[index] && (
                    <i className="bi bi-check" style={{ color: 'white' }}></i>
                  )}
                </div>
                <div className="task-content">
                  <span
                    className="task-number"
                    style={{
                      background: completedTasks[index] ? card.gradient : '#e9ecef',
                      color: completedTasks[index] ? 'white' : '#666',
                    }}
                  >
                    {index + 1}
                  </span>
                  <p className={`task-text ${completedTasks[index] ? 'line-through' : ''}`}>
                    {task}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Completion message with badge */}
          {progress === 100 && (
            <div className="completion-message mt-4" style={{ background: `${card.color}15` }}>
              <div className="completion-icon" style={{ background: card.gradient }}>
                {badge ? (
                  <i className={`bi ${badge.icon}`}></i>
                ) : (
                  <i className="bi bi-trophy-fill"></i>
                )}
              </div>
              <div>
                <h6 className="mb-1 fw-bold" style={{ color: card.color }}>
                  {badge ? `${badge.emoji} Hoàn thành xuất sắc!` : 'Hoàn thành xuất sắc! 🎉'}
                </h6>
                <p className="mb-0 small text-muted">
                  {badge 
                    ? `Bạn đã nhận huy hiệu "${badge.name}" cho danh mục này!`
                    : 'Bạn đã hoàn thành tất cả nhiệm vụ trong danh mục này!'
                  }
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="modal-footer-custom mt-4">
            <button
              className="btn-close-modal"
              style={{ background: card.gradient }}
              onClick={onClose}
            >
              <i className="bi bi-x-circle me-2"></i>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryModal;
