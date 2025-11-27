import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Copy, ArrowUp, ArrowDown, Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { ColorPicker } from "@/components/ColorPicker";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableInfoCard from "@/components/SortableInfoCard";
import SortableBottomButton from "@/components/SortableBottomButton";
import { renderDescriptionSection, renderButtonGroupSection } from "./HomeSettings_renderSections";
import { renderHeroSection } from "./HomeSettings_renderHeroSection";
import { renderInfoCardSection } from "./HomeSettings_renderInfoCardSection";

interface HomeSettingsProps {
  settings: any;
  heroSections: any[];
  infoCardSections: any[];
  descriptions: any[];
  buttonGroups: any[];
  sectionOrder: string[];
  onSettingChange: (key: string, value: string) => void;
  onHeroSectionsChange: (sections: any[]) => void;
  onInfoCardSectionsChange: (sections: any[]) => void;
  onDescriptionsChange: (descriptions: any[]) => void;
  onButtonGroupsChange: (groups: any[]) => void;
  onSectionOrderChange: (order: string[]) => void;
  onSaveSectionOrder: (order: string[]) => void;
  onSave: () => void;
}

const HomeSettings = ({
  settings,
  heroSections,
  infoCardSections,
  descriptions,
  buttonGroups,
  sectionOrder,
  onSettingChange,
  onHeroSectionsChange,
  onInfoCardSectionsChange,
  onDescriptionsChange,
  onButtonGroupsChange,
  onSectionOrderChange,
  onSaveSectionOrder,
  onSave,
}: HomeSettingsProps) => {
  const [previewKey, setPreviewKey] = useState(0);
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

  const refreshPreview = () => {
    setPreviewKey(prev => prev + 1);
  };

  const handleAddHeroSection = () => {
    const newId = `hero_${Date.now()}`;
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
      const newId = `hero_${Date.now()}`;
      const newHero = { ...heroToCopy, id: newId, order: heroSections.length };
      onHeroSectionsChange([...heroSections, newHero]);
      
      const indexInOrder = sectionOrder.indexOf(id);
      const newOrder = [...sectionOrder];
      newOrder.splice(indexInOrder + 1, 0, newId);
      onSectionOrderChange(newOrder);
      onSaveSectionOrder(newOrder);
    }
  };

  const handleAddInfoCardSection = () => {
    const newId = `info_card_section_${Date.now()}`;
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
      const newId = `info_card_section_${Date.now()}`;
      const newSection = { ...sectionToCopy, id: newId, order: infoCardSections.length };
      onInfoCardSectionsChange([...infoCardSections, newSection]);
      
      const indexInOrder = sectionOrder.indexOf(id);
      const newOrder = [...sectionOrder];
      newOrder.splice(indexInOrder + 1, 0, newId);
      onSectionOrderChange(newOrder);
      onSaveSectionOrder(newOrder);
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
      contentFontSize: "14",
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
    if (sectionId.startsWith("hero_")) return "헤더 이미지";
    if (sectionId.startsWith("info_card_section_") || sectionId.startsWith("infocard_section_")) return "정보 섹션";
    if (sectionId.startsWith("description_")) return "설명 섹션";
    if (sectionId.startsWith("button_group_")) return "버튼";
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

  const renderSection = (sectionId: string, index: number) => {
    const isCollapsed = collapsedSections[sectionId];
    
    if (sectionId.startsWith("hero_")) {
      return renderHeroSection({
        sectionId,
        index,
        heroSections,
        SectionControls,
        onUpdateHeroSection: handleUpdateHeroSection,
        onCopyHeroSection: handleCopyHeroSection,
        onDeleteHeroSection: handleDeleteHeroSection,
        getSectionTitle,
        isCollapsed,
      } as any);
    }

    if (sectionId.startsWith("infocard_section_") || sectionId.startsWith("info_card_section_")) {
      return renderInfoCardSection({
        sectionId,
        index,
        infoCardSections,
        sensors,
        SectionControls,
        onUpdateInfoCardSection: handleUpdateInfoCardSection,
        onCopyInfoCardSection: handleCopyInfoCardSection,
        onDeleteInfoCardSection: handleDeleteInfoCardSection,
        handleDragEndInfoCardCards,
        getSectionTitle,
        isCollapsed,
      } as any);
    }

    if (sectionId.startsWith("description_")) {
      return renderDescriptionSection({
        sectionId,
        index,
        settings,
        descriptions,
        buttonGroups: [],
        sensors,
        SectionControls,
        onSettingChange,
        onUpdateDescription: handleUpdateDescription,
        onDeleteDescription: handleDeleteDescription,
        onCopyDescription: handleCopyDescription,
        onUpdateButtonGroup: () => {},
        onDeleteButtonGroup: () => {},
        onCopyButtonGroup: () => {},
        handleDragEndBottomButtons: () => {},
        getSectionTitle,
        isCollapsed,
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
        isCollapsed,
      });
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-6">
        <Button 
          onClick={handleAddHeroSection} 
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          헤더 이미지
        </Button>
        <Button 
          onClick={handleAddDescription} 
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          설명 섹션
        </Button>
        <Button 
          onClick={handleAddInfoCardSection} 
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          정보 카드
        </Button>
        <Button 
          onClick={handleAddButtonGroup} 
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          버튼 그룹
        </Button>
      </div>

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
    </div>
  );
};

export default HomeSettings;
