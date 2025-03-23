
import React from 'react';
import { Invoice } from '@/types/invoice';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import InvoicePreview from '@/components/InvoicePreview';
import { Button } from '@/components/ui/button';
import { ArrowUpToLine, Trash2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SavedInvoicesProps {
  savedInvoices: Invoice[];
  onDelete: (id: string) => void;
  onLoad: (invoice: Invoice) => void;
}

const SavedInvoices: React.FC<SavedInvoicesProps> = ({ 
  savedInvoices, 
  onDelete, 
  onLoad 
}) => {
  const isMobile = useIsMobile();

  if (savedInvoices.length === 0) {
    return (
      <div className="w-full bg-muted/40 rounded-lg p-12 flex flex-col items-center justify-center text-center border border-dashed border-muted-foreground/50 animate-fade-in">
        <div className="rounded-full bg-primary/10 p-4 mb-4">
          <ArrowUpToLine size={32} className="text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Saved Invoices</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Create your first invoice and save it to see it appear here.
        </p>
      </div>
    );
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {savedInvoices.map((invoice) => (
          <CarouselItem key={invoice.id} className={isMobile ? "basis-full" : "basis-1/2"}>
            <div className="relative group">
              <div className="absolute top-0 right-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 m-4">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => onLoad(invoice)}
                  className="bg-background/80 backdrop-blur-sm"
                >
                  <ArrowUpToLine size={16} className="mr-1" />
                  Load
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => onDelete(invoice.id || '')}
                  className="bg-destructive/80 backdrop-blur-sm"
                >
                  <Trash2 size={16} className="mr-1" />
                  Delete
                </Button>
              </div>
              <div className="p-4">
                <div className="mb-2">
                  <h3 className="text-lg font-medium truncate">{invoice.invoiceNumber}</h3>
                  <p className="text-sm text-muted-foreground">
                    {invoice.to.name} • {invoice.total.toFixed(2)} {invoice.currency}
                  </p>
                </div>
                <div className="relative overflow-hidden rounded-lg border border-border/40 shadow-sm transform transition-transform hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <InvoicePreview invoice={invoice} />
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className={`${isMobile ? "left-2" : "-left-12"} shadow-md`} />
      <CarouselNext className={`${isMobile ? "right-2" : "-right-12"} shadow-md`} />
    </Carousel>
  );
};

export default SavedInvoices;
