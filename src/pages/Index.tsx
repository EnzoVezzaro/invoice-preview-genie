
import React, { useState } from 'react';
import { Invoice } from '@/types/invoice';
import InvoiceForm from '@/components/InvoiceForm';
import InvoicePreview from '@/components/InvoicePreview';
import { Button } from '@/components/ui/button';
import { Download, FilePlus, Printer } from 'lucide-react';
import { generateInvoicePDF } from '@/utils/pdfGenerator';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();
  const [invoice, setInvoice] = useState<Invoice>({
    invoiceNumber: 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
    dateIssued: new Date().toISOString().split('T')[0],
    dateDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +30 days
    from: {
      name: 'Your Business Name',
      street: '123 Business Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107',
      country: 'United States',
      email: 'contact@yourbusiness.com',
      phone: '(123) 456-7890'
    },
    to: {
      name: 'Client Name',
      street: '456 Client Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'United States',
      email: 'client@example.com',
      phone: ''
    },
    items: [
      {
        id: uuidv4(),
        description: 'Website Design',
        quantity: 1,
        unitPrice: 1200,
        total: 1200
      }
    ],
    notes: 'Thank you for your business!',
    terms: 'Payment due within 30 days of receipt.',
    taxRate: 10,
    taxAmount: 120,
    subtotal: 1200,
    total: 1320,
    currency: '$',
    logo: ''
  });

  const handlePrint = () => {
    window.print();
    toast.success('Sent to printer');
  };

  const handleResetInvoice = () => {
    const newInvoice = {
      ...invoice,
      invoiceNumber: 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      dateIssued: new Date().toISOString().split('T')[0],
      dateDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [],
      notes: '',
      terms: '',
      taxRate: 0,
      taxAmount: 0,
      subtotal: 0,
      total: 0,
    };
    
    setInvoice(newInvoice);
    toast.success('Created new invoice');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <header className="glass border-b border-border/40 shadow-subtle py-6 px-6 md:px-8 mb-8">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Invoice Generator</h1>
              <p className="text-muted-foreground mt-1">Create beautiful, professional invoices in seconds</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                onClick={handleResetInvoice}
                className="flex-1 md:flex-initial"
              >
                <FilePlus size={18} className="mr-2" /> New Invoice
              </Button>
              <Button
                variant="outline"
                onClick={handlePrint}
                className="flex-1 md:flex-initial"
              >
                <Printer size={18} className="mr-2" /> Print
              </Button>
              <Button
                onClick={() => generateInvoicePDF(invoice)}
                className="flex-1 md:flex-initial"
              >
                <Download size={18} className="mr-2" /> Download PDF
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container max-w-7xl pb-16 px-4 md:px-8">
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-8' : 'grid-cols-2 gap-12'}`}>
          <div>
            <InvoiceForm invoice={invoice} setInvoice={setInvoice} />
          </div>
          <div className={`${isMobile ? '' : 'sticky top-8'} h-fit`}>
            <div className="mb-4">
              <h2 className="text-xl font-medium">Invoice Preview</h2>
              <p className="text-muted-foreground text-sm">Live preview of your invoice</p>
            </div>
            <InvoicePreview invoice={invoice} />
          </div>
        </div>
      </main>
      
      <footer className="bg-muted/50 py-6 border-t border-border/40 text-center text-muted-foreground text-sm">
        <div className="container">
          &copy; {new Date().getFullYear()} Invoice Generator
        </div>
      </footer>
    </div>
  );
};

export default Index;
