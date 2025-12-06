import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { renderDescriptionSection, renderButtonGroupSection } from "./HomeSettings_renderSections";
import { renderHeroSection } from "./HomeSettings_renderHeroSection";
import { renderInfoCardSection } from "./HomeSettings_renderInfoCardSection";
import { useHomeSettingsHandlers } from "@/hooks/admin/useHomeSettingsHandlers";
import { SettingsSectionControls } from "./SettingsSectionControls";

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
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handlers = useHomeSettingsHandlers({
    heroSections,
    infoCardSections,
    descriptions,
    buttonGroups,
    sectionOrder,
    onHeroSectionsChange,
    onInfoCardSectionsChange,
    onDescriptionsChange,
    onButtonGroupsChange,
    onSectionOrderChange,
    onSaveSectionOrder,
  });

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
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
      <SettingsSectionControls
        title={title}
        index={index}
        sectionId={sectionId}
        sectionOrder={sectionOrder}
        isCollapsed={isCollapsed}
        onToggle={toggleSection}
        onMoveUp={handlers.handleMoveSectionUp}
        onMoveDown={handlers.handleMoveSectionDown}
        onCopy={onCopy}
        onDelete={onDelete}
      />
    );
  };

  const renderSection = (sectionId: string, index: number) => {
    const isCollapsed = collapsedSections[sectionId];
    
    if (sectionId.startsWith("hero_")) {
      return renderHeroSection({
        sectionId,
        index,
        heroSections,
        SectionControls,
        onUpdateHeroSection: handlers.handleUpdateHeroSection,
        onCopyHeroSection: handlers.handleCopyHeroSection,
        onDeleteHeroSection: handlers.handleDeleteHeroSection,
        getSectionTitle: handlers.getSectionTitle,
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
        onUpdateInfoCardSection: handlers.handleUpdateInfoCardSection,
        onCopyInfoCardSection: handlers.handleCopyInfoCardSection,
        onDeleteInfoCardSection: handlers.handleDeleteInfoCardSection,
        handleDragEndInfoCardCards: handlers.handleDragEndInfoCardCards,
        getSectionTitle: handlers.getSectionTitle,
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
        onUpdateDescription: handlers.handleUpdateDescription,
        onDeleteDescription: handlers.handleDeleteDescription,
        onCopyDescription: handlers.handleCopyDescription,
        onUpdateButtonGroup: () => {},
        onDeleteButtonGroup: () => {},
        onCopyButtonGroup: () => {},
        handleDragEndBottomButtons: () => {},
        getSectionTitle: handlers.getSectionTitle,
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
        onUpdateDescription: handlers.handleUpdateDescription,
        onDeleteDescription: handlers.handleDeleteDescription,
        onCopyDescription: handlers.handleCopyDescription,
        onUpdateButtonGroup: handlers.handleUpdateButtonGroup,
        onDeleteButtonGroup: handlers.handleDeleteButtonGroup,
        onCopyButtonGroup: handlers.handleCopyButtonGroup,
        handleDragEndBottomButtons: handlers.handleDragEndButtonGroup,
        getSectionTitle: handlers.getSectionTitle,
        isCollapsed,
      });
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-6 flex-wrap">
        <Button 
          onClick={handlers.handleAddHeroSection} 
          variant="outline"
          size="sm"
          className="h-8 text-xs border-primary text-primary hover:bg-primary/10"
        >
          <Plus className="w-3 h-3 mr-1.5" />
          이미지
        </Button>
        <Button 
          onClick={handlers.handleAddDescription} 
          variant="outline"
          size="sm"
          className="h-8 text-xs border-primary text-primary hover:bg-primary/10"
        >
          <Plus className="w-3 h-3 mr-1.5" />
          설명 카드
        </Button>
        <Button 
          onClick={handlers.handleAddInfoCardSection} 
          variant="outline"
          size="sm"
          className="h-8 text-xs border-primary text-primary hover:bg-primary/10"
        >
          <Plus className="w-3 h-3 mr-1.5" />
          아이콘 카드
        </Button>
        <Button 
          onClick={handlers.handleAddButtonGroup} 
          variant="outline"
          size="sm"
          className="h-8 text-xs border-primary text-primary hover:bg-primary/10"
        >
          <Plus className="w-3 h-3 mr-1.5" />
          버튼
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
