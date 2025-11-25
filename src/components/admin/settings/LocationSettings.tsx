import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ArrowUp, ArrowDown } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableTransportCard from "@/components/SortableTransportCard";
import SortableBottomButton from "@/components/SortableBottomButton";
import { ColorPicker } from "@/components/ColorPicker";
import ImageUpload from "@/components/ImageUpload";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface LocationSettingsProps {
  settings: any;
  transportCards: any[];
  bottomButtons: any[];
  sectionOrder: string[];
  onSettingChange: (key: string, value: string) => void;
  onTransportCardsChange: (cards: any[]) => void;
  onBottomButtonsChange: (buttons: any[]) => void;
  onSectionOrderChange: (order: string[]) => void;
  onSaveSectionOrder: (order: string[]) => void;
}

const LocationSettings = ({
  settings,
  transportCards,
  bottomButtons,
  sectionOrder,
  onSettingChange,
  onTransportCardsChange,
  onBottomButtonsChange,
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
    onBottomButtonsChange([...bottomButtons, { text: "새 버튼", link: "/", variant: "outline", size: "default", fontSize: "text-sm" }]);
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
      case "description_buttons": return "안내 메시지 & 버튼";
      case "location_info": return "장소 정보";
      case "transport_info": return "교통 정보";
      case "contact_info": return "연락처";
      default: return sectionId;
    }
  };

  const SectionControls = ({ title, index }: { title: string; index: number }) => (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => handleMoveSectionUp(index)} disabled={index === 0}>
          <ArrowUp className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleMoveSectionDown(index)} disabled={index === sectionOrder.length - 1}>
          <ArrowDown className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  const renderSection = (sectionId: string, index: number) => {
    switch (sectionId) {
      case "description_buttons":
        return (
          <div key={sectionId} className="space-y-4">
            <SectionControls title={getSectionTitle(sectionId)} index={index} />
            <div className="grid gap-4">
              <div>
                <Label htmlFor="location_content_order">콘텐츠 순서</Label>
                <Select
                  value={settings.location_content_order || "description_first"}
                  onValueChange={(value) => onSettingChange("location_content_order", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="순서 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="description_first">안내 메시지 먼저</SelectItem>
                    <SelectItem value="buttons_first">버튼 먼저</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
              <div className="flex items-center justify-between">
                <Label>하단 버튼</Label>
                <Button onClick={handleAddBottomButton} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  버튼 추가
                </Button>
              </div>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEndBottomButtons}
              >
                <SortableContext
                  items={bottomButtons.map((_, i) => i.toString())}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {bottomButtons.map((button, i) => (
                      <SortableBottomButton
                        key={i}
                        id={i.toString()}
                        button={{ id: i.toString() }}
                        buttonData={button}
                        onUpdate={(id, data) => handleUpdateBottomButton(id, data)}
                        onDelete={(id) => handleDeleteBottomButton(parseInt(id))}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>
        );

      case "location_info":
        return (
          <div key={sectionId} className="space-y-4">
            <SectionControls title={getSectionTitle(sectionId)} index={index} />
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
            </div>
          </div>
        );

      case "transport_info":
        return (
          <div key={sectionId} className="space-y-4">
            <SectionControls title={getSectionTitle(sectionId)} index={index} />
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
            <SectionControls title={getSectionTitle(sectionId)} index={index} />
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
        return null;
    }
  };

  return (
    <div className="space-y-8">
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
            <ImageUpload
              value={settings.location_header_image || ""}
              onChange={(url) => onSettingChange("location_header_image", url)}
              label="헤더 이미지"
            />
            <p className="text-sm text-muted-foreground mt-2">
              페이지 상단에 표시될 건물 사진을 업로드하세요
            </p>
          </div>
          
          <Separator />
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="location_header_use_text"
              checked={settings.location_header_use_text === "true"}
              onCheckedChange={(checked) => onSettingChange("location_header_use_text", checked ? "true" : "false")}
            />
            <Label htmlFor="location_header_use_text" className="cursor-pointer">이미지 위 텍스트 사용</Label>
          </div>
          
          {settings.location_header_use_text === "true" && (
            <div>
              <Label htmlFor="location_header_text_content">텍스트 에디터</Label>
              <Textarea
                id="location_header_text_content"
                value={settings.location_header_text_content || ""}
                onChange={(e) => onSettingChange("location_header_text_content", e.target.value)}
                placeholder="HTML 또는 일반 텍스트를 입력하세요&#10;예시:&#10;<h1>제목</h1>&#10;<p>부제목</p>"
                className="min-h-[150px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">HTML 태그를 사용할 수 있습니다</p>
            </div>
          )}
          
          <div>
            <Label htmlFor="location_header_overlay_opacity">이미지 오버레이 투명도 (%)</Label>
            <Input
              id="location_header_overlay_opacity"
              type="number"
              value={settings.location_header_overlay_opacity || "50"}
              onChange={(e) => onSettingChange("location_header_overlay_opacity", e.target.value)}
              placeholder="50"
              min="0"
              max="100"
            />
            <p className="text-xs text-muted-foreground mt-1">0 (투명) ~ 100 (불투명)</p>
          </div>
          
          <Separator />
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="location_header_use_button"
              checked={settings.location_header_use_button === "true"}
              onCheckedChange={(checked) => onSettingChange("location_header_use_button", checked ? "true" : "false")}
            />
            <Label htmlFor="location_header_use_button" className="cursor-pointer">버튼 사용</Label>
          </div>
          
          {settings.location_header_use_button === "true" && (
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">버튼 위치</Label>
                <RadioGroup
                  value={settings.location_header_button_position || "inside"}
                  onValueChange={(value) => onSettingChange("location_header_button_position", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="inside" id="button-inside" />
                    <Label htmlFor="button-inside" className="cursor-pointer">이미지 안</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="below" id="button-below" />
                    <Label htmlFor="button-below" className="cursor-pointer">이미지 아래</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label htmlFor="location_header_button_text">버튼 텍스트</Label>
                <Input
                  id="location_header_button_text"
                  value={settings.location_header_button_text || ""}
                  onChange={(e) => onSettingChange("location_header_button_text", e.target.value)}
                  placeholder="지도 보기"
                />
              </div>
              <div>
                <Label htmlFor="location_header_button_url">버튼 URL</Label>
                <Input
                  id="location_header_button_url"
                  value={settings.location_header_button_url || ""}
                  onChange={(e) => onSettingChange("location_header_button_url", e.target.value)}
                  placeholder="https://maps.google.com/..."
                />
              </div>
              <div>
                <Label>버튼 배경색</Label>
                <ColorPicker
                  value={settings.location_header_button_bg_color || ""}
                  onChange={(color) => onSettingChange("location_header_button_bg_color", color)}
                />
              </div>
              <div>
                <Label>버튼 텍스트 색상</Label>
                <ColorPicker
                  value={settings.location_header_button_text_color || ""}
                  onChange={(color) => onSettingChange("location_header_button_text_color", color)}
                />
              </div>
              <div>
                <Label htmlFor="location_header_button_size_type">버튼 크기</Label>
                <select
                  id="location_header_button_size_type"
                  value={settings.location_header_button_size_type || "lg"}
                  onChange={(e) => onSettingChange("location_header_button_size_type", e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="sm">작게 (sm)</option>
                  <option value="default">기본 (default)</option>
                  <option value="lg">크게 (lg)</option>
                  <option value="custom">사용자 지정</option>
                </select>
              </div>
              
              {settings.location_header_button_size_type === "custom" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location_header_button_custom_width">가로 (px)</Label>
                    <Input
                      id="location_header_button_custom_width"
                      type="number"
                      value={settings.location_header_button_custom_width || ""}
                      onChange={(e) => onSettingChange("location_header_button_custom_width", e.target.value)}
                      placeholder="200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location_header_button_custom_height">세로 (px)</Label>
                    <Input
                      id="location_header_button_custom_height"
                      type="number"
                      value={settings.location_header_button_custom_height || ""}
                      onChange={(e) => onSettingChange("location_header_button_custom_height", e.target.value)}
                      placeholder="48"
                    />
                  </div>
                </div>
              )}
              
              <div>
                <Label htmlFor="location_header_button_font_size">폰트 크기</Label>
                <select
                  id="location_header_button_font_size"
                  value={settings.location_header_button_font_size || "text-base"}
                  onChange={(e) => onSettingChange("location_header_button_font_size", e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="text-xs">아주 작게 (xs)</option>
                  <option value="text-sm">작게 (sm)</option>
                  <option value="text-base">보통 (base)</option>
                  <option value="text-lg">크게 (lg)</option>
                  <option value="text-xl">아주 크게 (xl)</option>
                  <option value="text-2xl">매우 크게 (2xl)</option>
                </select>
              </div>
            </div>
          )}
          
          <Separator />
          
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
