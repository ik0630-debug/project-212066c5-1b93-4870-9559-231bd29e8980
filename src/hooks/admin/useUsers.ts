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
        const { data: mncAdminRole } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", profile.user_id)
          .eq("role", "mnc_admin")
          .maybeSingle();
        
        const { data: projectStaffRole } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", profile.user_id)
          .eq("role", "project_staff")
          .maybeSingle();
        
        return { 
          ...profile, 
          is_mnc_admin: !!mncAdminRole,
          is_project_staff: !!projectStaffRole
        };
      })
    );
    setUsers(usersWithRoles);
  };

  const toggleMncAdmin = async (userId: string, isCurrentlyAdmin: boolean) => {
    try {
      if (isCurrentlyAdmin) {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", "mnc_admin");
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_roles")
          .insert([{ user_id: userId, role: "mnc_admin" }]);
        if (error) throw error;
      }
      
      toast({
        title: "권한 변경 완료",
        description: isCurrentlyAdmin
          ? "M&C 관리자 권한이 해제되었습니다."
          : "M&C 관리자 권한이 부여되었습니다.",
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
      // Get current admin user id
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("로그인이 필요합니다.");
      }
      
      const { error } = await supabase
        .from("profiles")
        .update({ 
          approved: true, 
          approved_at: new Date().toISOString(),
          approved_by: user.id
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

  const toggleProjectStaff = async (userId: string, isCurrentlyStaff: boolean) => {
    try {
      if (isCurrentlyStaff) {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", "project_staff");
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_roles")
          .insert([{ user_id: userId, role: "project_staff" }]);
        if (error) throw error;
      }
      
      toast({
        title: "권한 변경 완료",
        description: isCurrentlyStaff
          ? "프로젝트 담당자 권한이 해제되었습니다."
          : "프로젝트 담당자 권한이 부여되었습니다.",
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
    toggleMncAdmin,
    toggleProjectStaff,
    approveUser,
    rejectUser,
  };
};
