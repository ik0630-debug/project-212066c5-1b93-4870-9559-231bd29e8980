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

  return (
    <div className="space-y-8">
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

      <SettingsSection title="참가신청 페이지 섹션 관리">
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button 
            onClick={handleAddHeroSection} 
            variant="outline"
            size="sm"
            className="h-8 text-xs border-primary text-primary hover:bg-primary/10"
            disabled={sectionOrder.includes("hero_image")}
          >
            <Plus className="w-3 h-3 mr-1.5" />
            헤더 이미지
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
            설명섹션
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
            버튼 그룹
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          섹션을 추가하면 아래에 표시됩니다. 섹션들은 드래그하여 순서를 변경할 수 있습니다.
        </p>
      </SettingsSection>

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
