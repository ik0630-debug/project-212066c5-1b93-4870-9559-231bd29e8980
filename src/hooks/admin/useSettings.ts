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
  const [programHeroSections, setProgramHeroSections] = useState<any[]>([]);
  const [programDescriptions, setProgramDescriptions] = useState<any[]>([]);
  const [programInfoCardSections, setProgramInfoCardSections] = useState<any[]>([]);
  const [programButtonGroups, setProgramButtonGroups] = useState<any[]>([]);
  const [programSectionOrder, setProgramSectionOrder] = useState<string[]>([]);
  const [transportCards, setTransportCards] = useState<any[]>([]);
  const [locationBottomButtons, setLocationBottomButtons] = useState<any[]>([]);
  const [downloadFiles, setDownloadFiles] = useState<any[]>([]);
  const [locationButtonGroups, setLocationButtonGroups] = useState<any[]>([]);
  const [sectionOrder, setSectionOrder] = useState<string[]>([]);
  const [locationSectionOrder, setLocationSectionOrder] = useState<string[]>([
    "description_buttons",
    "location_info",
    "transport_info",
    "contact_info",
  ]);
  const [registrationHeroSections, setRegistrationHeroSections] = useState<any[]>([]);
  const [registrationInfoCardSections, setRegistrationInfoCardSections] = useState<any[]>([]);
  const [registrationDescriptions, setRegistrationDescriptions] = useState<any[]>([]);
  const [registrationButtonGroups, setRegistrationButtonGroups] = useState<any[]>([]);
  const [registrationSectionOrder, setRegistrationSectionOrder] = useState<string[]>(["registration_form_fields"]);
  
  const [settings, setSettings] = useState<any>({
    program_title: "프로그램",
    program_description: "세부 프로그램을 소개합니다.",
    program_header_color: "221 83% 33%",
    program_enabled: "true",
    location_page_title: "",
    location_page_description: "",
    location_header_image: "",
    location_header_color: "221 83% 33%",
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
    registration_header_bg_color: "221 83% 33%",
  });

  const [registrationFields, setRegistrationFields] = useState([
    { id: "name", label: "이름", placeholder: "홍길동", type: "text", required: true, icon: "User" },
    { id: "company", label: "소속", placeholder: "소속 기관명", type: "text", required: true, icon: "Building" },
    { id: "department", label: "부서", placeholder: "부서명", type: "text", required: false, icon: "Briefcase" },
    { id: "position", label: "직함", placeholder: "직위/직급", type: "text", required: true, icon: "Award" },
    { id: "phone", label: "휴대전화", placeholder: "010-0000-0000", type: "tel", required: true, icon: "Smartphone" },
    { id: "email", label: "이메일", placeholder: "example@company.com", type: "email", required: true, icon: "Mail" },
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
    const loadedProgramHeroSections: any = {};
    const loadedProgramDescriptions: any = {};
    const loadedProgramInfoCardSections: any = {};
    const loadedProgramButtonGroups: any = {};
    const loadedTransportCards: any = {};
    const loadedLocationBottomButtons: any = {};
    const loadedDownloadFiles: any = {};
    const loadedLocationButtonGroups: any = {};
    const loadedRegistrationHeroSections: any = {};
    const loadedRegistrationInfoCardSections: any = {};
    const loadedRegistrationDescriptions: any = {};
    const loadedRegistrationButtonGroups: any = {};
    const registrationSettingsData: any = {};

    data?.forEach(({ key, value, category }) => {
      // Handle section orders first (they don't follow the category prefix pattern)
      if (key === "sectionOrder" || key === "section_order") {
        try {
          setSectionOrder(JSON.parse(value));
        } catch {}
        return;
      }
      if (key === "program_section_order") {
        try {
          setProgramSectionOrder(JSON.parse(value));
        } catch {}
        return;
      }
      if (key === "location_section_order") {
        try {
          setLocationSectionOrder(JSON.parse(value));
        } catch {}
        return;
      }
      if (key === "registration_section_order") {
        try {
          setRegistrationSectionOrder(JSON.parse(value));
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
          if (key.startsWith("program_hero_")) {
            try {
              const parsed = JSON.parse(value);
              const index = parsed.order || 0;
              loadedProgramHeroSections[index] = parsed;
            } catch {}
          } else if (key.startsWith("program_info_card_section_") || key.startsWith("program_info_cards_")) {
            try {
              const parsed = JSON.parse(value);
              const index = parsed.order || 0;
              loadedProgramInfoCardSections[index] = parsed;
            } catch {}
          } else if (key.startsWith("program_description_")) {
            try {
              const parsed = JSON.parse(value);
              const index = parsed.order || 0;
              loadedProgramDescriptions[index] = parsed;
            } catch {}
          } else if (key.startsWith("program_button_group_")) {
            try {
              const parsed = JSON.parse(value);
              const index = parsed.order || 0;
              loadedProgramButtonGroups[index] = parsed;
            } catch {}
          } else if (key.startsWith("program_card_")) {
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
          } else if (key.startsWith("location_button_group_")) {
            try {
              const parsed = JSON.parse(value);
              const index = parsed.order || 0;
              loadedLocationButtonGroups[index] = parsed;
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
          } else if (key.startsWith("registration_hero_")) {
            try {
              const parsed = JSON.parse(value);
              const index = parsed.order || 0;
              loadedRegistrationHeroSections[index] = parsed;
            } catch {}
          } else if (key.startsWith("registration_info_card_section_")) {
            try {
              const parsed = JSON.parse(value);
              const index = parsed.order || 0;
              loadedRegistrationInfoCardSections[index] = parsed;
            } catch {}
          } else if (key.startsWith("registration_description_")) {
            try {
              const parsed = JSON.parse(value);
              const index = parsed.order || 0;
              loadedRegistrationDescriptions[index] = parsed;
            } catch {}
          } else if (key.startsWith("registration_button_group_")) {
            try {
              const parsed = JSON.parse(value);
              const index = parsed.order || 0;
              loadedRegistrationButtonGroups[index] = parsed;
            } catch {}
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
    const programHeroSectionsArray = Object.values(loadedProgramHeroSections).filter((hero: any) => hero.id);
    const programInfoCardSectionsArray = Object.values(loadedProgramInfoCardSections).filter((section: any) => section.id);
    const programDescriptionsArray = Object.values(loadedProgramDescriptions).filter((desc: any) => desc.id);
    const programButtonGroupsArray = Object.values(loadedProgramButtonGroups).filter((group: any) => group.id);
    const locationButtons = Object.values(loadedLocationBottomButtons).filter((btn: any) => btn.text);
    const downloadFilesArray = Object.values(loadedDownloadFiles).filter((file: any) => file.name && file.url);
    const locationButtonGroupsArray = Object.values(loadedLocationButtonGroups).filter((group: any) => group.id);
    const registrationHeroSectionsArray = Object.values(loadedRegistrationHeroSections).filter((hero: any) => hero.id);
    const registrationInfoCardSectionsArray = Object.values(loadedRegistrationInfoCardSections).filter((section: any) => section.id);
    const registrationDescriptionsArray = Object.values(loadedRegistrationDescriptions).filter((desc: any) => desc.id);
    const registrationButtonGroupsArray = Object.values(loadedRegistrationButtonGroups).filter((group: any) => group.id);
    
    console.log('useSettings: Loaded hero sections:', heroSectionsArray.length);
    console.log('useSettings: Loaded info card sections:', infoCardSectionsArray.length);
    console.log('useSettings: Loaded descriptions:', descriptionsArray.length);
    console.log('useSettings: Loaded button groups:', buttonGroupsArray.length);
    console.log('useSettings: Loaded program hero sections:', programHeroSectionsArray.length);
    console.log('useSettings: Loaded program info card sections:', programInfoCardSectionsArray.length);
    console.log('useSettings: Loaded program descriptions:', programDescriptionsArray.length);
    console.log('useSettings: Loaded program button groups:', programButtonGroupsArray.length);
    console.log('useSettings: Loaded location bottom buttons:', locationButtons.length);
    console.log('useSettings: Loaded download files:', downloadFilesArray.length);
    console.log('useSettings: Loaded location button groups:', locationButtonGroupsArray.length);
    console.log('useSettings: Loaded registration hero sections:', registrationHeroSectionsArray.length);
    console.log('useSettings: Loaded registration info card sections:', registrationInfoCardSectionsArray.length);
    console.log('useSettings: Loaded registration descriptions:', registrationDescriptionsArray.length);
    console.log('useSettings: Loaded registration button groups:', registrationButtonGroupsArray.length);
    
    // 홈 섹션이 모두 비어있으면 기본 섹션들 생성
    const isHomeSectionsEmpty = heroSectionsArray.length === 0 && 
                                infoCardSectionsArray.length === 0 && 
                                descriptionsArray.length === 0 && 
                                buttonGroupsArray.length === 0;
    
    if (isHomeSectionsEmpty) {
      console.log('useSettings: Creating default home sections...');
      
      // 기본 Hero 섹션
      const defaultHero = {
        id: 'hero_1',
        imageUrl: '',
        overlayOpacity: '30',
        order: 0,
      };
      
      // 기본 Description 섹션
      const defaultDescription = {
        id: 'description_1',
        title: '환영합니다',
        content: '이곳은 프로젝트 소개 영역입니다.\n관리자 페이지에서 이 내용을 수정할 수 있습니다.',
        titleFontSize: '32',
        contentFontSize: '16',
        backgroundColor: '',
        order: 0,
      };
      
      // 기본 Info Card 섹션
      const defaultInfoCardSection = {
        id: 'infocard_section_1',
        title: '주요 특징',
        cards: [
          {
            id: 'card_1',
            icon: 'Star',
            title: '첫 번째 특징',
            content: '여기에 첫 번째 특징을 설명합니다.',
            titleFontSize: '20',
            contentFontSize: '14',
            bgColor: '',
            iconColor: '220 70% 50%',
          },
          {
            id: 'card_2',
            icon: 'Zap',
            title: '두 번째 특징',
            content: '여기에 두 번째 특징을 설명합니다.',
            titleFontSize: '20',
            contentFontSize: '14',
            bgColor: '',
            iconColor: '220 70% 50%',
          },
          {
            id: 'card_3',
            icon: 'Heart',
            title: '세 번째 특징',
            content: '여기에 세 번째 특징을 설명합니다.',
            titleFontSize: '20',
            contentFontSize: '14',
            bgColor: '',
            iconColor: '220 70% 50%',
          },
        ],
        order: 0,
      };
      
      // 기본 Button Group
      const defaultButtonGroup = {
        id: 'button_group_1',
        title: '지금 시작하기',
        buttons: [
          {
            id: 'button_1',
            text: '참가 신청',
            link: '/registration',
            bgColor: '220 70% 50%',
            textColor: '0 0% 100%',
          },
          {
            id: 'button_2',
            text: '자세히 보기',
            link: '/program',
            bgColor: '0 0% 95%',
            textColor: '220 70% 20%',
          },
        ],
        order: 0,
      };
      
      const defaultSectionOrder = ['hero_1', 'description_1', 'infocard_section_1', 'button_group_1'];
      
      // 상태 업데이트
      setHeroSections([defaultHero]);
      setDescriptions([defaultDescription]);
      setInfoCardSections([defaultInfoCardSection]);
      setButtonGroups([defaultButtonGroup]);
      setSectionOrder(defaultSectionOrder);
      
      // 데이터베이스에 저장
      const defaultSettings = [
        {
          category: "home",
          key: "home_hero_0",
          value: JSON.stringify(defaultHero),
          project_id: defaultProjectId,
        },
        {
          category: "home",
          key: "home_description_0",
          value: JSON.stringify(defaultDescription),
          project_id: defaultProjectId,
        },
        {
          category: "home",
          key: "home_info_card_section_0",
          value: JSON.stringify(defaultInfoCardSection),
          project_id: defaultProjectId,
        },
        {
          category: "home",
          key: "home_button_group_0",
          value: JSON.stringify(defaultButtonGroup),
          project_id: defaultProjectId,
        },
        {
          category: "home",
          key: "section_order",
          value: JSON.stringify(defaultSectionOrder),
          project_id: defaultProjectId,
        },
      ];
      
      await supabase.from("site_settings").insert(defaultSettings);
      console.log('useSettings: Default sections created');
    } else {
      setHeroSections(heroSectionsArray);
      setInfoCardSections(infoCardSectionsArray);
      setDescriptions(descriptionsArray);
      setButtonGroups(buttonGroupsArray);
    }
    
    setProgramHeroSections(programHeroSectionsArray);
    setProgramInfoCardSections(programInfoCardSectionsArray);
    setProgramDescriptions(programDescriptionsArray);
    setProgramButtonGroups(programButtonGroupsArray);
    setLocationBottomButtons(locationButtons);
    setDownloadFiles(downloadFilesArray);
    setLocationButtonGroups(locationButtonGroupsArray);
    setProgramCards(Object.values(loadedProgramCards).filter((card: any) => card.title));
    
    const loadedTransportCardsArray = Object.values(loadedTransportCards).filter((card: any) => card && card.title);
    console.log('useSettings: Loaded transport cards:', loadedTransportCardsArray.length, loadedTransportCardsArray);
    setTransportCards(loadedTransportCardsArray);
    
    setRegistrationHeroSections(registrationHeroSectionsArray);
    setRegistrationInfoCardSections(registrationInfoCardSectionsArray);
    setRegistrationDescriptions(registrationDescriptionsArray);
    setRegistrationButtonGroups(registrationButtonGroupsArray);
    
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
        // Save program hero sections
        ...programHeroSections.map((hero, index) => ({
          category: "program",
          key: `program_hero_${index}`,
          value: JSON.stringify({ ...hero, order: index }),
          project_id: defaultProjectId,
        })),
        // Save program info card sections
        ...programInfoCardSections.map((section, index) => ({
          category: "program",
          key: `program_info_cards_${index}`,
          value: JSON.stringify({ ...section, order: index }),
          project_id: defaultProjectId,
        })),
        // Save program descriptions
        ...programDescriptions.map((desc, index) => ({
          category: "program",
          key: `program_description_${index}`,
          value: JSON.stringify({ ...desc, order: index }),
          project_id: defaultProjectId,
        })),
        // Save program button groups
        ...programButtonGroups.map((group, index) => ({
          category: "program",
          key: `program_button_group_${index}`,
          value: JSON.stringify({ ...group, order: index }),
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
        // Save location button groups
        ...locationButtonGroups.map((group, index) => ({
          category: "location",
          key: `location_button_group_${index}`,
          value: JSON.stringify({ ...group, order: index }),
          project_id: defaultProjectId,
        })),
        // Save registration hero sections
        ...registrationHeroSections.map((hero, index) => ({
          category: "registration",
          key: `registration_hero_${index}`,
          value: JSON.stringify({ ...hero, order: index }),
          project_id: defaultProjectId,
        })),
        // Save registration info card sections
        ...registrationInfoCardSections.map((section, index) => ({
          category: "registration",
          key: `registration_info_card_section_${index}`,
          value: JSON.stringify({ ...section, order: index }),
          project_id: defaultProjectId,
        })),
        // Save registration descriptions
        ...registrationDescriptions.map((desc, index) => ({
          category: "registration",
          key: `registration_description_${index}`,
          value: JSON.stringify({ ...desc, order: index }),
          project_id: defaultProjectId,
        })),
        // Save registration button groups
        ...registrationButtonGroups.map((group, index) => ({
          category: "registration",
          key: `registration_button_group_${index}`,
          value: JSON.stringify({ ...group, order: index }),
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
          category: "program",
          key: "program_section_order",
          value: JSON.stringify(programSectionOrder),
          project_id: defaultProjectId,
        },
        {
          category: "location",
          key: "location_section_order",
          value: JSON.stringify(locationSectionOrder),
          project_id: defaultProjectId,
        },
        {
          category: "registration",
          key: "registration_section_order",
          value: JSON.stringify(registrationSectionOrder),
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

  const saveProgramSectionOrder = async (order: string[]) => {
    try {
      if (!defaultProjectId) return;
      
      await supabase.from("site_settings").delete()
        .eq("key", "program_section_order")
        .eq("project_id", defaultProjectId);
      await supabase.from("site_settings").insert({
        category: "program",
        key: "program_section_order",
        value: JSON.stringify(order),
        project_id: defaultProjectId,
      });
    } catch (error) {
      console.error("Error saving program section order:", error);
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

  const saveRegistrationSectionOrder = async (order: string[]) => {
    try {
      if (!defaultProjectId) return;
      
      await supabase.from("site_settings").delete()
        .eq("key", "registration_section_order")
        .eq("project_id", defaultProjectId);
      await supabase.from("site_settings").insert({
        category: "registration",
        key: "registration_section_order",
        value: JSON.stringify(order),
        project_id: defaultProjectId,
      });
    } catch (error) {
      console.error("Error saving registration section order:", error);
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
    programHeroSections,
    programDescriptions,
    programInfoCardSections,
    programButtonGroups,
    programSectionOrder,
    transportCards,
    locationBottomButtons,
    downloadFiles,
    locationButtonGroups,
    sectionOrder,
    locationSectionOrder,
    registrationHeroSections,
    registrationInfoCardSections,
    registrationDescriptions,
    registrationButtonGroups,
    registrationSectionOrder,
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
    setProgramHeroSections,
    setProgramDescriptions,
    setProgramInfoCardSections,
    setProgramButtonGroups,
    setProgramSectionOrder,
    setTransportCards,
    setLocationBottomButtons,
    setDownloadFiles,
    setLocationButtonGroups,
    setSectionOrder,
    setLocationSectionOrder,
    setRegistrationHeroSections,
    setRegistrationInfoCardSections,
    setRegistrationDescriptions,
    setRegistrationButtonGroups,
    setRegistrationSectionOrder,
    setDefaultProjectId,
    
    // Functions
    loadSettings,
    saveSettings,
    handleSettingChange,
    saveSectionOrder,
    saveProgramSectionOrder,
    saveLocationSectionOrder,
    saveRegistrationSectionOrder,
  };
};
