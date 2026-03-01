import { useState } from 'react';

const GraceLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All', icon: 'bi-grid' },
    { id: 'articles', label: 'Articles', icon: 'bi-file-text' },
    { id: 'videos', label: 'Videos', icon: 'bi-play-circle' },
    { id: 'exercises', label: 'Exercises', icon: 'bi-activity' },
    { id: 'meditations', label: 'Meditations', icon: 'bi-peace' },
  ];

  const resources = [
    {
      id: 1,
      title: 'Understanding Your Emotions',
      description: 'A comprehensive guide to identifying and understanding your emotional responses.',
      category: 'articles',
      type: 'Article',
      duration: '10 min read',
      icon: 'bi-file-text',
    },
    {
      id: 2,
      title: 'Guided Breathing Exercise',
      description: 'A calming 5-minute breathing exercise for stress relief.',
      category: 'exercises',
      type: 'Exercise',
      duration: '5 min',
      icon: 'bi-lungs',
    },
    {
      id: 3,
      title: 'Introduction to Mindfulness',
      description: 'Learn the basics of mindfulness and how to practice it daily.',
      category: 'videos',
      type: 'Video',
      duration: '12 min',
      icon: 'bi-play-circle',
    },
    {
      id: 4,
      title: 'Body Scan Meditation',
      description: 'A relaxing body scan meditation to help you connect with your body.',
      category: 'meditations',
      type: 'Meditation',
      duration: '15 min',
      icon: 'bi-peace',
    },
    {
      id: 5,
      title: 'Managing Anxiety',
      description: 'Practical strategies for managing anxiety in daily life.',
      category: 'articles',
      type: 'Article',
      duration: '8 min read',
      icon: 'bi-file-text',
    },
    {
      id: 6,
      title: 'Gratitude Practice',
      description: 'Daily gratitude exercises to boost positive emotions.',
      category: 'exercises',
      type: 'Exercise',
      duration: '3 min',
      icon: 'bi-heart',
    },
    {
      id: 7,
      title: 'Sleep Better Tonight',
      description: 'A calming meditation designed to help you fall asleep.',
      category: 'meditations',
      type: 'Meditation',
      duration: '20 min',
      icon: 'bi-moon-stars',
    },
    {
      id: 8,
      title: 'The Science of Emotions',
      description: 'Understanding how emotions work in the brain.',
      category: 'videos',
      type: 'Video',
      duration: '18 min',
      icon: 'bi-play-circle',
    },
  ];

  const filteredResources = resources.filter((resource) => {
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Article: 'bg-primary',
      Video: 'bg-danger',
      Exercise: 'bg-success',
      Meditation: 'bg-info',
    };
    return colors[type] || 'bg-secondary';
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="fw-bold text-primary mb-3">
          <i className="bi bi-book me-2"></i>
          GRACE Library
        </h1>
        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
          Explore our collection of resources for emotional wellness, mindfulness, and personal growth.
        </p>
      </div>

      {/* Search Bar */}
      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="input-group input-group-lg shadow-sm">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="d-flex justify-content-center gap-2 mb-5 flex-wrap">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`btn ${
              activeCategory === category.id ? 'btn-primary' : 'btn-outline-primary'
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            <i className={`bi ${category.icon} me-2`}></i>
            {category.label}
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="row g-4">
        {filteredResources.map((resource) => (
          <div className="col-12 col-md-6 col-lg-4" key={resource.id}>
            <div className="card h-100 border-0 shadow-sm hover-shadow">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: '#0d6efd20',
                    }}
                  >
                    <i className={`bi ${resource.icon} text-primary fs-5`}></i>
                  </div>
                  <span className={`badge ${getTypeColor(resource.type)}`}>
                    {resource.type}
                  </span>
                </div>
                <h5 className="fw-bold mb-2">{resource.title}</h5>
                <p className="text-muted small mb-3">{resource.description}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    <i className="bi bi-clock me-1"></i>
                    {resource.duration}
                  </small>
                  <button className="btn btn-sm btn-outline-primary">
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredResources.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-search text-muted fs-1 mb-3 d-block"></i>
          <h5 className="text-muted">No resources found</h5>
          <p className="text-muted small">Try adjusting your search or filter</p>
        </div>
      )}

      {/* Featured Section */}
      <div className="card border-0 shadow-sm bg-primary bg-gradient text-white mt-5">
        <div className="card-body p-5 text-center">
          <h3 className="fw-bold mb-3">
            <i className="bi bi-star-fill me-2"></i>
            New This Week
          </h3>
          <p className="mb-4">
            Check out our newest meditation: "Finding Peace in Uncertainty"
          </p>
          <button className="btn btn-light btn-lg px-4">
            <i className="bi bi-play-fill me-2"></i>
            Start Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default GraceLibrary;
