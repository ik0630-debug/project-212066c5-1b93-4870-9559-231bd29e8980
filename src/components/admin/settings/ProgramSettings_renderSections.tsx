import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { ColorPicker } from "@/components/ColorPicker";
import SortableInfoCard from "@/components/SortableInfoCard";
import SortableBottomButton from "@/components/SortableBottomButton";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface ProgramSettings_renderSectionsProps {
  descriptions: any[];
  infoCardSections: any[];
  buttonGroups: any[];
  onUpdateDescription: (id: string, updates: any) => void;
  onDeleteDescription: (id: string) => void;
  onUpdateInfoCardSection: (id: string, updates: any) => void;
  onDeleteInfoCardSection: (id: string) => void;
  onUpdateButtonGroup: (id: string, updates: any) => void;
  onDeleteButtonGroup: (id: string) => void;
}

export const ProgramSettings_renderSections = ({
  descriptions,
  infoCardSections,
  buttonGroups,
  onUpdateDescription,
  onDeleteDescription,
  onUpdateInfoCardSection,
  onDeleteInfoCardSection,
  onUpdateButtonGroup,
  onDeleteButtonGroup,
}: ProgramSettings_renderSectionsProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const renderDescriptionSection = (description: any, sectionId: string) => (
    <Card key={sectionId} className="overflow-hidden">
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h4 className="font-semibold">설명 섹션</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteDescription(sectionId)}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
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
            label="배경색"
            value={description.bgColor || description.backgroundColor || ""}
            onChange={(color) => onUpdateDescription(sectionId, { bgColor: color })}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderInfoCardSection = (section: any, sectionId: string) => {
    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = section.cards.findIndex((card: any) => card.id === active.id);
        const newIndex = section.cards.findIndex((card: any) => card.id === over.id);
        const newCards = [...section.cards];
        const [removed] = newCards.splice(oldIndex, 1);
        newCards.splice(newIndex, 0, removed);
        onUpdateInfoCardSection(sectionId, { cards: newCards });
      }
    };

    const handleAddCard = () => {
      const newCard = {
        id: `card_${Date.now()}`,
        icon: "Star",
        title: "",
        content: "",
        titleFontSize: "16",
        contentFontSize: "14",
        bgColor: "",
        iconColor: "220 70% 50%",
      };
      onUpdateInfoCardSection(sectionId, { cards: [...section.cards, newCard] });
    };

    const handleUpdateCard = (cardId: string, updates: any) => {
      const newCards = section.cards.map((card: any) =>
        card.id === cardId ? { ...card, ...updates } : card
      );
      onUpdateInfoCardSection(sectionId, { cards: newCards });
    };

    const handleDeleteCard = (cardId: string) => {
      onUpdateInfoCardSection(sectionId, {
        cards: section.cards.filter((card: any) => card.id !== cardId),
      });
    };

    return (
      <Card key={sectionId} className="overflow-hidden">
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h4 className="font-semibold">정보 카드 섹션</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteInfoCardSection(sectionId)}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
          
          <div>
            <Label>섹션 제목 (선택사항)</Label>
            <Input
              value={section.title || ""}
              onChange={(e) => onUpdateInfoCardSection(sectionId, { title: e.target.value })}
              placeholder="섹션 제목을 입력하세요"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base">카드 목록</Label>
              <Button onClick={handleAddCard} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                카드 추가
              </Button>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={section.cards.map((card: any) => card.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {section.cards.map((card: any) => (
                    <SortableInfoCard
                      key={card.id}
                      id={card.id}
                      card={card}
                      cardData={card}
                      onUpdate={(updates) => handleUpdateCard(card.id, updates)}
                      onDelete={() => handleDeleteCard(card.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderButtonGroup = (group: any, groupId: string) => {
    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = group.buttons.findIndex((btn: any) => btn.id === active.id);
        const newIndex = group.buttons.findIndex((btn: any) => btn.id === over.id);
        const newButtons = [...group.buttons];
        const [removed] = newButtons.splice(oldIndex, 1);
        newButtons.splice(newIndex, 0, removed);
        onUpdateButtonGroup(groupId, { buttons: newButtons });
      }
    };

    const handleAddButton = () => {
      const newButton = {
        id: `btn_${Date.now()}`,
        text: "새 버튼",
        link: "#",
        bgColor: "220 70% 50%",
        textColor: "0 0% 100%",
        size: "lg",
      };
      onUpdateButtonGroup(groupId, { buttons: [...group.buttons, newButton] });
    };

    const handleUpdateButton = (btnId: string, updates: any) => {
      const newButtons = group.buttons.map((btn: any) =>
        btn.id === btnId ? { ...btn, ...updates } : btn
      );
      onUpdateButtonGroup(groupId, { buttons: newButtons });
    };

    const handleDeleteButton = (btnId: string) => {
      onUpdateButtonGroup(groupId, {
        buttons: group.buttons.filter((btn: any) => btn.id !== btnId),
      });
    };

    return (
      <Card key={groupId} className="overflow-hidden">
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h4 className="font-semibold">버튼 그룹</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteButtonGroup(groupId)}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>

          <div>
            <Label>그룹 제목 (선택사항)</Label>
            <Input
              value={group.title || ""}
              onChange={(e) => onUpdateButtonGroup(groupId, { title: e.target.value })}
              placeholder="버튼 그룹 제목"
            />
          </div>

          <div>
            <Label>정렬</Label>
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3"
              value={group.alignment || "center"}
              onChange={(e) => onUpdateButtonGroup(groupId, { alignment: e.target.value })}
            >
              <option value="left">왼쪽</option>
              <option value="center">가운데</option>
              <option value="right">오른쪽</option>
            </select>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base">버튼 목록</Label>
              <Button onClick={handleAddButton} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                버튼 추가
              </Button>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={group.buttons.map((btn: any) => btn.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {group.buttons.map((button: any) => (
                    <SortableBottomButton
                      key={button.id}
                      id={button.id}
                      button={button}
                      buttonData={button}
                      onUpdate={(updates) => handleUpdateButton(button.id, updates)}
                      onDelete={() => handleDeleteButton(button.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {descriptions.map((desc) => renderDescriptionSection(desc, desc.id))}
      {infoCardSections.map((section) => renderInfoCardSection(section, section.id))}
      {buttonGroups.map((group) => renderButtonGroup(group, group.id))}
    </div>
  );
};
