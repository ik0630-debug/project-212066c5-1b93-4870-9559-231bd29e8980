import { ReactNode } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { useProjectAccess } from "@/hooks/useProjectAccess";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireEdit?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  requireAdmin = false,
  requireEdit = false,
}: ProtectedRouteProps) => {
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';
  const { loading, role, canManageSettings, canEdit } = useProjectAccess();

  console.log('ProtectedRoute:', { isPreview, loading, role });

  // Preview mode bypasses authentication
  if (isPreview) {
    console.log('ProtectedRoute: Preview mode - bypassing auth');
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">권한 확인 중...</div>
      </div>
    );
  }

  // No role means not a member - redirect handled by hook
  if (!role) {
    return <Navigate to="/projects" replace />;
  }

  // Check admin requirement
  if (requireAdmin && !canManageSettings) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">접근 권한 없음</h1>
          <p className="text-muted-foreground mb-4">
            이 페이지에 접근하려면 관리자 권한이 필요합니다.
          </p>
          <p className="text-sm text-muted-foreground">
            현재 역할: <strong>{role}</strong>
          </p>
        </div>
      </div>
    );
  }

  // Check edit requirement
  if (requireEdit && !canEdit) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">접근 권한 없음</h1>
          <p className="text-muted-foreground mb-4">
            이 페이지에 접근하려면 편집 권한이 필요합니다.
          </p>
          <p className="text-sm text-muted-foreground">
            현재 역할: <strong>{role}</strong>
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
