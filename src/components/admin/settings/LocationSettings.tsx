import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { ColorPicker } from "@/components/ColorPicker";
import { useLocationSettingsHandlers } from "@/hooks/admin/useLocationSettingsHandlers";
import { renderLocationSection } from "./LocationSettings_renderSections";

interface LocationSettingsProps {
  settings: any;
  transportCards: any[];
  bottomButtons: any[];
  downloadFiles: any[];
  buttonGroups: any[];
  sectionOrder: string[];
  onSettingChange: (key: string, value: string) => void;
  onTransportCardsChange: (cards: any[]) => void;
  onBottomButtonsChange: (buttons: any[]) => void;
  onDownloadFilesChange: (files: any[]) => void;
  onButtonGroupsChange: (groups: any[]) => void;
  onSectionOrderChange: (order: string[]) => void;
  onSaveSectionOrder: (order: string[]) => void;
}

const LocationSettings = ({
  settings,
  transportCards,
  bottomButtons,
  downloadFiles,
  buttonGroups,
  sectionOrder,
  onSettingChange,
  onTransportCardsChange,
  onBottomButtonsChange,
  onDownloadFilesChange,
  onButtonGroupsChange,
  onSectionOrderChange,
  onSaveSectionOrder,
}: LocationSettingsProps) => {
  
  const handlers = useLocationSettingsHandlers({
    transportCards,
    bottomButtons,
    downloadFiles,
    buttonGroups,
    sectionOrder,
    onTransportCardsChange,
    onBottomButtonsChange,
    onDownloadFilesChange,
    onButtonGroupsChange,
    onSectionOrderChange,
    onSaveSectionOrder,
  });

  const isSectionAdded = (sectionId: string) => sectionOrder.includes(sectionId);

  return (
    <div className="space-y-8">
      {/* Section Add Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button 
          onClick={() => handlers.handleAddSection("hero_image")} 
          variant="outline"
          size="sm"
          className="h-8 text-xs border-primary text-primary hover:bg-primary/10"
          disabled={isSectionAdded("hero_image")}
        >
          <Plus className="w-3 h-3 mr-1.5" />
          이미지
        </Button>
        <Button 
          onClick={() => handlers.handleAddSection("description_buttons")} 
          variant="outline"
          size="sm"
          className="h-8 text-xs border-primary text-primary hover:bg-primary/10"
          disabled={isSectionAdded("description_buttons")}
        >
          <Plus className="w-3 h-3 mr-1.5" />
          설명 카드
        </Button>
        <Button 
          onClick={() => handlers.handleAddSection("location_info")} 
          variant="outline"
          size="sm"
          className="h-8 text-xs border-primary text-primary hover:bg-primary/10"
          disabled={isSectionAdded("location_info")}
        >
          <Plus className="w-3 h-3 mr-1.5" />
          장소정보
        </Button>
        <Button 
          onClick={() => handlers.handleAddSection("contact_info")} 
          variant="outline"
          size="sm"
          className="h-8 text-xs border-primary text-primary hover:bg-primary/10"
          disabled={isSectionAdded("contact_info")}
        >
          <Plus className="w-3 h-3 mr-1.5" />
          연락처
        </Button>
        <Button 
          onClick={() => handlers.handleAddSection("transport_info")} 
          variant="outline"
          size="sm"
          className="h-8 text-xs border-primary text-primary hover:bg-primary/10"
          disabled={isSectionAdded("transport_info")}
        >
          <Plus className="w-3 h-3 mr-1.5" />
          교통정보
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
      </div>

      <Separator />

      {/* Page Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">페이지 정보</h3>
        <div className="grid gap-4">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div className="space-y-0.5">
              <Label>페이지 활성화</Label>
              <p className="text-sm text-muted-foreground">
                비활성화하면 사용자가 오시는 길 페이지에 접근할 수 없습니다
              </p>
            </div>
            <Switch
              checked={settings.location_enabled === "true"}
              onCheckedChange={(checked) => onSettingChange("location_enabled", checked ? "true" : "false")}
            />
          </div>
          <div>
            <Label htmlFor="location_page_title">페이지 제목</Label>
            <Input
              id="location_page_title"
              value={settings.location_page_title}
              onChange={(e) => onSettingChange("location_page_title", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="location_page_description">페이지 설명</Label>
            <Input
              id="location_page_description"
              value={settings.location_page_description}
              onChange={(e) => onSettingChange("location_page_description", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="location_header_color">헤더 배경색</Label>
            <ColorPicker
              value={settings.location_header_color || ""}
              onChange={(color) => onSettingChange("location_header_color", color)}
            />
          </div>
        </div>
      </div>

      <Separator />

      {sectionOrder.map((sectionId, index) => (
        <div key={sectionId}>
          {renderLocationSection({
            sectionId,
            index,
            sectionOrder,
            settings,
            transportCards,
            buttonGroups,
            unifiedButtons: handlers.unifiedButtons,
            onSettingChange,
            onButtonGroupsChange,
            ...handlers,
          })}
          {index < sectionOrder.length - 1 && <Separator className="my-6" />}
        </div>
      ))}
    </div>
  );
};

export default LocationSettings;
