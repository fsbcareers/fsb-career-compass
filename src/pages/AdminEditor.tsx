import { useNavigate } from "react-router-dom";
import SurveyEditor from "@/components/admin/SurveyEditor";
import { ArrowLeft } from "lucide-react";

const AdminEditor = () => {
  const navigate = useNavigate();
  const authed = sessionStorage.getItem("fsb_admin_auth") === "true";

  if (!authed) {
    // Lazy import to avoid circular deps - just redirect to admin login
    navigate("/admin");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1100px] mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
              Farmer School of Business
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">Survey Editor</p>
          </div>
        </div>

        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
        </button>

        <SurveyEditor />
      </div>
    </div>
  );
};

export default AdminEditor;
