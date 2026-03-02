import { useState, useEffect, useCallback, useMemo } from 'react';
import { FireworksEffect, ProgressBar } from '../components';
import './GraceLibrary.css';

// ===========================
// Types
// ===========================
interface ModuleCard {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  content: string[];
  hasVideo?: boolean;
  videoUrl?: string;
  thumbnail?: string;
}

interface MatchingCard {
  id: string;
  type: 'value' | 'action';
  valueKey: string;
  text: string;
  emoji: string;
  color: string;
}

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface ChecklistGroup {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  items: ChecklistItem[];
}

interface Badge {
  id: string;
  icon: string;
  name: string;
}

interface MilestoneState {
  [checklistId: number]: {
    reached50: boolean;
    reached100: boolean;
  };
}

// ===========================
// Storage Keys
// ===========================
const CHECKLIST_STORAGE_KEY = 'graceLibraryChecklists';
const MILESTONE_STORAGE_KEY = 'graceLibraryMilestones';
const BADGE_STORAGE_KEY = 'graceLibraryBadge';
const MEDALS_STORAGE_KEY = 'graceLibraryMedals';
const GLOBAL_COMPLETION_KEY = 'graceLibraryGlobalComplete';

// ===========================
// Badge Constants
// ===========================
const BADGES: Badge[] = [
  { id: 'badge_star', icon: '⭐', name: 'Ngôi sao kiên trì' },
  { id: 'badge_fire', icon: '🔥', name: 'Chiến binh GRACE' },
  { id: 'badge_heart', icon: '💖', name: 'Trái tim tích cực' },
  { id: 'badge_crown', icon: '👑', name: 'Nhà lãnh đạo tích cực' },
  { id: 'badge_rocket', icon: '🚀', name: 'Người bứt phá' },
];

// ===========================
// Data Constants
// ===========================

