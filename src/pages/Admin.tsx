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
  const { userRole, loading, signOut } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'registrations' | 'users' | 'page-settings' | 'config'>('registrations');
  const [activeSettingsTab, setActiveSettingsTab] = useState(0);

  const { registrations, registrationFields: registrationFormFields, deleteRegistration } = useRegistrations();
  const { users, toggleAdmin, toggleRegistrationManager, approveUser, rejectUser } = useUsers();
  const {
    settings,
    registrationSettings,
    registrationFields,
    heroSections,
    infoCardSections,
    descriptions,
    buttonGroups,
    programCards,
    transportCards,
    locationBottomButtons,
    downloadFiles,
    sectionOrder,
    locationSectionOrder,
    setRegistrationSettings,
    setRegistrationFields,
    setHeroSections,
    setInfoCardSections,
    setDescriptions,
    setButtonGroups,
    setProgramCards,
    setTransportCards,
    setLocationBottomButtons,
    setDownloadFiles,
    setSectionOrder,
    setLocationSectionOrder,
    loadSettings,
    saveSettings,
    handleSettingChange,
    saveSectionOrder,
    saveLocationSectionOrder,
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
    <div className="min-h-screen bg-background animate-fade-in">
      <AdminHeader onBack={() => navigate(-1)} onSignOut={signOut} />
      
      <main className="px-6 py-8">
        <AdminTabs
          userRole={userRole}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          registrations={registrations}
          registrationFormFields={registrationFormFields}
          users={users}
          onDeleteRegistration={deleteRegistration}
          onToggleAdmin={toggleAdmin}
          onToggleRegistrationManager={toggleRegistrationManager}
          onApproveUser={approveUser}
          onRejectUser={rejectUser}
          settingsTabProps={{
            activeTab: activeSettingsTab,
            onTabChange: setActiveSettingsTab,
            settings,
            registrationSettings,
            registrationFields,
            heroSections,
            infoCardSections,
            descriptions,
            buttonGroups,
            programCards,
            transportCards,
            locationBottomButtons,
            downloadFiles,
            sectionOrder,
            locationSectionOrder,
            onSettingChange: handleSettingChange,
            onRegistrationSettingsChange: setRegistrationSettings,
            onRegistrationFieldsChange: setRegistrationFields,
            onHeroSectionsChange: setHeroSections,
            onInfoCardSectionsChange: setInfoCardSections,
            onDescriptionsChange: setDescriptions,
            onButtonGroupsChange: setButtonGroups,
            onProgramCardsChange: setProgramCards,
            onTransportCardsChange: setTransportCards,
            onLocationBottomButtonsChange: setLocationBottomButtons,
            onDownloadFilesChange: setDownloadFiles,
            onSectionOrderChange: setSectionOrder,
            onLocationSectionOrderChange: setLocationSectionOrder,
            onSaveSectionOrder: saveSectionOrder,
            onSaveLocationSectionOrder: saveLocationSectionOrder,
            onSave: saveSettings,
          }}
        />
      </main>
    </div>
  );
};

export default Admin;
