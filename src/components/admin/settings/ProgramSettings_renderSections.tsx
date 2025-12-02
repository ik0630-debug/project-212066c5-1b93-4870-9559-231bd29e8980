import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ColorPicker } from "@/components/ColorPicker";
import { SortableProgramCard } from "@/components/SortableProgramCard";
import ImageUpload from "@/components/ImageUpload";
import SortableInfoCard from "@/components/SortableInfoCard";
import SortableButton from "@/components/SortableButton";
import { SettingsSectionControls } from "./SettingsSectionControls";

export const getSectionTitle = (sectionId: string): string => {
  if (sectionId.startsWith("program_hero_")) return "이미지";
  if (sectionId.startsWith("program_info_card_section_")) return "아이콘 카드";
  if (sectionId.startsWith("program_description_")) return "설명 카드";
  if (sectionId.startsWith("program_button_group_")) return "버튼";
  if (sectionId === "program_cards") return "프로그램 일정";
  return sectionId;
};

interface RenderSectionProps {
  sectionId: string;
  index: number;
  sectionOrder: string[];
  collapsedSections: Record<string, boolean>;
  programCards: any[];
  heroSections: any[];
  infoCardSections: any[];
  descriptions: any[];
  buttonGroups: any[];
  toggleSection: (sectionId: string) => void;
  handleMoveSectionUp: (index: number) => void;
  handleMoveSectionDown: (index: number) => void;
  handleAddProgramCard: () => void;
  handleUpdateProgramCard: (index: number, updates: any) => void;
  handleDeleteProgramCard: (index: number) => void;
  handleDuplicateProgramCard: (index: number) => void;
  handleMoveUp: (index: number) => void;
  handleMoveDown: (index: number) => void;
  handleDragEndProgramCards: (event: any) => void;
  handleUpdateHeroSection: (id: string, data: any) => void;
  handleCopyHeroSection: (id: string) => void;
  handleDeleteHeroSection: (id: string) => void;
  handleUpdateDescription: (id: string, data: any) => void;
  handleCopyDescription: (id: string) => void;
  handleDeleteDescription: (id: string) => void;
  handleUpdateInfoCardSection: (id: string, data: any) => void;
  handleCopyInfoCardSection: (id: string) => void;
  handleDeleteInfoCardSection: (id: string) => void;
  handleDragEndInfoCardCards: (sectionId: string, event: any) => void;
  handleUpdateButtonGroup: (id: string, data: any) => void;
  handleCopyButtonGroup: (id: string) => void;
  handleDeleteButtonGroup: (id: string) => void;
  handleDragEndButtonGroup: (groupId: string, event: any) => void;
  handleRemoveProgramSchedule: () => void;
}

