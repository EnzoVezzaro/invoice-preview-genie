
import React from 'react';
import { InvoiceItem as InvoiceItemType } from '@/types/invoice';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';

interface Props {
  item: InvoiceItemType;
  onUpdate: (id: string, updatedItem: InvoiceItemType) => void;
  onRemove: (id: string) => void;
  currency: string;
}

const InvoiceItem: React.FC<Props> = ({ item, onUpdate, onRemove, currency }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let updatedItem = { ...item };
    
    if (name === 'quantity') {
      updatedItem.quantity = Number(value) || 0;
      updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
    } else if (name === 'unitPrice') {
      updatedItem.unitPrice = Number(value) || 0;
      updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
    } else if (name === 'description') {
      updatedItem.description = value;
    }
    
    onUpdate(item.id, updatedItem);
  };

  return (
    <div className="grid grid-cols-12 gap-2 mb-2 items-center animate-fade-in">
      <div className="col-span-5">
        <Input
          name="description"
          value={item.description}
          onChange={handleChange}
          placeholder="Description"
          className="form-input"
        />
      </div>
      <div className="col-span-2">
        <Input
          name="quantity"
          type="number"
          value={item.quantity.toString()}
          onChange={handleChange}
          placeholder="Qty"
          min="1"
          className="form-input"
        />
      </div>
      <div className="col-span-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
            {currency}
          </div>
          <Input
            name="unitPrice"
            type="number"
            value={item.unitPrice.toString()}
            onChange={handleChange}
            placeholder="Price"
            min="0"
            step="0.01"
            className="form-input pl-7"
          />
        </div>
      </div>
      <div className="col-span-2 text-right pr-2">
        <div className="form-input bg-secondary/50 flex items-center justify-end">
          <span>{currency} {item.total.toFixed(2)}</span>
        </div>
      </div>
      <div className="col-span-1 flex justify-center">
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="text-destructive hover:bg-destructive/10 p-2 rounded-full transition-colors"
          aria-label="Remove item"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default InvoiceItem;
