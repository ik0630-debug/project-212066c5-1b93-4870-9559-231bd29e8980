import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User, Session } from "@supabase/supabase-js";
import { Shield, FileText, Clock } from "lucide-react";
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
      icon: FileText,
      title: "간편한 영수증 발급",
      description: "성명만 입력하면 간편하게 영수증을 발급받을 수 있습니다",
    },
    {
      icon: Shield,
      title: "안전한 정보 보호",
      description: "본인 확인을 통해 안전하게 영수증을 발급합니다",
    },
    {
      icon: Clock,
      title: "실시간 발급",
      description: "언제든지 필요할 때 즉시 영수증을 발급받을 수 있습니다",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 animate-fade-in">
      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col items-center gap-3">
            <img src={logo} alt="M&C Communications" className="h-16 md:h-20" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              참가자 초청 플랫폼
            </h1>
            <p className="text-gray-600 text-center text-lg">
              M&C Communications 가 제공하는 발표자 지원 시스템입니다.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Features */}
          <div className="space-y-5">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                시스템 특징
              </h2>
            </div>
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardHeader className="pb-5">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-2 text-gray-900">{feature.title}</CardTitle>
                      <CardDescription className="text-base text-gray-600 leading-relaxed">
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
            <Card className="border-0 shadow-2xl bg-white">
              <CardHeader className="space-y-3 pb-6">
                <CardTitle className="text-2xl text-center font-bold text-gray-900">
                  사례비 영수증 작성 시스템
                </CardTitle>
                <CardDescription className="text-center text-base text-gray-600">
                  성명을 입력해주시 후 사례비 영수증을 작성하여 주십시오
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">성명을 입력해주세요</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="이메일을 입력하세요"
                      required
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">비밀번호</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      minLength={6}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                    style={{ backgroundColor: 'hsl(217 91% 35%)', color: 'white' }}
                    disabled={loading}
                  >
                    {loading ? "처리중..." : "확인"}
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                  문의사항이 있으시면 주최측에 연락해주세요
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
