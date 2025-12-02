import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { parseJsonSafely, mergeWithDefaults } from "@/utils/settingsUtils";

export const useProgramSettings = () => {
  const [programCards, setProgramCards] = useState<any[]>([]);
  const [programHeroSections, setProgramHeroSections] = useState<any[]>([]);
  const [programDescriptions, setProgramDescriptions] = useState<any[]>([]);
  const [programInfoCardSections, setProgramInfoCardSections] = useState<any[]>([]);
  const [programButtonGroups, setProgramButtonGroups] = useState<any[]>([]);
  const [programSectionOrder, setProgramSectionOrder] = useState<string[]>([]);
  
  const [programSettings, setProgramSettings] = useState<any>({
    program_title: "프로그램",
    program_description: "세부 행사 일정을 소개합니다",
    program_header_color: "221 83% 33%",
    program_enabled: "true",
  });

  const loadProgramSettings = (data: any[]) => {
    const loadedProgramCards: any = {};
    const loadedProgramHeroSections: any = {};
    const loadedProgramDescriptions: any = {};
    const loadedProgramInfoCardSections: any = {};
    const loadedProgramButtonGroups: any = {};
    const settingsMap: any = {};

    data?.forEach(({ key, value, category }) => {
      if (category !== "program") return;

      if (key === "program_section_order") {
        const parsed = parseJsonSafely(value, []);
        setProgramSectionOrder(parsed);
        return;
      }

      if (key.startsWith("program_hero_")) {
        const parsed = parseJsonSafely(value);
        if (parsed) {
          const index = parsed.order || 0;
          loadedProgramHeroSections[index] = parsed;
        }
      } else if (key.startsWith("program_info_card_section_") || key.startsWith("program_info_cards_")) {
        const parsed = parseJsonSafely(value);
        if (parsed) {
          const index = parsed.order || 0;
          loadedProgramInfoCardSections[index] = parsed;
        }
      } else if (key.startsWith("program_description_")) {
        const parsed = parseJsonSafely(value);
        if (parsed) {
          const index = parsed.order || 0;
          loadedProgramDescriptions[index] = parsed;
        }
      } else if (key.startsWith("program_button_group_")) {
        const parsed = parseJsonSafely(value);
        if (parsed) {
          const index = parsed.order || 0;
          loadedProgramButtonGroups[index] = parsed;
        }
      } else if (key.startsWith("program_card_")) {
        const parsed = parseJsonSafely(value);
        if (parsed) {
          const index = parsed.order || 0;
          loadedProgramCards[index] = parsed;
        }
      } else {
        settingsMap[key] = value;
      }
    });

    const programHeroSectionsArray = Object.values(loadedProgramHeroSections).filter((hero: any) => hero.id);
    const programInfoCardSectionsArray = Object.values(loadedProgramInfoCardSections).filter((section: any) => section.id);
    const programDescriptionsArray = Object.values(loadedProgramDescriptions).filter((desc: any) => desc.id);
    const programButtonGroupsArray = Object.values(loadedProgramButtonGroups).filter((group: any) => group.id);
    const programCardsArray = Object.values(loadedProgramCards).filter((card: any) => card.title);

    setProgramHeroSections(programHeroSectionsArray);
    setProgramInfoCardSections(programInfoCardSectionsArray);
    setProgramDescriptions(programDescriptionsArray);
    setProgramButtonGroups(programButtonGroupsArray);
    setProgramCards(programCardsArray);

    const defaultSettings = {
      program_title: "프로그램",
      program_description: "세부 행사 일정을 소개합니다",
      program_header_color: "221 83% 33%",
    };

    const mergedSettings = mergeWithDefaults(settingsMap, defaultSettings);
    setProgramSettings(prev => ({ ...prev, ...mergedSettings }));
  };

  const getProgramSettingsToSave = (projectId: string) => {
    return [
      ...Object.entries(programSettings).map(([key, value]) => ({
        category: "program",
        key,
        value: value.toString(),
        project_id: projectId,
      })),
      ...programCards.map((card, index) => ({
        category: "program",
        key: `program_card_${index}`,
        value: JSON.stringify({ ...card, order: index }),
        project_id: projectId,
      })),
      ...programHeroSections.map((hero, index) => ({
        category: "program",
        key: `program_hero_${index}`,
        value: JSON.stringify({ ...hero, order: index }),
        project_id: projectId,
      })),
      ...programInfoCardSections.map((section, index) => ({
        category: "program",
        key: `program_info_cards_${index}`,
        value: JSON.stringify({ ...section, order: index }),
        project_id: projectId,
      })),
      ...programDescriptions.map((desc, index) => ({
        category: "program",
        key: `program_description_${index}`,
        value: JSON.stringify({ ...desc, order: index }),
        project_id: projectId,
      })),
      ...programButtonGroups.map((group, index) => ({
        category: "program",
        key: `program_button_group_${index}`,
        value: JSON.stringify({ ...group, order: index }),
        project_id: projectId,
      })),
      {
        category: "program",
        key: "program_section_order",
        value: JSON.stringify(programSectionOrder),
        project_id: projectId,
      },
    ];
  };

  const saveProgramSectionOrder = async (order: string[], projectId: string) => {
    try {
      if (!projectId) return;
      
      await supabase.from("site_settings").delete()
        .eq("key", "program_section_order")
        .eq("project_id", projectId);
      await supabase.from("site_settings").insert({
        category: "program",
        key: "program_section_order",
        value: JSON.stringify(order),
        project_id: projectId,
      });
    } catch (error) {
      console.error("Error saving program section order:", error);
    }
  };

  return {
    programCards,
    programHeroSections,
    programDescriptions,
    programInfoCardSections,
    programButtonGroups,
    programSectionOrder,
    programSettings,
    setProgramCards,
    setProgramHeroSections,
    setProgramDescriptions,
    setProgramInfoCardSections,
    setProgramButtonGroups,
    setProgramSectionOrder,
    setProgramSettings,
    loadProgramSettings,
    getProgramSettingsToSave,
    saveProgramSectionOrder,
  };
};
