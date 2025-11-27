import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  accept?: string;
}

const ImageUpload = ({ value, onChange, label, accept }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type (only for images)
    if (!accept || accept.startsWith('image/')) {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error("지원되지 않는 파일 형식입니다. JPG, PNG, WEBP, GIF만 업로드 가능합니다.");
        return;
      }
    }


    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const folder = accept === '*' ? 'files' : 'hero';
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('site-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath);

      setPreview(publicUrl);
      onChange(publicUrl);
      toast.success(accept === '*' ? "파일이 성공적으로 업로드되었습니다." : "이미지가 성공적으로 업로드되었습니다.");
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {preview && (!accept || accept.startsWith('image/')) && (
        <div className="relative rounded-lg overflow-hidden border border-border bg-muted/30">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto object-contain max-h-80"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {preview && accept === '*' && (
        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/50">
          <span className="text-sm text-muted-foreground">파일이 업로드되었습니다</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            type="file"
            accept={accept || "image/jpeg,image/png,image/webp,image/gif"}
            onChange={handleFileUpload}
            disabled={uploading}
            className="cursor-pointer"
          />
        </div>
        {uploading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            업로드 중...
          </div>
        )}
      </div>

      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">또는 URL 입력</Label>
        <Input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setPreview(e.target.value);
          }}
          placeholder="https://example.com/image.jpg"
          disabled={uploading}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        {accept === '*' ? '모든 파일 형식 지원' : 'JPG, PNG, WEBP, GIF 형식 지원'}
      </p>
    </div>
  );
};

export default ImageUpload;
