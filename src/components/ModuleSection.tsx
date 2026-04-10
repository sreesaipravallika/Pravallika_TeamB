import { useState } from "react";

interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  action: () => void;
}

interface ModuleSectionProps {
  modules: Module[];
  title?: string;
}

export default function ModuleSection({ modules, title = "Quick Access Modules" }: ModuleSectionProps) {
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);

  return (
    <div className="module-section">
      <h2 className="module-section-title">{title}</h2>
      <div className="modules-grid">
        {modules.map((module) => (
          <div
            key={module.id}
            className="module-card"
            style={{
              borderTop: `4px solid ${module.color}`,
              transform: hoveredModule === module.id ? 'translateY(-8px)' : 'translateY(0)'
            }}
            onMouseEnter={() => setHoveredModule(module.id)}
            onMouseLeave={() => setHoveredModule(null)}
            onClick={module.action}
          >
            <div 
              className="module-icon" 
              style={{ 
                background: `${module.color}15`,
                color: module.color 
              }}
            >
              {module.icon}
            </div>
            <h3 className="module-title">{module.title}</h3>
            <p className="module-description">{module.description}</p>
            <div 
              className="module-arrow"
              style={{ color: module.color }}
            >
              →
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .module-section {
          background: white;
          border-radius: 1.25rem;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06);
          margin-bottom: 2rem;
        }

        .module-section-title {
          font-family: 'Poppins', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 1.5rem;
        }

        .modules-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .module-card {
          background: #f9fafb;
          border-radius: 1rem;
          padding: 2rem 1.5rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-top: 4px solid transparent;
          position: relative;
          overflow: hidden;
        }

        .module-card::before {
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

        .module-card:hover::before {
          opacity: 1;
        }

        .module-card:hover {
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
        }

        .module-icon {
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

        .module-card:hover .module-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .module-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.625rem;
        }

        .module-description {
          font-size: 0.9375rem;
          color: #6b7280;
          margin: 0 0 1rem;
          line-height: 1.5;
        }

        .module-arrow {
          font-size: 1.5rem;
          font-weight: 700;
          transition: transform 0.3s;
        }

        .module-card:hover .module-arrow {
          transform: translateX(8px);
        }

        @media (max-width: 768px) {
          .modules-grid {
            grid-template-columns: 1fr;
          }
          
          .module-section {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
