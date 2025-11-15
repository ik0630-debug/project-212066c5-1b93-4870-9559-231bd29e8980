import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const { toast } = useToast();

  const loadUsers = async () => {
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    
    const usersWithRoles = await Promise.all(
      (profilesData || []).map(async (profile) => {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", profile.user_id)
          .eq("role", "admin")
          .maybeSingle();
        return { ...profile, is_admin: !!roleData };
      })
    );
    setUsers(usersWithRoles);
  };

  const toggleAdmin = async (userId: string, isCurrentlyAdmin: boolean) => {
    try {
      if (isCurrentlyAdmin) {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", "admin");
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role: "admin" });
        if (error) throw error;
      }
      
      toast({
        title: "권한 변경 완료",
        description: isCurrentlyAdmin
          ? "관리자 권한이 해제되었습니다."
          : "관리자 권한이 부여되었습니다.",
      });
      
      loadUsers();
    } catch (error: any) {
      toast({
        title: "권한 변경 실패",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    users,
    loadUsers,
    toggleAdmin,
  };
};
