import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ExternalLink, Smartphone, Tablet, Monitor } from "lucide-react";

interface ProjectPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectSlug: string;
}

type DeviceType = 'mobile' | 'tablet' | 'desktop';

const deviceSizes = {
  mobile: { width: 375, height: 667, label: '모바일' },
  tablet: { width: 768, height: 1024, label: '태블릿' },
  desktop: { width: 1440, height: 900, label: '데스크톱' }
};

export const ProjectPreviewDialog = ({ open, onOpenChange, projectSlug }: ProjectPreviewDialogProps) => {
  const [deviceType, setDeviceType] = useState<DeviceType>('mobile');
  const previewUrl = `/${projectSlug}?preview=true`;
  const publicUrl = `/${projectSlug}`;

  console.log('ProjectPreviewDialog:', { open, projectSlug, previewUrl });

  const handleOpenInNewTab = () => {
    window.open(publicUrl, '_blank');
  };

  const currentDevice = deviceSizes[deviceType];
  const isMobile = deviceType === 'mobile';

  // Don't render if projectSlug is empty
  if (!projectSlug) {
    console.error('ProjectPreviewDialog: No projectSlug provided!');
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] h-[95vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b bg-card">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-lg">초청장 미리보기</DialogTitle>
              <DialogDescription className="text-sm">
                {currentDevice.label} 화면으로 프로젝트를 미리 볼 수 있습니다
              </DialogDescription>
            </div>
            
            {/* 기기 타입 선택 버튼 */}
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant={deviceType === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDeviceType('mobile')}
                className="h-8 px-3"
                title="모바일"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
              <Button
                variant={deviceType === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDeviceType('tablet')}
                className="h-8 px-3"
                title="태블릿"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={deviceType === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDeviceType('desktop')}
                className="h-8 px-3"
                title="데스크톱"
              >
                <Monitor className="h-4 w-4" />
              </Button>
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
        <div className="flex-1 bg-muted/30 p-6 overflow-auto flex items-center justify-center">
          <div 
            className="bg-background shadow-2xl overflow-hidden relative transition-all duration-300"
            style={{
              width: `${currentDevice.width}px`,
              height: `${currentDevice.height}px`,
              maxWidth: '100%',
              maxHeight: '100%',
              borderRadius: isMobile ? '2.5rem' : '0.5rem',
              border: isMobile ? '14px solid hsl(var(--foreground) / 0.9)' : '1px solid hsl(var(--border))'
            }}
          >
            {/* 모바일일 때만 상단 노치 표시 */}
            {isMobile && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-foreground/90 rounded-b-3xl z-10" />
            )}
            
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
