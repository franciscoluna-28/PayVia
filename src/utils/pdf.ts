import { snapdom } from "@zumer/snapdom";
import { jsPDF } from "jspdf";

type GeneratePdfOptions = {
  elementToPrintId: string;
  fileName: string;
  pdfPaddingMm?: number;
};

/**
 * Generates a PDF from a DOM element using snapdom (HTML to Canvas) and jsPDF (Canvas to PDF).
 * @param elementToPrintId The ID of the HTML element to capture.
 * @param fileName The name of the file to be downloaded.
 * @param pdfPaddingMm Padding around the image inside the PDF in millimeters.
 */
export const generatePdf = async ({
  elementToPrintId,
  fileName,
  pdfPaddingMm = 10,
}: GeneratePdfOptions) => {
  const element = document.getElementById(elementToPrintId);

  if (!element) {
    throw new Error(`Element with id ${elementToPrintId} not found`);
  }

  const originalOverflow = element.style.overflow;
  element.style.overflow = "hidden"; // Prevent scrollbars from being captured

  let dataURL: string;

  try {
    const snapdomResult = await snapdom(element, {
      scale: 2,
      embedFonts: true,
    });
    const canvas = await snapdomResult.toCanvas();
    dataURL = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: [210, 297], // A4 standard size
      compress: true,
    });

    const imgProps = pdf.getImageProperties(dataURL);
    const usableWidth = pdf.internal.pageSize.getWidth() - pdfPaddingMm * 2;
    const usableHeight = pdf.internal.pageSize.getHeight() - pdfPaddingMm * 2;

    const ratio = Math.min(
      usableWidth / imgProps.width,
      usableHeight / imgProps.height
    );

    const imgWidth = imgProps.width * ratio;
    const imgHeight = imgProps.height * ratio;

    const x = pdfPaddingMm + (usableWidth - imgWidth) / 2;
    const y = pdfPaddingMm + (usableHeight - imgHeight) / 2;

    pdf.addImage(dataURL, "PNG", x, y, imgWidth, imgHeight);
    pdf.save(fileName);
  } catch (error) {
    throw error;
  } finally {
    element.style.overflow = originalOverflow;
  }
};
