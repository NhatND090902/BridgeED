import gratitudeImg from "../assets/images/gratitude.png";
import respectImg from "../assets/images/respect.png";
import accountabilityImg from "../assets/images/accountability.png";
import successImg from "../assets/images/success.png";
import publicRelationImg from "../assets/images/public-relation.png";

export const CheckList = [
  {
    id: 1,
    title: "Checklist cam kết học tập",
    description: "Xây dựng thói quen học tập tích cực và có trách nhiệm",
    icon: "bi-clipboard-check",
    color: "#4ECDC4",
    gradient: "linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)",
    items: [
      {
        id: "learn_1",
        text: "Chuẩn bị bài trước khi đến lớp",
        completed: false,
      },
      { id: "learn_2", text: "Tập trung 100% trong giờ học", completed: false },
      { id: "learn_3", text: "Ghi chép bài học đầy đủ", completed: false },
      { id: "learn_4", text: "Hỏi thầy cô khi không hiểu", completed: false },
      {
        id: "learn_5",
        text: "Ôn bài ít nhất 30 phút mỗi ngày",
        completed: false,
      },
    ],
  },
  {
    id: 2,
    title: "Cảm ơn vì điều nhỏ bé",
    description: "Thực hành lòng biết ơn hàng ngày",
    icon: "bi-heart-fill",
    color: "#DDA0DD",
    gradient: "linear-gradient(135deg, #DDA0DD 0%, #CC8FCC 100%)",
    items: [
      {
        id: "thanks_1",
        text: "Cảm ơn ba mẹ vì bữa cơm ngon",
        completed: false,
      },
      {
        id: "thanks_2",
        text: "Biết ơn thầy cô đã kiên nhẫn dạy",
        completed: false,
      },
      { id: "thanks_3", text: "Trân trọng bạn bè bên cạnh", completed: false },
      { id: "thanks_4", text: "Cảm ơn bản thân đã cố gắng", completed: false },
    ],
  },
  {
    id: 3,
    title: "3 ngày thử thách bản thân",
    description: "Vượt qua giới hạn và khám phá sức mạnh tiềm ẩn",
    icon: "bi-trophy",
    color: "#FFD93D",
    gradient: "linear-gradient(135deg, #FFD93D 0%, #F5C400 100%)",
    items: [
      {
        id: "challenge_1",
        text: "Ngày 1: Chào hỏi 5 người bạn mới",
        completed: false,
      },
      {
        id: "challenge_2",
        text: "Ngày 1: Viết 3 điều tự hào về bản thân",
        completed: false,
      },
      {
        id: "challenge_3",
        text: "Ngày 2: Giúp đỡ một bạn trong lớp",
        completed: false,
      },
      {
        id: "challenge_4",
        text: "Ngày 2: Học một kỹ năng mới",
        completed: false,
      },
      {
        id: "challenge_5",
        text: "Ngày 3: Chia sẻ cảm xúc với người tin tưởng",
        completed: false,
      },
      {
        id: "challenge_6",
        text: "Ngày 3: Viết thư cảm ơn một người",
        completed: false,
      },
    ],
  },
];

export const ScenarioCard = [
  {
    id: "scenario_1",
    text: "Bạn Hoa giúp bạn hoàn thành nhiệm vụ mà cô giáo giao. Bạn sẽ làm gì?",
    frameColor: "#5B8C51",
  },
  {
    id: "scenario_2",
    text: "Bạn sẽ làm gì nếu người khác có quan điểm khác rõ rệt với bạn?",
    frameColor: "#7cea66",
  },
  {
    id: "scenario_3",
    text: "Bạn trễ deadline dẫn đến ảnh hưởng tới cả nhóm. Bạn giải quyết như thế nào?",
    frameColor: "#8B956D",
  },
  {
    id: "scenario_4",
    text: "Bạn phát hiện sai sót nghiêm trọng trong dự án nhưng nhóm không muốn thảo luận. Bạn sẽ làm gì trong trường hợp này?",
    frameColor: "#51848c",
  },
  {
    id: "scenario_5",
    text: "Trong một dự án, An ít nói và không tham gia ý kiến. Nếu bạn là trưởng nhóm của team, bạn sẽ giải quyết như thế nào?",
    frameColor: "#2cc89e",
  },
];

