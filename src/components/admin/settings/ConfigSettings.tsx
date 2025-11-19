import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Download, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConfigSettingsProps {
  registrations: any[];
}

const ConfigSettings = ({ registrations }: ConfigSettingsProps) => {
  const { toast } = useToast();
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null);

  const generateQRData = (registration: any) => {
    // QR코드에 검증 페이지 URL 포함
    const baseUrl = window.location.origin;
    return `${baseUrl}/registration/verify?id=${registration.id}`;
  };

  const downloadQRCode = (registration: any) => {
    const svg = document.getElementById(`qr-${registration.id}`);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `QR_${registration.name}_${registration.id}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();

      toast({
        title: "QR코드 다운로드 완료",
        description: `${registration.name}님의 QR코드가 다운로드되었습니다.`,
      });
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const downloadAllQRCodes = () => {
    registrations.forEach((reg, index) => {
      setTimeout(() => {
        downloadQRCode(reg);
      }, index * 500); // 각 다운로드 간 0.5초 간격
    });

    toast({
      title: "전체 QR코드 다운로드 시작",
      description: `${registrations.length}개의 QR코드 다운로드를 시작합니다.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">설정</h2>
        <p className="text-muted-foreground">QR코드 생성 및 자동 이메일 발송 기능</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            QR코드 생성
          </CardTitle>
          <CardDescription>
            등록자 정보를 QR코드로 생성하여 다운로드할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-end">
            <Button 
              onClick={downloadAllQRCodes}
              disabled={registrations.length === 0}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              전체 QR코드 다운로드 ({registrations.length}개)
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {registrations.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                등록된 신청자가 없습니다.
              </div>
            ) : (
              registrations.map((registration) => (
                <Card key={registration.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base">{registration.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {registration.company} {registration.position && `· ${registration.position}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-center p-4 bg-white rounded-lg">
                      <QRCodeSVG
                        id={`qr-${registration.id}`}
                        value={generateQRData(registration)}
                        size={180}
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>전화: {registration.phone}</p>
                      <p>이메일: {registration.email}</p>
                      {registration.department && <p>부서: {registration.department}</p>}
                    </div>
                    <Button
                      onClick={() => downloadQRCode(registration)}
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                    >
                      <Download className="w-4 h-4" />
                      다운로드
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>자동 이메일 발송</CardTitle>
          <CardDescription>
            등록 확인 이메일 자동 발송 기능 (추후 구현 예정)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            등록자에게 자동으로 확인 이메일을 발송하는 기능이 추가될 예정입니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfigSettings;
