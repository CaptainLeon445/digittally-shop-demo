'use client';

import { useRef } from 'react';
import QRCode from 'react-qr-code';
import { Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import Button from '@/components/ui/Button';

interface ShopQRCodeProps {
  url: string;
  shopName: string;
}

export default function ShopQRCode({ url, shopName }: ShopQRCodeProps) {
  const svgRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadQR = () => {
    if (!svgRef.current) return;

    const svgEl = svgRef.current.querySelector('svg');
    if (!svgEl) return;

    const svgData = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    // Draw to canvas to get PNG
    const canvas = document.createElement('canvas');
    const size = 300;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(svgUrl);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${shopName.replace(/\s+/g, '-').toLowerCase()}-qr.png`;
        a.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    };
    img.src = svgUrl;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* QR Code */}
      <div
        ref={svgRef}
        className="bg-white p-5 rounded-2xl border-2 border-primary-100 shadow-card"
        style={{ background: 'linear-gradient(135deg, #f0fafb 0%, #ffffff 100%)' }}
      >
        <QRCode
          value={url}
          size={180}
          fgColor="#0b7d8e"
          style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
          viewBox="0 0 256 256"
        />
      </div>

      <p className="text-xs text-primary/60 text-center font-mono break-all max-w-xs">{url}</p>

      {/* Actions */}
      <div className="flex gap-2 flex-wrap justify-center">
        <Button variant="outline" size="sm" onClick={handleCopyLink}>
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-1.5 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-1.5" />
              Copy Link
            </>
          )}
        </Button>
        <Button variant="primary" size="sm" onClick={handleDownloadQR}>
          <Download className="w-4 h-4 mr-1.5" />
          Download QR
        </Button>
      </div>
    </div>
  );
}
