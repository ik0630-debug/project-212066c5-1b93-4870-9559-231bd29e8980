import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import ImageUpload from "@/components/ImageUpload";

interface RenderHeroSectionProps {
  sectionId: string;
  index: number;
  heroSections: any[];
  SectionControls: any;
  onUpdateHeroSection: (id: string, data: any) => void;
  onCopyHeroSection?: (id: string) => void;
  onDeleteHeroSection?: (id: string) => void;
  getSectionTitle: (sectionId: string) => string;
  isCollapsed?: boolean;
}

export const renderHeroSection = (props: RenderHeroSectionProps) => {
  const { sectionId, index, heroSections, SectionControls, onUpdateHeroSection, getSectionTitle, isCollapsed } = props;
  
  const heroSection = heroSections.find((h) => h.id === sectionId);
  if (!heroSection) return null;

  return (
    <div key={sectionId} className="space-y-4">
      <SectionControls 
        title={getSectionTitle(sectionId)} 
        index={index}
        sectionId={sectionId}
        onCopy={() => props.onCopyHeroSection?.(sectionId)}
        onDelete={() => props.onDeleteHeroSection?.(sectionId)}
      />
      
      {!isCollapsed && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor={`${sectionId}_enabled`}>사용</Label>
            <Switch
              id={`${sectionId}_enabled`}
              checked={heroSection.enabled === "true"}
              onCheckedChange={(checked) =>
                onUpdateHeroSection(sectionId, { enabled: checked ? "true" : "false" })
              }
            />
          </div>
          
          {heroSection.enabled === "true" && (
            <div className="grid gap-4">
              <ImageUpload
                value={heroSection.imageUrl || ""}
                onChange={(url) => onUpdateHeroSection(sectionId, { imageUrl: url })}
                label="배경 이미지"
              />
              <p className="text-sm text-muted-foreground">
                이미지는 원본 비율로 표시되며, 최대 너비는 1000px입니다.
              </p>
              
              <div>
                <Label htmlFor={`${sectionId}_overlay_opacity`}>배경 오버레이 투명도 (%)</Label>
                <Input
                  id={`${sectionId}_overlay_opacity`}
                  type="number"
                  value={heroSection.overlayOpacity || "0"}
                  onChange={(e) => onUpdateHeroSection(sectionId, { overlayOpacity: e.target.value })}
                  placeholder="0"
                  min="0"
                  max="100"
                />
                <p className="text-xs text-muted-foreground mt-1">0 (투명) ~ 100 (불투명)</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};