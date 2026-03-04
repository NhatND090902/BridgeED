import { useState, useEffect, useRef } from "react";
import "./AnonymousChat.css";

// Types
interface ChatMessage {
  id: string;
  type: "user" | "system";
  content: string;
  timestamp: number;
}

interface QuestionResponse {
  question: string;
  responses: string[];
}

// Predefined questions and responses in Vietnamese
const PREDEFINED_QA: QuestionResponse[] = [
  {
    question: "Tôi cảm thấy lo lắng, tôi nên làm gì?",
    responses: [
      "Bạn có thể bắt đầu bằng cách hít thở sâu và chú ý đến cơ thể của mình. Lo lắng là cảm xúc bình thường mà ai cũng trải qua.",
      "Hãy thử viết ra điều khiến bạn lo lắng. Đôi khi việc nhìn nhận vấn đề trên giấy giúp bạn hiểu rõ hơn về nó.",
      "Bạn có thể tìm một người bạn tin tưởng để chia sẻ. Đừng ngại tìm kiếm sự hỗ trợ khi cần nhé! 💙",
    ],
  },
  {
    question: "Làm sao để bình tĩnh khi tức giận?",
    responses: [
      "Khi tức giận, hãy dừng lại và đếm từ 1 đến 10 trước khi phản ứng. Điều này giúp não bộ có thời gian xử lý cảm xúc.",
      "Thử rời khỏi tình huống một chút để bình tĩnh lại. Đi bộ, uống nước, hoặc hít thở sâu đều là những cách hiệu quả.",
      "Hãy nhớ rằng tức giận là cảm xúc bình thường, nhưng cách mình phản ứng mới quan trọng. Bạn có thể kiểm soát được! 💪",
    ],
  },
  {
    question: "Tôi cảm thấy không tự tin về bản thân",
    responses: [
      "Tự tin được xây dựng từ từng bước nhỏ. Hãy bắt đầu bằng việc ghi nhận những điều bạn đã làm tốt hôm nay.",
      "Đừng so sánh mình với người khác. Mỗi người có hành trình riêng và bạn đang làm tốt lắm rồi!",
      "Hãy thử thách bản thân với những việc nhỏ mỗi ngày. Mỗi thành công nhỏ sẽ giúp bạn tin tưởng vào khả năng của mình hơn. 🌟",
    ],
  },
  {
    question: "Làm sao để kết nối tốt hơn với bạn bè?",
    responses: [
      "Lắng nghe chân thành là bước đầu tiên. Khi bạn thực sự quan tâm đến người khác, họ sẽ cảm nhận được.",
      "Hãy chủ động mời bạn bè tham gia các hoạt động. Đôi khi chỉ cần hỏi thăm cũng đủ để tạo sự kết nối.",
      "Chia sẻ về bản thân một cách chân thực cũng rất quan trọng. Mối quan hệ tốt được xây dựng trên sự tin tưởng và sẻ chia. 🤝",
    ],
  },
  {
    question: "Tôi cảm thấy áp lực trong học tập",
    responses: [
      "Áp lực học tập là điều rất phổ biến. Hãy chia nhỏ công việc thành những phần dễ quản lý hơn.",
      "Đừng quên nghỉ ngơi! Não bộ cần thời gian để phục hồi. Học 25 phút, nghỉ 5 phút là cách học hiệu quả.",
      "Nếu cảm thấy quá tải, hãy trao đổi với thầy cô hoặc gia đình. Bạn không cần phải đối mặt một mình. 📚",
    ],
  },
  {
    question: "Làm sao để thực hành GRACE mỗi ngày?",
    responses: [
      "GRACE gồm: Biết ơn (Gratitude), Tôn trọng (Respect), Trách nhiệm (Accountability), Dũng cảm (Courage), Dấn thân-Kết nối (Engagement).",
      "Mỗi sáng, hãy dành 2 phút để nghĩ về điều bạn biết ơn. Đây là cách đơn giản để bắt đầu.",
      "Bạn có thể chọn một giá trị GRACE để tập trung mỗi tuần. Ghi lại những khoảnh khắc bạn thực hành thành công nhé! ✨",
    ],
  },
  {
    question: "Tôi nên làm gì khi cảm thấy buồn?",
    responses: [
      "Cảm thấy buồn là điều hoàn toàn bình thường. Hãy cho phép mình được buồn mà không phán xét bản thân.",
      "Thử làm điều gì đó bạn thích: nghe nhạc, vẽ, đi dạo, hoặc nói chuyện với ai đó. Những hoạt động nhỏ có thể giúp nâng cao tinh thần.",
      "Nếu cảm giác buồn kéo dài, đừng ngại tìm kiếm sự hỗ trợ từ người lớn hoặc chuyên gia. Bạn xứng đáng được quan tâm. 💕",
    ],
  },
  {
    question: "Làm sao để hiểu cảm xúc của mình?",
    responses: [
      "Hãy bắt đầu bằng việc đặt tên cho cảm xúc: vui, buồn, lo lắng, tức giận... Việc này giúp bạn nhận biết rõ hơn.",
      "Viết nhật ký cảm xúc là cách tuyệt vời để theo dõi và hiểu mình hơn. Ghi lại cảm xúc mỗi ngày trong vài dòng.",
      "Dành thời gian yên tĩnh để lắng nghe cơ thể và tâm trí. Cảm xúc thường liên kết với những suy nghĩ hoặc sự kiện cụ thể. 🧠",
    ],
  },
  {
    question: "Làm sao để xây dựng lòng biết ơn?",
    responses: [
      "Mỗi tối trước khi ngủ, hãy nghĩ về 3 điều bạn biết ơn trong ngày. Dù nhỏ nhất cũng được!",
      "Viết thư cảm ơn cho ai đó đã giúp bạn. Không cần gửi đi, chỉ cần viết cũng đủ tạo cảm giác tích cực.",
      "Để ý những điều tốt đẹp xung quanh bạn: nụ cười của bạn bè, bữa ăn ngon, hay một ngày nắng đẹp. 🙏",
    ],
  },
  {
    question: "Tôi cảm thấy cô đơn, tôi nên làm gì?",
    responses: [
      "Cô đơn là cảm giác mà nhiều người trải qua. Bạn không đơn độc trong cảm giác này.",
      "Hãy thử tham gia các hoạt động nhóm hoặc câu lạc bộ ở trường. Đây là cách tốt để gặp gỡ những người có chung sở thích.",
      "Đôi khi, việc giúp đỡ người khác cũng giúp bạn cảm thấy kết nối hơn. Một hành động tử tế nhỏ có thể tạo ra sự khác biệt. 🌈",
    ],
  },
  {
    question: "Làm sao để có trách nhiệm hơn?",
    responses: [
      "Bắt đầu với những việc nhỏ: dọn phòng, làm bài tập đúng hạn, giữ lời hứa. Trách nhiệm được xây dựng từ thói quen hàng ngày.",
      "Khi mắc lỗi, hãy thừa nhận và học từ đó thay vì đổ lỗi. Đây là dấu hiệu của sự trưởng thành.",
      "Viết ra các cam kết của bạn và theo dõi tiến độ. Điều này giúp bạn có ý thức hơn về hành động của mình. ✊",
    ],
  },
  {
    question: "Làm sao để dũng cảm hơn?",
    responses: [
      "Dũng cảm không có nghĩa là không sợ, mà là làm điều đúng dù sợ. Hãy bắt đầu với những bước nhỏ.",
      "Thử làm một điều khiến bạn hơi sợ mỗi ngày. Dần dần, vùng an toàn của bạn sẽ mở rộng.",
      "Nhớ rằng thất bại là một phần của hành trình. Mỗi lần thử đều là cơ hội để học hỏi và phát triển. 🦁",
    ],
  },
];

