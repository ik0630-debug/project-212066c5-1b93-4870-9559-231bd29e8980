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
  onSave: (options?: { silent?: boolean }) => void;
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
  const [previewKey, setPreviewKey] = useState(0);

  const tabs = [
    { icon: Home, label: "홈 화면", value: "0" },
    { icon: FileText, label: "프로그램", value: "1" },
    { icon: UserPlus, label: "참가 신청", value: "2" },
    { icon: MapPin, label: "장소", value: "3" },
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
            onSave={onSave}
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
          <RegistrationSettings
            registrationSettings={registrationSettings}
            registrationFields={registrationFields}
            onRegistrationSettingsChange={onRegistrationSettingsChange}
            onRegistrationFieldsChange={onRegistrationFieldsChange}
          />
        );
      case 3:
        return (
          <LocationSettings
            settings={settings}
            transportCards={transportCards}
            onSettingChange={onSettingChange}
            onTransportCardsChange={onTransportCardsChange}
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
          <h2 className="text-xl font-semibold">사이트 설정</h2>
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
                activeTab === 0 ? "/" :
                activeTab === 1 ? "/program" :
                activeTab === 2 ? "/registration" :
                activeTab === 3 ? "/location" :
                "/"
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
