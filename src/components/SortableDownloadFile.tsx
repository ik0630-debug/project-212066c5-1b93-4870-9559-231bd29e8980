import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2 } from "lucide-react";
import ImageUpload from "./ImageUpload";

interface SortableDownloadFileProps {
  id: string;
  file: {
    name: string;
    url: string;
  };
  onUpdate: (data: { name: string; url: string }) => void;
  onDelete: () => void;
}

const SortableDownloadFile = ({ id, file, onUpdate, onDelete }: SortableDownloadFileProps) => {
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
    <div ref={setNodeRef} style={style}>
      <Card className="p-4">
        <div className="flex items-start gap-3">
          <button
            className="mt-6 cursor-grab active:cursor-grabbing touch-none"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <div className="flex-1 space-y-3">
            <div>
              <Label>파일 이름</Label>
              <Input
                value={file.name}
                onChange={(e) => onUpdate({ ...file, name: e.target.value })}
                placeholder="예: 오시는 길 안내.pdf"
              />
            </div>
            
            <ImageUpload
              value={file.url}
              onChange={(url) => onUpdate({ ...file, url })}
              label="파일 업로드"
              accept="*"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="mt-6"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SortableDownloadFile;
