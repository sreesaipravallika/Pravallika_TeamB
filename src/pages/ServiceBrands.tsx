/**
 * ServiceBrands.tsx — Display all brands for a selected service
 */

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser, logoutUser } from "@/lib/auth";

interface Brand {
  name: string;
  rating: string;
  reviews: string;
  location: string;
  price?: string;  // Individual brand pricing
  discount?: string; // Optional discount
  image?: string; // Brand/service image
  verified?: boolean; // Verified badge
  responseTime?: string; // Response time (e.g., "Within 30 mins")
}

interface SubOption {
  icon: string;
  label: string;
  price: string;
  duration: string;
  brands?: Brand[];
  subTreatments?: string[]; // Sub-options like "Detox Cleanup", "Casmara Cleanup"
}

interface ServiceOption {
  icon: string;
  label: string;
  price: string;
  duration: string;
  brands?: Brand[];
  subTreatments?: string[]; // Sub-options
}

export default function ServiceBrands() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState("");
  
  // Coupon states
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [originalPrice, setOriginalPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [bookingLocation, setBookingLocation] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedSubTreatment, setSelectedSubTreatment] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  
  // Available coupons
  const OFFERS = [
    { code: "FIRST30", discount: "30% OFF", title: "First Booking Offer", icon: "🎉" },
    { code: "WEEKEND20", discount: "20% OFF", title: "Weekend Special", icon: "✨" },
    { code: "CLEAN500", discount: "₹500 OFF", title: "Cleaning Combo", icon: "🧹" },
    { code: "AC15", discount: "15% OFF", title: "AC Service Deal", icon: "❄️" }
  ];
  
  // Get service data from navigation state
  const serviceData = location.state as {
    serviceName: string;
    serviceIcon: string;
    serviceColor: string;
    option: ServiceOption;
  } | null;

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/login");
      return;
    }
    setUserName(user.name);

    // Redirect if no service data
    if (!serviceData) {
      navigate("/dashboard");
    }
  }, [navigate, serviceData]);

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  function handleBookBrand(brand: Brand) {
    // Extract price from brand or service option
    const priceStr = brand.price || serviceData?.option.price || "₹0";
    const price = parseInt(priceStr.replace(/[^0-9]/g, ''));
    
    console.log("Opening booking modal for:", brand.name, "Price:", price);
    
    setSelectedBrand(brand);
    setOriginalPrice(price);
    setFinalPrice(price);
    setShowBookingModal(true);
    setCouponCode("");
    setAppliedCoupon(null);
    setCouponError("");
  }

  function applyCoupon() {
    setCouponError("");
    
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    // Find matching coupon
    const coupon = OFFERS.find(offer => 
      offer.code.toUpperCase() === couponCode.toUpperCase()
    );

    if (!coupon) {
      setCouponError("Invalid coupon code");
      setAppliedCoupon(null);
      setFinalPrice(originalPrice);
      return;
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discount.includes('%')) {
      // Percentage discount
      const percentage = parseInt(coupon.discount);
      discountAmount = (originalPrice * percentage) / 100;
      console.log(`Percentage discount: ${percentage}% of ₹${originalPrice} = ₹${discountAmount}`);
    } else {
      // Fixed amount discount
      discountAmount = parseInt(coupon.discount.replace(/[^0-9]/g, ''));
      console.log(`Fixed discount: ₹${discountAmount}`);
    }

    // Round off the final price to nearest integer
    const newPrice = Math.round(Math.max(0, originalPrice - discountAmount));
    console.log(`Original: ₹${originalPrice}, Discount: ₹${discountAmount}, Final: ₹${newPrice}`);
    
    setFinalPrice(newPrice);
    setAppliedCoupon(coupon);
    setCouponError("");
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponCode("");
    setFinalPrice(originalPrice);
    setCouponError("");
  }

  function confirmBooking() {
    if (serviceData?.option.subTreatments && serviceData.option.subTreatments.length > 0 && !selectedSubTreatment) {
      alert("Please select a treatment type");
      return;
    }

    if (!bookingLocation.trim()) {
      alert("Please enter your location");
      return;
    }

    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    // Save booking
    const booking = {
      id: Date.now().toString(),
      serviceName: serviceData?.serviceName,
      serviceLabel: serviceData?.option.label,
      serviceIcon: serviceData?.serviceIcon,
      serviceOption: serviceData?.option.label,
      subTreatment: selectedSubTreatment || null,
      providerName: selectedBrand?.name,
      brandName: selectedBrand?.name,
      price: finalPrice,
      originalPrice: originalPrice,
      discount: appliedCoupon ? appliedCoupon.discount : null,
      location: bookingLocation,
      paymentMethod: paymentMethod,
      date: new Date().toLocaleDateString("en-IN"),
      bookingDate: new Date().toLocaleString(),
      status: "pending",
      image: selectedBrand?.image
    };

    // Get existing bookings
    const existingBookings = JSON.parse(localStorage.getItem("qs_bookings") || "[]");
    existingBookings.push(booking);
    localStorage.setItem("qs_bookings", JSON.stringify(existingBookings));

    // Show success popup instead of alert
    setBookingDetails(booking);
    setShowSuccessPopup(true);
    setShowBookingModal(false);
  }

  function closeSuccessPopup() {
    setShowSuccessPopup(false);
    navigate("/dashboard");
  }

  if (!serviceData) {
    return null;
  }

  const { serviceName, serviceIcon, serviceColor, option } = serviceData;
  const brands = option.brands || [];

  // Calculate starting price (lowest price among all brands)
  const getStartingPrice = () => {
    if (brands.length === 0) {
      return option.price;
    }
    
    const prices = brands
      .map(brand => {
        const priceStr = brand.price || option.price;
        return parseInt(priceStr.replace(/[^0-9]/g, ''));
      })
      .filter(price => !isNaN(price));
    
    if (prices.length === 0) {
      return option.price;
    }
    
    const minPrice = Math.min(...prices);
    return `Starting from ₹${minPrice}`;
  };

  return (
    <div className="service-brands-page">
      {/* Navbar */}
      <header className="db-nav">
        <div className="db-nav-left">
          <div className="db-logo" onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
            ⚡ QuickServIndia
          </div>
        </div>
        <div className="db-nav-right">
          <span className="db-greeting">Hi, {userName.split(" ")[0]} 👋</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="brands-main">
        {/* Back Button */}
        <button onClick={() => navigate("/dashboard")} className="back-button">
          ← Back to Dashboard
        </button>

        {/* Service Header */}
        <div className="brands-header" style={{ background: `linear-gradient(135deg, ${serviceColor} 0%, hsl(210 85% 60%) 100%)` }}>
          <div className="brands-header-content">
            <span className="brands-header-icon">{serviceIcon}</span>
            <div>
              <h1 className="brands-title">{serviceName}</h1>
              <p className="brands-subtitle">{option.icon} {option.label}</p>
            </div>
          </div>
          <div className="brands-header-meta">
            <div className="meta-item">
              <span className="meta-label">Price</span>
              <span className="meta-value">{getStartingPrice()}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Duration</span>
              <span className="meta-value">{option.duration}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Providers</span>
              <span className="meta-value">{brands.length}</span>
            </div>
          </div>
        </div>

        {/* Brands Grid */}
        <div className="brands-container">
          <h2 className="brands-section-title">
            🏢 Available Service Providers ({brands.length})
          </h2>
          
          {brands.length === 0 ? (
            <div className="no-brands">
              <p>No providers available for this service yet.</p>
              <button onClick={() => navigate("/dashboard")} className="btn-primary">
                Back to Dashboard
              </button>
            </div>
          ) : (
            <div className="brands-grid">
              {brands.map((brand, index) => (
                <div key={index} className="brand-card">
                  {/* Brand Image */}
                  {brand.image && (
                    <div className="brand-card-image" style={{ backgroundImage: `url(${brand.image})` }}>
                      <div className="brand-card-image-overlay"></div>
                      {brand.discount && (
                        <div className="brand-discount-badge">{brand.discount} OFF</div>
                      )}
                      {brand.verified && (
                        <div className="brand-verified-badge">✓ Verified</div>
                      )}
                    </div>
                  )}
                  
                  <div className="brand-card-content">
                    <div className="brand-card-header">
                      <div className="brand-icon">🏢</div>
                      <div className="brand-info-main">
                        <h3 className="brand-name">{brand.name}</h3>
                        <p className="brand-location">📍 {brand.location}</p>
                      </div>
                    </div>
                    
                    <div className="brand-stats">
                      <div className="stat-item">
                        <span className="stat-icon">⭐</span>
                        <span className="stat-value">{brand.rating}</span>
                        <span className="stat-label">Rating</span>
                      </div>
                      <div className="stat-divider"></div>
                      <div className="stat-item">
                        <span className="stat-icon">💬</span>
                        <span className="stat-value">{brand.reviews}</span>
                        <span className="stat-label">Reviews</span>
                      </div>
                      {brand.responseTime && (
                        <>
                          <div className="stat-divider"></div>
                          <div className="stat-item">
                            <span className="stat-icon">⚡</span>
                            <span className="stat-value-small">{brand.responseTime}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="brand-details">
                      <div className="detail-row">
                        <span className="detail-label">Service:</span>
                        <span className="detail-value">{option.label}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Price:</span>
                        <span className="detail-value detail-price" style={{ color: serviceColor }}>
                          {brand.price || option.price}
                          {brand.discount && !brand.image && (
                            <span className="brand-discount-inline"> {brand.discount} OFF</span>
                          )}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Duration:</span>
                        <span className="detail-value">{option.duration}</span>
                      </div>
                    </div>

                    <button 
                      className="brand-book-btn"
                      style={{ background: serviceColor }}
                      onClick={() => handleBookBrand(brand)}
                    >
                      Book with {brand.name.split(' ')[0]}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Booking Modal with Coupon - Moved outside main for proper overlay */}
      {showBookingModal && selectedBrand && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal-sheet animate-slide-up" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header" style={{ background: serviceData?.serviceColor }}>
              <div className="modal-header-left">
                <span className="modal-header-icon">🎫</span>
                <div>
                  <h2 className="modal-title">Complete Booking</h2>
                  <p className="modal-subtitle">{selectedBrand.name}</p>
                </div>
              </div>
              <button onClick={() => setShowBookingModal(false)} className="modal-close-btn">✕</button>
            </div>

            <div className="modal-body" style={{ padding: '24px' }}>
              {/* Service Details */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  📋 Service Details
                </h4>
                <div style={{ background: '#f9f9f9', padding: '16px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#666' }}>Service:</span>
                    <span style={{ fontWeight: '600' }}>{serviceData?.option.label}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#666' }}>Provider:</span>
                    <span style={{ fontWeight: '600' }}>{selectedBrand.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#666' }}>Location:</span>
                    <span style={{ fontWeight: '600' }}>{selectedBrand.location}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#666' }}>Duration:</span>
                    <span style={{ fontWeight: '600' }}>{serviceData?.option.duration}</span>
                  </div>
                </div>
              </div>

              {/* Sub-Treatment Selection (if available) */}
              {serviceData?.option.subTreatments && serviceData.option.subTreatments.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    ✨ Select Treatment Type
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                    {serviceData.option.subTreatments.map((treatment) => (
                      <button
                        key={treatment}
                        onClick={() => setSelectedSubTreatment(treatment)}
                        style={{
                          padding: '12px',
                          borderRadius: '10px',
                          border: selectedSubTreatment === treatment ? `2px solid ${serviceData?.serviceColor || '#8b5cf6'}` : '2px solid #e0e0e0',
                          background: selectedSubTreatment === treatment ? `${serviceData?.serviceColor || '#8b5cf6'}10` : 'white',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '600',
                          transition: 'all 0.2s ease',
                          color: selectedSubTreatment === treatment ? serviceData?.serviceColor || '#8b5cf6' : '#333',
                          textAlign: 'center'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedSubTreatment !== treatment) {
                            e.currentTarget.style.borderColor = '#bbb';
                            e.currentTarget.style.background = '#f9f9f9';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedSubTreatment !== treatment) {
                            e.currentTarget.style.borderColor = '#e0e0e0';
                            e.currentTarget.style.background = 'white';
                          }
                        }}
                      >
                        {treatment}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Location Input */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  📍 Your Location
                </h4>
                <input
                  type="text"
                  placeholder="Enter your address..."
                  value={bookingLocation}
                  onChange={(e) => setBookingLocation(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px', 
                    borderRadius: '8px', 
                    border: '2px solid #e0e0e0',
                    fontSize: '14px',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = serviceData?.serviceColor || '#8b5cf6'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              {/* Payment Method Selection */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  💳 Payment Method
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
                    { id: 'upi', label: 'UPI', icon: '📱' },
                    { id: 'cash', label: 'Cash on Service', icon: '💵' },
                    { id: 'wallet', label: 'Wallet', icon: '👛' }
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.label)}
                      style={{
                        padding: '14px',
                        borderRadius: '10px',
                        border: paymentMethod === method.label ? `2px solid ${serviceData?.serviceColor || '#8b5cf6'}` : '2px solid #e0e0e0',
                        background: paymentMethod === method.label ? `${serviceData?.serviceColor || '#8b5cf6'}10` : 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                        color: paymentMethod === method.label ? serviceData?.serviceColor || '#8b5cf6' : '#333'
                      }}
                      onMouseEnter={(e) => {
                        if (paymentMethod !== method.label) {
                          e.currentTarget.style.borderColor = '#bbb';
                          e.currentTarget.style.background = '#f9f9f9';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (paymentMethod !== method.label) {
                          e.currentTarget.style.borderColor = '#e0e0e0';
                          e.currentTarget.style.background = 'white';
                        }
                      }}
                    >
                      <span style={{ fontSize: '20px' }}>{method.icon}</span>
                      <span>{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Coupon Section */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  🎟️ Apply Coupon Code
                </h4>
                
                {!appliedCoupon ? (
                  <>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        style={{ 
                          flex: 1, 
                          padding: '12px 16px', 
                          borderRadius: '8px', 
                          border: '2px solid #e0e0e0',
                          fontSize: '14px',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}
                      />
                      <button
                        onClick={applyCoupon}
                        style={{ 
                          padding: '12px 24px', 
                          borderRadius: '8px', 
                          background: serviceData?.serviceColor || '#8b5cf6', 
                          color: 'white', 
                          border: 'none', 
                          cursor: 'pointer', 
                          fontWeight: '700',
                          fontSize: '14px',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        Apply
                      </button>
                    </div>

                    {/* Available Coupons */}
                    <div>
                      <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>Available Coupons:</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {OFFERS.map((offer) => (
                          <button
                            key={offer.code}
                            onClick={() => {
                              setCouponCode(offer.code);
                              setCouponError("");
                            }}
                            style={{ 
                              padding: '8px 14px', 
                              borderRadius: '20px', 
                              background: 'linear-gradient(135deg, #f3e8ff, #ede9fe)', 
                              border: '1px solid #e9d5ff', 
                              cursor: 'pointer', 
                              fontSize: '12px',
                              fontWeight: '600',
                              color: '#7c3aed',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'linear-gradient(135deg, #8b5cf6, #7c3aed)';
                              e.currentTarget.style.color = 'white';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'linear-gradient(135deg, #f3e8ff, #ede9fe)';
                              e.currentTarget.style.color = '#7c3aed';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            {offer.icon} {offer.code}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '16px', 
                    background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', 
                    borderRadius: '12px',
                    border: '2px solid #10b981'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '24px' }}>{appliedCoupon.icon}</span>
                      <div>
                        <p style={{ fontWeight: '700', fontSize: '14px', color: '#065f46', margin: 0 }}>
                          {appliedCoupon.title}
                        </p>
                        <p style={{ fontSize: '13px', color: '#047857', margin: 0, fontWeight: '600' }}>
                          {appliedCoupon.discount} applied
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        cursor: 'pointer', 
                        fontSize: '20px',
                        color: '#047857',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#a7f3d0';
                        e.currentTarget.style.color = '#065f46';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#047857';
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}

                {couponError && (
                  <div style={{ 
                    color: '#dc2626', 
                    fontSize: '13px', 
                    marginTop: '8px',
                    padding: '8px 12px',
                    background: '#fee2e2',
                    borderRadius: '6px',
                    borderLeft: '3px solid #dc2626'
                  }}>
                    ⚠️ {couponError}
                  </div>
                )}
              </div>

              {/* Price Summary */}
              <div style={{ 
                background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)', 
                padding: '20px', 
                borderRadius: '12px',
                border: '2px solid #e9d5ff'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                  <span style={{ color: '#4b5563' }}>Service Price:</span>
                  <span style={{ fontWeight: '600' }}>₹{originalPrice}</span>
                </div>
                {appliedCoupon && (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '12px', 
                    fontSize: '14px',
                    color: '#059669',
                    fontWeight: '600'
                  }}>
                    <span>Discount ({appliedCoupon.code}):</span>
                    <span style={{ fontWeight: '700' }}>- ₹{Math.round(originalPrice - finalPrice)}</span>
                  </div>
                )}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  paddingTop: '16px', 
                  borderTop: '2px solid #e9d5ff',
                  alignItems: 'center'
                }}>
                  <span style={{ fontWeight: '700', fontSize: '16px' }}>Total Amount:</span>
                  <span style={{ 
                    fontSize: '28px', 
                    fontWeight: '800',
                    background: `linear-gradient(135deg, ${serviceData?.serviceColor || '#8b5cf6'}, #7c3aed)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    ₹{finalPrice}
                  </span>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={confirmBooking}
                style={{ 
                  width: '100%', 
                  padding: '16px', 
                  marginTop: '20px', 
                  borderRadius: '12px', 
                  background: serviceData?.serviceColor || '#8b5cf6', 
                  color: 'white', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontWeight: '700', 
                  fontSize: '16px',
                  boxShadow: `0 4px 15px ${serviceData?.serviceColor || '#8b5cf6'}40`,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = `0 8px 25px ${serviceData?.serviceColor || '#8b5cf6'}60`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 4px 15px ${serviceData?.serviceColor || '#8b5cf6'}40`;
                }}
              >
                Confirm Booking • ₹{finalPrice}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && bookingDetails && (
        <>
          <div className="modal-overlay" onClick={closeSuccessPopup}>
            <div className="success-popup" onClick={(e) => e.stopPropagation()}>
              <div className="success-icon">
                ✓
              </div>
              <h2 className="success-title">Booking Confirmed!</h2>
              <p className="success-message">
                Your service has been successfully booked. We'll send you a confirmation shortly.
              </p>
              <div className="success-details">
                <div className="success-detail-row">
                  <span className="success-detail-label">Service:</span>
                  <span className="success-detail-value">{bookingDetails.serviceOption}</span>
                </div>
                {bookingDetails.subTreatment && (
                  <div className="success-detail-row">
                    <span className="success-detail-label">Treatment:</span>
                    <span className="success-detail-value">{bookingDetails.subTreatment}</span>
                  </div>
                )}
                <div className="success-detail-row">
                  <span className="success-detail-label">Provider:</span>
                  <span className="success-detail-value">{bookingDetails.brand}</span>
                </div>
                <div className="success-detail-row">
                  <span className="success-detail-label">Payment:</span>
                  <span className="success-detail-value">{bookingDetails.paymentMethod}</span>
                </div>
                <div className="success-detail-row">
                  <span className="success-detail-label">Total Amount:</span>
                  <span className="success-detail-value" style={{ color: '#10b981', fontSize: '18px' }}>
                    {bookingDetails.price}
                  </span>
                </div>
              </div>
              <button className="success-button" onClick={closeSuccessPopup}>
                Back to Dashboard
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
