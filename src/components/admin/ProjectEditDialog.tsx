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
import { QRCodeSVG } from "qrcode.react";
import { Copy, Download, QrCode, Eye } from "lucide-react";

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

  const shareUrl = `${window.location.origin}/${slug}`;

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "복사 완료",
        description: "공유 링크가 클립보드에 복사되었습니다",
      });
    } catch (error) {
      toast({
        title: "복사 실패",
        description: "링크 복사에 실패했습니다",
        variant: "destructive",
      });
    }
  };

  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `${slug}-qr-code.png`;
      downloadLink.href = pngFile;
      downloadLink.click();

      toast({
        title: "다운로드 완료",
        description: "QR 코드가 다운로드되었습니다",
      });
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

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

            <div className="rounded-lg border border-border bg-card p-4 space-y-4">
              <div className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                <h4 className="text-sm font-semibold">공유 링크 & QR 코드</h4>
              </div>
              
              <div className="space-y-2">
                <Label>프로젝트 공유 링크</Label>
                <div className="flex gap-2">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={copyShareLink}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>QR 코드</Label>
                <div className="flex flex-col items-center gap-3 p-4 bg-background rounded-lg">
                  <QRCodeSVG
                    id="qr-code-svg"
                    value={shareUrl}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={downloadQRCode}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    QR 코드 다운로드
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  QR 코드를 스캔하면 프로젝트 페이지로 이동합니다
                </p>
              </div>
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

            <div className="rounded-lg border border-border bg-card p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <h4 className="text-sm font-semibold">공유 미리보기</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                소셜 미디어에서 링크가 어떻게 보일지 미리 확인하세요
              </p>

              <div className="space-y-3">
                <div className="rounded-lg border border-border overflow-hidden bg-background hover:bg-accent/50 transition-colors">
                  {(ogImage || ogTitle || ogDescription) ? (
                    <>
                      {ogImage && (
                        <div className="w-full aspect-[1.91/1] bg-muted relative overflow-hidden">
                          <img
                            src={ogImage}
                            alt="미리보기"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-3 space-y-1">
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {shareUrl}
                        </p>
                        <h5 className="font-semibold text-sm line-clamp-2">
                          {ogTitle || name || "프로젝트 제목"}
                        </h5>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {ogDescription || description || "프로젝트 설명"}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        공유 정보를 입력하면 미리보기가 표시됩니다
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
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
