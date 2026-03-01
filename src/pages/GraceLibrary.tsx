import { useState, useEffect, useCallback } from 'react';
import { LibraryCard, LibraryModal, FireworksEffect, ProgressBar, BadgeAnimation, getRandomBadgeIcon } from '../components';
import type { LibraryCardData, BadgeData } from '../components';
import './GraceLibrary.css';

// Types for progress tracking
interface ProgressData {
  [cardId: number]: boolean[];
}

interface BadgesData {
  [cardId: number]: BadgeData;
}

interface StoredProgress {
  data: ProgressData;
  badges: BadgesData;
  lastUpdated: string;
}

const STORAGE_KEY = 'graceLibraryProgress';

const GraceLibrary = () => {
  const [selectedCard, setSelectedCard] = useState<LibraryCardData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState<ProgressData>({});
  const [badges, setBadges] = useState<BadgesData>({});
  const [showFireworks, setShowFireworks] = useState(false);
  const [fireworksMessage, setFireworksMessage] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showBadgeAnimation, setShowBadgeAnimation] = useState(false);
  const [newBadge, setNewBadge] = useState<BadgeData | null>(null);

  const libraryCards: LibraryCardData[] = [
    {
      id: 1,
      title: 'Checklist cam kết học tập',
      description: 'Xây dựng thói quen học tập tích cực và có trách nhiệm với bản thân',
      icon: 'bi-clipboard-check',
      color: '#4ECDC4',
      gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
      content: [
        'Đặt mục tiêu học tập cụ thể cho từng tuần và theo dõi tiến độ',
        'Chuẩn bị bài trước khi đến lớp ít nhất 15 phút',
        'Tập trung 100% trong giờ học, không sử dụng điện thoại',
        'Ghi chép bài học bằng cách riêng của mình để dễ nhớ',
        'Hỏi thầy cô hoặc bạn bè khi không hiểu bài ngay lập tức',
        'Dành ít nhất 30 phút ôn bài mỗi ngày',
        'Hoàn thành bài tập đúng hạn và kiểm tra lại trước khi nộp',
        'Tự thưởng bản thân khi đạt được mục tiêu đề ra',
      ],
    },
    {
      id: 2,
      title: 'Những câu nói truyền cảm hứng',
      description: 'Những lời động viên giúp bạn vững bước trên con đường phát triển',
      icon: 'bi-chat-quote',
      color: '#FF6B6B',
      gradient: 'linear-gradient(135deg, #FF6B6B 0%, #EE5A5A 100%)',
      content: [
        '"Mỗi ngày là một cơ hội mới để trở nên tốt hơn phiên bản hôm qua"',
        '"Thất bại không phải là kết thúc, mà là bài học cho thành công"',
        '"Bạn mạnh mẽ hơn bạn nghĩ, dũng cảm hơn bạn tin, và thông minh hơn bạn tưởng"',
        '"Đừng so sánh mình với người khác, hãy so sánh với chính mình ngày hôm qua"',
        '"Mỗi bước nhỏ đều đưa bạn đến gần hơn với ước mơ lớn"',
        '"Khó khăn hôm nay là sức mạnh của ngày mai"',
        '"Tin vào bản thân là bước đầu tiên dẫn đến thành công"',
      ],
    },
    {
      id: 3,
      title: 'Cảm ơn vì điều nhỏ bé',
      description: 'Thực hành lòng biết ơn để nuôi dưỡng tâm hồn tích cực',
      icon: 'bi-heart-fill',
      color: '#DDA0DD',
      gradient: 'linear-gradient(135deg, #DDA0DD 0%, #CC8FCC 100%)',
      content: [
        'Cảm ơn ba mẹ vì bữa cơm ngon mỗi ngày',
        'Biết ơn thầy cô đã kiên nhẫn giảng dạy và quan tâm',
        'Trân trọng những người bạn luôn bên cạnh trong lúc khó khăn',
        'Cảm ơn bản thân đã cố gắng không bỏ cuộc',
        'Biết ơn những thất bại vì chúng giúp ta trưởng thành',
        'Trân trọng những khoảnh khắc bình yên trong cuộc sống',
        'Cảm ơn cơ thể khỏe mạnh cho phép ta học tập và vui chơi',
        'Biết ơn mỗi ngày mới với những cơ hội và trải nghiệm',
      ],
    },
    {
      id: 4,
      title: '3 ngày thử thách bản thân',
      description: 'Vượt qua giới hạn và khám phá sức mạnh tiềm ẩn của chính mình',
      icon: 'bi-trophy',
      color: '#FFD93D',
      gradient: 'linear-gradient(135deg, #FFD93D 0%, #F5C400 100%)',
      content: [
        'Ngày 1: Chủ động chào hỏi và mỉm cười với 5 người bạn chưa quen',
        'Ngày 1: Viết ra 3 điều bạn tự hào về bản thân',
        'Ngày 2: Giúp đỡ một bạn trong lớp mà không cần được nhờ',
        'Ngày 2: Dành 20 phút học một kỹ năng mới bạn yêu thích',
        'Ngày 3: Chia sẻ cảm xúc thật với một người bạn tin tưởng',
        'Ngày 3: Viết thư cảm ơn gửi đến người đã giúp đỡ bạn',
        'Hoàn thành cả 3 ngày: Tự thưởng cho bản thân và chia sẻ thành tựu!',
      ],
    },
    {
      id: 5,
      title: 'Can đảm vượt qua thách thức',
      description: 'Học cách đối mặt với khó khăn và biến chúng thành cơ hội',
      icon: 'bi-shield-check',
      color: '#45B7D1',
      gradient: 'linear-gradient(135deg, #45B7D1 0%, #38A3C4 100%)',
      content: [
        'Nhận ra rằng sợ hãi là bình thường - ai cũng có lúc sợ',
        'Chia nhỏ thách thức lớn thành những bước nhỏ dễ thực hiện',
        'Hít thở sâu 3 lần trước khi đối mặt với điều khó khăn',
        'Nhớ lại những lần bạn đã vượt qua khó khăn trước đây',
        'Tìm kiếm sự hỗ trợ từ thầy cô, bạn bè hoặc gia đình',
        'Tự nói với bản thân: "Mình có thể làm được điều này"',
        'Học từ thất bại thay vì sợ hãi thất bại',
        'Khen ngợi bản thân sau mỗi lần dũng cảm thử điều mới',
      ],
    },
    {
      id: 6,
      title: '6 cách kết nối với bạn bè',
      description: 'Xây dựng tình bạn đẹp và môi trường học tập tích cực',
      icon: 'bi-people-fill',
      color: '#96CEB4',
      gradient: 'linear-gradient(135deg, #96CEB4 0%, #7DBF9E 100%)',
      content: [
        'Viết lời cảm ơn nhỏ cho một bạn trong lớp',
        'Lắng nghe trọn vẹn khi bạn chia sẻ',
        'Nhận lỗi và sửa sai khi làm ảnh hưởng nhóm',
        'Động viên các bạn ít nói cùng tham gia hoạt động',
        'Tổ chức hoạt động giúp cả lớp gắn bó',
        'Chia sẻ, giúp đỡ bạn bè trong trường lớp',
      ],
    },
  ];

  // Initialize progress from localStorage
  useEffect(() => {
    const loadProgress = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedData: StoredProgress = JSON.parse(stored);
          
          // Check if it's a new day - auto reset
          const today = new Date().toDateString();
          if (parsedData.lastUpdated !== today) {
            // It's a new day, reset progress
            initializeProgress();
            return;
          }
          
          setProgress(parsedData.data);
          setBadges(parsedData.badges || {});
        } else {
          initializeProgress();
        }
      } catch {
        initializeProgress();
      }
    };

    loadProgress();
  }, []);

  // Initialize empty progress for all cards
  const initializeProgress = useCallback(() => {
    const initialProgress: ProgressData = {};
    libraryCards.forEach((card) => {
      initialProgress[card.id] = new Array(card.content.length).fill(false);
    });
    setProgress(initialProgress);
    setBadges({});
    saveProgress(initialProgress, {});
  }, []);

  // Save progress to localStorage
  const saveProgress = (data: ProgressData, badgesData?: BadgesData) => {
    const storageData: StoredProgress = {
      data,
      badges: badgesData !== undefined ? badgesData : badges,
      lastUpdated: new Date().toDateString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
  };

  // Calculate overall progress
  const calculateOverallProgress = useCallback(() => {
    let totalTasks = 0;
    let completedTasks = 0;

    libraryCards.forEach((card) => {
      const cardProgress = progress[card.id] || [];
      totalTasks += card.content.length;
      completedTasks += cardProgress.filter(Boolean).length;
    });

    return {
      totalTasks,
      completedTasks,
      percentage: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
    };
  }, [progress]);

  // Handle task toggle
  const handleToggleTask = (cardId: number, taskIndex: number) => {
    const cardProgress = progress[cardId] || [];
    const wasCompleted = cardProgress[taskIndex];
    
    // Calculate previous progress percentage
    const previousCompletedCount = cardProgress.filter(Boolean).length;
    const totalTasks = libraryCards.find((c) => c.id === cardId)?.content.length || 0;
    const previousPercentage = (previousCompletedCount / totalTasks) * 100;

    // Update progress
    const newCardProgress = [...cardProgress];
    newCardProgress[taskIndex] = !wasCompleted;

    const newProgress = {
      ...progress,
      [cardId]: newCardProgress,
    };

    setProgress(newProgress);

    // Calculate new progress percentage
    const newCompletedCount = newCardProgress.filter(Boolean).length;
    const newPercentage = (newCompletedCount / totalTasks) * 100;

    // Check if progress crossed 50% threshold (from below to above)
    if (!wasCompleted && previousPercentage < 50 && newPercentage >= 50) {
      const card = libraryCards.find((c) => c.id === cardId);
      setFireworksMessage(
        `Tuyệt vời! Bạn đã hoàn thành hơn 50% nhiệm vụ "${card?.title}". Hãy tiếp tục phát huy nhé!`
      );
      setShowFireworks(true);
    }

    // Check if 100% completed - Award badge
    if (!wasCompleted && newPercentage === 100 && !badges[cardId]) {
      const card = libraryCards.find((c) => c.id === cardId);
      
      // Generate random badge
      const randomBadge = getRandomBadgeIcon();
      const earnedBadge: BadgeData = {
        cardId,
        icon: randomBadge.icon,
        name: randomBadge.name,
        emoji: randomBadge.emoji,
        title: card?.title || '',
        earnedDate: new Date().toLocaleDateString('vi-VN'),
      };

      // Update badges state
      const newBadges = {
        ...badges,
        [cardId]: earnedBadge,
      };
      setBadges(newBadges);
      saveProgress(newProgress, newBadges);

      // Show badge animation
      setNewBadge(earnedBadge);
      setShowBadgeAnimation(true);
    } else {
      saveProgress(newProgress);
    }
  };

  // Open modal
  const openModal = (card: LibraryCardData) => {
    setSelectedCard(card);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedCard(null);
    document.body.style.overflow = 'unset';
  };

  // Reset all progress
  const handleResetProgress = () => {
    initializeProgress();
    setShowResetConfirm(false);
  };

  const overall = calculateOverallProgress();
  const earnedBadgesCount = Object.keys(badges).length;
  const earnedBadgesList = Object.values(badges);

  return (
    <div className="grace-library-container">
      {/* Fireworks Effect */}
      <FireworksEffect
        show={showFireworks}
        message={fireworksMessage}
        onComplete={() => setShowFireworks(false)}
        duration={4000}
      />

      {/* Badge Animation */}
      <BadgeAnimation
        show={showBadgeAnimation}
        badge={newBadge}
        onComplete={() => {
          setShowBadgeAnimation(false);
          setNewBadge(null);
        }}
        duration={5000}
      />

      {/* Header Section */}
      <div className="library-header">
        <div className="container">
          <div className="text-center py-5">
            <div className="header-icon-wrapper mb-4">
              <i className="bi bi-book-half"></i>
            </div>
            <h1 className="display-5 fw-bold text-white mb-3">
              GRACE Library
            </h1>
            <p className="lead text-white-50 mx-auto" style={{ maxWidth: '600px' }}>
              Khám phá bộ sưu tập các hoạt động phát triển bản thân dành cho học sinh
            </p>
          </div>
        </div>
      </div>

      {/* Badge Collection Section */}
      {earnedBadgesCount > 0 && (
        <div className="container">
          <div className="badge-collection-section">
            <div className="badge-collection-header">
              <div className="d-flex align-items-center">
                <div className="badge-collection-icon">
                  <i className="bi bi-collection-fill"></i>
                </div>
                <div className="ms-3">
                  <h4 className="mb-0 fw-bold">Bộ sưu tập huy hiệu</h4>
                  <p className="text-muted mb-0 small">
                    Bạn đã nhận được {earnedBadgesCount} / {libraryCards.length} huy hiệu
                  </p>
                </div>
              </div>
            </div>
            <div className="badge-collection-list">
              {earnedBadgesList.map((badge) => (
                <div key={badge.cardId} className="badge-collection-item">
                  <div className="badge-item-icon">
                    <i className={`bi ${badge.icon}`}></i>
                    <span className="badge-item-emoji">{badge.emoji}</span>
                  </div>
                  <div className="badge-item-info">
                    <span className="badge-item-name">{badge.name}</span>
                    <small className="badge-item-title">{badge.title}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Overall Progress Section */}
      <div className="container">
        <div className="overall-progress-section">
          <div className="row align-items-center">
            <div className="col-12 col-md-8">
              <div className="overall-progress-card">
                <div className="d-flex align-items-center mb-3">
                  <div className="overall-icon">
                    <i className="bi bi-graph-up-arrow"></i>
                  </div>
                  <div className="ms-3">
                    <h4 className="mb-0 fw-bold">Tiến độ tổng thể</h4>
                    <p className="text-muted mb-0 small">
                      Theo dõi hành trình phát triển của bạn
                    </p>
                  </div>
                </div>
                <div className="overall-progress-bar-wrapper">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-semibold text-primary">
                      {overall.completedTasks} / {overall.totalTasks} nhiệm vụ
                    </span>
                    <span className="overall-percentage">
                      {Math.round(overall.percentage)}%
                    </span>
                  </div>
                  <ProgressBar
                    progress={overall.percentage}
                    completedTasks={overall.completedTasks}
                    totalTasks={overall.totalTasks}
                    gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    height="12px"
                    showText={false}
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4 mt-3 mt-md-0">
              <button
                className="btn-reset-progress"
                onClick={() => setShowResetConfirm(true)}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Đặt lại tiến độ hàng ngày
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid Section */}
      <div className="container py-4">
        <div className="row g-4">
          {libraryCards.map((card) => (
            <div className="col-12 col-md-6 col-lg-4" key={card.id}>
              <LibraryCard
                card={card}
                completedTasks={progress[card.id] || []}
                badge={badges[card.id] || null}
                onClick={() => openModal(card)}
              />
            </div>
          ))}
        </div>

        {/* Motivational Banner */}
        <div className="motivational-banner mt-5">
          <div className="row align-items-center">
            <div className="col-12 col-md-8">
              <h3 className="fw-bold text-white mb-2">
                <i className="bi bi-stars me-2"></i>
                Hành trình phát triển bản thân bắt đầu từ những bước nhỏ
              </h3>
              <p className="text-white-50 mb-0">
                Mỗi ngày, hãy dành ít phút để thực hành một hoạt động trong thư viện GRACE
              </p>
            </div>
            <div className="col-12 col-md-4 text-md-end mt-3 mt-md-0">
              <div className="banner-stats">
                <span className="stat-number">{earnedBadgesCount}</span>
                <span className="stat-label">Huy hiệu</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedCard && (
        <LibraryModal
          card={selectedCard}
          completedTasks={progress[selectedCard.id] || []}
          badge={badges[selectedCard.id] || null}
          onClose={closeModal}
          onToggleTask={(taskIndex) => handleToggleTask(selectedCard.id, taskIndex)}
        />
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="reset-confirm-overlay" onClick={() => setShowResetConfirm(false)}>
          <div className="reset-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="reset-confirm-icon">
              <i className="bi bi-exclamation-triangle"></i>
            </div>
            <h4 className="fw-bold mb-2">Xác nhận đặt lại</h4>
            <p className="text-muted mb-4">
              Bạn có chắc chắn muốn đặt lại tất cả tiến độ và huy hiệu? Hành động này không thể hoàn tác.
            </p>
            {earnedBadgesCount > 0 && (
              <div className="reset-warning mb-3">
                <i className="bi bi-exclamation-circle me-2"></i>
                Bạn sẽ mất {earnedBadgesCount} huy hiệu đã nhận được!
              </div>
            )}
            <div className="d-flex gap-3 justify-content-center">
              <button
                className="btn btn-secondary px-4"
                onClick={() => setShowResetConfirm(false)}
              >
                Hủy
              </button>
              <button
                className="btn btn-danger px-4"
                onClick={handleResetProgress}
              >
                <i className="bi bi-trash me-2"></i>
                Đặt lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraceLibrary;
