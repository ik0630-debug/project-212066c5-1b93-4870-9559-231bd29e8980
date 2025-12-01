import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

interface ProgramSettings_renderHeroSectionProps {
  heroSections: any[];
  onUpdateHeroSection: (id: string, updates: any) => void;
  onDeleteHeroSection: (id: string) => void;
}

export const ProgramSettings_renderHeroSection = ({
  heroSections,
  onUpdateHeroSection,
  onDeleteHeroSection,
}: ProgramSettings_renderHeroSectionProps) => {
  return (
    <div className="space-y-4">
      {heroSections.map((heroSection) => {
        const sectionId = heroSection.id;
        return (
          <Card key={sectionId} className="overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold">헤더 이미지</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteHeroSection(sectionId)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
              <ImageUpload
                label="이미지"
                value={heroSection.imageUrl || ""}
                onChange={(value) => onUpdateHeroSection(sectionId, { imageUrl: value })}
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
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
