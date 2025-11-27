import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Session } from "@supabase/supabase-js";
import logo from "@/assets/mnc-logo.png";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(searchParams.get("mode") !== "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  
  // Additional signup fields
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [mobilePhone, setMobilePhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Format phone number as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    
    let formatted = '';
    if (value.length <= 3) {
      formatted = value;
    } else if (value.length <= 7) {
      formatted = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length <= 11) {
      formatted = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7)}`;
    } else {
      // Limit to 11 digits
      formatted = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
    }
    
    setMobilePhone(formatted);
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check admin role after login
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
    // Check if profile is approved
    const { data: profileData } = await supabase
      .from("profiles")
      .select("approved")
      .eq("user_id", userId)
      .single();
    
    if (profileData && !profileData.approved) {
      toast({
        title: "승인 대기 중",
        description: "관리자 승인 후 이용이 가능합니다.",
        variant: "destructive",
      });
      await supabase.auth.signOut();
      return;
    }
    
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .in("role", ["master", "mnc_admin", "project_staff"])
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
    
    // Validate password confirmation for signup
    if (!isLogin && password !== confirmPassword) {
      toast({
        title: "비밀번호 불일치",
        description: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "로그인 성공!",
          description: "환영합니다.",
        });
      } else {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (authError) throw authError;

        // Create profile with additional information
        if (authData.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert([
              {
                user_id: authData.user.id,
                name,
                organization,
                department: department || null,
                position: position || null,
                office_phone: null,
                mobile_phone: mobilePhone,
                email,
                approved: false, // Set to false by default
              },
            ]);

          if (profileError) throw profileError;
          
          // Sign out the user immediately after signup
          await supabase.auth.signOut();
        }

        toast({
          title: "회원가입이 완료되었습니다.",
          description: "관리자 확인 후 이용이 가능합니다.",
        });
        
        // Redirect to home page after a short delay
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error: any) {
      toast({
        title: "오류 발생",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 animate-fade-in">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col items-center gap-3">
            <img src={logo} alt="M&C Communications" className="h-24" />
            <h1 className="text-2xl font-bold text-blue-600">
              참가자 관리 플랫폼
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
              <h2 className="text-3xl font-bold text-center text-white">
                {isLogin ? "로그인" : "회원가입"}
              </h2>
              <p className="text-center text-blue-100 mt-2 text-sm">
                {isLogin ? "관리자 계정으로 로그인하세요" : "새로운 계정을 만들어 시작하세요"}
              </p>
            </div>

            {/* Form Body */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <>
                    {/* Two column layout for name and organization */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold text-gray-700">이름 *</Label>
                        <Input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="h-12 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="organization" className="text-sm font-semibold text-gray-700">소속 *</Label>
                        <Input
                          id="organization"
                          type="text"
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          required
                          className="h-12 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Two column layout for department and position */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="department" className="text-sm font-semibold text-gray-700">부서</Label>
                        <Input
                          id="department"
                          type="text"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="h-12 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="position" className="text-sm font-semibold text-gray-700">직함</Label>
                        <Input
                          id="position"
                          type="text"
                          value={position}
                          onChange={(e) => setPosition(e.target.value)}
                          className="h-12 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobilePhone" className="text-sm font-semibold text-gray-700">휴대전화 *</Label>
                      <Input
                        id="mobilePhone"
                        type="tel"
                        value={mobilePhone}
                        onChange={handlePhoneChange}
                        required
                        className="h-12 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="010-0000-0000"
                        maxLength={13}
                      />
                      <p className="text-xs text-gray-500 mt-1">하이픈(-)은 자동으로 입력됩니다</p>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">이메일(ID) *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">비밀번호 *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    minLength={6}
                  />
                  {!isLogin && (
                    <p className="text-xs text-gray-500 mt-1">최소 6자 이상 입력해주세요</p>
                  )}
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">비밀번호 확인 *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="h-12 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      minLength={6}
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-14 text-base font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
                  disabled={loading}
                >
                  {loading ? "처리중..." : isLogin ? "로그인" : "회원가입"}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                >
                  {isLogin ? "계정이 없으신가요? 회원가입하기" : "이미 계정이 있으신가요? 로그인하기"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
