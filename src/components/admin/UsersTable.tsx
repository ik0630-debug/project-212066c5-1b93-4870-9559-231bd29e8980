import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, ShieldOff } from "lucide-react";

interface UsersTableProps {
  users: any[];
  onToggleAdmin: (userId: string, isCurrentlyAdmin: boolean) => void;
}

const UsersTable = ({ users, onToggleAdmin }: UsersTableProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">사용자 목록</h2>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>소속</TableHead>
              <TableHead>권한</TableHead>
              <TableHead>작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.organization}</TableCell>
                <TableCell>{user.is_admin ? "관리자" : "일반"}</TableCell>
                <TableCell>
                  <Button
                    variant={user.is_admin ? "destructive" : "default"}
                    size="sm"
                    onClick={() => onToggleAdmin(user.user_id, user.is_admin)}
                  >
                    {user.is_admin ? (
                      <>
                        <ShieldOff className="w-4 h-4 mr-2" />
                        권한 해제
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        관리자 권한 부여
                      </>
                    )}
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

export default UsersTable;
