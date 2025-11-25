import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PageSettings {
  program: boolean;
  registration: boolean;
  location: boolean;
}

let cachedSettings: PageSettings | null = null;
let loadingPromise: Promise<PageSettings> | null = null;

export const usePageSettings = () => {
  const [settings, setSettings] = useState<PageSettings | null>(cachedSettings);
  const [loading, setLoading] = useState(!cachedSettings);

  useEffect(() => {
    if (cachedSettings) {
      return;
    }

    if (loadingPromise) {
      loadingPromise.then((result) => {
        setSettings(result);
        setLoading(false);
      });
      return;
    }

    loadingPromise = loadPageSettings();
    loadingPromise.then((result) => {
      cachedSettings = result;
      setSettings(result);
      setLoading(false);
      loadingPromise = null;
    });
  }, []);

  return { settings, loading };
};

const loadPageSettings = async (): Promise<PageSettings> => {
  try {
    const { data: settings } = await supabase
      .from("site_settings")
      .select("*")
      .in("key", ["program_enabled", "registration_enabled", "location_enabled"]);

    if (settings) {
      const programSetting = settings.find((s) => s.key === "program_enabled");
      const registrationSetting = settings.find((s) => s.key === "registration_enabled");
      const locationSetting = settings.find((s) => s.key === "location_enabled");
      
      return {
        program: programSetting ? programSetting.value === "true" : true,
        registration: registrationSetting ? registrationSetting.value === "true" : true,
        location: locationSetting ? locationSetting.value === "true" : true,
      };
    }
  } catch (error) {
    console.error("Error loading page settings:", error);
  }

  return { program: true, registration: true, location: true };
};
