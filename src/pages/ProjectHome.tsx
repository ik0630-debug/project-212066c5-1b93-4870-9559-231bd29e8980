import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHomeSettings } from "@/hooks/useHomeSettings";
import { useProjectId } from "@/hooks/useProjectId";
import { HeroImage } from "@/components/HeroImage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

const ProjectHome = () => {
  const { projectSlug } = useParams();
  const { projectId } = useProjectId();
  const { settings, loading } = useHomeSettings(projectId);

  console.log('ProjectHome:', { projectSlug, projectId, loading, sectionsCount: settings.sectionOrder?.length });

  if (loading) {
    return <LoadingSkeleton />;
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

    return (
      <section key={group.id} className="py-8 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto space-y-3">
          {group.buttons.map((button: any, index: number) => {
            const bgColor = button.bgColor || button.backgroundColor || "220 70% 50%";
            const textColor = button.textColor || "0 0% 100%";
            const alignment = button.alignment || "center";
            const justifyClass =
              alignment === "left"
                ? "justify-start"
                : alignment === "right"
                ? "justify-end"
                : "justify-center";
            
            const handleClick = () => {
              if (button.linkType === "file") {
                window.open(button.link || button.fileUrl, '_blank', 'noopener,noreferrer');
              } else if (button.linkType === "external") {
                window.open(button.link, '_blank', 'noopener,noreferrer');
              }
            };

            const ButtonContent = (
              <Button
                size={button.size || "lg"}
                className={`shadow-sm ${button.fontSize || ''}`}
                style={{
                  backgroundColor: `hsl(${bgColor})`,
                  color: `hsl(${textColor})`,
                  width: button.size === "full" ? "100%" : "auto",
                }}
                onClick={button.linkType === "file" || button.linkType === "external" ? handleClick : undefined}
              >
                {button.text}
              </Button>
            );

            return (
              <div key={`${group.id}-btn-${index}`} className={`flex ${justifyClass}`}>
                {button.linkType === "internal" ? (
                  <Link to={button.link || "#"}>{ButtonContent}</Link>
                ) : (
                  ButtonContent
                )}
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  const renderSection = (sectionId: string) => {
    // Hero sections
    const heroSection = settings.heroSections.find((s) => s.id === sectionId);
    if (heroSection) return renderHeroSection(heroSection);

    // Description sections
    const descSection = settings.descriptions.find((s) => s.id === sectionId);
    if (descSection) return renderDescriptionSection(descSection);

    // Info card sections
    const infoCardSection = settings.infoCardSections.find(
      (s) => s.id === sectionId
    );
    if (infoCardSection) return renderInfoCardSection(infoCardSection);

    // Button groups
    const buttonGroup = settings.buttonGroups.find((g) => g.id === sectionId);
    if (buttonGroup) return renderButtonGroup(buttonGroup);

    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      {settings.sectionOrder && settings.sectionOrder.length > 0 ? (
        settings.sectionOrder.map((sectionId) => renderSection(sectionId))
      ) : (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">환영합니다</h1>
            <p className="text-muted-foreground">
              관리자 페이지에서 홈 화면 섹션을 추가해주세요.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectHome;
