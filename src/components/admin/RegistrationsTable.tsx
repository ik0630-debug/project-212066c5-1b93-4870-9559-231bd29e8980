import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, FileDown } from "lucide-react";
import * as XLSX from "xlsx";
import { useToast } from "@/hooks/use-toast";

interface RegistrationsTableProps {
  registrations: any[];
  onDelete: (id: string) => void;
}

const RegistrationsTable = ({ registrations, onDelete }: RegistrationsTableProps) => {
  const { toast } = useToast();

  const handleExportToExcel = () => {
    try {
      // 데이터 변환
      const exportData = registrations.map((reg) => ({
        이름: reg.name,
        이메일: reg.email,
        연락처: reg.phone,
        회사: reg.company || "-",
        특이사항: reg.message || "-",
        상태: reg.status === "pending" ? "대기중" : reg.status,
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
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>연락처</TableHead>
              <TableHead>회사</TableHead>
              <TableHead>신청일</TableHead>
              <TableHead>작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map((reg) => (
              <TableRow key={reg.id}>
                <TableCell>{reg.name}</TableCell>
                <TableCell>{reg.email}</TableCell>
                <TableCell>{reg.phone}</TableCell>
                <TableCell>{reg.company || "-"}</TableCell>
                <TableCell>{new Date(reg.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(reg.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RegistrationsTable;
