import { useState, useEffect } from 'react';
import './MedalDisplay.css';

interface Medal {
  id: string;
  icon: string;
  name: string;
  checklistId: number;
  checklistTitle: string;
  earnedAt: string;
}

const MEDALS_STORAGE_KEY = 'graceLibraryMedals';

const MedalDisplay = () => {
  const [medals, setMedals] = useState<Medal[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const loadMedals = () => {
      try {
        const stored = localStorage.getItem(MEDALS_STORAGE_KEY);
        if (stored) {
          setMedals(JSON.parse(stored));
        }
      } catch {
        setMedals([]);
      }
    };

    loadMedals();

    // Listen for storage changes (when medals are added from other components)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === MEDALS_STORAGE_KEY) {
        loadMedals();
      }
    };

    // Custom event listener for same-tab updates
    const handleCustomEvent = () => {
      loadMedals();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('medalsUpdated', handleCustomEvent);

    // Poll for changes every second (for same-tab updates)
    const interval = setInterval(loadMedals, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('medalsUpdated', handleCustomEvent);
      clearInterval(interval);
    };
  }, []);

  if (medals.length === 0) {
    return null;
  }

  return (
    <div className="medal-display-container">
      <div className="container">
        <div className="medal-display-wrapper">
          <button 
            className="medal-toggle-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span className="medal-trophy-icon">🏆</span>
            <span className="medal-count">{medals.length}</span>
            <span className="medal-label">Huy chương đã đạt</span>
            <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'} ms-2`}></i>
          </button>

          {!isExpanded && (
            <div className="medal-preview">
              {medals.slice(0, 5).map((medal, index) => (
                <span 
                  key={`${medal.checklistId}-${index}`}
                  className="medal-icon-preview"
                  title={medal.name}
                >
                  {medal.icon}
                </span>
              ))}
              {medals.length > 5 && (
                <span className="medal-more">+{medals.length - 5}</span>
              )}
            </div>
          )}

          {isExpanded && (
            <div className="medal-list-expanded">
              {medals.map((medal, index) => (
                <div 
                  key={`${medal.checklistId}-${index}`}
                  className="medal-item"
                >
                  <span className="medal-icon-large">{medal.icon}</span>
                  <div className="medal-info">
                    <span className="medal-name">{medal.name}</span>
                    <span className="medal-checklist">{medal.checklistTitle}</span>
                    <span className="medal-date">
                      {new Date(medal.earnedAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedalDisplay;
