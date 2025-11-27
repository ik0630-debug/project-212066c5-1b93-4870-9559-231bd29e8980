import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import * as LucideIcons from "lucide-react";
import MobileNavigation from "@/components/MobileNavigation";
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

  console.log('Index: settings loaded', {
    sectionOrder: settings.sectionOrder,
    heroSections: settings.heroSections?.length,
    infoCardSections: settings.infoCardSections?.length,
    descriptions: settings.descriptions?.length,
    buttonGroups: settings.buttonGroups?.length,
  });

  return (
    <div {...swipeHandlers} className="min-h-screen bg-background pb-20">
      <div className="max-w-[800px] mx-auto">
        <main className="px-6 py-4">
          <div className="space-y-6">
            {settings.sectionOrder.map((sectionKey) => {
              // Render hero sections
              if (sectionKey.startsWith('hero_')) {
                const heroSection = settings.heroSections?.find((h: any) => h.id === sectionKey);
                if (heroSection && heroSection.enabled === "true") {
                  return (
                    <header key={sectionKey} className="flex flex-col items-center justify-center -mx-6 -mt-4">
                      <div className="relative w-full">
                        {heroSection.imageUrl ? (
                          <div className="relative">
                            <div 
                              className="absolute inset-0 bg-gradient-hero z-10 pointer-events-none" 
                              style={{ opacity: parseInt(heroSection.overlayOpacity || "0") / 100 }}
                            />
                            <img
                              src={heroSection.imageUrl}
                              alt="Conference Hero"
                              className="w-full h-auto object-contain"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-48 bg-muted/30 border-2 border-dashed border-border">
                            <p className="text-muted-foreground">이미지를 업로드하시면 여기에 표시됩니다.</p>
                          </div>
                        )}
                      </div>
                    </header>
                  );
                }
              }

              // Render info card sections
              if (sectionKey.startsWith('infocard_section_')) {
                console.log('Checking infocard section:', sectionKey, settings.infoCardSections);
                const infoCardSection = settings.infoCardSections?.find((s: any) => s.id === sectionKey);
                if (infoCardSection && infoCardSection.enabled === "true" && infoCardSection.cards?.length > 0) {
                  return (
                    <div key={sectionKey} className="grid gap-4">
                      {infoCardSection.cards.map((card: any, index: number) => {
                        const IconComponent = getIconComponent(card.icon);
                        const bgColor = card.bgColor || "0 0% 100%";
                        const iconColor = card.iconColor || "221 83% 53%";
                        const titleFontSize = card.titleFontSize || "16";
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
              }
              
              if (sectionKey.startsWith('description_')) {
                const description = settings.descriptions?.find((d: any) => d.id === sectionKey);
                if (description && description.enabled === "true" && (description.title || description.content)) {
                  const titleFontSize = description.titleFontSize || "24";
                  const contentFontSize = description.contentFontSize || "14";
                  const bgColor = description.bgColor || "0 0% 100%";
                  
                  return (
                    <div 
                      key={sectionKey} 
                      className="rounded-lg p-6 shadow-elegant border border-border"
                      style={{ backgroundColor: `hsl(${bgColor})` }}
                    >
                      {description.title && (
                        <h2 
                          className="font-bold text-card-foreground mb-4 whitespace-pre-line"
                          style={{ fontSize: `${titleFontSize}px` }}
                        >
                          {description.title}
                        </h2>
                      )}
                      {description.content && (
                        <p 
                          className="text-muted-foreground leading-relaxed whitespace-pre-line"
                          style={{ fontSize: `${contentFontSize}px` }}
                        >
                          {description.content}
                        </p>
                      )}
                    </div>
                  );
                }
              }
              
              if (sectionKey.startsWith('button_group_')) {
                const buttonGroup = settings.buttonGroups?.find((g: any) => g.id === sectionKey);
                if (buttonGroup && buttonGroup.enabled === "true" && buttonGroup.buttons?.length > 0) {
                  return (
                    <div key={sectionKey} className="grid grid-cols-2 gap-4">
                      {buttonGroup.buttons.map((button: any, index: number) => {
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