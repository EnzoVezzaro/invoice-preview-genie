
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Invoice } from '@/types/invoice';

interface BasicInvoiceInfoProps {
  invoice: Invoice;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setInvoice: React.Dispatch<React.SetStateAction<Invoice>>;
}

const BasicInvoiceInfo: React.FC<BasicInvoiceInfoProps> = ({ 
  invoice, 
  handleInputChange, 
  setInvoice 
}) => {
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 1024 * 1024) {  // 1MB
      toast.error('File size must be less than 1MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setInvoice(prev => ({
          ...prev,
          logo: event.target?.result as string
        }));
        toast.success('Logo uploaded successfully');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card className="glass-card card-animation overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-medium mb-1">Invoice Information</h3>
            <p className="text-sm text-muted-foreground">Basic details about your invoice</p>
          </div>
          <div className="relative">
            <Button 
              variant="outline" 
              className="relative overflow-hidden text-xs"
              onClick={() => document.getElementById('logo-upload')?.click()}
            >
              <Upload size={14} className="mr-1" />
              {invoice.logo ? 'Change Logo' : 'Upload Logo'}
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleLogoUpload}
              />
            </Button>
            {invoice.logo && (
              <div className="mt-2 flex justify-center">
                <img 
                  src={invoice.logo} 
                  alt="Invoice Logo" 
                  className="h-12 object-contain rounded-sm"
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice #</Label>
            <Input
              id="invoiceNumber"
              name="invoiceNumber"
              value={invoice.invoiceNumber}
              onChange={handleInputChange}
              placeholder="INV-001"
              className="form-input"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dateIssued">Date Issued</Label>
            <Input
              id="dateIssued"
              name="dateIssued"
              type="date"
              value={invoice.dateIssued}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dateDue">Date Due</Label>
            <Input
              id="dateDue"
              name="dateDue"
              type="date"
              value={invoice.dateDue}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select 
              value={invoice.currency} 
              onValueChange={(value) => setInvoice(prev => ({ ...prev, currency: value }))}
            >
              <SelectTrigger id="currency" className="form-input">
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="$">USD ($)</SelectItem>
                <SelectItem value="€">EUR (€)</SelectItem>
                <SelectItem value="£">GBP (£)</SelectItem>
                <SelectItem value="¥">JPY (¥)</SelectItem>
                <SelectItem value="₹">INR (₹)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInvoiceInfo;
