import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import * as LucideIcons from "lucide-react";
import MobileNavigation from "@/components/MobileNavigation";
import heroImage from "@/assets/hero-image.jpg";
import { useHomeSettings } from "@/hooks/useHomeSettings";
import { useSwipeable } from "react-swipeable";

const Index = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { settings, loading } = useHomeSettings();

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsLoggedIn(!!session);
    
    if (session) {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      
      setIsAdmin(!!data);
    }
  };

  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon || LucideIcons.Calendar;
  };

  const HeroButton = () => {
    if (settings.heroUseButton !== "true" || !settings.heroButtonText || !settings.heroButtonUrl) return null;
    
    return (
      <Button
        onClick={() => {
          if (settings.heroButtonUrl.startsWith("http")) {
            window.open(settings.heroButtonUrl, "_blank");
          } else {
            navigate(settings.heroButtonUrl);
          }
        }}
        size={settings.heroButtonTextSize as any || "lg"}
        style={{
          backgroundColor: settings.heroButtonBgColor ? `hsl(${settings.heroButtonBgColor})` : undefined,
          color: settings.heroButtonTextColor ? `hsl(${settings.heroButtonTextColor})` : undefined,
        }}
        className="shadow-xl hover:shadow-2xl transition-all"
      >
        {settings.heroButtonText}
      </Button>
    );
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => navigate('/program'),
    trackMouse: false,
  });

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">로딩 중...</div>;
  }

  return (
    <div {...swipeHandlers} className="min-h-screen bg-background pb-20">
      <div className="max-w-[800px] mx-auto">
        <header className="flex flex-col items-center justify-center">
          <div className="relative w-full">
            <div className="relative">
              <div 
                className="absolute inset-0 bg-gradient-hero z-10 pointer-events-none" 
                style={{ opacity: parseInt(settings.heroOverlayOpacity) / 100 }}
              />
              <img
                src={settings.heroImageUrl || heroImage}
                alt="Conference Hero"
                className="w-full h-auto object-contain"
              />
              
              {settings.heroUseText === "true" && settings.heroTextContent && (
                <div className="absolute inset-0 z-20 flex items-center justify-center px-6 text-center text-primary-foreground pointer-events-none">
                  <div 
                    className="w-full max-w-4xl"
                    dangerouslySetInnerHTML={{ __html: settings.heroTextContent }}
                  />
                </div>
              )}
              
              {settings.heroButtonPosition === "inside" && (
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                  <div className="pointer-events-auto mt-32">
                    <HeroButton />
                  </div>
                </div>
              )}
            </div>
            
            {settings.heroButtonPosition === "below" && (
              <div className="flex justify-center py-8">
                <HeroButton />
              </div>
            )}
          </div>
        </header>

        <main className="px-6 py-8">
          <div className="space-y-6">
            {settings.sectionOrder.map((sectionKey) => {
              if (sectionKey === 'info_cards' && settings.infoCards.length > 0) {
                return (
                  <div key={sectionKey} className="grid gap-4">
                    {settings.infoCards.map((card, index) => {
                      const IconComponent = getIconComponent(card.icon);
                      return (
                        <div key={index} className="bg-card rounded-lg p-5 shadow-elegant border border-border">
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
              
              if (sectionKey === 'description' && (settings.descriptionTitle || settings.descriptionContent)) {
                return (
                  <div key={sectionKey} className="bg-card rounded-lg p-6 shadow-elegant border border-border">
                    {settings.descriptionTitle && <h2 className="font-bold text-card-foreground mb-4 whitespace-pre-line">{settings.descriptionTitle}</h2>}
                    {settings.descriptionContent && <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{settings.descriptionContent}</p>}
                  </div>
                );
              }
              
              if (sectionKey === 'bottom_buttons' && settings.bottomButtons.length > 0) {
                return (
                  <div key={sectionKey} className="grid grid-cols-2 gap-4">
                    {settings.bottomButtons.map((button, index) => (
                      <Button
                        key={index}
                        onClick={() => navigate(button.link)}
                        variant={button.variant as any || "outline"}
                        size={button.size as any || "default"}
                        className={button.fontSize || "text-sm"}
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
    </div>
  );
};

export default Index;