export const renderProgramSection = (props: RenderSectionProps) => {
  const {
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
    handleMoveSectionUp,
    handleMoveSectionDown,
    handleAddProgramCard,
    handleUpdateProgramCard,
    handleDeleteProgramCard,
    handleDuplicateProgramCard,
    handleMoveUp,
    handleMoveDown,
    handleDragEndProgramCards,
    handleUpdateHeroSection,
    handleCopyHeroSection,
    handleDeleteHeroSection,
    handleUpdateDescription,
    handleCopyDescription,
    handleDeleteDescription,
    handleUpdateInfoCardSection,
    handleCopyInfoCardSection,
    handleDeleteInfoCardSection,
    handleDragEndInfoCardCards,
    handleUpdateButtonGroup,
    handleCopyButtonGroup,
    handleDeleteButtonGroup,
    handleDragEndButtonGroup,
    handleRemoveProgramSchedule,
  } = props;

  const isCollapsed = collapsedSections[sectionId];
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Hero Section
  if (sectionId.startsWith("program_hero_")) {
    const hero = heroSections.find((h) => h.id === sectionId);
    if (!hero) return null;

    return (
      <div key={sectionId} className="space-y-4 p-4 border rounded-lg">
        <SettingsSectionControls
          title={getSectionTitle(sectionId)}
          index={index}
          sectionId={sectionId}
          sectionOrder={sectionOrder}
          isCollapsed={isCollapsed}
          onToggle={toggleSection}
          onMoveUp={handleMoveSectionUp}
          onMoveDown={handleMoveSectionDown}
          onCopy={() => handleCopyHeroSection(sectionId)}
          onDelete={() => handleDeleteHeroSection(sectionId)}
        />
        {!isCollapsed && (
          <div className="space-y-4">
            <div>
              <ImageUpload
                label="이미지"
                value={hero.imageUrl || ""}
                onChange={(value) => handleUpdateHeroSection(sectionId, { imageUrl: value })}
              />
            </div>
            <div>
              <Label>오버레이 투명도 (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={hero.overlayOpacity || "0"}
                onChange={(e) => handleUpdateHeroSection(sectionId, { overlayOpacity: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Description Section
  if (sectionId.startsWith("program_description_")) {
    const desc = descriptions.find((d) => d.id === sectionId);
    if (!desc) return null;

    return (
      <div key={sectionId} className="space-y-4 p-4 border rounded-lg">
        <SettingsSectionControls
          title={getSectionTitle(sectionId)}
          index={index}
          sectionId={sectionId}
          sectionOrder={sectionOrder}
          isCollapsed={isCollapsed}
          onToggle={toggleSection}
          onMoveUp={handleMoveSectionUp}
          onMoveDown={handleMoveSectionDown}
          onCopy={() => handleCopyDescription(sectionId)}
          onDelete={() => handleDeleteDescription(sectionId)}
        />
        {!isCollapsed && (
          <div className="space-y-4">
            <div>
              <Label>제목</Label>
              <Input
                value={desc.title || ""}
                onChange={(e) => handleUpdateDescription(sectionId, { title: e.target.value })}
              />
            </div>
            <div>
              <Label>내용</Label>
              <Textarea
                value={desc.content || ""}
                onChange={(e) => handleUpdateDescription(sectionId, { content: e.target.value })}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>제목 폰트 크기 (px)</Label>
                <Input
                  type="number"
                  value={desc.titleFontSize || "18"}
                  onChange={(e) => handleUpdateDescription(sectionId, { titleFontSize: e.target.value })}
                />
              </div>
              <div>
                <Label>내용 폰트 크기 (px)</Label>
                <Input
                  type="number"
                  value={desc.contentFontSize || "16"}
                  onChange={(e) => handleUpdateDescription(sectionId, { contentFontSize: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>배경색</Label>
              <ColorPicker
                value={desc.bgColor || "0 0% 100%"}
                onChange={(color) => handleUpdateDescription(sectionId, { bgColor: color })}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Info Card Section
  if (sectionId.startsWith("program_info_card_section_")) {
    const section = infoCardSections.find((s) => s.id === sectionId);
    if (!section) return null;

    return (
      <div key={sectionId} className="space-y-4 p-4 border rounded-lg">
        <SettingsSectionControls
          title={getSectionTitle(sectionId)}
          index={index}
          sectionId={sectionId}
          sectionOrder={sectionOrder}
          isCollapsed={isCollapsed}
          onToggle={toggleSection}
          onMoveUp={handleMoveSectionUp}
          onMoveDown={handleMoveSectionDown}
          onCopy={() => handleCopyInfoCardSection(sectionId)}
          onDelete={() => handleDeleteInfoCardSection(sectionId)}
        />
        {!isCollapsed && (
          <div className="space-y-4">
            <Button
              onClick={() => {
                const newCard = { icon: "Info", iconColor: "217 91% 60%", title: "", description: "" };
                handleUpdateInfoCardSection(sectionId, { cards: [...section.cards, newCard] });
              }}
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              카드 추가
            </Button>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleDragEndInfoCardCards(sectionId, event)}
            >
              <SortableContext
                items={section.cards.map((_, i) => i.toString())}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {section.cards.map((card: any, cardIndex: number) => (
                    <SortableInfoCard
                      key={cardIndex}
                      id={cardIndex.toString()}
                      card={card}
                      cardData={card}
                      onUpdate={(updates) => {
                        const newCards = [...section.cards];
                        newCards[cardIndex] = { ...newCards[cardIndex], ...updates };
                        handleUpdateInfoCardSection(sectionId, { cards: newCards });
                      }}
                      onDelete={() => {
                        const newCards = section.cards.filter((_: any, i: number) => i !== cardIndex);
                        handleUpdateInfoCardSection(sectionId, { cards: newCards });
                      }}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>
    );
  }

  // Button Group Section
  if (sectionId.startsWith("program_button_group_")) {
    const group = buttonGroups.find((g) => g.id === sectionId);
    if (!group) return null;

    return (
      <div key={sectionId} className="space-y-4 p-4 border rounded-lg">
        <SettingsSectionControls
          title={getSectionTitle(sectionId)}
          index={index}
          sectionId={sectionId}
          sectionOrder={sectionOrder}
          isCollapsed={isCollapsed}
          onToggle={toggleSection}
          onMoveUp={handleMoveSectionUp}
          onMoveDown={handleMoveSectionDown}
          onCopy={() => handleCopyButtonGroup(sectionId)}
          onDelete={() => handleDeleteButtonGroup(sectionId)}
        />
        {!isCollapsed && (
          <div className="space-y-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleDragEndButtonGroup(sectionId, event)}
            >
              <SortableContext
                items={group.buttons.map((_, i) => i.toString())}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {group.buttons.map((button: any, btnIndex: number) => (
                    <SortableButton
                      key={btnIndex}
                      id={btnIndex.toString()}
                      button={button}
                      buttonData={button}
                      onUpdate={(id, updates) => {
                        const newButtons = [...group.buttons];
                        newButtons[btnIndex] = { ...newButtons[btnIndex], ...updates };
                        handleUpdateButtonGroup(sectionId, { buttons: newButtons });
                      }}
                      onDelete={(id) => {
                        const newButtons = group.buttons.filter((_: any, i: number) => i !== btnIndex);
                        handleUpdateButtonGroup(sectionId, { buttons: newButtons });
                      }}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => {
                  const newButton = { text: "", link: "", linkType: "internal", bgColor: "217 91% 60%", textColor: "0 0% 100%" };
                  handleUpdateButtonGroup(sectionId, { buttons: [...group.buttons, newButton] });
                }}
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                버튼 추가
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Program Cards Section
  if (sectionId === "program_cards") {
    return (
      <div key={sectionId} className="space-y-4 p-4 border rounded-lg">
        <SettingsSectionControls
          title={getSectionTitle(sectionId)}
          index={index}
          sectionId={sectionId}
          sectionOrder={sectionOrder}
          isCollapsed={isCollapsed}
          onToggle={toggleSection}
          onMoveUp={handleMoveSectionUp}
          onMoveDown={handleMoveSectionDown}
          onDelete={handleRemoveProgramSchedule}
        />
        {!isCollapsed && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={handleAddProgramCard} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                프로그램 추가
              </Button>
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEndProgramCards}
            >
              <SortableContext
                items={programCards.map((_, i) => i.toString())}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {programCards.map((card, i) => (
                    <SortableProgramCard
                      key={i}
                      id={i.toString()}
                      card={card}
                      index={i}
                      total={programCards.length}
                      onUpdate={(data) => handleUpdateProgramCard(i, data)}
                      onDelete={() => handleDeleteProgramCard(i)}
                      onDuplicate={() => handleDuplicateProgramCard(i)}
                      onMoveUp={() => handleMoveUp(i)}
                      onMoveDown={() => handleMoveDown(i)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>
    );
  }

  return null;
};
