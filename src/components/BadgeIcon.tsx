import React from 'react';

// Badge icon list - Bootstrap Icons
export const BADGE_ICONS = [
  { icon: 'bi-star-fill', name: 'Ngôi sao', emoji: '⭐' },
  { icon: 'bi-trophy-fill', name: 'Cúp vàng', emoji: '🏆' },
  { icon: 'bi-heart-fill', name: 'Trái tim', emoji: '❤️' },
  { icon: 'bi-lightning-fill', name: 'Tia chớp', emoji: '⚡' },
  { icon: 'bi-sun-fill', name: 'Mặt trời', emoji: '☀️' },
  { icon: 'bi-gem', name: 'Kim cương', emoji: '💎' },
  { icon: 'bi-award-fill', name: 'Huy chương', emoji: '🏅' },
  { icon: 'bi-rocket-takeoff-fill', name: 'Tên lửa', emoji: '🚀' },
  { icon: 'bi-flower1', name: 'Hoa', emoji: '🌸' },
  { icon: 'bi-emoji-sunglasses-fill', name: 'Ngầu', emoji: '😎' },
];

// Get random badge icon
export const getRandomBadgeIcon = () => {
  const randomIndex = Math.floor(Math.random() * BADGE_ICONS.length);
  return BADGE_ICONS[randomIndex];
};

export interface BadgeData {
  cardId: number;
  icon: string;
  name: string;
  emoji: string;
  title: string;
  earnedDate: string;
}

interface BadgeIconProps {
  badge: BadgeData;
  size?: 'small' | 'medium' | 'large';
  showAnimation?: boolean;
  gradient?: string;
}

const BadgeIcon: React.FC<BadgeIconProps> = ({
  badge,
  size = 'medium',
  showAnimation = false,
  gradient,
}) => {
  const sizeClasses = {
    small: 'badge-icon-small',
    medium: 'badge-icon-medium',
    large: 'badge-icon-large',
  };

  return (
    <div 
      className={`badge-icon-wrapper ${sizeClasses[size]} ${showAnimation ? 'badge-animated' : ''}`}
      style={{ background: gradient }}
      title={`${badge.title} - Đạt được ${badge.earnedDate}`}
    >
      <i className={`bi ${badge.icon}`}></i>
      {size === 'large' && (
        <span className="badge-emoji">{badge.emoji}</span>
      )}
    </div>
  );
};

export default BadgeIcon;
