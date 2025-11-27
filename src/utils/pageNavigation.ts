import { supabase } from "@/integrations/supabase/client";

let settingsCache: Record<string, boolean> | null = null;
let cachePromise: Promise<Record<string, boolean>> | null = null;

const loadAllSettings = async (): Promise<Record<string, boolean>> => {
  if (settingsCache) return settingsCache;
  if (cachePromise) return cachePromise;

  cachePromise = (async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .in('key', ['program_enabled', 'registration_enabled', 'location_enabled']);
    
    const cache: Record<string, boolean> = {};
    data?.forEach((setting) => {
      const category = setting.key.replace('_enabled', '');
      cache[category] = setting.value === "true";
    });
    
    settingsCache = cache;
    cachePromise = null;
    return cache;
  })();

  return cachePromise;
};

export const checkPageEnabled = async (category: string): Promise<boolean> => {
  const settings = await loadAllSettings();
  return settings[category] ?? true;
};

export const getNextEnabledPage = async (currentPage: string, direction: 'left' | 'right', projectSlug?: string): Promise<string> => {
  const settings = await loadAllSettings();
  const prefix = projectSlug ? `/${projectSlug}` : '';
  const pageOrder = [`${prefix}`, `${prefix}/program`, `${prefix}/registration`, `${prefix}/location`];
  const currentIndex = pageOrder.indexOf(currentPage);
  
  if (direction === 'left') {
    // 왼쪽으로 스와이프 = 다음 페이지
    for (let i = currentIndex + 1; i < pageOrder.length; i++) {
      const page = pageOrder[i];
      if (page === prefix || page === `${prefix}`) return page; // 홈은 항상 활성화
      
      const category = page.substring(prefix.length + 1); // '/:slug/program' -> 'program'
      const isEnabled = settings[category] ?? true;
      if (isEnabled) return page;
    }
    // 모든 다음 페이지가 비활성화면 현재 페이지 유지
    return currentPage;
  } else {
    // 오른쪽으로 스와이프 = 이전 페이지
    for (let i = currentIndex - 1; i >= 0; i--) {
      const page = pageOrder[i];
      if (page === prefix || page === `${prefix}`) return page; // 홈은 항상 활성화
      
      const category = page.substring(prefix.length + 1);
      const isEnabled = settings[category] ?? true;
      if (isEnabled) return page;
    }
    return currentPage;
  }
};
