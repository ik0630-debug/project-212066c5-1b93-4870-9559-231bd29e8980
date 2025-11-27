import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import IconPicker from "@/components/IconPicker";

interface SortableProgramCardProps {
  id: string;
  card: any;
  onUpdate: (updates: any) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export const SortableProgramCard = ({
  id,
  card,
  onUpdate,
  onDelete,
  onDuplicate,
}: SortableProgramCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-4 border rounded-lg space-y-3 bg-background"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onDuplicate}
            title="복사"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            title="삭제"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label className="text-xs mb-1">아이콘</Label>
          <IconPicker
            value={card.icon || "Clock"}
            onValueChange={(icon) => onUpdate({ icon })}
          />
        </div>
        <div>
          <Label className="text-xs mb-1">시간</Label>
          <Input
            placeholder="10:00"
            value={card.time}
            onChange={(e) => onUpdate({ time: e.target.value })}
          />
        </div>
        <div>
          <Label className="text-xs mb-1">제목</Label>
          <Input
            placeholder="프로그램 제목"
            value={card.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label className="text-xs mb-1">설명</Label>
        <Textarea
          placeholder="프로그램 설명&#10;줄바꿈을 입력할 수 있습니다"
          value={card.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          rows={3}
        />
      </div>
    </div>
  );
};
