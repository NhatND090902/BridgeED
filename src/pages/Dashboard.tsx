import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { DashboardCard } from '../components';
import type { EmotionLog } from './EmotionTracker';
import type { ValueJournalEntry } from './ValueJournal';
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
const VALUE_STORAGE_KEY = 'bridged_value_journals';

// GRACE Values for chart display
type GraceValue = {
  key: string;
  label: string;
  emoji: string;
  color: string;
};

const GRACE_VALUES: GraceValue[] = [
  { key: 'gratitude', label: 'Biết ơn', emoji: '🙏', color: '#FFD93D' },
  { key: 'respect', label: 'Tôn trọng', emoji: '🤝', color: '#4ECDC4' },
  { key: 'accountability', label: 'Trách nhiệm', emoji: '✊', color: '#9B59B6' },
  { key: 'courage', label: 'Dũng cảm', emoji: '🦁', color: '#E74C3C' },
  { key: 'engagement', label: 'Kết nối', emoji: '💫', color: '#2ECC71' },
];

const Dashboard = () => {
  const [emotionLogs, setEmotionLogs] = useState<EmotionLog[]>([]);
  const [valueJournals, setValueJournals] = useState<ValueJournalEntry[]>([]);
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
    loadValueJournals();
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

  const loadValueJournals = () => {
    try {
      const stored = localStorage.getItem(VALUE_STORAGE_KEY);
      if (stored) {
        const journals: ValueJournalEntry[] = JSON.parse(stored);
        setValueJournals(journals);
      }
    } catch (error) {
      console.error('Error loading value journals:', error);
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

  // Value Journal Statistics and Chart Data
  const valueStats = useMemo(() => {
    // Count occurrences of each value
    const valueCounts: { [key: string]: number } = {};
    GRACE_VALUES.forEach(v => {
      valueCounts[v.key] = 0;
    });
    
    valueJournals.forEach(journal => {
      if (valueCounts[journal.valueKey] !== undefined) {
        valueCounts[journal.valueKey]++;
      }
    });

    // Chart data for bar chart
    const chartData = GRACE_VALUES.map(v => ({
      name: v.label,
      value: valueCounts[v.key],
      emoji: v.emoji,
      color: v.color,
    }));

    // Pie chart data (only values with count > 0)
    const pieData = chartData.filter(d => d.value > 0);

    // Get most practiced value
    let mostPracticed: GraceValue | null = null;
    let maxCount = 0;
    GRACE_VALUES.forEach(v => {
      if (valueCounts[v.key] > maxCount) {
        maxCount = valueCounts[v.key];
        mostPracticed = v;
      }
    });

    // Get most recent journal
    const recentJournal = valueJournals.length > 0
      ? [...valueJournals].sort((a, b) => b.timestamp - a.timestamp)[0]
      : null;
    
    const recentValue = recentJournal 
      ? GRACE_VALUES.find(v => v.key === recentJournal.valueKey) || null
      : null;

    return {
      totalJournals: valueJournals.length,
      mostPracticed: mostPracticed as GraceValue | null,
      recentValue: recentValue as GraceValue | null,
      chartData,
      pieData,
    };
  }, [valueJournals]);

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

        {/* Value Journal Section */}
        <div className="value-journal-section mb-4">
          <div className="section-header">
            <h2 className="section-title">
              <i className="bi bi-journal-richtext me-2"></i>
              Thống kê giá trị GRACE
            </h2>
          </div>

          {/* Value Stats Cards */}
          <div className="row g-3 mb-4">
            <div className="col-4">
              <div className="stat-card stat-value-total">
                <div className="stat-icon">
                  <i className="bi bi-journal-text"></i>
                </div>
                <div className="stat-content">
                  <span className="stat-value">{valueStats.totalJournals}</span>
                  <span className="stat-label">Tổng số nhật ký</span>
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="stat-card stat-practiced">
                <div className="stat-icon">
                  {valueStats.mostPracticed ? (
                    <span>{valueStats.mostPracticed.emoji}</span>
                  ) : (
                    <i className="bi bi-star"></i>
                  )}
                </div>
                <div className="stat-content">
                  <span className="stat-value">
                    {valueStats.mostPracticed?.label || '--'}
                  </span>
                  <span className="stat-label">Giá trị thực hành nhiều nhất</span>
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="stat-card stat-recent">
                <div className="stat-icon">
                  {valueStats.recentValue ? (
                    <span>{valueStats.recentValue.emoji}</span>
                  ) : (
                    <i className="bi bi-clock-history"></i>
                  )}
                </div>
                <div className="stat-content">
                  <span className="stat-value">
                    {valueStats.recentValue?.label || '--'}
                  </span>
                  <span className="stat-label">Giá trị gần nhất</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="row g-3">
            {/* Bar Chart */}
            <div className="col-12 col-lg-7">
              <div className="chart-card">
                <h3 className="chart-title">
                  <i className="bi bi-bar-chart-fill me-2"></i>
                  Biểu đồ giá trị đã thực hành
                </h3>
                {valueStats.totalJournals > 0 ? (
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={valueStats.chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fill: '#666', fontSize: 12 }}
                          axisLine={{ stroke: '#dee2e6' }}
                        />
                        <YAxis 
                          allowDecimals={false}
                          tick={{ fill: '#666', fontSize: 12 }}
                          axisLine={{ stroke: '#dee2e6' }}
                        />
                        <Tooltip 
                          formatter={(value) => [value, 'Số lần']}
                          contentStyle={{ 
                            borderRadius: '12px', 
                            border: 'none',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                          }}
                        />
                        <Bar 
                          dataKey="value" 
                          radius={[8, 8, 0, 0]}
                          maxBarSize={50}
                        >
                          {valueStats.chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="chart-empty">
                    <i className="bi bi-bar-chart"></i>
                    <p>Chưa có dữ liệu nhật ký</p>
                    <Link to="/value-journal" className="chart-empty-link">
                      Bắt đầu viết nhật ký →
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Pie Chart */}
            <div className="col-12 col-lg-5">
              <div className="chart-card">
                <h3 className="chart-title">
                  <i className="bi bi-pie-chart-fill me-2"></i>
                  Tỉ lệ các giá trị
                </h3>
                {valueStats.pieData.length > 0 ? (
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={valueStats.pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {valueStats.pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [value, 'Số lần']}
                          contentStyle={{ 
                            borderRadius: '12px', 
                            border: 'none',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                          }}
                        />
                        <Legend 
                          formatter={(value, entry: any) => (
                            <span style={{ color: '#333', fontSize: '12px' }}>
                              {entry.payload?.emoji} {value}
                            </span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="chart-empty">
                    <i className="bi bi-pie-chart"></i>
                    <p>Chưa có dữ liệu</p>
                  </div>
                )}
              </div>
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
