import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser, getStatistics, getUsersByRole, type Admin } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    setAdmin(user as Admin);
    setStats(getStatistics());
  }, [navigate]);

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  if (!admin || !stats) return null;

  const customers = getUsersByRole("customer");
  const providers = getUsersByRole("provider");

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-header-left">
            <div className="admin-logo">
              <span>⚡</span> QuickServIndia Admin
            </div>
            <span className="admin-welcome">Admin: {admin.name}</span>
            <button onClick={handleLogout} className="admin-logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-container">
          {/* Welcome Section */}
          <div className="admin-welcome-card">
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">System overview and user management</p>
          </div>

          {/* Stats Cards */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
              <div className="admin-stat-icon">👥</div>
              <div className="admin-stat-value">{stats.totalUsers}</div>
              <div className="admin-stat-label">Total Users</div>
            </div>
            <div className="admin-stat-card" style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
              <div className="admin-stat-icon">👤</div>
              <div className="admin-stat-value">{stats.customers}</div>
              <div className="admin-stat-label">Customers</div>
            </div>
            <div className="admin-stat-card" style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
              <div className="admin-stat-icon">🏢</div>
              <div className="admin-stat-value">{stats.providers}</div>
              <div className="admin-stat-label">Providers</div>
            </div>
            <div className="admin-stat-card" style={{ background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" }}>
              <div className="admin-stat-icon">⚙️</div>
              <div className="admin-stat-value">{stats.admins}</div>
              <div className="admin-stat-label">Admins</div>
            </div>
          </div>

          {/* Customers Table */}
          <div className="admin-table-section">
            <h2 className="admin-section-title">Customers ({stats.customers})</h2>
            {customers.length > 0 ? (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Location</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer: any, idx) => (
                      <tr key={idx}>
                        <td>{customer.name}</td>
                        <td>{customer.email}</td>
                        <td>{customer.phone}</td>
                        <td>{customer.location}</td>
                        <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="admin-empty-state">No customers registered yet</div>
            )}
          </div>

          {/* Providers Table */}
          <div className="admin-table-section">
            <h2 className="admin-section-title">Service Providers ({stats.providers})</h2>
            {providers.length > 0 ? (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Business</th>
                      <th>Category</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Location</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providers.map((provider: any, idx) => (
                      <tr key={idx}>
                        <td>{provider.name}</td>
                        <td>{provider.businessName}</td>
                        <td>{provider.serviceCategory}</td>
                        <td>{provider.email}</td>
                        <td>{provider.phone}</td>
                        <td>{provider.location}</td>
                        <td>{new Date(provider.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="admin-empty-state">No providers registered yet</div>
            )}
          </div>

          {/* System Info */}
          <div className="admin-info-section">
            <h2 className="admin-section-title">System Information</h2>
            <div className="admin-info-grid">
              <div className="admin-info-item">
                <span className="admin-info-label">Admin Key:</span>
                <span className="admin-info-value">QUICKSERV_ADMIN_2024</span>
              </div>
              <div className="admin-info-item">
                <span className="admin-info-label">System Status:</span>
                <span className="admin-info-value admin-status-active">Active</span>
              </div>
              <div className="admin-info-item">
                <span className="admin-info-label">Database:</span>
                <span className="admin-info-value">localStorage</span>
              </div>
            </div>
            
            {/* Database Console Button */}
            <div style={{ marginTop: '1.5rem' }}>
              <button 
                onClick={() => navigate("/database-console")}
                className="admin-console-btn"
              >
                🗄️ Open Database Console
              </button>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .admin-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%);
          overflow-x: hidden;
        }

        .admin-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .admin-header-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .admin-header-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-shrink: 0;
        }

        .admin-logo {
          font-family: 'Poppins', sans-serif;
          font-weight: 900;
          font-size: 1.5rem;
          background: linear-gradient(135deg, #1e3c72 0%, #7e22ce 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .admin-header-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .admin-welcome {
          font-weight: 600;
          color: #333;
          white-space: nowrap;
        }

        .admin-logout-btn {
          padding: 0.6rem 1.5rem;
          background: white;
          color: #7e22ce;
          border: 2px solid #7e22ce;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;
        }

        .admin-logout-btn:hover {
          background: linear-gradient(135deg, #1e3c72 0%, #7e22ce 100%);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(126, 34, 206, 0.3);
        }

        .admin-logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(30, 60, 114, 0.4);
        }

        .admin-main {
          padding: 2rem 0;
        }

        .admin-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .admin-welcome-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .admin-title {
          font-family: 'Poppins', sans-serif;
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #1e3c72 0%, #7e22ce 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 0.5rem;
        }

        .admin-subtitle {
          font-size: 1.1rem;
          color: #666;
          margin: 0;
        }

        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .admin-stat-card {
          border-radius: 16px;
          padding: 2rem;
          color: white;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          transition: all 0.3s;
        }

        .admin-stat-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
        }

        .admin-stat-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .admin-stat-value {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .admin-stat-label {
          font-size: 1rem;
          opacity: 0.9;
        }

        .admin-table-section,
        .admin-info-section {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .admin-section-title {
          font-family: 'Poppins', sans-serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: #333;
          margin: 0 0 1.5rem;
        }

        .admin-table-wrapper {
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
        }

        .admin-table th {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 1rem;
          text-align: left;
          font-weight: 700;
          color: #333;
          border-bottom: 2px solid #ddd;
        }

        .admin-table td {
          padding: 1rem;
          border-bottom: 1px solid #eee;
          color: #666;
        }

        .admin-table tbody tr:hover {
          background: #f9fafb;
        }

        .admin-empty-state {
          text-align: center;
          padding: 2rem;
          color: #999;
          font-size: 1.1rem;
        }

        .admin-info-grid {
          display: grid;
          gap: 1rem;
        }

        .admin-info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
        }

        .admin-info-label {
          font-weight: 600;
          color: #666;
        }

        .admin-info-value {
          font-weight: 700;
          color: #333;
        }

        .admin-status-active {
          color: #10b981;
        }

        .admin-console-btn {
          width: 100%;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .admin-console-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        @media (max-width: 768px) {
          .admin-header-left {
            width: 100%;
            justify-content: space-between;
          }
          .admin-header-actions {
            gap: 1rem;
          }
          .admin-welcome {
            font-size: 0.85rem;
          }
          .admin-title {
            font-size: 2rem;
          }
          .admin-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .admin-table {
            font-size: 0.85rem;
          }
          .admin-table th,
          .admin-table td {
            padding: 0.75rem 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
