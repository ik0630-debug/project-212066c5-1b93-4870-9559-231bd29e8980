import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { parseJsonSafely, mergeWithDefaults } from "@/utils/settingsUtils";

export const useLocationSettings = () => {
  const [transportCards, setTransportCards] = useState<any[]>([]);
  const [locationBottomButtons, setLocationBottomButtons] = useState<any[]>([]);
  const [downloadFiles, setDownloadFiles] = useState<any[]>([]);
  const [locationButtonGroups, setLocationButtonGroups] = useState<any[]>([]);
  const [locationSectionOrder, setLocationSectionOrder] = useState<string[]>([
    "description_buttons",
    "location_info",
    "transport_info",
    "contact_info",
  ]);

  const [locationSettings, setLocationSettings] = useState<any>({
    location_page_title: "오시는 길",
    location_page_description: "찾아 오시는 길을 확인하세요",
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

  const loadLocationSettings = (data: any[]) => {
    const loadedTransportCards: any = {};
    const loadedLocationBottomButtons: any = {};
    const loadedDownloadFiles: any = {};
    const loadedLocationButtonGroups: any = {};
    const settingsMap: any = {};

    data?.forEach(({ key, value, category }) => {
      if (category !== "location") return;

      if (key === "location_section_order") {
        const parsed = parseJsonSafely(value, [
          "description_buttons",
          "location_info",
          "transport_info",
          "contact_info",
        ]);
        setLocationSectionOrder(parsed);
        return;
      }

      if (key.startsWith("transport_card_")) {
        const parsed = parseJsonSafely(value);
        if (parsed) {
          const index = parsed.order || 0;
          loadedTransportCards[index] = parsed;
        }
      } else if (key.startsWith("location_bottom_button_")) {
        const parsed = parseJsonSafely(value);
        if (parsed) {
          const index = parsed.order || 0;
          loadedLocationBottomButtons[index] = parsed;
        }
      } else if (key.startsWith("location_download_file_")) {
        const parsed = parseJsonSafely(value);
        if (parsed) {
          const index = parsed.order || 0;
          loadedDownloadFiles[index] = parsed;
        }
      } else if (key.startsWith("location_button_group_")) {
        const parsed = parseJsonSafely(value);
        if (parsed) {
          const index = parsed.order || 0;
          loadedLocationButtonGroups[index] = parsed;
        }
      } else {
        settingsMap[key] = value;
      }
    });

    const locationButtons = Object.values(loadedLocationBottomButtons).filter((btn: any) => btn.text);
    const downloadFilesArray = Object.values(loadedDownloadFiles).filter((file: any) => file.name && file.url);
    const locationButtonGroupsArray = Object.values(loadedLocationButtonGroups).filter((group: any) => group.id);
    const loadedTransportCardsArray = Object.values(loadedTransportCards).filter((card: any) => card && card.title);

    setLocationBottomButtons(locationButtons);
    setDownloadFiles(downloadFilesArray);
    setLocationButtonGroups(locationButtonGroupsArray);
    setTransportCards(loadedTransportCardsArray);

    const defaultSettings = {
      location_page_title: "오시는 길",
      location_page_description: "찾아 오시는 길을 확인하세요",
      location_header_color: "221 83% 33%",
    };

    const mergedSettings = mergeWithDefaults(settingsMap, defaultSettings);
    setLocationSettings(prev => ({ ...prev, ...mergedSettings }));
  };

  const getLocationSettingsToSave = (projectId: string) => {
    return [
      ...Object.entries(locationSettings).map(([key, value]) => ({
        category: "location",
        key,
        value: value.toString(),
        project_id: projectId,
      })),
      ...transportCards.map((card, index) => ({
        category: "location",
        key: `transport_card_${index}`,
        value: JSON.stringify({ ...card, order: index }),
        project_id: projectId,
      })),
      ...locationBottomButtons.map((button, index) => ({
        category: "location",
        key: `location_bottom_button_${index}`,
        value: JSON.stringify({ ...button, order: index }),
        project_id: projectId,
      })),
      ...downloadFiles.map((file, index) => ({
        category: "location",
        key: `location_download_file_${index}`,
        value: JSON.stringify({ ...file, order: index }),
        project_id: projectId,
      })),
      ...locationButtonGroups.map((group, index) => ({
        category: "location",
        key: `location_button_group_${index}`,
        value: JSON.stringify({ ...group, order: index }),
        project_id: projectId,
      })),
      {
        category: "location",
        key: "location_section_order",
        value: JSON.stringify(locationSectionOrder),
        project_id: projectId,
      },
    ];
  };

  const saveLocationSectionOrder = async (order: string[], projectId: string) => {
    try {
      if (!projectId) return;
      
      await supabase.from("site_settings").delete()
        .eq("key", "location_section_order")
        .eq("project_id", projectId);
      await supabase.from("site_settings").insert({
        category: "location",
        key: "location_section_order",
        value: JSON.stringify(order),
        project_id: projectId,
      });
    } catch (error) {
      console.error("Error saving location section order:", error);
    }
  };

  return {
    transportCards,
    locationBottomButtons,
    downloadFiles,
    locationButtonGroups,
    locationSectionOrder,
    locationSettings,
    setTransportCards,
    setLocationBottomButtons,
    setDownloadFiles,
    setLocationButtonGroups,
    setLocationSectionOrder,
    setLocationSettings,
    loadLocationSettings,
    getLocationSettingsToSave,
    saveLocationSectionOrder,
  };
};
