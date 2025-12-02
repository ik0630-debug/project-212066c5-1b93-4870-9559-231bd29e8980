import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MobileNavigation from "@/components/MobileNavigation";
import { MapPin, Navigation, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSwipeable } from "react-swipeable";
import { getNextEnabledPage } from "@/utils/pageNavigation";
import { usePageSettings } from "@/hooks/usePageSettings";
import { useProjectId } from "@/hooks/useProjectId";
import { getIconComponent } from "@/utils/iconUtils";
import { useCategorySettings } from "@/hooks/useCategorySettings";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { PageHeader } from "@/components/PageHeader";
import { HeroImage } from "@/components/HeroImage";
import { useOpenGraph } from "@/hooks/useOpenGraph";
import { supabase } from "@/integrations/supabase/client";

const Location = () => {
  const navigate = useNavigate();
  const { projectSlug } = useParams();
  const { projectId } = useProjectId();
  const [headerImage, setHeaderImage] = useState<string>("");
  const [headerColor, setHeaderColor] = useState("");
  const [pageTitle, setPageTitle] = useState("");
  const [pageDescription, setPageDescription] = useState("");
  const [heroEnabled, setHeroEnabled] = useState(true);
  const [heroOverlayOpacity, setHeroOverlayOpacity] = useState("0");
  const [locationName, setLocationName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [locationMapUrl, setLocationMapUrl] = useState("");
  const [locationMapUrlLabel, setLocationMapUrlLabel] = useState("지도 앱에서 열기");
  const [locationPhone, setLocationPhone] = useState("");
  const [locationEmail, setLocationEmail] = useState("");
  const [descriptionTitle, setDescriptionTitle] = useState("");
  const [descriptionContent, setDescriptionContent] = useState("");
  const [descriptionBgColor, setDescriptionBgColor] = useState("");
  const [downloadFiles, setDownloadFiles] = useState<any[]>([]);
  const [bottomButtons, setBottomButtons] = useState<any[]>([]);
  const [buttonGroups, setButtonGroups] = useState<any[]>([]);
  const [transportations, setTransportations] = useState<any[]>([]);
  const { settings: pageSettings } = usePageSettings(projectId);
  const { settings, loading } = useCategorySettings(['location', 'general'], projectId);
  const isPageEnabled = pageSettings?.location ?? true;
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    "description_buttons",
    "location_info",
    "transport_info",
    "contact_info",
  ]);
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
    title: projectData?.og_title || `${projectData?.name || ''} - 오시는 길`,
    description: projectData?.og_description || projectData?.description || "오시는 길 안내",
    image: projectData?.og_image,
    url: window.location.href,
  });

  useEffect(() => {
    if (!settings) return;

    try {
      settings.forEach(setting => {
      switch (setting.key) {
        case 'location_header_image':
          setHeaderImage(setting.value);
          break;
        case 'location_page_title':
          setPageTitle(setting.value);
          break;
        case 'location_page_description':
          setPageDescription(setting.value);
          break;
        case 'location_header_color':
          setHeaderColor(setting.value);
          break;
        case 'location_hero_enabled':
          setHeroEnabled(setting.value === 'true');
          break;
        case 'location_hero_overlay_opacity':
          setHeroOverlayOpacity(setting.value);
          break;
        case 'location_name':
          setLocationName(setting.value);
          break;
        case 'location_address':
          setLocationAddress(setting.value);
          break;
        case 'location_map_url':
          setLocationMapUrl(setting.value);
          break;
        case 'location_map_url_label':
          setLocationMapUrlLabel(setting.value);
          break;
        case 'location_phone':
          setLocationPhone(setting.value);
          break;
        case 'location_email':
          setLocationEmail(setting.value);
          break;
        case 'location_description_title':
          setDescriptionTitle(setting.value);
          break;
        case 'location_description_content':
          setDescriptionContent(setting.value);
          break;
        case 'location_description_bg_color':
          setDescriptionBgColor(setting.value);
          break;
        case 'location_section_order':
          try {
            setSectionOrder(JSON.parse(setting.value));
          } catch {
            // Use default order if parsing fails
          }
          break;
      }
    });

    const transportCardsSettings = settings.filter(s => s.key.startsWith('transport_card_'));
    const cards = transportCardsSettings.map(s => {
      try {
        return { ...JSON.parse(s.value), order: parseInt(s.description || '0') };
      } catch {
        return null;
      }
    }).filter((card): card is any => card !== null).sort((a: any, b: any) => a.order - b.order);

    const locationButtonsSettings = settings.filter(s => s.key.startsWith('location_bottom_button_'));
    const buttons = locationButtonsSettings.map(s => {
      try {
        return JSON.parse(s.value);
      } catch {
        return null;
      }
    }).filter(Boolean).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

    const downloadFilesSettings = settings.filter(s => s.key.startsWith('location_download_file_'));
    const files = downloadFilesSettings.map(s => {
      try {
        return JSON.parse(s.value);
      } catch {
        return null;
      }
    }).filter(Boolean).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

    const buttonGroupSettings = settings.filter(s => s.key.startsWith('location_button_group_'));
    const groups = buttonGroupSettings.map(s => {
      try {
        return JSON.parse(s.value);
      } catch {
        return null;
      }
    }).filter(Boolean).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

      setBottomButtons(buttons);
      setDownloadFiles(files);
      setButtonGroups(groups);
      setTransportations(cards);
    } catch (error) {
      console.error("Error parsing location settings:", error);
    }
  }, [settings]);

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

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case "hero_image":
        return (
          <HeroImage 
            imageUrl={headerImage}
            alt="Location header"
            overlayOpacity={heroOverlayOpacity}
            enabled={isPageEnabled && heroEnabled}
          />
        );

      case "description_buttons":
        return (
          <div className="space-y-6">
            {/* Description Section */}
            {(descriptionTitle || descriptionContent) && (
              <div 
                className="rounded-lg p-6 shadow-elegant border border-border"
                style={{ backgroundColor: descriptionBgColor ? `hsl(${descriptionBgColor})` : undefined }}
              >
                {descriptionTitle && <h2 className="font-bold text-card-foreground mb-4 whitespace-pre-line">{descriptionTitle}</h2>}
                {descriptionContent && <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{descriptionContent}</p>}
              </div>
            )}

            {/* Download Files */}
            {downloadFiles.length > 0 && (
              <div className="space-y-3">
                {downloadFiles.map((file, index) => (
                  <div key={index} className="flex justify-center">
                    <Button
                      onClick={() => window.open(file.url, '_blank', 'noopener,noreferrer')}
                      variant="outline"
                      size="lg"
                      className="gap-2 w-full max-w-md"
                    >
                      <Download className="w-5 h-5" />
                      {file.name}
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Buttons */}
            {bottomButtons.length > 0 && (
              <div className="flex justify-center gap-4">
                {bottomButtons.map((button, index) => (
                  <Button
                    key={index}
                    onClick={() => {
                      if (button.link.startsWith('/') || button.link.startsWith('#')) {
                        navigate(button.link);
                      } else {
                        window.open(button.link, '_blank', 'noopener,noreferrer');
                      }
                    }}
                    variant={button.variant as any || "outline"}
                    size={button.size as any || "default"}
                    className={button.fontSize || "text-sm"}
                  >
                    {button.text}
                  </Button>
                ))}
              </div>
            )}
          </div>
        );

      case "location_info":
        return (
          <div className="bg-card rounded-lg p-6 shadow-elegant border border-border">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-card-foreground mb-2">
                  {locationName}
                </h3>
                <p className="text-muted-foreground text-sm mb-3 whitespace-pre-line">
                  {locationAddress}
                </p>
                <a
                  href={locationMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  {locationMapUrlLabel}
                </a>
              </div>
            </div>
          </div>
        );

      case "transport_info":
        return (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">
              교통 안내
            </h2>
            <div className="space-y-4">
              {transportations.map(({ icon, title, description }, index) => {
                const Icon = getIconComponent(icon, "MapPin");
                return (
                  <div
                    key={index}
                    className="bg-card rounded-lg p-5 shadow-elegant border border-border"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-card-foreground mb-1">
                          {title}
                        </h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                          {description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "contact_info":
        return (
          <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
            <h3 className="text-lg font-bold text-foreground mb-3">
              문의사항
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                전화: {locationPhone}
              </p>
              <p className="text-muted-foreground">
                이메일: {locationEmail}
              </p>
            </div>
          </div>
        );

      default:
        // Check if it's a button group section
        if (sectionId.startsWith("button_group_")) {
          const groupIndex = parseInt(sectionId.replace("button_group_", ""));
          const group = buttonGroups[groupIndex];
          if (!group || !group.buttons || group.buttons.length === 0) return null;

          return (
            <div key={sectionId} className="space-y-3">
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
                  } else if (button.linkType === "internal") {
                    navigate(button.link || "#");
                  }
                };

                return (
                  <div key={`btn-${index}`} className={`flex ${justifyClass}`}>
                    <Button
                      size={button.size || "lg"}
                      className={`shadow-sm ${button.fontSize || ''}`}
                      style={{
                        backgroundColor: `hsl(${bgColor})`,
                        color: `hsl(${textColor})`,
                        width: button.size === "full" ? "100%" : "auto",
                      }}
                      onClick={handleClick}
                    >
                      {button.text}
                    </Button>
                  </div>
                );
              })}
            </div>
          );
        }
        return null;
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedRight: async () => {
      const nextPage = await getNextEnabledPage(`/${projectSlug}/location`, 'right', projectSlug);
      navigate(nextPage);
    },
    trackMouse: false,
  });

  if (loading) {
    return <LoadingSkeleton type="location" />;
  }

  return (
    <div {...swipeHandlers} className="min-h-screen bg-background pb-20 animate-fade-in">
      <div className="max-w-[800px] mx-auto">
        <PageHeader 
          title={pageTitle}
          description={pageDescription}
          backgroundColor={headerColor}
        />
      </div>

      <div className="max-w-[800px] mx-auto">
        <main className="space-y-8">
        {!isPageEnabled ? (
          <div className="bg-card rounded-lg p-8 shadow-elegant border border-border text-center space-y-4 mx-6 mt-8">
            <h2 className="text-xl font-bold text-foreground">
              오시는 길 페이지가 일시적으로 비활성화되었습니다
            </h2>
            <p className="text-muted-foreground">
              현재 위치 정보를 제공하지 않고 있습니다. 자세한 사항은 관리자에게 문의해주세요.
            </p>
          </div>
        ) : (
          <>
            {sectionOrder.map((sectionId) => (
              <div key={sectionId} className={sectionId === "hero_image" ? "" : "px-6"}>
                {renderSection(sectionId)}
              </div>
            ))}
          </>
        )}
        </main>

        <MobileNavigation />
      </div>
    </div>
  );
};

export default Location;
