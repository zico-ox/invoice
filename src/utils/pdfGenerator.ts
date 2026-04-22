// c:\Users\fayiz\Documents\codex\invoicemaker\src\utils\pdfGenerator.ts

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (element: HTMLElement, fileName: string = 'invoice.pdf') => {
  const canvas = await html2canvas(element, {
    scale: 2, // Reduced scale for reasonable quality and smaller size
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  // Use JPEG compression with 0.75 quality to significantly reduce file size
  const imgData = canvas.toDataURL('image/jpeg', 0.75);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  
  const imgX = (pdfWidth - imgWidth * ratio) / 2;
  const imgY = 0;

  pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
  pdf.save(fileName);
};
