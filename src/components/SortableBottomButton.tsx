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
import { ColorPicker } from "@/components/ColorPicker";

interface SortableButtonProps {
  id: string;
  button: any;
  buttonData: any;
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
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
        <Button onClick={() => onDelete(button.id)} size="sm" variant="destructive">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div>
        <Label>버튼 텍스트</Label>
        <Input
          value={buttonData.text || ""}
          onChange={(e) =>
            onUpdate(button.id, {
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
            onUpdate(button.id, {
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
            onUpdate(button.id, {
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>버튼 크기</Label>
          <Select
            value={buttonData.size || "default"}
            onValueChange={(value) =>
              onUpdate(button.id, {
                ...buttonData,
                size: value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="sm">작게</SelectItem>
              <SelectItem value="default">보통</SelectItem>
              <SelectItem value="lg">크게</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>폰트 크기</Label>
          <Select
            value={buttonData.fontSize || "text-sm"}
            onValueChange={(value) =>
              onUpdate(button.id, {
                ...buttonData,
                fontSize: value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="text-xs">아주 작게</SelectItem>
              <SelectItem value="text-sm">작게</SelectItem>
              <SelectItem value="text-base">보통</SelectItem>
              <SelectItem value="text-lg">크게</SelectItem>
              <SelectItem value="text-xl">아주 크게</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <ColorPicker
          value={buttonData.bgColor || "221 83% 53%"}
          onChange={(color) =>
            onUpdate(button.id, {
              ...buttonData,
              bgColor: color,
            })
          }
          label="배경 색상"
        />
      </div>

      <div>
        <ColorPicker
          value={buttonData.textColor || "0 0% 100%"}
          onChange={(color) =>
            onUpdate(button.id, {
              ...buttonData,
              textColor: color,
            })
          }
          label="텍스트 색상"
        />
      </div>
    </div>
  );
};

export default SortableBottomButton;