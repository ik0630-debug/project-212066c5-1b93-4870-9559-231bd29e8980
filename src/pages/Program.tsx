import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileNavigation from "@/components/MobileNavigation";
import { Clock, ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const Program = () => {
  const navigate = useNavigate();
  const [headerImage, setHeaderImage] = useState<string>("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeaderImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const schedule = [
    {
      time: "09:00 - 09:30",
      title: "등록 및 접수",
      description: "참가자 등록 및 자료 배부",
    },
    {
      time: "09:30 - 10:00",
      title: "개회식",
      description: "환영사 및 행사 소개",
    },
    {
      time: "10:00 - 11:00",
      title: "기조연설",
      description: "업계 리더의 미래 전망",
    },
    {
      time: "11:00 - 11:15",
      title: "Coffee Break",
      description: "네트워킹 시간",
    },
    {
      time: "11:15 - 12:30",
      title: "세션 1",
      description: "최신 트렌드 및 기술 동향",
    },
    {
      time: "12:30 - 14:00",
      title: "점심식사",
      description: "뷔페 제공",
    },
    {
      time: "14:00 - 15:30",
      title: "세션 2",
      description: "성공 사례 발표",
    },
    {
      time: "15:30 - 15:45",
      title: "Tea Break",
      description: "네트워킹 시간",
    },
    {
      time: "15:45 - 17:00",
      title: "패널 토론",
      description: "업계 전문가 패널 토론",
    },
    {
      time: "17:00 - 17:30",
      title: "폐회식",
      description: "감사 인사 및 마무리",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header 
        className="relative bg-gradient-primary text-primary-foreground py-8 px-6 bg-cover bg-center"
        style={headerImage ? { backgroundImage: `url(${headerImage})` } : {}}
      >
        <div className="absolute inset-0 bg-gradient-primary/80" />
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="absolute left-0 top-0 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <label htmlFor="header-upload-program" className="absolute right-0 top-0 cursor-pointer">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/20"
              asChild
            >
              <span>
                <Upload className="w-5 h-5" />
              </span>
            </Button>
            <input
              id="header-upload-program"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          <h1 className="text-3xl font-bold text-center mb-2">행사 프로그램</h1>
          <p className="text-center text-primary-foreground/80">
            2024년 비즈니스 컨퍼런스
          </p>
        </div>
      </header>

      <main className="px-6 py-8">
        <div className="space-y-4">
          {schedule.map((item, index) => (
            <div
              key={index}
              className="bg-card rounded-lg p-5 shadow-elegant border border-border hover:shadow-glow transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-accent mb-1">
                    {item.time}
                  </div>
                  <h3 className="text-lg font-bold text-card-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <MobileNavigation />
    </div>
  );
};

export default Program;
