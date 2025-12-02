import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, ArrowUp, ArrowDown, ChevronUp, ChevronDown, Copy } from "lucide-react";
import IconPicker from "@/components/IconPicker";
import ImageUpload from "@/components/ImageUpload";
import { ColorPicker } from "@/components/ColorPicker";
import SortableInfoCard from "@/components/SortableInfoCard";
import SortableBottomButton from "@/components/SortableBottomButton";
import { SettingsField } from "./SettingsField";
import { SettingsSection } from "./SettingsSection";
import { SettingsToggle } from "./SettingsToggle";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { renderDescriptionSection, renderButtonGroupSection } from "./HomeSettings_renderSections";

interface RegistrationField {
  id: string;
  label: string;
  placeholder: string;
  type: string;
  required: boolean;
  icon?: string;
  options?: string[];
}

interface RegistrationSettingsProps {
  registrationSettings: any;
  registrationFields: RegistrationField[];
  heroSections: any[];
  infoCardSections: any[];
  descriptions: any[];
  buttonGroups: any[];
  sectionOrder: string[];
  onRegistrationSettingsChange: (settings: any) => void;
  onRegistrationFieldsChange: (fields: RegistrationField[]) => void;
  onHeroSectionsChange: (sections: any[]) => void;
  onInfoCardSectionsChange: (sections: any[]) => void;
  onDescriptionsChange: (descriptions: any[]) => void;
  onButtonGroupsChange: (groups: any[]) => void;
  onSectionOrderChange: (order: string[]) => void;
  onSaveSectionOrder: (order: string[]) => void;
}

