/**
 * SimpleProviderView.tsx - Simple Service Provider Finder
 * View providers by location with timings and price range
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/auth";

// Provider Data Structure
interface Provider {
  providerName: string;
  brandName: string;
  category: string;
  serviceArea: string;
  timings: string;
  priceRange: string;
}

// Service Providers Data
const SERVICE_PROVIDERS: Provider[] = [
  {
    providerName: "QuickFix Solutions",
    brandName: "QuickFix Pro",
    category: "Plumbing",
    serviceArea: "Mumbai",
    timings: "9:00 AM - 11:00 AM, 2:00 PM - 5:00 PM",
    priceRange: "₹500 - ₹1500"
  },
  {
    providerName: "Elite Electricals",
    brandName: "PowerPro Services",
    category: "Electrical",
    serviceArea: "Mumbai",
    timings: "8:00 AM - 12:00 PM, 3:00 PM - 7:00 PM",
    priceRange: "₹600 - ₹1800"
  },
  {
    providerName: "SparkClean Services",
    brandName: "SparkClean Pro",
    category: "Cleaning",
    serviceArea: "Delhi",
    timings: "7:00 AM - 1:00 PM, 4:00 PM - 8:00 PM",
    priceRange: "₹400 - ₹1200"
  },
  {
    providerName: "Glamour Salon",
    brandName: "Glamour Studio",
    category: "Salon & Beauty",
    serviceArea: "Bangalore",
    timings: "10:00 AM - 8:00 PM",
    priceRange: "₹800 - ₹2000"
  },
  {
    providerName: "Master Carpenters",
    brandName: "WoodCraft Masters",
    category: "Carpentry",
    serviceArea: "Delhi",
    timings: "8:00 AM - 6:00 PM",
    priceRange: "₹700 - ₹2500"
  },
  {
    providerName: "ColorPro Painters",
    brandName: "ColorPro Elite",
    category: "Painting",
    serviceArea: "Bangalore",
    timings: "7:00 AM - 5:00 PM",
    priceRange: "₹1000 - ₹3000"
  },
  {
    providerName: "HomeFlow Plumbing",
    brandName: "HomeFlow Services",
    category: "Plumbing",
    serviceArea: "Pune",
    timings: "9:00 AM - 6:00 PM",
    priceRange: "₹450 - ₹1400"
  },
  {
    providerName: "BrightSpark Electricals",
    brandName: "BrightSpark Pro",
    category: "Electrical",
    serviceArea: "Pune",
    timings: "8:00 AM - 7:00 PM",
    priceRange: "₹550 - ₹1600"
  },
  {
    providerName: "FreshHome Cleaners",
    brandName: "FreshHome Elite",
    category: "Cleaning",
    serviceArea: "Chennai",
    timings: "7:00 AM - 6:00 PM",
    priceRange: "₹500 - ₹1500"
  },
  {
    providerName: "Style Studio",
    brandName: "Style Studio Premium",
    category: "Salon & Beauty",
    serviceArea: "Chennai",
    timings: "10:00 AM - 9:00 PM",
    priceRange: "₹900 - ₹2500"
  }
];

export default function SimpleProviderView() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  const searchProviders = () => {
    if (!location.trim()) {
      alert("⚠️ Please enter a city name!");
      return;
    }

    // Filter providers by location (case-insensitive)
    const matches = SERVICE_PROVIDERS.filter(
      provider => provider.serviceArea.toLowerCase() === location.toLowerCase()
    );

    setFilteredProviders(matches);
    setSearched(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchProviders();
    }
  };

  return (
    <div className="simple-provider-view">
      {/* Header */}
      <header className="spv-header">
        <button onClick={() => navigate("/dashboard")} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>🔍 Service Provider Finder</h1>
        <p>Find trusted service providers in your area</p>
      </header>

      {/* Search Box */}
      <div className="search-container">
        <div className="search-box">
          <label htmlFor="location">📍 Enter Your City:</label>
          <div className="search-input-group">
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Mumbai, Delhi, Bangalore, Pune, Chennai"
              className="location-input"
            />
            <button onClick={searchProviders} className="search-btn">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {searched && (
        <div className="results-container">
          {filteredProviders.length > 0 ? (
            <>
              <div className="results-count">
                ✅ Found {filteredProviders.length} provider(s) in {location}
              </div>
              <div className="providers-grid">
                {filteredProviders.map((provider, index) => (
                  <div key={index} className="provider-card">
                    <h3>{provider.providerName}</h3>
                    <span className="brand">🏢 {provider.brandName}</span>
                    <div className="provider-info">
                      <p><strong>Category:</strong> {provider.category}</p>
                      <p><strong>Service Area:</strong> {provider.serviceArea}</p>
                      <p><strong>Available Timings:</strong> {provider.timings}</p>
                      <p><strong>Price Range:</strong> {provider.priceRange}</p>
                    </div>
                    <span className="category-badge">{provider.category}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h2>No Services Available</h2>
              <p>We couldn't find any service providers in {location}.</p>
              <p>Try: Mumbai, Delhi, Bangalore, Pune, or Chennai</p>
            </div>
          )}
        </div>
      )}

      <style>{`
        .simple-provider-view {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
        }

        .spv-header {
          text-align: center;
          color: white;
          margin-bottom: 2rem;
          position: relative;
        }

        .back-btn {
          position: absolute;
          left: 0;
          top: 0;
          padding: 0.75rem 1.5rem;
          background: white;
          border: none;
          border-radius: 8px;
          color: #667eea;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          background: #f0f0f0;
          transform: translateY(-2px);
        }

        .spv-header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .spv-header p {
          font-size: 1.2rem;
          opacity: 0.9;
        }

        .search-container {
          max-width: 800px;
          margin: 0 auto 2rem;
        }

        .search-box {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .search-box label {
          display: block;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #333;
        }

        .search-input-group {
          display: flex;
          gap: 1rem;
        }

        .location-input {
          flex: 1;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          border: 2px solid #ddd;
          border-radius: 8px;
          transition: border-color 0.3s ease;
        }

        .location-input:focus {
          outline: none;
          border-color: #667eea;
        }

        .search-btn {
          padding: 0.75rem 2rem;
          font-size: 1rem;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .search-btn:hover {
          background: #5568d3;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .results-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .results-count {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-weight: 600;
          backdrop-filter: blur(10px);
        }

        .providers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .provider-card {
          background: white;
          padding: 1.5rem;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          animation: fadeInUp 0.5s ease;
        }

        .provider-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .provider-card h3 {
          color: #333;
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
        }

        .brand {
          color: #667eea;
          font-weight: 600;
          display: block;
          margin-bottom: 1rem;
        }

        .provider-info {
          margin: 1rem 0;
        }

        .provider-info p {
          margin: 0.5rem 0;
          color: #666;
          font-size: 0.95rem;
        }

        .provider-info strong {
          color: #333;
        }

        .category-badge {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-top: 0.5rem;
        }

        .no-results {
          background: white;
          padding: 3rem 2rem;
          border-radius: 15px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .no-results-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .no-results h2 {
          color: #333;
          margin-bottom: 1rem;
        }

        .no-results p {
          color: #666;
          font-size: 1.1rem;
          margin: 0.5rem 0;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .simple-provider-view {
            padding: 1rem;
          }

          .back-btn {
            position: static;
            margin-bottom: 1rem;
            width: 100%;
          }

          .spv-header h1 {
            font-size: 2rem;
          }

          .search-input-group {
            flex-direction: column;
          }

          .search-btn {
            width: 100%;
          }

          .providers-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
