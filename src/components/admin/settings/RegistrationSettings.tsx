import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";

interface RegistrationField {
  id: string;
  label: string;
  placeholder: string;
  type: string;
  required: boolean;
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
    };
    onRegistrationFieldsChange([...registrationFields, newField]);
  };

  const removeField = (index: number) => {
    const newFields = registrationFields.filter((_, i) => i !== index);
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
        
        <div className="grid gap-6">
          {registrationFields.map((field, index) => (
            <div key={field.id} className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{field.label}</h4>
                <Button
                  onClick={() => removeField(index)}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid gap-3">
                <div>
                  <Label>필드 ID</Label>
                  <Input
                    value={field.id}
                    onChange={(e) => handleFieldChange(index, "id", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label>레이블</Label>
                  <Input
                    value={field.label}
                    onChange={(e) => handleFieldChange(index, "label", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label>플레이스홀더</Label>
                  <Input
                    value={field.placeholder}
                    onChange={(e) => handleFieldChange(index, "placeholder", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label>필드 타입</Label>
                  <Select
                    value={field.type}
                    onValueChange={(value) => handleFieldChange(index, "type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">텍스트</SelectItem>
                      <SelectItem value="email">이메일</SelectItem>
                      <SelectItem value="tel">전화번호</SelectItem>
                      <SelectItem value="number">숫자</SelectItem>
                      <SelectItem value="textarea">긴 텍스트</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`required-${field.id}`}
                    checked={field.required}
                    onCheckedChange={(checked) => handleFieldChange(index, "required", checked)}
                  />
                  <Label htmlFor={`required-${field.id}`}>필수 항목</Label>
                </div>
              </div>
            </div>
          ))}
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
