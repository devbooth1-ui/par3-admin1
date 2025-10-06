import QRCode from 'qrcode';

export async function generateQRCode(data: string): Promise<string> {
  try {
    return await QRCode.toDataURL(data);
  } catch (err) {
    console.error('QR code generation failed:', err);
    return '';
  }
}
