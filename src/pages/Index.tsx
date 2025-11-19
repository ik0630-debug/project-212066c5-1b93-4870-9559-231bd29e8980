import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import * as LucideIcons from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MobileNavigation from "@/components/MobileNavigation";
import heroImage from "@/assets/hero-image.jpg";

interface InfoCard {
  id: string;
  icon: string;
  title: string;
  content: string;
  order: number;
}

interface BottomButton {
  id: string;
  text: string;
  link: string;
  variant: string;
  order: number;
}

const Index = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [heroUseText, setHeroUseText] = useState("true");
  const [heroTextContent, setHeroTextContent] = useState("");
  const [heroUseButton, setHeroUseButton] = useState("true");
  const [heroButtonPosition, setHeroButtonPosition] = useState("inside");
  const [heroButtonText, setHeroButtonText] = useState("참가 신청하기");
  const [heroButtonUrl, setHeroButtonUrl] = useState("/registration");
  const [heroButtonBgColor, setHeroButtonBgColor] = useState("");
  const [heroButtonTextColor, setHeroButtonTextColor] = useState("");
  const [heroButtonTextSize, setHeroButtonTextSize] = useState("lg");
  const [heroOverlayOpacity, setHeroOverlayOpacity] = useState("95");
  const [infoCards, setInfoCards] = useState<InfoCard[]>([]);
  const [descriptionTitle, setDescriptionTitle] = useState("행사 소개");
  const [descriptionContent, setDescriptionContent] = useState(
    "2024 비즈니스 컨퍼런스는 업계 리더들과 함께 미래 비즈니스 트렌드를 논의하고 네트워킹할 수 있는 특별한 기회입니다.\n\n최고의 연사진과 함께하는 심도 있는 세션, 실무 중심의 워크샵, 그리고 다양한 네트워킹 기회를 통해 비즈니스 인사이트를 얻어가세요."
  );
  const [bottomButtons, setBottomButtons] = useState<BottomButton[]>([]);
  const [sectionOrder, setSectionOrder] = useState<string[]>(['hero_section', 'info_cards', 'description', 'bottom_buttons']);

  useEffect(() => {
    checkUserStatus();
    loadHomeSettings();
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

  const loadHomeSettings = async () => {
    try {
      const { data: settings, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("category", "home");

      if (error) {
        console.error("Error loading home settings:", error);
        return;
      }

      if (settings) {
        const imageUrl = settings.find((s) => s.key === "hero_image_url");
        const useText = settings.find((s) => s.key === "hero_use_text");
        const textContent = settings.find((s) => s.key === "hero_text_content");
        const useButton = settings.find((s) => s.key === "hero_use_button");
        const buttonPosition = settings.find((s) => s.key === "hero_button_position");
        const buttonText = settings.find((s) => s.key === "hero_button_text");
        const buttonUrl = settings.find((s) => s.key === "hero_button_url");
        const buttonBgColor = settings.find((s) => s.key === "hero_button_bg_color");
        const buttonTextColor = settings.find((s) => s.key === "hero_button_text_color");
        const buttonTextSize = settings.find((s) => s.key === "hero_button_text_size");
        const overlayOpacity = settings.find((s) => s.key === "hero_overlay_opacity");

        if (imageUrl) setHeroImageUrl(imageUrl.value);
        if (useText) setHeroUseText(useText.value);
        if (textContent) setHeroTextContent(textContent.value);
        if (useButton) setHeroUseButton(useButton.value);
        if (buttonPosition) setHeroButtonPosition(buttonPosition.value);
        if (buttonText) setHeroButtonText(buttonText.value);
        if (buttonUrl) setHeroButtonUrl(buttonUrl.value);
        if (buttonBgColor) setHeroButtonBgColor(buttonBgColor.value);
        if (buttonTextColor) setHeroButtonTextColor(buttonTextColor.value);
        if (buttonTextSize) setHeroButtonTextSize(buttonTextSize.value);
        if (overlayOpacity) setHeroOverlayOpacity(overlayOpacity.value);

        const cards = settings
          .filter((s) => s.key.startsWith("home_info_card_"))
          .map((s) => {
            const cardData = JSON.parse(s.value);
            return { id: s.id, ...cardData };
          })
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        setInfoCards(cards);

        const descTitle = settings.find((s) => s.key === "description_title");
        const descContent = settings.find((s) => s.key === "description_content");
        if (descTitle) setDescriptionTitle(descTitle.value);
        if (descContent) setDescriptionContent(descContent.value);

        const buttons = settings
          .filter((s) => s.key.startsWith("home_bottom_button_"))
          .map((s) => {
            const buttonData = JSON.parse(s.value);
            return { id: s.id, ...buttonData };
          })
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        setBottomButtons(buttons);
        
        const orderSetting = settings.find((s) => s.key === "section_order");
        if (orderSetting) {
          try {
            const order = JSON.parse(orderSetting.value);
            setSectionOrder(order);
          } catch {
            setSectionOrder(['info_cards', 'description', 'bottom_buttons']);
          }
        }
      }
    } catch (error) {
      console.error("Error in loadHomeSettings:", error);
    }
  };

  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon || LucideIcons.Calendar;
  };

  const defaultInfoCards = [
    { id: "default-1", icon: "Calendar", title: "일시", content: "2024년 12월 15일 (금)\n오전 9:00 - 오후 6:00", order: 0 },
    { id: "default-2", icon: "MapPin", title: "장소", content: "서울 컨벤션 센터\n서울특별시 강남구 테헤란로 123", order: 1 },
    { id: "default-3", icon: "Users", title: "대상", content: "업계 전문가, 일원진\n정원 200명 (선착순 마감)", order: 2 },
  ];

  const displayCards = infoCards.length > 0 ? infoCards : defaultInfoCards;

  const displayButtons = bottomButtons;

  const HeroButton = () => {
    if (heroUseButton !== "true" || !heroButtonText || !heroButtonUrl) return null;
    
    return (
      <Button
        onClick={() => {
          if (heroButtonUrl.startsWith("http")) {
            window.open(heroButtonUrl, "_blank");
          } else {
            navigate(heroButtonUrl);
          }
        }}
        size={heroButtonTextSize as any || "lg"}
        style={{
          backgroundColor: heroButtonBgColor ? `hsl(${heroButtonBgColor})` : undefined,
          color: heroButtonTextColor ? `hsl(${heroButtonTextColor})` : undefined,
        }}
        className="shadow-glow hover-scale"
      >
        {heroButtonText}
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="relative w-full flex justify-center">
        <div className="relative w-full max-w-[1000px]">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            {isAdmin && (
              <Button onClick={() => navigate("/admin")} size="sm" variant="secondary" className="shadow-lg">
                <LucideIcons.Shield className="w-4 h-4 mr-2" />
                관리자
              </Button>
            )}
            {isLoggedIn ? (
              <Button onClick={() => navigate("/profile")} size="sm" variant="secondary" className="shadow-lg">
                <LucideIcons.User className="w-4 h-4 mr-2" />
                내 정보
              </Button>
            ) : (
              <Button onClick={() => navigate("/auth")} size="sm" variant="secondary" className="shadow-lg">
                <LucideIcons.LogIn className="w-4 h-4 mr-2" />
                로그인
              </Button>
            )}
          </div>
          
          <div className="relative">
            <div 
              className="absolute inset-0 bg-gradient-hero z-10 pointer-events-none" 
              style={{ opacity: parseInt(heroOverlayOpacity) / 100 }}
            />
            <img
              src={heroImageUrl || heroImage}
              alt="Conference Hero"
              className="w-full h-auto object-contain"
            />
            
            {heroUseText === "true" && heroTextContent && (
              <div className="absolute inset-0 z-20 flex items-center justify-center px-6 text-center text-primary-foreground pointer-events-none">
                <div 
                  className="w-full max-w-4xl"
                  dangerouslySetInnerHTML={{ __html: heroTextContent }}
                />
              </div>
            )}
            
            {heroButtonPosition === "inside" && (
              <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                <div className="pointer-events-auto mt-32">
                  <HeroButton />
                </div>
              </div>
            )}
          </div>
          
          {heroButtonPosition === "below" && (
            <div className="flex justify-center py-8">
              <HeroButton />
            </div>
          )}
        </div>
      </header>

      <main className="px-6 py-8">
        <div className="space-y-6">
          {sectionOrder.map((sectionKey) => {
            if (sectionKey === 'info_cards') {
              return (
                <div key={sectionKey} className="grid gap-4">
                  {displayCards.map((card) => {
                    const IconComponent = getIconComponent(card.icon);
                    return (
                      <div key={card.id} className="bg-card rounded-lg p-5 shadow-elegant border border-border">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-card-foreground mb-1">{card.title}</h3>
                            <p className="text-muted-foreground whitespace-pre-line">{card.content}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            }
            
            if (sectionKey === 'description') {
              return (
                <div key={sectionKey} className="bg-card rounded-lg p-6 shadow-elegant border border-border">
                  <h2 className="text-2xl font-bold text-card-foreground mb-4">{descriptionTitle}</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{descriptionContent}</p>
                </div>
              );
            }
            
            if (sectionKey === 'bottom_buttons' && displayButtons.length > 0) {
              return (
                <div key={sectionKey} className="grid grid-cols-2 gap-4">
                  {displayButtons.map((button) => (
                    <Button
                      key={button.id}
                      onClick={() => navigate(button.link)}
                      variant={button.variant as any || "outline"}
                      className="h-12"
                    >
                      {button.text}
                    </Button>
                  ))}
                </div>
              );
            }
            
            return null;
          })}
        </div>
      </main>

      <MobileNavigation />
    </div>
  );
};

export default Index;
