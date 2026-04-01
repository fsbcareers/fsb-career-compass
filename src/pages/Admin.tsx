import { useState } from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

const Admin = () => {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem("fsb_admin_auth") === "true"
  );

  const handleSignOut = () => {
    sessionStorage.removeItem("fsb_admin_auth");
    setAuthed(false);
  };

  if (!authed) {
    return <AdminLogin onAuth={() => setAuthed(true)} />;
  }

  return <AdminDashboard onSignOut={handleSignOut} />;
};

export default Admin;
