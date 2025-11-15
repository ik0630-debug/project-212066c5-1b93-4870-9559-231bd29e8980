import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useRegistrations = () => {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const { toast } = useToast();

  const loadRegistrations = async () => {
    const { data } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });
    setRegistrations(data || []);
  };

  const deleteRegistration = async (id: string) => {
    try {
      const { error } = await supabase.from("registrations").delete().eq("id", id);
      if (error) throw error;
      
      toast({
        title: "삭제 완료",
        description: "신청이 삭제되었습니다.",
      });
      
      loadRegistrations();
    } catch (error: any) {
      toast({
        title: "삭제 실패",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    registrations,
    loadRegistrations,
    deleteRegistration,
  };
};
