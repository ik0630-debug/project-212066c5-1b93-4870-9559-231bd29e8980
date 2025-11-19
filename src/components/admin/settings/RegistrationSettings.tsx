import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";

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
    
    // 레이블이 변경되면 ID도 자동으로 업데이트
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
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">페이지 정보</h3>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="registration_page_title">페이지 제목</Label>
            <Input
              id="registration_page_title"
              value={registrationSettings.registration_page_title || ""}
              onChange={(e) => handleChange("registration_page_title", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="registration_page_description">페이지 설명</Label>
            <Input
              id="registration_page_description"
              value={registrationSettings.registration_page_description || ""}
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
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => moveFieldUp(index)}
                    variant="outline"
                    size="sm"
                    disabled={index === 0}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => moveFieldDown(index)}
                    variant="outline"
                    size="sm"
                    disabled={index === registrationFields.length - 1}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => removeField(index)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid gap-3">
                <div>
                  <Label>레이블</Label>
                  <Input
                    value={field.label}
                    onChange={(e) => handleFieldChange(index, "label", e.target.value)}
                    placeholder="예: 이름, 이메일, 회사명"
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
                      <SelectItem value="text">짧은 텍스트</SelectItem>
                      <SelectItem value="email">이메일</SelectItem>
                      <SelectItem value="tel">전화번호</SelectItem>
                      <SelectItem value="number">숫자</SelectItem>
                      <SelectItem value="textarea">긴 텍스트</SelectItem>
                      <SelectItem value="select">드롭다운 선택</SelectItem>
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

                {field.type === "select" && (
                  <div>
                    <Label>선택 옵션 (쉼표로 구분)</Label>
                    <Input
                      value={(field.options || []).join(", ")}
                      onChange={(e) => {
                        const options = e.target.value.split(",").map(opt => opt.trim()).filter(opt => opt);
                        handleFieldChange(index, "options", options);
                      }}
                      placeholder="옵션1, 옵션2, 옵션3"
                    />
                  </div>
                )}
              </div>
            </div>
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
              value={registrationSettings.registration_success_title || ""}
              onChange={(e) => handleChange("registration_success_title", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="registration_success_description">성공 메시지 설명</Label>
            <Input
              id="registration_success_description"
              value={registrationSettings.registration_success_description || ""}
              onChange={(e) => handleChange("registration_success_description", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSettings;
