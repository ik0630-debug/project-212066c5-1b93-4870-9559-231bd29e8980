import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ColorPicker } from "@/components/ColorPicker";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableButton from "@/components/SortableButton";

interface RenderSectionsProps {
  sectionId: string;
  index: number;
  settings: any;
  descriptions: any[];
  buttonGroups: any[];
  sensors: any;
  SectionControls: any;
  onSettingChange: (key: string, value: string) => void;
  onUpdateDescription: (id: string, data: any) => void;
  onDeleteDescription: (id: string) => void;
  onCopyDescription: (id: string) => void;
  onUpdateButtonGroup: (id: string, data: any) => void;
  onDeleteButtonGroup: (id: string) => void;
  onCopyButtonGroup: (id: string) => void;
  handleDragEndBottomButtons: (groupId: string, event: any) => void;
  getSectionTitle: (sectionId: string) => string;
  isCollapsed?: boolean;
}

export const renderDescriptionSection = (props: RenderSectionsProps) => {
  const { sectionId, index, descriptions, SectionControls, onUpdateDescription, onDeleteDescription, onCopyDescription, getSectionTitle, isCollapsed } = props;
  
  const description = descriptions.find((d) => d.id === sectionId);
  if (!description) return null;

  return (
    <div key={sectionId} className="space-y-4">
      <SectionControls
        title={getSectionTitle(sectionId)}
        index={index}
        sectionId={sectionId}
        onCopy={() => onCopyDescription(sectionId)}
        onDelete={() => onDeleteDescription(sectionId)}
      />
      
      {!isCollapsed && (
        <div className="space-y-4">
          <div>
            <Label htmlFor={`${sectionId}_title`}>제목</Label>
            <Textarea
              id={`${sectionId}_title`}
              value={description.title}
              onChange={(e) => onUpdateDescription(sectionId, { title: e.target.value })}
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor={`${sectionId}_title_font_size`}>제목 폰트 크기 (px)</Label>
            <Input
              id={`${sectionId}_title_font_size`}
              type="number"
              value={description.titleFontSize || "18"}
              onChange={(e) => onUpdateDescription(sectionId, { titleFontSize: e.target.value })}
              placeholder="18"
              min="12"
              max="72"
            />
          </div>
          <div>
            <Label htmlFor={`${sectionId}_content`}>내용</Label>
            <Textarea
              id={`${sectionId}_content`}
              value={description.content}
              onChange={(e) => onUpdateDescription(sectionId, { content: e.target.value })}
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor={`${sectionId}_content_font_size`}>내용 폰트 크기 (px)</Label>
            <Input
              id={`${sectionId}_content_font_size`}
              type="number"
              value={description.contentFontSize || "16"}
              onChange={(e) => onUpdateDescription(sectionId, { contentFontSize: e.target.value })}
              placeholder="16"
              min="12"
              max="48"
            />
          </div>
          <div>
            <ColorPicker
              value={description.bgColor || "0 0% 100%"}
              onChange={(color) => onUpdateDescription(sectionId, { bgColor: color })}
              label="배경 색상"
            />
            <p className="text-xs text-muted-foreground mt-1">
              색상을 선택하세요. 비워두면 기본 카드 배경색이 사용됩니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export const renderButtonGroupSection = (props: RenderSectionsProps) => {
  const { sectionId, index, buttonGroups, sensors, SectionControls, onUpdateButtonGroup, onDeleteButtonGroup, onCopyButtonGroup, handleDragEndBottomButtons, getSectionTitle, isCollapsed } = props;
  
  const buttonGroup = buttonGroups.find((g) => g.id === sectionId);
  if (!buttonGroup) return null;

  const handleAddButton = () => {
    const newButtons = [...(buttonGroup.buttons || []), { text: "", link: "", linkType: "internal", fontSize: "text-lg" }];
    onUpdateButtonGroup(sectionId, { buttons: newButtons });
  };

  const handleUpdateButton = (buttonId: string, data: any) => {
    const index = parseInt(buttonId);
    const newButtons = [...buttonGroup.buttons];
    newButtons[index] = { ...newButtons[index], ...data };
    onUpdateButtonGroup(sectionId, { buttons: newButtons });
  };

  const handleDeleteButton = (buttonIndex: number) => {
    const newButtons = buttonGroup.buttons.filter((_, i) => i !== buttonIndex);
    onUpdateButtonGroup(sectionId, { buttons: newButtons });
  };

  return (
    <div key={sectionId} className="space-y-4">
      <SectionControls
        title={getSectionTitle(sectionId)}
        index={index}
        sectionId={sectionId}
        onCopy={() => onCopyButtonGroup(sectionId)}
        onDelete={() => onDeleteButtonGroup(sectionId)}
      />
      
      {!isCollapsed && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={handleAddButton} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              버튼 추가
            </Button>
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => handleDragEndBottomButtons(sectionId, event)}
          >
            <SortableContext
              items={(buttonGroup.buttons || []).map((_, i) => i.toString())}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {(buttonGroup.buttons || []).map((button, i) => (
                  <SortableButton
                    key={i}
                    id={i.toString()}
                    button={button}
                    buttonData={button}
                    onUpdate={(data) => handleUpdateButton(i.toString(), data)}
                    onDelete={() => handleDeleteButton(i)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
};
