import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ColorPicker } from "@/components/ColorPicker";
import { SortableProgramCard } from "@/components/SortableProgramCard";

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

  const handleDuplicateProgramCard = (index: number) => {
    const cardToDuplicate = { ...programCards[index] };
    const newCards = [...programCards];
    newCards.splice(index + 1, 0, cardToDuplicate);
    onProgramCardsChange(newCards);
  };

  const handleUpdateProgramCard = (index: number, updates: any) => {
    const newCards = [...programCards];
    newCards[index] = { ...newCards[index], ...updates };
    onProgramCardsChange(newCards);
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
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div className="space-y-0.5">
              <Label>페이지 활성화</Label>
              <p className="text-sm text-muted-foreground">
                비활성화하면 사용자가 프로그램 페이지에 접근할 수 없습니다
              </p>
            </div>
            <Switch
              checked={settings.program_enabled === "true"}
              onCheckedChange={(checked) => onSettingChange("program_enabled", checked ? "true" : "false")}
            />
          </div>
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
                <SortableProgramCard
                  key={i}
                  id={i.toString()}
                  card={card}
                  onUpdate={(updates) => handleUpdateProgramCard(i, updates)}
                  onDelete={() => handleDeleteProgramCard(i)}
                  onDuplicate={() => handleDuplicateProgramCard(i)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default ProgramSettings;
