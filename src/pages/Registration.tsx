import { useState } from "react";
import MobileNavigation from "@/components/MobileNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, Building } from "lucide-react";

const Registration = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "신청이 완료되었습니다!",
      description: "참가 확인 메일을 발송해드렸습니다.",
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-gradient-primary text-primary-foreground py-8 px-6">
        <h1 className="text-3xl font-bold text-center mb-2">참가 신청</h1>
        <p className="text-center text-primary-foreground/80">
          아래 양식을 작성해주세요
        </p>
      </header>

      <main className="px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              성함 *
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="홍길동"
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              이메일 *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@company.com"
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              연락처 *
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="010-0000-0000"
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="flex items-center gap-2">
              <Building className="w-4 h-4 text-primary" />
              소속 회사
            </Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="회사명"
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">특이사항</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="특별히 전달하실 말씀이 있으시면 작성해주세요"
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
