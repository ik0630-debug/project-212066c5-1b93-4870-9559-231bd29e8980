import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Copy, ArrowUp, ArrowDown, Trash2, Plus } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { ColorPicker } from "@/components/ColorPicker";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableInfoCard from "@/components/SortableInfoCard";
import SortableBottomButton from "@/components/SortableBottomButton";
import { renderDescriptionSection, renderButtonGroupSection } from "./HomeSettings_renderSections";

interface HomeSettingsProps {
  settings: any;
  infoCards: any[];
  descriptions: any[];
  buttonGroups: any[];
  sectionOrder: string[];
  onSettingChange: (key: string, value: string) => void;
  onInfoCardsChange: (cards: any[]) => void;
  onDescriptionsChange: (descriptions: any[]) => void;
  onButtonGroupsChange: (groups: any[]) => void;
  onSectionOrderChange: (order: string[]) => void;
  onSaveSectionOrder: (order: string[]) => void;
  onSave: () => void;
}

const HomeSettings = ({
  settings,
  infoCards,
  descriptions,
  buttonGroups,
  sectionOrder,
  onSettingChange,
  onInfoCardsChange,
  onDescriptionsChange,
  onButtonGroupsChange,
  onSectionOrderChange,
  onSaveSectionOrder,
  onSave,
}: HomeSettingsProps) => {
  const [previewKey, setPreviewKey] = useState(0);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const refreshPreview = () => {
    setPreviewKey(prev => prev + 1);
  };

  const handleAddInfoCard = () => {
    onInfoCardsChange([...infoCards, { title: "", description: "", icon: "Info" }]);
  };

  const handleUpdateInfoCard = (id: string, data: any) => {
    const index = parseInt(id);
    const newCards = [...infoCards];
    newCards[index] = { ...newCards[index], ...data };
    onInfoCardsChange(newCards);
  };

  const handleDeleteInfoCard = (index: number) => {
    onInfoCardsChange(infoCards.filter((_, i) => i !== index));
  };

  const handleDragEndInfoCards = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = infoCards.findIndex((_, i) => i.toString() === active.id);
      const newIndex = infoCards.findIndex((_, i) => i.toString() === over.id);
      onInfoCardsChange(arrayMove(infoCards, oldIndex, newIndex));
    }
  };

  const handleAddDescription = () => {
    const newId = `description_${Date.now()}`;
    const newDesc = {
      id: newId,
      enabled: "true",
      title: "",
      content: "",
      titleFontSize: "24",
      contentFontSize: "16",
      bgColor: "0 0% 100%",
      order: descriptions.length,
    };
    onDescriptionsChange([...descriptions, newDesc]);
    onSectionOrderChange([...sectionOrder, newId]);
    onSaveSectionOrder([...sectionOrder, newId]);
  };

  const handleUpdateDescription = (id: string, data: any) => {
    const newDescriptions = descriptions.map((desc) =>
      desc.id === id ? { ...desc, ...data } : desc
    );
    onDescriptionsChange(newDescriptions);
  };

  const handleDeleteDescription = (id: string) => {
    onDescriptionsChange(descriptions.filter((desc) => desc.id !== id));
    const newOrder = sectionOrder.filter((sectionId) => sectionId !== id);
    onSectionOrderChange(newOrder);
    onSaveSectionOrder(newOrder);
  };

  const handleCopyDescription = (id: string) => {
    const descToCopy = descriptions.find((desc) => desc.id === id);
    if (descToCopy) {
      const newId = `description_${Date.now()}`;
      const newDesc = { ...descToCopy, id: newId, order: descriptions.length };
      onDescriptionsChange([...descriptions, newDesc]);
      
      const indexInOrder = sectionOrder.indexOf(id);
      const newOrder = [...sectionOrder];
      newOrder.splice(indexInOrder + 1, 0, newId);
      onSectionOrderChange(newOrder);
      onSaveSectionOrder(newOrder);
    }
  };

  const handleAddButtonGroup = () => {
    const newId = `button_group_${Date.now()}`;
    const newGroup = {
      id: newId,
      enabled: "true",
      buttons: [],
      order: buttonGroups.length,
    };
    onButtonGroupsChange([...buttonGroups, newGroup]);
    onSectionOrderChange([...sectionOrder, newId]);
    onSaveSectionOrder([...sectionOrder, newId]);
  };

  const handleUpdateButtonGroup = (id: string, data: any) => {
    const newGroups = buttonGroups.map((group) =>
      group.id === id ? { ...group, ...data } : group
    );
    onButtonGroupsChange(newGroups);
  };

  const handleDeleteButtonGroup = (id: string) => {
    onButtonGroupsChange(buttonGroups.filter((group) => group.id !== id));
    const newOrder = sectionOrder.filter((sectionId) => sectionId !== id);
    onSectionOrderChange(newOrder);
    onSaveSectionOrder(newOrder);
  };

  const handleCopyButtonGroup = (id: string) => {
    const groupToCopy = buttonGroups.find((group) => group.id === id);
    if (groupToCopy) {
      const newId = `button_group_${Date.now()}`;
      const newGroup = { ...groupToCopy, id: newId, order: buttonGroups.length };
      onButtonGroupsChange([...buttonGroups, newGroup]);
      
      const indexInOrder = sectionOrder.indexOf(id);
      const newOrder = [...sectionOrder];
      newOrder.splice(indexInOrder + 1, 0, newId);
      onSectionOrderChange(newOrder);
      onSaveSectionOrder(newOrder);
    }
  };

  const handleMoveSectionUp = (index: number) => {
    if (index > 0) {
      const newOrder = [...sectionOrder];
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
      onSectionOrderChange(newOrder);
      onSaveSectionOrder(newOrder);
    }
  };

  const handleMoveSectionDown = (index: number) => {
    if (index < sectionOrder.length - 1) {
      const newOrder = [...sectionOrder];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      onSectionOrderChange(newOrder);
      onSaveSectionOrder(newOrder);
    }
  };

  const getSectionTitle = (sectionId: string): string => {
    if (sectionId === "hero_section") return "헤더 이미지";
    if (sectionId === "info_cards") return "정보 카드";
    if (sectionId.startsWith("description_")) return "설명 섹션";
    if (sectionId.startsWith("button_group_")) return "버튼";
    return sectionId;
  };

  const SectionControls = ({ title, index, onCopy, onDelete }: { title: string; index: number; onCopy?: () => void; onDelete?: () => void }) => (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="flex gap-2">
        {onCopy && (
          <Button variant="outline" size="sm" onClick={onCopy}>
            <Copy className="w-4 h-4" />
          </Button>
        )}
        {onDelete && (
          <Button variant="outline" size="sm" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={() => handleMoveSectionUp(index)} disabled={index === 0}>
          <ArrowUp className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleMoveSectionDown(index)} disabled={index === sectionOrder.length - 1}>
          <ArrowDown className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  const handleDragEndButtonGroup = (groupId: string, event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const group = buttonGroups.find((g) => g.id === groupId);
      if (group) {
        const oldIndex = parseInt(active.id as string);
        const newIndex = parseInt(over.id as string);
        const newButtons = arrayMove(group.buttons, oldIndex, newIndex);
        handleUpdateButtonGroup(groupId, { buttons: newButtons });
      }
    }
  };

  const renderSection = (sectionId: string, index: number) => {
    if (sectionId === "hero_section") {
      return (
        <div key={sectionId} className="space-y-4">
          <SectionControls title="헤더 이미지" index={index} />
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="hero_enabled">헤더 이미지 사용</Label>
              <Switch
                id="hero_enabled"
                checked={settings.hero_enabled === "true"}
                onCheckedChange={(checked) => onSettingChange("hero_enabled", checked ? "true" : "false")}
              />
            </div>
            
            {settings.hero_enabled === "true" && (
              <>
                <ImageUpload
                  value={settings.hero_image_url || ""}
                  onChange={(url) => onSettingChange("hero_image_url", url)}
                  label="배경 이미지"
                />
                <p className="text-sm text-muted-foreground">
                  이미지는 원본 비율로 표시되며, 최대 너비는 1000px입니다.
                </p>
                
                <div>
                  <Label htmlFor="hero_overlay_opacity">배경 오버레이 투명도 (%)</Label>
                  <Input
                    id="hero_overlay_opacity"
                    type="number"
                    value={settings.hero_overlay_opacity || "0"}
                    onChange={(e) => onSettingChange("hero_overlay_opacity", e.target.value)}
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                  <p className="text-xs text-muted-foreground mt-1">0 (투명) ~ 100 (불투명)</p>
                </div>
              </>
            )}
          </div>
        </div>
      );
    }

    if (sectionId === "info_cards") {
      return (
        <div key={sectionId} className="space-y-4">
          <SectionControls title={getSectionTitle(sectionId)} index={index} />
          <div className="flex items-center justify-between mb-4">
            <Label htmlFor="info_cards_enabled">정보 카드 사용</Label>
            <Switch
              id="info_cards_enabled"
              checked={settings.info_cards_enabled === "true"}
              onCheckedChange={(checked) => onSettingChange("info_cards_enabled", checked ? "true" : "false")}
            />
          </div>
          
          {settings.info_cards_enabled === "true" && (
            <>
              <div className="flex justify-end mb-4">
                <Button onClick={handleAddInfoCard} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  카드 추가
                </Button>
              </div>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndInfoCards}>
                <SortableContext items={infoCards.map((_, i) => i.toString())} strategy={verticalListSortingStrategy}>
                  <div className="space-y-4">
                    {infoCards.map((card, i) => (
                      <SortableInfoCard
                        key={i}
                        id={i.toString()}
                        card={card}
                        cardData={card}
                        onUpdate={(data) => handleUpdateInfoCard(i.toString(), data)}
                        onDelete={() => handleDeleteInfoCard(i)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </>
          )}
        </div>
      );
    }

    if (sectionId.startsWith("description_")) {
      return renderDescriptionSection({
        sectionId,
        index,
        settings,
        descriptions,
        buttonGroups,
        sensors,
        SectionControls,
        onSettingChange,
        onUpdateDescription: handleUpdateDescription,
        onDeleteDescription: handleDeleteDescription,
        onCopyDescription: handleCopyDescription,
        onUpdateButtonGroup: handleUpdateButtonGroup,
        onDeleteButtonGroup: handleDeleteButtonGroup,
        onCopyButtonGroup: handleCopyButtonGroup,
        handleDragEndBottomButtons: handleDragEndButtonGroup,
        getSectionTitle,
      });
    }

    if (sectionId.startsWith("button_group_")) {
      return renderButtonGroupSection({
        sectionId,
        index,
        settings,
        descriptions,
        buttonGroups,
        sensors,
        SectionControls,
        onSettingChange,
        onUpdateDescription: handleUpdateDescription,
        onDeleteDescription: handleDeleteDescription,
        onCopyDescription: handleCopyDescription,
        onUpdateButtonGroup: handleUpdateButtonGroup,
        onDeleteButtonGroup: handleDeleteButtonGroup,
        onCopyButtonGroup: handleCopyButtonGroup,
        handleDragEndBottomButtons: handleDragEndButtonGroup,
        getSectionTitle,
      });
    }

    return null;
  };

  return (
    <div className="space-y-6">
      {sectionOrder.map((sectionId, index) => (
        <div key={sectionId}>
          {renderSection(sectionId, index)}
          {index < sectionOrder.length - 1 && <Separator className="my-6" />}
        </div>
      ))}
    </div>
  );
};

export default HomeSettings;
