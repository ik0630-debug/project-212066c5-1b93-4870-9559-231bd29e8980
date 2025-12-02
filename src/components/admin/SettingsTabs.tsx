import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, FileText, MapPin, Home, UserPlus, RefreshCw } from "lucide-react";
import HomeSettings from "./settings/HomeSettings";
import ProgramSettings from "./settings/ProgramSettings";
import LocationSettings from "./settings/LocationSettings";
import RegistrationSettings from "./settings/RegistrationSettings";

interface SettingsTabsProps {
  activeTab: number;
  onTabChange: (tab: number) => void;
  projectSlug?: string;
  settings: any;
  registrationSettings: any;
  registrationFields: any[];
  heroSections: any[];
  infoCardSections: any[];
  descriptions: any[];
  buttonGroups: any[];
  programCards: any[];
  programHeroSections: any[];
  programInfoCardSections: any[];
  programDescriptions: any[];
  programButtonGroups: any[];
  programSectionOrder: string[];
  transportCards: any[];
  locationBottomButtons: any[];
  downloadFiles: any[];
  locationButtonGroups: any[];
  sectionOrder: string[];
  locationSectionOrder: string[];
  registrationHeroSections: any[];
  registrationInfoCardSections: any[];
  registrationDescriptions: any[];
  registrationButtonGroups: any[];
  registrationSectionOrder: string[];
  onSettingChange: (key: string, value: string) => void;
  onRegistrationSettingsChange: (settings: any) => void;
  onRegistrationFieldsChange: (fields: any[]) => void;
  onHeroSectionsChange: (sections: any[]) => void;
  onInfoCardSectionsChange: (sections: any[]) => void;
  onDescriptionsChange: (descriptions: any[]) => void;
  onButtonGroupsChange: (groups: any[]) => void;
  onProgramCardsChange: (cards: any[]) => void;
  onProgramHeroSectionsChange: (sections: any[]) => void;
  onProgramInfoCardSectionsChange: (sections: any[]) => void;
  onProgramDescriptionsChange: (descriptions: any[]) => void;
  onProgramButtonGroupsChange: (groups: any[]) => void;
  onProgramSectionOrderChange: (order: string[]) => void;
  onSaveProgramSectionOrder: (order: string[]) => void;
  onTransportCardsChange: (cards: any[]) => void;
  onLocationBottomButtonsChange: (buttons: any[]) => void;
  onDownloadFilesChange: (files: any[]) => void;
  onLocationButtonGroupsChange: (groups: any[]) => void;
  onSectionOrderChange: (order: string[]) => void;
  onLocationSectionOrderChange: (order: string[]) => void;
  onRegistrationHeroSectionsChange: (sections: any[]) => void;
  onRegistrationInfoCardSectionsChange: (sections: any[]) => void;
  onRegistrationDescriptionsChange: (descriptions: any[]) => void;
  onRegistrationButtonGroupsChange: (groups: any[]) => void;
  onRegistrationSectionOrderChange: (order: string[]) => void;
  onSaveSectionOrder: (order: string[]) => void;
  onSaveLocationSectionOrder: (order: string[]) => void;
  onSaveRegistrationSectionOrder: (order: string[]) => void;
  onSave: (options?: { silent?: boolean }) => void;
}

