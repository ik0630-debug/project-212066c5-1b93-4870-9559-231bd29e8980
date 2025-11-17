import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
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
}: HomeSettingsProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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
      case "hero_section":
        return "히어로 섹션";
      case "info_cards":
        return "정보 카드";
      case "description":
        return "행사 소개";
      case "bottom_buttons":
        return "하단 버튼";
      default:
        return sectionId;
    }
  };

  const SectionControls = ({ title, index }: { title: string; index: number }) => (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleMoveSectionUp(index)}
          disabled={index === 0}
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleMoveSectionDown(index)}
          disabled={index === sectionOrder.length - 1}
        >
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
              <div>
                <Label htmlFor="hero_title">메인 제목</Label>
                <Input
                  id="hero_title"
                  value={settings.hero_title || ""}
                  onChange={(e) => onSettingChange("hero_title", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="hero_subtitle">부제목</Label>
                <Input
                  id="hero_subtitle"
                  value={settings.hero_subtitle || ""}
                  onChange={(e) => onSettingChange("hero_subtitle", e.target.value)}
                />
              </div>
              <Separator />
              <h4 className="font-medium">히어로 버튼 설정</h4>
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
                  placeholder="/registration 또는 https://example.com"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <ColorPicker
                  value={settings.hero_button_bg_color || "280 100% 70%"}
                  onChange={(value) => onSettingChange("hero_button_bg_color", value)}
                  label="배경 색상"
                />
                <ColorPicker
                  value={settings.hero_button_text_color || "0 0% 100%"}
                  onChange={(value) => onSettingChange("hero_button_text_color", value)}
                  label="텍스트 색상"
                />
                <div>
                  <Label htmlFor="hero_button_text_size">텍스트 크기 (px)</Label>
                  <Input
                    id="hero_button_text_size"
                    type="number"
                    value={settings.hero_button_text_size || ""}
                    onChange={(e) => onSettingChange("hero_button_text_size", e.target.value)}
                    placeholder="16"
                    min="12"
                    max="48"
                  />
                </div>
              </div>
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEndInfoCards}
            >
              <SortableContext
                items={infoCards.map((_, i) => i.toString())}
                strategy={verticalListSortingStrategy}
              >
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEndBottomButtons}
            >
              <SortableContext
                items={bottomButtons.map((_, i) => i.toString())}
                strategy={verticalListSortingStrategy}
              >
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
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">홈 화면 섹션 설정</h3>
        <p className="text-sm text-muted-foreground">
          섹션 순서를 변경하려면 화살표 버튼을 사용하세요
        </p>
      </div>

      {sectionOrder.map((sectionId, index) => (
        <div key={sectionId}>
          {renderSection(sectionId, index)}
          {index < sectionOrder.length - 1 && <Separator className="my-8" />}
        </div>
      ))}
    </div>
  );
};

export default HomeSettings;
