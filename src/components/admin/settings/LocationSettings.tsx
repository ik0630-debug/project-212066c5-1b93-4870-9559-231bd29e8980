import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableTransportCard from "@/components/SortableTransportCard";
import SortableBottomButton from "@/components/SortableBottomButton";
import { ColorPicker } from "@/components/ColorPicker";

interface LocationSettingsProps {
  settings: any;
  transportCards: any[];
  bottomButtons: any[];
  onSettingChange: (key: string, value: string) => void;
  onTransportCardsChange: (cards: any[]) => void;
  onBottomButtonsChange: (buttons: any[]) => void;
}

const LocationSettings = ({
  settings,
  transportCards,
  bottomButtons,
  onSettingChange,
  onTransportCardsChange,
  onBottomButtonsChange,
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

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">안내 메시지 & 버튼</h3>
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
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">하단 버튼</h3>
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

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">장소 정보</h3>
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

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">교통 정보</h3>
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

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">연락처</h3>
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
    </div>
  );
};

export default LocationSettings;
