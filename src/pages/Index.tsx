import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import * as LucideIcons from "lucide-react";
import MobileNavigation from "@/components/MobileNavigation";
import heroImage from "@/assets/hero-image.jpg";
import { useHomeSettings } from "@/hooks/useHomeSettings";
import { useSwipeable } from "react-swipeable";
import { getNextEnabledPage } from "@/utils/pageNavigation";

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


  const swipeHandlers = useSwipeable({
    onSwipedLeft: async () => {
      const nextPage = await getNextEnabledPage('/', 'left');
      navigate(nextPage);
    },
    trackMouse: false,
  });

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">로딩 중...</div>;
  }

  return (
    <div {...swipeHandlers} className="min-h-screen bg-background pb-20">
      <div className="max-w-[800px] mx-auto">
        {settings.heroEnabled === "true" && (
          <header className="flex flex-col items-center justify-center">
            <div className="relative w-full">
              <div className="relative">
                <div 
                  className="absolute inset-0 bg-gradient-hero z-10 pointer-events-none" 
                  style={{ opacity: parseInt(settings.heroOverlayOpacity || "0") / 100 }}
                />
                <img
                  src={settings.heroImageUrl || heroImage}
                  alt="Conference Hero"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </header>
        )}

        <main className="px-6 py-4">
          <div className="space-y-6">
            {settings.sectionOrder.map((sectionKey) => {
              if (sectionKey === 'info_cards' && settings.infoCardsEnabled === "true" && settings.infoCards.length > 0) {
                return (
                  <div key={sectionKey} className="grid gap-4">
                    {settings.infoCards.map((card, index) => {
                      const IconComponent = getIconComponent(card.icon);
                      const bgColor = card.bgColor || "0 0% 100%";
                      const iconColor = card.iconColor || "221 83% 53%";
                      const titleFontSize = card.titleFontSize || "18";
                      const contentFontSize = card.contentFontSize || "14";
                      
                      return (
                        <div 
                          key={index} 
                          className="rounded-lg p-5 shadow-elegant border border-border"
                          style={{ backgroundColor: `hsl(${bgColor})` }}
                        >
                          <div className="flex items-start gap-4">
                            <div 
                              className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: `hsl(${iconColor} / 0.1)` }}
                            >
                              <IconComponent 
                                className="w-6 h-6" 
                                style={{ color: `hsl(${iconColor})` }}
                              />
                            </div>
                            <div>
                              <h3 
                                className="font-bold text-card-foreground mb-1"
                                style={{ fontSize: `${titleFontSize}px` }}
                              >
                                {card.title}
                              </h3>
                              <p 
                                className="text-muted-foreground whitespace-pre-line"
                                style={{ fontSize: `${contentFontSize}px` }}
                              >
                                {card.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              }
              
              if (sectionKey === 'description' && settings.descriptionEnabled === "true" && (settings.descriptionTitle || settings.descriptionContent)) {
                const titleFontSize = settings.descriptionTitleFontSize || "24";
                const contentFontSize = settings.descriptionContentFontSize || "16";
                const bgColor = settings.descriptionBgColor || "";
                
                return (
                  <div 
                    key={sectionKey} 
                    className="rounded-lg p-6 shadow-elegant border border-border"
                    style={bgColor ? { backgroundColor: `hsl(${bgColor})` } : undefined}
                  >
                    {settings.descriptionTitle && (
                      <h2 
                        className="font-bold text-card-foreground mb-4 whitespace-pre-line"
                        style={{ fontSize: `${titleFontSize}px` }}
                      >
                        {settings.descriptionTitle}
                      </h2>
                    )}
                    {settings.descriptionContent && (
                      <p 
                        className="text-muted-foreground leading-relaxed whitespace-pre-line"
                        style={{ fontSize: `${contentFontSize}px` }}
                      >
                        {settings.descriptionContent}
                      </p>
                    )}
                  </div>
                );
              }
              
              if (sectionKey === 'bottom_buttons' && settings.bottomButtonsEnabled === "true" && settings.bottomButtons.length > 0) {
                return (
                  <div key={sectionKey} className="grid grid-cols-2 gap-4">
                    {settings.bottomButtons.map((button, index) => {
                      const bgColor = button.bgColor || "221 83% 53%";
                      const textColor = button.textColor || "0 0% 100%";
                      
                      return (
                        <Button
                          key={index}
                          onClick={() => navigate(button.link)}
                          variant="outline"
                          size={button.size as any || "default"}
                          className={button.fontSize || "text-sm"}
                          style={{
                            backgroundColor: `hsl(${bgColor})`,
                            color: `hsl(${textColor})`,
                            borderColor: `hsl(${bgColor})`,
                          }}
                        >
                          {button.text}
                        </Button>
                      );
                    })}
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