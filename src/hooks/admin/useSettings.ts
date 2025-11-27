import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSettings = () => {
  const { toast } = useToast();
  const [defaultProjectId, setDefaultProjectId] = useState<string | null>(null);
  
  const [heroSections, setHeroSections] = useState<any[]>([]);
  const [infoCardSections, setInfoCardSections] = useState<any[]>([]);
  const [descriptions, setDescriptions] = useState<any[]>([]);
  const [buttonGroups, setButtonGroups] = useState<any[]>([]);
  const [programCards, setProgramCards] = useState<any[]>([]);
  const [transportCards, setTransportCards] = useState<any[]>([]);
  const [locationBottomButtons, setLocationBottomButtons] = useState<any[]>([]);
  const [downloadFiles, setDownloadFiles] = useState<any[]>([]);
  const [sectionOrder, setSectionOrder] = useState<string[]>([]);
  const [locationSectionOrder, setLocationSectionOrder] = useState<string[]>([
    "description_buttons",
    "location_info",
    "transport_info",
    "contact_info",
  ]);
  
  const [settings, setSettings] = useState<any>({
    program_title: "",
    program_description: "",
    program_header_color: "220 70% 25%",
    program_enabled: "true",
    location_page_title: "",
    location_page_description: "",
    location_header_image: "",
    location_header_color: "220 70% 25%",
    location_enabled: "true",
    location_name: "",
    location_address: "",
    location_map_url: "",
    location_phone: "",
    location_email: "",
    location_description_title: "",
    location_description_content: "",
    location_description_bg_color: "",
    location_download_file_url: "",
    location_download_file_name: "",
  });

  const [registrationSettings, setRegistrationSettings] = useState({
    registration_page_title: "참가 신청",
    registration_page_description: "아래 양식을 작성해주세요",
    registration_success_title: "신청이 완료되었습니다!",
    registration_success_description: "참가 확인 메일을 발송해드렸습니다.",
    registration_enabled: "true",
  });

  const [registrationFields, setRegistrationFields] = useState([
    { id: "name", label: "성함", placeholder: "홍길동", type: "text", required: true },
    { id: "email", label: "이메일", placeholder: "example@company.com", type: "email", required: true },
    { id: "phone", label: "연락처", placeholder: "010-0000-0000", type: "tel", required: true },
    { id: "company", label: "소속 회사", placeholder: "회사명", type: "text", required: false },
    { id: "message", label: "특이사항", placeholder: "특별히 전달하실 말씀이 있으시면 작성해주세요", type: "textarea", required: false },
  ]);

  const loadSettings = useCallback(async () => {
    if (!defaultProjectId) {
      console.log('useSettings: No project ID yet, waiting...');
      return;
    }

    console.log('useSettings: Loading settings from database for project:', defaultProjectId);
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .eq("project_id", defaultProjectId);
    
    console.log('useSettings: Loaded data:', data?.length, 'records');
    
    const settingsMap: any = {};
    const loadedHeroSections: any = {};
    const loadedInfoCardSections: any = {};
    const loadedDescriptions: any = {};
    const loadedButtonGroups: any = {};
    const loadedProgramCards: any = {};
    const loadedTransportCards: any = {};
    const loadedLocationBottomButtons: any = {};
    const loadedDownloadFiles: any = {};
    const registrationSettingsData: any = {};

    data?.forEach(({ key, value, category }) => {
      // Handle section orders first (they don't follow the category prefix pattern)
      if (key === "sectionOrder" || key === "section_order") {
        try {
          setSectionOrder(JSON.parse(value));
        } catch {}
        return;
      }
      if (key === "location_section_order") {
        try {
          setLocationSectionOrder(JSON.parse(value));
        } catch {}
        return;
      }

      const keyParts = key.split("_");
      
      switch (category) {
        case "home":
          if (key.startsWith("home_hero_")) {
            try {
              const parsed = JSON.parse(value);
              const index = parsed.order || 0;
              loadedHeroSections[index] = parsed;
            } catch {}
          } else if (key.startsWith("home_infocard_section_") || key.startsWith("home_info_card_section_")) {
            try {
              const parsed = JSON.parse(value);
              const index = parsed.order || 0;
              loadedInfoCardSections[index] = parsed;
            } catch {}
          } else if (key.startsWith("home_description_")) {
            try {
              const parsed = JSON.parse(value);
              const index = parsed.order || 0;
              loadedDescriptions[index] = parsed;
            } catch {}
          } else if (key.startsWith("home_button_group_")) {
            try {
              const parsed = JSON.parse(value);
              const index = parsed.order || 0;
              loadedButtonGroups[index] = parsed;
          } catch {}
          } else {
            settingsMap[key] = value;
          }
          break;
        case "program":
          if (key.startsWith("program_card_")) {
            try {
              const parsed = JSON.parse(value);
              const index = parsed.order || 0;
              loadedProgramCards[index] = parsed;
            } catch {}
          } else {
            settingsMap[key] = value;
          }
          break;
        case "location":
          if (key.startsWith("transport_card_")) {
            try {
              const parsed = JSON.parse(value);
              const index = parsed.order || 0;
              loadedTransportCards[index] = parsed;
            } catch {}
          } else if (key.startsWith("location_bottom_button_")) {
            try {
              const parsed = JSON.parse(value);
              const index = parsed.order || 0;
              loadedLocationBottomButtons[index] = parsed;
            } catch {}
          } else if (key.startsWith("location_download_file_")) {
            try {
              const parsed = JSON.parse(value);
              const index = parsed.order || 0;
              loadedDownloadFiles[index] = parsed;
            } catch {}
          } else {
            settingsMap[key] = value;
          }
          break;
        case "registration":
          if (key === "registration_fields") {
            try {
              setRegistrationFields(JSON.parse(value));
            } catch (e) {
              console.error("Failed to parse registration fields", e);
            }
          } else {
            registrationSettingsData[key] = value;
          }
          break;
        default:
          settingsMap[key] = value;
      }
    });

    const heroSectionsArray = Object.values(loadedHeroSections).filter((hero: any) => hero.id);
    const infoCardSectionsArray = Object.values(loadedInfoCardSections).filter((section: any) => section.id);
    const descriptionsArray = Object.values(loadedDescriptions).filter((desc: any) => desc.id);
    const buttonGroupsArray = Object.values(loadedButtonGroups).filter((group: any) => group.id);
    const locationButtons = Object.values(loadedLocationBottomButtons).filter((btn: any) => btn.text);
    const downloadFilesArray = Object.values(loadedDownloadFiles).filter((file: any) => file.name && file.url);
    
    console.log('useSettings: Loaded hero sections:', heroSectionsArray.length);
    console.log('useSettings: Loaded info card sections:', infoCardSectionsArray.length);
    console.log('useSettings: Loaded descriptions:', descriptionsArray.length);
    console.log('useSettings: Loaded button groups:', buttonGroupsArray.length);
    console.log('useSettings: Loaded location bottom buttons:', locationButtons.length);
    console.log('useSettings: Loaded download files:', downloadFilesArray.length);
    
    setHeroSections(heroSectionsArray);
    setInfoCardSections(infoCardSectionsArray);
    setDescriptions(descriptionsArray);
    setButtonGroups(buttonGroupsArray);
    setLocationBottomButtons(locationButtons);
    setDownloadFiles(downloadFilesArray);
    setProgramCards(Object.values(loadedProgramCards).filter((card: any) => card.title));
    
    const loadedTransportCardsArray = Object.values(loadedTransportCards).filter((card: any) => card && card.title);
    console.log('useSettings: Loaded transport cards:', loadedTransportCardsArray.length, loadedTransportCardsArray);
    setTransportCards(loadedTransportCardsArray);
    
    setSettings(settingsMap);
    setRegistrationSettings(prev => ({ ...prev, ...registrationSettingsData }));
  }, [defaultProjectId]);

  const getCategoryFromKey = (key: string): string => {
    if (key.startsWith("hero_")) return "home";
    if (key.startsWith("description_")) return "home";
    if (key.startsWith("home_")) return "home";
    if (key.startsWith("program_")) return "program";
    if (key.startsWith("location_")) return "location";
    if (key.startsWith("transport_card_")) return "location";
    if (key.startsWith("section_")) return "home";
    return "general";
  };

  const saveSettings = async (options?: { silent?: boolean }) => {
    try {
      if (!defaultProjectId) {
        throw new Error("Project ID not found");
      }

      const settingsToSave = [
        ...Object.entries(settings).map(([key, value]) => ({
          category: getCategoryFromKey(key),
          key,
          value: value.toString(),
          project_id: defaultProjectId,
        })),
        ...Object.entries(registrationSettings).map(([key, value]) => ({
          category: "registration",
          key,
          value: value.toString(),
          project_id: defaultProjectId,
        })),
        {
          category: "registration",
          key: "registration_fields",
          value: JSON.stringify(registrationFields),
          project_id: defaultProjectId,
        },
        // Save hero sections
        ...heroSections.map((hero, index) => ({
          category: "home",
          key: `home_hero_${index}`,
          value: JSON.stringify({ ...hero, order: index }),
          project_id: defaultProjectId,
        })),
        // Save info card sections
        ...infoCardSections.map((section, index) => ({
          category: "home",
          key: `home_info_card_section_${index}`,
          value: JSON.stringify({ ...section, order: index }),
          project_id: defaultProjectId,
        })),
        // Save descriptions
        ...descriptions.map((desc, index) => ({
          category: "home",
          key: `home_description_${index}`,
          value: JSON.stringify({ ...desc, order: index }),
          project_id: defaultProjectId,
        })),
        // Save button groups
        ...buttonGroups.map((group, index) => ({
          category: "home",
          key: `home_button_group_${index}`,
          value: JSON.stringify({ ...group, order: index }),
          project_id: defaultProjectId,
        })),
        // Save program cards
        ...programCards.map((card, index) => ({
          category: "program",
          key: `program_card_${index}`,
          value: JSON.stringify({ ...card, order: index }),
          project_id: defaultProjectId,
        })),
        // Save transport cards
        ...transportCards.map((card, index) => ({
          category: "location",
          key: `transport_card_${index}`,
          value: JSON.stringify({ ...card, order: index }),
          project_id: defaultProjectId,
        })),
        // Save location bottom buttons
        ...locationBottomButtons.map((button, index) => ({
          category: "location",
          key: `location_bottom_button_${index}`,
          value: JSON.stringify({ ...button, order: index }),
          project_id: defaultProjectId,
        })),
        // Save download files
        ...downloadFiles.map((file, index) => ({
          category: "location",
          key: `location_download_file_${index}`,
          value: JSON.stringify({ ...file, order: index }),
          project_id: defaultProjectId,
        })),
        // Save section orders
        {
          category: "home",
          key: "section_order",
          value: JSON.stringify(sectionOrder),
          project_id: defaultProjectId,
        },
        {
          category: "location",
          key: "location_section_order",
          value: JSON.stringify(locationSectionOrder),
          project_id: defaultProjectId,
        },
      ];

      await supabase.from("site_settings").delete().eq("project_id", defaultProjectId);
      const { error } = await supabase.from("site_settings").insert(settingsToSave);

      if (error) throw error;

      if (!options?.silent) {
        toast({
          title: "저장 완료",
          description: "설정이 저장되었습니다.",
        });
      }
    } catch (error: any) {
      toast({
        title: "저장 실패",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSettingChange = (key: string, value: string) => {
    setSettings({ ...settings, [key]: value });
  };

  const saveSectionOrder = async (order: string[]) => {
    try {
      if (!defaultProjectId) return;
      
      await supabase.from("site_settings").delete()
        .eq("key", "section_order")
        .eq("project_id", defaultProjectId);
      await supabase.from("site_settings").insert({
        category: "home",
        key: "section_order",
        value: JSON.stringify(order),
        project_id: defaultProjectId,
      });
    } catch (error) {
      console.error("Error saving section order:", error);
    }
  };

  const saveLocationSectionOrder = async (order: string[]) => {
    try {
      if (!defaultProjectId) return;
      
      await supabase.from("site_settings").delete()
        .eq("key", "location_section_order")
        .eq("project_id", defaultProjectId);
      await supabase.from("site_settings").insert({
        category: "location",
        key: "location_section_order",
        value: JSON.stringify(order),
        project_id: defaultProjectId,
      });
    } catch (error) {
      console.error("Error saving location section order:", error);
    }
  };

  return {
    // State
    settings,
    registrationSettings,
    registrationFields,
    heroSections,
    infoCardSections,
    descriptions,
    buttonGroups,
    programCards,
    transportCards,
    locationBottomButtons,
    downloadFiles,
    sectionOrder,
    locationSectionOrder,
    defaultProjectId,
    
    // Setters
    setSettings,
    setRegistrationSettings,
    setRegistrationFields,
    setHeroSections,
    setInfoCardSections,
    setDescriptions,
    setButtonGroups,
    setProgramCards,
    setTransportCards,
    setLocationBottomButtons,
    setDownloadFiles,
    setSectionOrder,
    setLocationSectionOrder,
    setDefaultProjectId,
    
    // Functions
    loadSettings,
    saveSettings,
    handleSettingChange,
    saveSectionOrder,
    saveLocationSectionOrder,
  };
};