export const  ModuleCard = [
  {
    id: 101,
    title: "Khái niệm GRACE",
    description: "Giới thiệu về 5 giá trị cốt lõi GRACE",
    icon: "bi-play-circle",
    color: "#4ECDC4",
    gradient: "linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)",
    content: [
      "GRACE là viết tắt của 5 giá trị cốt lõi:",
      "🙏 Gratitude - Biết ơn: Trân trọng những điều tốt đẹp trong cuộc sống",
      "🤝 Respect - Tôn trọng: Đối xử tử tế với mọi người xung quanh",
      "✊ Accountability - Trách nhiệm: Chịu trách nhiệm với hành động của mình",
      "🦁 Courage - Dũng cảm: Dám đối mặt với thử thách",
      "💫 Engagement - Gắn kết: Tích cực tham gia các hoạt động cộng đồng",
    ],
    hasVideo: true,
    videoUrl: "https://www.youtube.com/embed/MwcjHFmF5Bk",
    thumbnail: "https://img.youtube.com/vi/MwcjHFmF5Bk/maxresdefault.jpg",
  },
  {
    id: 102,
    title: "Tình huống thực tế",
    description: "Các tình huống áp dụng giá trị GRACE trong đời sống",
    icon: "bi-film",
    color: "#9B59B6",
    gradient: "linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%)",
    content: [
      "Tình huống 1: Khi bạn bè gặp khó khăn trong học tập",
      "Tình huống 2: Khi có xung đột trong nhóm làm việc",
      "Tình huống 3: Khi bị áp lực từ bạn bè",
      "Tình huống 4: Khi mắc lỗi và cần nhận trách nhiệm",
      "Tình huống 5: Khi cần dũng cảm lên tiếng bảo vệ bạn bè",
    ],
    hasVideo: true,
    videoUrl: "https://www.youtube.com/embed/BVPYnoxch9E",
    thumbnail: "https://img.youtube.com/vi/BVPYnoxch9E/maxresdefault.jpg",
  },
  {
    id: 103,
    title: "Bài học thực tế",
    description: "Những bài học rút ra từ việc thực hành GRACE",
    icon: "bi-lightbulb",
    color: "#E74C3C",
    gradient: "linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)",
    content: [
      "Bài học 1: Biết ơn giúp tâm hồn thanh thản",
      "Bài học 2: Tôn trọng tạo nên môi trường hòa thuận",
      "Bài học 3: Trách nhiệm giúp xây dựng lòng tin",
      "Bài học 4: Dũng cảm mở ra cơ hội mới",
      "Bài học 5: Gắn kết tạo nên sức mạnh tập thể",
    ],
    hasVideo: true,
    videoUrl: "https://www.youtube.com/embed/Tk-2RSYnCKk",
    thumbnail: "https://img.youtube.com/vi/Tk-2RSYnCKk/maxresdefault.jpg",
  },
];

export const ValueCard = [
  {
    id: "gratitude",
    name: "Gratitude",
    letter: "G",
    image: gratitudeImg,
    frameColor: "#5B8C51",
  },
  {
    id: "respect",
    name: "Respect",
    letter: "R",
    image: respectImg,
    frameColor: "#7cea66",
  },
  {
    id: "accountability",
    name: "Accountability",
    letter: "A",
    image: accountabilityImg,
    frameColor: "#8B956D",
  },
  {
    id: "courage",
    name: "Courage",
    letter: "C",
    image: successImg,
    frameColor: "#51848c",
  },
  {
    id: "engage",
    name: "Engagement",
    letter: "E",
    image: publicRelationImg,
    frameColor: "#2cc89e",
  },
];

export const Badge = [
  { id: "badge_star", icon: "⭐", name: "Ngôi sao kiên trì" },
  { id: "badge_fire", icon: "🔥", name: "Chiến binh GRACE" },
  { id: "badge_heart", icon: "💖", name: "Trái tim tích cực" },
  { id: "badge_crown", icon: "👑", name: "Nhà lãnh đạo tích cực" },
  { id: "badge_rocket", icon: "🚀", name: "Người bứt phá" },
];

export const ModuleCardNovideo = [
  {
    id: 1,
    title: "Những câu nói truyền cảm hứng",
    description:
      "Những lời động viên giúp bạn vững bước trên con đường phát triển",
    icon: "bi-chat-quote",
    color: "#FF6B6B",
    gradient: "linear-gradient(135deg, #FF6B6B 0%, #EE5A5A 100%)",
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
    title: "6 cách kết nối với bạn bè",
    description: "Xây dựng tình bạn đẹp và môi trường học tập tích cực",
    icon: "bi-people-fill",
    color: "#96CEB4",
    gradient: "linear-gradient(135deg, #96CEB4 0%, #7DBF9E 100%)",
    content: [
      "Viết lời cảm ơn nhỏ cho một bạn trong lớp",
      "Lắng nghe trọn vẹn khi bạn chia sẻ",
      "Nhận lỗi và sửa sai khi làm ảnh hưởng nhóm",
      "Động viên các bạn ít nói cùng tham gia hoạt động",
      "Tổ chức hoạt động giúp cả lớp gắn bó",
      "Chia sẻ, giúp đỡ bạn bè trong trường lớp",
    ],
  },
];