"use client";

import { getTableLink } from "@/lib/utils";
import QRCode from "qrcode";
import { useEffect, useRef } from "react";

export default function QRCodeTable({
  token,
  tableNumber,
  width = 250,
}: {
  token: string;
  tableNumber: number;
  width?: number;
}) {
  // Hiện tại: Thư viện QRCode nó sẽ vẽ lên cái thẻ Canvas
  // Bây giờ: Sẽ tạo 1 cái thẻ canvas ảo để thư viện QRCode nó vẽ QR lên trên đó
  // Cuối cùng thì sẽ đưa cái thẻ canvas ảo chứ QRCode ở trên vào thẻ Canvas thật
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;

    canvas.height = width + 70;
    canvas.width = width;
    const canvasContext = canvas.getContext("2d")!;
    canvasContext.fillStyle = "#fff";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    canvasContext.fillStyle = "#000";
    canvasContext.font = "20px Arial";
    canvasContext.textAlign = "center";
    canvasContext.fillText(
      `Bàn số ${tableNumber}`,
      canvas.width / 2,
      canvas.width + 20,
    );
    canvasContext.fillText(
      `Quét mã QR để gọi món`,
      canvas.width / 2,
      canvas.width + 50,
    );

    const virtualCanvas = document.createElement("canvas");

    QRCode.toCanvas(
      virtualCanvas,
      getTableLink({
        token,
        tableNumber,
      }),
      function (error) {
        if (error) console.error(error);
        canvasContext.drawImage(virtualCanvas, 0, 0, width, width);
      },
    );
  }, [tableNumber, token, width]);

  return <canvas ref={canvasRef} />;
}
