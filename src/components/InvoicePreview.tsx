
import React from 'react';
import { InvoicePreviewProps } from '@/types/invoice';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Card className="glass-card overflow-hidden border border-border/40 shadow-elevation animate-fade-in">
      <CardContent className="p-8">
        <div className="mb-8 flex justify-between items-start">
          {invoice.logo ? (
            <img src={invoice.logo} alt="Company Logo" className="h-16 object-contain rounded-sm" />
          ) : (
            <div className="text-3xl font-bold tracking-tight">INVOICE</div>
          )}
          <div className="text-right">
            <div className="text-xl font-semibold">Invoice #{invoice.invoiceNumber}</div>
            <div className="text-muted-foreground mt-1">
              Issued: {formatDate(invoice.dateIssued)}
            </div>
            <div className="text-muted-foreground">
              Due: {formatDate(invoice.dateDue)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <div className="text-sm text-muted-foreground mb-2">FROM</div>
            <div className="font-medium">{invoice.from.name}</div>
            <div>{invoice.from.street}</div>
            <div>{invoice.from.city}, {invoice.from.state} {invoice.from.zipCode}</div>
            <div>{invoice.from.country}</div>
            {invoice.from.phone && <div className="mt-2">Phone: {invoice.from.phone}</div>}
            {invoice.from.email && <div>Email: {invoice.from.email}</div>}
            {invoice.from.customFields &&
              Object.entries(invoice.from.customFields).map(([key, value]) => (
                <div key={key}>
                  {key}: {value}
                </div>
              ))}
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground mb-2">TO</div>
            <div className="font-medium">{invoice.to.name}</div>
            <div>{invoice.to.street}</div>
            <div>{invoice.to.city}, {invoice.to.state} {invoice.to.zipCode}</div>
            <div>{invoice.to.country}</div>
            {invoice.to.phone && <div className="mt-2">Phone: {invoice.to.phone}</div>}
            {invoice.to.email && <div>Email: {invoice.to.email}</div>}
            {invoice.to.customFields &&
              Object.entries(invoice.to.customFields).map(([key, value]) => (
                <div key={key}>
                  {key}: {value}
                </div>
              ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="grid grid-cols-12 gap-2 py-2 font-medium text-sm border-b border-border">
            <div className="col-span-6">Description</div>
            <div className="col-span-2 text-right">Quantity</div>
            <div className="col-span-2 text-right">Unit Price</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>
          
          {invoice.items.length === 0 ? (
            <div className="py-4 text-center text-muted-foreground italic">
              No items added to this invoice
            </div>
          ) : (
            invoice.items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 py-3 border-b border-border/40 text-sm">
                <div className="col-span-6">{item.description || 'Item description'}</div>
                <div className="col-span-2 text-right">{item.quantity}</div>
                <div className="col-span-2 text-right">{invoice.currency} {item.unitPrice.toFixed(2)}</div>
                <div className="col-span-2 text-right">{invoice.currency} {item.total.toFixed(2)}</div>
              </div>
            ))
          )}
          
          <div className="mt-4 flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Subtotal:</span>
                <span>{invoice.currency} {invoice.subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm">Tax ({invoice.taxRate}%):</span>
                <span>{invoice.currency} {invoice.taxAmount.toFixed(2)}</span>
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>{invoice.currency} {invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {(invoice.notes || invoice.terms) && (
          <div className="space-y-4 text-sm">
            {invoice.notes && (
              <div>
                <div className="font-medium mb-1">Notes</div>
                <div className="text-muted-foreground">{invoice.notes}</div>
              </div>
            )}
            
            {invoice.terms && (
              <div>
                <div className="font-medium mb-1">Terms & Conditions</div>
                <div className="text-muted-foreground">{invoice.terms}</div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoicePreview;
