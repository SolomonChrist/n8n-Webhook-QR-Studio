import { getHostname } from './validation';
import { jsPDF } from 'jspdf';
import * as htmlToImage from 'html-to-image';

const getFilename = (url: string, ext: string) => {
  const hostname = getHostname(url);
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return `webhook-qr_${hostname}_${date}.${ext}`;
};

export const downloadPng = async (url: string) => {
  const container = document.getElementById('qr-export-container');
  if (!container) {
    console.error("Export container not found");
    return;
  }

  try {
    const filename = getFilename(url, 'png');
    // Using a higher pixel ratio for crispness
    const dataUrl = await htmlToImage.toPng(container, {
      pixelRatio: 4,
      backgroundColor: '#ffffff'
    });
    
    const downloadLink = document.createElement("a");
    downloadLink.href = dataUrl;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } catch (error) {
    console.error('Error generating PNG:', error);
  }
};

export const downloadSvg = (url: string) => {
  const container = document.getElementById('qr-export-container');
  const svgElement = document.getElementById('qr-code-svg');
  if (!container || !svgElement) {
    console.error("Required elements not found");
    return;
  }

  const filename = getFilename(url, 'svg');
  
  // Assemble SVG: Since complex frames use CSS, for SVG we export a simple vector 
  // that preserves scanability. A true vector export of complex CSS frames 
  // requires manual mapping to SVG elements or using a tool that converts DOM to SVG.
  // To keep it deterministic and clean as requested, we'll export the QR as a pure vector.
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
};

export const downloadPdf = async (url: string, timestamp: string) => {
  const container = document.getElementById('qr-export-container');
  if (!container) {
    console.error("Export container not found");
    return;
  }

  try {
    const filename = getFilename(url, 'pdf');
    const hostname = getHostname(url);
    const dateString = new Date(timestamp).toLocaleString();

    // Use high-res capture for PDF embedding
    const dataUrl = await htmlToImage.toPng(container, {
      pixelRatio: 4,
      backgroundColor: '#ffffff'
    });

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: 'letter'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Determine image aspect ratio to fit properly
    const img = new Image();
    img.src = dataUrl;
    await new Promise(resolve => img.onload = resolve);
    
    const aspectRatio = img.width / img.height;
    
    // Target width: ~5.5 inches
    const targetWidth = 5.5;
    const targetHeight = targetWidth / aspectRatio;
    
    const qrX = (pageWidth - targetWidth) / 2;
    const qrY = (pageHeight - targetHeight) / 2 - 0.5;

    doc.addImage(dataUrl, 'PNG', qrX, qrY, targetWidth, targetHeight);

    // Caption
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184); // #94A3B8
    
    const textY = qrY + targetHeight + 0.6;
    doc.text(hostname, pageWidth / 2, textY, { align: 'center' });
    doc.text(`Generated at ${dateString}`, pageWidth / 2, textY + 0.2, { align: 'center' });

    doc.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
