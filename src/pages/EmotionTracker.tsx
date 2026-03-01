import { useState, useEffect } from 'react';
import './EmotionTracker.css';

// Emotion data interface
export interface EmotionLog {
  id: string;
  emotion: string;
  emotionKey: string;
  icon: string;
  emoji: string;
  color: string;
  level: number;
  levelLabel: string;
  note: string;
  date: string;
  timestamp: number;
}

// Emotion options with Vietnamese labels
const EMOTIONS = [
  { key: 'happy', label: 'Vui', emoji: '😊', icon: 'bi-emoji-smile-fill', color: '#4CAF50' },
  { key: 'calm', label: 'Bình tĩnh', emoji: '😌', icon: 'bi-emoji-sunglasses-fill', color: '#2196F3' },
  { key: 'neutral', label: 'Bình thường', emoji: '😐', icon: 'bi-emoji-neutral-fill', color: '#9E9E9E' },
  { key: 'sad', label: 'Buồn', emoji: '😢', icon: 'bi-emoji-frown-fill', color: '#9C27B0' },
  { key: 'angry', label: 'Tức giận', emoji: '😠', icon: 'bi-emoji-angry-fill', color: '#F44336' },
  { key: 'anxious', label: 'Lo lắng', emoji: '😰', icon: 'bi-emoji-dizzy-fill', color: '#FF9800' },
];

// Level options with Vietnamese labels
const LEVELS = [
  { value: 1, label: 'Rất thấp' },
  { value: 2, label: 'Thấp' },
  { value: 3, label: 'Trung bình' },
  { value: 4, label: 'Cao' },
  { value: 5, label: 'Rất cao' },
];

const STORAGE_KEY = 'bridged_emotion_logs';

const EmotionTracker = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [level, setLevel] = useState<number>(3);
  const [note, setNote] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [recentLogs, setRecentLogs] = useState<EmotionLog[]>([]);

  // Load recent logs on mount
  useEffect(() => {
    loadRecentLogs();
  }, []);

  const loadRecentLogs = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const logs: EmotionLog[] = JSON.parse(stored);
        // Get last 5 logs sorted by timestamp descending
        const sorted = logs.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
        setRecentLogs(sorted);
      }
    } catch (error) {
      console.error('Error loading emotion logs:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmotion) return;

    const emotion = EMOTIONS.find(em => em.key === selectedEmotion);
    const levelData = LEVELS.find(l => l.value === level);
    
    if (!emotion || !levelData) return;

    const newLog: EmotionLog = {
      id: `emotion_${Date.now()}`,
      emotion: emotion.label,
      emotionKey: emotion.key,
      icon: emotion.icon,
      emoji: emotion.emoji,
      color: emotion.color,
      level: level,
      levelLabel: levelData.label,
      note: note.trim(),
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
    };

    // Save to localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const logs: EmotionLog[] = stored ? JSON.parse(stored) : [];
      logs.push(newLog);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Reset form
      setSelectedEmotion('');
      setLevel(3);
      setNote('');
      
      // Reload recent logs
      loadRecentLogs();
    } catch (error) {
      console.error('Error saving emotion log:', error);
    }
  };

  const getSelectedEmotionData = () => {
    return EMOTIONS.find(em => em.key === selectedEmotion);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="emotion-tracker-page">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            {/* Header */}
            <div className="emotion-tracker-header text-center mb-4">
              <div className="header-icon-wrapper">
                <i className="bi bi-emoji-smile-fill"></i>
              </div>
              <h1 className="fw-bold mb-2">Theo Dõi Cảm Xúc</h1>
              <p className="text-muted mb-0">
                Ghi lại cảm xúc của bạn mỗi ngày để hiểu rõ hơn về bản thân
              </p>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="success-message animate__animated animate__fadeInDown">
                <div className="success-content">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Đã lưu cảm xúc thành công!</span>
                </div>
              </div>
            )}

            {/* Emotion Selection */}
            <div className="emotion-card mb-4">
              <div className="card-header-custom">
                <i className="bi bi-heart-fill"></i>
                <span>Chọn cảm xúc của bạn</span>
              </div>
              <div className="emotion-grid">
                {EMOTIONS.map((emotion) => (
                  <button
                    key={emotion.key}
                    type="button"
                    className={`emotion-btn ${selectedEmotion === emotion.key ? 'active' : ''}`}
                    onClick={() => setSelectedEmotion(emotion.key)}
                    style={{
                      '--emotion-color': emotion.color,
                    } as React.CSSProperties}
                  >
                    <div className="emotion-icon-wrapper" style={{ backgroundColor: emotion.color }}>
                      <i className={`bi ${emotion.icon}`}></i>
                    </div>
                    <span className="emotion-emoji">{emotion.emoji}</span>
                    <span className="emotion-label">{emotion.label}</span>
                    {selectedEmotion === emotion.key && (
                      <div className="emotion-check">
                        <i className="bi bi-check-lg"></i>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Level Selection */}
            <div className="emotion-card mb-4">
              <div className="card-header-custom">
                <i className="bi bi-speedometer2"></i>
                <span>Mức độ cảm xúc</span>
              </div>
              <div className="level-selector">
                {LEVELS.map((levelOption) => (
                  <button
                    key={levelOption.value}
                    type="button"
                    className={`level-btn ${level === levelOption.value ? 'active' : ''}`}
                    onClick={() => setLevel(levelOption.value)}
                  >
                    <span className="level-number">{levelOption.value}</span>
                    <span className="level-label">{levelOption.label}</span>
                  </button>
                ))}
              </div>
              <div className="level-indicator">
                <div className="level-progress">
                  <div 
                    className="level-progress-fill"
                    style={{ width: `${(level / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Note Field */}
            <div className="emotion-card mb-4">
              <div className="card-header-custom">
                <i className="bi bi-pencil-fill"></i>
                <span>Ghi chú</span>
                <span className="optional-badge">Tùy chọn</span>
              </div>
              <textarea
                className="note-textarea"
                rows={4}
                placeholder="Viết mô tả ngắn về cảm xúc hoặc điều đã xảy ra..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-btn"
              onClick={handleSubmit}
              disabled={!selectedEmotion}
            >
              <i className="bi bi-check-circle-fill me-2"></i>
              Lưu cảm xúc
              {getSelectedEmotionData() && (
                <span className="selected-preview">
                  {getSelectedEmotionData()?.emoji}
                </span>
              )}
            </button>

            {/* Recent Entries */}
            {recentLogs.length > 0 && (
              <div className="emotion-card mt-4">
                <div className="card-header-custom">
                  <i className="bi bi-clock-history"></i>
                  <span>Lịch sử gần đây</span>
                </div>
                <div className="recent-entries-list">
                  {recentLogs.map((log) => (
                    <div key={log.id} className="recent-entry-item">
                      <div 
                        className="entry-icon"
                        style={{ backgroundColor: log.color }}
                      >
                        <i className={`bi ${log.icon}`}></i>
                      </div>
                      <div className="entry-content">
                        <div className="entry-header">
                          <span className="entry-emotion">
                            {log.emoji} {log.emotion}
                          </span>
                          <span className="entry-level">
                            Mức {log.level}
                          </span>
                        </div>
                        {log.note && (
                          <p className="entry-note">{log.note}</p>
                        )}
                        <span className="entry-date">
                          {formatDate(log.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionTracker;
