"use client";

import QRCode from "react-qr-code";
import { BRAND_NAME } from "@/lib/brand";

type CustomerQrCodeProps = {
  profileUrl: string;
  qrPublicId: string;
};

export function CustomerQrCode({ profileUrl, qrPublicId }: CustomerQrCodeProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="rounded-2xl bg-white p-4">
        <QRCode
          bgColor="#ffffff"
          fgColor="#0f172a"
          level="M"
          size={180}
          title={`${BRAND_NAME} profile ${qrPublicId}`}
          value={profileUrl}
        />
      </div>
      <p className="mt-4 text-lg font-semibold">{qrPublicId}</p>
      <p className="mt-1 max-w-xs text-center text-sm text-slate-400">
        Scan with your phone camera — opens your dashboard on this phone.
      </p>
      <p className="mt-2 max-w-xs text-center text-xs text-slate-500">
        Phone must be on the same Wi‑Fi as this PC. If the page does not load, open the URL below manually in Chrome/Safari.
      </p>
      <a
        className="mt-3 max-w-xs break-all text-center text-[11px] text-sky-300 underline"
        href={profileUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        {profileUrl}
      </a>
    </div>
  );
}
