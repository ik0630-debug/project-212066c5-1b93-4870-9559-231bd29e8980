import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { ColorPicker } from "@/components/ColorPicker";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableProgramCard } from "@/components/SortableProgramCard";
import { ProgramSettings_renderHeroSection } from "./ProgramSettings_renderHeroSection";
import { ProgramSettings_renderSections } from "./ProgramSettings_renderSections";

interface ProgramSettingsProps {
  settings: any;
  programCards: any[];
  heroSections: any[];
  descriptions: any[];
  infoCardSections: any[];
  buttonGroups: any[];
  sectionOrder: string[];
  onSettingChange: (key: string, value: string) => void;
  onProgramCardsChange: (cards: any[]) => void;
  onHeroSectionsChange: (sections: any[]) => void;
  onDescriptionsChange: (descriptions: any[]) => void;
  onInfoCardSectionsChange: (sections: any[]) => void;
  onButtonGroupsChange: (groups: any[]) => void;
  onSectionOrderChange: (order: string[]) => void;
}

const ProgramSettingsNew = ({
  settings,
  programCards,
  heroSections,
  descriptions,
  infoCardSections,
  buttonGroups,
  sectionOrder,
  onSettingChange,
  onProgramCardsChange,
  onHeroSectionsChange,
  onDescriptionsChange,
  onInfoCardSectionsChange,
  onButtonGroupsChange,
  onSectionOrderChange,
}: ProgramSettingsProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Program Cards handlers
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

  // Section handlers
  const handleAddHeroSection = () => {
    const newId = `hero_${Date.now()}`;
    const newSection = {
      id: newId,
      enabled: "true",
      imageUrl: "",
      overlayOpacity: "0",
    };
    onHeroSectionsChange([...heroSections, newSection]);
    onSectionOrderChange([...sectionOrder, newId]);
  };

  const handleAddDescriptionSection = () => {
    const newId = `desc_${Date.now()}`;
    const newSection = {
      id: newId,
      enabled: "true",
      title: "",
      content: "",
      titleFontSize: "18",
      contentFontSize: "16",
      bgColor: "",
    };
    onDescriptionsChange([...descriptions, newSection]);
    onSectionOrderChange([...sectionOrder, newId]);
  };

  const handleAddInfoCardSection = () => {
    const newId = `info_cards_${Date.now()}`;
    const newSection = {
      id: newId,
      enabled: "true",
      title: "",
      cards: [],
    };
    onInfoCardSectionsChange([...infoCardSections, newSection]);
    onSectionOrderChange([...sectionOrder, newId]);
  };

  const handleAddButtonGroup = () => {
    const newId = `btn_group_${Date.now()}`;
    const newGroup = {
      id: newId,
      enabled: "true",
      title: "",
      alignment: "center",
      buttons: [],
    };
    onButtonGroupsChange([...buttonGroups, newGroup]);
    onSectionOrderChange([...sectionOrder, newId]);
  };

  const handleUpdateHeroSection = (id: string, updates: any) => {
    onHeroSectionsChange(
      heroSections.map((section) =>
        section.id === id ? { ...section, ...updates } : section
      )
    );
  };

  const handleDeleteHeroSection = (id: string) => {
    onHeroSectionsChange(heroSections.filter((s) => s.id !== id));
    onSectionOrderChange(sectionOrder.filter((sId) => sId !== id));
  };

  const handleUpdateDescription = (id: string, updates: any) => {
    onDescriptionsChange(
      descriptions.map((desc) =>
        desc.id === id ? { ...desc, ...updates } : desc
      )
    );
  };

  const handleDeleteDescription = (id: string) => {
    onDescriptionsChange(descriptions.filter((d) => d.id !== id));
    onSectionOrderChange(sectionOrder.filter((sId) => sId !== id));
  };

  const handleUpdateInfoCardSection = (id: string, updates: any) => {
    onInfoCardSectionsChange(
      infoCardSections.map((section) =>
        section.id === id ? { ...section, ...updates } : section
      )
    );
  };

  const handleDeleteInfoCardSection = (id: string) => {
    onInfoCardSectionsChange(infoCardSections.filter((s) => s.id !== id));
    onSectionOrderChange(sectionOrder.filter((sId) => sId !== id));
  };

  const handleUpdateButtonGroup = (id: string, updates: any) => {
    onButtonGroupsChange(
      buttonGroups.map((group) =>
        group.id === id ? { ...group, ...updates } : group
      )
    );
  };

  const handleDeleteButtonGroup = (id: string) => {
    onButtonGroupsChange(buttonGroups.filter((g) => g.id !== id));
    onSectionOrderChange(sectionOrder.filter((sId) => sId !== id));
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

      {/* Section Management */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">섹션 관리</h3>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleAddHeroSection} variant="outline" size="sm" className="h-8 text-xs">
            <Plus className="w-3 h-3 mr-1.5" />
            헤더 이미지
          </Button>
          <Button onClick={handleAddDescriptionSection} variant="outline" size="sm" className="h-8 text-xs">
            <Plus className="w-3 h-3 mr-1.5" />
            설명 섹션
          </Button>
          <Button onClick={handleAddInfoCardSection} variant="outline" size="sm" className="h-8 text-xs">
            <Plus className="w-3 h-3 mr-1.5" />
            정보 카드
          </Button>
          <Button onClick={handleAddButtonGroup} variant="outline" size="sm" className="h-8 text-xs">
            <Plus className="w-3 h-3 mr-1.5" />
            버튼 그룹
          </Button>
        </div>

        <div className="space-y-4">
          <ProgramSettings_renderHeroSection
            heroSections={heroSections}
            onUpdateHeroSection={handleUpdateHeroSection}
            onDeleteHeroSection={handleDeleteHeroSection}
          />
          <ProgramSettings_renderSections
            descriptions={descriptions}
            infoCardSections={infoCardSections}
            buttonGroups={buttonGroups}
            onUpdateDescription={handleUpdateDescription}
            onDeleteDescription={handleDeleteDescription}
            onUpdateInfoCardSection={handleUpdateInfoCardSection}
            onDeleteInfoCardSection={handleDeleteInfoCardSection}
            onUpdateButtonGroup={handleUpdateButtonGroup}
            onDeleteButtonGroup={handleDeleteButtonGroup}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">프로그램 일정 (선택사항)</h3>
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

export default ProgramSettingsNew;
