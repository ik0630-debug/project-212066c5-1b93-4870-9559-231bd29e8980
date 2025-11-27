import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  name: string;
  slug: string;
}

interface ProjectDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  onSuccess: () => void;
}

export const ProjectDeleteDialog = ({ open, onOpenChange, project, onSuccess }: ProjectDeleteDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const deleteProject = async () => {
    if (!project) return;

    setLoading(true);
    try {
      // Delete project (cascade will handle related data)
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", project.id);

      if (error) throw error;

      toast({
        title: "프로젝트 삭제 완료",
        description: `${project.name} 프로젝트가 삭제되었습니다`,
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "프로젝트 삭제 실패",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>프로젝트를 삭제하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            이 작업은 되돌릴 수 없습니다. <strong>{project?.name}</strong> 프로젝트와
            관련된 모든 데이터(설정, 등록 정보 등)가 영구적으로 삭제됩니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button variant="destructive" onClick={deleteProject} disabled={loading}>
            {loading ? "삭제 중..." : "삭제"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