const STORAGE_KEY = "bridged_anonymous_chat";

const AnonymousChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const history: ChatMessage[] = JSON.parse(stored);
        setMessages(history);
      } else {
        // Add welcome message if no history
        addWelcomeMessage();
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      addWelcomeMessage();
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (error) {
        console.error("Error saving chat history:", error);
      }
    }
  }, [messages]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const addWelcomeMessage = () => {
    const welcomeMsg: ChatMessage = {
      id: `welcome-${Date.now()}`,
      type: "system",
      content:
        "Xin chào! Tôi là BridgeED 👋\n\nTôi ở đây để hỗ trợ bạn. Bạn có thể chọn một câu hỏi bên dưới để bắt đầu cuộc trò chuyện.",
      timestamp: Date.now(),
    };
    setMessages([welcomeMsg]);
  };

  const handleQuestionClick = (qa: QuestionResponse) => {
    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: qa.question,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // Show typing indicator
    setIsTyping(true);

    // Simulate typing delay and add system response
    const randomDelay = 800 + Math.random() * 700; // 800-1500ms
    setTimeout(() => {
      setIsTyping(false);

      // Select random response from responses array
      const randomResponse =
        qa.responses[Math.floor(Math.random() * qa.responses.length)];

      const systemMsg: ChatMessage = {
        id: `system-${Date.now()}`,
        type: "system",
        content: randomResponse,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, systemMsg]);
    }, randomDelay);
  };

  const handleClearChat = () => {
    localStorage.removeItem(STORAGE_KEY);
    addWelcomeMessage();
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="anonymous-chat-page">
      <div className="container py-4">
        {/* Header */}
        <div className="chat-header text-center mb-4">
          <div className="header-icon-wrapper">
            <i className="bi bi-chat-heart-fill"></i>
          </div>
          <h1 className="fw-bold mb-2">Chat Ẩn Danh</h1>
          <p className="text-muted mb-0">
            Một không gian an toàn để chia sẻ và nhận hỗ trợ
          </p>
        </div>

        <div className="row g-4">
          {/* Chat Area */}
          <div className="col-12 col-lg-8">
            <div className="chat-card">
              {/* Chat Header */}
              <div className="chat-card-header">
                <div className="chat-header-left">
                  <div className="bot-avatar">
                    <i className="bi bi-robot"></i>
                  </div>
                  <div className="bot-info">
                    <span className="bot-name">BridgeED</span>
                    <span className="bot-status">
                      <span className="status-dot"></span>
                      Sẵn sàng hỗ trợ
                    </span>
                  </div>
                </div>
                <button className="clear-chat-btn" onClick={handleClearChat}>
                  <i className="bi bi-arrow-counterclockwise me-1"></i>
                  Làm mới
                </button>
              </div>

              {/* Chat Messages */}
              <div className="chat-messages" ref={chatContainerRef}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message-wrapper ${msg.type === "user" ? "user" : "system"}`}
                  >
                    {msg.type === "system" && (
                      <div className="message-avatar">
                        <i className="bi bi-robot"></i>
                      </div>
                    )}
                    <div className="message-bubble">
                      <p className="message-content">{msg.content}</p>
                      <span className="message-time">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    {msg.type === "user" && (
                      <div className="message-avatar user-avatar">
                        <i className="bi bi-person-fill"></i>
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="message-wrapper system">
                    <div className="message-avatar">
                      <i className="bi bi-robot"></i>
                    </div>
                    <div className="typing-indicator">
                      <span className="typing-text">BridgeED đang trả lời</span>
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Questions Input Area */}
              <div className="chat-input-area">
                <p className="input-hint">
                  <i className="bi bi-hand-index me-2"></i>
                  Chọn một câu hỏi bên dưới để bắt đầu
                </p>
              </div>
            </div>
          </div>

          {/* Questions Sidebar */}
          <div className="col-12 col-lg-4">
            <div className="questions-card">
              <div className="questions-header">
                <i className="bi bi-chat-left-quote-fill me-2"></i>
                <span>Câu hỏi gợi ý</span>
              </div>
              <div className="questions-list">
                {PREDEFINED_QA.map((qa, index) => (
                  <button
                    key={index}
                    className="question-btn"
                    onClick={() => handleQuestionClick(qa)}
                    disabled={isTyping}
                  >
                    <span className="question-text">{qa.question}</span>
                    <i className="bi bi-arrow-right-circle question-icon"></i>
                  </button>
                ))}
              </div>
            </div>

            {/* Info Card */}
            <div className="info-card mt-4">
              <div className="info-icon">
                <i className="bi bi-shield-check"></i>
              </div>
              <div className="info-content">
                <h6 className="info-title">Bảo mật hoàn toàn</h6>
                <p className="info-text">
                  Cuộc trò chuyện của bạn được bảo mật. Không có thông tin cá
                  nhân nào được thu thập hoặc chia sẻ.
                </p>
              </div>
            </div>

            {/* GRACE Values Card */}
            <div className="grace-card mt-4">
              <h6 className="grace-title">
                <i className="bi bi-flower1 me-2"></i>
                Giá trị GRACE
              </h6>
              <div className="grace-values">
                <div className="grace-value">
                  <span className="grace-emoji">🙏</span>
                  <span className="grace-label">Biết ơn</span>
                </div>
                <div className="grace-value">
                  <span className="grace-emoji">🤝</span>
                  <span className="grace-label">Tôn trọng</span>
                </div>
                <div className="grace-value">
                  <span className="grace-emoji">✊</span>
                  <span className="grace-label">Trách nhiệm</span>
                </div>
                <div className="grace-value">
                  <span className="grace-emoji">🦁</span>
                  <span className="grace-label">Dũng cảm</span>
                </div>
                <div className="grace-value">
                  <span className="grace-emoji">💫</span>
                  <span className="grace-label">Dấn thân-Kết nối</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnonymousChat;
