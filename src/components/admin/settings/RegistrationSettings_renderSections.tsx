import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import IconPicker from "@/components/IconPicker";
import ImageUpload from "@/components/ImageUpload";
import SortableInfoCard from "@/components/SortableInfoCard";
import { SettingsField } from "./SettingsField";
import { SettingsSectionControls } from "./SettingsSectionControls";
import { renderDescriptionSection, renderButtonGroupSection } from "./HomeSettings_renderSections";

export const getSectionTitle = (sectionId: string): string => {
  if (sectionId === "hero_image") return "이미지";
  if (sectionId === "registration_form_fields") return "폼 필드";
  if (sectionId.startsWith("description_")) return "설명 카드";
  if (sectionId.startsWith("info_card_")) return "아이콘 카드";
  if (sectionId.startsWith("button_group_")) return "버튼";
  return sectionId;
};

interface RenderRegistrationSectionProps {
  sectionId: string;
  index: number;
  sectionOrder: string[];
  collapsedSections: Record<string, boolean>;
  registrationSettings: any;
  registrationFields: any[];
  heroSections: any[];
  infoCardSections: any[];
  descriptions: any[];
  buttonGroups: any[];
  toggleSection: (sectionId: string) => void;
  handleMoveSectionUp: (index: number) => void;
  handleMoveSectionDown: (index: number) => void;
  handleRemoveHeroSection: () => void;
  handleRemoveFormFields: () => void;
  handleChange: (key: string, value: string) => void;
  handleFieldChange: (index: number, key: string, value: any) => void;
  addField: () => void;
  removeField: (index: number) => void;
  moveFieldUp: (index: number) => void;
  moveFieldDown: (index: number) => void;
  onDescriptionsChange: (descriptions: any[]) => void;
  onInfoCardSectionsChange: (sections: any[]) => void;
  onButtonGroupsChange: (groups: any[]) => void;
  onSectionOrderChange: (order: string[]) => void;
  onSaveSectionOrder: (order: string[]) => void;
  handleDragEndInfoCardCards: (sectionId: string, event: any) => void;
  handleDragEndButtonGroup: (groupId: string, event: any) => void;
}

