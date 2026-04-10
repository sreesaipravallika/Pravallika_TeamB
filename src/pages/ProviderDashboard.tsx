import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser, type Provider } from "@/lib/auth";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import LocationSelector from "@/components/LocationSelector";

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
  "Plumbing": {
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

interface Booking {
  id: number;
  customer_id: number;
  service_type: string;
  location: string;
  service_date: string;
  time: string;
  description: string;
  status: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  created_at: string;
}

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "provider") {
      navigate("/login");
      return;
    }
    setProvider(user as Provider);
    loadBookings(user.id);
  }, [navigate]);

  async function loadBookings(providerId: number) {
    try {
      setLoading(true);
      const response = await api.get(`/booking/provider/${providerId}`);
      setBookings(response.bookings || []);
    } catch (error) {
      console.error("Error loading bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  async function updateBookingStatus(bookingId: number, newStatus: string) {
    try {
      await api.put(`/booking/status/${bookingId}`, { status: newStatus });
      setSuccessMessage(`Booking ${newStatus.toLowerCase()} successfully!`);
      setShowSuccessPopup(true);
      if (provider) {
        loadBookings(provider.id);
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking status");
    }
  }

  async function toggleAvailability() {
    try {
      const newAvailability = !isAvailable;
      await api.put('/provider/availability', { isAvailable: newAvailability });
      setIsAvailable(newAvailability);
      setSuccessMessage(newAvailability ? "You are now available for bookings!" : "You are now unavailable. Customers won't be able to book you.");
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error updating availability:", error);
      alert("Failed to update availability");
    }
  }

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  function getServiceTheme() {
    const category = provider?.serviceCategory || "default";
    return SERVICE_THEMES[category] || SERVICE_THEMES["default"];
  }

  function getStatusColor(status: string) {
    switch (status.toUpperCase()) {
      case "PENDING": return "#f59e0b";
      case "CONFIRMED": return "#3b82f6";
      case "COMPLETED": return "#10b981";
      case "CANCELLED": return "#ef4444";
      default: return "#6b7280";
    }
  }

  function getStatusIcon(status: string) {
    switch (status.toUpperCase()) {
      case "PENDING": return "⏳";
      case "CONFIRMED": return "✅";
      case "COMPLETED": return "🎉";
      case "CANCELLED": return "❌";
      default: return "📋";
    }
  }

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "PENDING").length,
    confirmed: bookings.filter(b => b.status === "CONFIRMED").length,
    completed: bookings.filter(b => b.status === "COMPLETED").length
  };

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
            <div className="availability-toggle">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={isAvailable}
                  onChange={toggleAvailability}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className={`availability-status ${isAvailable ? 'available' : 'unavailable'}`}>
                {isAvailable ? '🟢 Available' : '🔴 Unavailable'}
              </span>
            </div>
            <LocationSelector />
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
              <div className="provider-stat-value">{stats.total}</div>
              <div className="provider-stat-label">Total Bookings</div>
            </div>
            <div className="provider-stat-card" style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}>
              <div className="provider-stat-icon">⏳</div>
              <div className="provider-stat-value">{stats.pending}</div>
              <div className="provider-stat-label">Pending</div>
            </div>
            <div className="provider-stat-card" style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" }}>
              <div className="provider-stat-icon">✅</div>
              <div className="provider-stat-value">{stats.confirmed}</div>
              <div className="provider-stat-label">Confirmed</div>
            </div>
            <div className="provider-stat-card" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
              <div className="provider-stat-icon">🎉</div>
              <div className="provider-stat-value">{stats.completed}</div>
              <div className="provider-stat-label">Completed</div>
            </div>
          </div>

          {/* Quick Access Modules */}
          <div className="provider-modules-section">
            <h2 className="provider-section-title">Quick Access Modules</h2>
            <div className="provider-modules-grid">
              <div className="provider-module-card" style={{ borderTop: `4px solid ${theme.color}` }} onClick={() => setShowBookingModal(true)}>
                <div className="provider-module-icon" style={{ background: `${theme.color}15`, color: theme.color }}>
                  📋
                </div>
                <h3 className="provider-module-title">Manage Bookings</h3>
                <p className="provider-module-desc">View and manage all your service bookings</p>
                <div className="provider-module-arrow" style={{ color: theme.color }}>→</div>
              </div>
              <div className="provider-module-card" style={{ borderTop: `4px solid #10b981` }} onClick={() => setShowServiceModal(true)}>
                <div className="provider-module-icon" style={{ background: '#10b98115', color: '#10b981' }}>
                  ⚙️
                </div>
                <h3 className="provider-module-title">Service Settings</h3>
                <p className="provider-module-desc">Update your service details and pricing</p>
                <div className="provider-module-arrow" style={{ color: '#10b981' }}>→</div>
              </div>
              <div className="provider-module-card" style={{ borderTop: `4px solid #8b5cf6` }}>
                <div className="provider-module-icon" style={{ background: '#8b5cf615', color: '#8b5cf6' }}>
                  📊
                </div>
                <h3 className="provider-module-title">Analytics</h3>
                <p className="provider-module-desc">View your performance and earnings</p>
                <div className="provider-module-arrow" style={{ color: '#8b5cf6' }}>→</div>
              </div>
              <div className="provider-module-card" style={{ borderTop: `4px solid #f59e0b` }}>
                <div className="provider-module-icon" style={{ background: '#f59e0b15', color: '#f59e0b' }}>
                  💬
                </div>
                <h3 className="provider-module-title">Messages</h3>
                <p className="provider-module-desc">Chat with customers and support</p>
                <div className="provider-module-arrow" style={{ color: '#f59e0b' }}>→</div>
              </div>
              <div className="provider-module-card" style={{ borderTop: `4px solid #ef4444` }}>
                <div className="provider-module-icon" style={{ background: '#ef444415', color: '#ef4444' }}>
                  ⭐
                </div>
                <h3 className="provider-module-title">Reviews</h3>
                <p className="provider-module-desc">View customer feedback and ratings</p>
                <div className="provider-module-arrow" style={{ color: '#ef4444' }}>→</div>
              </div>
              <div className="provider-module-card" style={{ borderTop: `4px solid #06b6d4` }}>
                <div className="provider-module-icon" style={{ background: '#06b6d415', color: '#06b6d4' }}>
                  📅
                </div>
                <h3 className="provider-module-title">Schedule</h3>
                <p className="provider-module-desc">Manage your availability calendar</p>
                <div className="provider-module-arrow" style={{ color: '#06b6d4' }}>→</div>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="provider-bookings-section">
            <h2 className="provider-section-title">Recent Bookings</h2>
            {loading ? (
              <div className="provider-empty-state">
                <div className="provider-empty-icon">⏳</div>
                <div className="provider-empty-text">Loading bookings...</div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="provider-empty-state">
                <div className="provider-empty-icon">📭</div>
                <div className="provider-empty-text">No bookings yet</div>
                <div className="provider-empty-subtext">Your bookings will appear here once customers start booking your services</div>
              </div>
            ) : (
              <div className="bookings-list">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-header">
                      <div className="booking-id">#{booking.id}</div>
                      <div className="booking-status" style={{ background: `${getStatusColor(booking.status)}20`, color: getStatusColor(booking.status) }}>
                        {getStatusIcon(booking.status)} {booking.status}
                      </div>
                    </div>
                    <div className="booking-details">
                      <div className="booking-row">
                        <span className="booking-label">👤 Customer:</span>
                        <span className="booking-value">{booking.customer_name}</span>
                      </div>
                      <div className="booking-row">
                        <span className="booking-label">📞 Phone:</span>
                        <span className="booking-value">{booking.customer_phone}</span>
                      </div>
                      <div className="booking-row">
                        <span className="booking-label">🛠️ Service:</span>
                        <span className="booking-value">{booking.service_type}</span>
                      </div>
                      <div className="booking-row">
                        <span className="booking-label">📍 Location:</span>
                        <span className="booking-value">{booking.location}</span>
                      </div>
                      <div className="booking-row">
                        <span className="booking-label">📅 Date:</span>
                        <span className="booking-value">{booking.service_date}</span>
                      </div>
                      <div className="booking-row">
                        <span className="booking-label">⏰ Time:</span>
                        <span className="booking-value">{booking.time}</span>
                      </div>
                      {booking.description && (
                        <div className="booking-description">
                          <span className="booking-label">📝 Description:</span>
                          <p>{booking.description}</p>
                        </div>
                      )}
                    </div>
                    {booking.status === "PENDING" && (
                      <div className="booking-actions">
                        <button 
                          className="booking-action-btn confirm-btn"
                          onClick={() => updateBookingStatus(booking.id, "CONFIRMED")}
                        >
                          ✅ Confirm
                        </button>
                        <button 
                          className="booking-action-btn cancel-btn"
                          onClick={() => updateBookingStatus(booking.id, "CANCELLED")}
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    )}
                    {booking.status === "CONFIRMED" && (
                      <div className="booking-actions">
                        <button 
                          className="booking-action-btn complete-btn"
                          onClick={() => updateBookingStatus(booking.id, "COMPLETED")}
                        >
                          🎉 Mark Complete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
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
                <h2 className="modal-title-provider">All Bookings ({bookings.length})</h2>
              </div>
              <button onClick={() => setShowBookingModal(false)} className="modal-close-provider">✕</button>
            </div>
            <div className="modal-body-provider">
              {bookings.length === 0 ? (
                <div className="modal-empty-state">
                  <div className="modal-empty-icon">📭</div>
                  <p className="modal-empty-text">No bookings available</p>
                  <p className="modal-empty-subtext">Bookings from customers will appear here</p>
                </div>
              ) : (
                <div className="modal-bookings-list">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="modal-booking-card">
                      <div className="modal-booking-header">
                        <span className="modal-booking-id">#{booking.id}</span>
                        <span className="modal-booking-status" style={{ background: `${getStatusColor(booking.status)}20`, color: getStatusColor(booking.status) }}>
                          {getStatusIcon(booking.status)} {booking.status}
                        </span>
                      </div>
                      <div className="modal-booking-info">
                        <p><strong>Customer:</strong> {booking.customer_name}</p>
                        <p><strong>Phone:</strong> {booking.customer_phone}</p>
                        <p><strong>Service:</strong> {booking.service_type}</p>
                        <p><strong>Location:</strong> {booking.location}</p>
                        <p><strong>Date:</strong> {booking.service_date} at {booking.time}</p>
                        {booking.description && <p><strong>Details:</strong> {booking.description}</p>}
                      </div>
                      {booking.status === "PENDING" && (
                        <div className="modal-booking-actions">
                          <button 
                            className="modal-action-btn-small confirm-btn"
                            onClick={() => {
                              updateBookingStatus(booking.id, "CONFIRMED");
                              setShowBookingModal(false);
                            }}
                          >
                            ✅ Confirm
                          </button>
                          <button 
                            className="modal-action-btn-small cancel-btn"
                            onClick={() => {
                              updateBookingStatus(booking.id, "CANCELLED");
                              setShowBookingModal(false);
                            }}
                          >
                            ❌ Cancel
                          </button>
                        </div>
                      )}
                      {booking.status === "CONFIRMED" && (
                        <button 
                          className="modal-action-btn-small complete-btn"
                          onClick={() => {
                            updateBookingStatus(booking.id, "COMPLETED");
                            setShowBookingModal(false);
                          }}
                        >
                          🎉 Mark Complete
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
            <p className="success-message">{successMessage || "Your action was completed successfully"}</p>
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

        /* Bookings List */
        .bookings-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .booking-card {
          background: #f9fafb;
          border-radius: 1rem;
          padding: 1.5rem;
          border: 2px solid #e5e7eb;
          transition: all 0.3s;
        }

        .booking-card:hover {
          border-color: #d1d5db;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .booking-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .booking-id {
          font-weight: 700;
          font-size: 1.125rem;
          color: #1f2937;
        }

        .booking-status {
          padding: 0.375rem 0.875rem;
          border-radius: 1rem;
          font-weight: 600;
          font-size: 0.8125rem;
        }

        .booking-details {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }

        .booking-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .booking-label {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        .booking-value {
          font-size: 0.9375rem;
          color: #1f2937;
          font-weight: 600;
        }

        .booking-description {
          margin-top: 0.5rem;
          padding-top: 0.75rem;
          border-top: 1px solid #e5e7eb;
        }

        .booking-description p {
          margin-top: 0.375rem;
          color: #4b5563;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .booking-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 2px solid #e5e7eb;
        }

        .booking-action-btn {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.9375rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .confirm-btn {
          background: #10b981;
          color: white;
        }

        .confirm-btn:hover {
          background: #059669;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .cancel-btn {
          background: #ef4444;
          color: white;
        }

        .cancel-btn:hover {
          background: #dc2626;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .complete-btn {
          background: #8b5cf6;
          color: white;
        }

        .complete-btn:hover {
          background: #7c3aed;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        /* Modal Bookings */
        .modal-bookings-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 60vh;
          overflow-y: auto;
        }

        .modal-booking-card {
          background: #f9fafb;
          border-radius: 0.75rem;
          padding: 1.25rem;
          border: 1px solid #e5e7eb;
        }

        .modal-booking-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.875rem;
          padding-bottom: 0.625rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-booking-id {
          font-weight: 700;
          color: #1f2937;
        }

        .modal-booking-status {
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-weight: 600;
          font-size: 0.75rem;
        }

        .modal-booking-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .modal-booking-info p {
          margin: 0;
          font-size: 0.875rem;
          color: #4b5563;
        }

        .modal-booking-info strong {
          color: #1f2937;
          font-weight: 600;
        }

        .modal-booking-actions {
          display: flex;
          gap: 0.625rem;
          margin-top: 0.875rem;
          padding-top: 0.875rem;
          border-top: 1px solid #e5e7eb;
        }

        .modal-action-btn-small {
          flex: 1;
          padding: 0.625rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        /* Availability Toggle */
        .availability-toggle {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1rem;
          background: #f9fafb;
          border-radius: 2rem;
          border: 2px solid #e5e7eb;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 24px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ef4444;
          transition: 0.4s;
          border-radius: 24px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }

        input:checked + .toggle-slider {
          background-color: #10b981;
        }

        input:checked + .toggle-slider:before {
          transform: translateX(24px);
        }

        .availability-status {
          font-size: 0.875rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .availability-status.available {
          color: #10b981;
        }

        .availability-status.unavailable {
          color: #ef4444;
        }

        /* Provider Modules */
        .provider-modules-section {
          background: white;
          border-radius: 1.25rem;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06);
        }

        .provider-modules-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .provider-module-card {
          background: #f9fafb;
          border-radius: 1rem;
          padding: 2rem 1.5rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-top: 4px solid transparent;
          position: relative;
          overflow: hidden;
        }

        .provider-module-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 100%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .provider-module-card:hover::before {
          opacity: 1;
        }

        .provider-module-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
        }

        .provider-module-icon {
          width: 64px;
          height: 64px;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin-bottom: 1.25rem;
          transition: transform 0.3s;
        }

        .provider-module-card:hover .provider-module-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .provider-module-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.625rem;
        }

        .provider-module-desc {
          font-size: 0.9375rem;
          color: #6b7280;
          margin: 0 0 1rem;
          line-height: 1.5;
        }

        .provider-module-arrow {
          font-size: 1.5rem;
          font-weight: 700;
          transition: transform 0.3s;
        }

        .provider-module-card:hover .provider-module-arrow {
          transform: translateX(8px);
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
