import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, FileText, Wrench, UserCog } from "lucide-react";
import RegistrationsTable from "./RegistrationsTable";
import UsersTable from "./UsersTable";
import ApprovalTable from "./ApprovalTable";
import SettingsTabs from "./SettingsTabs";
import ConfigSettings from "./settings/ConfigSettings";
import ProjectMembersTable from "./ProjectMembersTable";

interface AdminTabsProps {
  userRole: 'master' | 'mnc_admin' | 'project_staff' | null;
  activeTab: 'registrations' | 'users' | 'members' | 'page-settings' | 'config';
  onTabChange: (tab: 'registrations' | 'users' | 'members' | 'page-settings' | 'config') => void;
  registrations: any[];
  registrationFormFields: any[];
  users: any[];
  onDeleteRegistration: (id: string) => void;
  onToggleMncAdmin: (userId: string, isMncAdmin: boolean) => void;
  onToggleProjectStaff: (userId: string, isProjectStaff: boolean) => void;
  onApproveUser: (userId: string) => void;
  onRejectUser: (userId: string) => void;
  settingsTabProps: any;
  projectMembers?: any[];
  onUpdateMemberRole?: (memberId: string, role: string) => void;
  onRemoveMember?: (memberId: string) => void;
  onInviteMember?: (email: string, role: string) => Promise<void>;
  projectRole?: 'owner' | 'admin' | 'editor' | 'viewer' | null;
}

const AdminTabs = ({
  userRole,
  activeTab,
  onTabChange,
  registrations,
  registrationFormFields,
  users,
  onDeleteRegistration,
  onToggleMncAdmin,
  onToggleProjectStaff,
  onApproveUser,
  onRejectUser,
  settingsTabProps,
  projectMembers = [],
  onUpdateMemberRole,
  onRemoveMember,
  onInviteMember,
  projectRole,
}: AdminTabsProps) => {
  const allTabs = [
    { icon: FileText, label: "신청 관리", value: "registrations" as const, requireAdmin: false },
    { icon: Users, label: "사용자 관리", value: "users" as const, requireAdmin: true },
    { icon: UserCog, label: "멤버 관리", value: "members" as const, requireAdmin: true },
    { icon: Settings, label: "페이지 설정", value: "page-settings" as const, requireAdmin: true },
    { icon: Wrench, label: "설정", value: "config" as const, requireAdmin: true },
  ];

  // Filter tabs based on role
  const isProjectAdmin = projectRole === 'owner' || projectRole === 'admin';
  const tabs = userRole === 'project_staff' 
    ? allTabs.filter(tab => tab.value === 'registrations')
    : isProjectAdmin 
      ? allTabs 
      : allTabs.filter(tab => !tab.requireAdmin);

  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-5 mb-8">
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
        <UsersTable users={users} onToggleMncAdmin={onToggleMncAdmin} onToggleProjectStaff={onToggleProjectStaff} />
      </TabsContent>

      <TabsContent value="members">
        {onUpdateMemberRole && onRemoveMember && onInviteMember && (
          <ProjectMembersTable
            members={projectMembers}
            onUpdateRole={onUpdateMemberRole}
            onRemove={onRemoveMember}
            onInvite={onInviteMember}
          />
        )}
      </TabsContent>

      <TabsContent value="page-settings">
        <SettingsTabs {...settingsTabProps} />
      </TabsContent>

      <TabsContent value="config">
        <ConfigSettings registrations={registrations} />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
