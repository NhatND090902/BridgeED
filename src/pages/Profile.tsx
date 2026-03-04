import { useEffect, useState } from "react";
import UserService from "../services/UserService";

const Profile = () => {
  const user = UserService.getCurrentUser();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    gender: string;
    age?: number;
  }>({
    name: user?.name || "",
    gender: user?.gender || "",
    age: user?.age,
  });

  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [medals, setMedals] = useState<any[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const currentUser = UserService.getCurrentUser();
    if (!currentUser) return;
    const stored = localStorage.getItem("graceLibraryMedals");
    if (stored) {
      const allMedals = JSON.parse(stored);
      const userMedals = allMedals.filter(
        (m: { userId: string }) => m.userId === currentUser.id,
      );
      setMedals(userMedals);
    }
  }, []);

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <h4>Bạn chưa đăng nhập</h4>
      </div>
    );
  }

  // =========================
  // UPDATE PROFILE
  // =========================
  const handleSaveProfile = () => {
    const result = UserService.updateUser(user.id, formData);

    if (!result.success) {
      alert(result.message);
      return;
    }

    alert("Cập nhật thông tin thành công!");
    setIsEditing(false);
  };

  // =========================
  // UPDATE PASSWORD
  // =========================
  const handleUpdatePassword = () => {
    if (!oldPassword || !newPassword) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (oldPassword !== user.password) {
      alert("Mật khẩu cũ không đúng");
      return;
    }

    if (newPassword.length < 6) {
      alert("Mật khẩu mới phải tối thiểu 6 ký tự");
      return;
    }

    const result = UserService.updatePassword(user.id, newPassword);

    if (!result.success) {
      alert(result.message);
      return;
    }

    alert("Đổi mật khẩu thành công!");
    setShowModal(false);
    setOldPassword("");
    setNewPassword("");
  };

  return (
    <div className="container py-4">
      {/* ================= HEADER ================= */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body d-flex align-items-center gap-4">
          <i className="bi bi-person-circle fs-1 text-primary"></i>
          <div>
            <h4 className="fw-bold mb-0">
              Xin chào, {user.name || user.username}
            </h4>
            <small className="text-muted">Thành viên BridgeED</small>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* ================= LEFT COLUMN ================= */}
        <div className="col-lg-8">
          {/* PROFILE INFO */}
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-3">
                <h5 className="fw-bold">Thông tin cá nhân</h5>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Hủy" : "Chỉnh sửa"}
                </button>
              </div>

              {!isEditing ? (
                <>
                  <p>
                    <strong>Họ tên:</strong> {user.name}
                  </p>
                  <p>
                    <strong>Giới tính:</strong> {user.gender || "Chưa cập nhật"}
                  </p>
                  <p>
                    <strong>Tuổi:</strong> {user.age || "Chưa cập nhật"}
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-3">
                    <label className="form-label">Họ tên</label>
                    <input
                      className="form-control"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Giới tính</label>
                    <input
                      className="form-control"
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Tuổi</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.age ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          age: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                    />
                  </div>

                  <button
                    className="btn btn-primary"
                    onClick={handleSaveProfile}
                  >
                    Lưu thay đổi
                  </button>
                </>
              )}

              <hr />

              <button
                className="btn btn-outline-secondary"
                onClick={() => setShowModal(true)}
              >
                Đổi mật khẩu
              </button>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="col-lg-4">
          {/* MEDAL SECTION */}
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="medal-display-wrapper">
                <button
                  className="btn btn-light w-100 d-flex justify-content-between align-items-center"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <div>🏆 {medals.length} Huy chương đã đạt</div>
                  <i
                    className={`bi bi-chevron-${isExpanded ? "up" : "down"}`}
                  ></i>
                </button>

                {!isExpanded && medals.length > 0 && (
                  <div className="d-flex gap-2 mt-3 flex-wrap">
                    {medals.slice(0, 5).map((medal, index) => (
                      <span
                        key={`${medal.checklistId}-${index}`}
                        style={{ fontSize: "24px" }}
                        title={medal.name}
                      >
                        {medal.icon}
                      </span>
                    ))}
                    {medals.length > 5 && (
                      <span className="text-muted">+{medals.length - 5}</span>
                    )}
                  </div>
                )}

                {isExpanded && (
                  <div className="mt-3">
                    {medals.map((medal, index) => (
                      <div
                        key={`${medal.checklistId}-${index}`}
                        className="d-flex align-items-center mb-3"
                      >
                        <div style={{ fontSize: "28px" }} className="me-3">
                          {medal.icon}
                        </div>
                        <div>
                          <div className="fw-semibold">{medal.name}</div>
                          <div className="small text-muted">
                            {medal.checklistTitle}
                          </div>
                          <div className="small text-muted">
                            {new Date(medal.earnedAt).toLocaleDateString(
                              "vi-VN",
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= PASSWORD MODAL ================= */}
      {showModal && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Đổi mật khẩu</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <input
                  type="password"
                  className="form-control mb-3"
                  placeholder="Nhập mật khẩu cũ"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <input
                  type="password"
                  className="form-control"
                  placeholder="Nhập mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleUpdatePassword}
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