const RegistrationSettings = ({
  registrationSettings,
  registrationFields,
  heroSections,
  infoCardSections,
  descriptions,
  buttonGroups,
  sectionOrder,
  onRegistrationSettingsChange,
  onRegistrationFieldsChange,
  onHeroSectionsChange,
  onInfoCardSectionsChange,
  onDescriptionsChange,
  onButtonGroupsChange,
  onSectionOrderChange,
  onSaveSectionOrder,
}: RegistrationSettingsProps) => {
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

  const handleAddInfoCardSection = () => {
    const newSection = { cards: [{ icon: "Calendar", title: "제목", content: "내용", titleFontSize: 18, contentFontSize: 14, backgroundColor: "", iconColor: "" }] };
    onInfoCardSectionsChange([...infoCardSections, newSection]);
    const sectionId = `info_card_${infoCardSections.length}`;
    const newOrder = [...sectionOrder, sectionId];
    onSectionOrderChange(newOrder);
    onSaveSectionOrder(newOrder);
  };

  const handleAddButtonGroup = () => {
    const newGroup = { buttons: [{ text: "버튼", link: "", variant: "default", size: "default", fontSize: 16, bgColor: "", textColor: "" }] };
    onButtonGroupsChange([...buttonGroups, newGroup]);
    const groupId = `button_group_${buttonGroups.length}`;
    const newOrder = [...sectionOrder, groupId];
    onSectionOrderChange(newOrder);
    onSaveSectionOrder(newOrder);
  };

  const handleChange = (key: string, value: string) => {
    onRegistrationSettingsChange({
      ...registrationSettings,
      [key]: value,
    });
  };

  const handleFieldChange = (index: number, key: keyof RegistrationField, value: any) => {
    const newFields = [...registrationFields];
    newFields[index] = { ...newFields[index], [key]: value };
    onRegistrationFieldsChange(newFields);
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
    if (sectionId === "hero_image") return "이미지";
    if (sectionId === "registration_form_fields") return "폼 필드";
    if (sectionId.startsWith("description_")) return "설명 카드";
    if (sectionId.startsWith("info_card_")) return "정보 카드";
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
          <Button variant="outline" size="sm" onClick={() => handleMoveSectionUp(index)} disabled={index === 0}>
            <ArrowUp className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleMoveSectionDown(index)} disabled={index === sectionOrder.length - 1}>
            <ArrowDown className="w-4 h-4" />
          </Button>
          {onCopy && (
            <Button variant="outline" size="sm" onClick={onCopy}>
              <Copy className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    );
  };

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

  const renderHeroImageSection = (sectionId: string, index: number) => {
    const isCollapsed = collapsedSections[sectionId];
    
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
  };

  const renderFormFieldsSection = (sectionId: string, index: number) => {
    const isCollapsed = collapsedSections[sectionId];
    
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
  };

  const renderSection = (sectionId: string, index: number) => {
    const isCollapsed = collapsedSections[sectionId];
    
    if (sectionId === "hero_image") {
      return renderHeroImageSection(sectionId, index);
    }

    if (sectionId === "registration_form_fields") {
      return renderFormFieldsSection(sectionId, index);
    }

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

  return (
    <div className="space-y-8">
      <div className="flex gap-2 mb-6 flex-wrap">
          <Button 
            onClick={handleAddHeroSection} 
            variant="outline"
            size="sm"
            className="h-8 text-xs border-primary text-primary hover:bg-primary/10"
            disabled={sectionOrder.includes("hero_image")}
          >
            <Plus className="w-3 h-3 mr-1.5" />
            이미지
          </Button>
          <Button 
            onClick={handleAddFormFields} 
            variant="outline"
            size="sm"
            className="h-8 text-xs border-primary text-primary hover:bg-primary/10"
            disabled={sectionOrder.includes("registration_form_fields")}
          >
            <Plus className="w-3 h-3 mr-1.5" />
            폼 필드
          </Button>
          <Button 
            onClick={handleAddDescription} 
            variant="outline"
            size="sm"
            className="h-8 text-xs border-primary text-primary hover:bg-primary/10"
          >
            <Plus className="w-3 h-3 mr-1.5" />
            설명 카드
          </Button>
          <Button 
            onClick={handleAddInfoCardSection} 
            variant="outline"
            size="sm"
            className="h-8 text-xs border-primary text-primary hover:bg-primary/10"
          >
            <Plus className="w-3 h-3 mr-1.5" />
            정보 카드
          </Button>
          <Button 
            onClick={handleAddButtonGroup} 
            variant="outline"
            size="sm"
            className="h-8 text-xs border-primary text-primary hover:bg-primary/10"
          >
            <Plus className="w-3 h-3 mr-1.5" />
            버튼
          </Button>
        </div>

      <Separator />

      <SettingsSection title="페이지 정보">
        <SettingsToggle
          label="페이지 활성화"
          description="비활성화하면 사용자가 참가 신청 페이지에 접근할 수 없습니다"
          checked={registrationSettings.registration_enabled === "true"}
          onCheckedChange={(checked) => handleChange("registration_enabled", checked ? "true" : "false")}
        />
        <SettingsField label="페이지 제목" htmlFor="registration_page_title">
          <Input
            id="registration_page_title"
            value={registrationSettings.registration_page_title || ""}
            onChange={(e) => handleChange("registration_page_title", e.target.value)}
          />
        </SettingsField>
        <SettingsField label="페이지 설명" htmlFor="registration_page_description">
          <Input
            id="registration_page_description"
            value={registrationSettings.registration_page_description || ""}
            onChange={(e) => handleChange("registration_page_description", e.target.value)}
          />
        </SettingsField>
      </SettingsSection>

      <Separator />

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

      <SettingsSection title="개인정보 동의 내용">
        <SettingsField 
          label="개인정보 수집 및 이용 동의 내용" 
          htmlFor="registration_privacy_content"
          description="참가신청 페이지의 '내용 상세 보기'에 표시될 내용입니다."
        >
          <Textarea
            id="registration_privacy_content"
            value={registrationSettings.registration_privacy_content || ""}
            onChange={(e) => handleChange("registration_privacy_content", e.target.value)}
            placeholder="개인정보 수집 및 이용에 대한 상세 내용을 입력하세요."
            rows={10}
            className="resize-none"
          />
        </SettingsField>
      </SettingsSection>

      <Separator />

      <SettingsSection title="성공 메시지">
        <SettingsField label="성공 메시지 제목" htmlFor="registration_success_title">
          <Input
            id="registration_success_title"
            value={registrationSettings.registration_success_title || ""}
            onChange={(e) => handleChange("registration_success_title", e.target.value)}
          />
        </SettingsField>
        <SettingsField label="성공 메시지 설명" htmlFor="registration_success_description">
          <Input
            id="registration_success_description"
            value={registrationSettings.registration_success_description || ""}
            onChange={(e) => handleChange("registration_success_description", e.target.value)}
          />
        </SettingsField>
      </SettingsSection>
    </div>
  );
};

export default RegistrationSettings;
