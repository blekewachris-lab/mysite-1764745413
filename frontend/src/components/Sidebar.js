import { Link, useLocation } from "react-router-dom";
import {
  ChartLineUp,
  Package,
  VideoCamera,
  ChatDots,
  FileText,
  Strategy as StrategyIcon,
  CalendarCheck,
  Target
} from "@phosphor-icons/react";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: ChartLineUp, label: "Dashboard" },
    { path: "/products", icon: Package, label: "Produits" },
    { path: "/orders", icon: Package, label: "Commandes" },
    { path: "/customers", icon: ChatDots, label: "Clients" },
    { path: "/tiktok-scripts", icon: VideoCamera, label: "Scripts TikTok" },
    { path: "/dm-scripts", icon: ChatDots, label: "Messages DM" },
    { path: "/sales-pages", icon: FileText, label: "Pages de Vente" },
    { path: "/strategy", icon: StrategyIcon, label: "Stratégies" },
    { path: "/action-plan", icon: CalendarCheck, label: "Plan 7 Jours" },
  ];

  return (
    <div className="w-64 h-screen bg-[#111111] border-r border-[#27272A] fixed left-0 top-0" data-testid="sidebar">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <Target size={32} weight="bold" className="text-[#007AFF]" />
          <h1 className="text-2xl font-black tracking-tighter uppercase text-white" style={{fontFamily: 'Barlow Condensed'}}>
            E-COM PRO
          </h1>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                data-testid={`nav-${item.label.toLowerCase().replace(/ /g, '-')}`}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold tracking-wide uppercase transition-colors ${
                  isActive
                    ? "bg-[#007AFF] text-white"
                    : "text-[#A1A1AA] hover:bg-[#1A1A1A] hover:text-white"
                }`}
                style={{borderRadius: '2px'}}
              >
                <Icon size={20} weight="bold" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="bg-[#0A0A0A] border border-[#27272A] p-4" style={{borderRadius: '2px'}}>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#71717A] mb-2">
            OBJECTIF
          </p>
          <p className="text-2xl font-black text-[#007AFF]" style={{fontFamily: 'Barlow Condensed'}}>
            1000€/JOUR
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;