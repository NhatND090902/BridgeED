import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-vh-100 bg-primary bg-gradient d-flex flex-column">
      <nav className="navbar navbar-dark">
        <div className="container">
          <Link to="/" className="navbar-brand fw-bold">
            <i className="bi bi-heart-pulse-fill me-2"></i>
            BridgeED
          </Link>
        </div>
      </nav>
      <main className="flex-grow-1 d-flex align-items-center justify-content-center py-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
