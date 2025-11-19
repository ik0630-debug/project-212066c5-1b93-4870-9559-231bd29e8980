import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { ArrowLeft } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  // Profile fields
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [officePhone, setOfficePhone] = useState("");
  const [mobilePhone, setMobilePhone] = useState("");
  const [email, setEmail] = useState("");
  
  // Password fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      navigate("/auth");
      return;
    }
    
    setUser(session.user);
    loadProfile(session.user.id);
  };

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      toast({
        title: "오류 발생",
        description: "프로필 정보를 불러오는데 실패했습니다.",
        variant: "destructive",
      });
      return;
    }

    if (data) {
      setName(data.name);
      setOrganization(data.organization);
      setDepartment(data.department || "");
      setPosition(data.position);
      setOfficePhone(data.office_phone || "");
      setMobilePhone(data.mobile_phone);
      setEmail(data.email);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          name,
          organization,
          department: department || null,
          position,
          office_phone: officePhone || null,
          mobile_phone: mobilePhone,
          email,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "수정 완료",
        description: "프로필 정보가 성공적으로 수정되었습니다.",
      });
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

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "오류 발생",
        description: "비밀번호가 일치하지 않습니다.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "오류 발생",
        description: "비밀번호는 최소 6자 이상이어야 합니다.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: "변경 완료",
        description: "비밀번호가 성공적으로 변경되었습니다.",
      });

      setNewPassword("");
      setConfirmPassword("");
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-[800px] mx-auto">
        <header className="bg-gradient-primary text-primary-foreground py-4 px-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">내 정보 관리</h1>
        </header>

        <main className="px-6 py-8">
          <div className="space-y-8">

        {/* Profile Update Form */}
        <div className="bg-card rounded-lg p-6 shadow-elegant border border-border mb-8">
          <h2 className="text-xl font-bold text-card-foreground mb-6">프로필 정보</h2>
          
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름 *</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">소속 *</Label>
              <Input
                id="organization"
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="회사명"
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">부서</Label>
              <Input
                id="department"
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="영업부"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">직함 *</Label>
              <Input
                id="position"
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="대리"
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="officePhone">유선전화</Label>
              <Input
                id="officePhone"
                type="tel"
                value={officePhone}
                onChange={(e) => setOfficePhone(e.target.value)}
                placeholder="02-0000-0000"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobilePhone">휴대전화 *</Label>
              <Input
                id="mobilePhone"
                type="tel"
                value={mobilePhone}
                onChange={(e) => setMobilePhone(e.target.value)}
                placeholder="010-0000-0000"
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일 *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                className="h-12"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-accent text-accent-foreground font-bold shadow-glow hover:opacity-90 transition-opacity"
              disabled={loading}
            >
              {loading ? "처리중..." : "프로필 수정"}
            </Button>
          </form>
        </div>

        {/* Password Update Form */}
        <div className="bg-card rounded-lg p-6 shadow-elegant border border-border mb-8">
          <h2 className="text-xl font-bold text-card-foreground mb-6">비밀번호 변경</h2>
          
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">새 비밀번호 *</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-12"
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인 *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-12"
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-accent text-accent-foreground font-bold shadow-glow hover:opacity-90 transition-opacity"
              disabled={loading}
            >
              {loading ? "처리중..." : "비밀번호 변경"}
            </Button>
          </form>
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full h-12"
        >
          로그아웃
        </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
