import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DashboardCard } from '../components';
import type { EmotionLog } from './EmotionTracker';
import './Dashboard.css';

// Vietnamese month names
const MONTHS_VI = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
  'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
  'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

// Vietnamese day names
const DAYS_VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

// Emotion color mapping
const EMOTION_COLORS: { [key: string]: { bg: string; text: string } } = {
  happy: { bg: '#4CAF50', text: 'white' },      // Vui → xanh lá
  calm: { bg: '#2196F3', text: 'white' },       // Bình tĩnh → xanh dương
  neutral: { bg: '#9E9E9E', text: 'white' },    // Bình thường → xám
  sad: { bg: '#9C27B0', text: 'white' },        // Buồn → tím
  angry: { bg: '#F44336', text: 'white' },      // Tức giận → đỏ
  anxious: { bg: '#FF9800', text: 'white' },    // Lo lắng → cam
};

const STORAGE_KEY = 'bridged_emotion_logs';

const Dashboard = () => {
  const [emotionLogs, setEmotionLogs] = useState<EmotionLog[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);

  const features = [
    {
      title: 'Theo Dõi Cảm Xúc',
      description: 'Ghi lại và theo dõi cảm xúc hàng ngày của bạn.',
      icon: 'bi-emoji-smile',
      color: '#FF6B6B',
      link: '/emotion-tracker',
    },
    {
      title: 'Module GRACE',
      description: 'Thực hành các bài tập chánh niệm với hướng dẫn GRACE.',
      icon: 'bi-flower1',
      color: '#4ECDC4',
      link: '/grace-module',
    },
    {
      title: 'Nhật Ký Giá Trị',
      description: 'Phản ánh về giá trị và ghi lại sự phát triển cá nhân.',
      icon: 'bi-journal-text',
      color: '#45B7D1',
      link: '/value-journal',
    },
    {
      title: 'Thư Viện GRACE',
      description: 'Truy cập tài liệu và nguồn lực sức khỏe cảm xúc.',
      icon: 'bi-book',
      color: '#96CEB4',
      link: '/grace-library',
    },
    {
      title: 'Chat Ẩn Danh',
      description: 'Kết nối với người khác trong môi trường an toàn.',
      icon: 'bi-chat-dots',
      color: '#DDA0DD',
      link: '/anonymous-chat',
    },
    {
      title: 'Giới Thiệu',
      description: 'Tìm hiểu thêm về sứ mệnh và đội ngũ của chúng tôi.',
      icon: 'bi-info-circle',
      color: '#F7DC6F',
      link: '/about',
    },
  ];

  // Load emotion logs from localStorage
  useEffect(() => {
    loadEmotionLogs();
  }, []);

  const loadEmotionLogs = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const logs: EmotionLog[] = JSON.parse(stored);
        setEmotionLogs(logs);
      }
    } catch (error) {
      console.error('Error loading emotion logs:', error);
    }
  };

  // Get calendar data for current month
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Day of week for first day (0 = Sunday)
    const startDayOfWeek = firstDay.getDay();
    
    // Total days in month
    const daysInMonth = lastDay.getDate();
    
    // Create calendar grid
    const days: (Date | null)[] = [];
    
    // Add empty cells for days before the first day
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  }, [currentDate]);

  // Get emotion logs for a specific date
  const getLogsForDate = (date: Date): EmotionLog[] => {
    const dateStr = date.toISOString().split('T')[0];
    return emotionLogs.filter(log => log.date === dateStr);
  };

  // Get the dominant emotion for a date
  const getDominantEmotion = (date: Date): EmotionLog | null => {
    const logs = getLogsForDate(date);
    if (logs.length === 0) return null;
    
    // Return the most recent log for that day
    return logs.sort((a, b) => b.timestamp - a.timestamp)[0];
  };

  // Navigation handlers
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Day click handler
  const handleDayClick = (date: Date) => {
    setSelectedDay(date);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedDay(null);
  };

  // Statistics
  const stats = useMemo(() => {
    if (emotionLogs.length === 0) {
      return {
        totalLogs: 0,
        mostCommonEmotion: null,
        streak: 0,
      };
    }

    // Count emotion occurrences
    const emotionCounts: { [key: string]: { count: number; log: EmotionLog } } = {};
    emotionLogs.forEach(log => {
      if (!emotionCounts[log.emotionKey]) {
        emotionCounts[log.emotionKey] = { count: 0, log };
      }
      emotionCounts[log.emotionKey].count++;
    });

    // Find most common
    let mostCommon = null;
    let maxCount = 0;
    Object.values(emotionCounts).forEach(({ count, log }) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = log;
      }
    });

    // Calculate streak
    const uniqueDates = [...new Set(emotionLogs.map(log => log.date))].sort().reverse();
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < uniqueDates.length; i++) {
      const logDate = new Date(uniqueDates[i]);
      logDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);
      
      if (logDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return {
      totalLogs: emotionLogs.length,
      mostCommonEmotion: mostCommon as EmotionLog | null,
      streak,
    };
  }, [emotionLogs]);

  // Format date for display
  const formatDateFull = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="dashboard-page">
      <div className="container py-4">
        {/* Welcome Section */}
        <div className="dashboard-header text-center mb-4">
          <div className="header-icon-wrapper">
            <i className="bi bi-heart-pulse-fill"></i>
          </div>
          <h1 className="fw-bold mb-2">Chào mừng đến với BridgeED</h1>
          <p className="text-muted mb-0">
            Nền tảng quản lý cảm xúc cá nhân của bạn. Theo dõi, hiểu và cải thiện sức khỏe tinh thần.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          <div className="col-4">
            <div className="stat-card stat-total">
              <div className="stat-icon">
                <i className="bi bi-journal-check"></i>
              </div>
              <div className="stat-content">
                <span className="stat-value">{stats.totalLogs}</span>
                <span className="stat-label">Tổng số lần ghi nhận</span>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="stat-card stat-emotion">
              <div className="stat-icon">
                {stats.mostCommonEmotion ? (
                  <span>{stats.mostCommonEmotion.emoji}</span>
                ) : (
                  <i className="bi bi-emoji-neutral"></i>
                )}
              </div>
              <div className="stat-content">
                <span className="stat-value">
                  {stats.mostCommonEmotion?.emotion || '--'}
                </span>
                <span className="stat-label">Cảm xúc phổ biến nhất</span>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="stat-card stat-streak">
              <div className="stat-icon">
                <i className="bi bi-fire"></i>
              </div>
              <div className="stat-content">
                <span className="stat-value">{stats.streak}</span>
                <span className="stat-label">Chuỗi ngày liên tiếp</span>
              </div>
            </div>
          </div>
        </div>

        {/* Emotion Calendar */}
        <div className="emotion-calendar-section mb-4">
          <div className="calendar-header">
            <div className="calendar-title">
              <i className="bi bi-calendar-heart"></i>
              <span>Lịch theo dõi cảm xúc</span>
            </div>
            <div className="calendar-nav">
              <button className="nav-btn" onClick={goToPreviousMonth}>
                <i className="bi bi-chevron-left"></i>
              </button>
              <button className="today-btn" onClick={goToToday}>
                Hôm nay
              </button>
              <button className="nav-btn" onClick={goToNextMonth}>
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>

          <div className="calendar-month-display">
            {MONTHS_VI[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>

          {/* Day Headers */}
          <div className="calendar-weekdays">
            {DAYS_VI.map(day => (
              <div key={day} className="weekday-header">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="calendar-grid">
            {calendarData.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="calendar-day empty"></div>;
              }

              const dominantEmotion = getDominantEmotion(date);
              const logsForDay = getLogsForDate(date);
              const hasLogs = logsForDay.length > 0;
              const isTodayDate = isToday(date);
              const emotionColor = dominantEmotion 
                ? EMOTION_COLORS[dominantEmotion.emotionKey]
                : null;

              return (
                <button
                  key={date.toISOString()}
                  className={`calendar-day ${isTodayDate ? 'today' : ''} ${hasLogs ? 'has-data' : ''}`}
                  onClick={() => handleDayClick(date)}
                  style={emotionColor ? {
                    backgroundColor: emotionColor.bg,
                    color: emotionColor.text,
                  } : undefined}
                >
                  <span className="day-number">{date.getDate()}</span>
                  {hasLogs && (
                    <span className="day-indicator">
                      {dominantEmotion?.emoji}
                    </span>
                  )}
                  {hasLogs && logsForDay.length > 1 && (
                    <span className="day-count">+{logsForDay.length - 1}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="calendar-legend">
            <span className="legend-title">Chú thích:</span>
            <div className="legend-items">
              {Object.entries(EMOTION_COLORS).map(([key, colors]) => {
                const emotionLabels: { [k: string]: string } = {
                  happy: 'Vui',
                  calm: 'Bình tĩnh',
                  neutral: 'Bình thường',
                  sad: 'Buồn',
                  angry: 'Tức giận',
                  anxious: 'Lo lắng',
                };
                return (
                  <div key={key} className="legend-item">
                    <span 
                      className="legend-color"
                      style={{ backgroundColor: colors.bg }}
                    ></span>
                    <span className="legend-label">{emotionLabels[key]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="features-section mb-4">
          <h2 className="section-title">
            <i className="bi bi-grid-3x3-gap-fill me-2"></i>
            Khám phá tính năng
          </h2>
          <div className="row g-3">
            {features.map((feature) => (
              <div className="col-12 col-sm-6 col-lg-4" key={feature.title}>
                <Link to={feature.link} className="text-decoration-none">
                  <DashboardCard
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                    color={feature.color}
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="cta-card">
          <div className="cta-content">
            <h3 className="fw-bold mb-2">Bắt đầu hành trình sức khỏe của bạn</h3>
            <p className="mb-3">Theo dõi cảm xúc, thực hành chánh niệm, và phát triển mỗi ngày.</p>
            <Link to="/emotion-tracker" className="cta-btn">
              <i className="bi bi-play-fill me-2"></i>
              Bắt đầu ngay
            </Link>
          </div>
        </div>
      </div>

      {/* Day Detail Modal */}
      {showModal && selectedDay && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="emotion-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h5 className="modal-title">
                <i className="bi bi-calendar-event me-2"></i>
                Chi tiết cảm xúc
              </h5>
              <button className="modal-close" onClick={closeModal}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="modal-date">
              <i className="bi bi-calendar3 me-2"></i>
              {formatDateFull(selectedDay)}
            </div>

            <div className="modal-body-custom">
              {getLogsForDate(selectedDay).length > 0 ? (
                <div className="emotion-logs-list">
                  {getLogsForDate(selectedDay)
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map(log => (
                      <div 
                        key={log.id}
                        className="emotion-log-item"
                        style={{ borderLeftColor: log.color }}
                      >
                        <div className="log-header">
                          <div 
                            className="log-icon"
                            style={{ backgroundColor: log.color }}
                          >
                            <i className={`bi ${log.icon}`}></i>
                          </div>
                          <div className="log-main">
                            <span className="log-emotion">
                              {log.emoji} {log.emotion}
                            </span>
                            <span className="log-time">
                              {new Date(log.timestamp).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="log-details">
                          <div className="log-detail-row">
                            <span className="detail-label">Cảm xúc:</span>
                            <span className="detail-value">{log.emotion}</span>
                          </div>
                          <div className="log-detail-row">
                            <span className="detail-label">Mức độ:</span>
                            <span className="detail-value">
                              {log.level}/5 ({log.levelLabel})
                            </span>
                          </div>
                          {log.note && (
                            <div className="log-detail-row note-row">
                              <span className="detail-label">Ghi chú:</span>
                              <span className="detail-value note-value">{log.note}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <i className="bi bi-calendar-x"></i>
                  </div>
                  <p className="empty-text">Không có dữ liệu cho ngày này</p>
                  <Link to="/emotion-tracker" className="empty-action" onClick={closeModal}>
                    <i className="bi bi-plus-circle me-2"></i>
                    Ghi nhận cảm xúc
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