const SettingsTabs = ({
  activeTab,
  onTabChange,
  projectSlug,
  settings,
  registrationSettings,
  registrationFields,
  heroSections,
  infoCardSections,
  descriptions,
  buttonGroups,
  programCards,
  programHeroSections,
  programInfoCardSections,
  programDescriptions,
  programButtonGroups,
  programSectionOrder,
  transportCards,
  locationBottomButtons,
  downloadFiles,
  locationButtonGroups,
  sectionOrder,
  locationSectionOrder,
  registrationHeroSections,
  registrationInfoCardSections,
  registrationDescriptions,
  registrationButtonGroups,
  registrationSectionOrder,
  onSettingChange,
  onRegistrationSettingsChange,
  onRegistrationFieldsChange,
  onHeroSectionsChange,
  onInfoCardSectionsChange,
  onDescriptionsChange,
  onButtonGroupsChange,
  onProgramCardsChange,
  onProgramHeroSectionsChange,
  onProgramInfoCardSectionsChange,
  onProgramDescriptionsChange,
  onProgramButtonGroupsChange,
  onProgramSectionOrderChange,
  onSaveProgramSectionOrder,
  onTransportCardsChange,
  onLocationBottomButtonsChange,
  onDownloadFilesChange,
  onLocationButtonGroupsChange,
  onSectionOrderChange,
  onLocationSectionOrderChange,
  onRegistrationHeroSectionsChange,
  onRegistrationInfoCardSectionsChange,
  onRegistrationDescriptionsChange,
  onRegistrationButtonGroupsChange,
  onRegistrationSectionOrderChange,
  onSaveSectionOrder,
  onSaveLocationSectionOrder,
  onSaveRegistrationSectionOrder,
  onSave,
}: SettingsTabsProps) => {
  const [previewKey, setPreviewKey] = useState(0);

  const tabs = [
    { icon: Home, label: "홈 화면", value: "0" },
    { icon: FileText, label: "프로그램", value: "1" },
    { icon: UserPlus, label: "참가 신청", value: "2" },
    { icon: MapPin, label: "오시는 길", value: "3" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <HomeSettings
            settings={settings}
            heroSections={heroSections}
            infoCardSections={infoCardSections}
            descriptions={descriptions}
            buttonGroups={buttonGroups}
            sectionOrder={sectionOrder}
            onSettingChange={onSettingChange}
            onHeroSectionsChange={onHeroSectionsChange}
            onInfoCardSectionsChange={onInfoCardSectionsChange}
            onDescriptionsChange={onDescriptionsChange}
            onButtonGroupsChange={onButtonGroupsChange}
            onSectionOrderChange={onSectionOrderChange}
            onSaveSectionOrder={onSaveSectionOrder}
            onSave={onSave}
          />
        );
      case 1:
        return (
          <ProgramSettings
            settings={settings}
            programCards={programCards}
            heroSections={programHeroSections}
            infoCardSections={programInfoCardSections}
            descriptions={programDescriptions}
            buttonGroups={programButtonGroups}
            sectionOrder={programSectionOrder}
            onSettingChange={onSettingChange}
            onProgramCardsChange={onProgramCardsChange}
            onHeroSectionsChange={onProgramHeroSectionsChange}
            onInfoCardSectionsChange={onProgramInfoCardSectionsChange}
            onDescriptionsChange={onProgramDescriptionsChange}
            onButtonGroupsChange={onProgramButtonGroupsChange}
            onSectionOrderChange={onProgramSectionOrderChange}
            onSaveSectionOrder={onSaveProgramSectionOrder}
          />
        );
      case 2:
        return (
          <RegistrationSettings
            registrationSettings={registrationSettings}
            registrationFields={registrationFields}
            heroSections={registrationHeroSections}
            infoCardSections={registrationInfoCardSections}
            descriptions={registrationDescriptions}
            buttonGroups={registrationButtonGroups}
            sectionOrder={registrationSectionOrder}
            onRegistrationSettingsChange={onRegistrationSettingsChange}
            onRegistrationFieldsChange={onRegistrationFieldsChange}
            onHeroSectionsChange={onRegistrationHeroSectionsChange}
            onInfoCardSectionsChange={onRegistrationInfoCardSectionsChange}
            onDescriptionsChange={onRegistrationDescriptionsChange}
            onButtonGroupsChange={onRegistrationButtonGroupsChange}
            onSectionOrderChange={onRegistrationSectionOrderChange}
            onSaveSectionOrder={onSaveRegistrationSectionOrder}
          />
        );
      case 3:
        return (
          <LocationSettings
            settings={settings}
            transportCards={transportCards}
            bottomButtons={locationBottomButtons}
            downloadFiles={downloadFiles}
            buttonGroups={locationButtonGroups}
            sectionOrder={locationSectionOrder}
            onSettingChange={onSettingChange}
            onTransportCardsChange={onTransportCardsChange}
            onBottomButtonsChange={onLocationBottomButtonsChange}
            onDownloadFilesChange={onDownloadFilesChange}
            onButtonGroupsChange={onLocationButtonGroupsChange}
            onSectionOrderChange={onLocationSectionOrderChange}
            onSaveSectionOrder={onSaveLocationSectionOrder}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-[2fr_1fr] gap-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">페이지 설정</h2>
          <Button onClick={() => {
            onSave();
            setTimeout(() => setPreviewKey(prev => prev + 1), 500);
          }} className="bg-gradient-accent text-accent-foreground">
            저장
          </Button>
        </div>

        <Tabs value={activeTab.toString()} onValueChange={(v) => onTabChange(parseInt(v))}>
          <TabsList className="grid w-full grid-cols-4">
            {tabs.map(({ icon: Icon, label, value }) => (
              <TabsTrigger key={value} value={value} className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-6">{renderContent()}</div>
        </Tabs>
      </div>

      <div className="sticky top-6 h-[calc(100vh-200px)]">
        <div className="border rounded-lg overflow-hidden h-full bg-card">
          <div className="p-4 border-b bg-muted/50 flex items-center justify-between">
            <h3 className="font-semibold text-sm">미리보기</h3>
            <Button
              onClick={() => setPreviewKey(prev => prev + 1)}
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="h-[calc(100%-56px)] overflow-auto">
            <iframe
              key={previewKey}
              src={
                projectSlug ? (
                  activeTab === 0 ? `/${projectSlug}?preview=true` :
                  activeTab === 1 ? `/${projectSlug}/program?preview=true` :
                  activeTab === 2 ? `/${projectSlug}/registration?preview=true` :
                  activeTab === 3 ? `/${projectSlug}/location?preview=true` :
                  `/${projectSlug}?preview=true`
                ) : "/"
              }
              className="w-full h-full border-0"
              title="Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTabs;
