import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { ProjectMemberInviteDialog } from "./ProjectMemberInviteDialog";

interface ProjectMember {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  profiles: {
    name: string;
    email: string;
    organization: string;
    position: string;
  };
}

interface ProjectMembersTableProps {
  members: ProjectMember[];
  onUpdateRole: (memberId: string, role: string) => void;
  onRemove: (memberId: string) => void;
  onInvite: (email: string, role: string) => Promise<void>;
}

const roleLabels: Record<string, string> = {
  owner: "소유자",
  admin: "관리자",
  editor: "편집자",
  viewer: "뷰어",
};

const ProjectMembersTable = ({ members, onUpdateRole, onRemove, onInvite }: ProjectMembersTableProps) => {
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>프로젝트 멤버</CardTitle>
              <CardDescription>
                프로젝트에 접근할 수 있는 사용자를 관리합니다
              </CardDescription>
            </div>
            <Button onClick={() => setShowInviteDialog(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              프로젝트 멤버 초대
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>소속</TableHead>
                <TableHead>직책</TableHead>
                <TableHead>역할</TableHead>
                <TableHead>가입일</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.profiles.name}</TableCell>
                  <TableCell>{member.profiles.email}</TableCell>
                  <TableCell>{member.profiles.organization}</TableCell>
                  <TableCell>{member.profiles.position}</TableCell>
                  <TableCell>
                    <Select
                      value={member.role}
                      onValueChange={(value) => onUpdateRole(member.id, value)}
                      disabled={member.role === "owner"}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owner">소유자</SelectItem>
                        <SelectItem value="admin">관리자</SelectItem>
                        <SelectItem value="editor">편집자</SelectItem>
                        <SelectItem value="viewer">뷰어</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {new Date(member.created_at).toLocaleDateString("ko-KR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemove(member.id)}
                      disabled={member.role === "owner"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {members.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    프로젝트 멤버가 없습니다
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ProjectMemberInviteDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        onInvite={onInvite}
      />
    </>
  );
};

export default ProjectMembersTable;
