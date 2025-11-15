import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, Session } from "@supabase/supabase-js";
import { ArrowLeft, LogOut, Trash2, Shield, ShieldOff, Plus, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  organization: string;
  department: string | null;
  position: string;
  mobile_phone: string;
  created_at: string;
  is_admin: boolean;
}

interface SiteSetting {
  id: string;
  category: string;
  key: string;
  value: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [activeTab, setActiveTab] = useState<'registrations' | 'users' | 'settings'>('registrations');
  const [settingsTab, setSettingsTab] = useState('home');
  const [editingSetting, setEditingSetting] = useState<SiteSetting | null>(null);
  const [newSetting, setNewSetting] = useState({
    category: '',
    key: '',
    value: '',
    description: ''
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate("/auth");
        return;
      }

      setSession(session);
      setUser(session.user);

      // Check if user is admin
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .single();

      if (!roleData) {
        toast({
          title: "접근 권한 없음",
          description: "관리자만 접근할 수 있습니다.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
      loadRegistrations();
      loadUsers();
      loadSettings();
    } catch (error) {
      console.error("Auth check error:", error);
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const loadRegistrations = async () => {
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "데이터 로드 실패",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setRegistrations(data || []);
  };

  const loadUsers = async () => {
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profilesError) {
      toast({
        title: "회원 목록 로드 실패",
        description: profilesError.message,
        variant: "destructive",
      });
      return;
    }

    // Check admin status for each user
    const usersWithRoles = await Promise.all(
      (profilesData || []).map(async (profile) => {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", profile.user_id)
          .eq("role", "admin")
          .maybeSingle();

        return {
          ...profile,
          is_admin: !!roleData,
        };
      })
    );

    setUsers(usersWithRoles);
  };

  const handleGrantAdmin = async (userId: string) => {
    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role: "admin" });

    if (error) {
      toast({
        title: "권한 부여 실패",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "관리자 권한 부여 완료",
      description: "사용자에게 관리자 권한이 부여되었습니다.",
    });

    loadUsers();
  };

  const handleRevokeAdmin = async (userId: string) => {
    if (!confirm("관리자 권한을 제거하시겠습니까?")) return;

    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", "admin");

    if (error) {
      toast({
        title: "권한 제거 실패",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "관리자 권한 제거 완료",
      description: "사용자의 관리자 권한이 제거되었습니다.",
    });

    loadUsers();
  };

  const loadSettings = async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .order("category", { ascending: true })
      .order("key", { ascending: true });

    if (error) {
      toast({
        title: "설정 로드 실패",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setSettings(data || []);
  };

  const handleAddSetting = async () => {
    if (!newSetting.category || !newSetting.key || !newSetting.value) {
      toast({
        title: "입력 오류",
        description: "카테고리, 키, 값은 필수 항목입니다.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("site_settings")
      .insert({
        category: newSetting.category,
        key: newSetting.key,
        value: newSetting.value,
        description: newSetting.description || null,
      });

    if (error) {
      toast({
        title: "설정 추가 실패",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "설정 추가 완료",
      description: "새로운 설정이 추가되었습니다.",
    });

    setNewSetting({ category: '', key: '', value: '', description: '' });
    loadSettings();
  };

  const handleUpdateSetting = async () => {
    if (!editingSetting) return;

    const { error } = await supabase
      .from("site_settings")
      .update({
        category: editingSetting.category,
        key: editingSetting.key,
        value: editingSetting.value,
        description: editingSetting.description,
      })
      .eq("id", editingSetting.id);

    if (error) {
      toast({
        title: "설정 수정 실패",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "설정 수정 완료",
      description: "설정이 업데이트되었습니다.",
    });

    setEditingSetting(null);
    loadSettings();
  };

  const handleDeleteSetting = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const { error } = await supabase
      .from("site_settings")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "설정 삭제 실패",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "설정 삭제 완료",
      description: "설정이 삭제되었습니다.",
    });

    loadSettings();
  };

  const handleQuickUpdate = async (
    category: string,
    key: string,
    value: string
  ) => {
    const existing = settings.find(
      (s) => s.category === category && s.key === key
    );

    if (existing) {
      const { error } = await supabase
        .from("site_settings")
        .update({ value })
        .eq("id", existing.id);

      if (error) {
        toast({
          title: "오류",
          description: "설정 업데이트 중 오류가 발생했습니다.",
          variant: "destructive",
        });
        return;
      }
    } else {
      const { error } = await supabase
        .from("site_settings")
        .insert({ category, key, value });

      if (error) {
        toast({
          title: "오류",
          description: "설정 생성 중 오류가 발생했습니다.",
          variant: "destructive",
        });
        return;
      }
    }

    loadSettings();
  };

  const handleAddInfoCard = async () => {
    const cardCount = settings.filter(
      (s) => s.category === "home" && s.key.startsWith("info_card_")
    ).length;

    const cardData = {
      icon: "Calendar",
      title: "새 카드",
      content: "내용을 입력하세요",
      order: cardCount,
    };

    const { error } = await supabase.from("site_settings").insert({
      category: "home",
      key: `info_card_${Date.now()}`,
      value: JSON.stringify(cardData),
      description: "정보 카드",
    });

    if (error) {
      toast({
        title: "오류",
        description: "카드 추가 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "추가 완료",
      description: "새 카드가 추가되었습니다.",
    });

    loadSettings();
  };

  const handleUpdateInfoCard = async (id: string, cardData: any) => {
    const { error } = await supabase
      .from("site_settings")
      .update({ value: JSON.stringify(cardData) })
      .eq("id", id);

    if (error) {
      toast({
        title: "오류",
        description: "카드 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      return;
    }

    loadSettings();
  };

  const handleAddBottomButton = async () => {
    const buttonCount = settings.filter(
      (s) => s.category === "home" && s.key.startsWith("bottom_button_")
    ).length;

    const buttonData = {
      text: "새 버튼",
      link: "/",
      variant: "outline",
      order: buttonCount,
    };

    const { error } = await supabase.from("site_settings").insert({
      category: "home",
      key: `bottom_button_${Date.now()}`,
      value: JSON.stringify(buttonData),
      description: "하단 버튼",
    });

    if (error) {
      toast({
        title: "오류",
        description: "버튼 추가 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "추가 완료",
      description: "새 버튼이 추가되었습니다.",
    });

    loadSettings();
  };

  const handleUpdateBottomButton = async (id: string, buttonData: any) => {
    const { error } = await supabase
      .from("site_settings")
      .update({ value: JSON.stringify(buttonData) })
      .eq("id", id);

    if (error) {
      toast({
        title: "오류",
        description: "버튼 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      return;
    }

    loadSettings();
  };

  const handleAddProgramCard = async () => {
    const cardCount = settings.filter(
      (s) => s.category === "program" && s.key.startsWith("program_card_")
    ).length;

    const cardData = {
      time: "09:00",
      title: "새 프로그램",
      description: "내용을 입력하세요",
      order: cardCount,
    };

    const { error } = await supabase.from("site_settings").insert({
      category: "program",
      key: `program_card_${Date.now()}`,
      value: JSON.stringify(cardData),
      description: "프로그램 카드",
    });

    if (error) {
      toast({
        title: "오류",
        description: "프로그램 카드 추가 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "추가 완료",
      description: "새 프로그램 카드가 추가되었습니다.",
    });

    loadSettings();
  };

  const handleUpdateProgramCard = async (id: string, cardData: any) => {
    const { error } = await supabase
      .from("site_settings")
      .update({ value: JSON.stringify(cardData) })
      .eq("id", id);

    if (error) {
      toast({
        title: "오류",
        description: "프로그램 카드 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      return;
    }

    loadSettings();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("registrations")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast({
        title: "상태 변경 실패",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "상태 변경 완료",
      description: "신청 상태가 업데이트되었습니다.",
    });

    loadRegistrations();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const { error } = await supabase
      .from("registrations")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "삭제 실패",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "삭제 완료",
      description: "신청이 삭제되었습니다.",
    });

    loadRegistrations();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">로딩중...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-primary text-primary-foreground py-6 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">관리자 페이지</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="px-6 py-8">
        <div className="mb-6 flex gap-4">
          <Button
            variant={activeTab === 'registrations' ? 'default' : 'outline'}
            onClick={() => setActiveTab('registrations')}
          >
            참가 신청 목록
          </Button>
          <Button
            variant={activeTab === 'users' ? 'default' : 'outline'}
            onClick={() => setActiveTab('users')}
          >
            회원 목록
          </Button>
          <Button
            variant={activeTab === 'settings' ? 'default' : 'outline'}
            onClick={() => setActiveTab('settings')}
          >
            사이트 설정
          </Button>
        </div>

        {activeTab === 'registrations' && (
          <div className="bg-card rounded-lg shadow-elegant border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold text-card-foreground">
                참가 신청 목록 ({registrations.length}건)
              </h2>
            </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이름</TableHead>
                  <TableHead>이메일</TableHead>
                  <TableHead>연락처</TableHead>
                  <TableHead>회사</TableHead>
                  <TableHead>특이사항</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>신청일</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((reg) => (
                  <TableRow key={reg.id}>
                    <TableCell className="font-medium">{reg.name}</TableCell>
                    <TableCell>{reg.email}</TableCell>
                    <TableCell>{reg.phone}</TableCell>
                    <TableCell>{reg.company || "-"}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {reg.message || "-"}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={reg.status}
                        onValueChange={(value) => handleStatusChange(reg.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">대기중</SelectItem>
                          <SelectItem value="approved">승인</SelectItem>
                          <SelectItem value="rejected">거부</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {new Date(reg.created_at).toLocaleDateString("ko-KR")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(reg.id)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

            {registrations.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                아직 참가 신청이 없습니다.
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-card rounded-lg shadow-elegant border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold text-card-foreground">
                회원 목록 ({users.length}명)
              </h2>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>소속</TableHead>
                    <TableHead>부서</TableHead>
                    <TableHead>직함</TableHead>
                    <TableHead>휴대전화</TableHead>
                    <TableHead>가입일</TableHead>
                    <TableHead>권한</TableHead>
                    <TableHead>작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.organization}</TableCell>
                      <TableCell>{user.department || "-"}</TableCell>
                      <TableCell>{user.position}</TableCell>
                      <TableCell>{user.mobile_phone}</TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString("ko-KR")}
                      </TableCell>
                      <TableCell>
                        {user.is_admin ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                            <Shield className="w-3 h-3" />
                            관리자
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            일반 회원
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.is_admin ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRevokeAdmin(user.user_id)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <ShieldOff className="w-4 h-4 mr-1" />
                            권한 제거
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleGrantAdmin(user.user_id)}
                            className="text-primary hover:text-primary/80"
                          >
                            <Shield className="w-4 h-4 mr-1" />
                            권한 부여
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {users.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                아직 가입한 회원이 없습니다.
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Settings Sub-tabs */}
            <div className="flex gap-2 border-b border-border pb-2">
              <Button
                variant={settingsTab === 'home' ? 'default' : 'ghost'}
                onClick={() => setSettingsTab('home')}
                size="sm"
              >
                홈 화면
              </Button>
              <Button
                variant={settingsTab === 'program' ? 'default' : 'ghost'}
                onClick={() => setSettingsTab('program')}
                size="sm"
              >
                프로그램
              </Button>
              <Button
                variant={settingsTab === 'location' ? 'default' : 'ghost'}
                onClick={() => setSettingsTab('location')}
                size="sm"
              >
                장소
              </Button>
              <Button
                variant={settingsTab === 'other' ? 'default' : 'ghost'}
                onClick={() => setSettingsTab('other')}
                size="sm">
                기타
              </Button>
            </div>

            {/* Home Settings Tab */}
            {settingsTab === 'home' && (
              <div className="space-y-6">
                <div className="bg-card rounded-lg shadow-elegant border border-border p-6">
                  <h2 className="text-xl font-bold text-card-foreground mb-4">
                    히어로 섹션
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label>배지 텍스트</Label>
                      <Input
                        value={
                          settings.find(
                            (s) => s.category === "home" && s.key === "hero_badge"
                          )?.value || ""
                        }
                        onChange={(e) =>
                          handleQuickUpdate("home", "hero_badge", e.target.value)
                        }
                        placeholder="초대합니다"
                      />
                    </div>
                    <div>
                      <Label>메인 제목 (줄바꿈 가능)</Label>
                      <Textarea
                        value={
                          settings.find(
                            (s) => s.category === "home" && s.key === "hero_title"
                          )?.value || ""
                        }
                        onChange={(e) =>
                          handleQuickUpdate("home", "hero_title", e.target.value)
                        }
                        placeholder="2024 비즈니스&#10;컨퍼런스"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>부제목 (줄바꿈 가능)</Label>
                      <Textarea
                        value={
                          settings.find(
                            (s) => s.category === "home" && s.key === "hero_subtitle"
                          )?.value || ""
                        }
                        onChange={(e) =>
                          handleQuickUpdate("home", "hero_subtitle", e.target.value)
                        }
                        placeholder="미래를 함께 만들어갈&#10;여러분을 초대합니다"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>버튼 텍스트</Label>
                      <Input
                        value={
                          settings.find(
                            (s) => s.category === "home" && s.key === "hero_button_text"
                          )?.value || ""
                        }
                        onChange={(e) =>
                          handleQuickUpdate("home", "hero_button_text", e.target.value)
                        }
                        placeholder="참가 신청하기"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg shadow-elegant border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-card-foreground">
                      정보 카드
                    </h2>
                    <Button onClick={handleAddInfoCard} size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      카드 추가
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {settings
                      .filter(
                        (s) => s.category === "home" && s.key.startsWith("info_card_")
                      )
                      .sort((a, b) => {
                        const aData = JSON.parse(a.value);
                        const bData = JSON.parse(b.value);
                        return (aData.order || 0) - (bData.order || 0);
                      })
                      .map((card) => {
                        const cardData = JSON.parse(card.value);
                        return (
                          <div
                            key={card.id}
                            className="border-2 border-border rounded-lg p-4 space-y-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-lg">
                                {cardData.title || "제목 없음"}
                              </h4>
                              <Button
                                onClick={() => handleDeleteSetting(card.id)}
                                size="sm"
                                variant="destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            <div>
                              <Label>아이콘 (Lucide 아이콘 이름)</Label>
                              <Input
                                value={cardData.icon || ""}
                                onChange={(e) =>
                                  handleUpdateInfoCard(card.id, {
                                    ...cardData,
                                    icon: e.target.value,
                                  })
                                }
                                placeholder="Calendar, MapPin, Users 등"
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                lucide-react 아이콘 이름 (예: Calendar, MapPin, Users)
                              </p>
                            </div>

                            <div>
                              <Label>제목</Label>
                              <Input
                                value={cardData.title || ""}
                                onChange={(e) =>
                                  handleUpdateInfoCard(card.id, {
                                    ...cardData,
                                    title: e.target.value,
                                  })
                                }
                                placeholder="일시"
                              />
                            </div>

                            <div>
                              <Label>내용 (줄바꿈 가능)</Label>
                              <Textarea
                                value={cardData.content || ""}
                                onChange={(e) =>
                                  handleUpdateInfoCard(card.id, {
                                    ...cardData,
                                    content: e.target.value,
                                  })
                                }
                                placeholder="2024년 12월 15일 (금)&#10;오전 9:00 - 오후 6:00"
                                rows={3}
                              />
                            </div>

                            <div>
                              <Label>순서</Label>
                              <Input
                                type="number"
                                value={cardData.order || 0}
                                onChange={(e) =>
                                  handleUpdateInfoCard(card.id, {
                                    ...cardData,
                                    order: parseInt(e.target.value),
                                  })
                                }
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                <div className="bg-card rounded-lg shadow-elegant border border-border p-6">
                  <h2 className="text-xl font-bold text-card-foreground mb-4">
                    행사 소개
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label>제목</Label>
                      <Input
                        value={
                          settings.find(
                            (s) => s.category === "home" && s.key === "description_title"
                          )?.value || ""
                        }
                        onChange={(e) =>
                          handleQuickUpdate("home", "description_title", e.target.value)
                        }
                        placeholder="행사 소개"
                      />
                    </div>
                    <div>
                      <Label>설명 (줄바꿈 가능)</Label>
                      <Textarea
                        value={
                          settings.find(
                            (s) => s.category === "home" && s.key === "description_content"
                          )?.value || ""
                        }
                        onChange={(e) =>
                          handleQuickUpdate("home", "description_content", e.target.value)
                        }
                        placeholder="행사에 대한 설명을 입력하세요"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg shadow-elegant border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-card-foreground">
                      하단 버튼
                    </h2>
                    <Button onClick={handleAddBottomButton} size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      버튼 추가
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {settings
                      .filter(
                        (s) => s.category === "home" && s.key.startsWith("bottom_button_")
                      )
                      .sort((a, b) => {
                        const aData = JSON.parse(a.value);
                        const bData = JSON.parse(b.value);
                        return (aData.order || 0) - (bData.order || 0);
                      })
                      .map((button) => {
                        const buttonData = JSON.parse(button.value);
                        return (
                          <div
                            key={button.id}
                            className="border-2 border-border rounded-lg p-4 space-y-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-lg">
                                {buttonData.text || "텍스트 없음"}
                              </h4>
                              <Button
                                onClick={() => handleDeleteSetting(button.id)}
                                size="sm"
                                variant="destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            <div>
                              <Label>버튼 텍스트</Label>
                              <Input
                                value={buttonData.text || ""}
                                onChange={(e) =>
                                  handleUpdateBottomButton(button.id, {
                                    ...buttonData,
                                    text: e.target.value,
                                  })
                                }
                                placeholder="프로그램 보기"
                              />
                            </div>

                            <div>
                              <Label>버튼 링크 (경로)</Label>
                              <Input
                                value={buttonData.link || ""}
                                onChange={(e) =>
                                  handleUpdateBottomButton(button.id, {
                                    ...buttonData,
                                    link: e.target.value,
                                  })
                                }
                                placeholder="/program"
                              />
                            </div>

                            <div>
                              <Label>버튼 스타일</Label>
                              <Select
                                value={buttonData.variant || "outline"}
                                onValueChange={(value) =>
                                  handleUpdateBottomButton(button.id, {
                                    ...buttonData,
                                    variant: value,
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-popover z-50">
                                  <SelectItem value="default">기본</SelectItem>
                                  <SelectItem value="outline">아웃라인</SelectItem>
                                  <SelectItem value="secondary">보조</SelectItem>
                                  <SelectItem value="ghost">고스트</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label>순서</Label>
                              <Input
                                type="number"
                                value={buttonData.order || 0}
                                onChange={(e) =>
                                  handleUpdateBottomButton(button.id, {
                                    ...buttonData,
                                    order: parseInt(e.target.value),
                                  })
                                }
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* Program Settings Tab */}
            {settingsTab === 'program' && (
              <div className="space-y-6">
                <div className="bg-card rounded-lg shadow-elegant border border-border p-6">
                  <h2 className="text-xl font-bold text-card-foreground mb-4">
                    프로그램 페이지 설정
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <Label htmlFor="program_title">페이지 제목</Label>
                      <Input
                        id="program_title"
                        value={
                          settings.find(
                            (s) =>
                              s.category === "program" && s.key === "page_title"
                          )?.value || ""
                        }
                        onChange={(e) =>
                          handleQuickUpdate("program", "page_title", e.target.value)
                        }
                        placeholder="프로그램"
                      />
                    </div>
                    <div>
                      <Label htmlFor="program_description">페이지 설명</Label>
                      <Textarea
                        id="program_description"
                        value={
                          settings.find(
                            (s) =>
                              s.category === "program" && s.key === "page_description"
                          )?.value || ""
                        }
                        onChange={(e) =>
                          handleQuickUpdate("program", "page_description", e.target.value)
                        }
                        placeholder="행사 프로그램을 안내합니다"
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">프로그램 일정</h3>
                    <Button
                      onClick={handleAddProgramCard}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      프로그램 추가
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {settings
                      .filter(
                        (s) =>
                          s.category === "program" &&
                          s.key.startsWith("program_card_")
                      )
                      .sort((a, b) => {
                        const aData = JSON.parse(a.value);
                        const bData = JSON.parse(b.value);
                        return (aData.order || 0) - (bData.order || 0);
                      })
                      .map((card) => {
                        const cardData = JSON.parse(card.value);
                        return (
                          <div
                            key={card.id}
                            className="border-2 border-border rounded-lg p-4 space-y-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-lg">
                                {cardData.time} - {cardData.title || "제목 없음"}
                              </h4>
                              <Button
                                onClick={() => handleDeleteSetting(card.id)}
                                size="sm"
                                variant="destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <Label>시간</Label>
                                <Input
                                  type="time"
                                  value={cardData.time || "09:00"}
                                  onChange={(e) =>
                                    handleUpdateProgramCard(card.id, {
                                      ...cardData,
                                      time: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <Label>제목</Label>
                                <Input
                                  value={cardData.title || ""}
                                  onChange={(e) =>
                                    handleUpdateProgramCard(card.id, {
                                      ...cardData,
                                      title: e.target.value,
                                    })
                                  }
                                  placeholder="프로그램 제목"
                                />
                              </div>
                            </div>

                            <div>
                              <Label>설명 (줄바꿈 가능)</Label>
                              <Textarea
                                value={cardData.description || ""}
                                onChange={(e) =>
                                  handleUpdateProgramCard(card.id, {
                                    ...cardData,
                                    description: e.target.value,
                                  })
                                }
                                placeholder="프로그램에 대한 상세 설명을 입력하세요"
                                rows={3}
                              />
                            </div>

                            <div>
                              <Label>순서</Label>
                              <Input
                                type="number"
                                value={cardData.order || 0}
                                onChange={(e) =>
                                  handleUpdateProgramCard(card.id, {
                                    ...cardData,
                                    order: parseInt(e.target.value),
                                  })
                                }
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* Location Settings Tab */}
            {settingsTab === 'location' && (
              <div className="bg-card rounded-lg shadow-elegant border border-border p-6">
                <h2 className="text-xl font-bold text-card-foreground mb-4">
                  장소 페이지 설정
                </h2>
                <p className="text-muted-foreground">
                  장소 페이지 설정 기능은 추후 구현 예정입니다.
                </p>
              </div>
            )}

            {/* Other Settings Tab - Original content */}
            {settingsTab === 'other' && (
              <div className="space-y-6">
                {/* Add New Setting Form */}
                <div className="bg-card rounded-lg shadow-elegant border border-border p-6">
                  <h2 className="text-xl font-bold text-card-foreground mb-4">
                    새 설정 추가
                  </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">카테고리 *</Label>
                  <Input
                    id="category"
                    placeholder="예: 행사정보, 프로그램, 위치정보"
                    value={newSetting.category}
                    onChange={(e) => setNewSetting({ ...newSetting, category: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="key">키 *</Label>
                  <Input
                    id="key"
                    placeholder="예: event_title, program_description"
                    value={newSetting.key}
                    onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="value">값 *</Label>
                  <Textarea
                    id="value"
                    placeholder="설정 값을 입력하세요"
                    value={newSetting.value}
                    onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description">설명</Label>
                  <Input
                    id="description"
                    placeholder="이 설정에 대한 설명 (선택사항)"
                    value={newSetting.description}
                    onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleAddSetting} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                추가
              </Button>
            </div>

            {/* Settings List */}
            <div className="bg-card rounded-lg shadow-elegant border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-bold text-card-foreground">
                  설정 목록 ({settings.length}개)
                </h2>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>카테고리</TableHead>
                      <TableHead>키</TableHead>
                      <TableHead>값</TableHead>
                      <TableHead>설명</TableHead>
                      <TableHead>수정일</TableHead>
                      <TableHead>작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {settings.map((setting) => (
                      <TableRow key={setting.id}>
                        {editingSetting?.id === setting.id ? (
                          <>
                            <TableCell>
                              <Input
                                value={editingSetting.category}
                                onChange={(e) => setEditingSetting({ ...editingSetting, category: e.target.value })}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={editingSetting.key}
                                onChange={(e) => setEditingSetting({ ...editingSetting, key: e.target.value })}
                              />
                            </TableCell>
                            <TableCell>
                              <Textarea
                                value={editingSetting.value}
                                onChange={(e) => setEditingSetting({ ...editingSetting, value: e.target.value })}
                                rows={2}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={editingSetting.description || ''}
                                onChange={(e) => setEditingSetting({ ...editingSetting, description: e.target.value })}
                              />
                            </TableCell>
                            <TableCell>
                              {new Date(setting.updated_at).toLocaleDateString("ko-KR")}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleUpdateSetting}
                                >
                                  저장
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingSetting(null)}
                                >
                                  취소
                                </Button>
                              </div>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell className="font-medium">{setting.category}</TableCell>
                            <TableCell className="font-mono text-sm">{setting.key}</TableCell>
                            <TableCell className="max-w-xs truncate">{setting.value}</TableCell>
                            <TableCell className="text-muted-foreground">{setting.description || "-"}</TableCell>
                            <TableCell>
                              {new Date(setting.updated_at).toLocaleDateString("ko-KR")}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingSetting(setting)}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteSetting(setting.id)}
                                  className="text-destructive hover:text-destructive/80"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {settings.filter((s) => !["home", "program", "location"].includes(s.category)).length === 0 && (
                <div className="p-12 text-center text-muted-foreground">
                  아직 기타 설정이 없습니다.
                </div>
              )}
            </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
