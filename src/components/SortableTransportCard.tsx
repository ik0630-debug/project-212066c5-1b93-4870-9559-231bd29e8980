import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SortableTransportCardProps {
  id: string;
  card: any;
  onUpdate: (data: any) => void;
  onDelete: () => void;
}

const SortableTransportCard = ({ id, card, onUpdate, onDelete }: SortableTransportCardProps) => {
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
    <Card ref={setNodeRef} style={style} className="relative">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div
            className="flex-shrink-0 cursor-grab active:cursor-grabbing pt-6"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="grid gap-3">
              <div className="space-y-2">
                <Label className="text-sm">아이콘</Label>
                <Select
                  value={card.icon}
                  onValueChange={(value) => onUpdate({ ...card, icon: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="Train">지하철 (Train)</SelectItem>
                    <SelectItem value="Bus">버스 (Bus)</SelectItem>
                    <SelectItem value="Car">자가용 (Car)</SelectItem>
                    <SelectItem value="Plane">비행기 (Plane)</SelectItem>
                    <SelectItem value="Ship">배 (Ship)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">제목</Label>
                <Input
                  value={card.title}
                  onChange={(e) => onUpdate({ ...card, title: e.target.value })}
                  placeholder="교통편 제목"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">설명</Label>
                <Textarea
                  value={card.description}
                  onChange={(e) => onUpdate({ ...card, description: e.target.value })}
                  placeholder="교통편 설명 (줄바꿈 가능)"
                  rows={3}
                />
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SortableTransportCard;