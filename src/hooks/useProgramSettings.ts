import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface InfoCard {
  id: string;
  icon: string;
  title: string;
  content: string;
  titleFontSize?: string;
  contentFontSize?: string;
  bgColor?: string;
  iconColor?: string;
}

interface BottomButton {
  id: string;
  text: string;
  link: string;
  bgColor?: string;
  textColor?: string;
  size?: string;
  fontSize?: string;
}

interface DescriptionSection {
  id: string;
  enabled: string;
  title: string;
  content: string;
  titleFontSize?: string;
  contentFontSize?: string;
  bgColor?: string;
}

interface ButtonGroup {
  id: string;
  enabled: string;
  title?: string;
  alignment?: string;
  buttons: BottomButton[];
}

interface HeroSection {
  id: string;
  enabled: string;
  imageUrl: string;
  overlayOpacity: string;
}

interface InfoCardSection {
  id: string;
  enabled: string;
  title?: string;
  cards: InfoCard[];
}

interface ProgramCard {
  id: string;
  time: string;
  title: string;
  description: string;
  icon?: string;
  order: number;
}

export interface ProgramSettings {
  pageTitle: string;
  pageDescription: string;
  headerColor: string;
  heroSections: HeroSection[];
  descriptions: DescriptionSection[];
  infoCardSections: InfoCardSection[];
  buttonGroups: ButtonGroup[];
  programCards: ProgramCard[];
  sectionOrder: string[];
}

export const useProgramSettings = (projectId?: string | null) => {
  const [settings, setSettings] = useState<ProgramSettings>({
    pageTitle: "프로그램",
    pageDescription: "",
    headerColor: "",
    heroSections: [],
    descriptions: [],
    infoCardSections: [],
    buttonGroups: [],
    programCards: [],
    sectionOrder: [],
  });
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .eq("category", "program")
        .eq("project_id", projectId);

      if (data) {
        const newSettings: ProgramSettings = {
          pageTitle: "프로그램",
          pageDescription: "",
          headerColor: "",
          heroSections: [],
          descriptions: [],
          infoCardSections: [],
          buttonGroups: [],
          programCards: [],
          sectionOrder: [],
        };

        data.forEach((setting) => {
          const { key, value } = setting;

          if (key === "program_title") newSettings.pageTitle = value;
          else if (key === "program_description") newSettings.pageDescription = value;
          else if (key === "program_header_color") newSettings.headerColor = value;
          else if (key.startsWith("program_hero_")) {
            const sectionId = key.replace("program_hero_", "").split("_")[0];
            let section = newSettings.heroSections.find((s) => s.id === sectionId);
            if (!section) {
              section = {
                id: sectionId,
                enabled: "true",
                imageUrl: "",
                overlayOpacity: "0",
              };
              newSettings.heroSections.push(section);
            }
            try {
              const parsedValue = JSON.parse(value);
              Object.assign(section, parsedValue);
            } catch {
              if (key.includes("_enabled")) section.enabled = value;
              else if (key.includes("_image")) section.imageUrl = value;
              else if (key.includes("_overlay")) section.overlayOpacity = value;
            }
          } else if (key.startsWith("program_description_")) {
            const sectionId = key.replace("program_description_", "");
            try {
              const parsedValue = JSON.parse(value);
              newSettings.descriptions.push({
                id: sectionId,
                ...parsedValue,
              });
            } catch (e) {
              console.error("Error parsing description:", e);
            }
          } else if (key.startsWith("program_info_cards_")) {
            const sectionId = key.replace("program_info_cards_", "");
            try {
              const parsedValue = JSON.parse(value);
              newSettings.infoCardSections.push({
                id: sectionId,
                ...parsedValue,
              });
            } catch (e) {
              console.error("Error parsing info card section:", e);
            }
          } else if (key.startsWith("program_button_group_")) {
            const sectionId = key.replace("program_button_group_", "");
            try {
              const parsedValue = JSON.parse(value);
              newSettings.buttonGroups.push({
                id: sectionId,
                ...parsedValue,
              });
            } catch (e) {
              console.error("Error parsing button group:", e);
            }
          } else if (key.startsWith("program_card_")) {
            try {
              const cardData = JSON.parse(value);
              newSettings.programCards.push({
                id: setting.id,
                ...cardData,
              });
            } catch (e) {
              console.error("Error parsing program card:", e);
            }
          } else if (key === "program_section_order") {
            try {
              newSettings.sectionOrder = JSON.parse(value);
            } catch (e) {
              console.error("Error parsing section order:", e);
            }
          }
        });

        // Sort program cards by order
        newSettings.programCards.sort((a, b) => (a.order || 0) - (b.order || 0));

        setSettings(newSettings);
      }
    } catch (error) {
      console.error("Error loading program settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();

    if (!projectId) return;

    const channel = supabase
      .channel("program-settings-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "site_settings",
          filter: `category=eq.program,project_id=eq.${projectId}`,
        },
        () => {
          loadSettings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  return { settings, loading };
};
