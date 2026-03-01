interface CardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  link?: string;
}

const DashboardCard = ({ title, description, icon, color }: CardProps) => {
  return (
    <div className="card h-100 border-0 shadow-sm hover-shadow">
      <div className="card-body text-center p-4">
        <div
          className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-3`}
          style={{
            width: '64px',
            height: '64px',
            backgroundColor: `${color}20`,
          }}
        >
          <i className={`bi ${icon} fs-3`} style={{ color }}></i>
        </div>
        <h5 className="card-title fw-bold">{title}</h5>
        <p className="card-text text-muted small">{description}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
