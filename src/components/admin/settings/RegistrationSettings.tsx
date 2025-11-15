import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface RegistrationSettingsProps {
  registrationSettings: any;
  onRegistrationSettingsChange: (settings: any) => void;
}

const RegistrationSettings = ({
  registrationSettings,
  onRegistrationSettingsChange,
}: RegistrationSettingsProps) => {
  const handleChange = (key: string, value: string) => {
    onRegistrationSettingsChange({
      ...registrationSettings,
      [key]: value,
    });
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
        <h3 className="text-lg font-semibold">폼 필드 설정</h3>
        <div className="grid gap-6">
          <div className="space-y-2">
            <h4 className="font-medium">성함 필드</h4>
            <div className="grid gap-2">
              <div>
                <Label htmlFor="registration_field_name_label">레이블</Label>
                <Input
                  id="registration_field_name_label"
                  value={registrationSettings.registration_field_name_label}
                  onChange={(e) => handleChange("registration_field_name_label", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="registration_field_name_placeholder">플레이스홀더</Label>
                <Input
                  id="registration_field_name_placeholder"
                  value={registrationSettings.registration_field_name_placeholder}
                  onChange={(e) => handleChange("registration_field_name_placeholder", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">이메일 필드</h4>
            <div className="grid gap-2">
              <div>
                <Label htmlFor="registration_field_email_label">레이블</Label>
                <Input
                  id="registration_field_email_label"
                  value={registrationSettings.registration_field_email_label}
                  onChange={(e) => handleChange("registration_field_email_label", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="registration_field_email_placeholder">플레이스홀더</Label>
                <Input
                  id="registration_field_email_placeholder"
                  value={registrationSettings.registration_field_email_placeholder}
                  onChange={(e) => handleChange("registration_field_email_placeholder", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">연락처 필드</h4>
            <div className="grid gap-2">
              <div>
                <Label htmlFor="registration_field_phone_label">레이블</Label>
                <Input
                  id="registration_field_phone_label"
                  value={registrationSettings.registration_field_phone_label}
                  onChange={(e) => handleChange("registration_field_phone_label", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="registration_field_phone_placeholder">플레이스홀더</Label>
                <Input
                  id="registration_field_phone_placeholder"
                  value={registrationSettings.registration_field_phone_placeholder}
                  onChange={(e) => handleChange("registration_field_phone_placeholder", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">소속 회사 필드</h4>
            <div className="grid gap-2">
              <div>
                <Label htmlFor="registration_field_company_label">레이블</Label>
                <Input
                  id="registration_field_company_label"
                  value={registrationSettings.registration_field_company_label}
                  onChange={(e) => handleChange("registration_field_company_label", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="registration_field_company_placeholder">플레이스홀더</Label>
                <Input
                  id="registration_field_company_placeholder"
                  value={registrationSettings.registration_field_company_placeholder}
                  onChange={(e) => handleChange("registration_field_company_placeholder", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">특이사항 필드</h4>
            <div className="grid gap-2">
              <div>
                <Label htmlFor="registration_field_message_label">레이블</Label>
                <Input
                  id="registration_field_message_label"
                  value={registrationSettings.registration_field_message_label}
                  onChange={(e) => handleChange("registration_field_message_label", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="registration_field_message_placeholder">플레이스홀더</Label>
                <Input
                  id="registration_field_message_placeholder"
                  value={registrationSettings.registration_field_message_placeholder}
                  onChange={(e) => handleChange("registration_field_message_placeholder", e.target.value)}
                />
              </div>
            </div>
          </div>
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
