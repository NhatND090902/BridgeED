import { useState, useEffect } from 'react';
import './ValueJournal.css';

// Value Journal data interface
export interface ValueJournalEntry {
  id: string;
  valueKey: string;
  valueLabel: string;
  emoji: string;
  color: string;
  content: string;
  date: string;
  timestamp: number;
}

// GRACE Values with Vietnamese labels
const GRACE_VALUES = [
  { key: 'gratitude', label: 'Biết ơn', emoji: '🙏', color: '#FFD93D' },
  { key: 'respect', label: 'Tôn trọng', emoji: '🤝', color: '#2196F3' },
  { key: 'accountability', label: 'Trách nhiệm', emoji: '📘', color: '#9C27B0' },
  { key: 'courage', label: 'Dũng cảm', emoji: '🦁', color: '#F44336' },
  { key: 'engagement', label: 'Kết nối', emoji: '🌟', color: '#4CAF50' },
];

const STORAGE_KEY = 'bridged_value_journals';

const ValueJournal = () => {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [recentEntries, setRecentEntries] = useState<ValueJournalEntry[]>([]);
  
  // Edit modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ValueJournalEntry | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [editContent, setEditContent] = useState<string>('');
  const [editDate, setEditDate] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load entries on mount
  useEffect(() => {
    loadRecentEntries();
  }, []);

  const loadRecentEntries = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const entries: ValueJournalEntry[] = JSON.parse(stored);
        const sorted = entries.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
        setRecentEntries(sorted);
      }
    } catch (error) {
      console.error('Error loading value journals:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedValue || !content.trim()) return;

    const value = GRACE_VALUES.find(v => v.key === selectedValue);
    if (!value) return;

    const newEntry: ValueJournalEntry = {
      id: `value_${Date.now()}`,
      valueKey: value.key,
      valueLabel: value.label,
      emoji: value.emoji,
      color: value.color,
      content: content.trim(),
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
    };

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const entries: ValueJournalEntry[] = stored ? JSON.parse(stored) : [];
      entries.push(newEntry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      setSelectedValue('');
      setContent('');
      loadRecentEntries();
    } catch (error) {
      console.error('Error saving value journal:', error);
    }
  };

  // Open edit modal
  const handleOpenEditModal = (entry: ValueJournalEntry) => {
    setEditingEntry(entry);
    setEditValue(entry.valueKey);
    setEditContent(entry.content);
    setEditDate(entry.date);
    setShowEditModal(true);
    setShowDeleteConfirm(false);
  };

  // Close edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingEntry(null);
    setShowDeleteConfirm(false);
  };

  // Update entry
  const handleUpdateEntry = () => {
    if (!editingEntry || !editValue || !editContent.trim()) return;

    const value = GRACE_VALUES.find(v => v.key === editValue);
    if (!value) return;

    const updatedEntry: ValueJournalEntry = {
      ...editingEntry,
      valueKey: value.key,
      valueLabel: value.label,
      emoji: value.emoji,
      color: value.color,
      content: editContent.trim(),
      date: editDate,
      timestamp: new Date(editDate).getTime(),
    };

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const entries: ValueJournalEntry[] = stored ? JSON.parse(stored) : [];
      const updatedEntries = entries.map(e => 
        e.id === editingEntry.id ? updatedEntry : e
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      handleCloseEditModal();
      loadRecentEntries();
    } catch (error) {
      console.error('Error updating value journal:', error);
    }
  };

  // Delete entry
  const handleDeleteEntry = () => {
    if (!editingEntry) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const entries: ValueJournalEntry[] = stored ? JSON.parse(stored) : [];
      const filteredEntries = entries.filter(e => e.id !== editingEntry.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEntries));
      
      handleCloseEditModal();
      loadRecentEntries();
    } catch (error) {
      console.error('Error deleting value journal:', error);
    }
  };

  const getSelectedValueData = () => {
    return GRACE_VALUES.find(v => v.key === selectedValue);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="value-journal-page">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            {/* Header */}
            <div className="value-journal-header text-center mb-4">
              <div className="header-icon-wrapper">
                <i className="bi bi-journal-richtext"></i>
              </div>
              <h1 className="fw-bold mb-2">Value Journal</h1>
              <p className="text-muted mb-0">
                Ghi lại những hành động thể hiện giá trị GRACE của bạn
              </p>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="success-message">
                <div className="success-content">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Đã lưu nhật ký thành công!</span>
                </div>
              </div>
            )}

            {/* GRACE Info Card */}
            <div className="grace-info-card mb-4">
              <div className="grace-info-header">
                <span className="grace-title">GRACE</span>
                <span className="grace-subtitle">Giá trị cốt lõi</span>
              </div>
              <div className="grace-letters">
                {GRACE_VALUES.map((value, index) => (
                  <div key={value.key} className="grace-letter-item">
                    <span 
                      className="grace-letter"
                      style={{ color: value.color }}
                    >
                      {['G', 'R', 'A', 'C', 'E'][index]}
                    </span>
                    <span className="grace-meaning">
                      {value.emoji} {value.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Value Selection */}
            <div className="value-card mb-4">
              <div className="card-header-custom">
                <i className="bi bi-star-fill"></i>
                <span>Chọn giá trị bạn đã thực hành</span>
              </div>
              <div className="value-grid">
                {GRACE_VALUES.map((value) => (
                  <button
                    key={value.key}
                    type="button"
                    className={`value-btn ${selectedValue === value.key ? 'active' : ''}`}
                    onClick={() => setSelectedValue(value.key)}
                    style={{ '--value-color': value.color } as React.CSSProperties}
                  >
                    <div 
                      className="value-icon-wrapper"
                      style={{ backgroundColor: value.color }}
                    >
                      <span className="value-emoji">{value.emoji}</span>
                    </div>
                    <span className="value-label">{value.label}</span>
                    {selectedValue === value.key && (
                      <div className="value-check">
                        <i className="bi bi-check-lg"></i>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Field */}
            <div className="value-card mb-4">
              <div className="card-header-custom">
                <i className="bi bi-pencil-fill"></i>
                <span>Nội dung việc bạn đã làm</span>
              </div>
              <textarea
                className="content-textarea"
                rows={5}
                placeholder="Ví dụ: Hôm nay tôi đã giúp đỡ bạn trong lớp và lắng nghe bạn chia sẻ..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
              <div className="textarea-footer">
                <span className="char-count">{content.length} ký tự</span>
                <span className="current-date">
                  <i className="bi bi-calendar me-1"></i>
                  {new Date().toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Prompts Card */}
            <div className="prompts-card mb-4">
              <div className="prompts-header">
                <i className="bi bi-lightbulb-fill"></i>
                <span>Gợi ý suy ngẫm</span>
              </div>
              <ul className="prompts-list">
                <li>Hôm nay bạn đã làm điều gì thể hiện giá trị này?</li>
                <li>Bạn cảm thấy thế nào sau khi thực hiện hành động đó?</li>
                <li>Người khác đã phản ứng như thế nào?</li>
                <li>Ngày mai bạn có thể làm gì để tiếp tục thực hành?</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-btn"
              onClick={handleSubmit}
              disabled={!selectedValue || !content.trim()}
            >
              <i className="bi bi-save-fill me-2"></i>
              Lưu nhật ký
              {getSelectedValueData() && (
                <span className="selected-preview">
                  {getSelectedValueData()?.emoji}
                </span>
              )}
            </button>

            {/* Recent Entries */}
            {recentEntries.length > 0 && (
              <div className="value-card mt-4">
                <div className="card-header-custom">
                  <i className="bi bi-clock-history"></i>
                  <span>Nhật ký gần đây</span>
                  <span className="click-hint">Nhấn để chỉnh sửa</span>
                </div>
                <div className="recent-entries-list">
                  {recentEntries.map((entry) => (
                    <div 
                      key={entry.id} 
                      className="recent-entry-item clickable"
                      onClick={() => handleOpenEditModal(entry)}
                    >
                      <div 
                        className="entry-icon"
                        style={{ backgroundColor: entry.color }}
                      >
                        <span>{entry.emoji}</span>
                      </div>
                      <div className="entry-content">
                        <div className="entry-header">
                          <span className="entry-value">{entry.valueLabel}</span>
                          <span className="entry-date">{formatDate(entry.timestamp)}</span>
                        </div>
                        <p className="entry-text">{entry.content}</p>
                      </div>
                      <div className="entry-edit-icon">
                        <i className="bi bi-pencil-square"></i>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingEntry && (
        <div className="modal-overlay" onClick={handleCloseEditModal}>
          <div className="edit-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h5 className="modal-title">
                <i className="bi bi-pencil-square me-2"></i>
                Chỉnh sửa nhật ký
              </h5>
              <button className="modal-close" onClick={handleCloseEditModal}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="modal-body-custom">
              {/* Value Selection in Modal */}
              <div className="edit-section">
                <label className="edit-label">
                  <i className="bi bi-star-fill me-2"></i>
                  Giá trị
                </label>
                <div className="edit-value-grid">
                  {GRACE_VALUES.map((value) => (
                    <button
                      key={value.key}
                      type="button"
                      className={`edit-value-btn ${editValue === value.key ? 'active' : ''}`}
                      onClick={() => setEditValue(value.key)}
                      style={{ '--value-color': value.color } as React.CSSProperties}
                    >
                      <span className="edit-value-emoji">{value.emoji}</span>
                      <span className="edit-value-label">{value.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div className="edit-section">
                <label className="edit-label">
                  <i className="bi bi-calendar-event me-2"></i>
                  Ngày
                </label>
                <input
                  type="date"
                  className="edit-date-input"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
              </div>

              {/* Content Field in Modal */}
              <div className="edit-section">
                <label className="edit-label">
                  <i className="bi bi-pencil-fill me-2"></i>
                  Nội dung
                </label>
                <textarea
                  className="edit-content-textarea"
                  rows={4}
                  placeholder="Nội dung việc bạn đã làm..."
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                ></textarea>
              </div>

              {/* Delete Confirmation */}
              {showDeleteConfirm ? (
                <div className="delete-confirm-section">
                  <p className="delete-confirm-text">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Bạn có chắc muốn xóa nhật ký này?
                  </p>
                  <div className="delete-confirm-buttons">
                    <button 
                      className="btn-cancel-delete"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Hủy
                    </button>
                    <button 
                      className="btn-confirm-delete"
                      onClick={handleDeleteEntry}
                    >
                      <i className="bi bi-trash me-1"></i>
                      Xác nhận xóa
                    </button>
                  </div>
                </div>
              ) : (
                <div className="modal-actions">
                  <button 
                    className="btn-delete"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                  <button 
                    className="btn-save"
                    onClick={handleUpdateEntry}
                    disabled={!editValue || !editContent.trim()}
                  >
                    <i className="bi bi-check-lg me-2"></i>
                    Lưu thay đổi
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValueJournal;
