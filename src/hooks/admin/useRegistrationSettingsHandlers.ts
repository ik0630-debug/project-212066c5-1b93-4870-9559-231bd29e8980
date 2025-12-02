import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

interface RegistrationField {
  id: string;
  label: string;
  placeholder: string;
  type: string;
  required: boolean;
  icon?: string;
  options?: string[];
}

interface UseRegistrationSettingsHandlersProps {
  registrationFields: RegistrationField[];
  heroSections: any[];
  infoCardSections: any[];
  descriptions: any[];
  buttonGroups: any[];
  sectionOrder: string[];
  onRegistrationFieldsChange: (fields: RegistrationField[]) => void;
  onHeroSectionsChange: (sections: any[]) => void;
  onInfoCardSectionsChange: (sections: any[]) => void;
  onDescriptionsChange: (descriptions: any[]) => void;
  onButtonGroupsChange: (groups: any[]) => void;
  onSectionOrderChange: (order: string[]) => void;
  onSaveSectionOrder: (order: string[]) => void;
}

export const useRegistrationSettingsHandlers = ({
  registrationFields,
  heroSections,
  infoCardSections,
  descriptions,
  buttonGroups,
  sectionOrder,
  onRegistrationFieldsChange,
  onHeroSectionsChange,
  onInfoCardSectionsChange,
  onDescriptionsChange,
  onButtonGroupsChange,
  onSectionOrderChange,
  onSaveSectionOrder,
}: UseRegistrationSettingsHandlersProps) => {

  // Hero Section handlers
  const handleAddHeroSection = () => {
    if (sectionOrder.includes("hero_image")) return;
    const newOrder = ["hero_image", ...sectionOrder];
    onSectionOrderChange(newOrder);
    onSaveSectionOrder(newOrder);
  };

  const handleRemoveHeroSection = () => {
    const newOrder = sectionOrder.filter(id => id !== "hero_image");
    onSectionOrderChange(newOrder);
    onSaveSectionOrder(newOrder);
  };

  // Form Fields handlers
  const handleAddFormFields = () => {
    if (sectionOrder.includes("registration_form_fields")) return;
    const newOrder = [...sectionOrder, "registration_form_fields"];
    onSectionOrderChange(newOrder);
    onSaveSectionOrder(newOrder);
  };

  const handleRemoveFormFields = () => {
    const newOrder = sectionOrder.filter(id => id !== "registration_form_fields");
    onSectionOrderChange(newOrder);
    onSaveSectionOrder(newOrder);
  };

  const addField = () => {
    const newField: RegistrationField = {
      id: `field_${Date.now()}`,
      label: "새 필드",
      placeholder: "",
      type: "text",
      required: false,
      icon: "FileText",
    };
    onRegistrationFieldsChange([...registrationFields, newField]);
  };

  const removeField = (index: number) => {
    const newFields = registrationFields.filter((_, i) => i !== index);
    onRegistrationFieldsChange(newFields);
  };

  const moveFieldUp = (index: number) => {
    if (index > 0) {
      const newFields = [...registrationFields];
      [newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]];
      onRegistrationFieldsChange(newFields);
    }
  };

  const moveFieldDown = (index: number) => {
    if (index < registrationFields.length - 1) {
      const newFields = [...registrationFields];
      [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
      onRegistrationFieldsChange(newFields);
    }
  };

  const handleFieldChange = (index: number, key: keyof RegistrationField, value: any) => {
    const newFields = [...registrationFields];
    newFields[index] = { ...newFields[index], [key]: value };
    onRegistrationFieldsChange(newFields);
  };

  // Description handlers
  const handleAddDescription = () => {
    const newDescription = {
      title: "새 설명",
      content: "내용을 입력하세요",
      titleFontSize: 24,
      contentFontSize: 16,
      backgroundColor: "",
    };
    onDescriptionsChange([...descriptions, newDescription]);
    const descId = `description_${descriptions.length}`;
    const newOrder = [...sectionOrder, descId];
    onSectionOrderChange(newOrder);
    onSaveSectionOrder(newOrder);
  };

  // Info Card Section handlers
  const handleAddInfoCardSection = () => {
    const newSection = { 
      cards: [{ 
        icon: "Calendar", 
        title: "제목", 
        content: "내용", 
        titleFontSize: 18, 
        contentFontSize: 14, 
        backgroundColor: "", 
        iconColor: "" 
      }] 
    };
    onInfoCardSectionsChange([...infoCardSections, newSection]);
    const sectionId = `info_card_${infoCardSections.length}`;
    const newOrder = [...sectionOrder, sectionId];
    onSectionOrderChange(newOrder);
    onSaveSectionOrder(newOrder);
  };

  // Button Group handlers
  const handleAddButtonGroup = () => {
    const newGroup = { 
      buttons: [{ 
        text: "버튼", 
        link: "", 
        variant: "default", 
        size: "default", 
        fontSize: 16, 
        bgColor: "", 
        textColor: "" 
      }] 
    };
    onButtonGroupsChange([...buttonGroups, newGroup]);
    const groupId = `button_group_${buttonGroups.length}`;
    const newOrder = [...sectionOrder, groupId];
    onSectionOrderChange(newOrder);
    onSaveSectionOrder(newOrder);
  };

  // Drag handlers
  const handleDragEndInfoCardCards = (sectionId: string, event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const sectionIndex = parseInt(sectionId.replace("info_card_", ""));
      const section = infoCardSections[sectionIndex];
      if (section) {
        const oldIndex = parseInt(active.id as string);
        const newIndex = parseInt(over.id as string);
        const newCards = arrayMove(section.cards, oldIndex, newIndex);
        const newSections = [...infoCardSections];
        newSections[sectionIndex] = { ...section, cards: newCards };
        onInfoCardSectionsChange(newSections);
      }
    }
  };

  const handleDragEndButtonGroup = (groupId: string, event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const groupIndex = parseInt(groupId.replace("button_group_", ""));
      const group = buttonGroups[groupIndex];
      if (group) {
        const oldIndex = parseInt(active.id as string);
        const newIndex = parseInt(over.id as string);
        const newButtons = arrayMove(group.buttons, oldIndex, newIndex);
        const newGroups = [...buttonGroups];
        newGroups[groupIndex] = { ...group, buttons: newButtons };
        onButtonGroupsChange(newGroups);
      }
    }
  };

  // Section movement handlers
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
    handleAddHeroSection,
    handleRemoveHeroSection,
    handleAddFormFields,
    handleRemoveFormFields,
    addField,
    removeField,
    moveFieldUp,
    moveFieldDown,
    handleFieldChange,
    handleAddDescription,
    handleAddInfoCardSection,
    handleAddButtonGroup,
    handleDragEndInfoCardCards,
    handleDragEndButtonGroup,
    handleMoveSectionUp,
    handleMoveSectionDown,
  };
};
