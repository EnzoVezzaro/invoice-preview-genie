import React, { useState, useEffect } from 'react';
import { Invoice } from '@/types/invoice';
import InvoiceForm from '@/components/InvoiceForm';
import InvoicePreview from '@/components/InvoicePreview';
import SavedInvoices from '@/components/SavedInvoices';
import { Button } from '@/components/ui/button';
import { Download, FilePlus, Printer, Save } from 'lucide-react';
import { generateInvoicePDF } from '@/utils/pdfGenerator';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from "lucide-react"
import { v4 as uuidv4 } from 'uuid';
import { useIsMobile } from '@/hooks/use-mobile';
import useTranslation from '@/hooks/use-translation';
import i18next from '@/i18n';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const Index = () => {
  const isMobile = useIsMobile();
  const t = useTranslation();
  const [downloading, setDownloading] = useState(false);
  const [language, setLanguage] = useState(i18next.language);
  const [savedInvoices, setSavedInvoices] = useState<Invoice[]>([]);
  const [invoice, setInvoice] = useState<Invoice>({
    id: uuidv4(),
    invoiceNumber: 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
    dateIssued: formatDate(new Date()),
    dateDue: formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // +30 days
    from: {
      name: t('businessName'),
      street: t('streetAddress'),
      city: t('city'),
      state: t('state'),
      zipCode: t('zipCode'),
      country: t('country'),
      email: 'contact@yourbusiness.com',
      phone: '(123) 456-7890'
    },
    to: {
      name: t('clientName'),
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      email: '',
      phone: ''
    },
    items: [
      {
        id: uuidv4(),
        description: 'Consulting Services',
        quantity: 1,
        unitPrice: 1200,
        total: 1200
      }
    ],
    notes: t('notes'),
    terms: t('termsAndConditions'),
    taxRate: 10,
    taxAmount: 120,
    subtotal: 1200,
    total: 1320,
    currency: '$',
    logo: ''
  });

  // Load saved invoices from localStorage on component mount
  useEffect(() => {
    const storedInvoices = localStorage.getItem('savedInvoices');
    if (storedInvoices) {
      try {
        const parsedInvoices = JSON.parse(storedInvoices);
        setSavedInvoices(parsedInvoices);
      } catch (error) {
        console.error('Error parsing saved invoices:', error);
        localStorage.removeItem('savedInvoices');
      }
    }
  }, []);

  const saveInvoice = () => {
    // Make sure the invoice has an ID
    const invoiceToSave = { ...invoice };
    if (!invoiceToSave.id) {
      invoiceToSave.id = uuidv4();
    }
    
    // Check if the invoice already exists
    const exists = savedInvoices.some(inv => inv.id === invoiceToSave.id);
    
    let updatedInvoices;
    if (exists) {
      // Update existing invoice
      updatedInvoices = savedInvoices.map(inv => 
        inv.id === invoiceToSave.id ? invoiceToSave : inv
      );
      toast({
        title: t('success'),
        description: t('invoiceUpdated'),
      });
    } else {
      // Add new invoice to the beginning of the array
      updatedInvoices = [invoiceToSave, ...savedInvoices];
      toast({
        title: t('success'),
        description: t('invoiceSaved'),
      });
    }
    
    setSavedInvoices(updatedInvoices);
    localStorage.setItem('savedInvoices', JSON.stringify(updatedInvoices));

    // Update current invoice with the ID if it was new
    /*
    setInvoice({
      id: uuidv4(),
      invoiceNumber: 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      dateIssued: new Date().toISOString().split('T')[0],
      dateDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      from: { ...invoice.from },
      to: {
        name: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        email: '',
        phone: ''
      },
      items: [],
      notes: '',
      terms: 'Payment due within 30 days of receipt.',
      taxRate: 0,
      taxAmount: 0,
      subtotal: 0,
      total: 0,
      currency: '$',
      logo: invoice.logo
    });
    */
  };

  const deleteInvoice = (id: string) => {
    const updatedInvoices = savedInvoices.filter(inv => inv.id !== id);
    setSavedInvoices(updatedInvoices);
    localStorage.setItem('savedInvoices', JSON.stringify(updatedInvoices));
    toast({
      title: t('success'),
      description: t('invoiceDeleted'),
    });
  };

  const loadInvoice = (invoiceToLoad: Invoice) => {
    setInvoice(invoiceToLoad);
    toast({
      title: t('success'),
      description: t('invoiceLoaded'),
    });
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: t('success'),
      description: t('sentToPrinter'),
    });
  };

  const handleResetInvoice = () => {
    const newInvoice = {
      id: uuidv4(),
      invoiceNumber: 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      dateIssued: formatDate(new Date()),
      dateDue: formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
      from: { ...invoice.from },
      to: {
        name: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        email: '',
        phone: ''
      },
      items: [],
      notes: '',
      terms: 'Payment due within 30 days of receipt.',
      taxRate: 0,
      taxAmount: 0,
      subtotal: 0,
      total: 0,
      currency: invoice.currency,
      logo: invoice.logo
    };
    
    setInvoice(newInvoice);
    toast({
      title: t('success'),
      description: t('createdNewInvoice'),
    });
  };

  const changeLanguage = () => {
    const newLanguage = i18next.language === 'es' ? 'en' : 'es';
    setLanguage(newLanguage);
    i18next.changeLanguage(newLanguage);
  };

  const getFlag = () => {
    return i18next.language === 'es' ? "🇺🇸" : "🇩🇴";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <header className="glass border-b border-border/40 shadow-subtle py-6 px-6 md:px-8 mb-8">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 text-white rounded-md flex items-center justify-center font-bold text-xl">KI</div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                onClick={handleResetInvoice}
                className="flex-1 md:flex-initial"
              >
                <FilePlus size={18} className="mr-2" /> {t('newInvoice')}
              </Button>
              {
                /**
                 * <Button
                variant="outline"
                onClick={handlePrint}
                className="flex-1 md:flex-initial"
              >
                <Printer size={18} className="mr-2" /> {t('print')}
              </Button>
                 * 
                 */
              }
              <Button
                variant="outline"
                onClick={saveInvoice}
                className="flex-1 md:flex-initial"
              >
                <Save size={18} className="mr-2" /> {t('save')}
              </Button>
             <Button
                onClick={async () => {
                  setDownloading(true);
                  try {
                    await generateInvoicePDF(invoice);
                  } finally {
                    setDownloading(false);
                  }
                }}
                className="flex-1 md:flex-initial"
                disabled={downloading}
              >
                {downloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('downloadingPDF')}
                  </>
                ) : (
                  <>
                    <Download size={18} className="mr-2" /> {t('downloadPDF')}
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={changeLanguage}
                className="flex-1 md:flex-initial text-2xl"
              >
                {getFlag()}
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container max-w-7xl pb-16 px-4 md:px-8">
        {/* Saved Invoices Carousel */}
        <div className="mb-8 animate-fade-in">
          <div className="mb-4">
            <h2 className="text-xl font-medium">{t('savedInvoices')}</h2>
            <p className="text-muted-foreground text-sm">{t('browseAndLoadInvoices')}</p>
          </div>
          <SavedInvoices 
            savedInvoices={savedInvoices}
            onDelete={deleteInvoice}
            onLoad={loadInvoice}
          />
        </div>
        
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-8' : 'grid-cols-2 gap-12'}`}>
          <div>
            <InvoiceForm invoice={invoice} setInvoice={setInvoice} />
          </div>
          <div className={`${isMobile ? '' : 'sticky top-8'} h-fit`}>
            <div className="mb-4">
              <h2 className="text-xl font-medium">{t('invoicePreview')}</h2>
              <p className="text-muted-foreground text-sm">{t('livePreviewOfInvoice')}</p>
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
