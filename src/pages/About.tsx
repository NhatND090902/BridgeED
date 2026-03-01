import { useState } from 'react';
import './About.css';

const About = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');

  const totalSlides = 4;

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setSlideDirection(index > currentSlide ? 'next' : 'prev');
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      goToSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  };

  const phases = [
    {
      phase: 'Phase 1: Khám phá',
      coreValue: 'Tự đánh giá - hiểu bản thân',
      mainTools: 'Khảo sát GRACE, Mood Map',
    },
    {
      phase: 'Phase 2: Thực hành',
      coreValue: 'Phản ứng trong tình huống',
      mainTools: 'Value Cards, thử thách nhóm',
    },
    {
      phase: 'Phase 3: Tư duy',
      coreValue: 'Nhận diện - phân tích hành vi',
      mainTools: 'Game điều tra, Nhật ký',
    },
    {
      phase: 'Phase 4: Kết nối',
      coreValue: 'Lan tỏa và giao tiếp tích cực',
      mainTools: 'Dự án nhóm, huy hiệu',
    },
    {
      phase: 'Phase 5: Ghi nhận',
      coreValue: 'Tổng kết - phản chiếu sâu',
      mainTools: 'Dashboard, Hộp thư thời gian',
    },
  ];

  return (
    <div className="about-container">
      {/* Slides Container */}
      <div className="slides-wrapper">
        {/* Slide 1 - Our Mission */}
        <div
          className={`slide slide-1 ${currentSlide === 0 ? 'active' : ''} ${
            isAnimating ? `slide-${slideDirection}` : ''
          }`}
        >
          <div className="slide-content">
            <div className="slide-card">
              <div className="slide-icon-wrapper mission-icon">
                <i className="bi bi-rocket-takeoff-fill"></i>
              </div>
              <h1 className="slide-title">Our Mission</h1>
              <div className="slide-divider"></div>
              <ul className="mission-list">
                <li>
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Tái thiết lập và tăng cường kết nối giữa học sinh - phụ huynh - giáo viên thông qua 5 giá trị GRACE
                </li>
                <li>
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Giúp học sinh hiểu rõ bản thân và chủ động hơn trong học tập
                </li>
                <li>
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Hỗ trợ giáo viên và nhà trường nắm bắt tâm lý, thái độ của học sinh để điều chỉnh phương pháp giáo dục
                </li>
              </ul>
              <div className="grace-badge">
                <span>G</span><span>R</span><span>A</span><span>C</span><span>E</span>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 2 - General Information */}
        <div
          className={`slide slide-2 ${currentSlide === 1 ? 'active' : ''} ${
            isAnimating ? `slide-${slideDirection}` : ''
          }`}
        >
          <div className="slide-content">
            <div className="slide-card">
              <div className="slide-icon-wrapper info-icon">
                <i className="bi bi-info-circle-fill"></i>
              </div>
              <h1 className="slide-title">General Information</h1>
              <div className="slide-divider"></div>
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-icon-small">
                    <i className="bi bi-people-fill"></i>
                  </div>
                  <p>Đa dạng đối tượng</p>
                </div>
                <div className="info-item">
                  <div className="info-icon-small">
                    <i className="bi bi-heart-pulse-fill"></i>
                  </div>
                  <p><strong>BridgeED</strong> - Cầu nối giáo dục bằng GRACE </p>
                </div>
                <div className="info-item">
                  <div className="info-icon-small">
                    <i className="bi bi-translate"></i>
                  </div>
                  <p>Tiếng Việt & Tiếng Anh</p>
                </div>
                <div className="info-item">
                  <div className="info-icon-small">
                    <i className="bi bi-chat-heart-fill"></i>
                  </div>
                  <p>Nói chuyện chủ động — Phản hồi tử tế</p>
                </div>
                <div className="info-item full-width">
                  <div className="info-icon-small">
                    <i className="bi bi-phone-fill"></i>
                  </div>
                  <p>Có sẵn dưới dạng website đáp ứng và ứng dụng di động</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 3 - Notice */}
        <div
          className={`slide slide-3 ${currentSlide === 2 ? 'active' : ''} ${
            isAnimating ? `slide-${slideDirection}` : ''
          }`}
        >
          <div className="slide-content">
            <div className="slide-card">
              <div className="slide-icon-wrapper notice-icon">
                <i className="bi bi-exclamation-triangle-fill"></i>
              </div>
              <h1 className="slide-title">Notice</h1>
              <div className="slide-divider"></div>
              <div className="notice-list">
                <div className="notice-item">
                  <div className="notice-number">1</div>
                  <p>ứng dụng không thay thế giáo viên/ cố vấn tâm lý mà là công cụ hỗ trợ kết nối, phản chiếu, học tập tích cực</p>
                </div>
                <div className="notice-item">
                  <div className="notice-number">2</div>
                  <p>Tính năng ẩn danh được <strong>giám sát có điều kiện</strong> để đảm bảo an toàn tâm lý</p>
                </div>
                <div className="notice-item">
                  <div className="notice-number">3</div>
                  <p>Quyền riêng tư được tôn trọng: người dùng có thể <strong>ẩn hoặc xóa</strong> nội dung cá nhân bất cứ lúc nào</p>
                </div>
                <div className="notice-item">
                  <div className="notice-number">4</div>
                  <p>Học sinh được khuyến khích sử dụng nền tảng ít nhất <strong>10 phút mỗi ngày</strong> để đạt hiệu quả</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 4 - Phases Introduction */}
        <div
          className={`slide slide-4 ${currentSlide === 3 ? 'active' : ''} ${
            isAnimating ? `slide-${slideDirection}` : ''
          }`}
        >
          <div className="slide-content">
            <div className="slide-card phases-card">
              <div className="slide-icon-wrapper phases-icon">
                <i className="bi bi-diagram-3-fill"></i>
              </div>
              <h1 className="slide-title">Phases Introduction</h1>
              <div className="slide-divider"></div>
              
              {/* Desktop Table */}
              <div className="phases-table-wrapper d-none d-md-block">
                <table className="phases-table">
                  <thead>
                    <tr>
                      <th><i className="bi bi-flag-fill me-2"></i>Phase</th>
                      <th><i className="bi bi-gem me-2"></i>Core Value</th>
                      <th><i className="bi bi-tools me-2"></i>Main Tools</th>
                    </tr>
                  </thead>
                  <tbody>
                    {phases.map((phase, index) => (
                      <tr key={index} className={`phase-row phase-row-${index + 1}`}>
                        <td className="phase-name">{phase.phase}</td>
                        <td>{phase.coreValue}</td>
                        <td>{phase.mainTools}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="phases-mobile d-md-none">
                {phases.map((phase, index) => (
                  <div key={index} className={`phase-card phase-card-${index + 1}`}>
                    <h4 className="phase-card-title">{phase.phase}</h4>
                    <div className="phase-card-content">
                      <div className="phase-card-item">
                        <span className="phase-card-label">
                          <i className="bi bi-gem me-1"></i>Core Value:
                        </span>
                        <span>{phase.coreValue}</span>
                      </div>
                      <div className="phase-card-item">
                        <span className="phase-card-label">
                          <i className="bi bi-tools me-1"></i>Main Tools:
                        </span>
                        <span>{phase.mainTools}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="slide-navigation">
        <button
          className="nav-btn prev-btn"
          onClick={prevSlide}
          disabled={currentSlide === 0}
        >
          <i className="bi bi-chevron-left"></i>
          <span className="d-none d-sm-inline ms-2">Previous</span>
        </button>

        <div className="slide-indicators">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              className={`indicator ${currentSlide === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          className="nav-btn next-btn"
          onClick={nextSlide}
          disabled={currentSlide === totalSlides - 1}
        >
          <span className="d-none d-sm-inline me-2">Next</span>
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>

      {/* Slide Counter */}
      <div className="slide-counter">
        <span className="current">{currentSlide + 1}</span>
        <span className="separator">/</span>
        <span className="total">{totalSlides}</span>
      </div>
    </div>
  );
};

export default About;
