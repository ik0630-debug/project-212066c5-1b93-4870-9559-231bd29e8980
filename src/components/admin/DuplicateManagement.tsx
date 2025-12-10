import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Copy, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RegistrationField {
  id: string;
  label: string;
  type: string;
  required: boolean;
}

interface DuplicateManagementProps {
  registrations: any[];
  registrationFormFields: RegistrationField[];
  onDelete: (id: string) => void;
}

const DuplicateManagement = ({ 
  registrations, 
  registrationFormFields, 
  onDelete 
}: DuplicateManagementProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 활성 신청만 대상으로 함
  const activeRegistrations = registrations.filter(r => r.status !== "cancelled");

  // 선택된 필드를 기준으로 중복 찾기
  const duplicateGroups = useMemo(() => {
    if (selectedFields.length === 0) return [];

    const groups: Record<string, any[]> = {};

    activeRegistrations.forEach((reg) => {
      // 선택된 필드들의 값을 조합하여 키 생성
      const keyParts = selectedFields.map((fieldId) => {
        const value = reg.form_data?.[fieldId] || reg[fieldId] || "";
        return String(value).trim().toLowerCase();
      });
      const key = keyParts.join("|||");

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(reg);
    });

    // 2개 이상인 그룹만 반환 (중복)
    return Object.values(groups).filter((group) => group.length > 1);
  }, [activeRegistrations, selectedFields]);

  // 중복된 전체 신청 목록 (평탄화)
  const duplicateRegistrations = useMemo(() => {
    return duplicateGroups.flat();
  }, [duplicateGroups]);

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldId) 
        ? prev.filter((id) => id !== fieldId) 
        : [...prev, fieldId]
    );
    setSelectedIds([]); // 필드 변경 시 선택 초기화
  };

  const handleSelectAll = () => {
    if (selectedIds.length === duplicateRegistrations.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(duplicateRegistrations.map((r) => r.id));
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      toast({
        title: "선택된 항목 없음",
        description: "삭제할 항목을 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    const confirmed = window.confirm(
      `선택된 ${selectedIds.length}개의 신청을 삭제하시겠습니까?`
    );
    
    if (!confirmed) return;

    for (const id of selectedIds) {
      await onDelete(id);
    }

    setSelectedIds([]);
    toast({
      title: "삭제 완료",
      description: `${selectedIds.length}개의 신청이 삭제되었습니다.`,
    });
  };

  const getFieldValue = (reg: any, fieldId: string) => {
    return reg.form_data?.[fieldId] || reg[fieldId] || "-";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Copy className="w-4 h-4 mr-2" />
          중복값 관리
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>중복값 관리</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* 필드 선택 영역 */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              중복을 확인할 필드를 선택하세요. 여러 필드 선택 시 모든 값이 동일한 경우만 표시됩니다.
            </p>
            <div className="flex flex-wrap gap-3 p-3 bg-muted/50 rounded-lg">
              {registrationFormFields.map((field) => (
                <label
                  key={field.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedFields.includes(field.id)}
                    onCheckedChange={() => handleFieldToggle(field.id)}
                  />
                  <span className="text-sm">{field.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 결과 영역 */}
          {selectedFields.length > 0 && (
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    중복 그룹: {duplicateGroups.length}개
                  </Badge>
                  <Badge variant="outline">
                    중복 신청: {duplicateRegistrations.length}건
                  </Badge>
                </div>
                {duplicateRegistrations.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                    >
                      {selectedIds.length === duplicateRegistrations.length
                        ? "전체 해제"
                        : "전체 선택"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteSelected}
                      disabled={selectedIds.length === 0}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      선택 삭제 ({selectedIds.length})
                    </Button>
                  </div>
                )}
              </div>

              <div className="border rounded-lg overflow-auto flex-1">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">선택</TableHead>
                      {selectedFields.map((fieldId) => {
                        const field = registrationFormFields.find(
                          (f) => f.id === fieldId
                        );
                        return (
                          <TableHead key={fieldId} className="bg-primary/5">
                            {field?.label || fieldId}
                          </TableHead>
                        );
                      })}
                      {registrationFormFields
                        .filter((f) => !selectedFields.includes(f.id))
                        .map((field) => (
                          <TableHead key={field.id}>{field.label}</TableHead>
                        ))}
                      <TableHead className="w-28">신청일</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {duplicateRegistrations.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={registrationFormFields.length + 2}
                          className="text-center py-8 text-muted-foreground"
                        >
                          선택한 필드 기준으로 중복된 신청이 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      duplicateGroups.map((group, groupIndex) =>
                        group.map((reg, regIndex) => (
                          <TableRow
                            key={reg.id}
                            className={
                              groupIndex % 2 === 0
                                ? "bg-background"
                                : "bg-muted/30"
                            }
                          >
                            <TableCell>
                              <Checkbox
                                checked={selectedIds.includes(reg.id)}
                                onCheckedChange={() => handleSelectOne(reg.id)}
                              />
                            </TableCell>
                            {selectedFields.map((fieldId) => (
                              <TableCell
                                key={fieldId}
                                className="font-medium bg-primary/5"
                              >
                                {getFieldValue(reg, fieldId)}
                              </TableCell>
                            ))}
                            {registrationFormFields
                              .filter((f) => !selectedFields.includes(f.id))
                              .map((field) => (
                                <TableCell key={field.id}>
                                  {getFieldValue(reg, field.id)}
                                </TableCell>
                              ))}
                            <TableCell className="whitespace-nowrap">
                              {new Date(reg.created_at).toLocaleDateString(
                                "ko-KR"
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {selectedFields.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              중복 확인할 필드를 선택해주세요.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DuplicateManagement;
