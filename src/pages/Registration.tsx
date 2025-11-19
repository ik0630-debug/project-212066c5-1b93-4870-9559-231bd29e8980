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
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .eq("category", "registration");

      if (data) {
        const newSettings = { ...pageSettings };
        data.forEach(({ key, value }) => {
          if (key === "registration_fields") {
            try {
              const parsedFields = JSON.parse(value);
              setFields(parsedFields);
              const initialFormData: Record<string, string> = {};
              parsedFields.forEach((field: any) => {
                // 전화번호 필드는 기본값으로 "010-" 설정
                initialFormData[field.id] = field.id === "phone" ? "010-" : "";
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

    // Validate required fields
    for (const field of fields) {
      if (field.required && !formData[field.id]?.trim()) {
        toast({
          title: "필수 항목을 입력해주세요",
          description: `${field.label}은(는) 필수 항목입니다.`,
          variant: "destructive",
        });
        return;
      }
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

      // Prepare data for database - ensure required fields exist
      const insertData = {
        name: validatedData.name || "",
        email: validatedData.email || "",
        phone: validatedData.phone || "",
        company: validatedData.company && validatedData.company.trim() ? validatedData.company : null,
        message: validatedData.message && validatedData.message.trim() ? validatedData.message : null,
      };

      const { error } = await supabase
        .from("registrations")
        .insert([insertData]);

      if (error) throw error;

      toast({
        title: pageSettings.successTitle,
        description: pageSettings.successDescription,
      });

      setFormData({
        name: "",
        email: "",
        phone: "010-",
        company: "",
        message: "",
      });
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
    
    // 전화번호 필드 특수 처리
    if (name === "phone") {
      // 숫자만 추출
      const numbers = value.replace(/[^\d]/g, "");
      
      // 010으로 시작하지 않으면 010 추가
      let formatted = "";
      if (numbers.length === 0) {
        formatted = "010-";
      } else if (numbers.startsWith("010")) {
        // 010-XXXX-XXXX 또는 010-XXX-XXXX 형식으로 포맷
        const rest = numbers.slice(3);
        if (rest.length <= 3) {
          formatted = `010-${rest}`;
        } else if (rest.length <= 7) {
          formatted = `010-${rest.slice(0, 3)}-${rest.slice(3)}`;
        } else {
          formatted = `010-${rest.slice(0, 4)}-${rest.slice(4, 8)}`;
        }
      } else {
        // 010이 아닌 경우 010을 앞에 붙임
        if (numbers.length <= 3) {
          formatted = `010-${numbers}`;
        } else if (numbers.length <= 7) {
          formatted = `010-${numbers.slice(0, 3)}-${numbers.slice(3)}`;
        } else {
          formatted = `010-${numbers.slice(0, 4)}-${numbers.slice(4, 8)}`;
        }
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
    onSwipedLeft: () => navigate('/location'),
    onSwipedRight: () => navigate('/program'),
    trackMouse: false,
    delta: 100, // 스와이프 감지를 위한 최소 이동 거리 (기본값 10px → 100px)
  });

  return (
    <div {...swipeHandlers} className="min-h-screen bg-background pb-20">
      <div className="max-w-[800px] mx-auto">
        {/* Header */}
        <header 
          className="bg-gradient-primary text-primary-foreground py-4 px-6 text-center"
        >
          <h1 className="text-2xl font-bold mb-1">{pageSettings.pageTitle}</h1>
          {pageSettings.pageDescription && (
            <p className="text-primary-foreground/90 text-sm whitespace-pre-line">
              {pageSettings.pageDescription}
            </p>
          )}
        </header>

      <main className="px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id} className="flex items-center gap-2">
                {field.type === "text" && field.id === "name" && <User className="w-4 h-4 text-primary" />}
                {field.type === "email" && <Mail className="w-4 h-4 text-primary" />}
                {field.type === "tel" && <Phone className="w-4 h-4 text-primary" />}
                {field.id === "company" && <Building className="w-4 h-4 text-primary" />}
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
                  type={field.type === "tel" ? "tel" : field.type}
                  value={formData[field.id] || (field.id === "phone" ? "010-" : "")}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="h-12"
                  maxLength={field.id === "phone" ? 13 : undefined}
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

          <Button
            type="submit"
            disabled={!agreedToPrivacy || isSubmitting}
            className="w-full h-12 bg-gradient-accent text-accent-foreground font-bold shadow-glow hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "신청 중..." : "신청하기"}
          </Button>
        </form>
      </main>

        <MobileNavigation />
      </div>
    </div>
  );
};

export default Registration;
