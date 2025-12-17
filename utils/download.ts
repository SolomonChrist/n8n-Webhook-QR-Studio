import { getHostname } from './validation';
import { jsPDF } from 'jspdf';
import * as htmlToImage from 'html-to-image';

export const getFilename = (url: string, ext: string) => {
  const hostname = getHostname(url);
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return `webhook-qr_${hostname}_${date}.${ext}`;
};

export const getQrBlob = async (): Promise<Blob | null> => {
  const container = document.getElementById('qr-export-container');
  if (!container) {
    console.error("Export container 'qr-export-container' not found in DOM.");
    return null;
  }

  try {
    // We use toBlob directly from the imported module
    const blob = await htmlToImage.toBlob(container, {
      pixelRatio: 3, // 3 is usually enough for high-quality without hitting browser canvas limits
      backgroundColor: '#ffffff',
      cacheBust: true,
    });
    return blob;
  } catch (error) {
    console.error('Error generating blob with html-to-image:', error);
    return null;
  }
};

export const downloadPng = async (url: string) => {
  const blob = await getQrBlob();
  if (!blob) return;

  try {
    const filename = getFilename(url, 'png');
    const dataUrl = URL.createObjectURL(blob);
    
    const downloadLink = document.createElement("a");
    downloadLink.href = dataUrl;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(dataUrl);
  } catch (error) {
    console.error('Error downloading PNG:', error);
  }
};

export const downloadSvg = (url: string) => {
  const svgElement = document.getElementById('qr-code-svg');
  if (!svgElement) {
    console.error("SVG element 'qr-code-svg' not found in DOM.");
    return;
  }

  try {
    const filename = getFilename(url, 'svg');
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgElement);

    if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
    const urlBlob = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

    const downloadLink = document.createElement("a");
    downloadLink.href = urlBlob;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } catch (error) {
    console.error('Error downloading SVG:', error);
  }
};

export const downloadPdf = async (url: string, timestamp: string) => {
  const blob = await getQrBlob();
  if (!blob) return;

  try {
    const filename = getFilename(url, 'pdf');
    const hostname = getHostname(url);
    const dateString = new Date(timestamp).toLocaleString();
    const dataUrl = URL.createObjectURL(blob);

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: 'letter'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    
    const aspectRatio = img.width / img.height;
    const targetWidth = 5.5;
    const targetHeight = targetWidth / aspectRatio;
    
    const qrX = (pageWidth - targetWidth) / 2;
    const qrY = (pageHeight - targetHeight) / 2 - 0.5;

    doc.addImage(dataUrl, 'PNG', qrX, qrY, targetWidth, targetHeight);

    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184); // #94A3B8
    
    const textY = qrY + targetHeight + 0.6;
    doc.text(hostname, pageWidth / 2, textY, { align: 'center' });
    doc.text(`Generated at ${dateString}`, pageWidth / 2, textY + 0.2, { align: 'center' });

    doc.save(filename);
    URL.revokeObjectURL(dataUrl);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};