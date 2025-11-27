import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ProjectCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const ProjectCreateDialog = ({ open, onOpenChange, onSuccess }: ProjectCreateDialogProps) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleNameChange = (value: string) => {
    setName(value);
    // Auto-generate slug from name
    const autoSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, "-")
      .replace(/^-|-$/g, "");
    setSlug(autoSlug);
  };

  const createProject = async () => {
    if (!name.trim() || !slug.trim()) {
      toast({
        title: "입력 오류",
        description: "프로젝트 이름과 슬러그를 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("로그인이 필요합니다");

      // 1. Create project
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim() || null,
          created_by: user.id,
          is_active: true,
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // 2. Add creator as owner
      const { error: memberError } = await supabase
        .from("project_members")
        .insert({
          project_id: project.id,
          user_id: user.id,
          role: "owner",
        });

      if (memberError) throw memberError;

      // 3. Copy default settings template
      const { data: defaultSettings } = await supabase
        .from("site_settings")
        .select("*")
        .eq("project_id", (await supabase
          .from("projects")
          .select("id")
          .eq("slug", "default")
          .single()
        ).data?.id || "");

      if (defaultSettings && defaultSettings.length > 0) {
        const newSettings = defaultSettings.map(({ id, created_at, updated_at, ...setting }) => ({
          ...setting,
          project_id: project.id,
        }));

        await supabase.from("site_settings").insert(newSettings);
      }

      toast({
        title: "프로젝트 생성 완료",
        description: `${name} 프로젝트가 생성되었습니다`,
      });

      onSuccess();
      setName("");
      setSlug("");
      setDescription("");
      
      // Navigate to new project
      navigate(`/${project.slug}`);
    } catch (error: any) {
      toast({
        title: "프로젝트 생성 실패",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>새 프로젝트 만들기</DialogTitle>
          <DialogDescription>
            새로운 프로젝트를 생성하면 기본 템플릿이 복사됩니다
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">프로젝트 이름 *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="예: 2024 개발자 컨퍼런스"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">슬러그 (URL) *</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="예: dev-conf-2024"
            />
            <p className="text-sm text-muted-foreground">
              프로젝트 URL: /{slug || "your-slug"}
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">설명 (선택)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="프로젝트에 대한 간단한 설명"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={createProject} disabled={loading}>
            {loading ? "생성 중..." : "생성"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
