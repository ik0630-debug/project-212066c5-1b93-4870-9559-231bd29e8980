import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableTransportCard from "@/components/SortableTransportCard";
import { ColorPicker } from "@/components/ColorPicker";

interface LocationSettingsProps {
  settings: any;
  transportCards: any[];
  onSettingChange: (key: string, value: string) => void;
  onTransportCardsChange: (cards: any[]) => void;
}

const LocationSettings = ({
  settings,
  transportCards,
  onSettingChange,
  onTransportCardsChange,
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

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">페이지 정보</h3>
        <div className="grid gap-4">
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
            <Input
              id="location_address"
              value={settings.location_address}
              onChange={(e) => onSettingChange("location_address", e.target.value)}
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
