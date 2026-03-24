/**
 * Login.tsx — QuickServIndia Login Page
 * ─────────────────────────────────
 * STEP-BY-STEP EXPLANATION:
 *
 * 1. We use React `useState` to track the form fields and UI state
 *    (loading spinner, success/error banner, per-field errors).
 *
 * 2. On "Login" click → `handleSubmit()` runs:
 *    a. We call `loginUser()` from auth.ts which checks localStorage.
 *    b. If it returns a string → it's an error message → show it.
 *    c. If it returns a User object → login succeeded → navigate to /dashboard.
 *
 * 3. The form shakes (`animate-shake`) when login fails so the user
 *    gets immediate visual feedback without losing their input.
 *
 * 4. `useNavigate` from react-router-dom handles page transitions.
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import AuthInput from "@/components/AuthInput";
import { loginUser, getDashboardRoute } from "@/lib/auth";
import { loginAPI, storeAuthData } from "@/lib/api";

export default function Login() {
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);

  function triggerShake() {
    setShaking(true);
    setTimeout(() => setShaking(false), 450);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Call backend API for login - ONLY DATABASE AUTHENTICATION
      const result = await loginAPI({ email, password });

      if (!result.success || !result.data) {
        // Login failed - show error
        setError(result.error || "Invalid email or password. Please check your credentials.");
        triggerShake();
        setLoading(false);
        return;
      }

      // Login successful - store authentication data
      storeAuthData(result.data);
      
      // Log LOGIN activity to database
      try {
        await fetch('http://localhost:8080/api/activities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: { id: result.data.id },
            activityType: 'LOGIN',
            activityDescription: `User ${result.data.name} logged in as ${result.data.role}`,
            ipAddress: 'N/A', // Can be enhanced with IP detection
            deviceInfo: navigator.userAgent
          })
        });
      } catch (activityError) {
        console.error('Failed to log activity:', activityError);
        // Don't block login if activity logging fails
      }
      
      // Also update localStorage session for backward compatibility
      const localResult = loginUser(email, password);
      if (typeof localResult === "string") {
        // If localStorage doesn't have the user, that's okay - we have database auth
        console.log("User not in localStorage, but authenticated via database");
      }
      
      // Redirect to appropriate dashboard based on role
      const role = result.data.role.toLowerCase() as "customer" | "provider" | "admin";
      const dashboardRoute = getDashboardRoute(role);
      navigate(dashboardRoute);
      
    } catch (error) {
      console.error("Login error:", error);
      setError("Unable to connect to server. Please ensure the backend is running.");
      triggerShake();
    }

    setLoading(false);
  }

  return (
    <AuthLayout
      headline="Find trusted local services, fast."
      subline="From plumbers to stylists — QuickServIndia connects you with verified professionals near you."
    >
      {/* Mobile logo */}
      <div className="mobile-logo">
        <span>⚡</span> QuickServIndia
      </div>

      <h1 className="auth-title">Welcome back!</h1>
      <p className="auth-subtitle">Sign in to your QuickServIndia account</p>

      {/* Error banner */}
      {error && (
        <div className="auth-banner auth-banner-error" role="alert">
          ⚠️ {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={`auth-form${shaking ? " animate-shake" : ""}`}
        noValidate
      >
        <AuthInput
          id="email"
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />

        <AuthInput
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
        />

        <button
          type="submit"
          className="auth-btn"
          disabled={loading}
        >
          {loading ? <span className="auth-spinner" /> : "Login →"}
        </button>
      </form>

      <p className="auth-footer-text">
        Don't have an account?{" "}
        <Link to="/register" className="auth-link">
          Register here
        </Link>
      </p>

      <style>{`
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
          gap: 1.5rem;
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
      `}</style>
    </AuthLayout>
  );
}
