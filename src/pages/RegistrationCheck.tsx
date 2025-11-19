import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MobileNavigation from "@/components/MobileNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Phone, User, Building, Calendar, CheckCircle2 } from "lucide-react";

interface RegistrationData {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

const RegistrationCheck = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("010-");
  const [isChecking, setIsChecking] = useState(false);
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, "");
    
    // 010으로 시작하지 않으면 010으로 시작하도록
    if (!numbers.startsWith("010")) {
      value = "010-";
      setPhone(value);
      return;
    }
    
    // 자동 하이픈 추가
    if (numbers.length <= 3) {
      value = numbers;
    } else if (numbers.length <= 7) {
      value = `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      value = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
    
    setPhone(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "이름을 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    if (!phone.trim() || phone.length < 12) {
      toast({
        title: "올바른 연락처를 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsChecking(true);

      // 이름과 전화번호로 등록 확인
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .eq("name", name.trim())
        .eq("phone", phone.replace(/-/g, ""))
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setRegistrationData(data);
        toast({
          title: "✓ 정상적으로 등록이 되었습니다.",
        });
      } else {
        setRegistrationData(null);
        toast({
          title: "등록자 명단에 없습니다.",
          description: "등록 여부를 다시 한 번 확인해 주세요.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "확인 중 오류가 발생했습니다.",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleReset = () => {
    setName("");
    setPhone("010-");
    setRegistrationData(null);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-accent"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground">참가 신청 확인</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 py-8">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">신청 내역 조회</h2>
              <p className="text-muted-foreground">
                신청하신 정보로 등록 여부를 확인해주세요
              </p>
            </div>

            {/* 등록 정보 표시 */}
            {registrationData && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <CheckCircle2 className="w-5 h-5" />
                    신청 정보
                  </CardTitle>
                  <CardDescription>
                    아래 정보로 정상 등록되었습니다
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">이름</p>
                      <p className="font-medium text-foreground">{registrationData.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">연락처</p>
                      <p className="font-medium text-foreground">
                        {registrationData.phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")}
                      </p>
                    </div>
                  </div>

                  {registrationData.company && (
                    <div className="flex items-start gap-3">
                      <Building className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">회사</p>
                        <p className="font-medium text-foreground">{registrationData.company}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">신청일</p>
                      <p className="font-medium text-foreground">
                        {new Date(registrationData.created_at).toLocaleString("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="w-full mt-4"
                  >
                    다시 조회하기
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* 조회 폼 */}
            {!registrationData && (
              <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                {/* 이름 입력 */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2 text-foreground font-medium">
                    <User className="w-4 h-4" />
                    이름 *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="홍길동"
                    className="h-12"
                    required
                  />
                </div>

                {/* 휴대전화 번호 입력 */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 text-foreground font-medium">
                    <Phone className="w-4 h-4" />
                    휴대전화 번호 *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="010-0000-0000"
                    className="h-12"
                    maxLength={13}
                    required
                  />
                </div>

                {/* 확인 버튼 */}
                <Button
                  type="submit"
                  disabled={isChecking}
                  className="w-full h-12 bg-gradient-accent text-accent-foreground font-bold shadow-glow hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isChecking ? "확인 중..." : "신청 여부 확인"}
                </Button>
              </form>
            )}
          </div>
        </main>

        <MobileNavigation />
      </div>
    </div>
  );
};

export default RegistrationCheck;
