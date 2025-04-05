
import { Invoice } from '@/types/invoice';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import ReactDOMServer from 'react-dom/server';
import InvoicePreview from '@/components/InvoicePreview';
import React from 'react';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: unknown) => jsPDF;
  }
}

export const generateInvoicePDF = async (invoice: Invoice): Promise<void> => {
  try {
    // Render the InvoicePreview component to an HTML string
    const html = ReactDOMServer.renderToString(React.createElement(InvoicePreview, { invoice, className: 'no-glass' }));

    // Create a temporary element to hold the HTML
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    document.body.appendChild(tempElement);

    // Ensure fonts are loaded
    await document.fonts.ready;

    // Wait for fonts and date formatting to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    // Convert the HTML to a canvas using html2canvas
    const canvas = await html2canvas(tempElement, {
      scale: 2, // Increase scale for better resolution
      useCORS: true, // Enable CORS if images are not loading
    });

    document.body.removeChild(tempElement);

    // Create a new PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');

    const margin = 10; // Add margin
    const imgWidth = 210 - (2 * margin); // Adjust image width for margin
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight); // Add margin to image

    // Save PDF
    pdf.save(`Invoice-${invoice.invoiceNumber}.pdf`);
    toast.success("Invoice PDF downloaded successfully");
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error("Failed to generate PDF. Please try again.");
  }
};
