import { useEffect, useRef, useState } from "react";
import type { Html5Qrcode } from "html5-qrcode";

export function QrScanner({ onResult }: { onResult: (text: string) => void }) {
  const [error, setError] = useState<string | null>(null);
  const done = useRef(false);
  useEffect(() => {
    let scanner: Html5Qrcode | undefined;
    let cancelled = false;
    import("html5-qrcode").then(({ Html5Qrcode }) => {
      if (cancelled) return;
      scanner = new Html5Qrcode("qr-reader");
      scanner
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 220 },
          (text: string) => {
            if (done.current) return;
            done.current = true;
            onResult(text);
          },
          () => {},
        )
        .catch(() =>
          setError(
            "Nem sikerült elérni a kamerát. Engedélyezze a kamera használatát a böngészőben.",
          ),
        );
    });
    return () => {
      cancelled = true;
      if (scanner?.isScanning) scanner.stop().catch(() => {});
    };
  }, [onResult]);
  return (
    <div>
      <div
        id="qr-reader"
        className="overflow-hidden rounded-md bg-muted"
        style={{ minHeight: 240 }}
      />
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
    </div>
  );
}
