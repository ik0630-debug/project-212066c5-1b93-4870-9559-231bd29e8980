import { NavLink } from "@/components/NavLink";
import { Home, Calendar, FileText, MapPin } from "lucide-react";
import { usePageSettings } from "@/hooks/usePageSettings";

const MobileNavigation = () => {
  const { settings: enabledPages, loading } = usePageSettings();

  if (loading || !enabledPages) {
    return null;
  }

  const allNavItems = [
    { icon: Home, label: "홈", path: "/", enabled: true },
    { icon: Calendar, label: "프로그램", path: "/program", enabled: enabledPages.program },
    { icon: FileText, label: "참가신청", path: "/registration", enabled: enabledPages.registration },
    { icon: MapPin, label: "오시는 길", path: "/location", enabled: enabledPages.location },
  ];

  const navItems = allNavItems.filter((item) => item.enabled);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-elegant">
      <div className="max-w-[800px] mx-auto">
        <div className={`grid h-16`} style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))` }}>
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
      </div>
    </nav>
  );
};

export default MobileNavigation;
