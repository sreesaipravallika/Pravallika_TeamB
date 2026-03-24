/**
 * LocationSelector.tsx
 * Modern location selection component with GPS detection and manual search
 */

import { useState, useEffect, useRef } from "react";
import { MapPin, Search, X, Loader2, AlertCircle, Navigation } from "lucide-react";

interface LocationData {
  city: string;
  state: string;
  country: string;
  lat?: number;
  lon?: number;
}

interface LocationSelectorProps {
  onLocationChange?: (location: LocationData) => void;
}

// Popular Indian cities for quick selection
const POPULAR_CITIES = [
  { city: "Mumbai", state: "Maharashtra" },
  { city: "Delhi", state: "Delhi" },
  { city: "Bangalore", state: "Karnataka" },
  { city: "Hyderabad", state: "Telangana" },
  { city: "Chennai", state: "Tamil Nadu" },
  { city: "Kolkata", state: "West Bengal" },
  { city: "Pune", state: "Maharashtra" },
  { city: "Ahmedabad", state: "Gujarat" },
];

export default function LocationSelector({ onLocationChange }: LocationSelectorProps) {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check for saved location on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem("qs_location");
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation);
        setLocation(parsed);
      } catch (e) {
        console.error("Failed to parse saved location", e);
      }
    }
    // Do NOT show permission prompt automatically
    // User can click location button to set location manually
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Detect user's location using GPS
  async function detectLocation() {
    setIsDetecting(true);
    setError("");
    setShowPermissionPrompt(false);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use reverse geocoding to get location details
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );
          
          if (!response.ok) throw new Error("Failed to fetch location");
          
          const data = await response.json();
          const address = data.address;
          
          const locationData: LocationData = {
            city: address.city || address.town || address.village || "Unknown",
            state: address.state || "Unknown",
            country: address.country || "Unknown",
            lat: latitude,
            lon: longitude,
          };
          
          setLocation(locationData);
          localStorage.setItem("qs_location", JSON.stringify(locationData));
          onLocationChange?.(locationData);
          setIsOpen(false);
        } catch (err) {
          setError("Failed to fetch location details. Please try manual search.");
        } finally {
          setIsDetecting(false);
        }
      },
      (err) => {
        setIsDetecting(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Location permission denied. Please enable location access or search manually.");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Location information unavailable. Please search manually.");
            break;
          case err.TIMEOUT:
            setError("Location request timed out. Please try again.");
            break;
          default:
            setError("An error occurred while detecting location.");
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }

  // Handle manual location selection
  function selectLocation(city: string, state: string) {
    const locationData: LocationData = {
      city,
      state,
      country: "India",
    };
    setLocation(locationData);
    localStorage.setItem("qs_location", JSON.stringify(locationData));
    onLocationChange?.(locationData);
    setIsOpen(false);
    setSearchQuery("");
    setError("");
  }

  // Filter cities based on search query
  const filteredCities = POPULAR_CITIES.filter(
    (loc) =>
      loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Location button in navbar */}
      <div className="location-selector" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="location-btn"
          aria-label="Select location"
        >
          <MapPin size={18} />
          <span className="location-text">
            {location ? `${location.city}, ${location.state}` : "Select Location"}
          </span>
        </button>

        {/* Dropdown panel */}
        {isOpen && (
          <div className="location-dropdown animate-slide-down">
            <div className="location-header">
              <h3 className="location-title">Select Your Location</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="location-close"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Detect location button */}
            <button
              onClick={detectLocation}
              disabled={isDetecting}
              className="detect-btn"
            >
              {isDetecting ? (
                <>
                  <Loader2 size={18} className="spinner" />
                  Detecting location...
                </>
              ) : (
                <>
                  <Navigation size={18} />
                  Use Current Location
                </>
              )}
            </button>

            {/* Error message */}
            {error && (
              <div className="location-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Search input */}
            <div className="search-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search city or state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Popular cities list */}
            <div className="cities-list">
              <p className="cities-label">Popular Cities</p>
              {filteredCities.length > 0 ? (
                filteredCities.map((loc) => (
                  <button
                    key={`${loc.city}-${loc.state}`}
                    onClick={() => selectLocation(loc.city, loc.state)}
                    className="city-item"
                  >
                    <MapPin size={14} />
                    <span>
                      {loc.city}, {loc.state}
                    </span>
                  </button>
                ))
              ) : (
                <p className="no-results">No cities found</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Permission prompt modal */}
      {showPermissionPrompt && (
        <div className="permission-overlay" onClick={() => setShowPermissionPrompt(false)}>
          <div className="permission-modal animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="permission-icon">
              <MapPin size={48} />
            </div>
            <h2 className="permission-title">Enable Location Access</h2>
            <p className="permission-text">
              Allow QuickServIndia to access your location to find nearby service providers and show relevant results.
            </p>
            <div className="permission-actions">
              <button onClick={detectLocation} className="permission-btn-primary">
                <Navigation size={18} />
                Allow Location Access
              </button>
              <button
                onClick={() => {
                  setShowPermissionPrompt(false);
                  setIsOpen(true);
                }}
                className="permission-btn-secondary"
              >
                Enter Manually
              </button>
            </div>
            <button
              onClick={() => setShowPermissionPrompt(false)}
              className="permission-skip"
            >
              Skip for now
            </button>
          </div>
        </div>
      )}

      <style>{`
        .location-selector {
          position: relative;
        }

        .location-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1rem;
          background: hsl(var(--background));
          border: 2px solid hsl(var(--border));
          border-radius: calc(var(--radius) - 4px);
          color: hsl(var(--foreground));
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }
        .location-btn:hover {
          border-color: hsl(var(--primary));
          box-shadow: 0 4px 15px hsl(var(--primary) / 0.15);
        }
        .location-text {
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .location-dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          width: 340px;
          background: hsl(var(--card));
          border: 2px solid hsl(var(--border));
          border-radius: var(--radius);
          box-shadow: 0 20px 60px hsl(0 0% 0% / 0.2);
          z-index: 50;
          overflow: hidden;
        }

        .location-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 2px solid hsl(var(--border));
        }
        .location-title {
          font-family: 'Poppins', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0;
          color: hsl(var(--foreground));
        }
        .location-close {
          background: none;
          border: none;
          color: hsl(var(--muted-foreground));
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 6px;
          transition: all 0.2s;
        }
        .location-close:hover {
          background: hsl(var(--muted));
          color: hsl(var(--foreground));
        }

        .detect-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          width: calc(100% - 3rem);
          margin: 1rem 1.5rem;
          padding: 0.85rem;
          background: var(--gradient-primary);
          color: hsl(var(--primary-foreground));
          border: none;
          border-radius: calc(var(--radius) - 4px);
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s;
        }
        .detect-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px hsl(var(--primary) / 0.35);
        }
        .detect-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .spinner {
          animation: spin 0.7s linear infinite;
        }

        .location-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0 1.5rem 1rem;
          padding: 0.75rem;
          background: hsl(var(--destructive) / 0.1);
          border: 1px solid hsl(var(--destructive) / 0.3);
          border-radius: calc(var(--radius) - 4px);
          color: hsl(var(--destructive));
          font-size: 0.85rem;
          font-weight: 600;
        }

        .search-wrapper {
          position: relative;
          margin: 0 1.5rem 1rem;
        }
        .search-icon {
          position: absolute;
          left: 0.85rem;
          top: 50%;
          transform: translateY(-50%);
          color: hsl(var(--muted-foreground));
        }
        .search-input {
          width: 100%;
          padding: 0.75rem 0.85rem 0.75rem 2.5rem;
          border: 2px solid hsl(var(--border));
          border-radius: calc(var(--radius) - 4px);
          font-size: 0.9rem;
          background: hsl(var(--background));
          color: hsl(var(--foreground));
          outline: none;
          transition: all 0.3s;
        }
        .search-input:focus {
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 3px hsl(var(--primary) / 0.1);
        }

        .cities-list {
          max-height: 280px;
          overflow-y: auto;
          padding: 0 1.5rem 1.5rem;
        }
        .cities-label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: hsl(var(--muted-foreground));
          margin: 0 0 0.75rem;
        }
        .city-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          width: 100%;
          padding: 0.75rem 0.85rem;
          background: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          border-radius: calc(var(--radius) - 4px);
          font-size: 0.9rem;
          font-weight: 600;
          color: hsl(var(--foreground));
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 0.5rem;
          text-align: left;
        }
        .city-item:hover {
          background: hsl(var(--primary) / 0.1);
          border-color: hsl(var(--primary));
          transform: translateX(4px);
        }
        .no-results {
          text-align: center;
          color: hsl(var(--muted-foreground));
          font-size: 0.9rem;
          padding: 2rem 0;
        }

        /* Permission Modal */
        .permission-overlay {
          position: fixed;
          inset: 0;
          background: hsl(240 30% 15% / 0.7);
          backdrop-filter: blur(8px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          animation: fadeIn 0.3s ease-out;
        }

        .permission-modal {
          background: hsl(var(--card));
          border-radius: var(--radius);
          padding: 2.5rem 2rem;
          max-width: 440px;
          width: 100%;
          text-align: center;
          box-shadow: 0 25px 70px hsl(0 0% 0% / 0.3);
          border: 2px solid hsl(var(--border));
        }

        .permission-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 1.5rem;
          background: var(--gradient-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .permission-title {
          font-family: 'Poppins', sans-serif;
          font-size: 1.75rem;
          font-weight: 800;
          margin: 0 0 1rem;
          color: hsl(var(--foreground));
        }

        .permission-text {
          font-size: 1rem;
          line-height: 1.6;
          color: hsl(var(--muted-foreground));
          margin: 0 0 2rem;
        }

        .permission-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .permission-btn-primary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          padding: 1rem 1.5rem;
          background: var(--gradient-primary);
          color: hsl(var(--primary-foreground));
          border: none;
          border-radius: calc(var(--radius) - 4px);
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 8px 25px hsl(var(--primary) / 0.35);
        }
        .permission-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px hsl(var(--primary) / 0.45);
        }

        .permission-btn-secondary {
          padding: 0.9rem 1.5rem;
          background: hsl(var(--background));
          color: hsl(var(--foreground));
          border: 2px solid hsl(var(--border));
          border-radius: calc(var(--radius) - 4px);
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s;
        }
        .permission-btn-secondary:hover {
          border-color: hsl(var(--primary));
          background: hsl(var(--primary) / 0.05);
        }

        .permission-skip {
          background: none;
          border: none;
          color: hsl(var(--muted-foreground));
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0.5rem;
          transition: color 0.2s;
        }
        .permission-skip:hover {
          color: hsl(var(--foreground));
        }

        /* Responsive */
        @media (max-width: 640px) {
          .location-dropdown {
            position: fixed;
            top: auto;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            border-radius: var(--radius) var(--radius) 0 0;
          }
          .location-text {
            max-width: 100px;
          }
          .permission-modal {
            padding: 2rem 1.5rem;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
