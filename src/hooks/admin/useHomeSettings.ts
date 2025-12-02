import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { parseJsonSafely } from "@/utils/settingsUtils";

export const useHomeSettings = () => {
  const [heroSections, setHeroSections] = useState<any[]>([]);
  const [infoCardSections, setInfoCardSections] = useState<any[]>([]);
  const [descriptions, setDescriptions] = useState<any[]>([]);
  const [buttonGroups, setButtonGroups] = useState<any[]>([]);
  const [sectionOrder, setSectionOrder] = useState<string[]>([]);

  const loadHomeSettings = (data: any[]) => {
    const loadedHeroSections: any = {};
    const loadedInfoCardSections: any = {};
    const loadedDescriptions: any = {};
    const loadedButtonGroups: any = {};

    data?.forEach(({ key, value, category }) => {
      if (category !== "home") return;

      if (key === "sectionOrder" || key === "section_order") {
        const parsed = parseJsonSafely(value, []);
        setSectionOrder(parsed);
        return;
      }

      if (key.startsWith("home_hero_")) {
        const parsed = parseJsonSafely(value);
        if (parsed) {
          const index = parsed.order || 0;
          loadedHeroSections[index] = parsed;
        }
      } else if (key.startsWith("home_infocard_section_") || key.startsWith("home_info_card_section_")) {
        const parsed = parseJsonSafely(value);
        if (parsed) {
          const index = parsed.order || 0;
          loadedInfoCardSections[index] = parsed;
        }
      } else if (key.startsWith("home_description_")) {
        const parsed = parseJsonSafely(value);
        if (parsed) {
          const index = parsed.order || 0;
          loadedDescriptions[index] = parsed;
        }
      } else if (key.startsWith("home_button_group_")) {
        const parsed = parseJsonSafely(value);
        if (parsed) {
          const index = parsed.order || 0;
          loadedButtonGroups[index] = parsed;
        }
      }
    });

    const heroSectionsArray = Object.values(loadedHeroSections).filter((hero: any) => hero.id);
    const infoCardSectionsArray = Object.values(loadedInfoCardSections).filter((section: any) => section.id);
    const descriptionsArray = Object.values(loadedDescriptions).filter((desc: any) => desc.id);
    const buttonGroupsArray = Object.values(loadedButtonGroups).filter((group: any) => group.id);

    const isHomeSectionsEmpty = heroSectionsArray.length === 0 && 
                                infoCardSectionsArray.length === 0 && 
                                descriptionsArray.length === 0 && 
                                buttonGroupsArray.length === 0;

    if (isHomeSectionsEmpty) {
      return createDefaultHomeSections();
    }

    setHeroSections(heroSectionsArray);
    setInfoCardSections(infoCardSectionsArray);
    setDescriptions(descriptionsArray);
    setButtonGroups(buttonGroupsArray);

    return null;
  };

  const createDefaultHomeSections = () => {
    const defaultHero = {
      id: 'hero_1',
      imageUrl: '',
      overlayOpacity: '30',
      order: 0,
    };

    const defaultDescription = {
      id: 'description_1',
      title: '환영합니다',
      content: '이곳은 프로젝트 소개 영역입니다.\n관리자 페이지에서 이 내용을 수정할 수 있습니다.',
      titleFontSize: '32',
      contentFontSize: '16',
      backgroundColor: '',
      order: 0,
    };

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

    setHeroSections([defaultHero]);
    setDescriptions([defaultDescription]);
    setInfoCardSections([defaultInfoCardSection]);
    setButtonGroups([defaultButtonGroup]);
    setSectionOrder(defaultSectionOrder);

    return [
      {
        category: "home",
        key: "home_hero_0",
        value: JSON.stringify(defaultHero),
      },
      {
        category: "home",
        key: "home_description_0",
        value: JSON.stringify(defaultDescription),
      },
      {
        category: "home",
        key: "home_info_card_section_0",
        value: JSON.stringify(defaultInfoCardSection),
      },
      {
        category: "home",
        key: "home_button_group_0",
        value: JSON.stringify(defaultButtonGroup),
      },
      {
        category: "home",
        key: "section_order",
        value: JSON.stringify(defaultSectionOrder),
      },
    ];
  };

  const getHomeSettingsToSave = (projectId: string) => {
    return [
      ...heroSections.map((hero, index) => ({
        category: "home",
        key: `home_hero_${index}`,
        value: JSON.stringify({ ...hero, order: index }),
        project_id: projectId,
      })),
      ...infoCardSections.map((section, index) => ({
        category: "home",
        key: `home_info_card_section_${index}`,
        value: JSON.stringify({ ...section, order: index }),
        project_id: projectId,
      })),
      ...descriptions.map((desc, index) => ({
        category: "home",
        key: `home_description_${index}`,
        value: JSON.stringify({ ...desc, order: index }),
        project_id: projectId,
      })),
      ...buttonGroups.map((group, index) => ({
        category: "home",
        key: `home_button_group_${index}`,
        value: JSON.stringify({ ...group, order: index }),
        project_id: projectId,
      })),
      {
        category: "home",
        key: "section_order",
        value: JSON.stringify(sectionOrder),
        project_id: projectId,
      },
    ];
  };

  const saveSectionOrder = async (order: string[], projectId: string) => {
    try {
      if (!projectId) return;
      
      await supabase.from("site_settings").delete()
        .eq("key", "section_order")
        .eq("project_id", projectId);
      await supabase.from("site_settings").insert({
        category: "home",
        key: "section_order",
        value: JSON.stringify(order),
        project_id: projectId,
      });
    } catch (error) {
      console.error("Error saving section order:", error);
    }
  };

  return {
    heroSections,
    infoCardSections,
    descriptions,
    buttonGroups,
    sectionOrder,
    setHeroSections,
    setInfoCardSections,
    setDescriptions,
    setButtonGroups,
    setSectionOrder,
    loadHomeSettings,
    getHomeSettingsToSave,
    saveSectionOrder,
  };
};
