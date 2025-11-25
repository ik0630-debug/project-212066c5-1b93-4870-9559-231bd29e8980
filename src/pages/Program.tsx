import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import * as LucideIcons from "lucide-react";
import MobileNavigation from "@/components/MobileNavigation";
import { useSwipeable } from "react-swipeable";
import { getNextEnabledPage } from "@/utils/pageNavigation";

interface ProgramCard {
  id: string;
  time: string;
  title: string;
  description: string;
  icon?: string;
  order: number;
}

const Program = () => {
  const navigate = useNavigate();
  const [pageTitle, setPageTitle] = useState("");
  const [pageDescription, setPageDescription] = useState("");
  const [headerColor, setHeaderColor] = useState("");
  const [programCards, setProgramCards] = useState<ProgramCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPageEnabled, setIsPageEnabled] = useState(true);

  useEffect(() => {
    loadProgramData();
  }, []);

  const loadProgramData = async () => {
    try {
      const { data: settings, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("category", "program");

      if (error) {
        console.error("Error loading program data:", error);
        return;
      }

      if (settings) {
        // Load page title and description
        const titleSetting = settings.find((s) => s.key === "program_title");
        const descSetting = settings.find((s) => s.key === "program_description");
        const colorSetting = settings.find((s) => s.key === "program_header_color");
        const enabledSetting = settings.find((s) => s.key === "program_enabled");

        if (titleSetting) setPageTitle(titleSetting.value);
        if (descSetting) setPageDescription(descSetting.value);
        if (colorSetting) setHeaderColor(colorSetting.value);
        if (enabledSetting) setIsPageEnabled(enabledSetting.value === "true");

        // Load program cards
        const cards = settings
          .filter((s) => s.key.startsWith("program_card_"))
          .map((s) => {
            const cardData = JSON.parse(s.value);
            return {
              id: s.id,
              ...cardData,
            };
          })
          .sort((a, b) => (a.order || 0) - (b.order || 0));

        setProgramCards(cards);
      }
    } catch (error) {
      console.error("Error in loadProgramData:", error);
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName?: string) => {
    if (!iconName) return LucideIcons.Clock;
    const Icon = (LucideIcons as any)[iconName];
    return Icon || LucideIcons.Clock;
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: async () => {
      const nextPage = await getNextEnabledPage('/program', 'left');
      navigate(nextPage);
    },
    onSwipedRight: async () => {
      const nextPage = await getNextEnabledPage('/program', 'right');
      navigate(nextPage);
    },
    trackMouse: false,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    );
  }

  return (
    <div {...swipeHandlers} className="min-h-screen bg-background pb-20">
      <div className="max-w-[800px] mx-auto">
        {/* Header */}
        <header 
          className={`sticky top-0 z-40 text-primary-foreground py-4 px-6 text-center ${!headerColor ? 'bg-gradient-primary' : ''}`}
          style={{ backgroundColor: headerColor ? `hsl(${headerColor})` : undefined }}
        >
          <h1 className="text-2xl font-bold mb-1">{pageTitle}</h1>
          {pageDescription && (
            <p className="text-primary-foreground/90 text-sm whitespace-pre-line">
              {pageDescription}
            </p>
          )}
        </header>

        {/* Program Schedule */}
        <main className="px-6 py-8">
          {!isPageEnabled ? (
            <div className="bg-card rounded-lg p-8 shadow-elegant border border-border text-center space-y-4">
              <h2 className="text-xl font-bold text-foreground">
                프로그램 페이지가 일시적으로 비활성화되었습니다
              </h2>
              <p className="text-muted-foreground">
                현재 프로그램 정보를 제공하지 않고 있습니다. 자세한 사항은 관리자에게 문의해주세요.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
            {programCards.length === 0 ? (
              <div className="bg-card rounded-lg p-8 shadow-elegant border border-border text-center">
                <p className="text-muted-foreground">
                  아직 등록된 프로그램이 없습니다.
                </p>
              </div>
            ) : (
              programCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-card rounded-lg p-5 shadow-elegant border border-border hover:shadow-glow transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      {(() => {
                        const IconComponent = getIconComponent(card.icon);
                        return <IconComponent className="w-6 h-6 text-primary" />;
                      })()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-sm font-semibold text-primary">
                          {card.time}
                        </span>
                        <h3 className="text-lg font-bold text-card-foreground">
                          {card.title}
                        </h3>
                      </div>
                      {card.description && (
                        <p className="text-muted-foreground whitespace-pre-line">
                          {card.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          )}
        </main>

        {/* Mobile Navigation */}
        <MobileNavigation />
      </div>
    </div>
  );
};

export default Program;