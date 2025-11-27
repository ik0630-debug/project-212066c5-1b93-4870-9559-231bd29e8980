import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/admin/useAdminAuth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogOut, ArrowLeft } from "lucide-react";

interface TestResult {
  test: string;
  success: boolean;
  message: string;
  timestamp: string;
}

export default function AdminDebug() {
  const navigate = useNavigate();
  const { projectSlug } = useParams();
  const { user, userRole, loading, signOut } = useAdminAuth();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [userRoles, setUserRoles] = useState<any[]>([]);
  const [projectMemberships, setProjectMemberships] = useState<any[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isTestLoading, setIsTestLoading] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      loadUserDebugInfo();
    }
  }, [user, loading]);

  const loadUserDebugInfo = async () => {
    if (!user) return;

    try {
      // Get user info
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUserInfo(authUser);

      // Get user roles
      const { data: roles } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", user.id);
      setUserRoles(roles || []);

      // Get project memberships
      const { data: memberships } = await supabase
        .from("project_members")
        .select("*, projects(name, slug)")
        .eq("user_id", user.id);
      setProjectMemberships(memberships || []);
    } catch (error: any) {
      console.error("Error loading debug info:", error);
    }
  };

  const addTestResult = (test: string, success: boolean, message: string) => {
    const result: TestResult = {
      test,
      success,
      message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setTestResults((prev) => [result, ...prev]);
  };

  const testProjectInsert = async () => {
    setIsTestLoading(true);
    const testSlug = `test-${Date.now()}`;
    
    try {
      console.log("Testing project insert with user:", user?.id);
      
      const { data, error } = await supabase
        .from("projects")
        .insert({
          name: "디버그 테스트 프로젝트",
          slug: testSlug,
          description: "RLS 정책 테스트용 프로젝트",
          created_by: user?.id,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        console.error("Insert error:", error);
        addTestResult(
          "프로젝트 생성",
          false,
          `실패: ${error.message} (코드: ${error.code})`
        );
      } else {
        console.log("Insert success:", data);
        addTestResult("프로젝트 생성", true, `성공: ${data.name} (ID: ${data.id})`);
        
        // Clean up - delete the test project
        await supabase.from("projects").delete().eq("id", data.id);
      }
    } catch (error: any) {
      console.error("Test error:", error);
      addTestResult("프로젝트 생성", false, `예외 발생: ${error.message}`);
    } finally {
      setIsTestLoading(false);
    }
  };

  const testProjectSelect = async () => {
    setIsTestLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .limit(5);

      if (error) {
        addTestResult("프로젝트 조회", false, `실패: ${error.message}`);
      } else {
        addTestResult(
          "프로젝트 조회",
          true,
          `성공: ${data?.length || 0}개의 프로젝트 조회`
        );
      }
    } catch (error: any) {
      addTestResult("프로젝트 조회", false, `예외 발생: ${error.message}`);
    } finally {
      setIsTestLoading(false);
    }
  };

  const testProjectMemberInsert = async () => {
    setIsTestLoading(true);
    
    try {
      // First create a test project
      const testSlug = `test-member-${Date.now()}`;
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          name: "멤버 테스트 프로젝트",
          slug: testSlug,
          created_by: user?.id,
        })
        .select()
        .single();

      if (projectError) {
        addTestResult(
          "프로젝트 멤버 추가",
          false,
          `프로젝트 생성 실패: ${projectError.message}`
        );
        return;
      }

      // Try to add member
      const { data: member, error: memberError } = await supabase
        .from("project_members")
        .insert({
          project_id: project.id,
          user_id: user?.id,
          role: "owner",
        })
        .select()
        .single();

      if (memberError) {
        addTestResult(
          "프로젝트 멤버 추가",
          false,
          `실패: ${memberError.message}`
        );
      } else {
        addTestResult("프로젝트 멤버 추가", true, `성공: owner 역할로 추가됨`);
      }

      // Clean up
      await supabase.from("projects").delete().eq("id", project.id);
    } catch (error: any) {
      addTestResult("프로젝트 멤버 추가", false, `예외 발생: ${error.message}`);
    } finally {
      setIsTestLoading(false);
    }
  };

  const testAuthSession = async () => {
    setIsTestLoading(true);
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        addTestResult("세션 확인", false, `실패: ${error.message}`);
      } else if (session) {
        addTestResult(
          "세션 확인",
          true,
          `활성 세션 존재 (만료: ${new Date(session.expires_at! * 1000).toLocaleString()})`
        );
      } else {
        addTestResult("세션 확인", false, "세션이 존재하지 않음");
      }
    } catch (error: any) {
      addTestResult("세션 확인", false, `예외 발생: ${error.message}`);
    } finally {
      setIsTestLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!user || !userRole) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-primary text-primary-foreground py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/${projectSlug}/admin`)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">RLS 디버그 페이지</h1>
              <p className="text-sm opacity-90 mt-1">
                {user.email} ({userRole})
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>
      
      <div className="container mx-auto py-8 px-4 space-y-6">
        <div>
          <h2 className="text-xl font-semibold">권한 및 정책 테스트</h2>
          <p className="text-muted-foreground mt-1">
            Row Level Security 정책을 테스트하고 권한을 확인합니다.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>사용자 정보</CardTitle>
              <CardDescription>현재 로그인한 사용자의 정보</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">User ID</div>
                <div className="font-mono text-sm break-all">{user.id}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">이메일</div>
                <div className="text-sm">{user.email}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">역할</div>
                <Badge variant="secondary">{userRole}</Badge>
              </div>
              <Separator />
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  전체 역할 목록
                </div>
                <div className="space-y-1">
                  {userRoles.length > 0 ? (
                    userRoles.map((role) => (
                      <Badge key={role.id} variant="outline">
                        {role.role}
                      </Badge>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">역할 없음</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Memberships Card */}
          <Card>
            <CardHeader>
              <CardTitle>프로젝트 멤버십</CardTitle>
              <CardDescription>소속된 프로젝트 목록</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[250px]">
                <div className="space-y-3">
                  {projectMemberships.length > 0 ? (
                    projectMemberships.map((membership) => (
                      <div key={membership.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-medium">
                            {membership.projects?.name || "알 수 없음"}
                          </div>
                          <Badge variant="secondary">{membership.role}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {membership.projects?.slug}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      소속된 프로젝트가 없습니다.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Test Controls Card */}
        <Card>
          <CardHeader>
            <CardTitle>RLS 정책 테스트</CardTitle>
            <CardDescription>
              각 버튼을 클릭하여 RLS 정책을 테스트합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Button
                onClick={testAuthSession}
                disabled={isTestLoading}
                variant="outline"
              >
                세션 확인
              </Button>
              <Button
                onClick={testProjectSelect}
                disabled={isTestLoading}
                variant="outline"
              >
                프로젝트 조회
              </Button>
              <Button
                onClick={testProjectInsert}
                disabled={isTestLoading}
                variant="outline"
              >
                프로젝트 생성
              </Button>
              <Button
                onClick={testProjectMemberInsert}
                disabled={isTestLoading}
                variant="outline"
              >
                멤버 추가
              </Button>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={clearResults}
                disabled={testResults.length === 0}
                variant="ghost"
                size="sm"
              >
                결과 지우기
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results Card */}
        <Card>
          <CardHeader>
            <CardTitle>테스트 결과</CardTitle>
            <CardDescription>최근 테스트 결과가 표시됩니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {testResults.length > 0 ? (
                  testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg ${
                        result.success
                          ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                          : "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={result.success ? "default" : "destructive"}
                          >
                            {result.test}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {result.timestamp}
                          </span>
                        </div>
                        <Badge variant={result.success ? "outline" : "destructive"}>
                          {result.success ? "성공" : "실패"}
                        </Badge>
                      </div>
                      <div className="text-sm">{result.message}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    테스트를 실행하면 결과가 여기에 표시됩니다.
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
