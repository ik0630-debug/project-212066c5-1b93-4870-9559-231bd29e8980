import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MobileNavigation from "@/components/MobileNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, Building, Upload } from "lucide-react";
import { z } from "zod";
import { useSwipeable } from "react-swipeable";
import { getNextEnabledPage } from "@/utils/pageNavigation";
import { usePageSettings } from "@/hooks/usePageSettings";

interface RegistrationField {
  id: string;
  label: string;
  placeholder: string;
  type: string;
  required: boolean;
  options?: string[];
}

const Registration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [headerImage, setHeaderImage] = useState<string>("");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [privacyContent, setPrivacyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [defaultProjectId, setDefaultProjectId] = useState<string | null>(null);
  const { settings: enabledPages } = usePageSettings();
  const isPageEnabled = enabledPages?.registration ?? true;
  const [pageSettings, setPageSettings] = useState({
    pageTitle: "참가 신청",
    pageDescription: "아래 양식을 작성해주세요",
    successTitle: "신청이 완료되었습니다!",
    successDescription: "참가 확인 메일을 발송해드렸습니다.",
  });
  const [fields, setFields] = useState<RegistrationField[]>([
    { id: "name", label: "성함", placeholder: "홍길동", type: "text", required: true },
    { id: "email", label: "이메일", placeholder: "example@company.com", type: "email", required: true },
    { id: "phone", label: "연락처", placeholder: "010-0000-0000", type: "tel", required: true },
    { id: "company", label: "소속 회사", placeholder: "회사명", type: "text", required: false },
    { id: "message", label: "특이사항", placeholder: "특별히 전달하실 말씀이 있으시면 작성해주세요", type: "textarea", required: false },
  ]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Get default project ID
        const { data: projectData } = await supabase
          .from("projects")
          .select("id")
          .eq("slug", "default")
          .single();
        
        if (projectData) {
          setDefaultProjectId(projectData.id);
        }

      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .eq("category", "registration");

      if (data) {
        const newSettings = { ...pageSettings };
        data.forEach(({ key, value }) => {
          if (key === "form_fields") {
            try {
              const parsedFields = JSON.parse(value);
              setFields(parsedFields);
              const initialFormData: Record<string, string> = {};
              parsedFields.forEach((field: any) => {
                initialFormData[field.id] = "";
              });
              setFormData(initialFormData);
            } catch (e) {
              console.error("Failed to parse registration fields", e);
            }
          } else if (key === "registration_page_title") {
            newSettings.pageTitle = value;
          } else if (key === "registration_page_description") {
            newSettings.pageDescription = value;
          } else if (key === "registration_success_title") {
            newSettings.successTitle = value;
          } else if (key === "registration_success_description") {
            newSettings.successDescription = value;
          } else if (key === "registration_privacy_content") {
            setPrivacyContent(value);
          }
        });
        setPageSettings(newSettings);
      }
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 이미 제출 중이면 중복 실행 방지
    if (isSubmitting) return;

    // 개인정보 동의 체크 확인
    if (!agreedToPrivacy) {
      toast({
        title: "개인정보 수집 및 이용 동의 필요",
        description: "개인정보 수집 및 이용에 동의해주세요.",
        variant: "destructive",
      });
      return;
    }

    // Build dynamic zod schema based on fields
    const schemaShape: Record<string, z.ZodTypeAny> = {};
    
    fields.forEach(field => {
      if (field.type === 'email') {
        schemaShape[field.id] = field.required 
          ? z.string().trim().email("올바른 이메일 형식이 아닙니다").max(255, `${field.label}은 255자 이내로 입력해주세요`)
          : z.string().trim().email("올바른 이메일 형식이 아닙니다").max(255, `${field.label}은 255자 이내로 입력해주세요`).optional().or(z.literal(""));
      } else if (field.type === 'tel') {
        schemaShape[field.id] = field.required
          ? z.string().trim().min(1, `${field.label}을 입력해주세요`).max(20, `${field.label}은 20자 이내로 입력해주세요`)
          : z.string().trim().max(20, `${field.label}은 20자 이내로 입력해주세요`).optional().or(z.literal(""));
      } else {
        const maxLength = field.type === 'textarea' ? 1000 : 100;
        schemaShape[field.id] = field.required
          ? z.string().trim().min(1, `${field.label}을 입력해주세요`).max(maxLength, `${field.label}은 ${maxLength}자 이내로 입력해주세요`)
          : z.string().trim().max(maxLength, `${field.label}은 ${maxLength}자 이내로 입력해주세요`).optional().or(z.literal(""));
      }
    });

    const registrationSchema = z.object(schemaShape);

    try {
      setIsSubmitting(true);

      // Validate form data
      const validatedData = registrationSchema.parse(formData);

      if (!defaultProjectId) {
        throw new Error("프로젝트 정보를 찾을 수 없습니다");
      }

      // Prepare data for database - form_data에 모든 필드 저장
      const insertData: any = {
        name: validatedData.name || null,
        form_data: validatedData,
        project_id: defaultProjectId,
      };

      const { error } = await supabase
        .from("registrations")
        .insert([insertData]);

      if (error) throw error;

      toast({
        title: pageSettings.successTitle,
        description: pageSettings.successDescription,
      });

      // 폼 초기화 - 동적 필드 기반
      const resetFormData: Record<string, string> = {};
      fields.forEach(field => {
        resetFormData[field.id] = "";
      });
      setFormData(resetFormData);
      setAgreedToPrivacy(false);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "입력 오류",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "신청 실패",
          description: error.message || "신청 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // 전화번호 타입 필드 포맷팅 (자동으로 - 추가)
    const field = fields.find(f => f.id === name);
    if (field?.type === "tel") {
      // 숫자만 추출
      const numbers = value.replace(/[^\d]/g, "");
      
      // 포맷팅: 010-1234-5678 형식
      let formatted = "";
      if (numbers.length <= 3) {
        formatted = numbers;
      } else if (numbers.length <= 7) {
        formatted = `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
      } else {
        formatted = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
      }
      
      setFormData({
        ...formData,
        [name]: formatted,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeaderImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: async () => {
      const nextPage = await getNextEnabledPage('/registration', 'left');
      navigate(nextPage);
    },
    onSwipedRight: async () => {
      const nextPage = await getNextEnabledPage('/registration', 'right');
      navigate(nextPage);
    },
    trackMouse: false,
    delta: 100,
  });

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">로딩 중...</div>;
  }

  return (
    <div {...swipeHandlers} className="min-h-screen bg-background pb-20 animate-fade-in">
      <div className="max-w-[800px] mx-auto">
        {/* Header */}
        <header 
          className="sticky top-0 z-40 bg-gradient-primary text-primary-foreground py-4 px-6 text-center"
        >
          <h1 className="text-2xl font-bold mb-1">{pageSettings.pageTitle}</h1>
          {pageSettings.pageDescription && (
            <p className="text-primary-foreground/90 text-sm whitespace-pre-line">
              {pageSettings.pageDescription}
            </p>
          )}
        </header>

        {!isPageEnabled ? (
          <main className="px-6 py-8">
            <div className="bg-card rounded-lg p-8 shadow-elegant border border-border text-center space-y-4">
              <h2 className="text-xl font-bold text-foreground">
                참가 신청이 일시적으로 중단되었습니다
              </h2>
              <p className="text-muted-foreground">
                현재 참가 신청을 받지 않고 있습니다. 자세한 사항은 관리자에게 문의해주세요.
              </p>
            </div>
          </main>
        ) : (
          <main className="px-6 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id} className="flex items-center gap-2">
                {field.id === "name" && <User className="w-4 h-4 text-primary" />}
                {field.label} {field.required && "*"}
              </Label>
              {field.type === "textarea" ? (
                <Textarea
                  id={field.id}
                  name={field.id}
                  value={formData[field.id] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  rows={4}
                  className="resize-none"
                />
              ) : field.type === "select" ? (
                <Select
                  value={formData[field.id] || ""}
                  onValueChange={(value) => setFormData({ ...formData, [field.id]: value })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder={field.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {(field.options || []).map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  value={formData[field.id] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="h-12"
                  maxLength={field.type === "tel" ? 13 : undefined}
                />
              )}
            </div>
          ))}

          {/* 개인정보 동의 체크박스 */}
          <div className="flex items-start gap-3 pt-4 border-t border-border">
            <Checkbox
              id="privacy-agreement"
              checked={agreedToPrivacy}
              onCheckedChange={(checked) => setAgreedToPrivacy(checked as boolean)}
              className="mt-1"
            />
            <div className="flex-1">
              <Label htmlFor="privacy-agreement" className="cursor-pointer text-sm">
                개인정보 수집, 이용에 동의합니다. *
              </Label>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="h-auto p-0 text-xs text-primary">
                    내용 상세 보기
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>개인정보 수집 및 이용 동의</DialogTitle>
                  </DialogHeader>
                  <DialogDescription asChild>
                    <div className="whitespace-pre-line text-sm text-foreground">
                      {privacyContent || "개인정보 수집 및 이용 동의 내용이 설정되지 않았습니다."}
                    </div>
                  </DialogDescription>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              disabled={!agreedToPrivacy || isSubmitting}
              className="w-full h-12 bg-gradient-accent text-accent-foreground font-bold shadow-glow hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "신청 중..." : "신청하기"}
            </Button>
            
            <Button
              type="button"
              onClick={() => navigate("/registration/check")}
              variant="outline"
              className="w-full h-12 bg-[hsl(220,70%,20%)] text-white border-[hsl(220,70%,30%)] hover:bg-[hsl(220,70%,25%)] hover:text-white font-semibold transition-colors"
            >
              참가 신청 확인
            </Button>
          </div>
        </form>
      </main>
        )}

        <MobileNavigation />
      </div>
    </div>
  );
};

export default Registration;
