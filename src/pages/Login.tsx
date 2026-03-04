import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UserService from "../services/UserService";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = UserService.login(username, password);
    if (!result.success) {
      alert(result.message);
      return;
    }
    // Reset form (optional)
    setUsername("");
    setPassword("");
    // Redirect về trang chủ
    navigate("/");
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
          <div className="card border-0 shadow-lg">
            <div className="card-body p-4 p-md-5">
              {/* Header */}
              <div className="text-center mb-4">
                <div
                  className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "64px", height: "64px" }}
                >
                  <i className="bi bi-person-circle text-primary fs-2"></i>
                </div>
                <h2 className="fw-bold">Chào mừng trở lại</h2>
                <p className="text-muted">
                  Sign in to continue your wellness journey
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label fw-semibold">
                    Tài khoản
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                      type="username"
                      className="form-control"
                      id="username"
                      placeholder="Tên tài khoản"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-semibold">
                    Mật Khẩu
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="password"
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i
                        className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                      ></i>
                    </button>
                  </div>
                </div>

                <div className="d-grid mb-4">
                  <button type="submit" className="btn btn-primary btn-lg">
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Đăng nhập
                  </button>
                </div>

                {/* Divider */}
                <div className="d-flex align-items-center mb-4">
                  <hr className="flex-grow-1" />
                  <span className="px-3 text-muted small">
                    hoặc tiếp tục với
                  </span>
                  <hr className="flex-grow-1" />
                </div>

                {/* Social Login */}
                <div className="d-flex gap-2 mb-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary flex-grow-1"
                  >
                    <i className="bi bi-google me-2"></i>
                    Google
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary flex-grow-1"
                  >
                    <i className="bi bi-facebook me-2"></i>
                    Facebook
                  </button>
                </div>

                {/* Register Link */}
                <p className="text-center text-muted mb-0">
                  Chưa có tài khoản?{" "}
                  <Link
                    to="/register"
                    className="text-primary fw-semibold text-decoration-none"
                  >
                    Đăng ký
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
