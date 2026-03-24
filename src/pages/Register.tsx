/**
 * Register.tsx — QuickServIndia Registration Page
 * ────────────────────────────────────────────
 * STEP-BY-STEP EXPLANATION:
 *
 * 1. We maintain four controlled inputs: name, email, password, confirmPassword.
 *    Each gets its own error state string (empty = no error).
 *
 * 2. `validate()` runs ALL checks at once before we touch localStorage:
 *    - Name: not empty, at least 2 chars
 *    - Email: valid format regex
 *    - Password: minimum 6 characters
 *    - Confirm: must match password exactly
 *
 * 3. `registerUser()` from auth.ts does a final check (email already exists?)
 *    and saves the user to localStorage["qs_users"].
 *
 * 4. On success we show a green banner for 1.5 s then redirect to /login.
 *
 * 5. Password strength meter gives visual feedback while typing.
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import AuthInput from "@/components/AuthInput";
import { registerCustomer, registerProvider, registerAdmin, type UserRole } from "@/lib/auth";
import { registerCustomerAPI, registerProviderAPI, registerAdminAPI, storeAuthData } from "@/lib/api";

/** Returns 0-4 strength score based on password content */
function passwordStrength(pwd: string): number {
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9!@#$%^&*]/.test(pwd)) score++;
  return score;
}

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["", "hsl(var(--destructive))", "hsl(36 100% 50%)", "hsl(48 96% 45%)", "hsl(var(--success))"];

