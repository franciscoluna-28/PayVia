import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

export const generatePDF = async (elementToPrintId: string) => {
  const element = document.getElementById(elementToPrintId);
  if (!element) {
    throw new Error(`Element with id ${elementToPrintId} not found`);
  }

  const canvas = await html2canvas(element, { scale: 2 });
  const data = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: [210, 297], // A4
    compress: true,
  });

  const imgProps = pdf.getImageProperties(data);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const ratio = Math.min(
    pdfWidth / imgProps.width,
    pdfHeight / imgProps.height
  );
  const imgWidth = imgProps.width * ratio;
  const imgHeight = imgProps.height * ratio;

  const x = (pdfWidth - imgWidth) / 2;
  const y = (pdfHeight - imgHeight) / 2;

  pdf.addImage(data, "PNG", x, y, imgWidth, imgHeight);
  pdf.save("print.pdf");
};
