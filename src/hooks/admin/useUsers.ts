import { useState, useEffect } from "react";
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
        const { data: adminRole } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", profile.user_id)
          .eq("role", "admin")
          .maybeSingle();
        
        const { data: regManagerRole } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", profile.user_id)
          .eq("role", "registration_manager")
          .maybeSingle();
        
        return { 
          ...profile, 
          is_admin: !!adminRole,
          is_registration_manager: !!regManagerRole
        };
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

  const approveUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ 
          approved: true, 
          approved_at: new Date().toISOString() 
        })
        .eq("user_id", userId);
      
      if (error) throw error;
      
      toast({
        title: "승인 완료",
        description: "사용자가 승인되었습니다.",
      });
      
      loadUsers();
    } catch (error: any) {
      toast({
        title: "승인 실패",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const rejectUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("user_id", userId);
      
      if (error) throw error;
      
      toast({
        title: "거부 완료",
        description: "사용자가 거부되었습니다.",
      });
      
      loadUsers();
    } catch (error: any) {
      toast({
        title: "거부 실패",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleRegistrationManager = async (userId: string, isCurrentlyManager: boolean) => {
    try {
      if (isCurrentlyManager) {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", "registration_manager");
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role: "registration_manager" });
        if (error) throw error;
      }
      
      toast({
        title: "권한 변경 완료",
        description: isCurrentlyManager
          ? "등록 관리자 권한이 해제되었습니다."
          : "등록 관리자 권한이 부여되었습니다.",
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
    toggleRegistrationManager,
    approveUser,
    rejectUser,
  };
};
