import React, { useEffect, useState } from 'react';
import './FireworksEffect.css';

interface FireworksEffectProps {
  show: boolean;
  message?: string;
  onComplete?: () => void;
  duration?: number;
}

const FireworksEffect: React.FC<FireworksEffectProps> = ({
  show,
  message = 'Tuyệt vời! Bạn đang tiến bộ rất tốt. Hãy tiếp tục nhé!',
  onComplete,
  duration = 4000,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{
    id: number;
    left: number;
    top: number;
    color: string;
    delay: number;
    size: number;
  }>>([]);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#FFD93D', '#45B7D1', 
    '#96CEB4', '#DDA0DD', '#FF8C42', '#98D8C8'
  ];

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      
      // Generate firework particles
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 0.5,
          size: Math.random() * 8 + 4,
        });
      }
      setParticles(newParticles);

      // Auto hide after duration
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) {
          onComplete();
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fireworks-overlay">
      {/* Firework particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="firework-particle"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
        />
      ))}

      {/* Sparkle stars */}
      {[...Array(20)].map((_, i) => (
        <div
          key={`star-${i}`}
          className="sparkle-star"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 1}s`,
          }}
        >
          <i className="bi bi-star-fill"></i>
        </div>
      ))}

      {/* Celebration message */}
      <div className="celebration-content">
        <div className="celebration-icon">
          <i className="bi bi-trophy-fill"></i>
        </div>
        <h2 className="celebration-title">🎉 Chúc mừng! 🎉</h2>
        <p className="celebration-message">{message}</p>
        <div className="celebration-emojis">
          <span>🌟</span>
          <span>✨</span>
          <span>🎆</span>
          <span>✨</span>
          <span>🌟</span>
        </div>
      </div>
    </div>
  );
};

export default FireworksEffect;
