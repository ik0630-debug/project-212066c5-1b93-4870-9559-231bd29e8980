import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RegistrationField {
  id: string;
  label: string;
  placeholder: string;
  type: string;
  required: boolean;
  options?: string[];
}

export const useRegistrations = () => {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [registrationFields, setRegistrationFields] = useState<RegistrationField[]>([]);
  const { toast } = useToast();

  const loadRegistrations = async () => {
    const { data } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });
    setRegistrations(data || []);
  };

  const loadRegistrationFields = async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("category", "registration")
      .eq("key", "registration_fields")
      .single();

    if (data?.value) {
      try {
        const fields = JSON.parse(data.value);
        setRegistrationFields(fields);
      } catch (e) {
        console.error("Failed to parse registration fields", e);
      }
    }
  };

  useEffect(() => {
    loadRegistrations();
    loadRegistrationFields();

    // 실시간 구독 설정
    const channel = supabase
      .channel('registrations-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE 모두 감지
          schema: 'public',
          table: 'registrations'
        },
        (payload) => {
          console.log('Registration change detected:', payload);
          
          if (payload.eventType === 'INSERT') {
            // 새로운 신청 추가
            setRegistrations((prev) => [payload.new, ...prev]);
            toast({
              title: "새로운 신청이 등록되었습니다",
              description: `${payload.new.name}님의 신청`,
            });
          } else if (payload.eventType === 'UPDATE') {
            // 신청 정보 업데이트
            setRegistrations((prev) =>
              prev.map((reg) =>
                reg.id === payload.new.id ? payload.new : reg
              )
            );
          } else if (payload.eventType === 'DELETE') {
            // 신청 삭제
            setRegistrations((prev) =>
              prev.filter((reg) => reg.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // 클린업 함수
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
    registrationFields,
    loadRegistrations,
    deleteRegistration,
  };
};
