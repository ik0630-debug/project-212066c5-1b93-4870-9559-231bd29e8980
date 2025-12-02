import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Copy, Trash2 } from "lucide-react";

interface SectionControlsProps {
  title: string;
  index: number;
  sectionId: string;
  sectionOrder: string[];
  isCollapsed: boolean;
  onToggle: (sectionId: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onCopy?: () => void;
  onDelete?: () => void;
}

export const ProgramSectionControls = ({
  title,
  index,
  sectionId,
  sectionOrder,
  isCollapsed,
  onToggle,
  onMoveUp,
  onMoveDown,
  onCopy,
  onDelete,
}: SectionControlsProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onToggle(sectionId)}
          className="hover:bg-secondary p-1 h-auto"
        >
          <span className="text-xl">{isCollapsed ? '〉' : '∨'}</span>
        </Button>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onMoveUp(index)} 
          disabled={index === 0}
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onMoveDown(index)} 
          disabled={index === sectionOrder.length - 1}
        >
          <ArrowDown className="w-4 h-4" />
        </Button>
        {onCopy && (
          <Button variant="outline" size="sm" onClick={onCopy}>
            <Copy className="w-4 h-4" />
          </Button>
        )}
        {onDelete && (
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
