import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableTransportCard from "@/components/SortableTransportCard";
import SortableButton from "@/components/SortableButton";
import { ColorPicker } from "@/components/ColorPicker";
import ImageUpload from "@/components/ImageUpload";

interface LocationSettingsProps {
  settings: any;
  transportCards: any[];
  bottomButtons: any[];
  downloadFiles: any[];
  buttonGroups: any[];
  sectionOrder: string[];
  onSettingChange: (key: string, value: string) => void;
  onTransportCardsChange: (cards: any[]) => void;
  onBottomButtonsChange: (buttons: any[]) => void;
  onDownloadFilesChange: (files: any[]) => void;
  onButtonGroupsChange: (groups: any[]) => void;
  onSectionOrderChange: (order: string[]) => void;
  onSaveSectionOrder: (order: string[]) => void;
}

const LocationSettings = ({
  settings,
  transportCards,
  bottomButtons,
  downloadFiles,
  buttonGroups,
  sectionOrder,
  onSettingChange,
  onTransportCardsChange,
  onBottomButtonsChange,
  onDownloadFilesChange,
  onButtonGroupsChange,
  onSectionOrderChange,
  onSaveSectionOrder,
}: LocationSettingsProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleAddTransportCard = () => {
    onTransportCardsChange([...transportCards, { icon: "Train", title: "새 교통수단", description: "설명을 입력하세요" }]);
  };

  const handleUpdateTransportCard = (id: string, data: any) => {
    const index = parseInt(id);
    const newCards = [...transportCards];
    newCards[index] = { ...newCards[index], ...data };
    onTransportCardsChange(newCards);
  };

  const handleDeleteTransportCard = (index: number) => {
    onTransportCardsChange(transportCards.filter((_, i) => i !== index));
  };

  const handleDragEndTransportCards = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = transportCards.findIndex((_, i) => i.toString() === active.id);
      const newIndex = transportCards.findIndex((_, i) => i.toString() === over.id);
      onTransportCardsChange(arrayMove(transportCards, oldIndex, newIndex));
    }
  };

  const handleAddBottomButton = () => {
    onBottomButtonsChange([...bottomButtons, { text: "새 버튼", link: "/", linkType: "internal", variant: "outline", size: "default", fontSize: "text-sm" }]);
  };

  const handleUpdateBottomButton = (id: string, data: any) => {
    const index = parseInt(id);
    const newButtons = [...bottomButtons];
    newButtons[index] = { ...newButtons[index], ...data };
    onBottomButtonsChange(newButtons);
  };

  const handleDeleteBottomButton = (index: number) => {
    onBottomButtonsChange(bottomButtons.filter((_, i) => i !== index));
  };

  const handleDragEndBottomButtons = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = bottomButtons.findIndex((_, i) => i.toString() === active.id);
      const newIndex = bottomButtons.findIndex((_, i) => i.toString() === over.id);
      onBottomButtonsChange(arrayMove(bottomButtons, oldIndex, newIndex));
    }
  };

  // Merge bottomButtons and downloadFiles into unified buttons array
  const unifiedButtons = [
    ...bottomButtons.map((btn: any) => ({
      ...btn,
      linkType: btn.linkType || (btn.link?.startsWith('http') ? 'external' : 'internal'),
    })),
    ...downloadFiles.map((file: any) => ({
      text: file.name,
      link: file.url,
      fileUrl: file.url,
      linkType: 'file',
      variant: 'outline',
      size: 'default',
      fontSize: 'text-sm',
    })),
  ];

  const handleAddUnifiedButton = () => {
    const newButton = { text: "새 버튼", link: "/", linkType: "internal", variant: "outline", size: "default", fontSize: "text-sm" };
    onBottomButtonsChange([...bottomButtons, newButton]);
  };

  const handleUpdateUnifiedButton = (index: number, data: any) => {
    const totalBottomButtons = bottomButtons.length;
    
    if (index < totalBottomButtons) {
      // Update in bottomButtons
      const newButtons = [...bottomButtons];
      newButtons[index] = { ...newButtons[index], ...data };
      onBottomButtonsChange(newButtons);
    } else {
      // Update in downloadFiles (convert to button)
      const fileIndex = index - totalBottomButtons;
      const newDownloadFiles = [...downloadFiles];
      newDownloadFiles.splice(fileIndex, 1);
      onDownloadFilesChange(newDownloadFiles);
      
      // Add as button
      const newButton = {
        text: data.text,
        link: data.linkType === 'file' ? (data.fileUrl || data.link) : data.link,
        fileUrl: data.fileUrl,
        linkType: data.linkType,
        variant: data.variant || 'outline',
        size: data.size || 'default',
        fontSize: data.fontSize || 'text-sm',
        bgColor: data.bgColor,
        textColor: data.textColor,
      };
      onBottomButtonsChange([...bottomButtons, newButton]);
    }
  };

  const handleDeleteUnifiedButton = (index: number) => {
    const totalBottomButtons = bottomButtons.length;
    
    if (index < totalBottomButtons) {
      // Delete from bottomButtons
      onBottomButtonsChange(bottomButtons.filter((_, i) => i !== index));
    } else {
      // Delete from downloadFiles
      const fileIndex = index - totalBottomButtons;
      onDownloadFilesChange(downloadFiles.filter((_, i) => i !== fileIndex));
    }
  };

  const handleDragEndUnifiedButtons = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id as string);
      const newIndex = parseInt(over.id as string);
      const newButtons = arrayMove(unifiedButtons, oldIndex, newIndex);
      
      // Split back into bottomButtons and downloadFiles
      const newBottomButtons = newButtons.filter((btn: any) => btn.linkType !== 'file' || !btn.fileUrl || btn.text !== btn.link);
      const newDownloadFiles = newButtons
        .filter((btn: any) => btn.linkType === 'file' && btn.fileUrl)
        .map((btn: any) => ({ name: btn.text, url: btn.fileUrl || btn.link }));
      
      onBottomButtonsChange(newBottomButtons);
      onDownloadFilesChange(newDownloadFiles);
    }
  };

  const handleAddDownloadFile = () => {
    onDownloadFilesChange([...downloadFiles, { name: "새 파일", url: "" }]);
  };

  const handleUpdateDownloadFile = (index: number, data: any) => {
    const newFiles = [...downloadFiles];
    newFiles[index] = data;
    onDownloadFilesChange(newFiles);
  };

  const handleDeleteDownloadFile = (index: number) => {
    onDownloadFilesChange(downloadFiles.filter((_, i) => i !== index));
  };

  const handleDragEndDownloadFiles = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = downloadFiles.findIndex((_, i) => i.toString() === active.id);
      const newIndex = downloadFiles.findIndex((_, i) => i.toString() === over.id);
      onDownloadFilesChange(arrayMove(downloadFiles, oldIndex, newIndex));
    }
  };

  const handleMoveSectionUp = (index: number) => {
    if (index > 0) {
      const newOrder = [...sectionOrder];
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
      onSectionOrderChange(newOrder);
      onSaveSectionOrder(newOrder);
    }
  };

  const handleMoveSectionDown = (index: number) => {
    if (index < sectionOrder.length - 1) {
      const newOrder = [...sectionOrder];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      onSectionOrderChange(newOrder);
      onSaveSectionOrder(newOrder);
    }
  };

  const getSectionTitle = (sectionId: string): string => {
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

  const SectionControls = ({ title, index, sectionId }: { title: string; index: number; sectionId: string }) => (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => handleMoveSectionUp(index)} disabled={index === 0}>
          <ArrowUp className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleMoveSectionDown(index)} disabled={index === sectionOrder.length - 1}>
          <ArrowDown className="w-4 h-4" />
        </Button>
        <Button variant="destructive" size="sm" onClick={() => handleRemoveSection(sectionId)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  const renderSection = (sectionId: string, index: number) => {
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
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>버튼</Label>
                  <Button onClick={handleAddUnifiedButton} size="sm">
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
                <div className="mb-4">
                  <Label>버튼 정렬</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={buttonGroup.alignment || "center"}
                    onChange={(e) => onButtonGroupsChange(buttonGroups.map(g => g.id === sectionId ? { ...g, alignment: e.target.value } : g))}
                  >
                    <option value="left">왼쪽</option>
                    <option value="center">가운데</option>
                    <option value="right">오른쪽</option>
                  </select>
                </div>
                <div className="flex justify-end mb-4">
                  <Button onClick={handleAddButton} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    버튼 추가
                  </Button>
                </div>
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
              </div>
            </div>
          );
        }
        return null;
    }
  };

  const handleAddSection = (sectionId: string) => {
    if (!sectionOrder.includes(sectionId)) {
      const newOrder = [...sectionOrder, sectionId];
      onSectionOrderChange(newOrder);
      onSaveSectionOrder(newOrder);
    }
  };

  const handleRemoveSection = (sectionId: string) => {
    const newOrder = sectionOrder.filter(id => id !== sectionId);
    onSectionOrderChange(newOrder);
    onSaveSectionOrder(newOrder);
  };

  const isSectionAdded = (sectionId: string) => sectionOrder.includes(sectionId);

  const handleAddButtonGroup = () => {
    const newId = `button_group_${Date.now()}`;
    const newButtonGroup = {
      id: newId,
      alignment: "center",
      buttons: [{ text: "새 버튼", link: "/", linkType: "internal", variant: "outline", size: "default", fontSize: "text-sm" }],
      order: buttonGroups.length,
    };
    onButtonGroupsChange([...buttonGroups, newButtonGroup]);
    handleAddSection(newId);
  };

  return (
    <div className="space-y-8">
      {/* Section Add Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button 
          onClick={() => handleAddSection("hero_image")} 
          variant="outline"
          size="sm"
          className="h-8 text-xs border-primary text-primary hover:bg-primary/10"
          disabled={isSectionAdded("hero_image")}
        >
          <Plus className="w-3 h-3 mr-1.5" />
          이미지
        </Button>
        <Button 
          onClick={() => handleAddSection("description_buttons")} 
          variant="outline"
          size="sm"
          className="h-8 text-xs border-primary text-primary hover:bg-primary/10"
          disabled={isSectionAdded("description_buttons")}
        >
          <Plus className="w-3 h-3 mr-1.5" />
          설명 카드
        </Button>
        <Button 
          onClick={() => handleAddSection("location_info")} 
          variant="outline"
          size="sm"
          className="h-8 text-xs border-primary text-primary hover:bg-primary/10"
          disabled={isSectionAdded("location_info")}
        >
          <Plus className="w-3 h-3 mr-1.5" />
          장소정보
        </Button>
        <Button 
          onClick={() => handleAddSection("contact_info")} 
          variant="outline"
          size="sm"
          className="h-8 text-xs border-primary text-primary hover:bg-primary/10"
          disabled={isSectionAdded("contact_info")}
        >
          <Plus className="w-3 h-3 mr-1.5" />
          연락처
        </Button>
        <Button 
          onClick={() => handleAddSection("transport_info")} 
          variant="outline"
          size="sm"
          className="h-8 text-xs border-primary text-primary hover:bg-primary/10"
          disabled={isSectionAdded("transport_info")}
        >
          <Plus className="w-3 h-3 mr-1.5" />
          교통정보
        </Button>
        <Button 
          onClick={handleAddButtonGroup} 
          variant="outline"
          size="sm"
          className="h-8 text-xs border-primary text-primary hover:bg-primary/10"
        >
          <Plus className="w-3 h-3 mr-1.5" />
          버튼
        </Button>
      </div>

      <Separator />

      {/* Page Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">페이지 정보</h3>
        <div className="grid gap-4">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div className="space-y-0.5">
              <Label>페이지 활성화</Label>
              <p className="text-sm text-muted-foreground">
                비활성화하면 사용자가 오시는 길 페이지에 접근할 수 없습니다
              </p>
            </div>
            <Switch
              checked={settings.location_enabled === "true"}
              onCheckedChange={(checked) => onSettingChange("location_enabled", checked ? "true" : "false")}
            />
          </div>
          <div>
            <Label htmlFor="location_page_title">페이지 제목</Label>
            <Input
              id="location_page_title"
              value={settings.location_page_title}
              onChange={(e) => onSettingChange("location_page_title", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="location_page_description">페이지 설명</Label>
            <Input
              id="location_page_description"
              value={settings.location_page_description}
              onChange={(e) => onSettingChange("location_page_description", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="location_header_color">헤더 배경색</Label>
            <ColorPicker
              value={settings.location_header_color || ""}
              onChange={(color) => onSettingChange("location_header_color", color)}
            />
          </div>
        </div>
      </div>

      <Separator />

      {sectionOrder.map((sectionId, index) => (
        <div key={sectionId}>
          {renderSection(sectionId, index)}
          {index < sectionOrder.length - 1 && <Separator className="my-6" />}
        </div>
      ))}
    </div>
  );
};

export default LocationSettings;
