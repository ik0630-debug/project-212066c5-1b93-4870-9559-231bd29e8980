import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, LogIn, Shield, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MobileNavigation from "@/components/MobileNavigation";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      setIsLoggedIn(true);
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .single();
      
      setIsAdmin(!!data);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          {isAdmin && (
            <Button
              onClick={() => navigate("/admin")}
              size="sm"
              variant="secondary"
              className="shadow-lg"
            >
              <Shield className="w-4 h-4 mr-2" />
              관리자
            </Button>
          )}
          {isLoggedIn ? (
            <Button
              onClick={() => navigate("/profile")}
              size="sm"
              variant="secondary"
              className="shadow-lg"
            >
              <User className="w-4 h-4 mr-2" />
              내 정보
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/auth")}
              size="sm"
              variant="secondary"
              className="shadow-lg"
            >
              <LogIn className="w-4 h-4 mr-2" />
              로그인
            </Button>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-hero opacity-95" />
        <img
          src={heroImage}
          alt="Conference Hero"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="relative px-6 py-16 text-center text-primary-foreground">
          <div className="inline-block mb-4">
            <span className="inline-block px-4 py-1.5 bg-accent/90 text-accent-foreground text-sm font-bold rounded-full shadow-glow">
              초대합니다
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            2024 비즈니스
            <br />
            컨퍼런스
          </h1>
          <p className="text-lg text-primary-foreground/90 mb-8">
            미래를 함께 만들어갈
            <br />
            여러분을 초대합니다
          </p>
          <Button
            onClick={() => navigate("/registration")}
            size="lg"
            className="h-12 px-8 bg-accent text-accent-foreground font-bold shadow-glow hover:opacity-90 transition-opacity"
          >
            참가 신청하기
          </Button>
        </div>
      </header>

      {/* Event Info */}
      <main className="px-6 py-8">
        <div className="space-y-6">
          {/* Info Cards */}
          <div className="grid gap-4">
            <div className="bg-card rounded-lg p-5 shadow-elegant border border-border">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-card-foreground mb-1">
                    일시
                  </h3>
                  <p className="text-muted-foreground">
                    2024년 12월 15일 (금)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    오전 9:00 - 오후 6:00
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-5 shadow-elegant border border-border">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-card-foreground mb-1">
                    장소
                  </h3>
                  <p className="text-muted-foreground">
                    서울 컨벤션 센터
                  </p>
                  <p className="text-sm text-muted-foreground">
                    서울특별시 강남구 테헤란로 123
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-5 shadow-elegant border border-border">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-card-foreground mb-1">
                    대상
                  </h3>
                  <p className="text-muted-foreground">
                    업계 전문가, 임원진
                  </p>
                  <p className="text-sm text-muted-foreground">
                    정원 200명 (선착순 마감)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-6 border border-border/50">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              행사 소개
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              2024 비즈니스 컨퍼런스는 업계 리더들과 함께 미래 비즈니스 트렌드를
              논의하고 네트워킹할 수 있는 특별한 기회입니다.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              최고의 연사진과 함께하는 심도 있는 세션, 실무 중심의 워크숍,
              그리고 다양한 네트워킹 기회를 통해 비즈니스 인사이트를 얻어가세요.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => navigate("/program")}
              variant="outline"
              className="h-14 font-semibold border-2 hover:border-primary hover:bg-primary/5"
            >
              프로그램 보기
            </Button>
            <Button
              onClick={() => navigate("/location")}
              variant="outline"
              className="h-14 font-semibold border-2 hover:border-primary hover:bg-primary/5"
            >
              오시는 길
            </Button>
          </div>
        </div>
      </main>

      <MobileNavigation />
    </div>
  );
};

export default Index;
