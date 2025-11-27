import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Plus, ArrowUp, ArrowDown } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { ColorPicker } from "@/components/ColorPicker";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableInfoCard from "@/components/SortableInfoCard";
import SortableBottomButton from "@/components/SortableBottomButton";

interface HomeSettingsProps {
  settings: any;
  infoCards: any[];
  bottomButtons: any[];
  sectionOrder: string[];
  onSettingChange: (key: string, value: string) => void;
  onInfoCardsChange: (cards: any[]) => void;
  onBottomButtonsChange: (buttons: any[]) => void;
  onSectionOrderChange: (order: string[]) => void;
  onSaveSectionOrder: (order: string[]) => void;
  onSave: () => void;
}

const HomeSettings = ({
  settings,
  infoCards,
  bottomButtons,
  sectionOrder,
  onSettingChange,
  onInfoCardsChange,
  onBottomButtonsChange,
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

  const handleAddBottomButton = () => {
    onBottomButtonsChange([...bottomButtons, { text: "", url: "" }]);
  };

  const handleUpdateBottomButton = (id: string, data: any) => {
    const index = parseInt(id);
    const newButtons = [...bottomButtons];
    newButtons[index] = { ...newButtons[index], ...data };
    onBottomButtonsChange(newButtons);
  };

  const handleDeleteBottomButton = (index: number) => {
    onBottomButtonsChange(bottomButtons.filter((_, i) => i !== index));
  };

  const handleDragEndBottomButtons = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = bottomButtons.findIndex((_, i) => i.toString() === active.id);
      const newIndex = bottomButtons.findIndex((_, i) => i.toString() === over.id);
      onBottomButtonsChange(arrayMove(bottomButtons, oldIndex, newIndex));
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
    switch (sectionId) {
      case "hero_section": return "헤더 이미지";
      case "info_cards": return "정보 카드";
      case "description": return "행사 소개";
      case "bottom_buttons": return "하단 버튼";
      default: return sectionId;
    }
  };

  const SectionControls = ({ title, index }: { title: string; index: number }) => (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => handleMoveSectionUp(index)} disabled={index === 0}>
          <ArrowUp className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleMoveSectionDown(index)} disabled={index === sectionOrder.length - 1}>
          <ArrowDown className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  const renderSection = (sectionId: string, index: number) => {
    switch (sectionId) {
      case "hero_section":
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

      case "info_cards":
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

      case "description":
        return (
          <div key={sectionId} className="space-y-4">
            <SectionControls title={getSectionTitle(sectionId)} index={index} />
            <div className="flex items-center justify-between mb-4">
              <Label htmlFor="description_enabled">행사 소개 사용</Label>
              <Switch
                id="description_enabled"
                checked={settings.description_enabled === "true"}
                onCheckedChange={(checked) => onSettingChange("description_enabled", checked ? "true" : "false")}
              />
            </div>
            
            {settings.description_enabled === "true" && (
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="description_title">제목</Label>
                  <Textarea
                    id="description_title"
                    value={settings.description_title}
                    onChange={(e) => onSettingChange("description_title", e.target.value)}
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="description_title_font_size">제목 폰트 크기 (px)</Label>
                  <Input
                    id="description_title_font_size"
                    type="number"
                    value={settings.description_title_font_size || "24"}
                    onChange={(e) => onSettingChange("description_title_font_size", e.target.value)}
                    placeholder="24"
                    min="12"
                    max="72"
                  />
                </div>
                <div>
                  <Label htmlFor="description_content">내용</Label>
                  <Textarea
                    id="description_content"
                    value={settings.description_content}
                    onChange={(e) => onSettingChange("description_content", e.target.value)}
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="description_content_font_size">내용 폰트 크기 (px)</Label>
                  <Input
                    id="description_content_font_size"
                    type="number"
                    value={settings.description_content_font_size || "16"}
                    onChange={(e) => onSettingChange("description_content_font_size", e.target.value)}
                    placeholder="16"
                    min="12"
                    max="48"
                  />
                </div>
                <div>
                  <ColorPicker
                    value={settings.description_bg_color || "0 0% 100%"}
                    onChange={(color) => onSettingChange("description_bg_color", color)}
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

      case "bottom_buttons":
        return (
          <div key={sectionId} className="space-y-4">
            <SectionControls title={getSectionTitle(sectionId)} index={index} />
            <div className="flex items-center justify-between mb-4">
              <Label htmlFor="bottom_buttons_enabled">하단 버튼 사용</Label>
              <Switch
                id="bottom_buttons_enabled"
                checked={settings.bottom_buttons_enabled === "true"}
                onCheckedChange={(checked) => onSettingChange("bottom_buttons_enabled", checked ? "true" : "false")}
              />
            </div>
            
            {settings.bottom_buttons_enabled === "true" && (
              <>
                <div className="flex justify-end mb-4">
                  <Button onClick={handleAddBottomButton} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    버튼 추가
                  </Button>
                </div>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndBottomButtons}>
                  <SortableContext items={bottomButtons.map((_, i) => i.toString())} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                      {bottomButtons.map((button, i) => (
                        <SortableBottomButton
                          key={i}
                          id={i.toString()}
                          button={button}
                          buttonData={button}
                          onUpdate={(data) => handleUpdateBottomButton(i.toString(), data)}
                          onDelete={() => handleDeleteBottomButton(i)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
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
