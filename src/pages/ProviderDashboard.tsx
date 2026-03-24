import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser, type Provider } from "@/lib/auth";
import { useEffect, useState } from "react";

// Service category theme configuration
const SERVICE_THEMES: Record<string, { color: string; gradient: string; image: string; icon: string }> = {
  "Electrician": {
    color: "#3b82f6",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=400&fit=crop&q=80",
    icon: "⚡"
  },
  "Plumber": {
    color: "#f97316",
    gradient: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
    image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&h=400&fit=crop&q=80",
    icon: "💧"
  },
  "Cleaning": {
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    image: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&h=400&fit=crop&q=80",
    icon: "🧹"
  },
  "AC Repair": {
    color: "#06b6d4",
    gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
    image: "https://images.unsplash.com/photo-1631545806609-c2f4d4f6e87c?w=800&h=400&fit=crop&q=80",
    icon: "❄️"
  },
  "Beauty Services": {
    color: "#a855f7",
    gradient: "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=400&fit=crop&q=80",
    icon: "💅"
  },
  "Salon": {
    color: "#ec4899",
    gradient: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=400&fit=crop&q=80",
    icon: "✂️"
  },
  "Painting": {
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=400&fit=crop&q=80",
    icon: "🎨"
  },
  "Urgent Repair": {
    color: "#ef4444",
    gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=400&fit=crop&q=80",
    icon: "🚨"
  },
  "default": {
    color: "#6366f1",
    gradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=400&fit=crop&q=80",
    icon: "🛠️"
  }
};

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "provider") {
      navigate("/login");
      return;
    }
    setProvider(user as Provider);
  }, [navigate]);

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  function getServiceTheme() {
    const category = provider?.serviceCategory || "default";
    return SERVICE_THEMES[category] || SERVICE_THEMES["default"];
  }

  if (!provider) return null;

  const theme = getServiceTheme();

  return (
    <div className="provider-dashboard">
      {/* Header */}
      <header className="provider-header">
        <div className="provider-header-content">
          <div className="provider-header-left">
            <div className="provider-logo">
              <span>{theme.icon}</span> QuickServIndia Provider
            </div>
            <span className="provider-welcome">Welcome, {provider.name}</span>
            <button onClick={handleLogout} className="provider-logout-btn">
              <span className="logout-icon">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner with Service Image */}
      <div className="provider-hero" style={{ backgroundImage: `url(${theme.image})` }}>
        <div className="provider-hero-overlay"></div>
        <div className="provider-hero-content">
          <div className="provider-hero-badge" style={{ background: theme.gradient }}>
            <span className="provider-hero-icon">{theme.icon}</span>
            <span>{provider.serviceCategory}</span>
          </div>
          <h1 className="provider-hero-title">{provider.businessName}</h1>
          <p className="provider-hero-subtitle">Professional {provider.serviceCategory} Services</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="provider-main">
        <div className="provider-container">
          {/* Business Info */}
          <div className="provider-info-grid">
            <div className="provider-info-card" style={{ borderLeft: `4px solid ${theme.color}` }}>
              <div className="provider-info-icon" style={{ background: `${theme.color}15`, color: theme.color }}>🏢</div>
              <div className="provider-info-content">
                <div className="provider-info-label">Business Name</div>
                <div className="provider-info-value">{provider.businessName}</div>
              </div>
            </div>
            <div className="provider-info-card" style={{ borderLeft: `4px solid ${theme.color}` }}>
              <div className="provider-info-icon" style={{ background: `${theme.color}15`, color: theme.color }}>{theme.icon}</div>
              <div className="provider-info-content">
                <div className="provider-info-label">Service Category</div>
                <div className="provider-info-value">{provider.serviceCategory}</div>
              </div>
            </div>
            <div className="provider-info-card" style={{ borderLeft: `4px solid ${theme.color}` }}>
              <div className="provider-info-icon" style={{ background: `${theme.color}15`, color: theme.color }}>📍</div>
              <div className="provider-info-content">
                <div className="provider-info-label">Service Area</div>
                <div className="provider-info-value">{provider.location}</div>
              </div>
            </div>
            <div className="provider-info-card" style={{ borderLeft: `4px solid ${theme.color}` }}>
              <div className="provider-info-icon" style={{ background: `${theme.color}15`, color: theme.color }}>📞</div>
              <div className="provider-info-content">
                <div className="provider-info-label">Phone</div>
                <div className="provider-info-value">{provider.phone}</div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="provider-stats-grid">
            <div className="provider-stat-card" style={{ background: theme.gradient }}>
              <div className="provider-stat-icon">📅</div>
              <div className="provider-stat-value">0</div>
              <div className="provider-stat-label">Total Bookings</div>
            </div>
            <div className="provider-stat-card" style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}>
              <div className="provider-stat-icon">⏳</div>
              <div className="provider-stat-value">0</div>
              <div className="provider-stat-label">Pending</div>
            </div>
            <div className="provider-stat-card" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
              <div className="provider-stat-icon">✅</div>
              <div className="provider-stat-value">0</div>
              <div className="provider-stat-label">Completed</div>
            </div>
            <div className="provider-stat-card" style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" }}>
              <div className="provider-stat-icon">💰</div>
              <div className="provider-stat-value">₹0</div>
              <div className="provider-stat-label">Total Earnings</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="provider-actions-section">
            <h2 className="provider-section-title">Quick Actions</h2>
            <div className="provider-actions-grid">
              <button className="provider-action-btn" onClick={() => setShowBookingModal(true)} style={{ borderTop: `3px solid ${theme.color}` }}>
                <span className="provider-action-icon">📋</span>
                <span className="provider-action-text">View Bookings</span>
              </button>
              <button className="provider-action-btn" onClick={() => setShowServiceModal(true)} style={{ borderTop: `3px solid ${theme.color}` }}>
                <span className="provider-action-icon">⚙️</span>
                <span className="provider-action-text">Manage Services</span>
              </button>
              <button className="provider-action-btn" style={{ borderTop: `3px solid ${theme.color}` }}>
                <span className="provider-action-icon">📊</span>
                <span className="provider-action-text">View Analytics</span>
              </button>
              <button className="provider-action-btn" style={{ borderTop: `3px solid ${theme.color}` }}>
                <span className="provider-action-icon">💬</span>
                <span className="provider-action-text">Messages</span>
              </button>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="provider-bookings-section">
            <h2 className="provider-section-title">Recent Bookings</h2>
            <div className="provider-empty-state">
              <div className="provider-empty-icon">📭</div>
              <div className="provider-empty-text">No bookings yet</div>
              <div className="provider-empty-subtext">Your bookings will appear here once customers start booking your services</div>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay-provider" onClick={() => setShowBookingModal(false)}>
          <div className="modal-provider animate-modal-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-provider" style={{ background: theme.gradient }}>
              <div className="modal-header-left-provider">
                <span className="modal-icon-provider">📋</span>
                <h2 className="modal-title-provider">Your Bookings</h2>
              </div>
              <button onClick={() => setShowBookingModal(false)} className="modal-close-provider">✕</button>
            </div>
            <div className="modal-body-provider">
              <div className="modal-empty-state">
                <div className="modal-empty-icon">📭</div>
                <p className="modal-empty-text">No bookings available</p>
                <p className="modal-empty-subtext">Bookings from customers will appear here</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Management Modal */}
      {showServiceModal && (
        <div className="modal-overlay-provider" onClick={() => setShowServiceModal(false)}>
          <div className="modal-provider animate-modal-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-provider" style={{ background: theme.gradient }}>
              <div className="modal-header-left-provider">
                <span className="modal-icon-provider">⚙️</span>
                <h2 className="modal-title-provider">Manage Services</h2>
              </div>
              <button onClick={() => setShowServiceModal(false)} className="modal-close-provider">✕</button>
            </div>
            <div className="modal-body-provider">
              <div className="service-info-card">
                <div className="service-info-row">
                  <span className="service-info-label">Category:</span>
                  <span className="service-info-value" style={{ color: theme.color }}>{provider.serviceCategory}</span>
                </div>
                <div className="service-info-row">
                  <span className="service-info-label">Business:</span>
                  <span className="service-info-value">{provider.businessName}</span>
                </div>
                <div className="service-info-row">
                  <span className="service-info-label">Location:</span>
                  <span className="service-info-value">{provider.location}</span>
                </div>
              </div>
              <button 
                className="modal-action-btn" 
                style={{ background: theme.gradient }}
                onClick={() => {
                  setShowServiceModal(false);
                  setShowSuccessPopup(true);
                }}
              >
                Update Service Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="modal-overlay-provider" onClick={() => setShowSuccessPopup(false)}>
          <div className="success-popup animate-modal-in" onClick={(e) => e.stopPropagation()}>
            <div className="success-icon-circle" style={{ background: theme.gradient }}>
              <span className="success-checkmark">✓</span>
            </div>
            <h3 className="success-title">Success!</h3>
            <p className="success-message">Your action was completed successfully</p>
            <button 
              className="success-btn" 
              style={{ background: theme.gradient }}
              onClick={() => setShowSuccessPopup(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <style>{`
        .provider-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          overflow-x: hidden;
        }

        .provider-header {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
        }

        .provider-header-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .provider-header-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-shrink: 0;
        }

        .provider-logo {
          font-family: 'Poppins', sans-serif;
          font-weight: 800;
          font-size: 1.5rem;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .provider-logo span {
          font-size: 1.75rem;
        }

        .provider-header-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .provider-welcome {
          font-weight: 600;
          color: #4b5563;
          font-size: 0.9375rem;
          white-space: nowrap;
        }

        .provider-logout-btn {
          padding: 0.625rem 1.25rem;
          background: white;
          color: #ef4444;
          border: 2px solid #ef4444;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .provider-logout-btn:hover {
          background: #ef4444;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .logout-icon {
          font-size: 1.125rem;
        }

        .provider-hero {
          position: relative;
          height: 320px;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .provider-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%);
        }

        .provider-hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: white;
          max-width: 800px;
          padding: 0 2rem;
        }

        .provider-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1.25rem;
          border-radius: 2rem;
          font-weight: 700;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
          backdrop-filter: blur(8px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .provider-hero-icon {
          font-size: 1.25rem;
        }

        .provider-hero-title {
          font-family: 'Poppins', sans-serif;
          font-size: 3rem;
          font-weight: 900;
          margin: 0 0 0.75rem;
          text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .provider-hero-subtitle {
          font-size: 1.25rem;
          font-weight: 500;
          margin: 0;
          opacity: 0.95;
        }

        .provider-main {
          padding: 2.5rem 0;
          margin-top: -60px;
          position: relative;
          z-index: 10;
        }

        .provider-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .provider-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.25rem;
        }

        .provider-info-card {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-left: 4px solid transparent;
        }

        .provider-info-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }

        .provider-info-icon {
          font-size: 2rem;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.75rem;
          flex-shrink: 0;
        }

        .provider-info-content {
          flex: 1;
        }

        .provider-info-label {
          font-size: 0.8125rem;
          color: #6b7280;
          margin-bottom: 0.375rem;
          font-weight: 500;
        }

        .provider-info-value {
          font-size: 1.0625rem;
          font-weight: 700;
          color: #1f2937;
        }

        .provider-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .provider-stat-card {
          border-radius: 1.25rem;
          padding: 2rem;
          color: white;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .provider-stat-card::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        .provider-stat-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
        }

        .provider-stat-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          display: block;
        }

        .provider-stat-value {
          font-size: 2.75rem;
          font-weight: 900;
          margin-bottom: 0.5rem;
          display: block;
        }

        .provider-stat-label {
          font-size: 1rem;
          opacity: 0.95;
          font-weight: 500;
        }

        .provider-actions-section,
        .provider-bookings-section {
          background: white;
          border-radius: 1.25rem;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06);
        }

        .provider-section-title {
          font-family: 'Poppins', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 1.5rem;
        }

        .provider-actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.25rem;
        }

        .provider-action-btn {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 1rem;
          padding: 1.75rem 1.25rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.875rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-top: 3px solid transparent;
        }

        .provider-action-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
          border-color: #d1d5db;
        }

        .provider-action-icon {
          font-size: 2.25rem;
        }

        .provider-action-text {
          font-weight: 600;
          color: #374151;
          font-size: 0.9375rem;
        }

        .provider-empty-state {
          text-align: center;
          padding: 4rem 2rem;
        }

        .provider-empty-icon {
          font-size: 5rem;
          margin-bottom: 1.5rem;
          opacity: 0.5;
        }

        .provider-empty-text {
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .provider-empty-subtext {
          font-size: 1rem;
          color: #6b7280;
          max-width: 500px;
          margin: 0 auto;
        }

        /* Modern Modal Styles */
        .modal-overlay-provider {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-provider {
          background: white;
          border-radius: 1.25rem;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          display: flex;
          flex-direction: column;
        }

        .animate-modal-in {
          animation: modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .modal-header-provider {
          padding: 1.75rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
        }

        .modal-header-left-provider {
          display: flex;
          align-items: center;
          gap: 0.875rem;
        }

        .modal-icon-provider {
          font-size: 1.75rem;
        }

        .modal-title-provider {
          font-family: 'Poppins', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
        }

        .modal-close-provider {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          font-size: 1.5rem;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          font-weight: 300;
        }

        .modal-close-provider:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        .modal-body-provider {
          padding: 2rem;
          overflow-y: auto;
        }

        .modal-empty-state {
          text-align: center;
          padding: 3rem 1rem;
        }

        .modal-empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .modal-empty-text {
          font-size: 1.125rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .modal-empty-subtext {
          font-size: 0.9375rem;
          color: #6b7280;
        }

        .service-info-card {
          background: #f9fafb;
          border-radius: 0.75rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border: 1px solid #e5e7eb;
        }

        .service-info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .service-info-row:last-child {
          border-bottom: none;
        }

        .service-info-label {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        .service-info-value {
          font-size: 0.9375rem;
          font-weight: 600;
          color: #1f2937;
        }

        .modal-action-btn {
          width: 100%;
          padding: 1rem;
          border: none;
          border-radius: 0.75rem;
          color: white;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .modal-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        /* Success Popup */
        .success-popup {
          background: white;
          border-radius: 1.25rem;
          padding: 3rem 2rem;
          max-width: 400px;
          width: 100%;
          text-align: center;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        }

        .success-icon-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .success-checkmark {
          font-size: 3rem;
          color: white;
          font-weight: 700;
        }

        .success-title {
          font-family: 'Poppins', sans-serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.75rem;
        }

        .success-message {
          font-size: 1rem;
          color: #6b7280;
          margin: 0 0 2rem;
        }

        .success-btn {
          width: 100%;
          padding: 1rem;
          border: none;
          border-radius: 0.75rem;
          color: white;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .success-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 768px) {
          .provider-header-content {
            padding: 0 1rem;
          }
          .provider-header-left {
            width: 100%;
            justify-content: space-between;
          }
          .provider-welcome {
            font-size: 0.85rem;
          }
          .provider-hero {
            height: 240px;
          }
          .provider-hero-title {
            font-size: 2rem;
          }
          .provider-hero-subtitle {
            font-size: 1rem;
          }
          .provider-container {
            padding: 0 1rem;
          }
          .provider-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .provider-stat-value {
            font-size: 2rem;
          }
          .modal-body-provider {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
