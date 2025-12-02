import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

interface UseProgramSettingsHandlersProps {
  programCards: any[];
  heroSections: any[];
  infoCardSections: any[];
  descriptions: any[];
  buttonGroups: any[];
  sectionOrder: string[];
  onProgramCardsChange: (cards: any[]) => void;
  onHeroSectionsChange: (sections: any[]) => void;
  onInfoCardSectionsChange: (sections: any[]) => void;
  onDescriptionsChange: (descriptions: any[]) => void;
  onButtonGroupsChange: (groups: any[]) => void;
  onSectionOrderChange: (order: string[]) => void;
  onSaveSectionOrder: (order: string[]) => void;
}

export const useProgramSettingsHandlers = ({
  programCards,
  heroSections,
  infoCardSections,
  descriptions,
  buttonGroups,
  sectionOrder,
  onProgramCardsChange,
  onHeroSectionsChange,
  onInfoCardSectionsChange,
  onDescriptionsChange,
  onButtonGroupsChange,
  onSectionOrderChange,
  onSaveSectionOrder,
}: UseProgramSettingsHandlersProps) => {
  
  // Program Card handlers
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

  const handleAddProgramSchedule = () => {
    if (!sectionOrder.includes("program_cards")) {
      const newOrder = [...sectionOrder, "program_cards"];
      onSectionOrderChange(newOrder);
      onSaveSectionOrder(newOrder);
    }
  };

  const handleRemoveProgramSchedule = () => {
    const newOrder = sectionOrder.filter((id) => id !== "program_cards");
    onSectionOrderChange(newOrder);
    onSaveSectionOrder(newOrder);
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

  return {
    handleAddProgramCard,
    handleDeleteProgramCard,
    handleDuplicateProgramCard,
    handleUpdateProgramCard,
    handleMoveUp,
    handleMoveDown,
    handleDragEndProgramCards,
    handleAddHeroSection,
    handleUpdateHeroSection,
    handleDeleteHeroSection,
    handleCopyHeroSection,
    handleAddDescription,
    handleUpdateDescription,
    handleDeleteDescription,
    handleCopyDescription,
    handleAddInfoCardSection,
    handleUpdateInfoCardSection,
    handleDeleteInfoCardSection,
    handleCopyInfoCardSection,
    handleAddButtonGroup,
    handleUpdateButtonGroup,
    handleDeleteButtonGroup,
    handleCopyButtonGroup,
    handleDragEndInfoCardCards,
    handleDragEndButtonGroup,
    handleAddProgramSchedule,
    handleRemoveProgramSchedule,
    handleMoveSectionUp,
    handleMoveSectionDown,
  };
};
