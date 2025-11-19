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

// Comprehensive icon list organized by category
const DEFAULT_ICONS = [
  // 시간 & 일정
  "Calendar", "CalendarDays", "CalendarCheck", "CalendarClock", "CalendarRange", "Clock", "Clock1", "Clock2", "Clock3", "Clock4", "Clock5", "Clock6", "Clock7", "Clock8", "Clock9", "Clock10", "Clock11", "Clock12", "Timer", "Hourglass", "AlarmClock", "CalendarX", "CalendarPlus",
  // 사람 & 사용자 & 신체
  "User", "Users", "UserPlus", "UserMinus", "UserCheck", "UserX", "UserCog", "UsersRound", "Contact", "Baby", "PersonStanding", "Eye", "EyeOff", "Ear", "EarOff", "Hand", "HandMetal", "Footprints", "Brain", "Skull", "Smile", "Frown", "Laugh", "Angry", "Annoyed",
  // 강연 & 교육 & 프레젠테이션
  "Presentation", "GraduationCap", "School", "Library", "BookOpen", "Book", "NotebookPen", "Megaphone", "Volume2", "Mic", "MicOff", "PodcastIcon", "Radio", "Tv", "MonitorSpeaker", "Projector", "ScreenShare", "Users", "UsersRound", "UserCheck", "MessageSquare", "SpeechIcon", "Quote",
  // 비즈니스 & 사무
  "Briefcase", "Building", "Building2", "Home", "Store", "Warehouse", "Factory", "Hotel", "School", "GraduationCap", "Library",
  // 커뮤니케이션 & 대화
  "Mail", "MailOpen", "MailPlus", "MailCheck", "MessageCircle", "MessageSquare", "MessageSquarePlus", "MessageSquareShare", "MessagesSquare", "Phone", "PhoneCall", "PhoneIncoming", "PhoneOutgoing", "Smartphone", "Send", "SendHorizonal", "Inbox", "AtSign", "Speech", "Quote", "SpeechIcon", "Megaphone", "Volume", "Volume1", "Volume2", "Radio", "Podcast",
  // 문서 & 파일
  "File", "FileText", "FileEdit", "FileCheck", "FilePlus", "FileMinus", "FileX", "Files", "Folder", "FolderOpen", "FolderPlus", "FolderCheck", "Archive", "Clipboard", "ClipboardCheck", "ClipboardList", "Newspaper", "BookOpen", "Book", "NotebookPen",
  // 미디어 & 이미지
  "Image", "ImagePlus", "Camera", "CameraOff", "Video", "VideoOff", "Film", "Music", "Mic", "MicOff", "Volume", "Volume1", "Volume2", "VolumeX", "Play", "Pause", "Square", "Circle",
  // 위치 & 지도 & 네비게이션
  "MapPin", "Map", "MapPinned", "Navigation", "Navigation2", "Compass", "Globe", "Globe2", "Locate", "LocateFixed", "LocateOff", "Route", "Signpost", "Milestone", "Footprints", "Mountain", "MountainSnow", "TreeDeciduous", "TreePine", "Home", "Building", "Building2", "Landmark", "Store", "Hotel", "Hospital", "School",
  // 쇼핑 & 금융
  "ShoppingCart", "ShoppingBag", "CreditCard", "Wallet", "DollarSign", "Euro", "PoundSterling", "Bitcoin", "Banknote", "Coins", "Receipt", "Tag", "Tags", "Barcode", "Package", "PackageCheck", "PackageX", "Gift",
  // 상태 & 알림
  "Bell", "BellOff", "BellRing", "Info", "AlertCircle", "AlertTriangle", "CheckCircle", "CheckCircle2", "XCircle", "Check", "X", "Plus", "Minus", "Star", "StarHalf", "Heart", "HeartPulse", "ThumbsUp", "ThumbsDown", "Flag", "Bookmark",
  // 설정 & 도구
  "Settings", "Cog", "Wrench", "Hammer", "Drill", "Gauge", "SlidersHorizontal", "SlidersVertical", "Filter", "Search", "Zap", "Key", "Lock", "LockOpen", "Shield", "ShieldCheck", "Eye", "EyeOff",
  // 이동 & 방향
  "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUpRight", "ArrowUpLeft", "ArrowDownRight", "ArrowDownLeft", "ChevronUp", "ChevronDown", "ChevronLeft", "ChevronRight", "ChevronsUp", "ChevronsDown", "MoveUp", "MoveDown", "Move", "Maximize", "Minimize", "CornerUpLeft", "CornerUpRight",
  // 편집 & 작업
  "Edit", "Edit2", "Edit3", "Pencil", "Pen", "PenTool", "Copy", "Clipboard", "ClipboardCopy", "Trash", "Trash2", "Save", "Download", "Upload", "RefreshCw", "RotateCw", "RotateCcw", "Undo", "Redo",
  // 레이아웃 & UI
  "Layout", "LayoutGrid", "LayoutList", "Menu", "MoreHorizontal", "MoreVertical", "Grid", "List", "Columns", "Rows", "PanelLeft", "PanelRight", "PanelTop", "PanelBottom", "Sidebar", "Table",
  // 날씨 & 자연
  "Sun", "Moon", "Cloud", "CloudRain", "CloudSnow", "CloudDrizzle", "CloudLightning", "Wind", "Snowflake", "Sunrise", "Sunset", "Thermometer", "Umbrella", "Sprout", "TreeDeciduous", "TreePine", "Flower", "Leaf",
  // 교통 & 운송
  "Car", "Truck", "Bus", "Train", "Plane", "Ship", "Bike", "Fuel", "ParkingCircle", "TrafficCone",
  // 음식 & 음료
  "Coffee", "Beer", "Wine", "Pizza", "Utensils", "UtensilsCrossed", "ChefHat", "CookingPot", "Apple", "Cherry", "Carrot",
  // 건강 & 의료
  "Heart", "HeartPulse", "Activity", "Stethoscope", "Pill", "Syringe", "Thermometer", "Cross", "Hospital",
  // 기술 & 장치
  "Monitor", "Laptop", "Tablet", "Smartphone", "Watch", "Tv", "Speaker", "Headphones", "Keyboard", "Mouse", "Printer", "HardDrive", "Cpu", "Database", "Server", "Wifi", "WifiOff", "Bluetooth", "Usb", "Battery", "BatteryCharging", "Plug", "Power", "PowerOff",
  // 소셜 & 공유
  "Share", "Share2", "Link", "Link2", "ExternalLink", "MessageCircle", "MessageSquare", "AtSign", "Hash", "Users",
  // 차트 & 데이터
  "BarChart", "BarChart2", "BarChart3", "LineChart", "PieChart", "TrendingUp", "TrendingDown", "Activity",
  // 게임 & 엔터테인먼트
  "Gamepad", "Gamepad2", "Trophy", "Award", "Medal", "Target", "Dice1", "Dice2", "Dice3", "Dice4", "Dice5", "Dice6", "Puzzle", "Crown",
  // 기타
  "Sparkles", "Zap", "Flame", "Droplet", "Waves", "Lightbulb", "Flashlight", "Lamp", "Rocket", "Plane", "Anchor", "Globe2"
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
      return DEFAULT_ICONS;
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
      <DialogContent className="sm:max-w-[600px]" onOpenAutoFocus={(e) => e.preventDefault()}>
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
          <ScrollArea className="h-[500px] w-full rounded-md border p-4">
            <div className="grid grid-cols-8 gap-2">
              {filteredIcons.map((iconName) => {
                const IconComponent = (LucideIcons as any)[iconName];
                if (!IconComponent) return null;

                return (
                  <Button
                    key={iconName}
                    variant={value === iconName ? "default" : "outline"}
                    className="h-14 flex flex-col gap-1 p-1"
                    onClick={() => handleSelectIcon(iconName)}
                    title={iconName}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="text-[9px] truncate w-full leading-tight">
                      {iconName}
                    </span>
                  </Button>
                );
              })}
            </div>
            {filteredIcons.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                검색 결과가 없습니다
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IconPicker;