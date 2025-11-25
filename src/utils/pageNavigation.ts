import { supabase } from "@/integrations/supabase/client";

export const checkPageEnabled = async (category: string): Promise<boolean> => {
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('category', category)
    .eq('key', `${category}_enabled`)
    .single();
  
  return data?.value === "true";
};

export const getNextEnabledPage = async (currentPage: string, direction: 'left' | 'right'): Promise<string> => {
  const pageOrder = ['/', '/program', '/registration', '/location'];
  const currentIndex = pageOrder.indexOf(currentPage);
  
  if (direction === 'left') {
    // 왼쪽으로 스와이프 = 다음 페이지
    for (let i = currentIndex + 1; i < pageOrder.length; i++) {
      const page = pageOrder[i];
      if (page === '/') return page; // 홈은 항상 활성화
      
      const category = page.substring(1); // '/program' -> 'program'
      const isEnabled = await checkPageEnabled(category);
      if (isEnabled) return page;
    }
    // 모든 다음 페이지가 비활성화면 현재 페이지 유지
    return currentPage;
  } else {
    // 오른쪽으로 스와이프 = 이전 페이지
    for (let i = currentIndex - 1; i >= 0; i--) {
      const page = pageOrder[i];
      if (page === '/') return page; // 홈은 항상 활성화
      
      const category = page.substring(1);
      const isEnabled = await checkPageEnabled(category);
      if (isEnabled) return page;
    }
    return currentPage;
  }
};
