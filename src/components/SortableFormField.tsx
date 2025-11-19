import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import IconPicker from "@/components/IconPicker";

interface RegistrationField {
  id: string;
  label: string;
  placeholder: string;
  type: string;
  required: boolean;
  options?: string[];
  icon?: string;
}

interface SortableFormFieldProps {
  field: RegistrationField;
  index: number;
  onFieldChange: (index: number, key: keyof RegistrationField, value: any) => void;
  onRemove: (index: number) => void;
}

const SortableFormField = ({ field, index, onFieldChange, onRemove }: SortableFormFieldProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="space-y-3 p-4 border rounded-lg bg-card"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            ref={setActivatorNodeRef}
            type="button"
            className="cursor-grab active:cursor-grabbing touch-none"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-5 h-5 text-muted-foreground" />
          </button>
          <h4 className="font-medium">{field.label}</h4>
        </div>
        <Button
          onClick={() => onRemove(index)}
          variant="destructive"
          size="sm"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid gap-3 pl-7">
        <div>
          <Label>아이콘</Label>
          <IconPicker
            value={field.icon || "User"}
            onValueChange={(icon) => onFieldChange(index, "icon", icon)}
          />
        </div>

        <div>
          <Label>필드 레이블</Label>
          <Input
            value={field.label}
            onChange={(e) => onFieldChange(index, "label", e.target.value)}
          />
        </div>

        <div>
          <Label>플레이스홀더</Label>
          <Input
            value={field.placeholder}
            onChange={(e) => onFieldChange(index, "placeholder", e.target.value)}
          />
        </div>

        <div>
          <Label>필드 타입</Label>
          <Select
            value={field.type}
            onValueChange={(value) => onFieldChange(index, "type", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">텍스트</SelectItem>
              <SelectItem value="email">이메일</SelectItem>
              <SelectItem value="tel">전화번호</SelectItem>
              <SelectItem value="textarea">긴 텍스트</SelectItem>
              <SelectItem value="select">선택</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {field.type === "select" && (
          <div>
            <Label>선택 옵션 (쉼표로 구분)</Label>
            <Input
              value={field.options?.join(", ") || ""}
              onChange={(e) =>
                onFieldChange(
                  index,
                  "options",
                  e.target.value.split(",").map((opt) => opt.trim())
                )
              }
              placeholder="옵션1, 옵션2, 옵션3"
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id={`required-${field.id}`}
            checked={field.required}
            onCheckedChange={(checked) =>
              onFieldChange(index, "required", checked)
            }
          />
          <Label htmlFor={`required-${field.id}`}>필수 입력</Label>
        </div>
      </div>
    </div>
  );
};

export default SortableFormField;
