import { useState } from 'react';

const GraceModule = () => {
  const [activeStep, setActiveStep] = useState(0);

  const graceSteps = [
    {
      letter: 'G',
      title: 'Graceful (Bình tâm)',
      description: 'Giữ sự bình tĩnh và quay về với hiện tại. Nhận biết cảm xúc của mình mà không phán xét. Khi bạn bình tâm, bạn có thể suy nghĩ rõ ràng và phản ứng một cách tích cực hơn.',
      icon: 'bi bi-peace',
      color: '#4ECDC4',
      exercise: 'Hít sâu 3 lần. Cảm nhận cơ thể của bạn đang ở đâu. Quan sát 5 điều bạn có thể nhìn thấy, 4 điều bạn có thể chạm vào, và 3 âm thanh bạn có thể nghe.',
    },
    {
      letter: 'R',
      title: 'Respect (Tôn trọng)',
      description: 'Tôn trọng cảm xúc, suy nghĩ của bản thân và của người khác. Mỗi người đều có trải nghiệm và góc nhìn riêng. Tôn trọng giúp xây dựng sự tin tưởng và kết nối tích cực.',
      icon: 'bi bi-person-check',
      color: '#FF6B6B',
      exercise: 'Hãy nghĩ về một người mà bạn đã tương tác hôm nay. Tự hỏi: "Mình đã lắng nghe và tôn trọng họ chưa?" Nếu chưa, hãy nghĩ về một cách bạn có thể phản hồi tốt hơn lần sau.',
    },
    {
      letter: 'A',
      title: 'Accountability (Trách nhiệm)',
      description: 'Chịu trách nhiệm về cảm xúc, hành vi và lựa chọn của mình. Nhận ra rằng bạn có khả năng chọn cách phản ứng, thay vì chỉ phản ứng theo cảm xúc tiêu cực.',
      icon: 'bi-hand-thumbs-up',
      color: '#45B7D1',
      exercise: 'Nhớ lại một tình huống gần đây khiến bạn khó chịu. Viết ra: bạn đã phản ứng như thế nào? Lần sau, bạn có thể chọn một phản ứng tích cực hơn không?',
    },
    {
      letter: 'C',
      title: 'Courage (Can đảm)',
      description: 'Dũng cảm đối diện với cảm xúc, thử thách và sự thay đổi. Dũng cảm không phải là không sợ hãi, mà là hành động tích cực ngay cả khi bạn cảm thấy không thoải mái.',
      icon: 'bi-heart',
      color: '#DDA0DD',
      exercise: 'Hãy nghĩ về một việc bạn đang ngại làm. Viết ra một bước nhỏ mà bạn có thể thực hiện hôm nay để tiến gần hơn đến mục tiêu đó.',
    },
    {
      letter: 'E',
      title: 'Engagement (Dấn thân-Kết nối)',
      description: 'Chủ động tham gia, kết nối với bản thân và những người xung quanh theo cách tích cực. Sự kết nối giúp bạn cảm thấy được hỗ trợ, thấu hiểu và phát triển.',
      icon: 'bi-arrows-fullscreen',
      color: '#96CEB4',
      exercise: 'Hôm nay, hãy chủ động nói một lời tích cực với ai đó, hoặc chia sẻ cảm xúc của bạn với một người bạn tin tưởng.',
    },
  ];

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="fw-bold text-primary mb-3">
              <i className="bi bi-flower1 me-2"></i>
              GRACE Module
            </h1>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
              A mindfulness practice to help you navigate difficult emotions with awareness and self-compassion.
            </p>
          </div>

          {/* GRACE Letters Navigation */}
          <div className="d-flex justify-content-center gap-2 mb-5 flex-wrap">
            {graceSteps.map((step, index) => (
              <button
                key={step.letter}
                className={`btn btn-lg rounded-circle ${
                  activeStep === index ? 'btn-primary' : 'btn-outline-primary'
                }`}
                style={{ width: '60px', height: '60px' }}
                onClick={() => setActiveStep(index)}
              >
                <span className="fw-bold fs-4">{step.letter}</span>
              </button>
            ))}
          </div>

          {/* Active Step Card */}
          <div className="card border-0 shadow-lg mb-4">
            <div
              className="card-header text-white py-4"
              style={{ backgroundColor: graceSteps[activeStep].color }}
            >
              <div className="d-flex align-items-center">
                <div
                  className="rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center me-3"
                  style={{ width: '64px', height: '64px' }}
                >
                  <i className={`bi ${graceSteps[activeStep].icon} fs-2`}></i>
                </div>
                <div>
                  <span className="badge bg-white bg-opacity-25 mb-2">
                    Step {activeStep + 1} of 5
                  </span>
                  <h2 className="fw-bold mb-0">
                    {graceSteps[activeStep].letter} - {graceSteps[activeStep].title}
                  </h2>
                </div>
              </div>
            </div>
            <div className="card-body p-4 p-md-5">
              <p className="lead mb-4">{graceSteps[activeStep].description}</p>

              <div className="bg-light rounded-3 p-4">
                <h5 className="fw-bold mb-3">
                  <i className="bi bi-lightbulb me-2 text-warning"></i>
                  Practice Exercise
                </h5>
                <p className="mb-0 text-muted">{graceSteps[activeStep].exercise}</p>
              </div>
            </div>
            <div className="card-footer bg-white border-0 p-4">
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                  disabled={activeStep === 0}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Previous
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setActiveStep(Math.min(4, activeStep + 1))}
                  disabled={activeStep === 4}
                >
                  Next
                  <i className="bi bi-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress" style={{ height: '8px' }}>
            <div
              className="progress-bar bg-primary"
              role="progressbar"
              style={{ width: `${((activeStep + 1) / 5) * 100}%` }}
            ></div>
          </div>

          {/* All Steps Overview */}
          <div className="row g-3 mt-5">
            {graceSteps.map((step, index) => (
              <div className="col-12 col-md-6 col-lg" key={step.letter}>
                <div
                  className={`card h-100 border-0 ${
                    activeStep === index ? 'shadow-lg' : 'shadow-sm'
                  }`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setActiveStep(index)}
                >
                  <div className="card-body text-center p-3">
                    <div
                      className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                      style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: `${step.color}20`,
                        color: step.color,
                      }}
                    >
                      <span className="fw-bold">{step.letter}</span>
                    </div>
                    <h6 className="small fw-bold mb-0">{step.title}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraceModule;
