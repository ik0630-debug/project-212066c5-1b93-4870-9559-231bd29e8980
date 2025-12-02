import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Copy, ArrowUp, ArrowDown, Trash2, Plus } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ColorPicker } from "@/components/ColorPicker";
import { SortableProgramCard } from "@/components/SortableProgramCard";
import ImageUpload from "@/components/ImageUpload";
import SortableInfoCard from "@/components/SortableInfoCard";
import SortableBottomButton from "@/components/SortableBottomButton";
import { Textarea } from "@/components/ui/textarea";

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
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleAddProgramCard = () => {
    onProgramCardsChange([...programCards, { time: "", title: "", description: "", icon: "Clock" }]);
  };

  const handleDeleteProgramCard = (index: number) => {
    onProgramCardsChange(programCards.filter((_, i) => i !== index));
  };

  const handleDuplicateProgramCard = (index: number) => {
    const cardToDuplicate = { ...programCards[index] };
    const newCards = [...programCards];
    newCards.splice(index + 1, 0, cardToDuplicate);
    onProgramCardsChange(newCards);
  };

  const handleUpdateProgramCard = (index: number, updates: any) => {
    const newCards = [...programCards];
    newCards[index] = { ...newCards[index], ...updates };
    onProgramCardsChange(newCards);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newCards = arrayMove(programCards, index, index - 1);
    onProgramCardsChange(newCards);
  };

  const handleMoveDown = (index: number) => {
    if (index === programCards.length - 1) return;
    const newCards = arrayMove(programCards, index, index + 1);
    onProgramCardsChange(newCards);
  };

  const handleDragEndProgramCards = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = programCards.findIndex((_, i) => i.toString() === active.id);
      const newIndex = programCards.findIndex((_, i) => i.toString() === over.id);
      onProgramCardsChange(arrayMove(programCards, oldIndex, newIndex));
    }
  };

  // Hero Section handlers
  const handleAddHeroSection = () => {
    const newId = `program_hero_${Date.now()}`;
    const newHero = {
      id: newId,
      enabled: "true",
      imageUrl: "",
      overlayOpacity: "0",
      order: heroSections.length,
    };
    onHeroSectionsChange([...heroSections, newHero]);
    onSectionOrderChange([...sectionOrder, newId]);
    onSaveSectionOrder([...sectionOrder, newId]);
  };

  const handleUpdateHeroSection = (id: string, data: any) => {
    const newHeroSections = heroSections.map((hero) =>
      hero.id === id ? { ...hero, ...data } : hero
    );
    onHeroSectionsChange(newHeroSections);
  };

  const handleDeleteHeroSection = (id: string) => {
    onHeroSectionsChange(heroSections.filter((hero) => hero.id !== id));
    const newOrder = sectionOrder.filter((sectionId) => sectionId !== id);
    onSectionOrderChange(newOrder);
    onSaveSectionOrder(newOrder);
  };

  const handleCopyHeroSection = (id: string) => {
    const heroToCopy = heroSections.find((hero) => hero.id === id);
    if (heroToCopy) {
      const newId = `program_hero_${Date.now()}`;
      const newHero = { ...heroToCopy, id: newId, order: heroSections.length };
      onHeroSectionsChange([...heroSections, newHero]);
      
      const indexInOrder = sectionOrder.indexOf(id);
      const newOrder = [...sectionOrder];
      newOrder.splice(indexInOrder + 1, 0, newId);
      onSectionOrderChange(newOrder);
      onSaveSectionOrder(newOrder);
    }
  };

  // Description handlers
  const handleAddDescription = () => {
    const newId = `program_description_${Date.now()}`;
    const newDesc = {
      id: newId,
      enabled: "true",
      title: "",
      content: "",
      titleFontSize: "18",
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
      const newId = `program_description_${Date.now()}`;
      const newDesc = { ...descToCopy, id: newId, order: descriptions.length };
      onDescriptionsChange([...descriptions, newDesc]);
      
      const indexInOrder = sectionOrder.indexOf(id);
      const newOrder = [...sectionOrder];
      newOrder.splice(indexInOrder + 1, 0, newId);
      onSectionOrderChange(newOrder);
      onSaveSectionOrder(newOrder);
    }
  };

  // Info Card Section handlers
  const handleAddInfoCardSection = () => {
    const newId = `program_info_card_section_${Date.now()}`;
    const newSection = {
      id: newId,
      enabled: "true",
      cards: [],
      order: infoCardSections.length,
    };
    onInfoCardSectionsChange([...infoCardSections, newSection]);
    onSectionOrderChange([...sectionOrder, newId]);
    onSaveSectionOrder([...sectionOrder, newId]);
  };

  const handleUpdateInfoCardSection = (id: string, data: any) => {
    const newSections = infoCardSections.map((section) =>
      section.id === id ? { ...section, ...data } : section
    );
    onInfoCardSectionsChange(newSections);
  };

  const handleDeleteInfoCardSection = (id: string) => {
    onInfoCardSectionsChange(infoCardSections.filter((section) => section.id !== id));
    const newOrder = sectionOrder.filter((sectionId) => sectionId !== id);
    onSectionOrderChange(newOrder);
    onSaveSectionOrder(newOrder);
  };

  const handleCopyInfoCardSection = (id: string) => {
    const sectionToCopy = infoCardSections.find((section) => section.id === id);
    if (sectionToCopy) {
      const newId = `program_info_card_section_${Date.now()}`;
      const newSection = { ...sectionToCopy, id: newId, order: infoCardSections.length };
      onInfoCardSectionsChange([...infoCardSections, newSection]);
      
      const indexInOrder = sectionOrder.indexOf(id);
      const newOrder = [...sectionOrder];
      newOrder.splice(indexInOrder + 1, 0, newId);
      onSectionOrderChange(newOrder);
      onSaveSectionOrder(newOrder);
    }
  };

  // Button Group handlers
  const handleAddButtonGroup = () => {
    const newId = `program_button_group_${Date.now()}`;
    const newGroup = {
      id: newId,
      enabled: "true",
      alignment: "center",
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
      const newId = `program_button_group_${Date.now()}`;
      const newGroup = { ...groupToCopy, id: newId, order: buttonGroups.length };
      onButtonGroupsChange([...buttonGroups, newGroup]);
      
      const indexInOrder = sectionOrder.indexOf(id);
      const newOrder = [...sectionOrder];
      newOrder.splice(indexInOrder + 1, 0, newId);
      onSectionOrderChange(newOrder);
      onSaveSectionOrder(newOrder);
    }
  };

  const handleDragEndInfoCardCards = (sectionId: string, event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const section = infoCardSections.find((s) => s.id === sectionId);
      if (section) {
        const oldIndex = parseInt(active.id as string);
        const newIndex = parseInt(over.id as string);
        const newCards = arrayMove(section.cards, oldIndex, newIndex);
        handleUpdateInfoCardSection(sectionId, { cards: newCards });
      }
    }
  };

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
    if (sectionId.startsWith("program_hero_")) return "헤더 이미지";
    if (sectionId.startsWith("program_info_card_section_")) return "정보 섹션";
    if (sectionId.startsWith("program_description_")) return "설명 섹션";
    if (sectionId.startsWith("program_button_group_")) return "버튼";
    return sectionId;
  };

  const SectionControls = ({ 
    title, 
    index, 
    sectionId, 
    onCopy, 
    onDelete 
  }: { 
    title: string; 
    index: number; 
    sectionId: string;
    onCopy?: () => void; 
    onDelete?: () => void;
  }) => {
    const isCollapsed = collapsedSections[sectionId];
    
    return (
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => toggleSection(sectionId)}
            className="hover:bg-secondary p-1 h-auto"
          >
            <span className="text-xl">{isCollapsed ? '〉' : '∨'}</span>
          </Button>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
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
  };

  const renderSection = (sectionId: string, index: number) => {
    const isCollapsed = collapsedSections[sectionId];
    
    // Hero Section
    if (sectionId.startsWith("program_hero_")) {
      const hero = heroSections.find((h) => h.id === sectionId);
      if (!hero) return null;

      return (
        <div key={sectionId} className="space-y-4 p-4 border rounded-lg">
          <SectionControls
            title={getSectionTitle(sectionId)}
            index={index}
            sectionId={sectionId}
            onCopy={() => handleCopyHeroSection(sectionId)}
            onDelete={() => handleDeleteHeroSection(sectionId)}
          />
          {!isCollapsed && (
            <div className="space-y-4">
              <div>
                <ImageUpload
                  label="배경 이미지"
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
          <SectionControls
            title={getSectionTitle(sectionId)}
            index={index}
            sectionId={sectionId}
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
          <SectionControls
            title={getSectionTitle(sectionId)}
            index={index}
            sectionId={sectionId}
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
          <SectionControls
            title={getSectionTitle(sectionId)}
            index={index}
            sectionId={sectionId}
            onCopy={() => handleCopyButtonGroup(sectionId)}
            onDelete={() => handleDeleteButtonGroup(sectionId)}
          />
          {!isCollapsed && (
            <div className="space-y-4">
              <div>
                <Label>정렬</Label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={group.alignment || "center"}
                  onChange={(e) => handleUpdateButtonGroup(sectionId, { alignment: e.target.value })}
                >
                  <option value="left">왼쪽</option>
                  <option value="center">중앙</option>
                  <option value="right">오른쪽</option>
                </select>
              </div>
              <Button
                onClick={() => {
                  const newButton = { text: "", link: "", bgColor: "217 91% 60%", textColor: "0 0% 100%" };
                  handleUpdateButtonGroup(sectionId, { buttons: [...group.buttons, newButton] });
                }}
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                버튼 추가
              </Button>
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
                      <SortableBottomButton
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
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-8">
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

      {/* Section Add Buttons */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Button 
          onClick={handleAddHeroSection} 
          variant="outline"
          size="sm"
          className="h-8 text-xs"
        >
          <Plus className="w-3 h-3 mr-1.5" />
          헤더 이미지
        </Button>
        <Button 
          onClick={handleAddDescription} 
          variant="outline"
          size="sm"
          className="h-8 text-xs"
        >
          <Plus className="w-3 h-3 mr-1.5" />
          설명 섹션
        </Button>
        <Button 
          onClick={handleAddInfoCardSection} 
          variant="outline"
          size="sm"
          className="h-8 text-xs"
        >
          <Plus className="w-3 h-3 mr-1.5" />
          정보 카드
        </Button>
        <Button 
          onClick={handleAddButtonGroup} 
          variant="outline"
          size="sm"
          className="h-8 text-xs"
        >
          <Plus className="w-3 h-3 mr-1.5" />
          버튼 그룹
        </Button>
      </div>

      {/* Render Sections */}
      {sectionOrder.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>섹션이 없습니다. 위 버튼을 클릭하여 섹션을 추가하세요.</p>
        </div>
      ) : (
        sectionOrder.map((sectionId, index) => (
          <div key={sectionId} className="mb-8">
            {renderSection(sectionId, index)}
          </div>
        ))
      )}

      <Separator />

      {/* Program Cards Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">프로그램 일정</h3>
          <Button onClick={handleAddProgramCard} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            일정 추가
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
                  onUpdate={(updates) => handleUpdateProgramCard(i, updates)}
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
    </div>
  );
};

export default ProgramSettings;
