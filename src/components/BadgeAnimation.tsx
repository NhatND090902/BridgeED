import React, { useEffect, useState } from 'react';
import type { BadgeData } from './BadgeIcon';
import './BadgeAnimation.css';

interface BadgeAnimationProps {
  show: boolean;
  badge: BadgeData | null;
  onComplete?: () => void;
  duration?: number;
}

const BadgeAnimation: React.FC<BadgeAnimationProps> = ({
  show,
  badge,
  onComplete,
  duration = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{
    id: number;
    left: number;
    top: number;
    delay: number;
    size: number;
  }>>([]);

  useEffect(() => {
    if (show && badge) {
      setIsVisible(true);
      
      // Generate sparkle particles
      const newSparkles = [];
      for (let i = 0; i < 30; i++) {
        newSparkles.push({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          delay: Math.random() * 0.8,
          size: Math.random() * 10 + 5,
        });
      }
      setSparkles(newSparkles);

      // Auto hide after duration
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) {
          onComplete();
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, badge, duration, onComplete]);

  if (!isVisible || !badge) return null;

  return (
    <div className="badge-animation-overlay">
      {/* Sparkle particles */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="badge-sparkle"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            animationDelay: `${sparkle.delay}s`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
          }}
        />
      ))}

      {/* Glowing rings */}
      <div className="glow-ring ring-1"></div>
      <div className="glow-ring ring-2"></div>
      <div className="glow-ring ring-3"></div>

      {/* Badge content */}
      <div className="badge-celebration-content">
        <div className="badge-earned-icon">
          <i className={`bi ${badge.icon}`}></i>
          <span className="badge-earned-emoji">{badge.emoji}</span>
        </div>
        
        <h2 className="badge-earned-title">🎉 Chúc mừng! 🎉</h2>
        <p className="badge-earned-subtitle">Bạn đã nhận được huy hiệu mới!</p>
        
        <div className="badge-info-card">
          <div className="badge-info-icon">
            <i className={`bi ${badge.icon}`}></i>
          </div>
          <div className="badge-info-details">
            <h4 className="badge-info-name">{badge.name}</h4>
            <p className="badge-info-title">{badge.title}</p>
            <small className="badge-info-date">
              <i className="bi bi-calendar-check me-1"></i>
              {badge.earnedDate}
            </small>
          </div>
        </div>

        <div className="badge-motivation">
          <span>✨</span>
          Tiếp tục cố gắng để nhận thêm nhiều huy hiệu khác nhé!
          <span>✨</span>
        </div>
      </div>
    </div>
  );
};

export default BadgeAnimation;
