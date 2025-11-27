import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Users, FileText, Calendar, MapPin, Settings, Home, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProjectCreateDialog } from "@/components/admin/ProjectCreateDialog";
import { ProjectEditDialog } from "@/components/admin/ProjectEditDialog";
import { ProjectDeleteDialog } from "@/components/admin/ProjectDeleteDialog";
import { ProjectPreviewDialog } from "@/components/admin/ProjectPreviewDialog";

interface Project {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  is_active: boolean;
}

interface ProjectStats {
  projectId: string;
  memberCount: number;
  registrationCount: number;
  programEnabled: boolean;
  registrationEnabled: boolean;
  locationEnabled: boolean;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectStats, setProjectStats] = useState<Map<string, ProjectStats>>(new Map());
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      // Load projects with member count
      const { data: memberData } = await supabase
        .from("project_members")
        .select("project_id, user_id")
        .eq("user_id", user.id);

      if (!memberData || memberData.length === 0) {
        setProjects([]);
        setLoading(false);
        return;
      }

      const projectIds = memberData.map(m => m.project_id);

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .in("id", projectIds)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);

      // Load stats for each project
      await loadProjectStats(data || []);
    } catch (error: any) {
      toast({
        title: "프로젝트 로드 실패",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadProjectStats = async (projectsList: Project[]) => {
    const statsMap = new Map<string, ProjectStats>();

    for (const project of projectsList) {
      // Load member count
      const { data: members } = await supabase
        .from("project_members")
        .select("id")
        .eq("project_id", project.id);

      // Load registration count
      const { data: registrations } = await supabase
        .from("registrations")
        .select("id")
        .eq("project_id", project.id);

      // Load page settings
      const { data: settings } = await supabase
        .from("site_settings")
        .select("key, value")
        .eq("project_id", project.id)
        .in("key", ["program_enabled", "registration_enabled", "location_enabled"]);

      const settingsMap = new Map(settings?.map(s => [s.key, s.value === "true"]) || []);

      statsMap.set(project.id, {
        projectId: project.id,
        memberCount: members?.length || 0,
        registrationCount: registrations?.length || 0,
        programEnabled: settingsMap.get("program_enabled") ?? true,
        registrationEnabled: settingsMap.get("registration_enabled") ?? true,
        locationEnabled: settingsMap.get("location_enabled") ?? true,
      });
    }

    setProjectStats(statsMap);
  };

  const handleProjectClick = (slug: string) => {
    navigate(`/${slug}/admin`);
  };

  const handleEdit = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProject(project);
    setShowEditDialog(true);
  };

  const handleDelete = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProject(project);
    setShowDeleteDialog(true);
  };

  const handlePreview = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProject(project);
    setShowPreviewDialog(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <Home className="h-5 w-5" />
              <span className="text-lg font-semibold">홈으로</span>
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">프로젝트 목록</h1>
            <p className="text-muted-foreground">프로젝트를 선택하거나 새로운 프로젝트를 생성하세요</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            새 프로젝트
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const stats = projectStats.get(project.id);
            return (
              <Card
                key={project.id}
                className="cursor-pointer hover:shadow-lg transition-shadow relative group"
                onClick={() => handleProjectClick(project.slug)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-xl">{project.name}</CardTitle>
                        <Badge variant={project.is_active ? "default" : "secondary"}>
                          {project.is_active ? "활성" : "비활성"}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">
                        {project.description || "설명이 없습니다"}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleEdit(project, e)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleDelete(project, e)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Project Stats */}
                  {stats && (
                    <div className="space-y-3 pt-3 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>멤버</span>
                        </div>
                        <span className="font-medium">{stats.memberCount}명</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span>참가신청</span>
                        </div>
                        <span className="font-medium">{stats.registrationCount}건</span>
                      </div>

                      {/* Active Pages */}
                      <div className="pt-2">
                        <div className="text-xs text-muted-foreground mb-2">활성화된 페이지</div>
                        <div className="flex flex-wrap gap-1">
                          {stats.programEnabled && (
                            <Badge variant="outline" className="text-xs">
                              <Calendar className="h-3 w-3 mr-1" />
                              프로그램
                            </Badge>
                          )}
                          {stats.registrationEnabled && (
                            <Badge variant="outline" className="text-xs">
                              <FileText className="h-3 w-3 mr-1" />
                              참가신청
                            </Badge>
                          )}
                          {stats.locationEnabled && (
                            <Badge variant="outline" className="text-xs">
                              <MapPin className="h-3 w-3 mr-1" />
                              오시는 길
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      생성일: {new Date(project.created_at).toLocaleDateString('ko-KR')}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handlePreview(project, e)}
                      className="h-7 text-xs"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      미리보기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">아직 프로젝트가 없습니다</p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              첫 프로젝트 만들기
            </Button>
          </div>
        )}

        <ProjectCreateDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSuccess={() => {
            setShowCreateDialog(false);
            loadProjects();
          }}
        />

        <ProjectEditDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          project={selectedProject}
          onSuccess={() => {
            setShowEditDialog(false);
            loadProjects();
          }}
        />

        <ProjectDeleteDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          project={selectedProject}
          onSuccess={() => {
            setShowDeleteDialog(false);
            loadProjects();
          }}
        />

        <ProjectPreviewDialog
          open={showPreviewDialog}
          onOpenChange={setShowPreviewDialog}
          projectSlug={selectedProject?.slug || ""}
        />
      </div>
    </div>
  );
};

export default Projects;
