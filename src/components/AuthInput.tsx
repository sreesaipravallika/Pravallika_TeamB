/**
 * AuthInput.tsx
 * ─────────────
 * Reusable labeled input for auth forms.
 * Shows an inline error message if `error` is provided.
 */

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AuthInputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  autoComplete?: string;
}

export default function AuthInput({
  id, label, type = "text", placeholder, value, onChange, error, autoComplete,
}: AuthInputProps) {
  const [showPwd, setShowPwd] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPwd ? "text" : "password") : type;

  return (
    <div className="ai-wrap">
      <label htmlFor={id} className="ai-label">{label}</label>
      <div className="ai-field-wrap">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className={`ai-input${error ? " ai-input-err" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPwd((v) => !v)}
            className="ai-eye"
            aria-label={showPwd ? "Hide password" : "Show password"}
          >
            {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="ai-error">{error}</p>}

      <style>{`
        .ai-wrap { display: flex; flex-direction: column; gap: 0.5rem; }

        .ai-label {
          font-size: 0.9rem;
          font-weight: 700;
          color: hsl(var(--foreground));
          letter-spacing: 0.01em;
        }

        .ai-field-wrap { position: relative; }

        .ai-input {
          width: 100%;
          padding: 0.85rem 1.1rem;
          border: 2px solid hsl(var(--border));
          border-radius: calc(var(--radius) - 2px);
          font-size: 1rem;
          background: hsl(var(--background));
          color: hsl(var(--foreground));
          outline: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-sizing: border-box;
          font-weight: 500;
        }
        .ai-input:focus {
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 4px hsl(var(--primary) / 0.12);
          transform: translateY(-1px);
        }
        .ai-input-err {
          border-color: hsl(var(--destructive));
        }
        .ai-input-err:focus {
          box-shadow: 0 0 0 4px hsl(var(--destructive) / 0.12);
        }
        .ai-input::placeholder {
          color: hsl(var(--muted-foreground));
          opacity: 0.6;
        }

        .ai-eye {
          position: absolute;
          right: 0.85rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: hsl(var(--muted-foreground));
          display: flex;
          align-items: center;
          padding: 0.4rem;
          border-radius: 6px;
          transition: all 0.2s;
        }
        .ai-eye:hover { 
          color: hsl(var(--foreground));
          background: hsl(var(--muted) / 0.5);
        }

        .ai-error {
          font-size: 0.82rem;
          color: hsl(var(--destructive));
          margin: 0;
          font-weight: 600;
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
