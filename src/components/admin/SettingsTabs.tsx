import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, FileText, MapPin, Home, UserPlus } from "lucide-react";
import HomeSettings from "./settings/HomeSettings";
import ProgramSettings from "./settings/ProgramSettings";
import LocationSettings from "./settings/LocationSettings";
import RegistrationSettings from "./settings/RegistrationSettings";

interface SettingsTabsProps {
  activeTab: number;
  onTabChange: (tab: number) => void;
  settings: any;
  registrationSettings: any;
  registrationFields: any[];
  infoCards: any[];
  bottomButtons: any[];
  programCards: any[];
  transportCards: any[];
  sectionOrder: string[];
  onSettingChange: (key: string, value: string) => void;
  onRegistrationSettingsChange: (settings: any) => void;
  onRegistrationFieldsChange: (fields: any[]) => void;
  onInfoCardsChange: (cards: any[]) => void;
  onBottomButtonsChange: (buttons: any[]) => void;
  onProgramCardsChange: (cards: any[]) => void;
  onTransportCardsChange: (cards: any[]) => void;
  onSectionOrderChange: (order: string[]) => void;
  onSaveSectionOrder: (order: string[]) => void;
  onSave: () => void;
}

const SettingsTabs = ({
  activeTab,
  onTabChange,
  settings,
  registrationSettings,
  registrationFields,
  infoCards,
  bottomButtons,
  programCards,
  transportCards,
  sectionOrder,
  onSettingChange,
  onRegistrationSettingsChange,
  onRegistrationFieldsChange,
  onInfoCardsChange,
  onBottomButtonsChange,
  onProgramCardsChange,
  onTransportCardsChange,
  onSectionOrderChange,
  onSaveSectionOrder,
  onSave,
}: SettingsTabsProps) => {
  const tabs = [
    { icon: Home, label: "홈 화면", value: "0" },
    { icon: FileText, label: "프로그램", value: "1" },
    { icon: MapPin, label: "장소", value: "2" },
    { icon: UserPlus, label: "참가 신청", value: "3" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <HomeSettings
            settings={settings}
            infoCards={infoCards}
            bottomButtons={bottomButtons}
            sectionOrder={sectionOrder}
            onSettingChange={onSettingChange}
            onInfoCardsChange={onInfoCardsChange}
            onBottomButtonsChange={onBottomButtonsChange}
            onSectionOrderChange={onSectionOrderChange}
            onSaveSectionOrder={onSaveSectionOrder}
          />
        );
      case 1:
        return (
          <ProgramSettings
            settings={settings}
            programCards={programCards}
            onSettingChange={onSettingChange}
            onProgramCardsChange={onProgramCardsChange}
          />
        );
      case 2:
        return (
          <LocationSettings
            settings={settings}
            transportCards={transportCards}
            onSettingChange={onSettingChange}
            onTransportCardsChange={onTransportCardsChange}
          />
        );
      case 3:
        return (
          <RegistrationSettings
            registrationSettings={registrationSettings}
            registrationFields={registrationFields}
            onRegistrationSettingsChange={onRegistrationSettingsChange}
            onRegistrationFieldsChange={onRegistrationFieldsChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">사이트 설정</h2>
        <Button onClick={onSave} className="bg-gradient-accent text-accent-foreground">
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
  );
};

export default SettingsTabs;
