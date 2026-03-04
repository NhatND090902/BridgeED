import { useState } from "react";
import { Link } from "react-router-dom";
import UserService from "../services/UserService";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
    const result = UserService.register({
      name: formData.name,
      username: formData.username,
      password: formData.password,
    });
    if (!result.success) {
      alert(result.message);
      return;
    }
    alert(`Đăng ký thành công tài khoản: ${formData.username}`);
    setFormData({
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
    });
    setTimeout(() => {
      navigate("/login");
    }, 1000);
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
                  <i className="bi bi-person-plus text-primary fs-2"></i>
                </div>
                <h2 className="fw-bold">Create Account</h2>
                <p className="text-muted">
                  Start your emotional wellness journey today
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label fw-semibold">
                    Họ và tên
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-person text-muted"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      placeholder="Nhập họ và tên"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="username" className="form-label fw-semibold">
                    Tên tài khoản
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      placeholder="Nhập tên tài khoản"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-semibold">
                    Mật khẩu
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="password"
                      name="password"
                      placeholder="Nhập mật khẩu"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8}
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
                  <small className="text-muted">
                    Mật khẩu chứa ít nhất 8 ký tự
                  </small>
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="confirmPassword"
                    className="form-label fw-semibold"
                  >
                    Nhập lại mật khẩu
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-lock-fill text-muted"></i>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Nhập lại mật khẩu"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="d-grid mb-4">
                  <button type="submit" className="btn btn-primary btn-lg">
                    <i className="bi bi-person-plus me-2"></i>
                    Đăng ký
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
                {/* Login Link */}
                <p className="text-center text-muted mb-0">
                  Bạn đã có tài khoản?{" "}
                  <Link
                    to="/login"
                    className="text-primary fw-semibold text-decoration-none"
                  >
                    Đăng nhập
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

export default Register;
