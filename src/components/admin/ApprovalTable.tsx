import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface ApprovalTableProps {
  users: any[];
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
}

const ApprovalTable = ({ users, onApprove, onReject }: ApprovalTableProps) => {
  const pendingUsers = users.filter(user => !user.approved);

  if (pendingUsers.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        승인 대기 중인 사용자가 없습니다.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>이름</TableHead>
            <TableHead>이메일</TableHead>
            <TableHead>소속</TableHead>
            <TableHead>직급</TableHead>
            <TableHead>가입일</TableHead>
            <TableHead className="text-right">승인</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.organization}</TableCell>
              <TableCell>{user.position}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(user.created_at), { 
                  addSuffix: true,
                  locale: ko 
                })}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => onApprove(user.user_id)}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  승인
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onReject(user.user_id)}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  거부
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApprovalTable;
