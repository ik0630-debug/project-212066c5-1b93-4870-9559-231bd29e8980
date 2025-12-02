import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import SortableTransportCard from "@/components/SortableTransportCard";
import SortableButton from "@/components/SortableButton";
import { ColorPicker } from "@/components/ColorPicker";
import ImageUpload from "@/components/ImageUpload";
import { SettingsSectionControls } from "./SettingsSectionControls";

export const getSectionTitle = (sectionId: string): string => {
  switch (sectionId) {
    case "hero_image": return "이미지";
    case "description_buttons": return "안내 메시지 & 버튼";
    case "location_info": return "장소 정보";
    case "transport_info": return "교통 정보";
    case "contact_info": return "연락처";
    default:
      if (sectionId.startsWith("button_group_")) return "버튼";
      return sectionId;
  }
};

interface RenderLocationSectionProps {
  sectionId: string;
  index: number;
  sectionOrder: string[];
  settings: any;
  transportCards: any[];
  buttonGroups: any[];
  unifiedButtons: any[];
  onSettingChange: (key: string, value: string) => void;
  handleAddTransportCard: () => void;
  handleUpdateTransportCard: (id: string, data: any) => void;
  handleDeleteTransportCard: (index: number) => void;
  handleDragEndTransportCards: (event: DragEndEvent) => void;
  handleAddUnifiedButton: () => void;
  handleUpdateUnifiedButton: (index: number, data: any) => void;
  handleDeleteUnifiedButton: (index: number) => void;
  handleDragEndUnifiedButtons: (event: DragEndEvent) => void;
  handleMoveSectionUp: (index: number) => void;
  handleMoveSectionDown: (index: number) => void;
  handleRemoveSection: (sectionId: string) => void;
  onButtonGroupsChange: (groups: any[]) => void;
}

