import { useNavigate, useLocation } from "react-router-dom";
import { ExternalLink } from "lucide-react";

const AdminNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="flex items-center gap-4 border-b border-border pb-3 mb-6">
      <button
        onClick={() => navigate("/admin")}
        className={`text-sm transition-colors ${
          isActive("/admin")
            ? "text-foreground font-medium"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Dashboard
      </button>
      <button
        onClick={() => navigate("/admin/editor")}
        className={`text-sm transition-colors ${
          isActive("/admin/editor")
            ? "text-foreground font-medium"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Survey editor →
      </button>
      <a
        href="/fsb-career-compass/distribute"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
      >
        Distribution tools <ExternalLink className="h-3 w-3" />
      </a>
    </nav>
  );
};

export default AdminNav;
