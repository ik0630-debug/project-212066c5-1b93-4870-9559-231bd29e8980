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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/ImageUpload";

interface Project {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
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
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (project) {
      setName(project.name);
      setSlug(project.slug);
      setDescription(project.description || "");
      setIsActive(project.is_active);
      setOgTitle(project.og_title || "");
      setOgDescription(project.og_description || "");
      setOgImage(project.og_image || "");
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
          og_title: ogTitle.trim() || null,
          og_description: ogDescription.trim() || null,
          og_image: ogImage.trim() || null,
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>프로젝트 수정</DialogTitle>
          <DialogDescription>
            프로젝트 정보와 소셜 미디어 공유 설정을 수정합니다
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">기본 정보</TabsTrigger>
            <TabsTrigger value="social">소셜 미디어 공유</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
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
          </TabsContent>

          <TabsContent value="social" className="space-y-4 mt-4">
            <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
              <h4 className="text-sm font-semibold">소셜 미디어 공유 설정</h4>
              <p className="text-xs text-muted-foreground">
                카카오톡, 페이스북, 트위터 등에서 링크를 공유할 때 표시될 정보를 설정합니다.
                설정하지 않으면 프로젝트 기본 정보가 사용됩니다.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="og-title">공유 제목</Label>
              <Input
                id="og-title"
                value={ogTitle}
                onChange={(e) => setOgTitle(e.target.value)}
                placeholder={name || "소셜 미디어에 표시될 제목"}
                maxLength={60}
              />
              <p className="text-xs text-muted-foreground">
                {ogTitle.length}/60자 (권장: 40-60자)
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="og-description">공유 설명</Label>
              <Textarea
                id="og-description"
                value={ogDescription}
                onChange={(e) => setOgDescription(e.target.value)}
                placeholder={description || "소셜 미디어에 표시될 설명"}
                rows={3}
                maxLength={160}
              />
              <p className="text-xs text-muted-foreground">
                {ogDescription.length}/160자 (권장: 120-160자)
              </p>
            </div>

            <ImageUpload
              value={ogImage}
              onChange={setOgImage}
              label="공유 이미지"
            />
            <p className="text-xs text-muted-foreground">
              권장 크기: 1200x630px (카카오톡, 페이스북 최적)
            </p>
          </TabsContent>
        </Tabs>

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
