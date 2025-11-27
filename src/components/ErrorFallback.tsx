import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

export const ErrorFallback = ({ error, onReset }: ErrorFallbackProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl">문제가 발생했습니다</CardTitle>
          <CardDescription>
            예상치 못한 오류가 발생했습니다. 아래 버튼을 클릭하여 다시 시도해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground font-mono break-all">
                {error.message}
              </p>
            </div>
          )}
          <div className="flex gap-3">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              새로고침
            </Button>
            <Button onClick={onReset} className="flex-1">
              <Home className="w-4 h-4 mr-2" />
              홈으로
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
