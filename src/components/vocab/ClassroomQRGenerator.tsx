import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { jsPDF } from "jspdf";
import font1 from "../../assets/fonts/font1.ttf";

interface ClassroomQRProps {
  classroomName: string;
  examLink: string;
}

const ClassroomQRGenerator: React.FC<ClassroomQRProps> = ({
  classroomName,
  examLink,
}) => {
  const qrRef = useRef<HTMLCanvasElement>(null);

  const generatePDF = async () => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // ✅ 폰트 파일을 Base64로 변환하는 안전한 방법
      const fontResponse = await fetch(font1);
      const fontBlob = await fontResponse.arrayBuffer();
      const base64Font = btoa(
        new Uint8Array(fontBlob).reduce((data, byte) => data + String.fromCharCode(byte), "")
      );

      // ✅ jsPDF 내장 함수를 사용하여 폰트 추가
      doc.addFileToVFS("CustomFont.ttf", base64Font);
      doc.addFont("CustomFont.ttf", "CustomFont", "normal");
      doc.setFont("CustomFont");

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const qrSize = 70; // QR 코드 크기 (mm)

      // ✅ QR 코드가 렌더링될 때까지 기다림
      const qrCanvas = qrRef.current;
      if (!qrCanvas) {
        alert("QR 코드 캔버스를 찾을 수 없습니다.");
        return;
      }
      const qrDataUrl = qrCanvas.toDataURL("image/png");

      // QR 코드 위치 계산 (페이지 중앙)
      const x = (pageWidth - qrSize) / 2;
      const y = (pageHeight - qrSize) / 2;

      // ✅ QR 코드 이미지 추가
      doc.addImage(qrDataUrl, "PNG", x, y, qrSize, qrSize);

      // ✅ 반 이름 텍스트 추가 (QR 코드 아래)
      doc.setFontSize(16);
      const text = `${classroomName} 영단어 시험`;
      const textWidth = doc.getTextDimensions(text).w;
      doc.text(text, (pageWidth - textWidth) / 2, y + qrSize + 15);

      // ✅ PDF 저장
      doc.save(`${classroomName}_exam_qr.pdf`);
    } catch (error) {
      console.error("PDF 생성 중 오류 발생:", error);
      alert("PDF 생성 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      {/* ✅ QR 코드 캔버스를 숨겨서 렌더링 */}
      <div style={{ display: "none" }}>
        <QRCodeCanvas ref={qrRef} value={examLink} size={300} level={"H"} includeMargin={true} />
      </div>

      <button
        onClick={generatePDF}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        PDF로 QR 코드 생성
      </button>
    </div>
  );
};

export default ClassroomQRGenerator;
