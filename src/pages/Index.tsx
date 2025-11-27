import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User, Session } from "@supabase/supabase-js";
import { Smartphone, UserPlus, Users } from "lucide-react";
import logo from "@/assets/mnc-logo.png";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            checkAdminAndRedirect(session.user.id);
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkAdminAndRedirect(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdminAndRedirect = async (userId: string) => {
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .in("role", ["admin", "registration_manager"])
      .maybeSingle();
    
    if (roleData) {
      navigate("/projects");
    } else {
      toast({
        title: "접근 권한 없음",
        description: "관리자 권한이 필요합니다.",
        variant: "destructive",
      });
      await supabase.auth.signOut();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "로그인 성공!",
        description: "환영합니다.",
      });
    } catch (error: any) {
      toast({
        title: "로그인 실패",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Smartphone,
      title: "맞춤형 정보 제공",
      description: "참가자가 필요한 정보만 담아 언제든 모바일로 확인이 가능합니다.",
    },
    {
      icon: UserPlus,
      title: "간편한 참가 등록",
      description: "간단한 입력으로 등록이 가능하고, 신청 확인과 취소가 가능합니다.",
    },
    {
      icon: Users,
      title: "실시간 확인 및 관리",
      description: "참가자 현황을 담당자 누구나 쉽게 확인할 수 있습니다.",
    },
  ];

  return (
    <div className="min-h-screen bg-white animate-fade-in">
      {/* Header */}
      <header className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col items-center gap-4">
            <img src={logo} alt="M&C Communications" className="h-30 md:h-36" />
            <h1 className="text-2xl font-bold text-blue-600">
              참가자 초청 플랫폼
            </h1>
            <p className="text-gray-600 text-center text-sm">
              M&C Communications가 제공하는 모바일 참가자 초청 시스템입니다.
            </p>
          </div>
        </div>
      </header>

      <div className="border-t border-gray-200"></div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Side - Features */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <Card key={index} className="border border-gray-200 shadow-sm hover:shadow-md transition-all bg-white">
                <CardHeader className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg mb-2 text-gray-900 font-semibold">{feature.title}</CardTitle>
                      <CardDescription className="text-sm text-gray-600 leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Right Side - Admin Login */}
          <div className="lg:sticky lg:top-6">
            <Card className="border border-gray-200 shadow-sm bg-white">
              <CardHeader className="space-y-2 pb-6">
                <CardTitle className="text-2xl text-center font-bold text-gray-900">
                  사례비 영수증 작성 시스템
                </CardTitle>
                <CardDescription className="text-center text-sm text-gray-600">
                  성명을 입력해주시 후 사례비 영수증을 작성하여 주십시오
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-900">성명을 입력해주세요</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder=""
                      required
                      className="h-12 border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-900">비밀번호</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder=""
                      required
                      className="h-12 border-gray-300"
                      minLength={6}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all"
                    disabled={loading}
                  >
                    {loading ? "처리중..." : "확인"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
