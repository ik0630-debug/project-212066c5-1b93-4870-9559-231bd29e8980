import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

interface UseLocationSettingsHandlersProps {
  transportCards: any[];
  bottomButtons: any[];
  downloadFiles: any[];
  buttonGroups: any[];
  sectionOrder: string[];
  onTransportCardsChange: (cards: any[]) => void;
  onBottomButtonsChange: (buttons: any[]) => void;
  onDownloadFilesChange: (files: any[]) => void;
  onButtonGroupsChange: (groups: any[]) => void;
  onSectionOrderChange: (order: string[]) => void;
  onSaveSectionOrder: (order: string[]) => void;
}

export const useLocationSettingsHandlers = ({
  transportCards,
  bottomButtons,
  downloadFiles,
  buttonGroups,
  sectionOrder,
  onTransportCardsChange,
  onBottomButtonsChange,
  onDownloadFilesChange,
  onButtonGroupsChange,
  onSectionOrderChange,
  onSaveSectionOrder,
}: UseLocationSettingsHandlersProps) => {

  // Transport Card handlers
  const handleAddTransportCard = () => {
    onTransportCardsChange([...transportCards, { icon: "Train", title: "새 교통수단", description: "설명을 입력하세요" }]);
  };

  const handleUpdateTransportCard = (id: string, data: any) => {
    const index = parseInt(id);
    const newCards = [...transportCards];
    newCards[index] = { ...newCards[index], ...data };
    onTransportCardsChange(newCards);
  };

  const handleDeleteTransportCard = (index: number) => {
    onTransportCardsChange(transportCards.filter((_, i) => i !== index));
  };

  const handleDragEndTransportCards = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = transportCards.findIndex((_, i) => i.toString() === active.id);
      const newIndex = transportCards.findIndex((_, i) => i.toString() === over.id);
      onTransportCardsChange(arrayMove(transportCards, oldIndex, newIndex));
    }
  };

  // Bottom Button handlers
  const handleAddBottomButton = () => {
    onBottomButtonsChange([...bottomButtons, { text: "새 버튼", link: "/", linkType: "internal", variant: "outline", size: "default", fontSize: "text-sm" }]);
  };

  const handleUpdateBottomButton = (id: string, data: any) => {
    const index = parseInt(id);
    const newButtons = [...bottomButtons];
    newButtons[index] = { ...newButtons[index], ...data };
    onBottomButtonsChange(newButtons);
  };

  const handleDeleteBottomButton = (index: number) => {
    onBottomButtonsChange(bottomButtons.filter((_, i) => i !== index));
  };

  const handleDragEndBottomButtons = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = bottomButtons.findIndex((_, i) => i.toString() === active.id);
      const newIndex = bottomButtons.findIndex((_, i) => i.toString() === over.id);
      onBottomButtonsChange(arrayMove(bottomButtons, oldIndex, newIndex));
    }
  };

  // Unified Buttons (merging bottomButtons and downloadFiles)
  const unifiedButtons = [
    ...bottomButtons.map((btn: any) => ({
      ...btn,
      linkType: btn.linkType || (btn.link?.startsWith('http') ? 'external' : 'internal'),
    })),
    ...downloadFiles.map((file: any) => ({
      text: file.name,
      link: file.url,
      fileUrl: file.url,
      linkType: 'file',
      variant: 'outline',
      size: 'default',
      fontSize: 'text-sm',
    })),
  ];

  const handleAddUnifiedButton = () => {
    const newButton = { text: "새 버튼", link: "/", linkType: "internal", variant: "outline", size: "default", fontSize: "text-sm" };
    onBottomButtonsChange([...bottomButtons, newButton]);
  };

  const handleUpdateUnifiedButton = (index: number, data: any) => {
    const totalBottomButtons = bottomButtons.length;
    
    if (index < totalBottomButtons) {
      const newButtons = [...bottomButtons];
      newButtons[index] = { ...newButtons[index], ...data };
      onBottomButtonsChange(newButtons);
    } else {
      const fileIndex = index - totalBottomButtons;
      const newDownloadFiles = [...downloadFiles];
      newDownloadFiles.splice(fileIndex, 1);
      onDownloadFilesChange(newDownloadFiles);
      
      const newButton = {
        text: data.text,
        link: data.linkType === 'file' ? (data.fileUrl || data.link) : data.link,
        fileUrl: data.fileUrl,
        linkType: data.linkType,
        variant: data.variant || 'outline',
        size: data.size || 'default',
        fontSize: data.fontSize || 'text-sm',
        bgColor: data.bgColor,
        textColor: data.textColor,
      };
      onBottomButtonsChange([...bottomButtons, newButton]);
    }
  };

  const handleDeleteUnifiedButton = (index: number) => {
    const totalBottomButtons = bottomButtons.length;
    
    if (index < totalBottomButtons) {
      onBottomButtonsChange(bottomButtons.filter((_, i) => i !== index));
    } else {
      const fileIndex = index - totalBottomButtons;
      onDownloadFilesChange(downloadFiles.filter((_, i) => i !== fileIndex));
    }
  };

  const handleDragEndUnifiedButtons = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id as string);
      const newIndex = parseInt(over.id as string);
      const newButtons = arrayMove(unifiedButtons, oldIndex, newIndex);
      
      const newBottomButtons = newButtons.filter((btn: any) => btn.linkType !== 'file' || !btn.fileUrl || btn.text !== btn.link);
      const newDownloadFiles = newButtons
        .filter((btn: any) => btn.linkType === 'file' && btn.fileUrl)
        .map((btn: any) => ({ name: btn.text, url: btn.fileUrl || btn.link }));
      
      onBottomButtonsChange(newBottomButtons);
      onDownloadFilesChange(newDownloadFiles);
    }
  };

  // Download File handlers
  const handleAddDownloadFile = () => {
    onDownloadFilesChange([...downloadFiles, { name: "새 파일", url: "" }]);
  };

  const handleUpdateDownloadFile = (index: number, data: any) => {
    const newFiles = [...downloadFiles];
    newFiles[index] = data;
    onDownloadFilesChange(newFiles);
  };

  const handleDeleteDownloadFile = (index: number) => {
    onDownloadFilesChange(downloadFiles.filter((_, i) => i !== index));
  };

  const handleDragEndDownloadFiles = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = downloadFiles.findIndex((_, i) => i.toString() === active.id);
      const newIndex = downloadFiles.findIndex((_, i) => i.toString() === over.id);
      onDownloadFilesChange(arrayMove(downloadFiles, oldIndex, newIndex));
    }
  };

  // Section handlers
  const handleMoveSectionUp = (index: number) => {
    if (index > 0) {
      const newOrder = [...sectionOrder];
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
      onSectionOrderChange(newOrder);
      onSaveSectionOrder(newOrder);
    }
  };

  const handleMoveSectionDown = (index: number) => {
    if (index < sectionOrder.length - 1) {
      const newOrder = [...sectionOrder];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      onSectionOrderChange(newOrder);
      onSaveSectionOrder(newOrder);
    }
  };

  const handleAddSection = (sectionId: string) => {
    if (!sectionOrder.includes(sectionId)) {
      const newOrder = [...sectionOrder, sectionId];
      onSectionOrderChange(newOrder);
      onSaveSectionOrder(newOrder);
    }
  };

  const handleRemoveSection = (sectionId: string) => {
    const newOrder = sectionOrder.filter(id => id !== sectionId);
    onSectionOrderChange(newOrder);
    onSaveSectionOrder(newOrder);
  };

  const handleAddButtonGroup = () => {
    const newId = `button_group_${Date.now()}`;
    const newButtonGroup = {
      id: newId,
      alignment: "center",
      buttons: [{ text: "새 버튼", link: "/", linkType: "internal", variant: "outline", size: "default", fontSize: "text-sm" }],
      order: buttonGroups.length,
    };
    onButtonGroupsChange([...buttonGroups, newButtonGroup]);
    handleAddSection(newId);
  };

  return {
    handleAddTransportCard,
    handleUpdateTransportCard,
    handleDeleteTransportCard,
    handleDragEndTransportCards,
    handleAddBottomButton,
    handleUpdateBottomButton,
    handleDeleteBottomButton,
    handleDragEndBottomButtons,
    unifiedButtons,
    handleAddUnifiedButton,
    handleUpdateUnifiedButton,
    handleDeleteUnifiedButton,
    handleDragEndUnifiedButtons,
    handleAddDownloadFile,
    handleUpdateDownloadFile,
    handleDeleteDownloadFile,
    handleDragEndDownloadFiles,
    handleMoveSectionUp,
    handleMoveSectionDown,
    handleAddSection,
    handleRemoveSection,
    handleAddButtonGroup,
  };
};
