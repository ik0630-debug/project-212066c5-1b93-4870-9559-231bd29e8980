import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, FileText, Wrench } from "lucide-react";
import RegistrationsTable from "./RegistrationsTable";
import UsersTable from "./UsersTable";
import ApprovalTable from "./ApprovalTable";
import SettingsTabs from "./SettingsTabs";

interface AdminTabsProps {
  activeTab: 'registrations' | 'users' | 'page-settings' | 'config';
  onTabChange: (tab: 'registrations' | 'users' | 'page-settings' | 'config') => void;
  registrations: any[];
  registrationFormFields: any[];
  users: any[];
  onDeleteRegistration: (id: string) => void;
  onToggleAdmin: (userId: string, isAdmin: boolean) => void;
  onApproveUser: (userId: string) => void;
  onRejectUser: (userId: string) => void;
  settingsTabProps: any;
}

const AdminTabs = ({
  activeTab,
  onTabChange,
  registrations,
  registrationFormFields,
  users,
  onDeleteRegistration,
  onToggleAdmin,
  onApproveUser,
  onRejectUser,
  settingsTabProps,
}: AdminTabsProps) => {
  const tabs = [
    { icon: FileText, label: "신청 관리", value: "registrations" as const },
    { icon: Users, label: "사용자 관리", value: "users" as const },
    { icon: Settings, label: "페이지 설정", value: "page-settings" as const },
    { icon: Wrench, label: "설정", value: "config" as const },
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-4 mb-8">
        {tabs.map(({ icon: Icon, label, value }) => (
          <TabsTrigger key={value} value={value} className="flex items-center gap-2">
            <Icon className="w-4 h-4" />
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="registrations">
        <RegistrationsTable 
          registrations={registrations} 
          registrationFormFields={registrationFormFields}
          onDelete={onDeleteRegistration} 
        />
      </TabsContent>

      <TabsContent value="users" className="space-y-8">
        <ApprovalTable 
          users={users} 
          onApprove={onApproveUser}
          onReject={onRejectUser}
        />
        <UsersTable users={users} onToggleAdmin={onToggleAdmin} />
      </TabsContent>

      <TabsContent value="page-settings">
        <SettingsTabs {...settingsTabProps} />
      </TabsContent>

      <TabsContent value="config">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">설정</h2>
          <p className="text-muted-foreground">QR코드 생성 및 자동 이메일 발송 기능이 추가될 예정입니다.</p>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
