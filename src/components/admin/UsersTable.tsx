import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, ShieldOff } from "lucide-react";

interface UsersTableProps {
  users: any[];
  onToggleAdmin: (userId: string, isCurrentlyAdmin: boolean) => void;
  onToggleRegistrationManager: (userId: string, isCurrentlyManager: boolean) => void;
}

const UsersTable = ({ users, onToggleAdmin, onToggleRegistrationManager }: UsersTableProps) => {
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
                <TableCell>
                  {user.is_admin ? "관리자" : user.is_registration_manager ? "등록 관리자" : "일반"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant={user.is_admin ? "destructive" : "default"}
                      size="sm"
                      onClick={() => onToggleAdmin(user.user_id, user.is_admin)}
                    >
                      {user.is_admin ? (
                        <>
                          <ShieldOff className="w-4 h-4 mr-2" />
                          관리자 해제
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          관리자
                        </>
                      )}
                    </Button>
                    <Button
                      variant={user.is_registration_manager ? "destructive" : "secondary"}
                      size="sm"
                      onClick={() => onToggleRegistrationManager(user.user_id, user.is_registration_manager)}
                    >
                      {user.is_registration_manager ? "등록관리 해제" : "등록관리"}
                    </Button>
                  </div>
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
