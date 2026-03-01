import { useState } from 'react';

const AnonymousChat = () => {
  const [message, setMessage] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('general');

  const rooms = [
    { id: 'general', name: 'General Support', icon: 'bi-chat-heart', online: 24 },
    { id: 'anxiety', name: 'Anxiety Support', icon: 'bi-cloud', online: 12 },
    { id: 'stress', name: 'Stress Relief', icon: 'bi-sun', online: 18 },
    { id: 'relationships', name: 'Relationships', icon: 'bi-people', online: 8 },
    { id: 'wellness', name: 'Wellness Tips', icon: 'bi-flower1', online: 15 },
  ];

  const sampleMessages = [
    {
      id: 1,
      user: 'Anonymous#4521',
      message: 'Having a tough day, but trying to stay positive.',
      time: '2 min ago',
      isOwn: false,
    },
    {
      id: 2,
      user: 'Anonymous#7832',
      message: 'You got this! Remember, every storm passes. 💙',
      time: '1 min ago',
      isOwn: false,
    },
    {
      id: 3,
      user: 'You',
      message: 'Thanks for the support everyone!',
      time: 'Just now',
      isOwn: true,
    },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      alert('Message sent: ' + message);
      setMessage('');
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row g-4">
        {/* Sidebar - Rooms */}
        <div className="col-12 col-md-4 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-primary text-white py-3">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-chat-dots me-2"></i>
                Chat Rooms
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {rooms.map((room) => (
                  <button
                    key={room.id}
                    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 ${
                      selectedRoom === room.id ? 'active' : ''
                    }`}
                    onClick={() => setSelectedRoom(room.id)}
                  >
                    <div>
                      <i className={`bi ${room.icon} me-2`}></i>
                      <span className="fw-semibold">{room.name}</span>
                    </div>
                    <span className={`badge ${selectedRoom === room.id ? 'bg-light text-primary' : 'bg-primary'} rounded-pill`}>
                      {room.online}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Guidelines Card */}
          <div className="card border-0 shadow-sm mt-4">
            <div className="card-body">
              <h6 className="fw-bold mb-3">
                <i className="bi bi-shield-check text-success me-2"></i>
                Community Guidelines
              </h6>
              <ul className="small text-muted mb-0 ps-3">
                <li>Be kind and supportive</li>
                <li>Respect everyone's privacy</li>
                <li>No judgment or criticism</li>
                <li>Listen actively</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="col-12 col-md-8 col-lg-9">
          <div className="card border-0 shadow-sm h-100">
            {/* Chat Header */}
            <div className="card-header bg-white py-3 border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0 fw-bold">
                    <i className={`bi ${rooms.find(r => r.id === selectedRoom)?.icon} me-2`}></i>
                    {rooms.find(r => r.id === selectedRoom)?.name}
                  </h5>
                  <small className="text-muted">
                    <span className="text-success">●</span>
                    {' '}{rooms.find(r => r.id === selectedRoom)?.online} online
                  </small>
                </div>
                <div>
                  <button className="btn btn-outline-secondary btn-sm me-2">
                    <i className="bi bi-people"></i>
                  </button>
                  <button className="btn btn-outline-secondary btn-sm">
                    <i className="bi bi-gear"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="card-body bg-light" style={{ height: '400px', overflowY: 'auto' }}>
              {/* Welcome Message */}
              <div className="text-center mb-4">
                <span className="badge bg-secondary px-3 py-2">
                  Welcome to {rooms.find(r => r.id === selectedRoom)?.name}
                </span>
              </div>

              {/* Messages */}
              {sampleMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`d-flex mb-3 ${msg.isOwn ? 'justify-content-end' : ''}`}
                >
                  {!msg.isOwn && (
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                      style={{ width: '36px', height: '36px', flexShrink: 0 }}
                    >
                      <i className="bi bi-person"></i>
                    </div>
                  )}
                  <div
                    className={`rounded-3 p-3 ${
                      msg.isOwn ? 'bg-primary text-white' : 'bg-white shadow-sm'
                    }`}
                    style={{ maxWidth: '70%' }}
                  >
                    {!msg.isOwn && (
                      <small className="fw-bold d-block mb-1">{msg.user}</small>
                    )}
                    <p className="mb-1">{msg.message}</p>
                    <small className={msg.isOwn ? 'text-white-50' : 'text-muted'}>
                      {msg.time}
                    </small>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="card-footer bg-white py-3">
              <form onSubmit={handleSend}>
                <div className="input-group">
                  <button type="button" className="btn btn-outline-secondary">
                    <i className="bi bi-emoji-smile"></i>
                  </button>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary px-4">
                    <i className="bi bi-send me-2"></i>
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="alert alert-info border-0 shadow-sm mt-4 d-flex align-items-center">
        <i className="bi bi-info-circle fs-4 me-3"></i>
        <div>
          <strong>Your identity is protected.</strong>
          <span className="ms-2">All conversations are anonymous. No personal information is shared or stored.</span>
        </div>
      </div>
    </div>
  );
};

export default AnonymousChat;
