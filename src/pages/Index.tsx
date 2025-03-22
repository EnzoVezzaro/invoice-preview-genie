import React, { useState, useEffect } from 'react';
import { Invoice } from '@/types/invoice-extended';
import EnhancedInvoiceForm from '@/components/EnhancedInvoiceForm';
import EnhancedInvoicePreview from '@/components/EnhancedInvoicePreview';
import SavedInvoices from '@/components/SavedInvoices';
import { Button } from '@/components/ui/button';
import { Download, FilePlus, Printer, Save } from 'lucide-react';
import { generateInvoicePDF } from '@/utils/pdfGenerator';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { emptyInvoice } from '@/types/invoice-extended';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [savedInvoices, setSavedInvoices] = useState<Invoice[]>([]);
  const [invoice, setInvoice] = useState<Invoice>({
    ...emptyInvoice,
    id: uuidv4(),
    fromCustomFields: [],
    toCustomFields: []
  });

  useEffect(() => {
    const storedInvoices = localStorage.getItem('invoices');
    if (storedInvoices) {
      setSavedInvoices(JSON.parse(storedInvoices));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(savedInvoices));
  }, [savedInvoices]);

  const handleSaveInvoice = () => {
    setIsSaving(true);
    setTimeout(() => {
      const invoiceIndex = savedInvoices.findIndex((savedInvoice) => savedInvoice.id === invoice.id);

      if (invoiceIndex !== -1) {
        // If the invoice exists, update it
        const updatedInvoices = [...savedInvoices];
        updatedInvoices[invoiceIndex] = invoice;
        setSavedInvoices(updatedInvoices);
      } else {
        // If the invoice doesn't exist, add it
        setSavedInvoices([...savedInvoices, invoice]);
      }

      toast({
        title: "Success",
        description: t('button.save'),
      });
      setIsSaving(false);
    }, 500);
  };

  const loadInvoice = (invoiceToLoad: Invoice) => {
    setInvoice(invoiceToLoad);
    toast({
      title: "Success",
      description: t('button.load'),
    });
  };

  const deleteInvoice = (invoiceId: string) => {
    setSavedInvoices(savedInvoices.filter((invoice) => invoice.id !== invoiceId));
    toast({
      title: "Success",
      description: t('button.delete'),
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      await generateInvoicePDF(invoice);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF.",
      });
    }
  };

  const handleResetInvoice = () => {
    const newInvoice = {
      ...emptyInvoice,
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [{
        id: uuidv4(),
        description: '',
        quantity: 1,
        price: 0
      }],
      fromCustomFields: [],
      toCustomFields: []
    };
    
    setInvoice(newInvoice);
    toast({
      title: "Success",
      description: t('button.new'),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Button variant="ghost" size="icon" onClick={handleResetInvoice}>
              <FilePlus className="h-4 w-4" />
              <span className="sr-only">{t('button.new')}</span>
            </Button>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <Input
                type="search"
                placeholder="Search invoices..."
                className="max-w-md lg:max-w-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <nav className="flex items-center space-x-2">
              <LanguageSwitcher />
              <Button variant="outline" size="sm" onClick={handleSaveInvoice}>
                <Save className="mr-2 h-4 w-4" />
                {t('button.save')}
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                {t('button.print')}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                <Download className="mr-2 h-4 w-4" />
                {t('button.download')}
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {savedInvoices.length > 0 && (
        <SavedInvoices 
          invoices={savedInvoices} 
          onLoad={loadInvoice} 
          onDelete={deleteInvoice} 
        />
      )}

      <div className="container py-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <EnhancedInvoiceForm invoice={invoice} onChange={setInvoice} />
          <div className={`lg:sticky lg:top-20 ${isMobile ? 'mt-6' : ''}`}>
            <EnhancedInvoicePreview invoice={invoice} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
