import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

interface UseHomeSettingsHandlersProps {
  heroSections: any[];
  infoCardSections: any[];
  descriptions: any[];
  buttonGroups: any[];
  sectionOrder: string[];
  onHeroSectionsChange: (sections: any[]) => void;
  onInfoCardSectionsChange: (sections: any[]) => void;
  onDescriptionsChange: (descriptions: any[]) => void;
  onButtonGroupsChange: (groups: any[]) => void;
  onSectionOrderChange: (order: string[]) => void;
  onSaveSectionOrder: (order: string[]) => void;
}

export const useHomeSettingsHandlers = ({
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
}: UseHomeSettingsHandlersProps) => {
  // Hero Section Handlers
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

  // Info Card Section Handlers
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

  // Description Handlers
  const handleAddDescription = () => {
    const newId = `description_${Date.now()}`;
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

  // Button Group Handlers
  const handleAddButtonGroup = () => {
    const newId = `button_group_${Date.now()}`;
    const newGroup = {
      id: newId,
      enabled: "true",
      alignment: "center",
      buttons: [{ text: "새 버튼", link: "", linkType: "internal", size: "default", fontSize: "text-sm" }],
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

  // Section Order Handlers
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

  // Drag End Handlers
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

  // Utility Functions
  const getSectionTitle = (sectionId: string): string => {
    if (sectionId.startsWith("hero_")) return "이미지";
    if (sectionId.startsWith("info_card_section_") || sectionId.startsWith("infocard_section_")) return "아이콘 카드";
    if (sectionId.startsWith("description_")) return "설명 카드";
    if (sectionId.startsWith("button_group_")) return "버튼";
    return sectionId;
  };

  return {
    // Hero handlers
    handleAddHeroSection,
    handleUpdateHeroSection,
    handleDeleteHeroSection,
    handleCopyHeroSection,
    // Info card handlers
    handleAddInfoCardSection,
    handleUpdateInfoCardSection,
    handleDeleteInfoCardSection,
    handleCopyInfoCardSection,
    // Description handlers
    handleAddDescription,
    handleUpdateDescription,
    handleDeleteDescription,
    handleCopyDescription,
    // Button group handlers
    handleAddButtonGroup,
    handleUpdateButtonGroup,
    handleDeleteButtonGroup,
    handleCopyButtonGroup,
    // Section order handlers
    handleMoveSectionUp,
    handleMoveSectionDown,
    // Drag handlers
    handleDragEndInfoCardCards,
    handleDragEndButtonGroup,
    // Utilities
    getSectionTitle,
  };
};
