import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CategorySettingsResult {
  settings: any[] | null;
  loading: boolean;
}

/**
 * Generic hook to load and subscribe to site_settings for specific categories
 * @param categories - Single category string or array of categories to load
 * @param projectId - Project ID to filter settings
 * @returns Object with settings array and loading state
 */
export const useCategorySettings = (categories: string | string[], projectId?: string | null): CategorySettingsResult => {
  const [settings, setSettings] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  const categoryArray = Array.isArray(categories) ? categories : [categories];

  useEffect(() => {
    const loadSettings = async () => {
      if (!projectId) {
        setLoading(false);
        return;
      }

      try {
        let query = supabase
          .from('site_settings')
          .select('*')
          .in('category', categoryArray)
          .eq('project_id', projectId);

        const { data } = await query;
        
        if (data) {
          setSettings(data);
        }
      } catch (error) {
        console.error('Error loading category settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();

    if (!projectId) return;

    // Subscribe to realtime changes for these categories
    const channel = supabase
      .channel('category-settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_settings',
        },
        (payload) => {
          // Only reload if the change affects our categories
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE' || payload.eventType === 'DELETE') {
            const newRecord = payload.new as any;
            const oldRecord = payload.old as any;
            const affectedCategory = newRecord?.category || oldRecord?.category;
            
            if (affectedCategory && categoryArray.includes(affectedCategory)) {
              loadSettings();
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [categoryArray.join(','), projectId]);

  return { settings, loading };
};
