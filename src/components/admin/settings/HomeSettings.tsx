import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, ArrowUp, ArrowDown } from "lucide-react";
import { ColorPicker } from "@/components/ColorPicker";
import ImageUpload from "@/components/ImageUpload";
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
    onSave();
    setTimeout(refreshPreview, 500);
  };

  const handleUpdateInfoCard = (id: string, data: any) => {
    const index = parseInt(id);
    const newCards = [...infoCards];
    newCards[index] = { ...newCards[index], ...data };
    onInfoCardsChange(newCards);
    onSave();
    setTimeout(refreshPreview, 500);
  };

  const handleDeleteInfoCard = (index: number) => {
    onInfoCardsChange(infoCards.filter((_, i) => i !== index));
    onSave();
    setTimeout(refreshPreview, 500);
  };

  const handleDragEndInfoCards = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = infoCards.findIndex((_, i) => i.toString() === active.id);
      const newIndex = infoCards.findIndex((_, i) => i.toString() === over.id);
      onInfoCardsChange(arrayMove(infoCards, oldIndex, newIndex));
      onSave();
      setTimeout(refreshPreview, 500);
    }
  };

  const handleAddBottomButton = () => {
    onBottomButtonsChange([...bottomButtons, { text: "", url: "" }]);
    onSave();
    setTimeout(refreshPreview, 500);
  };

  const handleUpdateBottomButton = (id: string, data: any) => {
    const index = parseInt(id);
    const newButtons = [...bottomButtons];
    newButtons[index] = { ...newButtons[index], ...data };
    onBottomButtonsChange(newButtons);
    onSave();
    setTimeout(refreshPreview, 500);
  };

  const handleDeleteBottomButton = (index: number) => {
    onBottomButtonsChange(bottomButtons.filter((_, i) => i !== index));
    onSave();
    setTimeout(refreshPreview, 500);
  };

  const handleDragEndBottomButtons = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = bottomButtons.findIndex((_, i) => i.toString() === active.id);
      const newIndex = bottomButtons.findIndex((_, i) => i.toString() === over.id);
      onBottomButtonsChange(arrayMove(bottomButtons, oldIndex, newIndex));
      onSave();
      setTimeout(refreshPreview, 500);
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
      case "hero_section": return "히어로 섹션";
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
            <SectionControls title="히어로 섹션" index={index} />
            <div className="grid gap-4">
              <ImageUpload
                value={settings.hero_image_url || ""}
                onChange={(url) => onSettingChange("hero_image_url", url)}
                label="배경 이미지"
              />
              <p className="text-sm text-muted-foreground">
                이미지는 원본 비율로 표시되며, 최대 너비는 1000px입니다.
              </p>
              
              <Separator />
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hero_use_text"
                  checked={settings.hero_use_text === "true"}
                  onCheckedChange={(checked) => onSettingChange("hero_use_text", checked ? "true" : "false")}
                />
                <Label htmlFor="hero_use_text" className="cursor-pointer">텍스트 사용</Label>
              </div>
              
              {settings.hero_use_text === "true" && (
                  <div>
                    <Label htmlFor="hero_text_content">텍스트 에디터</Label>
                    <Textarea
                      id="hero_text_content"
                      value={settings.hero_text_content || ""}
                      onChange={(e) => onSettingChange("hero_text_content", e.target.value)}
                      placeholder="HTML 또는 일반 텍스트를 입력하세요&#10;예시:&#10;<h1>제목</h1>&#10;<p>부제목</p>"
                      className="min-h-[150px] font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-1">HTML 태그를 사용할 수 있습니다</p>
                  </div>
              )}
              
              <div>
                <Label htmlFor="hero_overlay_opacity">배경 오버레이 투명도 (%)</Label>
                <Input
                  id="hero_overlay_opacity"
                  type="number"
                  value={settings.hero_overlay_opacity || "95"}
                  onChange={(e) => onSettingChange("hero_overlay_opacity", e.target.value)}
                  placeholder="95"
                  min="0"
                  max="100"
                />
                <p className="text-xs text-muted-foreground mt-1">0 (투명) ~ 100 (불투명)</p>
              </div>
              
              <Separator />
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hero_use_button"
                  checked={settings.hero_use_button === "true"}
                  onCheckedChange={(checked) => onSettingChange("hero_use_button", checked ? "true" : "false")}
                />
                <Label htmlFor="hero_use_button" className="cursor-pointer">버튼 사용</Label>
              </div>
              
              {settings.hero_use_button === "true" && (
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">버튼 위치</Label>
                    <RadioGroup
                      value={settings.hero_button_position || "inside"}
                      onValueChange={(value) => onSettingChange("hero_button_position", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="inside" id="button-inside" />
                        <Label htmlFor="button-inside" className="cursor-pointer">섹션 안</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="below" id="button-below" />
                        <Label htmlFor="button-below" className="cursor-pointer">섹션 아래</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <Label htmlFor="hero_button_text">버튼 텍스트</Label>
                    <Input
                      id="hero_button_text"
                      value={settings.hero_button_text || ""}
                      onChange={(e) => onSettingChange("hero_button_text", e.target.value)}
                      placeholder="참가 신청하기"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero_button_url">버튼 URL</Label>
                    <Input
                      id="hero_button_url"
                      value={settings.hero_button_url || ""}
                      onChange={(e) => onSettingChange("hero_button_url", e.target.value)}
                      placeholder="/registration"
                    />
                  </div>
                  <div>
                    <Label>버튼 배경색</Label>
                    <ColorPicker
                      value={settings.hero_button_bg_color || ""}
                      onChange={(color) => onSettingChange("hero_button_bg_color", color)}
                    />
                  </div>
                  <div>
                    <Label>버튼 텍스트 색상</Label>
                    <ColorPicker
                      value={settings.hero_button_text_color || ""}
                      onChange={(color) => onSettingChange("hero_button_text_color", color)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero_button_size_type">버튼 크기</Label>
                    <select
                      id="hero_button_size_type"
                      value={settings.hero_button_size_type || "lg"}
                      onChange={(e) => onSettingChange("hero_button_size_type", e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                      <option value="sm">작게 (sm)</option>
                      <option value="default">기본 (default)</option>
                      <option value="lg">크게 (lg)</option>
                      <option value="custom">사용자 지정</option>
                    </select>
                  </div>
                  
                  {settings.hero_button_size_type === "custom" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="hero_button_custom_width">가로 (px)</Label>
                        <Input
                          id="hero_button_custom_width"
                          type="number"
                          value={settings.hero_button_custom_width || ""}
                          onChange={(e) => onSettingChange("hero_button_custom_width", e.target.value)}
                          placeholder="200"
                        />
                      </div>
                      <div>
                        <Label htmlFor="hero_button_custom_height">세로 (px)</Label>
                        <Input
                          id="hero_button_custom_height"
                          type="number"
                          value={settings.hero_button_custom_height || ""}
                          onChange={(e) => onSettingChange("hero_button_custom_height", e.target.value)}
                          placeholder="48"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case "info_cards":
        return (
          <div key={sectionId} className="space-y-4">
            <SectionControls title={getSectionTitle(sectionId)} index={index} />
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
          </div>
        );

      case "description":
        return (
          <div key={sectionId} className="space-y-4">
            <SectionControls title={getSectionTitle(sectionId)} index={index} />
            <div className="grid gap-4">
              <div>
                <Label htmlFor="description_title">제목</Label>
                <Input
                  id="description_title"
                  value={settings.description_title}
                  onChange={(e) => onSettingChange("description_title", e.target.value)}
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
            </div>
          </div>
        );

      case "bottom_buttons":
        return (
          <div key={sectionId} className="space-y-4">
            <SectionControls title={getSectionTitle(sectionId)} index={index} />
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
