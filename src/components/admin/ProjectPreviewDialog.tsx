import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ProjectPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectSlug: string;
}

export const ProjectPreviewDialog = ({ open, onOpenChange, projectSlug }: ProjectPreviewDialogProps) => {
  const previewUrl = `/${projectSlug}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>초청장 미리보기</DialogTitle>
              <DialogDescription>모바일 화면으로 프로젝트를 미리 볼 수 있습니다</DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 bg-gray-100 p-4 overflow-hidden">
          <div className="h-full bg-white rounded-lg shadow-xl overflow-hidden border-8 border-gray-800">
            <iframe
              src={previewUrl}
              className="w-full h-full"
              title="프로젝트 미리보기"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
