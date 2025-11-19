import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import SortableFormField from "@/components/SortableFormField";

interface RegistrationField {
  id: string;
  label: string;
  placeholder: string;
  type: string;
  required: boolean;
  options?: string[];
}

interface RegistrationSettingsProps {
  registrationSettings: any;
  registrationFields: RegistrationField[];
  onRegistrationSettingsChange: (settings: any) => void;
  onRegistrationFieldsChange: (fields: RegistrationField[]) => void;
}

const RegistrationSettings = ({
  registrationSettings,
  registrationFields,
  onRegistrationSettingsChange,
  onRegistrationFieldsChange,
}: RegistrationSettingsProps) => {
  const handleChange = (key: string, value: string) => {
    onRegistrationSettingsChange({
      ...registrationSettings,
      [key]: value,
    });
  };

  const handleFieldChange = (index: number, key: keyof RegistrationField, value: any) => {
    const newFields = [...registrationFields];
    
    if (key === 'label') {
      const autoId = value
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_가-힣]/g, '');
      newFields[index] = { ...newFields[index], [key]: value, id: autoId || `field_${Date.now()}` };
    } else {
      newFields[index] = { ...newFields[index], [key]: value };
    }
    
    onRegistrationFieldsChange(newFields);
  };

  const addField = () => {
    const newField: RegistrationField = {
      id: `field_${Date.now()}`,
      label: "새 필드",
      placeholder: "",
      type: "text",
      required: false,
    };
    onRegistrationFieldsChange([...registrationFields, newField]);
  };

  const removeField = (index: number) => {
    const newFields = registrationFields.filter((_, i) => i !== index);
    onRegistrationFieldsChange(newFields);
  };

  const moveFieldUp = (index: number) => {
    if (index === 0) return;
    const newFields = [...registrationFields];
    [newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]];
    onRegistrationFieldsChange(newFields);
  };

  const moveFieldDown = (index: number) => {
    if (index === registrationFields.length - 1) return;
    const newFields = [...registrationFields];
    [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
    onRegistrationFieldsChange(newFields);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">페이지 정보</h3>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="registration_page_title">페이지 제목</Label>
            <Input
              id="registration_page_title"
              value={registrationSettings.registration_page_title}
              onChange={(e) => handleChange("registration_page_title", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="registration_page_description">페이지 설명</Label>
            <Input
              id="registration_page_description"
              value={registrationSettings.registration_page_description}
              onChange={(e) => handleChange("registration_page_description", e.target.value)}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">폼 필드 설정</h3>
          <Button onClick={addField} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            필드 추가
          </Button>
        </div>
        
        <div className="grid gap-4">
          {registrationFields.map((field, index) => (
            <SortableFormField
              key={field.id}
              field={field}
              index={index}
              totalFields={registrationFields.length}
              onFieldChange={handleFieldChange}
              onRemove={removeField}
              onMoveUp={moveFieldUp}
              onMoveDown={moveFieldDown}
            />
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">개인정보 동의 내용</h3>
        <div>
          <Label htmlFor="registration_privacy_content">개인정보 수집 및 이용 동의 내용</Label>
          <Textarea
            id="registration_privacy_content"
            value={registrationSettings.registration_privacy_content || ""}
            onChange={(e) => handleChange("registration_privacy_content", e.target.value)}
            placeholder="개인정보 수집 및 이용에 대한 상세 내용을 입력하세요."
            rows={10}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground mt-2">
            참가신청 페이지의 "내용 상세 보기"에 표시될 내용입니다.
          </p>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">성공 메시지</h3>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="registration_success_title">성공 메시지 제목</Label>
            <Input
              id="registration_success_title"
              value={registrationSettings.registration_success_title}
              onChange={(e) => handleChange("registration_success_title", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="registration_success_description">성공 메시지 설명</Label>
            <Input
              id="registration_success_description"
              value={registrationSettings.registration_success_description}
              onChange={(e) => handleChange("registration_success_description", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSettings;