export default function Register() {
  const navigate = useNavigate();

  // Common fields
  const [role, setRole] = useState<UserRole>("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Customer fields
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  // Provider fields
  const [businessName, setBusinessName] = useState("");
  const [serviceCategories, setServiceCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  
  // Temporary input fields for adding services and locations
  const [tempService, setTempService] = useState("");
  const [tempLocation, setTempLocation] = useState("");

  // Admin fields
  const [adminKey, setAdminKey] = useState("");

  const [errors, setErrors] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirm: "", 
    phone: "", 
    location: "", 
    businessName: "", 
    serviceCategories: "", 
    locations: "", 
    adminKey: "" 
  });
  const [banner, setBanner] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);

  const pwdScore = passwordStrength(password);

  function validate() {
    const e = { name: "", email: "", password: "", confirm: "", phone: "", location: "", businessName: "", serviceCategories: "", locations: "", adminKey: "" };
    
    // Common validations
    if (!name.trim()) e.name = "Full name is required.";
    else if (name.trim().length < 2) e.name = "Name must be at least 2 characters.";

    if (!email.trim()) e.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address.";

    if (!password) e.password = "Password is required.";
    else if (password.length < 6) e.password = "Password must be at least 6 characters.";

    if (!confirmPassword) e.confirm = "Please confirm your password.";
    else if (confirmPassword !== password) e.confirm = "Passwords do not match.";

    // Role-specific validations
    if (role === "customer") {
      if (!phone.trim()) e.phone = "Phone number is required.";
      if (!location.trim()) e.location = "Location is required.";
    } else if (role === "provider") {
      if (!businessName.trim()) e.businessName = "Business name is required.";
      if (serviceCategories.length === 0) e.serviceCategories = "Add at least one service category.";
      if (locations.length === 0) e.locations = "Add at least one service location.";
      if (!phone.trim()) e.phone = "Phone number is required.";
    } else if (role === "admin") {
      if (!adminKey.trim()) e.adminKey = "Admin key is required.";
    }

    setErrors(e);
    return Object.values(e).every((v) => v === "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBanner(null);

    if (!validate()) {
      setShaking(true);
      setTimeout(() => setShaking(false), 450);
      return;
    }

    setLoading(true);

    try {
      let result;

      // Call appropriate registration API based on role
      if (role === "customer") {
        result = await registerCustomerAPI({
          name,
          email,
          phone,
          password,
          location,
        });
        // Also store in localStorage for backward compatibility
        registerCustomer(name, email, phone, password, location);
      } else if (role === "provider") {
        result = await registerProviderAPI({
          name,
          email,
          businessName,
          serviceCategory: serviceCategories.join(", "), // Join array to string for backend
          location: locations.join(", "), // Join array to string for backend
          phone,
          password,
        });
        // Also store in localStorage for backward compatibility
        registerProvider(name, businessName, serviceCategories.join(", "), locations.join(", "), email, phone, password);
      } else if (role === "admin") {
        result = await registerAdminAPI({
          name,
          email,
          password,
          adminKey,
        });
        // Also store in localStorage for backward compatibility
        registerAdmin(name, email, password, adminKey);
      }

      if (result && !result.success) {
        setBanner({ type: "error", msg: result.error || "Registration failed" });
        setShaking(true);
        setTimeout(() => setShaking(false), 450);
      } else if (result && result.data) {
        // Store authentication data
        storeAuthData(result.data);
        
        // Log REGISTRATION activity
        try {
          await fetch('http://localhost:8080/api/activities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user: { id: result.data.id },
              activityType: 'REGISTRATION',
              activityDescription: `New ${role} account created: ${result.data.name}`,
              deviceInfo: navigator.userAgent
            })
          });
        } catch (activityError) {
          console.error('Failed to log registration activity:', activityError);
        }
        
        setBanner({ type: "success", msg: "Account created successfully! Redirecting to dashboard…" });
        
        // Redirect to appropriate dashboard based on role
        setTimeout(() => {
          const dashboardRoute = role === "customer" ? "/dashboard" : 
                                role === "provider" ? "/provider-dashboard" : 
                                "/admin-dashboard";
          navigate(dashboardRoute);
        }, 1600);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setBanner({ type: "error", msg: "An unexpected error occurred. Please try again." });
      setShaking(true);
      setTimeout(() => setShaking(false), 450);
    }

    setLoading(false);
  }

  return (
    <AuthLayout
      headline="Join thousands finding help nearby."
      subline="Register now and discover local service professionals in minutes."
    >
      {/* Mobile logo */}
      <div className="mobile-logo">
        <span>⚡</span> QuickServIndia
      </div>

      <h1 className="auth-title">Create your account</h1>
      <p className="auth-subtitle">It's free and takes less than a minute</p>

      {banner && (
        <div
          className={`auth-banner ${banner.type === "success" ? "auth-banner-success" : "auth-banner-error"}`}
          role="alert"
        >
          {banner.type === "success" ? "✅" : "⚠️"} {banner.msg}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={`auth-form${shaking ? " animate-shake" : ""}`}
        noValidate
      >
        {/* Role Selection */}
        <div className="role-selector">
          <label className="role-label">I am a:</label>
          <div className="role-options">
            <label className={`role-option ${role === "customer" ? "role-option-active" : ""}`}>
              <input
                type="radio"
                name="role"
                value="customer"
                checked={role === "customer"}
                onChange={(e) => setRole(e.target.value as UserRole)}
              />
              <div className="role-content">
                <span className="role-icon">👤</span>
                <span className="role-text">Customer</span>
              </div>
            </label>
            <label className={`role-option ${role === "provider" ? "role-option-active" : ""}`}>
              <input
                type="radio"
                name="role"
                value="provider"
                checked={role === "provider"}
                onChange={(e) => setRole(e.target.value as UserRole)}
              />
              <div className="role-content">
                <span className="role-icon">🏢</span>
                <span className="role-text">Provider</span>
              </div>
            </label>
            <label className={`role-option ${role === "admin" ? "role-option-active" : ""}`}>
              <input
                type="radio"
                name="role"
                value="admin"
                checked={role === "admin"}
                onChange={(e) => setRole(e.target.value as UserRole)}
              />
              <div className="role-content">
                <span className="role-icon">⚙️</span>
                <span className="role-text">Admin</span>
              </div>
            </label>
          </div>
        </div>

        {/* Common Fields */}
        <AuthInput
          id="name"
          label="Full Name"
          placeholder="Jane Doe"
          value={name}
          onChange={setName}
          error={errors.name}
          autoComplete="name"
        />

        <AuthInput
          id="email"
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
          error={errors.email}
          autoComplete="email"
        />

        {/* Customer-specific fields */}
        {role === "customer" && (
          <>
            <AuthInput
              id="phone"
              label="Phone Number"
              placeholder="1234567890"
              value={phone}
              onChange={setPhone}
              error={errors.phone}
              autoComplete="tel"
            />
            <AuthInput
              id="location"
              label="Location"
              placeholder="City, State"
              value={location}
              onChange={setLocation}
              error={errors.location}
              autoComplete="address-level2"
            />
          </>
        )}

        {/* Provider-specific fields */}
        {role === "provider" && (
          <>
            <AuthInput
              id="businessName"
              label="Business Name"
              placeholder="Your Business Name"
              value={businessName}
              onChange={setBusinessName}
              error={errors.businessName}
              autoComplete="organization"
            />
            
            {/* Service Categories */}
            <div>
              <label className="input-label">Service Categories *</label>
              <div className="multi-input-container">
                <div className="input-with-button">
                  <input
                    type="text"
                    placeholder="e.g., Plumbing, Salon, Cleaning"
                    value={tempService}
                    onChange={(e) => setTempService(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (tempService.trim() && !serviceCategories.includes(tempService.trim())) {
                          setServiceCategories([...serviceCategories, tempService.trim()]);
                          setTempService("");
                        }
                      }
                    }}
                    className="multi-input"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (tempService.trim() && !serviceCategories.includes(tempService.trim())) {
                        setServiceCategories([...serviceCategories, tempService.trim()]);
                        setTempService("");
                      }
                    }}
                    className="add-btn"
                  >
                    + Add
                  </button>
                </div>
                {errors.serviceCategories && <span className="error-text">{errors.serviceCategories}</span>}
                <div className="tags-container">
                  {serviceCategories.map((service, index) => (
                    <span key={index} className="tag">
                      {service}
                      <button
                        type="button"
                        onClick={() => setServiceCategories(serviceCategories.filter((_, i) => i !== index))}
                        className="tag-remove"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Service Locations */}
            <div>
              <label className="input-label">Service Locations *</label>
              <div className="multi-input-container">
                <div className="input-with-button">
                  <input
                    type="text"
                    placeholder="e.g., New York, Los Angeles"
                    value={tempLocation}
                    onChange={(e) => setTempLocation(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (tempLocation.trim() && !locations.includes(tempLocation.trim())) {
                          setLocations([...locations, tempLocation.trim()]);
                          setTempLocation("");
                        }
                      }
                    }}
                    className="multi-input"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (tempLocation.trim() && !locations.includes(tempLocation.trim())) {
                        setLocations([...locations, tempLocation.trim()]);
                        setTempLocation("");
                      }
                    }}
                    className="add-btn"
                  >
                    + Add
                  </button>
                </div>
                {errors.locations && <span className="error-text">{errors.locations}</span>}
                <div className="tags-container">
                  {locations.map((loc, index) => (
                    <span key={index} className="tag">
                      {loc}
                      <button
                        type="button"
                        onClick={() => setLocations(locations.filter((_, i) => i !== index))}
                        className="tag-remove"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <AuthInput
              id="phone"
              label="Phone Number"
              placeholder="1234567890"
              value={phone}
              onChange={setPhone}
              error={errors.phone}
              autoComplete="tel"
            />
          </>
        )}

        {/* Admin-specific fields */}
        {role === "admin" && (
          <AuthInput
            id="adminKey"
            label="Admin Secret Key"
            type="password"
            placeholder="Enter admin key"
            value={adminKey}
            onChange={setAdminKey}
            error={errors.adminKey}
          />
        )}

        <div>
          <AuthInput
            id="password"
            label="Password"
            type="password"
            placeholder="Min. 6 characters"
            value={password}
            onChange={setPassword}
            error={errors.password}
            autoComplete="new-password"
          />
          {/* Password strength meter */}
          {password.length > 0 && (
            <div className="pwd-meter-wrap">
              <div className="pwd-bar-track">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="pwd-bar-seg"
                    style={{
                      background: i <= pwdScore
                        ? STRENGTH_COLORS[pwdScore]
                        : "hsl(var(--border))",
                    }}
                  />
                ))}
              </div>
              <span className="pwd-label" style={{ color: STRENGTH_COLORS[pwdScore] }}>
                {STRENGTH_LABELS[pwdScore]}
              </span>
            </div>
          )}
        </div>

        <AuthInput
          id="confirm"
          label="Confirm Password"
          type="password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          error={errors.confirm}
          autoComplete="new-password"
        />

        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? <span className="auth-spinner" /> : "Create Account →"}
        </button>
      </form>

      <p className="auth-footer-text">
        Already have an account?{" "}
        <Link to="/login" className="auth-link">
          Sign in
        </Link>
      </p>

      <style>{`
        .role-selector {
          margin-bottom: 0.5rem;
        }
        .role-label {
          display: block;
          font-size: 0.95rem;
          font-weight: 600;
          color: hsl(var(--foreground));
          margin-bottom: 0.75rem;
        }
        .role-options {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }
        .role-option {
          position: relative;
          cursor: pointer;
        }
        .role-option input[type="radio"] {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }
        .role-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 0.75rem;
          border: 2px solid hsl(var(--border));
          border-radius: calc(var(--radius) - 2px);
          background: hsl(var(--background));
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .role-option:hover .role-content {
          border-color: hsl(var(--primary) / 0.5);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px hsl(var(--primary) / 0.15);
        }
        .role-option-active .role-content {
          border-color: hsl(var(--primary));
          background: linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--primary) / 0.05));
          box-shadow: 0 4px 16px hsl(var(--primary) / 0.25);
        }
        .role-icon {
          font-size: 1.75rem;
        }
        .role-text {
          font-size: 0.9rem;
          font-weight: 600;
          color: hsl(var(--foreground));
        }
        @media (max-width: 640px) {
          .role-options {
            grid-template-columns: 1fr;
          }
          .role-content {
            flex-direction: row;
            justify-content: center;
          }
        }

        .mobile-logo {
          display: none;
          font-family: 'Poppins', sans-serif;
          font-weight: 900;
          font-size: 1.6rem;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1.5rem;
          gap: 0.5rem;
          align-items: center;
        }
        @media (max-width: 899px) {
          .mobile-logo { display: flex; }
        }

        .auth-title {
          font-family: 'Poppins', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          color: hsl(var(--foreground));
          margin: 0 0 0.5rem;
          line-height: 1.2;
        }
        .auth-subtitle {
          font-size: 1rem;
          color: hsl(var(--muted-foreground));
          margin: 0 0 2rem;
          line-height: 1.5;
        }

        .auth-banner {
          border-radius: calc(var(--radius) - 2px);
          padding: 0.9rem 1.25rem;
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 1.25rem;
          animation: slideDown 0.4s ease-out;
        }
        .auth-banner-error {
          background: linear-gradient(135deg, hsl(var(--destructive) / 0.1), hsl(var(--destructive) / 0.05));
          border: 2px solid hsl(var(--destructive) / 0.3);
          color: hsl(var(--destructive));
        }
        .auth-banner-success {
          background: linear-gradient(135deg, hsl(var(--success) / 0.1), hsl(var(--success) / 0.05));
          border: 2px solid hsl(var(--success) / 0.3);
          color: hsl(var(--success));
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .pwd-meter-wrap {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          margin-top: 0.5rem;
        }
        .pwd-bar-track {
          flex: 1;
          display: flex;
          gap: 5px;
        }
        .pwd-bar-seg {
          height: 5px;
          flex: 1;
          border-radius: 999px;
          transition: background 0.3s;
        }
        .pwd-label {
          font-size: 0.8rem;
          font-weight: 700;
          min-width: 50px;
          transition: color 0.3s;
        }

        .auth-btn {
          margin-top: 0.75rem;
          padding: 0.95rem 1.25rem;
          background: var(--gradient-primary);
          color: hsl(var(--primary-foreground));
          border: none;
          border-radius: calc(var(--radius) - 2px);
          font-size: 1.05rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 8px 25px hsl(var(--primary) / 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 52px;
          position: relative;
          overflow: hidden;
        }
        .auth-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent, hsl(0 0% 100% / 0.2));
          opacity: 0;
          transition: opacity 0.3s;
        }
        .auth-btn:hover:not(:disabled)::before {
          opacity: 1;
        }
        .auth-btn:hover:not(:disabled) {
          box-shadow: 0 12px 35px hsl(var(--primary) / 0.45);
          transform: translateY(-2px);
        }
        .auth-btn:active:not(:disabled) { transform: translateY(0); }
        .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .auth-spinner {
          width: 20px;
          height: 20px;
          border: 3px solid hsl(0 0% 100% / 0.3);
          border-top-color: hsl(var(--primary-foreground));
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .auth-footer-text {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.95rem;
          color: hsl(var(--muted-foreground));
        }
        .auth-link {
          color: hsl(var(--primary));
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s;
          position: relative;
        }
        .auth-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--gradient-primary);
          transform: scaleX(0);
          transition: transform 0.3s;
        }
        .auth-link:hover::after { transform: scaleX(1); }

        /* Multi-input styles */
        .input-label {
          display: block;
          font-size: 0.95rem;
          font-weight: 600;
          color: hsl(var(--foreground));
          margin-bottom: 0.5rem;
        }
        .multi-input-container {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .input-with-button {
          display: flex;
          gap: 0.5rem;
        }
        .multi-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 2px solid hsl(var(--border));
          border-radius: calc(var(--radius) - 2px);
          font-size: 0.95rem;
          transition: all 0.2s;
          background: hsl(var(--background));
          color: hsl(var(--foreground));
        }
        .multi-input:focus {
          outline: none;
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 3px hsl(var(--primary) / 0.1);
        }
        .add-btn {
          padding: 0.75rem 1.25rem;
          background: var(--gradient-primary);
          color: hsl(var(--primary-foreground));
          border: none;
          border-radius: calc(var(--radius) - 2px);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .add-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px hsl(var(--primary) / 0.3);
        }
        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          min-height: 40px;
          padding: 0.5rem;
          border: 2px dashed hsl(var(--border));
          border-radius: calc(var(--radius) - 2px);
          background: hsl(var(--muted) / 0.3);
        }
        .tag {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: var(--gradient-primary);
          color: hsl(var(--primary-foreground));
          border-radius: calc(var(--radius) - 4px);
          font-size: 0.85rem;
          font-weight: 600;
          animation: slideIn 0.3s ease-out;
        }
        .tag-remove {
          background: none;
          border: none;
          color: hsl(var(--primary-foreground));
          font-size: 1.25rem;
          line-height: 1;
          cursor: pointer;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
        }
        .tag-remove:hover {
          background: hsl(0 0% 100% / 0.2);
        }
        .error-text {
          color: hsl(var(--destructive));
          font-size: 0.85rem;
          font-weight: 500;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </AuthLayout>
  );
}
