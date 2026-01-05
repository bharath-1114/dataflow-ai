import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

export const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
    </div>
  );
};
