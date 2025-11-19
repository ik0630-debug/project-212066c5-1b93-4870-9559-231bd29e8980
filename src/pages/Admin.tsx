import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminTabs from "@/components/admin/AdminTabs";
import { useAdminAuth } from "@/hooks/admin/useAdminAuth";
import { useRegistrations } from "@/hooks/admin/useRegistrations";
import { useUsers } from "@/hooks/admin/useUsers";
import { useSettings } from "@/hooks/admin/useSettings";

const Admin = () => {
  const navigate = useNavigate();
  const { loading, signOut } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'registrations' | 'users' | 'settings'>('registrations');
  const [activeSettingsTab, setActiveSettingsTab] = useState(0);

  const { registrations, registrationFields: registrationFormFields, deleteRegistration } = useRegistrations();
  const { users, toggleAdmin, approveUser, rejectUser } = useUsers();
  const {
    settings,
    registrationSettings,
    registrationFields,
    infoCards,
    bottomButtons,
    programCards,
    transportCards,
    sectionOrder,
    setRegistrationSettings,
    setRegistrationFields,
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
    console.log('Admin: Loading settings...');
    loadSettings();
  }, [loadSettings]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader onBack={() => navigate(-1)} onSignOut={signOut} />
      
      <main className="px-6 py-8">
        <AdminTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          registrations={registrations}
          registrationFormFields={registrationFormFields}
          users={users}
          onDeleteRegistration={deleteRegistration}
          onToggleAdmin={toggleAdmin}
          onApproveUser={approveUser}
          onRejectUser={rejectUser}
          settingsTabProps={{
            activeTab: activeSettingsTab,
            onTabChange: setActiveSettingsTab,
            settings,
            registrationSettings,
            registrationFields,
            infoCards,
            bottomButtons,
            programCards,
            transportCards,
            sectionOrder,
            onSettingChange: handleSettingChange,
            onRegistrationSettingsChange: setRegistrationSettings,
            onRegistrationFieldsChange: setRegistrationFields,
            onInfoCardsChange: setInfoCards,
            onBottomButtonsChange: setBottomButtons,
            onProgramCardsChange: setProgramCards,
            onTransportCardsChange: setTransportCards,
            onSectionOrderChange: setSectionOrder,
            onSaveSectionOrder: saveSectionOrder,
            onSave: saveSettings,
          }}
        />
      </main>
    </div>
  );
};

export default Admin;
