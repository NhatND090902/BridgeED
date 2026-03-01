const About = () => {
  const teamMembers = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Founder & Clinical Director',
      bio: 'Clinical psychologist with 15+ years of experience in emotional wellness.',
      avatar: 'SC',
    },
    {
      name: 'Michael Torres',
      role: 'Lead Developer',
      bio: 'Full-stack developer passionate about mental health technology.',
      avatar: 'MT',
    },
    {
      name: 'Emily Johnson',
      role: 'UX Designer',
      bio: 'Creates intuitive, calming interfaces for emotional wellness.',
      avatar: 'EJ',
    },
    {
      name: 'Dr. James Lee',
      role: 'Research Director',
      bio: 'Specializes in mindfulness-based cognitive therapy research.',
      avatar: 'JL',
    },
  ];

  const values = [
    {
      icon: 'bi-heart-fill',
      title: 'Compassion',
      description: 'We approach every interaction with empathy and understanding.',
      color: '#FF6B6B',
    },
    {
      icon: 'bi-shield-fill-check',
      title: 'Privacy',
      description: 'Your emotional journey is safe and confidential with us.',
      color: '#4ECDC4',
    },
    {
      icon: 'bi-lightbulb-fill',
      title: 'Evidence-Based',
      description: 'Our methods are grounded in scientific research.',
      color: '#FFD93D',
    },
    {
      icon: 'bi-people-fill',
      title: 'Community',
      description: 'We believe in the power of supportive connections.',
      color: '#45B7D1',
    },
  ];

  return (
    <div className="container py-5">
      {/* Hero Section */}
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold text-primary mb-3">
          About BridgeED
        </h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
          We're on a mission to make emotional wellness accessible to everyone. 
          BridgeED bridges the gap between you and your emotional well-being.
        </p>
      </div>

      {/* Mission Statement */}
      <div className="row justify-content-center mb-5">
        <div className="col-12 col-lg-10">
          <div className="card border-0 shadow-lg bg-primary text-white">
            <div className="card-body p-5 text-center">
              <i className="bi bi-heart-pulse-fill fs-1 mb-3"></i>
              <h2 className="fw-bold mb-4">Our Mission</h2>
              <p className="lead mb-0">
                To empower individuals with tools, knowledge, and community support 
                for managing emotions and building emotional resilience. We believe 
                everyone deserves access to mental wellness resources.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="mb-5">
        <h2 className="text-center fw-bold mb-4">Our Values</h2>
        <div className="row g-4">
          {values.map((value) => (
            <div className="col-6 col-lg-3" key={value.title}>
              <div className="card border-0 shadow-sm h-100 text-center">
                <div className="card-body p-4">
                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: '64px',
                      height: '64px',
                      backgroundColor: `${value.color}20`,
                    }}
                  >
                    <i className={`bi ${value.icon} fs-3`} style={{ color: value.color }}></i>
                  </div>
                  <h5 className="fw-bold">{value.title}</h5>
                  <p className="text-muted small mb-0">{value.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Story */}
      <div className="row align-items-center mb-5 py-5">
        <div className="col-12 col-lg-6 mb-4 mb-lg-0">
          <div className="bg-light rounded-4 p-5 h-100 d-flex align-items-center justify-content-center">
            <div className="text-center">
              <i className="bi bi-book text-primary" style={{ fontSize: '6rem' }}></i>
              <p className="text-muted mt-3 mb-0">Our Journey</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <h2 className="fw-bold mb-4">Our Story</h2>
          <p className="text-muted">
            BridgeED was born from a simple yet powerful idea: emotional wellness 
            should be accessible to everyone, not just those who can afford traditional therapy.
          </p>
          <p className="text-muted">
            Founded in 2024, we started as a small team of mental health professionals 
            and technologists united by a common goal. Today, we've helped thousands of 
            individuals on their journey toward emotional well-being.
          </p>
          <p className="text-muted mb-0">
            Our platform combines evidence-based practices like GRACE mindfulness with 
            modern technology to create a supportive, accessible, and effective 
            emotional management experience.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-5">
        <h2 className="text-center fw-bold mb-4">Meet Our Team</h2>
        <div className="row g-4">
          {teamMembers.map((member) => (
            <div className="col-12 col-sm-6 col-lg-3" key={member.name}>
              <div className="card border-0 shadow-sm h-100 text-center">
                <div className="card-body p-4">
                  <div
                    className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: '80px', height: '80px', fontSize: '1.5rem' }}
                  >
                    {member.avatar}
                  </div>
                  <h5 className="fw-bold mb-1">{member.name}</h5>
                  <p className="text-primary small fw-semibold mb-2">{member.role}</p>
                  <p className="text-muted small mb-0">{member.bio}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="card border-0 shadow-sm bg-light">
        <div className="card-body p-5 text-center">
          <h3 className="fw-bold mb-3">Get in Touch</h3>
          <p className="text-muted mb-4">
            Have questions or feedback? We'd love to hear from you.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <a href="mailto:hello@bridgeed.com" className="btn btn-primary btn-lg">
              <i className="bi bi-envelope me-2"></i>
              Email Us
            </a>
            <a href="#" className="btn btn-outline-primary btn-lg">
              <i className="bi bi-twitter me-2"></i>
              Follow Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
