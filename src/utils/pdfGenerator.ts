
import { Invoice } from '@/types/invoice';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'sonner';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generateInvoicePDF = (invoice: Invoice): void => {
  try {
    // Create a new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 20;

    // Set font styles
    doc.setFont('helvetica');
    doc.setFontSize(10);

    // Add logo if available
    if (invoice.logo) {
      try {
        doc.addImage(invoice.logo, 'PNG', margin, yPos, 40, 40);
        yPos += 45;
      } catch (error) {
        console.error('Error adding logo to PDF:', error);
      }
    } else {
      // Add title if no logo
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('INVOICE', margin, yPos);
      yPos += 15;
    }

    // Add invoice details
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, pageWidth - margin - 80, 30);
    doc.text(`Date Issued: ${invoice.dateIssued}`, pageWidth - margin - 80, 37);
    doc.text(`Date Due: ${invoice.dateDue}`, pageWidth - margin - 80, 44);

    // Add sender information
    doc.setFont('helvetica', 'bold');
    doc.text('From:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.from.name, margin, yPos + 7);
    doc.text(invoice.from.street, margin, yPos + 14);
    doc.text(`${invoice.from.city}, ${invoice.from.state} ${invoice.from.zipCode}`, margin, yPos + 21);
    doc.text(invoice.from.country, margin, yPos + 28);
    invoice.from.phone && doc.text(`Phone: ${invoice.from.phone}`, margin, yPos + 35);
    invoice.from.email && doc.text(`Email: ${invoice.from.email}`, margin, yPos + 42);

    // Add recipient information
    doc.setFont('helvetica', 'bold');
    doc.text('To:', pageWidth / 2, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.to.name, pageWidth / 2, yPos + 7);
    doc.text(invoice.to.street, pageWidth / 2, yPos + 14);
    doc.text(`${invoice.to.city}, ${invoice.to.state} ${invoice.to.zipCode}`, pageWidth / 2, yPos + 21);
    doc.text(invoice.to.country, pageWidth / 2, yPos + 28);
    invoice.to.phone && doc.text(`Phone: ${invoice.to.phone}`, pageWidth / 2, yPos + 35);
    invoice.to.email && doc.text(`Email: ${invoice.to.email}`, pageWidth / 2, yPos + 42);

    yPos += 60;

    // Add invoice items
    const tableColumn = ["Description", "Quantity", `Unit Price (${invoice.currency})`, `Total (${invoice.currency})`];
    const tableRows = invoice.items.map(item => [
      item.description,
      item.quantity.toString(),
      item.unitPrice.toFixed(2),
      item.total.toFixed(2)
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: yPos,
      theme: 'grid',
      headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], fontStyle: 'bold' },
      styles: { fontSize: 9, font: 'helvetica', cellPadding: 4 },
      margin: { left: margin, right: margin }
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;

    // Add subtotal, tax and total
    const rightAlign = pageWidth - margin - 50;
    doc.text('Subtotal:', rightAlign, yPos);
    doc.text(`${invoice.currency} ${invoice.subtotal.toFixed(2)}`, pageWidth - margin, yPos, { align: 'right' });
    
    yPos += 7;
    doc.text(`Tax (${invoice.taxRate}%):`, rightAlign, yPos);
    doc.text(`${invoice.currency} ${invoice.taxAmount.toFixed(2)}`, pageWidth - margin, yPos, { align: 'right' });
    
    yPos += 7;
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', rightAlign, yPos);
    doc.text(`${invoice.currency} ${invoice.total.toFixed(2)}`, pageWidth - margin, yPos, { align: 'right' });
    doc.setFont('helvetica', 'normal');

    yPos += 20;

    // Add notes
    if (invoice.notes) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Notes:', margin, yPos);
      doc.setFont('helvetica', 'normal');
      
      const splitNotes = doc.splitTextToSize(invoice.notes, pageWidth - (margin * 2));
      doc.text(splitNotes, margin, yPos + 7);
      
      yPos += 7 + (splitNotes.length * 5);
    }

    // Add terms
    if (invoice.terms) {
      yPos += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Terms & Conditions:', margin, yPos);
      doc.setFont('helvetica', 'normal');
      
      const splitTerms = doc.splitTextToSize(invoice.terms, pageWidth - (margin * 2));
      doc.text(splitTerms, margin, yPos + 7);
    }

    // Save PDF
    doc.save(`Invoice-${invoice.invoiceNumber}.pdf`);
    toast.success("Invoice PDF downloaded successfully");
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error("Failed to generate PDF. Please try again.");
  }
};
