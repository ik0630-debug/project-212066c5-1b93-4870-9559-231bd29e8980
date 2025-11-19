import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2 } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ColorPicker } from "@/components/ColorPicker";
import IconPicker from "@/components/IconPicker";

interface ProgramSettingsProps {
  settings: any;
  programCards: any[];
  onSettingChange: (key: string, value: string) => void;
  onProgramCardsChange: (cards: any[]) => void;
}

const ProgramSettings = ({
  settings,
  programCards,
  onSettingChange,
  onProgramCardsChange,
}: ProgramSettingsProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleAddProgramCard = () => {
    onProgramCardsChange([...programCards, { time: "", title: "", description: "", icon: "Clock" }]);
  };

  const handleDeleteProgramCard = (index: number) => {
    onProgramCardsChange(programCards.filter((_, i) => i !== index));
  };

  const handleDragEndProgramCards = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = programCards.findIndex((_, i) => i.toString() === active.id);
      const newIndex = programCards.findIndex((_, i) => i.toString() === over.id);
      onProgramCardsChange(arrayMove(programCards, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">페이지 정보</h3>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="program_title">제목</Label>
            <Input
              id="program_title"
              value={settings.program_title}
              onChange={(e) => onSettingChange("program_title", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="program_description">설명</Label>
            <Input
              id="program_description"
              value={settings.program_description}
              onChange={(e) => onSettingChange("program_description", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="program_header_color">헤더 배경색</Label>
            <ColorPicker
              value={settings.program_header_color || ""}
              onChange={(color) => onSettingChange("program_header_color", color)}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">프로그램 일정</h3>
          <Button onClick={handleAddProgramCard} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            일정 추가
          </Button>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEndProgramCards}
        >
          <SortableContext
            items={programCards.map((_, i) => i.toString())}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {programCards.map((card, i) => (
                <div key={i} className="p-4 border rounded-lg space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs mb-1">아이콘</Label>
                      <IconPicker
                        value={card.icon || "Clock"}
                        onValueChange={(icon) => {
                          const newCards = [...programCards];
                          newCards[i].icon = icon;
                          onProgramCardsChange(newCards);
                        }}
                      />
                    </div>
                    <div>
                      <Label className="text-xs mb-1">시간</Label>
                      <Input
                        placeholder="10:00"
                        value={card.time}
                        onChange={(e) => {
                          const newCards = [...programCards];
                          newCards[i].time = e.target.value;
                          onProgramCardsChange(newCards);
                        }}
                      />
                    </div>
                    <div>
                      <Label className="text-xs mb-1">제목</Label>
                      <Input
                        placeholder="프로그램 제목"
                        value={card.title}
                        onChange={(e) => {
                          const newCards = [...programCards];
                          newCards[i].title = e.target.value;
                          onProgramCardsChange(newCards);
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1">설명</Label>
                    <Input
                      placeholder="프로그램 설명"
                      value={card.description}
                      onChange={(e) => {
                        const newCards = [...programCards];
                        newCards[i].description = e.target.value;
                        onProgramCardsChange(newCards);
                      }}
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteProgramCard(i)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default ProgramSettings;
