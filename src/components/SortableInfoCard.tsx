import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GripVertical, Trash2 } from "lucide-react";
import IconPicker from "@/components/IconPicker";

interface SortableCardProps {
  id: string;
  card: any;
  cardData: any;
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
}

const SortableInfoCard = ({
  id,
  card,
  cardData,
  onUpdate,
  onDelete,
}: SortableCardProps) => {
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
      className="border-2 border-border rounded-lg p-4 space-y-4 bg-card"
    >
      <div className="flex items-center gap-2 mb-2">
        <button
          className="cursor-grab active:cursor-grabbing touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-5 h-5 text-muted-foreground" />
        </button>
        <h4 className="font-medium text-lg flex-1">
          {cardData.title || "제목 없음"}
        </h4>
        <Button onClick={() => onDelete(id)} size="sm" variant="destructive">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div>
        <Label>아이콘</Label>
        <IconPicker
          value={cardData.icon || "Calendar"}
          onValueChange={(iconName) =>
            onUpdate(id, {
              ...cardData,
              icon: iconName,
            })
          }
        />
      </div>

      <div>
        <Label>제목</Label>
        <Input
          value={cardData.title || ""}
          onChange={(e) =>
            onUpdate(id, {
              ...cardData,
              title: e.target.value,
            })
          }
          placeholder="일시"
        />
      </div>

      <div>
        <Label>내용 (줄바꿈 가능)</Label>
        <Textarea
          value={cardData.content || ""}
          onChange={(e) =>
            onUpdate(id, {
              ...cardData,
              content: e.target.value,
            })
          }
          placeholder="2024년 12월 15일 (금)&#10;오전 9:00 - 오후 6:00"
          rows={3}
        />
      </div>
    </div>
  );
};

export default SortableInfoCard;