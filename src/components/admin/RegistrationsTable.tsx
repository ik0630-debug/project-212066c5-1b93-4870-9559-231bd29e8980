import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Trash2, FileDown } from "lucide-react";
import * as XLSX from "xlsx";
import { useToast } from "@/hooks/use-toast";

interface RegistrationsTableProps {
  registrations: any[];
  onDelete: (id: string) => void;
}

const RegistrationsTable = ({ registrations, onDelete }: RegistrationsTableProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");

  // 상태별로 신청 목록 필터링
  const filteredRegistrations = registrations.filter((reg) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return reg.status === "pending";
    if (activeTab === "cancelled") return reg.status === "cancelled";
    return true;
  });

  // 상태별 카운트
  const counts = {
    all: registrations.length,
    pending: registrations.filter((r) => r.status === "pending").length,
    cancelled: registrations.filter((r) => r.status === "cancelled").length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">대기중</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">취소됨</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleExportToExcel = () => {
    try {
      // 현재 필터된 데이터만 내보내기
      const exportData = filteredRegistrations.map((reg) => ({
        이름: reg.name,
        이메일: reg.email,
        연락처: reg.phone,
        회사: reg.company || "-",
        특이사항: reg.message || "-",
        상태: reg.status === "pending" ? "대기중" : reg.status === "cancelled" ? "취소됨" : reg.status,
        신청일: new Date(reg.created_at).toLocaleString("ko-KR"),
      }));

      // 워크북 생성
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "참가신청목록");

      // 파일 다운로드
      const fileName = `참가신청목록_${new Date().toISOString().split("T")[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      toast({
        title: "엑셀 내보내기 완료",
        description: "파일이 다운로드되었습니다.",
      });
    } catch (error) {
      toast({
        title: "내보내기 실패",
        description: "엑셀 파일 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">참가 신청 목록</h2>
        <Button onClick={handleExportToExcel} variant="outline" size="sm">
          <FileDown className="w-4 h-4 mr-2" />
          엑셀 내보내기
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            전체 ({counts.all})
          </TabsTrigger>
          <TabsTrigger value="pending">
            대기중 ({counts.pending})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            취소됨 ({counts.cancelled})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이름</TableHead>
                  <TableHead>이메일</TableHead>
                  <TableHead>연락처</TableHead>
                  <TableHead>회사</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>신청일</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      신청 내역이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <TableRow key={reg.id}>
                      <TableCell>{reg.name}</TableCell>
                      <TableCell>{reg.email}</TableCell>
                      <TableCell>{reg.phone}</TableCell>
                      <TableCell>{reg.company || "-"}</TableCell>
                      <TableCell>{getStatusBadge(reg.status)}</TableCell>
                      <TableCell>{new Date(reg.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="destructive" size="sm" onClick={() => onDelete(reg.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RegistrationsTable;