export const renderLocationSection = (props: RenderLocationSectionProps) => {
  const {
    sectionId,
    index,
    sectionOrder,
    settings,
    transportCards,
    buttonGroups,
    unifiedButtons,
    onSettingChange,
    handleAddTransportCard,
    handleUpdateTransportCard,
    handleDeleteTransportCard,
    handleDragEndTransportCards,
    handleAddUnifiedButton,
    handleUpdateUnifiedButton,
    handleDeleteUnifiedButton,
    handleDragEndUnifiedButtons,
    handleMoveSectionUp,
    handleMoveSectionDown,
    handleRemoveSection,
    onButtonGroupsChange,
  } = props;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const SectionControls = ({
    title,
    index,
    sectionId
  }: {
    title: string;
    index: number;
    sectionId: string;
  }) => (
    <SettingsSectionControls
      title={title}
      index={index}
      sectionId={sectionId}
      sectionOrder={sectionOrder}
      isCollapsed={false}
      onToggle={() => {}}
      onMoveUp={handleMoveSectionUp}
      onMoveDown={handleMoveSectionDown}
      onDelete={() => handleRemoveSection(sectionId)}
    />
  );

  switch (sectionId) {
    case "hero_image":
      return (
        <div key={sectionId} className="space-y-4">
          <SectionControls title={getSectionTitle(sectionId)} index={index} sectionId={sectionId} />
          <div className="space-y-4">
            <div>
              <ImageUpload
                value={settings.location_header_image || ""}
                onChange={(url) => onSettingChange("location_header_image", url)}
                label="이미지"
              />
              <p className="text-sm text-muted-foreground mt-2">
                페이지 상단에 표시될 건물 사진을 업로드하세요
              </p>
            </div>
            <div>
              <Label htmlFor="location_hero_overlay">오버레이 투명도 (%)</Label>
              <Input
                id="location_hero_overlay"
                type="number"
                min="0"
                max="100"
                value={settings.location_hero_overlay || "0"}
                onChange={(e) => onSettingChange("location_hero_overlay", e.target.value)}
              />
            </div>
          </div>
        </div>
      );

    case "description_buttons":
      return (
        <div key={sectionId} className="space-y-4">
          <SectionControls title={getSectionTitle(sectionId)} index={index} sectionId={sectionId} />
          <div className="grid gap-4">
            <div>
              <Label htmlFor="location_description_title">안내 메시지 제목</Label>
              <Input
                id="location_description_title"
                value={settings.location_description_title || ""}
                onChange={(e) => onSettingChange("location_description_title", e.target.value)}
                placeholder="행사 소개"
              />
            </div>
            <div>
              <Label htmlFor="location_description_content">안내 메시지 내용</Label>
              <Textarea
                id="location_description_content"
                value={settings.location_description_content || ""}
                onChange={(e) => onSettingChange("location_description_content", e.target.value)}
                rows={4}
                placeholder="행사 안내 메시지를 입력하세요"
              />
            </div>
            <div>
              <Label htmlFor="location_description_bg_color">안내 메시지 배경색</Label>
              <ColorPicker
                value={settings.location_description_bg_color || ""}
                onChange={(color) => onSettingChange("location_description_bg_color", color)}
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>버튼</Label>
                <Button onClick={handleAddUnifiedButton} size="sm" variant="default">
                  <Plus className="w-4 h-4 mr-2" />
                  버튼 추가
                </Button>
              </div>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEndUnifiedButtons}
              >
                <SortableContext
                  items={unifiedButtons.map((_, i) => i.toString())}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {unifiedButtons.map((button: any, i: number) => (
                      <SortableButton
                        key={i}
                        id={i.toString()}
                        button={{ id: i.toString() }}
                        buttonData={button}
                        onUpdate={(id, data) => handleUpdateUnifiedButton(parseInt(id), data)}
                        onDelete={(id) => handleDeleteUnifiedButton(parseInt(id))}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
              <p className="text-sm text-muted-foreground">
                버튼을 추가하고 링크 타입을 선택하세요 (앱 내 페이지, 외부 URL, 파일 다운로드)
              </p>
            </div>
          </div>
        </div>
      );

    case "location_info":
      return (
        <div key={sectionId} className="space-y-4">
          <SectionControls title={getSectionTitle(sectionId)} index={index} sectionId={sectionId} />
          <div className="grid gap-4">
            <div>
              <Label htmlFor="location_name">장소명</Label>
              <Input
                id="location_name"
                value={settings.location_name}
                onChange={(e) => onSettingChange("location_name", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="location_address">주소</Label>
              <Textarea
                id="location_address"
                value={settings.location_address}
                onChange={(e) => onSettingChange("location_address", e.target.value)}
                rows={3}
                placeholder="주소를 입력하세요 (줄바꿈 가능)"
              />
            </div>
            <div>
              <Label htmlFor="location_map_url">지도 URL</Label>
              <Input
                id="location_map_url"
                value={settings.location_map_url}
                onChange={(e) => onSettingChange("location_map_url", e.target.value)}
                placeholder="https://maps.google.com/..."
              />
            </div>
            <div>
              <Label htmlFor="location_map_url_label">지도 URL 버튼 텍스트</Label>
              <Input
                id="location_map_url_label"
                value={settings.location_map_url_label || "지도 앱에서 열기"}
                onChange={(e) => onSettingChange("location_map_url_label", e.target.value)}
                placeholder="지도 앱에서 열기"
              />
            </div>
          </div>
        </div>
      );

    case "transport_info":
      return (
        <div key={sectionId} className="space-y-4">
          <SectionControls title={getSectionTitle(sectionId)} index={index} sectionId={sectionId} />
          <div className="flex justify-end mb-4">
            <Button onClick={handleAddTransportCard} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              교통수단 추가
            </Button>
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEndTransportCards}
          >
            <SortableContext
              items={transportCards.map((_, i) => i.toString())}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {transportCards.map((card, i) => (
                  <SortableTransportCard
                    key={i}
                    id={i.toString()}
                    card={card}
                    onUpdate={(data) => handleUpdateTransportCard(i.toString(), data)}
                    onDelete={() => handleDeleteTransportCard(i)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      );

    case "contact_info":
      return (
        <div key={sectionId} className="space-y-4">
          <SectionControls title={getSectionTitle(sectionId)} index={index} sectionId={sectionId} />
          <div className="grid gap-4">
            <div>
              <Label htmlFor="location_phone">전화번호</Label>
              <Input
                id="location_phone"
                value={settings.location_phone}
                onChange={(e) => onSettingChange("location_phone", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="location_email">이메일</Label>
              <Input
                id="location_email"
                value={settings.location_email}
                onChange={(e) => onSettingChange("location_email", e.target.value)}
              />
            </div>
          </div>
        </div>
      );

    default:
      if (sectionId.startsWith("button_group_")) {
        const buttonGroup = buttonGroups.find((g) => g.id === sectionId);
        if (!buttonGroup) return null;

        const handleAddButton = () => {
          const newButtons = [...(buttonGroup.buttons || []), { text: "", link: "", linkType: "internal", fontSize: "text-lg" }];
          onButtonGroupsChange(buttonGroups.map(g => g.id === sectionId ? { ...g, buttons: newButtons } : g));
        };

        const handleUpdateButton = (buttonIndex: number, data: any) => {
          const newButtons = [...buttonGroup.buttons];
          newButtons[buttonIndex] = { ...newButtons[buttonIndex], ...data };
          onButtonGroupsChange(buttonGroups.map(g => g.id === sectionId ? { ...g, buttons: newButtons } : g));
        };

        const handleDeleteButton = (buttonIndex: number) => {
          const newButtons = buttonGroup.buttons.filter((_: any, i: number) => i !== buttonIndex);
          onButtonGroupsChange(buttonGroups.map(g => g.id === sectionId ? { ...g, buttons: newButtons } : g));
        };

        const handleDragEndButtons = (event: DragEndEvent) => {
          const { active, over } = event;
          if (over && active.id !== over.id) {
            const oldIndex = parseInt(active.id as string);
            const newIndex = parseInt(over.id as string);
            const newButtons = arrayMove(buttonGroup.buttons, oldIndex, newIndex);
            onButtonGroupsChange(buttonGroups.map(g => g.id === sectionId ? { ...g, buttons: newButtons } : g));
          }
        };

        return (
          <div key={sectionId} className="space-y-4">
            <SectionControls title={getSectionTitle(sectionId)} index={index} sectionId={sectionId} />
            <div className="space-y-4">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEndButtons}
              >
                <SortableContext
                  items={(buttonGroup.buttons || []).map((_: any, i: number) => i.toString())}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {(buttonGroup.buttons || []).map((button: any, i: number) => (
                      <SortableButton
                        key={i}
                        id={i.toString()}
                        button={{ id: i.toString() }}
                        buttonData={button}
                        onUpdate={(id, data) => handleUpdateButton(parseInt(id), data)}
                        onDelete={(id) => handleDeleteButton(parseInt(id))}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
              <div className="flex justify-end mt-4">
                <Button onClick={handleAddButton} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  버튼 추가
                </Button>
              </div>
            </div>
          </div>
        );
      }
      return null;
  }
};
