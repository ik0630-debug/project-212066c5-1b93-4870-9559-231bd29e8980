import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { parseJsonSafely, mergeWithDefaults } from "@/utils/settingsUtils";

export const useRegistrationSettings = () => {
  const [registrationHeroSections, setRegistrationHeroSections] = useState<any[]>([]);
  const [registrationInfoCardSections, setRegistrationInfoCardSections] = useState<any[]>([]);
  const [registrationDescriptions, setRegistrationDescriptions] = useState<any[]>([]);
  const [registrationButtonGroups, setRegistrationButtonGroups] = useState<any[]>([]);
  const [registrationSectionOrder, setRegistrationSectionOrder] = useState<string[]>(["registration_form_fields"]);
  
  const [registrationSettings, setRegistrationSettings] = useState({
    registration_page_title: "참가 신청",
    registration_page_description: "아래 양식을 작성해주세요",
    registration_success_title: "신청이 완료되었습니다!",
    registration_success_description: "신청해 주셔서 감사합니다.",
    registration_enabled: "true",
    registration_header_bg_color: "221 83% 33%",
  });

  const [registrationFields, setRegistrationFields] = useState([
    { id: "name", label: "이름", placeholder: "홍길동", type: "text", required: true, icon: "User" },
    { id: "company", label: "소속", placeholder: "소속 기관명", type: "text", required: true, icon: "Building" },
    { id: "department", label: "부서", placeholder: "부서명", type: "text", required: false, icon: "Briefcase" },
    { id: "position", label: "직함", placeholder: "직위/직급", type: "text", required: true, icon: "Award" },
    { id: "phone", label: "휴대전화", placeholder: "010-0000-0000", type: "tel", required: true, icon: "Smartphone" },
    { id: "email", label: "이메일", placeholder: "example@company.com", type: "email", required: true, icon: "Mail" },
  ]);

  const loadRegistrationSettings = (data: any[]) => {
    const loadedRegistrationHeroSections: any = {};
    const loadedRegistrationInfoCardSections: any = {};
    const loadedRegistrationDescriptions: any = {};
    const loadedRegistrationButtonGroups: any = {};
    const registrationSettingsData: any = {};

    data?.forEach(({ key, value, category }) => {
      if (category !== "registration") return;

      if (key === "registration_section_order") {
        const parsed = parseJsonSafely(value, []);
        setRegistrationSectionOrder(parsed.length > 0 ? parsed : ["registration_form_fields"]);
        return;
      }

      if (key === "registration_fields") {
        const parsed = parseJsonSafely(value);
        if (parsed) {
          setRegistrationFields(parsed);
        }
      } else if (key.startsWith("registration_hero_")) {
        const parsed = parseJsonSafely(value);
        if (parsed) {
          const index = parsed.order || 0;
          loadedRegistrationHeroSections[index] = parsed;
        }
      } else if (key.startsWith("registration_info_card_section_")) {
        const parsed = parseJsonSafely(value);
        if (parsed) {
          const index = parsed.order || 0;
          loadedRegistrationInfoCardSections[index] = parsed;
        }
      } else if (key.startsWith("registration_description_")) {
        const parsed = parseJsonSafely(value);
        if (parsed) {
          const index = parsed.order || 0;
          loadedRegistrationDescriptions[index] = parsed;
        }
      } else if (key.startsWith("registration_button_group_")) {
        const parsed = parseJsonSafely(value);
        if (parsed) {
          const index = parsed.order || 0;
          loadedRegistrationButtonGroups[index] = parsed;
        }
      } else {
        registrationSettingsData[key] = value;
      }
    });

    const registrationHeroSectionsArray = Object.values(loadedRegistrationHeroSections).filter((hero: any) => hero.id);
    const registrationInfoCardSectionsArray = Object.values(loadedRegistrationInfoCardSections).filter((section: any) => section.id);
    const registrationDescriptionsArray = Object.values(loadedRegistrationDescriptions).filter((desc: any) => desc.id);
    const registrationButtonGroupsArray = Object.values(loadedRegistrationButtonGroups).filter((group: any) => group.id);

    setRegistrationHeroSections(registrationHeroSectionsArray);
    setRegistrationInfoCardSections(registrationInfoCardSectionsArray);
    setRegistrationDescriptions(registrationDescriptionsArray);
    setRegistrationButtonGroups(registrationButtonGroupsArray);

    const defaultRegistrationSettings = {
      registration_page_title: "참가 신청",
      registration_page_description: "아래 양식을 작성해주세요",
      registration_success_description: "신청해 주셔서 감사합니다.",
      registration_header_bg_color: "221 83% 33%",
    };

    const mergedRegistrationSettings = mergeWithDefaults(registrationSettingsData, defaultRegistrationSettings);
    setRegistrationSettings(prev => ({ ...prev, ...mergedRegistrationSettings }));
  };

  const getRegistrationSettingsToSave = (projectId: string) => {
    return [
      ...Object.entries(registrationSettings).map(([key, value]) => ({
        category: "registration",
        key,
        value: value.toString(),
        project_id: projectId,
      })),
      {
        category: "registration",
        key: "registration_fields",
        value: JSON.stringify(registrationFields),
        project_id: projectId,
      },
      ...registrationHeroSections.map((hero, index) => ({
        category: "registration",
        key: `registration_hero_${index}`,
        value: JSON.stringify({ ...hero, order: index }),
        project_id: projectId,
      })),
      ...registrationInfoCardSections.map((section, index) => ({
        category: "registration",
        key: `registration_info_card_section_${index}`,
        value: JSON.stringify({ ...section, order: index }),
        project_id: projectId,
      })),
      ...registrationDescriptions.map((desc, index) => ({
        category: "registration",
        key: `registration_description_${index}`,
        value: JSON.stringify({ ...desc, order: index }),
        project_id: projectId,
      })),
      ...registrationButtonGroups.map((group, index) => ({
        category: "registration",
        key: `registration_button_group_${index}`,
        value: JSON.stringify({ ...group, order: index }),
        project_id: projectId,
      })),
      {
        category: "registration",
        key: "registration_section_order",
        value: JSON.stringify(registrationSectionOrder),
        project_id: projectId,
      },
    ];
  };

  const saveRegistrationSectionOrder = async (order: string[], projectId: string) => {
    try {
      if (!projectId) return;
      
      await supabase.from("site_settings").delete()
        .eq("key", "registration_section_order")
        .eq("project_id", projectId);
      await supabase.from("site_settings").insert({
        category: "registration",
        key: "registration_section_order",
        value: JSON.stringify(order),
        project_id: projectId,
      });
    } catch (error) {
      console.error("Error saving registration section order:", error);
    }
  };

  return {
    registrationHeroSections,
    registrationInfoCardSections,
    registrationDescriptions,
    registrationButtonGroups,
    registrationSectionOrder,
    registrationSettings,
    registrationFields,
    setRegistrationHeroSections,
    setRegistrationInfoCardSections,
    setRegistrationDescriptions,
    setRegistrationButtonGroups,
    setRegistrationSectionOrder,
    setRegistrationSettings,
    setRegistrationFields,
    loadRegistrationSettings,
    getRegistrationSettingsToSave,
    saveRegistrationSectionOrder,
  };
};
