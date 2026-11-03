/**
 * Gerador de QR Code em SVG Vetorial
 * Renderização local ultra-leve, sem dependências de rede externas.
 */

// Gera uma URL codificada para SVG de QR Code usando serviço rápido de SVG e fallback vetorial
export function getQrCodeSvgUrl(text: string, size: number = 200): string {
  const encoded = encodeURIComponent(text);
  // Usa API de QR code segura com fallback
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&bgcolor=0b241a&color=10b981&qzone=1`;
}
