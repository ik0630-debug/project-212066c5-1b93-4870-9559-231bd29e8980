import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as LucideIcons from "lucide-react";
import { Search } from "lucide-react";

interface IconPickerProps {
  value: string;
  onValueChange: (iconName: string) => void;
}

// Popular icons for quick access
const POPULAR_ICONS = [
  "Calendar",
  "MapPin",
  "Users",
  "Clock",
  "Mail",
  "Phone",
  "Globe",
  "Home",
  "Building",
  "Briefcase",
  "Award",
  "Star",
  "Heart",
  "MessageCircle",
  "Bell",
  "Settings",
  "Info",
  "AlertCircle",
  "CheckCircle",
  "XCircle",
];

const IconPicker = ({ value, onValueChange }: IconPickerProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Get all available icons
  const allIcons = useMemo(() => {
    return Object.keys(LucideIcons).filter(
      (key) =>
        key !== "createLucideIcon" &&
        key !== "default" &&
        typeof (LucideIcons as any)[key] === "function"
    );
  }, []);

  // Filter icons based on search
  const filteredIcons = useMemo(() => {
    if (!search) {
      return POPULAR_ICONS;
    }
    return allIcons.filter((iconName) =>
      iconName.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, allIcons]);

  // Get current icon component
  const CurrentIcon = (LucideIcons as any)[value] || LucideIcons.Calendar;

  const handleSelectIcon = (iconName: string) => {
    onValueChange(iconName);
    setOpen(false);
    setSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-2">
          <CurrentIcon className="w-4 h-4" />
          <span>{value || "아이콘 선택"}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>아이콘 선택</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="아이콘 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            <div className="grid grid-cols-6 gap-2">
              {filteredIcons.map((iconName) => {
                const IconComponent = (LucideIcons as any)[iconName];
                if (!IconComponent) return null;

                return (
                  <Button
                    key={iconName}
                    variant={value === iconName ? "default" : "outline"}
                    className="h-16 flex flex-col gap-1 p-2"
                    onClick={() => handleSelectIcon(iconName)}
                  >
                    <IconComponent className="w-6 h-6" />
                    <span className="text-[10px] truncate w-full">
                      {iconName}
                    </span>
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IconPicker;