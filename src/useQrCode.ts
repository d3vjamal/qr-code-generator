import { useState, useCallback } from 'react';

function useQrCode(qrRef: React.RefObject<HTMLDivElement>) {
    const [qrData, setQrData] = useState('');
    const [copied, setCopied] = useState(false);

    const generateQRCode = useCallback((text: string) => {
        if (!qrRef.current) return;
        if (!text.trim()) {
            qrRef.current.innerHTML = '';
            return;
        }
        try {
            if (!(window as any).QRious) {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js';
                script.onload = () => createQR(text);
                document.head.appendChild(script);
            } else {
                createQR(text);
            }
        } catch {
            generateFallbackQR(text);
        }
        function createQR(value: string) {
            if (!qrRef.current) return;
            qrRef.current.innerHTML = '';
            const canvas = document.createElement('canvas');
            qrRef.current.appendChild(canvas);
            // @ts-ignore
            new (window as any).QRious({
                element: canvas,
                value,
                size: 300,
                background: 'white',
                foreground: 'black',
                level: 'M'
            });
            canvas.style.maxWidth = '300px';
            canvas.style.height = 'auto';
        }
        function generateFallbackQR(value: string) {
            if (!qrRef.current) return;
            qrRef.current.innerHTML = '';
            const img = document.createElement('img');
            const encoded = encodeURIComponent(value);
            img.src = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encoded}&choe=UTF-8`;
            img.alt = 'Generated QR Code';
            img.style.maxWidth = '300px';
            img.style.height = 'auto';
            img.onerror = () => {
                img.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encoded}&format=png&margin=10`;
            };
            qrRef.current.appendChild(img);
        }
    }, [qrRef]);

    const download = useCallback(() => {
        if (!qrData) return;
        const canvas = qrRef.current?.querySelector('canvas');
        const img = qrRef.current?.querySelector('img');
        if (canvas) {
            const link = document.createElement('a');
            link.download = 'qr-code.png';
            link.href = (canvas as HTMLCanvasElement).toDataURL();
            link.click();
        } else if (img) {
            const link = document.createElement('a');
            link.download = 'qr-code.png';
            link.href = (img as HTMLImageElement).src;
            link.click();
        }
    }, [qrData, qrRef]);

    const copy = useCallback(async () => {
        if (qrData) {
            try {
                await navigator.clipboard.writeText(qrData);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch { }
        }
    }, [qrData]);

    const clear = useCallback(() => {
        if (qrRef.current) qrRef.current.innerHTML = '';
    }, [qrRef]);

    return { qrData, setQrData: (d: string) => { setQrData(d); generateQRCode(d); }, download, copy, copied, clear };
}

export default useQrCode;
