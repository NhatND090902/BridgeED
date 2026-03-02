import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
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
  { key: 'engagement', label: 'Dấn thân-Kết nối', emoji: '💫', color: '#2ECC71' },
];

const Dashboard = () => {
  const [emotionLogs, setEmotionLogs] = useState<EmotionLog[]>([]);
  const [valueJournals, setValueJournals] = useState<ValueJournalEntry[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'emotion' | 'grace'>('emotion');
  const [selectedTableDate, setSelectedTableDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const features = [
    {
      title: 'Emotion Tracker',
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
      title: 'Value Journal',
      description: 'Phản ánh về giá trị và ghi lại sự phát triển cá nhân.',
      icon: 'bi-journal-text',
      color: '#45B7D1',
      link: '/value-journal',
    },
    {
      title: 'GRACE Library',
      description: 'Truy cập tài liệu và nguồn lực sức khỏe cảm xúc.',
      icon: 'bi-book',
      color: '#96CEB4',
      link: '/grace-library',
    },
    {
      title: 'Anonymous Chat',
      description: 'Kết nối với người khác trong môi trường an toàn.',
      icon: 'bi-chat-dots',
      color: '#DDA0DD',
      link: '/anonymous-chat',
    },
    {
      title: 'About BridgeED',
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

  // Line Chart Data - Last 7 days frequency
  const last7DaysData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const data: { date: string; dateLabel: string; count: number }[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dateLabel = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      
      const count = valueJournals.filter(j => j.date === dateStr).length;
      data.push({ date: dateStr, dateLabel, count });
    }
    
    return data;
  }, [valueJournals]);

  // Comparison Statistics - Week and Month
  const comparisonStats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Helper function to get start of week (Monday)
    const getStartOfWeek = (date: Date) => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      d.setDate(diff);
      d.setHours(0, 0, 0, 0);
      return d;
    };
    
    // This week
    const thisWeekStart = getStartOfWeek(today);
    const thisWeekEnd = new Date(thisWeekStart);
    thisWeekEnd.setDate(thisWeekEnd.getDate() + 6);
    thisWeekEnd.setHours(23, 59, 59, 999);
    
    // Last week
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeekEnd = new Date(thisWeekStart);
    lastWeekEnd.setMilliseconds(-1);
    
    // This month
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    
    // Last month
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999);
    
    // Count records for each period
    const countInPeriod = (start: Date, end: Date) => {
      return valueJournals.filter(j => {
        const journalDate = new Date(j.date);
        journalDate.setHours(12, 0, 0, 0);
        return journalDate >= start && journalDate <= end;
      }).length;
    };
    
    const thisWeekCount = countInPeriod(thisWeekStart, thisWeekEnd);
    const lastWeekCount = countInPeriod(lastWeekStart, lastWeekEnd);
    const thisMonthCount = countInPeriod(thisMonthStart, thisMonthEnd);
    const lastMonthCount = countInPeriod(lastMonthStart, lastMonthEnd);
    
    // Calculate percentages
    const weekChange = lastWeekCount === 0 
      ? (thisWeekCount > 0 ? 100 : 0)
      : Math.round(((thisWeekCount - lastWeekCount) / lastWeekCount) * 100);
    
    const monthChange = lastMonthCount === 0 
      ? (thisMonthCount > 0 ? 100 : 0)
      : Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100);
    
    return {
      thisWeekCount,
      lastWeekCount,
      thisMonthCount,
      lastMonthCount,
      weekChange,
      monthChange,
    };
  }, [valueJournals]);

  // Today's Pie Chart Data
  const todayPieData = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayJournals = valueJournals.filter(j => j.date === todayStr);
    
    // Group by valueKey
    const valueCounts: { [key: string]: number } = {};
    GRACE_VALUES.forEach(v => {
      valueCounts[v.key] = 0;
    });
    
    todayJournals.forEach(journal => {
      if (valueCounts[journal.valueKey] !== undefined) {
        valueCounts[journal.valueKey]++;
      }
    });
    
    // Create pie data
    const pieData = GRACE_VALUES.map(v => ({
      name: v.label,
      value: valueCounts[v.key],
      emoji: v.emoji,
      color: v.color,
    })).filter(d => d.value > 0);
    
    const total = todayJournals.length;
    
    return { pieData, total };
  }, [valueJournals]);

  // Table Data for Selected Date
  const tableData = useMemo(() => {
    const selectedJournals = valueJournals.filter(j => j.date === selectedTableDate);
    
    // Group by valueKey
    const grouped: { [key: string]: { valueLabel: string; emoji: string; color: string; count: number; contents: string[] } } = {};
    
    selectedJournals.forEach(journal => {
      if (!grouped[journal.valueKey]) {
        const graceValue = GRACE_VALUES.find(v => v.key === journal.valueKey);
        grouped[journal.valueKey] = {
          valueLabel: journal.valueLabel || graceValue?.label || journal.valueKey,
          emoji: journal.emoji || graceValue?.emoji || '',
          color: journal.color || graceValue?.color || '#666',
          count: 0,
          contents: [],
        };
      }
      grouped[journal.valueKey].count++;
      if (journal.content) {
        grouped[journal.valueKey].contents.push(journal.content);
      }
    });
    
    return Object.values(grouped);
  }, [valueJournals, selectedTableDate]);

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

        {/* Tabs Navigation */}
        <div className="dashboard-tabs mb-4">
          <button
            className={`dashboard-tab ${activeTab === 'emotion' ? 'active' : ''}`}
            onClick={() => setActiveTab('emotion')}
          >
            <i className="bi bi-calendar-heart me-2"></i>
            Biểu đồ Cảm xúc
          </button>
          <button
            className={`dashboard-tab ${activeTab === 'grace' ? 'active' : ''}`}
            onClick={() => setActiveTab('grace')}
          >
            <i className="bi bi-journal-richtext me-2"></i>
            Biểu đồ Hành vi tích cực
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content-wrapper">
          {/* Emotion Calendar Tab */}
          {activeTab === 'emotion' && (
            <div className="tab-panel emotion-tab-panel">
              {/* Emotion Stats Cards */}
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
              <div className="emotion-calendar-section">
                <div className="calendar-header">
                  <div className="calendar-title">
                    <i className="bi bi-calendar-heart"></i>
                    <span>DASHBOARD THEO DÕI CẢM XÚC</span>
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

              {/* Quick Add CTA */}
              <div className="quick-add-cta mt-4">
                <Link to="/emotion-tracker" className="quick-add-btn">
                  <i className="bi bi-plus-circle me-2"></i>
                  Ghi nhận cảm xúc hôm nay
                </Link>
              </div>
            </div>
          )}

          {/* GRACE Statistics Tab */}
          {activeTab === 'grace' && (
            <div className="tab-panel grace-tab-panel">
              {/* Summary Stats Row */}
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

              {/* Row 1: Line Chart - Full Width */}
              <div className="row g-3 mb-4">
                <div className="col-12">
                  <div className="chart-card">
                    <h3 className="chart-title">
                      <i className="bi bi-graph-up me-2"></i>
                      Biểu đồ theo dõi cảm xúc theo ngày
                    </h3>
                    <div className="chart-container">
                      <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={last7DaysData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                          <XAxis 
                            dataKey="dateLabel" 
                            tick={{ fill: '#666', fontSize: 12 }}
                            axisLine={{ stroke: '#dee2e6' }}
                          />
                          <YAxis 
                            allowDecimals={false}
                            tick={{ fill: '#666', fontSize: 12 }}
                            axisLine={{ stroke: '#dee2e6' }}
                            label={{ value: 'Số lần ghi nhận', angle: -90, position: 'insideLeft', fill: '#666', fontSize: 12 }}
                          />
                          <Tooltip 
                            formatter={(value) => [value, 'Số lần']}
                            labelFormatter={(label) => `Ngày: ${label}`}
                            contentStyle={{ 
                              borderRadius: '12px', 
                              border: 'none',
                              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="count" 
                            stroke="#4ECDC4" 
                            strokeWidth={3}
                            dot={{ fill: '#4ECDC4', strokeWidth: 2, r: 5 }}
                            activeDot={{ r: 8, fill: '#FF6B6B' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Comparison Stats Cards */}
              <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                  <div className="stat-card stat-value-total">
                    <div className="stat-icon">
                      <i className="bi bi-calendar-week"></i>
                    </div>
                    <div className="stat-content">
                      <span className="stat-value">{comparisonStats.thisWeekCount}</span>
                      <span className="">Tuần này</span>
                    </div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="stat-card stat-practiced">
                    <div className="stat-icon">
                      <i className="bi bi-calendar-month"></i>
                    </div>
                    <div className="stat-content">
                      <span className="stat-value">{comparisonStats.thisMonthCount}</span>
                      <span className="">Tháng này</span>
                    </div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className={`stat-card ${comparisonStats.weekChange >= 0 ? 'stat-increase' : 'stat-decrease'}`}>
                    <div className="stat-icon">
                      <i className={`bi ${comparisonStats.weekChange >= 0 ? 'bi-arrow-up-circle' : 'bi-arrow-down-circle'}`}></i>
                    </div>
                    <div className="stat-content">
                      <span className="stat-value" style={{ color: comparisonStats.weekChange >= 0 ? '#28a745' : '#dc3545' }}>
                        {comparisonStats.weekChange >= 0 ? '+' : ''}{comparisonStats.weekChange}%
                      </span>
                      <span className="">So với tuần trước</span>
                    </div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className={`stat-card ${comparisonStats.monthChange >= 0 ? 'stat-increase' : 'stat-decrease'}`}>
                    <div className="stat-icon">
                      <i className={`bi ${comparisonStats.monthChange >= 0 ? 'bi-arrow-up-circle' : 'bi-arrow-down-circle'}`}></i>
                    </div>
                    <div className="stat-content">
                      <span className="stat-value" style={{ color: comparisonStats.monthChange >= 0 ? '#28a745' : '#dc3545' }}>
                        {comparisonStats.monthChange >= 0 ? '+' : ''}{comparisonStats.monthChange}%
                      </span>
                      <span className="">So với tháng trước</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: Today's Pie Chart and Table */}
              <div className="row g-3 mb-4">
                {/* Today's Pie Chart */}
                <div className="col-12 col-lg-5">
                  <div className="chart-card">
                    <h3 className="chart-title">
                      <i className="bi bi-pie-chart-fill me-2"></i>
                      Biểu đồ cảm xúc ảnh hưởng bởi các giá trị GRACE
                    </h3>
                    {todayPieData.pieData.length > 0 ? (
                      <div className="chart-container">
                        <ResponsiveContainer width="100%" height={280}>
                          <PieChart>
                            <Pie
                              data={todayPieData.pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={90}
                              paddingAngle={3}
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                            >
                              {todayPieData.pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value, name) => [value, name]}
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
                        <p>Không có dữ liệu hôm nay</p>
                        <Link to="/value-journal" className="chart-empty-link">
                          Ghi nhận hành vi tích cực →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Table with Date Picker */}
                <div className="col-12 col-lg-7">
                  <div className="chart-card table-card">
                    <div className="table-header">
                      <h3 className="chart-title">
                        <i className="bi bi-table me-2"></i>
                        Thống kê số việc làm tích cực theo 5 giá trị GRACE
                      </h3>
                      <div className="date-picker-wrapper">
                        <label htmlFor="table-date" className="date-picker-label">
                          <i className="bi bi-calendar3 me-1"></i>
                          Chọn ngày:
                        </label>
                        <input
                          type="date"
                          id="table-date"
                          className="date-picker-input"
                          value={selectedTableDate}
                          onChange={(e) => setSelectedTableDate(e.target.value)}
                        />
                      </div>
                    </div>
                    {tableData.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table grace-table">
                          <thead>
                            <tr>
                              <th>Giá trị</th>
                              <th>Các việc đã làm</th>
                              <th className="text-center">Số lần</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tableData.map((row, index) => (
                              <tr key={index}>
                                <td>
                                  <span className="value-badge" style={{ backgroundColor: row.color }}>
                                    {row.emoji} {row.valueLabel}
                                  </span>
                                </td>
                                <td>
                                  <ul className="content-list">
                                    {row.contents.map((content, idx) => (
                                      <li key={idx}>{content}</li>
                                    ))}
                                  </ul>
                                </td>
                                <td className="text-center">
                                  <span className="count-badge">{row.count}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="table-empty">
                        <i className="bi bi-inbox"></i>
                        <p>Không có dữ liệu cho ngày đã chọn</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* GRACE Values Legend */}
              <div className="grace-legend-card">
                <h4 className="grace-legend-title">
                  <i className="bi bi-info-circle me-2"></i>
                  Giá trị GRACE
                </h4>
                <div className="grace-legend-items">
                  {GRACE_VALUES.map(value => (
                    <div key={value.key} className="grace-legend-item" style={{ borderColor: value.color }}>
                      <span className="grace-emoji">{value.emoji}</span>
                      <div className="grace-info">
                        <span className="grace-label">{value.label}</span>
                        <span className="grace-key">{value.key.charAt(0).toUpperCase()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Add CTA */}
              <div className="quick-add-cta mt-4">
                <Link to="/value-journal" className="quick-add-btn grace-btn">
                  <i className="bi bi-journal-plus me-2"></i>
                  Ghi nhận hành vi tích cực hôm nay
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Feature Cards */}
        <div className="features-section mb-4 mt-4">
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
            <h3 className="fw-bold mb-2">Bắt đầu</h3>
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
                    Ghi nhận cảm xúc ngay
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
