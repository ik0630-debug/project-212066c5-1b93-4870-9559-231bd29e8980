import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileNavigation from "@/components/MobileNavigation";
import { MapPin, Train, Bus, Car, Navigation, Upload, Plane, Ship } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useSwipeable } from "react-swipeable";

const Location = () => {
  const navigate = useNavigate();
  const [headerImage, setHeaderImage] = useState<string>("");
  const [headerColor, setHeaderColor] = useState("");
  const [pageTitle, setPageTitle] = useState("");
  const [pageDescription, setPageDescription] = useState("");
  const [locationName, setLocationName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [locationMapUrl, setLocationMapUrl] = useState("");
  const [locationPhone, setLocationPhone] = useState("");
  const [locationEmail, setLocationEmail] = useState("");
  const [descriptionTitle, setDescriptionTitle] = useState("");
  const [descriptionContent, setDescriptionContent] = useState("");
  const [descriptionBgColor, setDescriptionBgColor] = useState("");
  const [bottomButtons, setBottomButtons] = useState<any[]>([]);
  const [transportations, setTransportations] = useState<any[]>([]);
  const [isPageEnabled, setIsPageEnabled] = useState(true);
  const [contentOrder, setContentOrder] = useState("description_first");
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    "description_buttons",
    "location_info",
    "transport_info",
    "contact_info",
  ]);

  useEffect(() => {
    loadLocationSettings();
  }, []);

  const loadLocationSettings = async () => {
    const { data: settings } = await supabase
      .from('site_settings')
      .select('*')
      .eq('category', 'location');

    if (!settings) return;

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
        case 'location_enabled':
          setIsPageEnabled(setting.value === "true");
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
        case 'location_content_order':
          setContentOrder(setting.value);
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
    }).filter(Boolean).sort((a: any, b: any) => a.order - b.order);

    const locationButtonsSettings = settings.filter(s => s.key.startsWith('location_bottom_button_'));
    const buttons = locationButtonsSettings.map(s => {
      try {
        return JSON.parse(s.value);
      } catch {
        return null;
      }
    }).filter(Boolean).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

    setBottomButtons(buttons);

    if (cards.length > 0) {
      setTransportations(cards);
    } else {
      setTransportations([
        {
          icon: "Train",
          title: "지하철",
          description: "2호선 강남역 5번 출구에서 도보 5분",
        },
        {
          icon: "Bus",
          title: "버스",
          description: "146, 360, 440, 1100번 - 강남역 하차",
        },
        {
          icon: "Car",
          title: "자가용",
          description: "건물 지하 1~3층 주차 가능 (3시간 무료)",
        },
      ]);
    }
  };

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

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = { Train, Bus, Car, Plane, Ship };
    return icons[iconName] || MapPin;
  };

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case "description_buttons":
        return contentOrder === "description_first" ? (
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

            {/* Bottom Buttons */}
            {bottomButtons.length > 0 && (
              <div className="flex justify-center gap-4">
                {bottomButtons.map((button, index) => (
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
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Bottom Buttons */}
            {bottomButtons.length > 0 && (
              <div className="flex justify-center gap-4">
                {bottomButtons.map((button, index) => (
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
            )}

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
                  지도 앱에서 열기
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
                const Icon = getIconComponent(icon);
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
        return null;
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedRight: () => navigate('/registration'),
    trackMouse: false,
  });

  return (
    <div {...swipeHandlers} className="min-h-screen bg-background pb-20">
      <div className="max-w-[800px] mx-auto">
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
      </div>

      {/* Header Image - Full width hero style */}
      {isPageEnabled && headerImage && (
        <div className="w-full">
          <img 
            src={headerImage} 
            alt="Location header" 
            className="w-full h-auto"
          />
        </div>
      )}

      <div className="max-w-[800px] mx-auto">
        <main className="px-6 py-8 space-y-8">
        {!isPageEnabled ? (
          <div className="bg-card rounded-lg p-8 shadow-elegant border border-border text-center space-y-4">
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
              <div key={sectionId}>{renderSection(sectionId)}</div>
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
