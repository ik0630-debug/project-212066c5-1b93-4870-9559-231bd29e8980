import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Building, Phone, Mail, Briefcase, Users, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MobileNavigation from "@/components/MobileNavigation";

const RegistrationVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [registration, setRegistration] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRegistration = async () => {
      try {
        // URL 파라미터에서 id 가져오기
        const id = searchParams.get("id");
        
        if (!id) {
          toast({
            title: "잘못된 접근입니다",
            description: "등록 정보를 찾을 수 없습니다.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("registrations")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setRegistration(data);
        } else {
          toast({
            title: "등록 정보를 찾을 수 없습니다",
            description: "유효하지 않은 QR코드입니다.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        toast({
          title: "오류가 발생했습니다",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadRegistration();
  }, [searchParams, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">등록 정보를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
          <div className="flex items-center gap-4 px-6 py-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold">등록 확인</h1>
          </div>
        </header>

        <main className="px-6 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">등록 정보를 찾을 수 없습니다</h2>
              <p className="text-muted-foreground mb-6">
                유효하지 않은 QR코드이거나 삭제된 등록 정보입니다.
              </p>
              <Button onClick={() => navigate("/")} className="w-full">
                홈으로 돌아가기
              </Button>
            </CardContent>
          </Card>
        </main>
        <MobileNavigation />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    if (status === "cancelled") {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          취소됨
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        신청완료
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center gap-4 px-6 py-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">등록 정보 확인</h1>
        </div>
      </header>

      <main className="px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-2xl mb-2">{registration.name}</CardTitle>
              <div className="flex justify-center">
                {getStatusBadge(registration.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <Building className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">소속</p>
                    <p className="font-medium">{registration.company || "-"}</p>
                  </div>
                </div>

                {registration.department && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">부서</p>
                      <p className="font-medium">{registration.department}</p>
                    </div>
                  </div>
                )}

                {registration.position && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <Briefcase className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">직함</p>
                      <p className="font-medium">{registration.position}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">연락처</p>
                    <p className="font-medium">{registration.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">이메일</p>
                    <p className="font-medium">{registration.email}</p>
                  </div>
                </div>

                {registration.message && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">특이사항</p>
                      <p className="font-medium">{registration.message}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground text-center">
                  신청일: {new Date(registration.created_at).toLocaleString("ko-KR")}
                </p>
              </div>
            </CardContent>
          </Card>

          <Button onClick={() => navigate("/")} variant="outline" className="w-full">
            홈으로 돌아가기
          </Button>
        </div>
      </main>
      <MobileNavigation />
    </div>
  );
};

export default RegistrationVerify;
