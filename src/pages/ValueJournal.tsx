import { useState } from 'react';

const ValueJournal = () => {
  const [entry, setEntry] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [gratitude, setGratitude] = useState('');

  const coreValues = [
    'Growth',
    'Connection',
    'Authenticity',
    'Compassion',
    'Courage',
    'Creativity',
    'Integrity',
    'Wisdom',
    'Balance',
    'Joy',
    'Resilience',
    'Service',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Journal entry saved!');
    setEntry('');
    setSelectedValue('');
    setGratitude('');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="fw-bold text-primary mb-3">
              <i className="bi bi-journal-text me-2"></i>
              Value Journal
            </h1>
            <p className="text-muted">
              Reflect on your values and document your personal growth journey.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Today's Gratitude */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">
                  <i className="bi bi-heart-fill text-danger me-2"></i>
                  Today's Gratitude
                </h5>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="What are you grateful for today?"
                  value={gratitude}
                  onChange={(e) => setGratitude(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* Core Value Focus */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">
                  <i className="bi bi-star-fill text-warning me-2"></i>
                  Core Value Focus
                </h5>
                <p className="text-muted small mb-3">
                  Select a value you want to focus on today:
                </p>
                <div className="d-flex flex-wrap gap-2">
                  {coreValues.map((value) => (
                    <button
                      type="button"
                      key={value}
                      className={`btn btn-sm ${
                        selectedValue === value
                          ? 'btn-primary'
                          : 'btn-outline-primary'
                      }`}
                      onClick={() => setSelectedValue(value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Journal Entry */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">
                  <i className="bi bi-pencil-square text-primary me-2"></i>
                  Journal Entry
                </h5>
                <textarea
                  className="form-control"
                  rows={8}
                  placeholder="Write about your day, your thoughts, feelings, or anything on your mind..."
                  value={entry}
                  onChange={(e) => setEntry(e.target.value)}
                ></textarea>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <small className="text-muted">
                    {entry.length} characters
                  </small>
                  <small className="text-muted">
                    <i className="bi bi-calendar me-1"></i>
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </small>
                </div>
              </div>
            </div>

            {/* Prompts */}
            <div className="card border-0 shadow-sm mb-4 bg-light">
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3">
                  <i className="bi bi-lightbulb me-2 text-warning"></i>
                  Reflection Prompts
                </h6>
                <ul className="mb-0 text-muted small">
                  <li>How did I honor my values today?</li>
                  <li>What challenged me, and how did I respond?</li>
                  <li>What did I learn about myself?</li>
                  <li>How can I grow tomorrow?</li>
                </ul>
              </div>
            </div>

            {/* Submit Button */}
            <div className="d-grid">
              <button type="submit" className="btn btn-primary btn-lg">
                <i className="bi bi-save me-2"></i>
                Save Journal Entry
              </button>
            </div>
          </form>

          {/* Past Entries Preview */}
          <div className="card border-0 shadow-sm mt-5">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="fw-bold mb-0">
                <i className="bi bi-clock-history me-2"></i>
                Past Entries
              </h5>
            </div>
            <div className="list-group list-group-flush">
              <div className="list-group-item py-3">
                <div className="d-flex justify-content-between mb-1">
                  <strong>Yesterday</strong>
                  <span className="badge bg-primary">Growth</span>
                </div>
                <p className="text-muted small mb-0">
                  Worked on staying present during difficult conversations...
                </p>
              </div>
              <div className="list-group-item py-3">
                <div className="d-flex justify-content-between mb-1">
                  <strong>March 28, 2026</strong>
                  <span className="badge bg-primary">Compassion</span>
                </div>
                <p className="text-muted small mb-0">
                  Practiced self-compassion after making a mistake at work...
                </p>
              </div>
              <div className="list-group-item py-3">
                <div className="d-flex justify-content-between mb-1">
                  <strong>March 27, 2026</strong>
                  <span className="badge bg-primary">Connection</span>
                </div>
                <p className="text-muted small mb-0">
                  Had a meaningful conversation with an old friend...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValueJournal;