// Tab 1: Module Cards (without video)
const MODULE_CARDS: ModuleCard[] = [
  {
    id: 1,
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
    id: 2,
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

// Tab 1: Video Cards
const VIDEO_CARDS: ModuleCard[] = [
  {
    id: 101,
    title: 'Khái niệm GRACE',
    description: 'Giới thiệu về 5 giá trị cốt lõi GRACE',
    icon: 'bi-play-circle',
    color: '#4ECDC4',
    gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
    content: [
      'GRACE là viết tắt của 5 giá trị cốt lõi:',
      '🙏 Gratitude - Biết ơn: Trân trọng những điều tốt đẹp trong cuộc sống',
      '🤝 Respect - Tôn trọng: Đối xử tử tế với mọi người xung quanh',
      '✊ Accountability - Trách nhiệm: Chịu trách nhiệm với hành động của mình',
      '🦁 Courage - Dũng cảm: Dám đối mặt với thử thách',
      '💫 Engagement - Gắn kết: Tích cực tham gia các hoạt động cộng đồng',
    ],
    hasVideo: true,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
  },
  {
    id: 102,
    title: 'Tình huống thực tế',
    description: 'Các tình huống áp dụng giá trị GRACE trong đời sống',
    icon: 'bi-film',
    color: '#9B59B6',
    gradient: 'linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%)',
    content: [
      'Tình huống 1: Khi bạn bè gặp khó khăn trong học tập',
      'Tình huống 2: Khi có xung đột trong nhóm làm việc',
      'Tình huống 3: Khi bị áp lực từ bạn bè',
      'Tình huống 4: Khi mắc lỗi và cần nhận trách nhiệm',
      'Tình huống 5: Khi cần dũng cảm lên tiếng bảo vệ bạn bè',
    ],
    hasVideo: true,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
  },
  {
    id: 103,
    title: 'Bài học thực tế',
    description: 'Những bài học rút ra từ việc thực hành GRACE',
    icon: 'bi-lightbulb',
    color: '#E74C3C',
    gradient: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)',
    content: [
      'Bài học 1: Biết ơn giúp tâm hồn thanh thản',
      'Bài học 2: Tôn trọng tạo nên môi trường hòa thuận',
      'Bài học 3: Trách nhiệm giúp xây dựng lòng tin',
      'Bài học 4: Dũng cảm mở ra cơ hội mới',
      'Bài học 5: Gắn kết tạo nên sức mạnh tập thể',
    ],
    hasVideo: true,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
  },
];

// Tab 2: Matching Game Data Sets
const MATCHING_DATASETS = [
  {
    values: [
      { valueKey: 'gratitude', text: 'Gratitude', emoji: '🙏', color: '#FFD93D' },
      { valueKey: 'respect', text: 'Respect', emoji: '🤝', color: '#4ECDC4' },
      { valueKey: 'accountability', text: 'Accountability', emoji: '✊', color: '#9B59B6' },
      { valueKey: 'courage', text: 'Courage', emoji: '🦁', color: '#E74C3C' },
      { valueKey: 'engagement', text: 'Engagement', emoji: '💫', color: '#2ECC71' },
    ],
    actions: [
      { valueKey: 'gratitude', text: 'Nói lời cảm ơn bạn bè', emoji: '🙏', color: '#FFD93D' },
      { valueKey: 'respect', text: 'Lắng nghe khi người khác nói', emoji: '🤝', color: '#4ECDC4' },
      { valueKey: 'accountability', text: 'Nhận lỗi khi mắc sai lầm', emoji: '✊', color: '#9B59B6' },
      { valueKey: 'courage', text: 'Dám phát biểu ý kiến', emoji: '🦁', color: '#E74C3C' },
      { valueKey: 'engagement', text: 'Tham gia hoạt động nhóm', emoji: '💫', color: '#2ECC71' },
    ],
  },
  {
    values: [
      { valueKey: 'gratitude', text: 'Gratitude', emoji: '🙏', color: '#FFD93D' },
      { valueKey: 'respect', text: 'Respect', emoji: '🤝', color: '#4ECDC4' },
      { valueKey: 'accountability', text: 'Accountability', emoji: '✊', color: '#9B59B6' },
      { valueKey: 'courage', text: 'Courage', emoji: '🦁', color: '#E74C3C' },
      { valueKey: 'engagement', text: 'Engagement', emoji: '💫', color: '#2ECC71' },
    ],
    actions: [
      { valueKey: 'gratitude', text: 'Viết thư cảm ơn thầy cô', emoji: '🙏', color: '#FFD93D' },
      { valueKey: 'respect', text: 'Không ngắt lời người khác', emoji: '🤝', color: '#4ECDC4' },
      { valueKey: 'accountability', text: 'Hoàn thành bài tập đúng hạn', emoji: '✊', color: '#9B59B6' },
      { valueKey: 'courage', text: 'Bảo vệ bạn bè bị bắt nạt', emoji: '🦁', color: '#E74C3C' },
      { valueKey: 'engagement', text: 'Giúp đỡ bạn bè học bài', emoji: '💫', color: '#2ECC71' },
    ],
  },
  {
    values: [
      { valueKey: 'gratitude', text: 'Gratitude', emoji: '🙏', color: '#FFD93D' },
      { valueKey: 'respect', text: 'Respect', emoji: '🤝', color: '#4ECDC4' },
      { valueKey: 'accountability', text: 'Accountability', emoji: '✊', color: '#9B59B6' },
      { valueKey: 'courage', text: 'Courage', emoji: '🦁', color: '#E74C3C' },
      { valueKey: 'engagement', text: 'Engagement', emoji: '💫', color: '#2ECC71' },
    ],
    actions: [
      { valueKey: 'gratitude', text: 'Trân trọng những điều nhỏ bé', emoji: '🙏', color: '#FFD93D' },
      { valueKey: 'respect', text: 'Tôn trọng ý kiến khác biệt', emoji: '🤝', color: '#4ECDC4' },
      { valueKey: 'accountability', text: 'Giữ lời hứa với mọi người', emoji: '✊', color: '#9B59B6' },
      { valueKey: 'courage', text: 'Thử những điều mới mẻ', emoji: '🦁', color: '#E74C3C' },
      { valueKey: 'engagement', text: 'Tổ chức hoạt động lớp', emoji: '💫', color: '#2ECC71' },
    ],
  },
];

// Tab 3: Default Checklist Groups
const DEFAULT_CHECKLISTS: ChecklistGroup[] = [
  {
    id: 1,
    title: 'Checklist cam kết học tập',
    description: 'Xây dựng thói quen học tập tích cực và có trách nhiệm',
    icon: 'bi-clipboard-check',
    color: '#4ECDC4',
    gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
    items: [
      { id: 'learn_1', text: 'Chuẩn bị bài trước khi đến lớp', completed: false },
      { id: 'learn_2', text: 'Tập trung 100% trong giờ học', completed: false },
      { id: 'learn_3', text: 'Ghi chép bài học đầy đủ', completed: false },
      { id: 'learn_4', text: 'Hỏi thầy cô khi không hiểu', completed: false },
      { id: 'learn_5', text: 'Ôn bài ít nhất 30 phút mỗi ngày', completed: false },
    ],
  },
  {
    id: 2,
    title: 'Cảm ơn vì điều nhỏ bé',
    description: 'Thực hành lòng biết ơn hàng ngày',
    icon: 'bi-heart-fill',
    color: '#DDA0DD',
    gradient: 'linear-gradient(135deg, #DDA0DD 0%, #CC8FCC 100%)',
    items: [
      { id: 'thanks_1', text: 'Cảm ơn ba mẹ vì bữa cơm ngon', completed: false },
      { id: 'thanks_2', text: 'Biết ơn thầy cô đã kiên nhẫn dạy', completed: false },
      { id: 'thanks_3', text: 'Trân trọng bạn bè bên cạnh', completed: false },
      { id: 'thanks_4', text: 'Cảm ơn bản thân đã cố gắng', completed: false },
    ],
  },
  {
    id: 3,
    title: '3 ngày thử thách bản thân',
    description: 'Vượt qua giới hạn và khám phá sức mạnh tiềm ẩn',
    icon: 'bi-trophy',
    color: '#FFD93D',
    gradient: 'linear-gradient(135deg, #FFD93D 0%, #F5C400 100%)',
    items: [
      { id: 'challenge_1', text: 'Ngày 1: Chào hỏi 5 người bạn mới', completed: false },
      { id: 'challenge_2', text: 'Ngày 1: Viết 3 điều tự hào về bản thân', completed: false },
      { id: 'challenge_3', text: 'Ngày 2: Giúp đỡ một bạn trong lớp', completed: false },
      { id: 'challenge_4', text: 'Ngày 2: Học một kỹ năng mới', completed: false },
      { id: 'challenge_5', text: 'Ngày 3: Chia sẻ cảm xúc với người tin tưởng', completed: false },
      { id: 'challenge_6', text: 'Ngày 3: Viết thư cảm ơn một người', completed: false },
    ],
  },
];

// ===========================
// Helper Functions
// ===========================
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const generateMatchingCards = (datasetIndex: number): { valueCards: MatchingCard[]; actionCards: MatchingCard[] } => {
  const dataset = MATCHING_DATASETS[datasetIndex];
  
  const valueCards: MatchingCard[] = shuffleArray(dataset.values.map((v, idx) => ({
    id: `value_${idx}`,
    type: 'value' as const,
    valueKey: v.valueKey,
    text: v.text,
    emoji: v.emoji,
    color: v.color,
  })));
  
  const actionCards: MatchingCard[] = shuffleArray(dataset.actions.map((a, idx) => ({
    id: `action_${idx}`,
    type: 'action' as const,
    valueKey: a.valueKey,
    text: a.text,
    emoji: a.emoji,
    color: a.color,
  })));
  
  return { valueCards, actionCards };
};

// ===========================
// Main Component
// ===========================
const GraceLibrary = () => {
  // Tab State
  const [activeTab, setActiveTab] = useState<'modules' | 'game' | 'checklist'>('modules');
  
  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<{
    type: 'module' | 'video' | 'checklist';
    data: ModuleCard | ChecklistGroup | null;
  }>({ type: 'module', data: null });
  
  // Matching Game States
  const [currentDataset, setCurrentDataset] = useState(0);
  const [valueCards, setValueCards] = useState<MatchingCard[]>([]);
  const [actionCards, setActionCards] = useState<MatchingCard[]>([]);
  const [selectedValue, setSelectedValue] = useState<MatchingCard | null>(null);
  const [selectedAction, setSelectedAction] = useState<MatchingCard | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [shakeCard, setShakeCard] = useState<string | null>(null);
  const [showFireworks, setShowFireworks] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  
  // Checklist States
  const [checklists, setChecklists] = useState<ChecklistGroup[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [newItemText, setNewItemText] = useState<{ [groupId: number]: string }>({});
  
  // Milestone & Badge States
  const [milestones, setMilestones] = useState<MilestoneState>({});
  const [earnedBadge, setEarnedBadge] = useState<Badge | null>(null);
  const [fireworksMessage, setFireworksMessage] = useState('');
  const [globalCompleted, setGlobalCompleted] = useState(false);
  
  // Modal States for Reset Confirmation
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  // Suppress unused variable warning
  void currentDataset;
  
  // ===========================
  // Initialize
  // ===========================
  useEffect(() => {
    // Load checklists from localStorage
    const loadChecklists = () => {
      try {
        const stored = localStorage.getItem(CHECKLIST_STORAGE_KEY);
        if (stored) {
          setChecklists(JSON.parse(stored));
        } else {
          setChecklists(DEFAULT_CHECKLISTS);
          localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(DEFAULT_CHECKLISTS));
        }
      } catch {
        setChecklists(DEFAULT_CHECKLISTS);
      }
    };
    
    // Load milestones from localStorage
    const loadMilestones = () => {
      try {
        const stored = localStorage.getItem(MILESTONE_STORAGE_KEY);
        if (stored) {
          setMilestones(JSON.parse(stored));
        }
      } catch {
        setMilestones({});
      }
    };
    
    // Load badge from localStorage
    const loadBadge = () => {
      try {
        const stored = localStorage.getItem(BADGE_STORAGE_KEY);
        if (stored) {
          setEarnedBadge(JSON.parse(stored));
        }
      } catch {
        setEarnedBadge(null);
      }
    };
    
    // Load global completion status
    const loadGlobalCompletion = () => {
      try {
        const stored = localStorage.getItem(GLOBAL_COMPLETION_KEY);
        if (stored) {
          setGlobalCompleted(JSON.parse(stored));
        }
      } catch {
        setGlobalCompleted(false);
      }
    };
    
    loadChecklists();
    loadMilestones();
    loadBadge();
    loadGlobalCompletion();
    initializeGame();
  }, []);
  
  // Initialize Matching Game
  const initializeGame = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * MATCHING_DATASETS.length);
    setCurrentDataset(randomIndex);
    const { valueCards: vc, actionCards: ac } = generateMatchingCards(randomIndex);
    setValueCards(vc);
    setActionCards(ac);
    setSelectedValue(null);
    setSelectedAction(null);
    setMatchedPairs([]);
    setGameCompleted(false);
  }, []);
  
  // Save checklists to localStorage
  const saveChecklists = useCallback((updatedChecklists: ChecklistGroup[]) => {
    setChecklists(updatedChecklists);
    localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(updatedChecklists));
  }, []);
  
  // Save milestones to localStorage
  const saveMilestones = useCallback((updatedMilestones: MilestoneState) => {
    setMilestones(updatedMilestones);
    localStorage.setItem(MILESTONE_STORAGE_KEY, JSON.stringify(updatedMilestones));
  }, []);
  
  // Save badge to localStorage
  const saveBadge = useCallback((badge: Badge | null) => {
    setEarnedBadge(badge);
    if (badge) {
      localStorage.setItem(BADGE_STORAGE_KEY, JSON.stringify(badge));
    } else {
      localStorage.removeItem(BADGE_STORAGE_KEY);
    }
  }, []);
  
  // Save medal to localStorage (stores all earned medals)
  const saveMedalToStorage = useCallback((medal: Badge & { checklistId: number; checklistTitle: string; earnedAt: string }) => {
    try {
      const stored = localStorage.getItem(MEDALS_STORAGE_KEY);
      const medals = stored ? JSON.parse(stored) : [];
      // Check if medal for this checklist already exists
      const existingIndex = medals.findIndex((m: { checklistId: number }) => m.checklistId === medal.checklistId);
      if (existingIndex === -1) {
        medals.push(medal);
        localStorage.setItem(MEDALS_STORAGE_KEY, JSON.stringify(medals));
      }
    } catch {
      localStorage.setItem(MEDALS_STORAGE_KEY, JSON.stringify([medal]));
    }
  }, []);
  
  // Award random badge
  const awardRandomBadge = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * BADGES.length);
    const badge = BADGES[randomIndex];
    saveBadge(badge);
    return badge;
  }, [saveBadge]);
  
  // Check milestone progress and trigger fireworks
  const checkMilestones = useCallback((updatedChecklists: ChecklistGroup[], currentMilestones: MilestoneState) => {
    let newMilestones = { ...currentMilestones };
    let shouldTriggerFireworks = false;
    let message = '';
    
    // Check each checklist for milestones
    for (const group of updatedChecklists) {
      const completed = group.items.filter(item => item.completed).length;
      const total = group.items.length;
      const percentage = total > 0 ? (completed / total) * 100 : 0;
      
      const groupMilestone = newMilestones[group.id] || { reached50: false, reached100: false };
      
      // Track 50% milestone progress (no fireworks)
      if (percentage >= 50 && !groupMilestone.reached50) {
        groupMilestone.reached50 = true;
      }
      
      // Check 100% milestone - only show fireworks when fully complete
      if (percentage === 100 && !groupMilestone.reached100) {
        groupMilestone.reached100 = true;
        shouldTriggerFireworks = true;
        message = 'Chúc mừng bạn đã hoàn thành checklist!';
        // Award medal for completing a checklist
        const randomIndex = Math.floor(Math.random() * BADGES.length);
        const newMedal = { ...BADGES[randomIndex], checklistId: group.id, checklistTitle: group.title, earnedAt: new Date().toISOString() };
        saveMedalToStorage(newMedal);
      }
      
      newMilestones[group.id] = groupMilestone;
    }
    
    // Check if all checklists are 100% complete
    const allCompleted = updatedChecklists.every(group => {
      const completed = group.items.filter(item => item.completed).length;
      const total = group.items.length;
      return total > 0 && completed === total;
    });
    
    if (allCompleted && !globalCompleted && updatedChecklists.length > 0) {
      setGlobalCompleted(true);
      localStorage.setItem(GLOBAL_COMPLETION_KEY, JSON.stringify(true));
      shouldTriggerFireworks = true;
      message = 'Bạn đã hoàn thành tất cả checklist! Bạn thật tuyệt vời!';
      // Award badge
      if (!earnedBadge) {
        awardRandomBadge();
      }
    }
    
    if (shouldTriggerFireworks) {
      setFireworksMessage(message);
      setShowFireworks(true);
      saveMilestones(newMilestones);
    }
    
    return newMilestones;
  }, [globalCompleted, earnedBadge, awardRandomBadge, saveMilestones, saveMedalToStorage]);
  
  // ===========================
  // Modal Handlers
  // ===========================
  const openModuleModal = (card: ModuleCard) => {
    setModalContent({ type: card.hasVideo ? 'video' : 'module', data: card });
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };
  
  const closeModal = () => {
    setShowModal(false);
    setModalContent({ type: 'module', data: null });
    document.body.style.overflow = 'unset';
  };
  
  // ===========================
  // Matching Game Handlers
  // ===========================
  const handleValueCardClick = (card: MatchingCard) => {
    if (matchedPairs.includes(card.valueKey)) return;
    setSelectedValue(card);
    
    if (selectedAction) {
      checkMatch(card, selectedAction);
    }
  };
  
  const handleActionCardClick = (card: MatchingCard) => {
    if (matchedPairs.includes(card.valueKey)) return;
    setSelectedAction(card);
    
    if (selectedValue) {
      checkMatch(selectedValue, card);
    }
  };
  
  const checkMatch = (value: MatchingCard, action: MatchingCard) => {
    if (value.valueKey === action.valueKey) {
      // Correct match
      const newMatchedPairs = [...matchedPairs, value.valueKey];
      setMatchedPairs(newMatchedPairs);
      setSelectedValue(null);
      setSelectedAction(null);
      
      // Check if game completed
      if (newMatchedPairs.length === 5) {
        setGameCompleted(true);
        setShowFireworks(true);
      }
    } else {
      // Incorrect match - shake animation
      setShakeCard(value.id);
      setTimeout(() => {
        setShakeCard(action.id);
      }, 100);
      
      setTimeout(() => {
        setShakeCard(null);
        setSelectedValue(null);
        setSelectedAction(null);
      }, 500);
    }
  };
  
  const resetGame = () => {
    initializeGame();
    setShowFireworks(false);
  };
  
  // ===========================
  // Checklist Handlers
  // ===========================
  const handleToggleItem = (groupId: number, itemId: string) => {
    const updated = checklists.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          items: group.items.map(item => 
            item.id === itemId ? { ...item, completed: !item.completed } : item
          ),
        };
      }
      return group;
    });
    saveChecklists(updated);
    // Check milestones after toggle
    checkMilestones(updated, milestones);
  };
  
  const handleAddItem = (groupId: number) => {
    const text = newItemText[groupId]?.trim();
    if (!text) return;
    
    const updated = checklists.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          items: [
            ...group.items,
            { id: `item_${Date.now()}`, text, completed: false },
          ],
        };
      }
      return group;
    });
    saveChecklists(updated);
    setNewItemText({ ...newItemText, [groupId]: '' });
  };
  
  const handleDeleteItem = (groupId: number, itemId: string) => {
    const updated = checklists.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          items: group.items.filter(item => item.id !== itemId),
        };
      }
      return group;
    });
    saveChecklists(updated);
  };
  
  const handleEditItem = (groupId: number, itemId: string) => {
    const updated = checklists.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          items: group.items.map(item =>
            item.id === itemId ? { ...item, text: editingText } : item
          ),
        };
      }
      return group;
    });
    saveChecklists(updated);
    setEditingItemId(null);
    setEditingText('');
  };
  
  const startEditing = (itemId: string, text: string) => {
    setEditingItemId(itemId);
    setEditingText(text);
  };
  
  // Calculate progress for a checklist group
  const calculateProgress = (items: ChecklistItem[]) => {
    const completed = items.filter(item => item.completed).length;
    const total = items.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    return { completed, total, percentage };
  };
  
  // Get progress bar color based on percentage
  const getProgressColor = (percentage: number): string => {
    if (percentage === 100) return 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
    if (percentage >= 50) return 'linear-gradient(135deg, #17a2b8 0%, #4fc3f7 100%)';
    return 'linear-gradient(135deg, #ffc107 0%, #ffca28 100%)';
  };
  
  // Handle reset all checklists
  const handleResetAll = () => {
    // Reset checklists to default
    setChecklists(DEFAULT_CHECKLISTS);
    localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(DEFAULT_CHECKLISTS));
    
    // Reset milestones
    setMilestones({});
    localStorage.removeItem(MILESTONE_STORAGE_KEY);
    
    // Reset badge
    setEarnedBadge(null);
    localStorage.removeItem(BADGE_STORAGE_KEY);
    
    // Reset medals
    localStorage.removeItem(MEDALS_STORAGE_KEY);
    
    // Reset global completion
    setGlobalCompleted(false);
    localStorage.removeItem(GLOBAL_COMPLETION_KEY);
    
    // Close confirmation modal
    setShowResetConfirm(false);
  };
  
  // Close reset confirmation modal
  const closeResetConfirm = () => {
    setShowResetConfirm(false);
  };
  
  // ===========================
  // Computed Values
  // ===========================
  const allModuleCards = useMemo(() => [...MODULE_CARDS], []);
  const allVideoCards = useMemo(() => [...VIDEO_CARDS], []);
  
  // ===========================
  // Render
  // ===========================
  return (
    <div className="grace-library-container">
      {/* Fireworks Effect */}
      <FireworksEffect
        show={showFireworks}
        message={fireworksMessage || 'Chúc mừng bạn đã hoàn thành thử thách!'}
        onComplete={() => setShowFireworks(false)}
        duration={4000}
      />
      
      {/* Badge Display - Persistent across all tabs */}
      {earnedBadge && (
        <div className="badge-earned-banner">
          <div className="container">
            <div className="badge-earned-content">
              <span className="badge-icon-large">{earnedBadge.icon}</span>
              <div className="badge-info">
                <span className="badge-label">Huy hiệu của bạn:</span>
                <span className="badge-name">{earnedBadge.name}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
              Khám phá các hoạt động phát triển bản thân và rèn luyện giá trị GRACE
            </p>
          </div>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="container">
        <div className="library-tabs">
          <button
            className={`library-tab ${activeTab === 'modules' ? 'active' : ''}`}
            onClick={() => setActiveTab('modules')}
          >
            <i className="bi bi-book me-2"></i>
            Module Học tập GRACE
          </button>
          <button
            className={`library-tab ${activeTab === 'game' ? 'active' : ''}`}
            onClick={() => setActiveTab('game')}
          >
            <i className="bi bi-puzzle me-2"></i>
            Value Cards
          </button>
          <button
            className={`library-tab ${activeTab === 'checklist' ? 'active' : ''}`}
            onClick={() => setActiveTab('checklist')}
          >
            <i className="bi bi-check2-square me-2"></i>
            Checklist phát triển
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content-wrapper">
        {/* ======================== */}
        {/* TAB 1: Module Học tập GRACE */}
        {/* ======================== */}
        {activeTab === 'modules' && (
          <div className="container py-4 tab-panel">
            {/* Section 1: Cards without video */}
            <div className="section-header mb-4">
              <h2 className="section-title">
                <i className="bi bi-journal-richtext me-2"></i>
                Tài liệu học tập
              </h2>
              <p className="section-description">Khám phá các bài học và hướng dẫn phát triển bản thân</p>
            </div>
            
            <div className="row g-4 mb-5">
              {allModuleCards.map(card => (
                <div className="col-12 col-md-6 col-lg-4" key={card.id}>
                  <div 
                    className="module-card"
                    style={{ '--card-color': card.color } as React.CSSProperties}
                    onClick={() => openModuleModal(card)}
                  >
                    <div className="card-decoration" style={{ background: card.gradient }}></div>
                    <div className="card-icon-wrapper" style={{ background: card.gradient }}>
                      <i className={`bi ${card.icon}`}></i>
                    </div>
                    <div className="card-content">
                      <h3 className="card-title">{card.title}</h3>
                      <p className="card-description">{card.description}</p>
                      <div className="card-action">
                        <span>Xem chi tiết</span>
                        <i className="bi bi-arrow-right"></i>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Section 2: Cards with video */}
            <div className="section-header mb-4">
              <h2 className="section-title">
                <i className="bi bi-play-circle me-2"></i>
                Video bài giảng
              </h2>
              <p className="section-description">Xem các video giới thiệu về GRACE và bài học thực tế</p>
            </div>
            
            <div className="row g-4">
              {allVideoCards.map(card => (
                <div className="col-12 col-md-6 col-lg-4" key={card.id}>
                  <div 
                    className="video-card"
                    style={{ '--card-color': card.color } as React.CSSProperties}
                    onClick={() => openModuleModal(card)}
                  >
                    <div className="video-thumbnail">
                      <img src={card.thumbnail} alt={card.title} />
                      <div className="play-overlay">
                        <i className="bi bi-play-circle-fill"></i>
                      </div>
                    </div>
                    <div className="video-info">
                      <h3 className="video-title">{card.title}</h3>
                      <p className="video-description">{card.description}</p>
                      <div className="video-action">
                        <i className="bi bi-play-fill me-1"></i>
                        Phát video
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================== */}
        {/* TAB 2: Value Cards Game */}
        {/* ======================== */}
        {activeTab === 'game' && (
          <div className="container py-4 tab-panel">
            <div className="game-container">
              <div className="game-header text-center mb-4">
                <h2 className="game-title">
                  <i className="bi bi-puzzle me-2"></i>
                  Trò chơi ghép thẻ GRACE
                </h2>
                <p className="game-description">
                  Ghép mỗi giá trị GRACE với hành động tương ứng
                </p>
              </div>
              
              {/* Game Board */}
              <div className="game-board">
                {/* Row 1: Value Cards */}
                <div className="cards-row values-row">
                  <h4 className="row-label">
                    <i className="bi bi-star-fill me-2"></i>
                    Giá trị GRACE
                  </h4>
                  <div className="cards-container">
                    {valueCards.map(card => (
                      <button
                        key={card.id}
                        className={`game-card value-card ${
                          selectedValue?.id === card.id ? 'selected' : ''
                        } ${matchedPairs.includes(card.valueKey) ? 'matched' : ''} ${
                          shakeCard === card.id ? 'shake' : ''
                        }`}
                        style={{ '--card-color': card.color } as React.CSSProperties}
                        onClick={() => handleValueCardClick(card)}
                        disabled={matchedPairs.includes(card.valueKey)}
                      >
                        <span className="card-emoji">{card.emoji}</span>
                        <span className="card-text">{card.text}</span>
                        {matchedPairs.includes(card.valueKey) && (
                          <span className="match-check">
                            <i className="bi bi-check-circle-fill"></i>
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Row 2: Action Cards */}
                <div className="cards-row actions-row">
                  <h4 className="row-label">
                    <i className="bi bi-lightning-fill me-2"></i>
                    Hành động tương ứng
                  </h4>
                  <div className="cards-container">
                    {actionCards.map(card => (
                      <button
                        key={card.id}
                        className={`game-card action-card ${
                          selectedAction?.id === card.id ? 'selected' : ''
                        } ${matchedPairs.includes(card.valueKey) ? 'matched' : ''} ${
                          shakeCard === card.id ? 'shake' : ''
                        }`}
                        style={{ '--card-color': card.color } as React.CSSProperties}
                        onClick={() => handleActionCardClick(card)}
                        disabled={matchedPairs.includes(card.valueKey)}
                      >
                        <span className="card-emoji">{card.emoji}</span>
                        <span className="card-text">{card.text}</span>
                        {matchedPairs.includes(card.valueKey) && (
                          <span className="match-check">
                            <i className="bi bi-check-circle-fill"></i>
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Game Progress */}
              <div className="game-progress">
                <div className="progress-info">
                  <span>Tiến độ: {matchedPairs.length} / 5</span>
                  <ProgressBar
                    progress={(matchedPairs.length / 5) * 100}
                    completedTasks={matchedPairs.length}
                    totalTasks={5}
                    gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    height="10px"
                    showText={false}
                  />
                </div>
              </div>
              
              {/* Completion Message */}
              {gameCompleted && (
                <div className="game-completed">
                  <div className="completion-icon">🎉</div>
                  <h3>Chúc mừng bạn đã hoàn thành thử thách!</h3>
                  <p>Bạn đã ghép đúng tất cả các thẻ GRACE</p>
                </div>
              )}
              
              {/* Reset Button */}
              <div className="game-actions text-center mt-4">
                <button className="btn-reset-game" onClick={resetGame}>
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Chơi lại
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================== */}
        {/* TAB 3: Checklist phát triển bản thân */}
        {/* ======================== */}
        {activeTab === 'checklist' && (
          <div className="container py-4 tab-panel">
            {/* Badge Display at top of Tab 3 */}
            {earnedBadge && (
              <div className="badge-tab-display mb-4">
                <div className="badge-tab-content">
                  <span className="badge-icon-display">{earnedBadge.icon}</span>
                  <div className="badge-text-wrapper">
                    <span className="badge-display-label">Huy hiệu của bạn</span>
                    <span className="badge-display-name">{earnedBadge.name}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="section-header mb-4">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                <div className="text-center text-md-start">
                  <h2 className="section-title mb-1">
                    <i className="bi bi-check2-square me-2"></i>
                    Checklist phát triển bản thân
                  </h2>
                  <p className="section-description mb-0">Theo dõi tiến độ rèn luyện hàng ngày của bạn</p>
                </div>
                <button 
                  className="btn-reset-checklist"
                  onClick={() => setShowResetConfirm(true)}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Reset toàn bộ checklist
                </button>
              </div>
            </div>
            
            <div className="row g-4">
              {checklists.map(group => {
                const progress = calculateProgress(group.items);
                const progressColor = getProgressColor(progress.percentage);
                return (
                  <div className="col-12 col-md-6 col-lg-4" key={group.id}>
                    <div 
                      className="checklist-card"
                      style={{ '--card-color': group.color } as React.CSSProperties}
                    >
                      <div className="card-decoration" style={{ background: group.gradient }}></div>
                      <div className="checklist-header">
                        <div className="checklist-icon" style={{ background: group.gradient }}>
                          <i className={`bi ${group.icon}`}></i>
                        </div>
                        <div className="checklist-info">
                          <h3 className="checklist-title">{group.title}</h3>
                          <p className="checklist-desc">{group.description}</p>
                        </div>
                      </div>
                      
                      <div className="checklist-progress mb-3">
                        <div className="d-flex justify-content-between mb-2">
                          <span className="progress-text">
                            Tiến độ: {Math.round(progress.percentage)}%
                          </span>
                          <span className={`progress-status ${
                            progress.percentage === 100 ? 'status-complete' : 
                            progress.percentage >= 50 ? 'status-progress' : 'status-warning'
                          }`}>
                            {progress.percentage === 100 ? 'Hoàn thành!' : 
                             progress.percentage >= 50 ? 'Đang tiến bộ' : 'Tiếp tục nào!'}
                          </span>
                        </div>
                        <ProgressBar
                          progress={progress.percentage}
                          completedTasks={progress.completed}
                          totalTasks={progress.total}
                          gradient={progressColor}
                          height="10px"
                          showText={false}
                        />
                        <div className="progress-count mt-1">
                          <small className="text-muted">{progress.completed} / {progress.total} mục</small>
                        </div>
                      </div>
                      
                      <div className="checklist-items">
                        {group.items.map(item => (
                          <div 
                            key={item.id}
                            className={`checklist-item ${item.completed ? 'completed' : ''}`}
                          >
                            {editingItemId === item.id ? (
                              <div className="edit-item-wrapper">
                                <input
                                  type="text"
                                  className="edit-input"
                                  value={editingText}
                                  onChange={(e) => setEditingText(e.target.value)}
                                  autoFocus
                                />
                                <button 
                                  className="btn-save-edit"
                                  onClick={() => handleEditItem(group.id, item.id)}
                                >
                                  <i className="bi bi-check"></i>
                                </button>
                                <button 
                                  className="btn-cancel-edit"
                                  onClick={() => {
                                    setEditingItemId(null);
                                    setEditingText('');
                                  }}
                                >
                                  <i className="bi bi-x"></i>
                                </button>
                              </div>
                            ) : (
                              <>
                                <label className="item-checkbox">
                                  <input
                                    type="checkbox"
                                    checked={item.completed}
                                    onChange={() => handleToggleItem(group.id, item.id)}
                                  />
                                  <span className="checkmark"></span>
                                  <span className="item-text">{item.text}</span>
                                </label>
                                <div className="item-actions">
                                  <button 
                                    className="btn-edit"
                                    onClick={() => startEditing(item.id, item.text)}
                                    title="Chỉnh sửa"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </button>
                                  <button 
                                    className="btn-delete"
                                    onClick={() => handleDeleteItem(group.id, item.id)}
                                    title="Xóa"
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Add new item */}
                      <div className="add-item-wrapper">
                        <input
                          type="text"
                          className="add-input"
                          placeholder="Thêm mục mới..."
                          value={newItemText[group.id] || ''}
                          onChange={(e) => setNewItemText({ ...newItemText, [group.id]: e.target.value })}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddItem(group.id)}
                        />
                        <button 
                          className="btn-add-item"
                          onClick={() => handleAddItem(group.id)}
                        >
                          <i className="bi bi-plus-lg"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* ======================== */}
      {/* Modal */}
      {/* ======================== */}
      {showModal && modalContent.data && (
        <div className="library-modal-overlay" onClick={closeModal}>
          <div className="library-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              <i className="bi bi-x-lg"></i>
            </button>
            
            {modalContent.type === 'video' && (
              <div className="modal-video-content">
                <div className="video-wrapper">
                  <iframe
                    src={(modalContent.data as ModuleCard).videoUrl}
                    title={(modalContent.data as ModuleCard).title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="modal-info">
                  <h3 className="modal-title">{(modalContent.data as ModuleCard).title}</h3>
                  <p className="modal-description">{(modalContent.data as ModuleCard).description}</p>
                </div>
              </div>
            )}
            
            {modalContent.type === 'module' && (
              <div className="modal-module-content">
                <div 
                  className="modal-header-gradient"
                  style={{ background: (modalContent.data as ModuleCard).gradient }}
                >
                  <div className="modal-icon">
                    <i className={`bi ${(modalContent.data as ModuleCard).icon}`}></i>
                  </div>
                  <h3 className="modal-title">{(modalContent.data as ModuleCard).title}</h3>
                  <p className="modal-description">{(modalContent.data as ModuleCard).description}</p>
                </div>
                <div className="modal-body">
                  <ul className="content-list">
                    {(modalContent.data as ModuleCard).content.map((item, idx) => (
                      <li key={idx} className="content-item">
                        <span className="item-bullet" style={{ background: (modalContent.data as ModuleCard).gradient }}>
                          {idx + 1}
                        </span>
                        <span className="item-content">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="reset-modal-overlay" onClick={closeResetConfirm}>
          <div className="reset-modal" onClick={(e) => e.stopPropagation()}>
            <div className="reset-modal-icon">
              <i className="bi bi-exclamation-triangle"></i>
            </div>
            <h3 className="reset-modal-title">Xác nhận Reset</h3>
            <p className="reset-modal-text">
              Bạn có chắc muốn reset toàn bộ checklist? Tất cả tiến độ, huy hiệu và thành tích sẽ bị xóa.
            </p>
            <div className="reset-modal-actions">
              <button className="btn-confirm-reset" onClick={handleResetAll}>
                <i className="bi bi-check-lg me-2"></i>
                Xác nhận
              </button>
              <button className="btn-cancel-reset" onClick={closeResetConfirm}>
                <i className="bi bi-x-lg me-2"></i>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraceLibrary;