export const renderRegistrationSection = (props: RenderRegistrationSectionProps) => {
  const {
    sectionId,
    index,
    sectionOrder,
    collapsedSections,
    registrationSettings,
    registrationFields,
    infoCardSections,
    descriptions,
    buttonGroups,
    toggleSection,
    handleMoveSectionUp,
    handleMoveSectionDown,
    handleRemoveHeroSection,
    handleRemoveFormFields,
    handleChange,
    handleFieldChange,
    addField,
    removeField,
    moveFieldUp,
    moveFieldDown,
    onDescriptionsChange,
    onInfoCardSectionsChange,
    onButtonGroupsChange,
    onSectionOrderChange,
    onSaveSectionOrder,
    handleDragEndInfoCardCards,
    handleDragEndButtonGroup,
  } = props;

  const isCollapsed = collapsedSections[sectionId];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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
  }) => (
    <SettingsSectionControls
      title={title}
      index={index}
      sectionId={sectionId}
      sectionOrder={sectionOrder}
      isCollapsed={isCollapsed}
      onToggle={toggleSection}
      onMoveUp={handleMoveSectionUp}
      onMoveDown={handleMoveSectionDown}
      onCopy={onCopy}
      onDelete={onDelete}
    />
  );

  // Hero Image Section
  if (sectionId === "hero_image") {
    return (
      <div key={sectionId} className="space-y-4">
        <SectionControls
          title="이미지"
          index={index}
          sectionId={sectionId}
          onDelete={handleRemoveHeroSection}
        />
        {!isCollapsed && (
          <div className="space-y-4">
            <ImageUpload
              value={registrationSettings.registration_hero_image || ""}
              onChange={(url) => handleChange("registration_hero_image", url)}
              label="이미지"
            />
            <SettingsField label="오버레이 투명도 (0-1)" htmlFor="registration_hero_overlay_opacity">
              <Input
                id="registration_hero_overlay_opacity"
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={registrationSettings.registration_hero_overlay_opacity || "0"}
                onChange={(e) => handleChange("registration_hero_overlay_opacity", e.target.value)}
              />
            </SettingsField>
          </div>
        )}
      </div>
    );
  }

  // Form Fields Section
  if (sectionId === "registration_form_fields") {
    return (
      <div key={sectionId} className="space-y-4">
        <SectionControls
          title="폼 필드"
          index={index}
          sectionId={sectionId}
          onDelete={handleRemoveFormFields}
        />
        {!isCollapsed && (
          <div className="space-y-4">
            <div className="flex justify-end mb-4">
              <Button onClick={addField} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                필드 추가
              </Button>
            </div>
            {registrationFields.map((field, fieldIndex) => (
              <div key={field.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">필드 {fieldIndex + 1}</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveFieldUp(fieldIndex)}
                      disabled={fieldIndex === 0}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveFieldDown(fieldIndex)}
                      disabled={fieldIndex === registrationFields.length - 1}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeField(fieldIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4">
                  <SettingsField label="레이블" htmlFor={`field_${field.id}_label`}>
                    <Input
                      id={`field_${field.id}_label`}
                      value={field.label}
                      onChange={(e) => handleFieldChange(fieldIndex, "label", e.target.value)}
                    />
                  </SettingsField>

                  <SettingsField label="플레이스홀더" htmlFor={`field_${field.id}_placeholder`}>
                    <Input
                      id={`field_${field.id}_placeholder`}
                      value={field.placeholder}
                      onChange={(e) => handleFieldChange(fieldIndex, "placeholder", e.target.value)}
                    />
                  </SettingsField>

                  <SettingsField label="필드 타입" htmlFor={`field_${field.id}_type`}>
                    <Select
                      value={field.type}
                      onValueChange={(value) => handleFieldChange(fieldIndex, "type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">텍스트</SelectItem>
                        <SelectItem value="email">이메일</SelectItem>
                        <SelectItem value="tel">전화번호</SelectItem>
                        <SelectItem value="textarea">긴 텍스트</SelectItem>
                        <SelectItem value="select">선택</SelectItem>
                        <SelectItem value="checkbox">체크박스</SelectItem>
                      </SelectContent>
                    </Select>
                  </SettingsField>

                  {field.type === "select" && (
                    <SettingsField label="선택 옵션 (쉼표로 구분)" htmlFor={`field_${field.id}_options`}>
                      <Input
                        id={`field_${field.id}_options`}
                        value={field.options?.join(", ") || ""}
                        onChange={(e) =>
                          handleFieldChange(fieldIndex, "options", e.target.value.split(",").map((s) => s.trim()))
                        }
                      />
                    </SettingsField>
                  )}

                  <SettingsField label="아이콘" htmlFor={`field_${field.id}_icon`}>
                    <IconPicker
                      value={field.icon || "FileText"}
                      onValueChange={(icon) => handleFieldChange(fieldIndex, "icon", icon)}
                    />
                  </SettingsField>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`field_${field.id}_required`}
                      checked={field.required}
                      onCheckedChange={(checked) => handleFieldChange(fieldIndex, "required", checked)}
                    />
                    <Label htmlFor={`field_${field.id}_required`}>필수 입력</Label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Description Section
  if (sectionId.startsWith("description_")) {
    const descIndex = parseInt(sectionId.replace("description_", ""));
    const description = descriptions[descIndex];
    if (!description) return null;

    return renderDescriptionSection({
      sectionId,
      index,
      settings: registrationSettings,
      descriptions,
      buttonGroups: [],
      sensors,
      SectionControls,
      onSettingChange: handleChange,
      onUpdateDescription: (id, data) => {
        const newDescriptions = [...descriptions];
        newDescriptions[descIndex] = { ...description, ...data };
        onDescriptionsChange(newDescriptions);
      },
      onDeleteDescription: () => {
        onDescriptionsChange(descriptions.filter((_, i) => i !== descIndex));
        const newOrder = sectionOrder.filter((id) => id !== sectionId);
        onSectionOrderChange(newOrder);
        onSaveSectionOrder(newOrder);
      },
      onCopyDescription: () => {
        const newDesc = { ...description };
        onDescriptionsChange([...descriptions, newDesc]);
        const newId = `description_${descriptions.length}`;
        const indexInOrder = sectionOrder.indexOf(sectionId);
        const newOrder = [...sectionOrder];
        newOrder.splice(indexInOrder + 1, 0, newId);
        onSectionOrderChange(newOrder);
        onSaveSectionOrder(newOrder);
      },
      onUpdateButtonGroup: () => {},
      onDeleteButtonGroup: () => {},
      onCopyButtonGroup: () => {},
      handleDragEndBottomButtons: () => {},
      getSectionTitle,
      isCollapsed,
    });
  }

  // Info Card Section
  if (sectionId.startsWith("info_card_")) {
    const sectionIndex = parseInt(sectionId.replace("info_card_", ""));
    const section = infoCardSections[sectionIndex];
    if (!section) return null;

    return (
      <div key={sectionId} className="space-y-4">
        <SectionControls
          title={getSectionTitle(sectionId)}
          index={index}
          sectionId={sectionId}
          onCopy={() => {
            const newSection = { ...section };
            onInfoCardSectionsChange([...infoCardSections, newSection]);
            const newId = `info_card_${infoCardSections.length}`;
            const indexInOrder = sectionOrder.indexOf(sectionId);
            const newOrder = [...sectionOrder];
            newOrder.splice(indexInOrder + 1, 0, newId);
            onSectionOrderChange(newOrder);
            onSaveSectionOrder(newOrder);
          }}
          onDelete={() => {
            onInfoCardSectionsChange(infoCardSections.filter((_, i) => i !== sectionIndex));
            const newOrder = sectionOrder.filter((id) => id !== sectionId);
            onSectionOrderChange(newOrder);
            onSaveSectionOrder(newOrder);
          }}
        />
        {!isCollapsed && (
          <div className="space-y-4">
            <div className="flex justify-end mb-4">
              <Button
                onClick={() => {
                  const newCards = [
                    ...(section.cards || []),
                    {
                      icon: "Calendar",
                      title: "제목",
                      content: "내용",
                      titleFontSize: 18,
                      contentFontSize: 14,
                      backgroundColor: "",
                      iconColor: "",
                    },
                  ];
                  const newSections = [...infoCardSections];
                  newSections[sectionIndex] = { ...section, cards: newCards };
                  onInfoCardSectionsChange(newSections);
                }}
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                카드 추가
              </Button>
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleDragEndInfoCardCards(sectionId, event)}
            >
              <SortableContext
                items={(section.cards || []).map((_, i) => i.toString())}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {(section.cards || []).map((card, cardIndex) => (
                    <SortableInfoCard
                      key={cardIndex}
                      id={cardIndex.toString()}
                      card={card}
                      cardData={card}
                      onUpdate={(data) => {
                        const newCards = [...section.cards];
                        newCards[cardIndex] = { ...card, ...data };
                        const newSections = [...infoCardSections];
                        newSections[sectionIndex] = { ...section, cards: newCards };
                        onInfoCardSectionsChange(newSections);
                      }}
                      onDelete={() => {
                        const newCards = section.cards.filter((_, i) => i !== cardIndex);
                        const newSections = [...infoCardSections];
                        newSections[sectionIndex] = { ...section, cards: newCards };
                        onInfoCardSectionsChange(newSections);
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
  if (sectionId.startsWith("button_group_")) {
    const groupIndex = parseInt(sectionId.replace("button_group_", ""));
    const buttonGroup = buttonGroups[groupIndex];
    if (!buttonGroup) return null;

    return renderButtonGroupSection({
      sectionId,
      index,
      settings: registrationSettings,
      descriptions: [],
      buttonGroups,
      sensors,
      SectionControls,
      onSettingChange: handleChange,
      onUpdateDescription: () => {},
      onDeleteDescription: () => {},
      onCopyDescription: () => {},
      onUpdateButtonGroup: (id, data) => {
        const newGroups = [...buttonGroups];
        newGroups[groupIndex] = { ...buttonGroup, ...data };
        onButtonGroupsChange(newGroups);
      },
      onDeleteButtonGroup: () => {
        onButtonGroupsChange(buttonGroups.filter((_, i) => i !== groupIndex));
        const newOrder = sectionOrder.filter((id) => id !== sectionId);
        onSectionOrderChange(newOrder);
        onSaveSectionOrder(newOrder);
      },
      onCopyButtonGroup: () => {
        const newGroup = { ...buttonGroup };
        onButtonGroupsChange([...buttonGroups, newGroup]);
        const newId = `button_group_${buttonGroups.length}`;
        const indexInOrder = sectionOrder.indexOf(sectionId);
        const newOrder = [...sectionOrder];
        newOrder.splice(indexInOrder + 1, 0, newId);
        onSectionOrderChange(newOrder);
        onSaveSectionOrder(newOrder);
      },
      handleDragEndBottomButtons: handleDragEndButtonGroup,
      getSectionTitle,
      isCollapsed,
    });
  }

  return null;
};
