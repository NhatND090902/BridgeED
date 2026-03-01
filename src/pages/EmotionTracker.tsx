import { useState } from 'react';

const EmotionTracker = () => {
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');

  const emotions = [
    { name: 'Happy', icon: 'bi-emoji-smile', color: '#FFD93D' },
    { name: 'Sad', icon: 'bi-emoji-frown', color: '#6C9BCF' },
    { name: 'Anxious', icon: 'bi-emoji-dizzy', color: '#FF8B8B' },
    { name: 'Calm', icon: 'bi-emoji-neutral', color: '#98D8AA' },
    { name: 'Angry', icon: 'bi-emoji-angry', color: '#FF6B6B' },
    { name: 'Excited', icon: 'bi-emoji-laughing', color: '#FF9F45' },
    { name: 'Tired', icon: 'bi-emoji-expressionless', color: '#B4B4B4' },
    { name: 'Grateful', icon: 'bi-emoji-heart-eyes', color: '#FF78C4' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Emotion logged: ${selectedEmotion} (Intensity: ${intensity})`);
    setSelectedEmotion('');
    setIntensity(5);
    setNote('');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="fw-bold text-primary mb-3">
              <i className="bi bi-emoji-smile me-2"></i>
              Emotion Tracker
            </h1>
            <p className="text-muted">
              How are you feeling right now? Select an emotion and log your current state.
            </p>
          </div>

          {/* Emotion Selection */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">
                <i className="bi bi-heart me-2"></i>
                Select Your Emotion
              </h5>
              <div className="row g-3">
                {emotions.map((emotion) => (
                  <div className="col-6 col-sm-4 col-md-3" key={emotion.name}>
                    <button
                      type="button"
                      className={`btn w-100 py-3 ${
                        selectedEmotion === emotion.name
                          ? 'btn-primary'
                          : 'btn-outline-secondary'
                      }`}
                      onClick={() => setSelectedEmotion(emotion.name)}
                    >
                      <i
                        className={`bi ${emotion.icon} fs-3 d-block mb-2`}
                        style={{
                          color: selectedEmotion === emotion.name ? 'white' : emotion.color,
                        }}
                      ></i>
                      <small>{emotion.name}</small>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Intensity Slider */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">
                <i className="bi bi-speedometer2 me-2"></i>
                Intensity Level
              </h5>
              <div className="px-3">
                <input
                  type="range"
                  className="form-range"
                  min="1"
                  max="10"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                />
                <div className="d-flex justify-content-between text-muted small">
                  <span>Low (1)</span>
                  <span className="fw-bold text-primary fs-5">{intensity}</span>
                  <span>High (10)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">
                <i className="bi bi-pencil me-2"></i>
                Add Notes (Optional)
              </h5>
              <textarea
                className="form-control"
                rows={4}
                placeholder="What triggered this emotion? Any thoughts you want to record..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              onClick={handleSubmit}
              disabled={!selectedEmotion}
            >
              <i className="bi bi-check-circle me-2"></i>
              Log Emotion
            </button>
          </div>

          {/* Recent Entries Preview */}
          <div className="card border-0 shadow-sm mt-5">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="fw-bold mb-0">
                <i className="bi bi-clock-history me-2"></i>
                Recent Entries
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between align-items-center py-3">
                  <div>
                    <i className="bi bi-emoji-smile text-warning fs-5 me-2"></i>
                    <span className="fw-semibold">Happy</span>
                    <span className="text-muted ms-2">- Completed a project</span>
                  </div>
                  <span className="badge bg-primary rounded-pill">8/10</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center py-3">
                  <div>
                    <i className="bi bi-emoji-neutral text-success fs-5 me-2"></i>
                    <span className="fw-semibold">Calm</span>
                    <span className="text-muted ms-2">- Morning meditation</span>
                  </div>
                  <span className="badge bg-primary rounded-pill">6/10</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center py-3">
                  <div>
                    <i className="bi bi-emoji-heart-eyes text-pink fs-5 me-2"></i>
                    <span className="fw-semibold">Grateful</span>
                    <span className="text-muted ms-2">- Family time</span>
                  </div>
                  <span className="badge bg-primary rounded-pill">9/10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionTracker;
