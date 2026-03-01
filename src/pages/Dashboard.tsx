import { Link } from 'react-router-dom';
import { DashboardCard } from '../components';

const Dashboard = () => {
  const features = [
    {
      title: 'Emotion Tracker',
      description: 'Track and understand your daily emotions with our intuitive tracker.',
      icon: 'bi-emoji-smile',
      color: '#FF6B6B',
      link: '/emotion-tracker',
    },
    {
      title: 'GRACE Module',
      description: 'Practice mindfulness with our guided GRACE exercises.',
      icon: 'bi-flower1',
      color: '#4ECDC4',
      link: '/grace-module',
    },
    {
      title: 'Value Journal',
      description: 'Reflect on your values and document your personal growth.',
      icon: 'bi-journal-text',
      color: '#45B7D1',
      link: '/value-journal',
    },
    {
      title: 'GRACE Library',
      description: 'Access resources and materials for emotional wellness.',
      icon: 'bi-book',
      color: '#96CEB4',
      link: '/grace-library',
    },
    {
      title: 'Anonymous Chat',
      description: 'Connect with others in a safe, anonymous environment.',
      icon: 'bi-chat-dots',
      color: '#DDA0DD',
      link: '/anonymous-chat',
    },
    {
      title: 'About Us',
      description: 'Learn more about our mission and team.',
      icon: 'bi-info-circle',
      color: '#F7DC6F',
      link: '/about',
    },
  ];

  return (
    <div className="container py-5">
      {/* Welcome Section */}
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold text-primary mb-3">
          <i className="bi bi-heart-pulse-fill me-2"></i>
          Welcome to BridgeED
        </h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
          Your personal emotional management platform. Track, understand, and improve your emotional well-being.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="row g-4 mb-5">
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm bg-primary text-white">
            <div className="card-body text-center py-4">
              <i className="bi bi-calendar-check fs-2 mb-2"></i>
              <h3 className="fw-bold mb-0">7</h3>
              <small>Day Streak</small>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm bg-success text-white">
            <div className="card-body text-center py-4">
              <i className="bi bi-emoji-smile fs-2 mb-2"></i>
              <h3 className="fw-bold mb-0">85%</h3>
              <small>Mood Score</small>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm bg-info text-white">
            <div className="card-body text-center py-4">
              <i className="bi bi-journal-check fs-2 mb-2"></i>
              <h3 className="fw-bold mb-0">12</h3>
              <small>Journal Entries</small>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm bg-warning text-white">
            <div className="card-body text-center py-4">
              <i className="bi bi-trophy fs-2 mb-2"></i>
              <h3 className="fw-bold mb-0">5</h3>
              <small>Achievements</small>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <h2 className="h4 fw-bold mb-4">
        <i className="bi bi-grid-3x3-gap me-2"></i>
        Explore Features
      </h2>
      <div className="row g-4">
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

      {/* Call to Action */}
      <div className="card border-0 shadow-sm bg-gradient bg-primary text-white mt-5">
        <div className="card-body text-center py-5">
          <h3 className="fw-bold mb-3">Start Your Wellness Journey Today</h3>
          <p className="mb-4">Track your emotions, practice mindfulness, and grow every day.</p>
          <Link to="/emotion-tracker" className="btn btn-light btn-lg px-4">
            <i className="bi bi-play-fill me-2"></i>
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
