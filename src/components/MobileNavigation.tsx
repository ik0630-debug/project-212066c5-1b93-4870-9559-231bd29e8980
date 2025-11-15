import { NavLink } from "@/components/NavLink";
import { Home, Calendar, FileText, MapPin } from "lucide-react";

const MobileNavigation = () => {
  const navItems = [
    { icon: Home, label: "홈", path: "/" },
    { icon: Calendar, label: "프로그램", path: "/program" },
    { icon: FileText, label: "참가신청", path: "/registration" },
    { icon: MapPin, label: "오시는 길", path: "/location" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-elegant">
      <div className="grid grid-cols-4 h-16">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            className="flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors"
            activeClassName="text-primary"
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavigation;
