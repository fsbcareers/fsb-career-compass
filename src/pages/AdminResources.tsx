import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ResourceManager from "@/components/admin/ResourceManager";
import AdminNav from "@/components/admin/AdminNav";

const AdminResources = () => {
  const navigate = useNavigate();
  const authed = sessionStorage.getItem("fsb_admin_auth") === "true";

  if (!authed) {
    navigate("/admin");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] p-4 md:p-8">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
              Farmer School of Business
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">Resource Manager</p>
          </div>
        </div>

        <button
          onClick={() => navigate("/admin")}
          className="mb-6 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
        </button>

        <AdminNav />

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground">Resources</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the career center resource library that powers /resources and the post-survey
            matching engine.
          </p>
        </div>

        <ResourceManager />
      </div>
    </div>
  );
};

export default AdminResources;