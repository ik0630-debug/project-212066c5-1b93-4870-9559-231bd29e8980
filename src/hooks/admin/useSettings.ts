import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getCategoryFromKey } from "@/utils/settingsUtils";
import { useHomeSettings } from "./useHomeSettings";
import { useProgramSettings } from "./useProgramSettings";
import { useLocationSettings } from "./useLocationSettings";
import { useRegistrationSettings } from "./useRegistrationSettings";

export const useSettings = () => {
  const { toast } = useToast();
  const [defaultProjectId, setDefaultProjectId] = useState<string | null>(null);

  const homeSettings = useHomeSettings();
  const programSettings = useProgramSettings();
  const locationSettings = useLocationSettings();
  const registrationSettings = useRegistrationSettings();

  const [settings, setSettings] = useState<any>({
    program_title: "프로그램",
    program_description: "세부 행사 일정을 소개합니다",
    program_header_color: "221 83% 33%",
    program_enabled: "true",
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

    if (!data) return;

    // Load settings for each category
    const defaultHomeSections = homeSettings.loadHomeSettings(data);
    programSettings.loadProgramSettings(data);
    locationSettings.loadLocationSettings(data);
    registrationSettings.loadRegistrationSettings(data);

    // Save default home sections if they were created
    if (defaultHomeSections) {
      const settingsToSave = defaultHomeSections.map(setting => ({
        ...setting,
        project_id: defaultProjectId,
      }));
      await supabase.from("site_settings").insert(settingsToSave);
    }

    // Update legacy settings state
    setSettings(prev => ({
      ...prev,
      ...programSettings.programSettings,
      ...locationSettings.locationSettings,
    }));
  }, [defaultProjectId]);

  const saveSettings = async (options?: { silent?: boolean }) => {
    try {
      if (!defaultProjectId) {
        throw new Error("Project ID not found");
      }

      const settingsToSave = [
        ...homeSettings.getHomeSettingsToSave(defaultProjectId),
        ...programSettings.getProgramSettingsToSave(defaultProjectId),
        ...locationSettings.getLocationSettingsToSave(defaultProjectId),
        ...registrationSettings.getRegistrationSettingsToSave(defaultProjectId),
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
    
    // Update the appropriate sub-hook
    if (key.startsWith("program_")) {
      programSettings.setProgramSettings({ ...programSettings.programSettings, [key]: value });
    } else if (key.startsWith("location_")) {
      locationSettings.setLocationSettings({ ...locationSettings.locationSettings, [key]: value });
    } else if (key.startsWith("registration_")) {
      registrationSettings.setRegistrationSettings({ ...registrationSettings.registrationSettings, [key]: value });
    }
  };

  return {
    // Project ID
    defaultProjectId,
    setDefaultProjectId,
    
    // Legacy settings state (for backward compatibility)
    settings,
    setSettings,
    
    // Home settings
    ...homeSettings,
    
    // Program settings
    ...programSettings,
    programSettings: programSettings.programSettings,
    
    // Location settings
    ...locationSettings,
    locationSettings: locationSettings.locationSettings,
    
    // Registration settings
    ...registrationSettings,
    registrationSettings: registrationSettings.registrationSettings,
    
    // Functions
    loadSettings,
    saveSettings,
    handleSettingChange,
    saveSectionOrder: (order: string[]) => homeSettings.saveSectionOrder(order, defaultProjectId!),
    saveProgramSectionOrder: (order: string[]) => programSettings.saveProgramSectionOrder(order, defaultProjectId!),
    saveLocationSectionOrder: (order: string[]) => locationSettings.saveLocationSectionOrder(order, defaultProjectId!),
    saveRegistrationSectionOrder: (order: string[]) => registrationSettings.saveRegistrationSectionOrder(order, defaultProjectId!),
  };
};
