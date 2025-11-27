import { supabase } from "@/integrations/supabase/client";

let settingsCache: Record<string, Record<string, boolean>> = {};
let cachePromises: Record<string, Promise<Record<string, boolean>>> = {};

const loadAllSettings = async (projectSlug?: string): Promise<Record<string, boolean>> => {
  const cacheKey = projectSlug || 'default';
  
  if (settingsCache[cacheKey]) return settingsCache[cacheKey];
  if (cachePromises[cacheKey]) return cachePromises[cacheKey];

  cachePromises[cacheKey] = (async () => {
    if (!projectSlug) {
      return {};
    }

    // Get project ID from slug
    const { data: projectData } = await supabase
      .from('projects')
      .select('id')
      .eq('slug', projectSlug)
      .maybeSingle();

    if (!projectData) {
      return {};
    }

    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .in('key', ['program_enabled', 'registration_enabled', 'location_enabled'])
      .eq('project_id', projectData.id);
    
    const cache: Record<string, boolean> = {};
    data?.forEach((setting) => {
      const category = setting.key.replace('_enabled', '');
      cache[category] = setting.value === "true";
    });
    
    settingsCache[cacheKey] = cache;
    delete cachePromises[cacheKey];
    return cache;
  })();

  return cachePromises[cacheKey];
};

export const checkPageEnabled = async (category: string, projectSlug?: string): Promise<boolean> => {
  const settings = await loadAllSettings(projectSlug);
  return settings[category] ?? true;
};

export const getNextEnabledPage = async (currentPage: string, direction: 'left' | 'right', projectSlug?: string): Promise<string> => {
  const settings = await loadAllSettings(projectSlug);
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
