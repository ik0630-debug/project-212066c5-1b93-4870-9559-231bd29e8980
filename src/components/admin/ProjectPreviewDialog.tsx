import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ExternalLink } from "lucide-react";

interface ProjectPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectSlug: string;
}

export const ProjectPreviewDialog = ({ open, onOpenChange, projectSlug }: ProjectPreviewDialogProps) => {
  const previewUrl = `/${projectSlug}`;

  const handleOpenInNewTab = () => {
    window.open(previewUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[450px] h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b bg-card">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DialogTitle className="text-lg">초청장 미리보기</DialogTitle>
              <DialogDescription className="text-sm">
                모바일 화면으로 프로젝트를 미리 볼 수 있습니다
              </DialogDescription>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleOpenInNewTab}
                className="h-8 w-8"
                title="새 탭에서 열기"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 bg-muted/30 p-6 overflow-hidden flex items-center justify-center">
          <div className="h-full w-full max-w-[375px] bg-background rounded-[2.5rem] shadow-2xl overflow-hidden border-[14px] border-foreground/90 relative">
            {/* 상단 노치 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-foreground/90 rounded-b-3xl z-10" />
            
            {/* 아이프레임 */}
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
