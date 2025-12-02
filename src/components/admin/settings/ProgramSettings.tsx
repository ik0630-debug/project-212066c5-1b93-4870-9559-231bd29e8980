import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { ColorPicker } from "@/components/ColorPicker";
import { useProgramSettingsHandlers } from "@/hooks/admin/useProgramSettingsHandlers";
import { renderProgramSection } from "./ProgramSettings_renderSections";

interface ProgramSettingsProps {
  settings: any;
  programCards: any[];
  heroSections: any[];
  infoCardSections: any[];
  descriptions: any[];
  buttonGroups: any[];
  sectionOrder: string[];
  onSettingChange: (key: string, value: string) => void;
  onProgramCardsChange: (cards: any[]) => void;
  onHeroSectionsChange: (sections: any[]) => void;
  onInfoCardSectionsChange: (sections: any[]) => void;
  onDescriptionsChange: (descriptions: any[]) => void;
  onButtonGroupsChange: (groups: any[]) => void;
  onSectionOrderChange: (order: string[]) => void;
  onSaveSectionOrder: (order: string[]) => void;
}

const ProgramSettings = ({
  settings,
  programCards,
  heroSections,
  infoCardSections,
  descriptions,
  buttonGroups,
  sectionOrder,
  onSettingChange,
  onProgramCardsChange,
  onHeroSectionsChange,
  onInfoCardSectionsChange,
  onDescriptionsChange,
  onButtonGroupsChange,
  onSectionOrderChange,
  onSaveSectionOrder,
}: ProgramSettingsProps) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  
  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handlers = useProgramSettingsHandlers({
    programCards,
    heroSections,
    infoCardSections,
    descriptions,
    buttonGroups,
    sectionOrder,
    onProgramCardsChange,
    onHeroSectionsChange,
    onInfoCardSectionsChange,
    onDescriptionsChange,
    onButtonGroupsChange,
    onSectionOrderChange,
    onSaveSectionOrder,
  });

  return (
    <div className="space-y-8">
      {/* Section Add Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button 
          onClick={handlers.handleAddHeroSection} 
          variant="outline"
          size="sm"
          className="h-8 text-xs border-primary text-primary hover:bg-primary/10"
        >
          <Plus className="w-3 h-3 mr-1.5" />
          이미지
        </Button>
        <Button 
          onClick={handlers.handleAddDescription} 
          variant="outline"
          size="sm"
          className="h-8 text-xs border-primary text-primary hover:bg-primary/10"
        >
          <Plus className="w-3 h-3 mr-1.5" />
          설명 카드
        </Button>
        <Button 
          onClick={handlers.handleAddInfoCardSection} 
          variant="outline"
          size="sm"
          className="h-8 text-xs border-primary text-primary hover:bg-primary/10"
        >
          <Plus className="w-3 h-3 mr-1.5" />
          아이콘 카드
        </Button>
        <Button 
          onClick={handlers.handleAddButtonGroup} 
          variant="outline"
          size="sm"
          className="h-8 text-xs border-primary text-primary hover:bg-primary/10"
        >
          <Plus className="w-3 h-3 mr-1.5" />
          버튼
        </Button>
        <Button 
          onClick={handlers.handleAddProgramSchedule} 
          variant="outline"
          size="sm"
          className="h-8 text-xs border-primary text-primary hover:bg-primary/10"
          disabled={sectionOrder.includes("program_cards")}
        >
          <Plus className="w-3 h-3 mr-1.5" />
          프로그램 일정
        </Button>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">페이지 정보</h3>
        <div className="grid gap-4">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div className="space-y-0.5">
              <Label>페이지 활성화</Label>
              <p className="text-sm text-muted-foreground">
                비활성화하면 사용자가 프로그램 페이지에 접근할 수 없습니다
              </p>
            </div>
            <Switch
              checked={settings.program_enabled === "true"}
              onCheckedChange={(checked) => onSettingChange("program_enabled", checked ? "true" : "false")}
            />
          </div>
          <div>
            <Label htmlFor="program_title">제목</Label>
            <Input
              id="program_title"
              value={settings.program_title}
              onChange={(e) => onSettingChange("program_title", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="program_description">설명</Label>
            <Input
              id="program_description"
              value={settings.program_description}
              onChange={(e) => onSettingChange("program_description", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="program_header_color">헤더 배경색</Label>
            <ColorPicker
              value={settings.program_header_color || ""}
              onChange={(color) => onSettingChange("program_header_color", color)}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Render Sections */}
      {sectionOrder.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>섹션이 없습니다. 위 버튼을 클릭하여 섹션을 추가하세요.</p>
        </div>
      ) : (
        sectionOrder.map((sectionId, index) => (
          <div key={sectionId} className="mb-8">
            {renderProgramSection({
              sectionId,
              index,
              sectionOrder,
              collapsedSections,
              programCards,
              heroSections,
              infoCardSections,
              descriptions,
              buttonGroups,
              toggleSection,
              ...handlers,
            })}
          </div>
        ))
      )}
    </div>
  );
};

export default ProgramSettings;
