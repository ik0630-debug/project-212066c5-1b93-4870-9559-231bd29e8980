import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ColorPicker } from "@/components/ColorPicker";
import { SettingsField } from "./SettingsField";
import { SettingsSection } from "./SettingsSection";
import { SettingsToggle } from "./SettingsToggle";
import { useRegistrationSettingsHandlers } from "@/hooks/admin/useRegistrationSettingsHandlers";
import { renderRegistrationSection } from "./RegistrationSettings_renderSections";

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

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleChange = (key: string, value: string) => {
    onRegistrationSettingsChange({
      ...registrationSettings,
      [key]: value,
    });
  };

  const handlers = useRegistrationSettingsHandlers({
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
  });

  return (
    <div className="space-y-8">
      <div className="flex gap-2 mb-6 flex-wrap">
        <Button 
          onClick={handlers.handleAddHeroSection} 
          variant="outline"
          size="sm"
          className="h-8 text-xs border-primary text-primary hover:bg-primary/10"
          disabled={sectionOrder.includes("hero_image")}
        >
          <Plus className="w-3 h-3 mr-1.5" />
          이미지
        </Button>
        <Button 
          onClick={handlers.handleAddFormFields} 
          variant="outline"
          size="sm"
          className="h-8 text-xs border-primary text-primary hover:bg-primary/10"
          disabled={sectionOrder.includes("registration_form_fields")}
        >
          <Plus className="w-3 h-3 mr-1.5" />
          폼 필드
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

      <Separator />

      <SettingsSection title="페이지 정보">
        <SettingsToggle
          label="페이지 활성화"
          description="비활성화하면 사용자가 참가 신청 페이지에 접근할 수 없습니다"
          checked={registrationSettings.registration_enabled === "true"}
          onCheckedChange={(checked) => handleChange("registration_enabled", checked ? "true" : "false")}
        />
        <SettingsToggle
          label="참가신청 마감"
          description="마감 시 신청 폼이 비활성화되고 마감 메시지가 표시됩니다"
          checked={registrationSettings.registration_closed === "true"}
          onCheckedChange={(checked) => handleChange("registration_closed", checked ? "true" : "false")}
        />
        {registrationSettings.registration_closed === "true" && (
          <SettingsField label="마감 메시지" htmlFor="registration_closed_message">
            <Textarea
              id="registration_closed_message"
              value={registrationSettings.registration_closed_message || ""}
              onChange={(e) => handleChange("registration_closed_message", e.target.value)}
              placeholder="참가신청이 마감되었습니다."
              rows={3}
              className="resize-none"
            />
          </SettingsField>
        )}
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
        <SettingsField label="헤더 배경색" htmlFor="registration_header_bg_color">
          <ColorPicker
            value={registrationSettings.registration_header_bg_color || "221 83% 33%"}
            onChange={(color) => handleChange("registration_header_bg_color", color)}
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
            {renderRegistrationSection({
              sectionId,
              index,
              sectionOrder,
              collapsedSections,
              registrationSettings,
              registrationFields,
              heroSections,
              infoCardSections,
              descriptions,
              buttonGroups,
              toggleSection,
              handleChange,
              ...handlers,
              onDescriptionsChange,
              onInfoCardSectionsChange,
              onButtonGroupsChange,
              onSectionOrderChange,
              onSaveSectionOrder,
            })}
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
