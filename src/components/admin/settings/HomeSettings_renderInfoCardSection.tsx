import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableInfoCard from "@/components/SortableInfoCard";

interface RenderInfoCardSectionProps {
  sectionId: string;
  index: number;
  infoCardSections: any[];
  sensors: any;
  SectionControls: any;
  onUpdateInfoCardSection: (id: string, data: any) => void;
  onCopyInfoCardSection?: (id: string) => void;
  onDeleteInfoCardSection?: (id: string) => void;
  handleDragEndInfoCardCards: (sectionId: string, event: any) => void;
  getSectionTitle: (sectionId: string) => string;
  isCollapsed?: boolean;
}

export const renderInfoCardSection = (props: RenderInfoCardSectionProps) => {
  const { sectionId, index, infoCardSections, sensors, SectionControls, onUpdateInfoCardSection, handleDragEndInfoCardCards, getSectionTitle, isCollapsed } = props;
  
  const infoCardSection = infoCardSections.find((s) => s.id === sectionId);
  if (!infoCardSection) return null;

  const handleAddCard = () => {
    const newCards = [...(infoCardSection.cards || []), { title: "", content: "", icon: "Info" }];
    onUpdateInfoCardSection(sectionId, { cards: newCards });
  };

  const handleUpdateCard = (cardId: string, data: any) => {
    const index = parseInt(cardId);
    const newCards = [...infoCardSection.cards];
    newCards[index] = { ...newCards[index], ...data };
    onUpdateInfoCardSection(sectionId, { cards: newCards });
  };

  const handleDeleteCard = (cardIndex: number) => {
    const newCards = infoCardSection.cards.filter((_: any, i: number) => i !== cardIndex);
    onUpdateInfoCardSection(sectionId, { cards: newCards });
  };

  return (
    <div key={sectionId} className="space-y-4">
      <SectionControls 
        title={getSectionTitle(sectionId)} 
        index={index}
        sectionId={sectionId}
        onCopy={() => props.onCopyInfoCardSection?.(sectionId)}
        onDelete={() => props.onDeleteInfoCardSection?.(sectionId)}
      />
      
      {!isCollapsed && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor={`${sectionId}_enabled`}>사용</Label>
            <Switch
              id={`${sectionId}_enabled`}
              checked={infoCardSection.enabled === "true"}
              onCheckedChange={(checked) =>
                onUpdateInfoCardSection(sectionId, { enabled: checked ? "true" : "false" })
              }
            />
          </div>
          
          {infoCardSection.enabled === "true" && (
            <>
              <div className="flex justify-end mb-4">
                <Button onClick={handleAddCard} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  카드 추가
                </Button>
              </div>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => handleDragEndInfoCardCards(sectionId, event)}
              >
                <SortableContext
                  items={(infoCardSection.cards || []).map((_: any, i: number) => i.toString())}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {(infoCardSection.cards || []).map((card: any, i: number) => (
                      <SortableInfoCard
                        key={i}
                        id={i.toString()}
                        card={card}
                        cardData={card}
                        onUpdate={(data) => handleUpdateCard(i.toString(), data)}
                        onDelete={() => handleDeleteCard(i)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </>
          )}
        </div>
      )}
    </div>
  );
};