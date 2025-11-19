import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GripVertical, Trash2 } from "lucide-react";

interface SortableButtonProps {
  id: string;
  button: any;
  buttonData: any;
  onUpdate: (data: any) => void;
  onDelete: () => void;
}

const SortableBottomButton = ({
  id,
  button,
  buttonData,
  onUpdate,
  onDelete,
}: SortableButtonProps) => {
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
          {buttonData.text || "텍스트 없음"}
        </h4>
        <Button onClick={onDelete} size="sm" variant="destructive">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div>
        <Label>버튼 텍스트</Label>
        <Input
          value={buttonData.text || ""}
          onChange={(e) =>
            onUpdate({
              ...buttonData,
              text: e.target.value,
            })
          }
          placeholder="프로그램 보기"
        />
      </div>

      <div>
        <Label>버튼 링크 (경로)</Label>
        <Input
          value={buttonData.link || ""}
          onChange={(e) =>
            onUpdate({
              ...buttonData,
              link: e.target.value,
            })
          }
          placeholder="/program"
        />
      </div>

      <div>
        <Label>버튼 스타일</Label>
        <Select
          value={buttonData.variant || "outline"}
          onValueChange={(value) =>
            onUpdate({
              ...buttonData,
              variant: value,
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            <SelectItem value="default">기본</SelectItem>
            <SelectItem value="outline">아웃라인</SelectItem>
            <SelectItem value="secondary">보조</SelectItem>
            <SelectItem value="ghost">고스트</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SortableBottomButton;