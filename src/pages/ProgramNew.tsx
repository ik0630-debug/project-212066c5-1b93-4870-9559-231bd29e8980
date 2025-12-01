import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MobileNavigation from "@/components/MobileNavigation";
import { useSwipeable } from "react-swipeable";
import { getNextEnabledPage } from "@/utils/pageNavigation";
import { usePageSettings } from "@/hooks/usePageSettings";
import { useProjectId } from "@/hooks/useProjectId";
import { useProgramSettings } from "@/hooks/useProgramSettings";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { PageHeader } from "@/components/PageHeader";
import { HeroImage } from "@/components/HeroImage";
import { useOpenGraph } from "@/hooks/useOpenGraph";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { getIconComponent } from "@/utils/iconUtils";

const ProgramNew = () => {
  const navigate = useNavigate();
  const { projectSlug } = useParams();
  const { projectId } = useProjectId();
  const { settings: pageSettings } = usePageSettings(projectId);
  const { settings, loading } = useProgramSettings(projectId);
  const isPageEnabled = pageSettings?.program ?? true;
  const [projectData, setProjectData] = useState<any>(null);

  // Load project data for OG tags
  useEffect(() => {
    const loadProjectData = async () => {
      if (!projectSlug) return;

      const { data } = await supabase
        .from("projects")
        .select("name, description, og_title, og_description, og_image")
        .eq("slug", projectSlug)
        .maybeSingle();

      if (data) {
        setProjectData(data);
      }
    };

    loadProjectData();
  }, [projectSlug]);

  // Set Open Graph tags
  useOpenGraph({
    title: projectData?.og_title || `${projectData?.name || ''} - 프로그램`,
    description: projectData?.og_description || projectData?.description || "프로그램 안내",
    image: projectData?.og_image,
    url: window.location.href,
  });

  const swipeHandlers = useSwipeable({
    onSwipedLeft: async () => {
      const nextPage = await getNextEnabledPage(`/${projectSlug}/program`, 'left', projectSlug);
      navigate(nextPage);
    },
    onSwipedRight: async () => {
      const nextPage = await getNextEnabledPage(`/${projectSlug}/program`, 'right', projectSlug);
      navigate(nextPage);
    },
    trackMouse: false,
  });

  if (loading) {
    return <LoadingSkeleton type="program" />;
  }

  const renderHeroSection = (section: any) => {
    if (section.enabled === "false") return null;
    return (
      <div key={section.id} className="relative">
        <HeroImage
          imageUrl={section.imageUrl}
          overlayOpacity={section.overlayOpacity}
          enabled={true}
        />
      </div>
    );
  };

  const renderDescriptionSection = (section: any) => {
    if (section.enabled === "false") return null;
    const bgColor = section.backgroundColor || section.bgColor || "";
    const titleSize = section.titleFontSize || "18";
    const contentSize = section.contentFontSize || "16";

    return (
      <section key={section.id} className="py-8 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <Card
            className="overflow-hidden border-0 shadow-md"
            style={bgColor ? { backgroundColor: `hsl(${bgColor})` } : { backgroundColor: 'white' }}
          >
            <CardContent className="p-8 space-y-3 text-left">
              {section.title && (
                <h2
                  className="font-bold text-gray-900"
                  style={{ fontSize: `${titleSize}px` }}
                >
                  {section.title}
                </h2>
              )}
              {section.content && (
                <p
                  className="text-gray-600 whitespace-pre-wrap leading-relaxed"
                  style={{ fontSize: `${contentSize}px` }}
                >
                  {section.content}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    );
  };

  const renderInfoCardSection = (section: any) => {
    if (section.enabled === "false") return null;
    if (!section.cards || section.cards.length === 0) return null;

    return (
      <section key={section.id} className="py-8 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto space-y-4">
          {section.cards.map((card: any) => {
            const IconComponent = (Icons as any)[card.icon || "Star"];
            const titleSize = card.titleFontSize || "16";
            const contentSize = card.contentFontSize || "14";
            const bgColor = card.bgColor || card.backgroundColor || "";
            const iconColor = card.iconColor || "220 70% 50%";

            return (
              <Card
                key={card.id}
                className="overflow-hidden border-0 shadow-md"
                style={bgColor ? { backgroundColor: `hsl(${bgColor})` } : { backgroundColor: 'white' }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {IconComponent && (
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `hsl(${iconColor} / 0.15)` }}
                      >
                        <IconComponent
                          className="w-6 h-6"
                          style={{ color: `hsl(${iconColor})` }}
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      {card.title && (
                        <h3
                          className="font-bold mb-2 text-gray-900"
                          style={{ fontSize: `${titleSize}px` }}
                        >
                          {card.title}
                        </h3>
                      )}
                      {card.content && (
                        <p
                          className="text-gray-600 whitespace-pre-wrap leading-relaxed"
                          style={{ fontSize: `${contentSize}px` }}
                        >
                          {card.content}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    );
  };

  const renderButtonGroup = (group: any) => {
    if (group.enabled === "false") return null;
    if (!group.buttons || group.buttons.length === 0) return null;

    const alignment = group.alignment || "center";
    const justifyClass =
      alignment === "left"
        ? "justify-start"
        : alignment === "right"
        ? "justify-end"
        : "justify-center";

    return (
      <section key={group.id} className="py-8 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className={`flex flex-wrap gap-3 ${justifyClass}`}>
            {group.buttons.map((button: any) => {
              const bgColor = button.bgColor || button.backgroundColor || "220 70% 50%";
              const textColor = button.textColor || "0 0% 100%";

              return (
                <Button
                  key={button.id}
                  asChild
                  size={button.size || "lg"}
                  className="shadow-sm"
                  style={{
                    backgroundColor: `hsl(${bgColor})`,
                    color: `hsl(${textColor})`,
                    fontSize: button.fontSize ? `${button.fontSize}px` : undefined,
                  }}
                >
                  <Link to={button.link || "#"}>{button.text}</Link>
                </Button>
              );
            })}
          </div>
        </div>
      </section>
    );
  };

  const renderProgramCards = () => {
    if (!settings.programCards || settings.programCards.length === 0) return null;

    return (
      <section className="py-8 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto space-y-4">
          {settings.programCards.map((card: any) => (
            <Card
              key={card.id}
              className="overflow-hidden border-0 shadow-md"
              style={{ backgroundColor: 'white' }}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    {(() => {
                      const IconComponent = getIconComponent(card.icon, "Clock");
                      return <IconComponent className="w-6 h-6 text-primary" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <div className="space-y-2">
                      <span className="text-sm font-semibold text-primary whitespace-pre-line block">
                        {card.time}
                      </span>
                      <h3 className="text-lg font-bold text-card-foreground whitespace-pre-line">
                        {card.title}
                      </h3>
                    </div>
                    {card.description && (
                      <p className="text-muted-foreground whitespace-pre-line mt-2">
                        {card.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  };

  const renderSection = (sectionId: string) => {
    const heroSection = settings.heroSections.find((s) => s.id === sectionId);
    if (heroSection) return renderHeroSection(heroSection);

    const descSection = settings.descriptions.find((s) => s.id === sectionId);
    if (descSection) return renderDescriptionSection(descSection);

    const infoCardSection = settings.infoCardSections.find((s) => s.id === sectionId);
    if (infoCardSection) return renderInfoCardSection(infoCardSection);

    const buttonGroup = settings.buttonGroups.find((g) => g.id === sectionId);
    if (buttonGroup) return renderButtonGroup(buttonGroup);

    return null;
  };

  return (
    <div {...swipeHandlers} className="min-h-screen bg-background pb-20 animate-fade-in">
      <div className="max-w-[800px] mx-auto">
        <PageHeader 
          title={settings.pageTitle}
          description={settings.pageDescription}
          backgroundColor={settings.headerColor}
        />

        {!isPageEnabled ? (
          <div className="bg-card rounded-lg p-8 shadow-elegant border border-border text-center space-y-4">
            <h2 className="text-xl font-bold text-foreground">
              프로그램 페이지가 일시적으로 비활성화되었습니다
            </h2>
            <p className="text-muted-foreground">
              현재 프로그램 정보를 제공하지 않고 있습니다. 자세한 사항은 관리자에게 문의해주세요.
            </p>
          </div>
        ) : settings.sectionOrder && settings.sectionOrder.length > 0 ? (
          <>
            {settings.sectionOrder.map((sectionId) => renderSection(sectionId))}
            {renderProgramCards()}
          </>
        ) : (
          <div className="min-h-screen flex items-center justify-center p-6">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">프로그램</h1>
              <p className="text-muted-foreground">
                관리자 페이지에서 프로그램 섹션을 추가해주세요.
              </p>
            </div>
          </div>
        )}

        <MobileNavigation />
      </div>
    </div>
  );
};

export default ProgramNew;
