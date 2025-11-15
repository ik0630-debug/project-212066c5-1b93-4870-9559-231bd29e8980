import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MobileNavigation from "@/components/MobileNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, Building, ArrowLeft, Upload } from "lucide-react";

const Registration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [headerImage, setHeaderImage] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [pageSettings, setPageSettings] = useState({
    pageTitle: "참가 신청",
    pageDescription: "아래 양식을 작성해주세요",
    nameLabel: "성함",
    namePlaceholder: "홍길동",
    emailLabel: "이메일",
    emailPlaceholder: "example@company.com",
    phoneLabel: "연락처",
    phonePlaceholder: "010-0000-0000",
    companyLabel: "소속 회사",
    companyPlaceholder: "회사명",
    messageLabel: "특이사항",
    messagePlaceholder: "특별히 전달하실 말씀이 있으시면 작성해주세요",
    successTitle: "신청이 완료되었습니다!",
    successDescription: "참가 확인 메일을 발송해드렸습니다.",
  });

  useEffect(() => {
    const loadSettings = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .eq("category", "registration");

      if (data) {
        const newSettings = { ...pageSettings };
        data.forEach(({ key, value }) => {
          switch (key) {
            case "registration_page_title":
              newSettings.pageTitle = value;
              break;
            case "registration_page_description":
              newSettings.pageDescription = value;
              break;
            case "registration_field_name_label":
              newSettings.nameLabel = value;
              break;
            case "registration_field_name_placeholder":
              newSettings.namePlaceholder = value;
              break;
            case "registration_field_email_label":
              newSettings.emailLabel = value;
              break;
            case "registration_field_email_placeholder":
              newSettings.emailPlaceholder = value;
              break;
            case "registration_field_phone_label":
              newSettings.phoneLabel = value;
              break;
            case "registration_field_phone_placeholder":
              newSettings.phonePlaceholder = value;
              break;
            case "registration_field_company_label":
              newSettings.companyLabel = value;
              break;
            case "registration_field_company_placeholder":
              newSettings.companyPlaceholder = value;
              break;
            case "registration_field_message_label":
              newSettings.messageLabel = value;
              break;
            case "registration_field_message_placeholder":
              newSettings.messagePlaceholder = value;
              break;
            case "registration_success_title":
              newSettings.successTitle = value;
              break;
            case "registration_success_description":
              newSettings.successDescription = value;
              break;
          }
        });
        setPageSettings(newSettings);
      }
    };
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from("registrations")
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company || null,
            message: formData.message || null,
          },
        ]);

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
      toast({
        title: "신청 실패",
        description: error.message,
        variant: "destructive",
      });
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
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              {pageSettings.nameLabel} *
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={pageSettings.namePlaceholder}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              {pageSettings.emailLabel} *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={pageSettings.emailPlaceholder}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              {pageSettings.phoneLabel} *
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder={pageSettings.phonePlaceholder}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="flex items-center gap-2">
              <Building className="w-4 h-4 text-primary" />
              {pageSettings.companyLabel}
            </Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder={pageSettings.companyPlaceholder}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">{pageSettings.messageLabel}</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={pageSettings.messagePlaceholder}
              rows={4}
              className="resize-none"
            />
          </div>

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
