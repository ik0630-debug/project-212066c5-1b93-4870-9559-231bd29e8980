import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PageSettings {
  program: boolean;
  registration: boolean;
  location: boolean;
}

const DEFAULT_SETTINGS: PageSettings = {
  program: true,
  registration: true,
  location: true,
};

export const usePageSettings = () => {
  const [settings, setSettings] = useState<PageSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("*")
          .in("key", ["program_enabled", "registration_enabled", "location_enabled"]);

        if (data) {
          const programSetting = data.find((s) => s.key === "program_enabled");
          const registrationSetting = data.find((s) => s.key === "registration_enabled");
          const locationSetting = data.find((s) => s.key === "location_enabled");
          
          setSettings({
            program: programSetting ? programSetting.value === "true" : true,
            registration: registrationSetting ? registrationSetting.value === "true" : true,
            location: locationSetting ? locationSetting.value === "true" : true,
          });
        }
      } catch (error) {
        console.error("Error loading page settings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('page-settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_settings',
        },
        (payload) => {
          const newRecord = payload.new as any;
          const oldRecord = payload.old as any;
          const affectedKey = newRecord?.key || oldRecord?.key;
          
          // Only reload if page enable/disable settings changed
          if (affectedKey && ['program_enabled', 'registration_enabled', 'location_enabled'].includes(affectedKey)) {
            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE' || payload.eventType === 'DELETE') {
              loadSettings();
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { settings, loading };
};
