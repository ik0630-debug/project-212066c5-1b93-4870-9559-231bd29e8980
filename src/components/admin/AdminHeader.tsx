import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut } from "lucide-react";

interface AdminHeaderProps {
  onBack: () => void;
  onSignOut: () => void;
}

const AdminHeader = ({ onBack, onSignOut }: AdminHeaderProps) => {
  return (
    <header className="bg-gradient-primary text-primary-foreground py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">관리자 페이지</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onSignOut}
          className="text-primary-foreground hover:bg-primary-foreground/20"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
