import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, FileText } from "lucide-react";
import RegistrationsTable from "./RegistrationsTable";
import UsersTable from "./UsersTable";
import ApprovalTable from "./ApprovalTable";
import SettingsTabs from "./SettingsTabs";

interface AdminTabsProps {
  activeTab: 'registrations' | 'users' | 'settings';
  onTabChange: (tab: 'registrations' | 'users' | 'settings') => void;
  registrations: any[];
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
    { icon: Settings, label: "사이트 설정", value: "settings" as const },
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-3 mb-8">
        {tabs.map(({ icon: Icon, label, value }) => (
          <TabsTrigger key={value} value={value} className="flex items-center gap-2">
            <Icon className="w-4 h-4" />
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="registrations">
        <RegistrationsTable registrations={registrations} onDelete={onDeleteRegistration} />
      </TabsContent>

      <TabsContent value="users" className="space-y-8">
        <ApprovalTable 
          users={users} 
          onApprove={onApproveUser}
          onReject={onRejectUser}
        />
        <UsersTable users={users} onToggleAdmin={onToggleAdmin} />
      </TabsContent>

      <TabsContent value="settings">
        <SettingsTabs {...settingsTabProps} />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
