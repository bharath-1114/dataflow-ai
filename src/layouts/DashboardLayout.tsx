import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Table,
  LayoutGrid,
  BarChart3,
  Sparkles,
  MessageSquare,
  LogOut,
} from "lucide-react";

const navItems = [
  { path: "/upload", label: "1. Upload", icon: Upload },
  { path: "/table", label: "2. Table", icon: Table },
  { path: "/full-table", label: "3. Full Table", icon: LayoutGrid },
  { path: "/charts", label: "4. Charts", icon: BarChart3 },
  { path: "/custom", label: "5. Custom", icon: Sparkles },
  { path: "/chatbot", label: "6. Chatbot", icon: MessageSquare },
];

export const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="app-layout">
      {/* Left Sidebar */}
      <header className="sidebar">
        <div className="nav-container">
          <div className="mb-4">
            <Logo />
          </div>
          
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path}>
                <button className={`nav-btn ${isActive ? "active" : ""}`}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              </Link>
            );
          })}
        </div>

        {/* Chatbot Preview in Sidebar */}
        <div className="mt-auto">
          {user && (
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground truncate">
                {user.email}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="w-full justify-start"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};
