import { useState } from "react";
import { ADMIN_PASSWORD } from "@/config/adminConfig";

interface AdminLoginProps {
  onAuth: () => void;
}

const AdminLogin = ({ onAuth }: AdminLoginProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("fsb_admin_auth", "true");
      onAuth();
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
            Farmer School of Business
          </p>
          <p className="text-sm text-muted-foreground mt-1">Admin Dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className={`w-full h-12 px-4 rounded-lg border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
                error ? "border-destructive" : "border-input"
              } ${shaking ? "animate-shake" : ""}`}
              autoFocus
            />
            {error && (
              <p className="text-sm text-destructive mt-2">Incorrect password</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
