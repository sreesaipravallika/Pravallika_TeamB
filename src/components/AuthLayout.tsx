/**
 * AuthLayout.tsx
 * ──────────────
 * Shared two-column layout used by both Login and Register pages.
 *
 * Left panel  → decorative brand side with hero image and tagline
 * Right panel → white card with the form slot (children)
 */

import quickservHero from "@/assets/quickserv-hero.png";

interface AuthLayoutProps {
  children: React.ReactNode;
  /** Heading shown below the logo on the left panel */
  headline: string;
  subline: string;
}

export default function AuthLayout({ children, headline, subline }: AuthLayoutProps) {
  return (
    <div className="auth-root">
      {/* ── Left brand panel ── */}
      <div className="auth-panel">
        {/* Logo */}
        <div className="auth-logo">
          <span className="auth-logo-icon">⚡</span>
          <span className="auth-logo-name">QuickServIndia</span>
        </div>

        {/* Hero illustration */}
        <img
          src={quickservHero}
          alt="QuickServ – people connecting for local services"
          className="auth-hero-img"
        />

        {/* Copy */}
        <h2 className="auth-panel-headline">{headline}</h2>
        <p className="auth-panel-sub">{subline}</p>

        {/* Floating feature pills */}
        <div className="auth-pills">
          {["🔧 Plumbing", "💇 Salon", "🚗 Mechanic", "🧹 Cleaning"].map((pill) => (
            <span key={pill} className="auth-pill">{pill}</span>
          ))}
        </div>
      </div>

      {/* ── Right form card ── */}
      <div className="auth-form-side">
        <div className="auth-card animate-slide-up">{children}</div>
      </div>

      {/* Inline styles scoped to auth layout */}
      <style>{`
        .auth-root {
          min-height: 100vh;
          display: flex;
          background: linear-gradient(135deg, hsl(250 30% 98%) 0%, hsl(240 40% 97%) 100%);
        }

        /* ─── Left panel ─── */
        .auth-panel {
          display: none;
          flex: 1;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          padding: 4rem 3rem;
          background: var(--auth-panel-gradient);
          position: relative;
          overflow: hidden;
        }
        @media (min-width: 900px) {
          .auth-panel { display: flex; }
        }

        /* Animated decorative circles */
        .auth-panel::before {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: hsl(0 0% 100% / 0.1);
          bottom: -150px;
          left: -100px;
          animation: float 8s ease-in-out infinite;
        }
        .auth-panel::after {
          content: '';
          position: absolute;
          width: 350px;
          height: 350px;
          border-radius: 50%;
          background: hsl(0 0% 100% / 0.08);
          top: -80px;
          right: -80px;
          animation: float 6s ease-in-out infinite reverse;
        }

        .auth-logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: 'Poppins', sans-serif;
          font-weight: 900;
          font-size: 2rem;
          color: hsl(var(--brand-foreground));
          z-index: 1;
          text-shadow: 0 4px 12px hsl(0 0% 0% / 0.15);
        }
        .auth-logo-icon { 
          font-size: 2.5rem;
          filter: drop-shadow(0 4px 8px hsl(0 0% 0% / 0.2));
        }

        .auth-hero-img {
          width: 260px;
          height: 260px;
          object-fit: cover;
          border-radius: 1.5rem;
          box-shadow: 0 20px 60px hsl(0 0% 0% / 0.3);
          z-index: 1;
          border: 4px solid hsl(0 0% 100% / 0.2);
          transition: transform 0.3s;
        }
        .auth-hero-img:hover {
          transform: scale(1.05);
        }

        .auth-panel-headline {
          font-family: 'Poppins', sans-serif;
          font-weight: 800;
          font-size: 1.75rem;
          color: hsl(var(--brand-foreground));
          text-align: center;
          line-height: 1.3;
          z-index: 1;
          max-width: 380px;
          text-shadow: 0 2px 8px hsl(0 0% 0% / 0.15);
        }

        .auth-panel-sub {
          font-size: 1.05rem;
          color: hsl(0 0% 100% / 0.9);
          text-align: center;
          max-width: 340px;
          z-index: 1;
          line-height: 1.6;
        }

        .auth-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.65rem;
          justify-content: center;
          z-index: 1;
        }
        .auth-pill {
          background: hsl(0 0% 100% / 0.25);
          color: hsl(var(--brand-foreground));
          border-radius: 999px;
          padding: 0.5rem 1.2rem;
          font-size: 0.85rem;
          font-weight: 600;
          backdrop-filter: blur(8px);
          border: 1px solid hsl(0 0% 100% / 0.3);
          transition: all 0.3s;
          cursor: default;
        }
        .auth-pill:hover {
          background: hsl(0 0% 100% / 0.35);
          transform: translateY(-2px);
        }

        /* ─── Right form side ─── */
        .auth-form-side {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
        }

        .auth-card {
          background: hsl(var(--card));
          border-radius: var(--radius);
          box-shadow: var(--auth-card-shadow);
          padding: 3rem 2.5rem;
          width: 100%;
          max-width: 460px;
          border: 2px solid hsl(var(--border));
          position: relative;
          overflow: hidden;
        }
        .auth-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--gradient-primary);
        }
        @media (max-width: 480px) {
          .auth-card { padding: 2.25rem 1.75rem; }
        }

        /* Mobile-only logo */
        @media (max-width: 899px) {
          .auth-form-side {
            flex-direction: column;
            padding-top: 4rem;
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%      { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}
