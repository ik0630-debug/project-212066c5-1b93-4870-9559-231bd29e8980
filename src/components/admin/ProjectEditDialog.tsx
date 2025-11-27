import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
}

interface ProjectEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  onSuccess: () => void;
}

export const ProjectEditDialog = ({ open, onOpenChange, project, onSuccess }: ProjectEditDialogProps) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (project) {
      setName(project.name);
      setSlug(project.slug);
      setDescription(project.description || "");
      setIsActive(project.is_active);
    }
  }, [project]);

  const updateProject = async () => {
    if (!project || !name.trim() || !slug.trim()) {
      toast({
        title: "입력 오류",
        description: "프로젝트 이름과 슬러그를 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("projects")
        .update({
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim() || null,
          is_active: isActive,
        })
        .eq("id", project.id);

      if (error) throw error;

      toast({
        title: "프로젝트 수정 완료",
        description: `${name} 프로젝트가 수정되었습니다`,
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "프로젝트 수정 실패",
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
          <DialogTitle>프로젝트 수정</DialogTitle>
          <DialogDescription>
            프로젝트 정보를 수정합니다
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">프로젝트 이름 *</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 2024 개발자 컨퍼런스"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-slug">슬러그 (URL) *</Label>
            <Input
              id="edit-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="예: dev-conf-2024"
            />
            <p className="text-sm text-muted-foreground">
              프로젝트 URL: /{slug || "your-slug"}
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-description">설명</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="프로젝트에 대한 간단한 설명"
              rows={3}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="edit-active">활성 상태</Label>
            <Switch
              id="edit-active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={updateProject} disabled={loading}>
            {loading ? "수정 중..." : "수정"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
