import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type ProjectRole = "owner" | "admin" | "editor" | "viewer" | null;

interface ProjectAccess {
  projectId: string | null;
  role: ProjectRole;
  loading: boolean;
  canEdit: boolean;
  canManageSettings: boolean;
  canManageMembers: boolean;
  isOwner: boolean;
  isAdmin: boolean;
}

export const useProjectAccess = (): ProjectAccess => {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [role, setRole] = useState<ProjectRole>(null);
  const [loading, setLoading] = useState(true);
  const { projectSlug } = useParams();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Preview mode: skip authentication checks
        if (isPreview) {
          if (!projectSlug) {
            setLoading(false);
            return;
          }

          const { data: project, error: projectError } = await supabase
            .from("projects")
            .select("id")
            .eq("slug", projectSlug)
            .single();

          if (projectError || !project) {
            setLoading(false);
            return;
          }

          setProjectId(project.id);
          setRole("viewer"); // Set a default role for preview mode
          setLoading(false);
          return;
        }

        // Normal mode: check authentication
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          setLoading(false);
          return;
        }

        // Get project by slug
        if (!projectSlug) {
          setLoading(false);
          return;
        }

        const { data: project, error: projectError } = await supabase
          .from("projects")
          .select("id")
          .eq("slug", projectSlug)
          .single();

        if (projectError || !project) {
          toast({
            title: "프로젝트를 찾을 수 없습니다",
            variant: "destructive",
          });
          navigate("/projects");
          return;
        }

        setProjectId(project.id);

        // Check if user is a member and get their role
        const { data: membership, error: memberError } = await supabase
          .from("project_members")
          .select("role")
          .eq("project_id", project.id)
          .eq("user_id", user.id)
          .single();

        if (memberError || !membership) {
          toast({
            title: "접근 권한이 없습니다",
            description: "이 프로젝트의 멤버가 아닙니다",
            variant: "destructive",
          });
          navigate("/projects");
          return;
        }

        setRole(membership.role as ProjectRole);
      } catch (error: any) {
        console.error("Access check error:", error);
        toast({
          title: "오류가 발생했습니다",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [projectSlug, navigate, toast, isPreview]);

  const isOwner = role === "owner";
  const isAdmin = role === "admin" || isOwner;
  const canEdit = role === "editor" || isAdmin;
  const canManageSettings = isAdmin;
  const canManageMembers = isAdmin;

  return {
    projectId,
    role,
    loading,
    canEdit,
    canManageSettings,
    canManageMembers,
    isOwner,
    isAdmin,
  };
};
