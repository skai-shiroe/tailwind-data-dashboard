
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  FileSpreadsheet, 
  FileSearch, 
  FileEdit, 
  History,
  Menu,
  X,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ 
  to, 
  icon, 
  label, 
  isActive, 
  isCollapsed,
  onClick 
}: SidebarItemProps) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "sidebar-item",
        isActive && "active"
      )}
      onClick={onClick}
    >
      <span className="text-lg">{icon}</span>
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );
};

export const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const sidebarItems = [
    { to: "/", icon: <BarChart3 size={20} />, label: "Tableau de bord" },
    { to: "/importation", icon: <FileSpreadsheet size={20} />, label: "Importation Excel" },
    { to: "/consultation", icon: <FileSearch size={20} />, label: "Consultation" },
    { to: "/edition", icon: <FileEdit size={20} />, label: "Édition Dossier" },
    { to: "/historique", icon: <History size={20} />, label: "Historique" }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-md"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed h-full z-50 bg-sidebar transition-all duration-300 flex flex-col",
          isCollapsed ? "w-[70px]" : "w-64",
          isMobileMenuOpen ? "left-0" : "-left-full lg:left-0"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-sidebar-foreground">GestionFiscal</h1>
          )}
          <div className="flex gap-2">
            {isMobileMenuOpen && (
              <button 
                className="text-sidebar-foreground hover:text-white p-1"
                onClick={closeMobileMenu}
              >
                <X size={20} />
              </button>
            )}
            <button 
              className="text-sidebar-foreground hover:text-white hidden lg:block p-1"
              onClick={toggleCollapse}
            >
              <ChevronRight size={20} className={cn(
                "transition-transform",
                isCollapsed && "rotate-180"
              )} />
            </button>
          </div>
        </div>
        
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {sidebarItems.map(item => (
            <SidebarItem 
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={location.pathname === item.to}
              isCollapsed={isCollapsed}
              onClick={closeMobileMenu}
            />
          ))}
        </nav>
      </aside>
    </>
  );
};
