import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { ArrowLeft, LogOut, Settings, Users, FileText, MapPin, Home, UserPlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RegistrationsTable from "@/components/admin/RegistrationsTable";
import UsersTable from "@/components/admin/UsersTable";
import HomeSettings from "@/components/admin/settings/HomeSettings";
import ProgramSettings from "@/components/admin/settings/ProgramSettings";
import LocationSettings from "@/components/admin/settings/LocationSettings";
import RegistrationSettings from "@/components/admin/settings/RegistrationSettings";
import { useRegistrations } from "@/hooks/admin/useRegistrations";
import { useUsers } from "@/hooks/admin/useUsers";
import { useSettings } from "@/hooks/admin/useSettings";

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'registrations' | 'users' | 'settings'>('registrations');
  const [activeSettingsTab, setActiveSettingsTab] = useState(0);
  const tabs = ["홈 화면", "프로그램", "장소", "참가 신청"];

  const {
    registrations,
    loadRegistrations,
    deleteRegistration,
  } = useRegistrations();

  const {
    users,
    loadUsers,
    toggleAdmin,
  } = useUsers();

  const {
    settings,
    registrationSettings,
    infoCards,
    bottomButtons,
    programCards,
    transportCards,
    sectionOrder,
    setRegistrationSettings,
    setInfoCards,
    setBottomButtons,
    setProgramCards,
    setTransportCards,
    setSectionOrder,
    loadSettings,
    saveSettings,
    handleSettingChange,
    saveSectionOrder,
  } = useSettings();

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
      setUser(session.user);
      
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .single();
      
      if (!roleData) {
        navigate("/");
        return;
      }

      loadRegistrations();
      loadUsers();
      loadSettings();
    } catch (error) {
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const renderSettingsTab = () => {
    switch (tabs[activeSettingsTab]) {
      case "홈 화면":
        return (
          <HomeSettings
            settings={settings}
            infoCards={infoCards}
            bottomButtons={bottomButtons}
            sectionOrder={sectionOrder}
            onSettingChange={handleSettingChange}
            onInfoCardsChange={setInfoCards}
            onBottomButtonsChange={setBottomButtons}
            onSectionOrderChange={setSectionOrder}
            onSaveSectionOrder={saveSectionOrder}
          />
        );

      case "프로그램":
        return (
          <ProgramSettings
            settings={settings}
            programCards={programCards}
            onSettingChange={handleSettingChange}
            onProgramCardsChange={setProgramCards}
          />
        );

      case "장소":
        return (
          <LocationSettings
            settings={settings}
            transportCards={transportCards}
            onSettingChange={handleSettingChange}
            onTransportCardsChange={setTransportCards}
          />
        );

      case "참가 신청":
        return (
          <RegistrationSettings
            registrationSettings={registrationSettings}
            onRegistrationSettingsChange={setRegistrationSettings}
          />
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-primary text-primary-foreground py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">관리자 페이지</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="px-6 py-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="registrations" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              신청 관리
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              사용자 관리
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              사이트 설정
            </TabsTrigger>
          </TabsList>

          <TabsContent value="registrations">
            <RegistrationsTable
              registrations={registrations}
              onDelete={deleteRegistration}
            />
          </TabsContent>

          <TabsContent value="users">
            <UsersTable users={users} onToggleAdmin={toggleAdmin} />
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">사이트 설정</h2>
                <Button
                  onClick={saveSettings}
                  className="bg-gradient-accent text-accent-foreground"
                >
                  저장
                </Button>
              </div>

              <Tabs
                value={activeSettingsTab.toString()}
                onValueChange={(v) => setActiveSettingsTab(parseInt(v))}
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="0" className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    홈 화면
                  </TabsTrigger>
                  <TabsTrigger value="1" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    프로그램
                  </TabsTrigger>
                  <TabsTrigger value="2" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    장소
                  </TabsTrigger>
                  <TabsTrigger value="3" className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    참가 신청
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6">{renderSettingsTab()}</div>
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
