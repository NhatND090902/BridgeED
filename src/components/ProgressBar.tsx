import React from 'react';

interface ProgressBarProps {
  progress: number;
  completedTasks: number;
  totalTasks: number;
  color?: string;
  gradient?: string;
  showText?: boolean;
  height?: string;
  animated?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  completedTasks,
  totalTasks,
  color = '#667eea',
  gradient,
  showText = true,
  height = '8px',
  animated = true,
}) => {
  const progressStyle: React.CSSProperties = {
    width: `${progress}%`,
    background: gradient || color,
    height,
    borderRadius: '50px',
    transition: 'width 0.5s ease-in-out',
  };

  const containerStyle: React.CSSProperties = {
    width: '100%',
    background: '#e9ecef',
    borderRadius: '50px',
    overflow: 'hidden',
    height,
  };

  return (
    <div className="progress-bar-wrapper">
      <div className="progress-container" style={containerStyle}>
        <div
          className={`progress-fill ${animated ? 'animated' : ''}`}
          style={progressStyle}
        ></div>
      </div>
      {showText && (
        <div className="progress-text mt-1">
          <small className="text-muted">
            {completedTasks} / {totalTasks} hoàn thành
          </small>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
