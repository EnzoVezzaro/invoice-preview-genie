
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import InvoiceItem from '../InvoiceItem';
import { Plus } from 'lucide-react';
import { InvoiceItem as InvoiceItemType, Invoice } from '@/types/invoice';
import { v4 as uuidv4 } from 'uuid';

interface InvoiceItemsSectionProps {
  invoice: Invoice;
  setInvoice: React.Dispatch<React.SetStateAction<Invoice>>;
}

const InvoiceItemsSection: React.FC<InvoiceItemsSectionProps> = ({
  invoice,
  setInvoice
}) => {
  const handleAddItem = () => {
    const newItem: InvoiceItemType = {
      id: uuidv4(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };

    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const handleUpdateItem = (id: string, updatedItem: InvoiceItemType) => {
    setInvoice(prev => {
      const newItems = prev.items.map(item => 
        item.id === id ? updatedItem : item
      );
      
      // Recalculate subtotal and total
      const subtotal = newItems.reduce((sum, item) => sum + item.total, 0);
      const taxAmount = (subtotal * (prev.taxRate / 100));
      const total = subtotal + taxAmount;

      return {
        ...prev,
        items: newItems,
        subtotal,
        taxAmount,
        total
      };
    });
  };

  const handleRemoveItem = (id: string) => {
    setInvoice(prev => {
      const newItems = prev.items.filter(item => item.id !== id);
      
      // Recalculate subtotal and total
      const subtotal = newItems.reduce((sum, item) => sum + item.total, 0);
      const taxAmount = (subtotal * (prev.taxRate / 100));
      const total = subtotal + taxAmount;

      return {
        ...prev,
        items: newItems,
        subtotal,
        taxAmount,
        total
      };
    });
  };

  const handleTaxRateChange = (value: string) => {
    const taxRate = parseFloat(value);
    
    setInvoice(prev => {
      const taxAmount = (prev.subtotal * (taxRate / 100));
      const total = prev.subtotal + taxAmount;
      
      return {
        ...prev,
        taxRate,
        taxAmount,
        total
      };
    });
  };

  return (
    <Card className="glass-card card-animation overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-medium mb-1">Invoice Items</h3>
            <p className="text-sm text-muted-foreground">Add products or services</p>
          </div>
          <Button 
            onClick={handleAddItem} 
            variant="outline" 
            size="sm"
            className="transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            <Plus size={16} className="mr-1" /> Add Item
          </Button>
        </div>
        
        <div className="space-y-1">
          <div className="grid grid-cols-12 gap-2 mb-2 text-sm font-medium text-muted-foreground">
            <div className="col-span-5">Description</div>
            <div className="col-span-2">Quantity</div>
            <div className="col-span-2">Unit Price</div>
            <div className="col-span-2 text-right pr-2">Total</div>
            <div className="col-span-1"></div>
          </div>
          
          <Separator className="my-2" />
          
          {invoice.items.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <p>No items added. Click "Add Item" to get started.</p>
            </div>
          ) : (
            invoice.items.map(item => (
              <InvoiceItem
                key={item.id}
                item={item}
                onUpdate={handleUpdateItem}
                onRemove={handleRemoveItem}
                currency={invoice.currency}
              />
            ))
          )}
          
          <div className="mt-4 flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{invoice.currency} {invoice.subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span>Tax Rate:</span>
                <div className="w-24">
                  <Select 
                    value={invoice.taxRate.toString()} 
                    onValueChange={handleTaxRateChange}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="0%" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="5">5%</SelectItem>
                      <SelectItem value="7.5">7.5%</SelectItem>
                      <SelectItem value="10">10%</SelectItem>
                      <SelectItem value="12.5">12.5%</SelectItem>
                      <SelectItem value="15">15%</SelectItem>
                      <SelectItem value="20">20%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Tax Amount:</span>
                <span>{invoice.currency} {invoice.taxAmount.toFixed(2)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>{invoice.currency} {invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceItemsSection;
