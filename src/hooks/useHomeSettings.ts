import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface InfoCard {
  id: string;
  icon: string;
  title: string;
  content: string;
  order: number;
}

interface BottomButton {
  id: string;
  text: string;
  link: string;
  variant: string;
  order: number;
}

interface HomeSettings {
  heroImageUrl: string;
  heroUseText: string;
  heroTextContent: string;
  heroUseButton: string;
  heroButtonPosition: string;
  heroButtonText: string;
  heroButtonUrl: string;
  heroButtonBgColor: string;
  heroButtonTextColor: string;
  heroButtonTextSize: string;
  heroOverlayOpacity: string;
  descriptionTitle: string;
  descriptionContent: string;
  infoCards: InfoCard[];
  bottomButtons: BottomButton[];
  sectionOrder: string[];
}

const defaultSettings: HomeSettings = {
  heroImageUrl: "",
  heroUseText: "true",
  heroTextContent: "",
  heroUseButton: "false",
  heroButtonPosition: "inside",
  heroButtonText: "",
  heroButtonUrl: "",
  heroButtonBgColor: "",
  heroButtonTextColor: "",
  heroButtonTextSize: "lg",
  heroOverlayOpacity: "95",
  descriptionTitle: "",
  descriptionContent: "",
  infoCards: [],
  bottomButtons: [],
  sectionOrder: ['hero_section', 'info_cards', 'description', 'bottom_buttons'],
};

export const useHomeSettings = () => {
  const [settings, setSettings] = useState<HomeSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("category", "home");

      if (error) {
        console.error("Error loading home settings:", error);
        setLoading(false);
        return;
      }

      if (data) {
        const newSettings = { ...defaultSettings };

        // Load simple settings
        const settingMap: Record<string, keyof HomeSettings> = {
          hero_image_url: 'heroImageUrl',
          hero_use_text: 'heroUseText',
          hero_text_content: 'heroTextContent',
          hero_use_button: 'heroUseButton',
          hero_button_position: 'heroButtonPosition',
          hero_button_text: 'heroButtonText',
          hero_button_url: 'heroButtonUrl',
          hero_button_bg_color: 'heroButtonBgColor',
          hero_button_text_color: 'heroButtonTextColor',
          hero_button_text_size: 'heroButtonTextSize',
          hero_overlay_opacity: 'heroOverlayOpacity',
          description_title: 'descriptionTitle',
          description_content: 'descriptionContent',
        };

        data.forEach((item) => {
          const settingKey = settingMap[item.key];
          if (settingKey) {
            (newSettings as any)[settingKey] = item.value;
          }
        });

        // Load info cards
        const cards = data
          .filter((s) => s.key.startsWith("home_info_card_"))
          .map((s) => {
            const cardData = JSON.parse(s.value);
            return { id: s.id, ...cardData };
          })
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        newSettings.infoCards = cards;

        // Load bottom buttons
        const buttons = data
          .filter((s) => s.key.startsWith("home_bottom_button_"))
          .map((s) => {
            const buttonData = JSON.parse(s.value);
            return { id: s.id, ...buttonData };
          })
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        newSettings.bottomButtons = buttons;

        // Load section order
        const orderSetting = data.find((s) => s.key === "section_order");
        if (orderSetting) {
          try {
            newSettings.sectionOrder = JSON.parse(orderSetting.value);
          } catch {
            // Keep default
          }
        }

        setSettings(newSettings);
      }
    } catch (error) {
      console.error("Error in loadSettings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('home-settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_settings',
          filter: 'category=eq.home'
        },
        () => {
          loadSettings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { settings, loading };
};
