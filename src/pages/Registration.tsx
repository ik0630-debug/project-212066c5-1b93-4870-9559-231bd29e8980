import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MobileNavigation from "@/components/MobileNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, Building, ArrowLeft, Upload } from "lucide-react";
import { z } from "zod";

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
          }
        });
        setPageSettings(newSettings);
      }
    };
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    // Validate using zod schema
    const registrationSchema = z.object({
      name: z.string().trim().min(1, "이름을 입력해주세요").max(100, "이름은 100자 이내로 입력해주세요"),
      email: z.string().trim().email("올바른 이메일 형식이 아닙니다").max(255, "이메일은 255자 이내로 입력해주세요"),
      phone: z.string().trim().min(1, "연락처를 입력해주세요").max(20, "연락처는 20자 이내로 입력해주세요"),
      company: z.string().trim().max(100, "회사명은 100자 이내로 입력해주세요").optional().nullable(),
      message: z.string().trim().max(1000, "메시지는 1000자 이내로 입력해주세요").optional().nullable(),
    });

    try {
      // Validate form data
      const validatedData = registrationSchema.parse({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company || null,
        message: formData.message || null,
      });

      const { error } = await supabase
        .from("registrations")
        .insert([{
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          company: validatedData.company,
          message: validatedData.message,
        }]);

      if (error) throw error;

      toast({
        title: pageSettings.successTitle,
        description: pageSettings.successDescription,
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
      });
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
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

  return (
    <div className="min-h-screen bg-background pb-20">
      <header 
        className="relative bg-gradient-primary text-primary-foreground py-8 px-6 bg-cover bg-center"
        style={headerImage ? { backgroundImage: `url(${headerImage})` } : {}}
      >
        <div className="absolute inset-0 bg-gradient-primary/80" />
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="absolute left-0 top-0 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <label htmlFor="header-upload-registration" className="absolute right-0 top-0 cursor-pointer">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/20"
              asChild
            >
              <span>
                <Upload className="w-5 h-5" />
              </span>
            </Button>
            <input
              id="header-upload-registration"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          <h1 className="text-3xl font-bold text-center mb-2">{pageSettings.pageTitle}</h1>
          <p className="text-center text-primary-foreground/80">
            {pageSettings.pageDescription}
          </p>
        </div>
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
                  type={field.type}
                  value={formData[field.id] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="h-12"
                />
              )}
            </div>
          ))}

          <Button
            type="submit"
            className="w-full h-12 bg-gradient-accent text-accent-foreground font-bold shadow-glow hover:opacity-90 transition-opacity"
          >
            신청하기
          </Button>
        </form>
      </main>

      <MobileNavigation />
    </div>
  );
};

export default Registration;
