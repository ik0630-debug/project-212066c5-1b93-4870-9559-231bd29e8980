import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";

interface ProjectMember {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  profiles: {
    name: string;
    email: string;
    organization: string;
    position: string;
  };
}

export const useProjectMembers = () => {
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectId, setProjectId] = useState<string | null>(null);
  const { toast } = useToast();
  const { projectSlug } = useParams();

  const loadProjectId = useCallback(async () => {
    if (!projectSlug) return;
    
    const { data, error } = await supabase
      .from("projects")
      .select("id")
      .eq("slug", projectSlug)
      .single();

    if (error) {
      console.error("Error loading project:", error);
      return;
    }

    setProjectId(data.id);
  }, [projectSlug]);

  const loadMembers = useCallback(async () => {
    if (!projectId) return;

    try {
      // Get project members
      const { data: membersData, error: membersError } = await supabase
        .from("project_members")
        .select("id, user_id, role, created_at")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (membersError) throw membersError;

      if (!membersData || membersData.length === 0) {
        setMembers([]);
        setLoading(false);
        return;
      }

      // Get profiles for these users
      const userIds = membersData.map(m => m.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, name, email, organization, position")
        .in("user_id", userIds);

      if (profilesError) throw profilesError;

      // Combine data
      const profilesMap = new Map(
        (profilesData || []).map(p => [p.user_id, p])
      );

      const combinedData = membersData.map(member => ({
        ...member,
        profiles: profilesMap.get(member.user_id) || {
          name: "Unknown",
          email: "Unknown",
          organization: "Unknown",
          position: "Unknown",
        },
      }));

      setMembers(combinedData);
    } catch (error: any) {
      toast({
        title: "멤버 로드 실패",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [projectId, toast]);

  useEffect(() => {
    loadProjectId();
  }, [loadProjectId]);

  useEffect(() => {
    if (projectId) {
      loadMembers();
    }
  }, [projectId, loadMembers]);

  const inviteMember = async (email: string, role: string) => {
    if (!projectId) return;

    try {
      // Find user by email
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("email", email)
        .single();

      if (profileError) {
        throw new Error("해당 이메일의 사용자를 찾을 수 없습니다");
      }

      // Check if already a member
      const { data: existing } = await supabase
        .from("project_members")
        .select("id")
        .eq("project_id", projectId)
        .eq("user_id", profile.user_id)
        .single();

      if (existing) {
        throw new Error("이미 프로젝트 멤버입니다");
      }

      // Add member
      const { error } = await supabase
        .from("project_members")
        .insert({
          project_id: projectId,
          user_id: profile.user_id,
          role,
        });

      if (error) throw error;

      toast({
        title: "멤버 추가 완료",
        description: `${email}을 프로젝트에 추가했습니다`,
      });

      loadMembers();
    } catch (error: any) {
      toast({
        title: "멤버 추가 실패",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateMemberRole = async (memberId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from("project_members")
        .update({ role: newRole })
        .eq("id", memberId);

      if (error) throw error;

      toast({
        title: "역할 변경 완료",
        description: "멤버의 역할이 변경되었습니다",
      });

      loadMembers();
    } catch (error: any) {
      toast({
        title: "역할 변경 실패",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const removeMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from("project_members")
        .delete()
        .eq("id", memberId);

      if (error) throw error;

      toast({
        title: "멤버 삭제 완료",
        description: "프로젝트에서 멤버를 제거했습니다",
      });

      loadMembers();
    } catch (error: any) {
      toast({
        title: "멤버 삭제 실패",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    members,
    loading,
    projectId,
    inviteMember,
    updateMemberRole,
    removeMember,
  };
};
