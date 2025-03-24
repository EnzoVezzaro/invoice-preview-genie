import React from 'react';
import { InvoiceFormProps, InvoiceItem as InvoiceItemType } from '@/types/invoice';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import InvoiceItem from './InvoiceItem';
import { Plus, Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import CustomFieldInput from './CustomFieldInput';
import useTranslation from '@/hooks/use-translation';

const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, setInvoice }) => {
  const t = useTranslation();

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setInvoice(prev => ({
        ...prev,
        [parent]: {
          ...((prev[parent as keyof typeof prev] as object) ?? {}),
          [child]: value
        }
      }));
    } else {
      setInvoice(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="w-full space-y-4 animate-slide-in">
      {/* Basic Invoice Info Section */}
      <Card className="glass-card card-animation overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-medium mb-1">{t('invoiceInformation')}</h3>
              <p className="text-sm text-muted-foreground">{t('basicDetailsAboutInvoice')}</p>
            </div>
            <div className="relative">
              <Button 
                variant="outline" 
                className="relative overflow-hidden text-xs"
                onClick={() => document.getElementById('logo-upload')?.click()}
              >
                <Upload size={14} className="mr-1" />
                {invoice.logo ? t('changeLogo') : t('uploadLogo')}
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
              <Label htmlFor="invoiceNumber">{t('invoiceNumber')}</Label>
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
              <Label htmlFor="dateIssued">{t('dateIssued')}</Label>
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
              <Label htmlFor="dateDue">{t('dateDue')}</Label>
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
              <Label htmlFor="currency">{t('currency')}</Label>
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
                  <SelectItem value="RD$">DOP (RD$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* From & To Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* From Section */}
        <Card className="glass-card card-animation overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">{t('from')}</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="from.name">{t('businessName')}</Label>
                <Input
                  id="from.name"
                  name="from.name"
                  value={invoice.from.name}
                  onChange={handleInputChange}
                  placeholder="Your Business Name"
                  className="form-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="from.street">{t('streetAddress')}</Label>
                <Input
                  id="from.street"
                  name="from.street"
                  value={invoice.from.street}
                  onChange={handleInputChange}
                  placeholder="123 Business Street"
                  className="form-input"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="from.city">{t('city')}</Label>
                  <Input
                    id="from.city"
                    name="from.city"
                    value={invoice.from.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="form-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="from.state">{t('state')}</Label>
                  <Input
                    id="from.state"
                    name="from.state"
                    value={invoice.from.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="from.zipCode">{t('zipCode')}</Label>
                  <Input
                    id="from.zipCode"
                    name="from.zipCode"
                    value={invoice.from.zipCode}
                    onChange={handleInputChange}
                    placeholder="Zip Code"
                    className="form-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="from.country">{t('country')}</Label>
                  <Input
                    id="from.country"
                    name="from.country"
                    value={invoice.from.country}
                    onChange={handleInputChange}
                    placeholder="Country"
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="from.email">{t('email')}</Label>
                  <Input
                    id="from.email"
                    name="from.email"
                    type="email"
                    value={invoice.from.email || ''}
                    onChange={handleInputChange}
                    placeholder="you@business.com"
                    className="form-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="from.phone">{t('phone')}</Label>
                  <Input
                    id="from.phone"
                    name="from.phone"
                    value={invoice.from.phone || ''}
                    onChange={handleInputChange}
                    placeholder="(123) 456-7890"
                    className="form-input"
                  />
                </div>
              </div>

              {/* Custom Fields Section */}
              <div className="space-y-2">
                <Label>{t('customFields')}</Label>
                {Object.entries(invoice.from.customFields || {}).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <CustomFieldInput
                      keyName={key}
                      addressType="from"
                      invoice={invoice}
                      setInvoice={setInvoice}
                    />
                    <Input
                      placeholder="Field Value"
                      value={value}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setInvoice((prev) => ({
                          ...prev,
                          from: {
                            ...prev.from,
                            customFields: {
                              ...(prev.from.customFields || {}),
                              [key]: newValue,
                            },
                          },
                        }));
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setInvoice((prev) => {
                          const newCustomFields = { ...prev.from.customFields };
                          delete newCustomFields[key];
                          return {
                            ...prev,
                            from: {
                              ...prev.from,
                              customFields: newCustomFields,
                            },
                          };
                        });
                      }}
                      className="text-destructive hover:bg-destructive/10 p-2 rounded-full transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setInvoice((prev) => ({
                      ...prev,
                      from: {
                        ...prev.from,
                        customFields: {
                          ...(prev.from.customFields || {}),
                          [`New Field ${Object.keys(prev.from.customFields || {}).length + 1}`]: "",
                        },
                      },
                    }));
                  }}
                >
                  {t('addCustomField')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* To Section */}
        <Card className="glass-card card-animation overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">{t('to')}</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="to.name">{t('clientName')}</Label>
                <Input
                  id="to.name"
                  name="to.name"
                  value={invoice.to.name}
                  onChange={handleInputChange}
                  placeholder={t('clientName')}
                  className="form-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="to.street">{t('streetAddress')}</Label>
                <Input
                  id="to.street"
                  name="to.street"
                  value={invoice.to.street}
                  onChange={handleInputChange}
                  placeholder={t('streetAddress')}
                  className="form-input"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="to.city">{t('city')}</Label>
                  <Input
                    id="to.city"
                    name="to.city"
                    value={invoice.to.city}
                    onChange={handleInputChange}
                    placeholder={t('city')}
                    className="form-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="to.state">{t('state')}</Label>
                  <Input
                    id="to.state"
                    name="to.state"
                    value={invoice.to.state}
                    onChange={handleInputChange}
                    placeholder={t('state')}
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="to.zipCode">{t('zipCode')}</Label>
                  <Input
                    id="to.zipCode"
                    name="to.zipCode"
                    value={invoice.to.zipCode}
                    onChange={handleInputChange}
                    placeholder={t('zipCode')}
                    className="form-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="to.country">{t('country')}</Label>
                  <Input
                    id="to.country"
                    name="to.country"
                    value={invoice.to.country}
                    onChange={handleInputChange}
                    placeholder={t('country')}
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="to.email">{t('email')}</Label>
                  <Input
                    id="to.email"
                    name="to.email"
                    type="email"
                    value={invoice.to.email || ''}
                    onChange={handleInputChange}
                    placeholder="client@example.com"
                    className="form-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="to.phone">{t('phone')}</Label>
                  <Input
                    id="to.phone"
                    name="to.phone"
                    value={invoice.to.phone || ''}
                    onChange={handleInputChange}
                    placeholder="(123) 456-7890"
                    className="form-input"
                  />
                </div>
              </div>

              {/* Custom Fields Section */}
              <div className="space-y-2">
                <Label>{t('customFields')}</Label>
                {Object.entries(invoice.to.customFields || {}).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <CustomFieldInput
                      keyName={key}
                      addressType="to"
                      invoice={invoice}
                      setInvoice={setInvoice}
                    />
                    <Input
                      placeholder="Field Value"
                      value={value}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setInvoice((prev) => ({
                          ...prev,
                          to: {
                            ...prev.to,
                            customFields: {
                              ...(prev.to.customFields || {}),
                              [key]: newValue,
                            },
                          },
                        }));
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setInvoice((prev) => {
                          const newCustomFields = { ...prev.to.customFields };
                          delete newCustomFields[key];
                          return {
                            ...prev,
                            to: {
                              ...prev.to,
                              customFields: newCustomFields,
                            },
                          };
                        });
                      }}
                      className="text-destructive hover:bg-destructive/10 p-2 rounded-full transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setInvoice((prev) => ({
                      ...prev,
                      to: {
                        ...prev.to,
                        customFields: {
                          ...(prev.to.customFields || {}),
                          [`New Field ${Object.keys(prev.to.customFields || {}).length + 1}`]: "",
                        },
                      },
                    }));
                  }}
                >
                  {t('addCustomField')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items Section */}
      <Card className="glass-card card-animation overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-medium mb-1">{t('invoiceItems')}</h3>
              <p className="text-sm text-muted-foreground">{t('addProductsOrServices')}</p>
            </div>
            <Button 
              onClick={handleAddItem} 
              variant="outline" 
              size="sm"
              className="transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
            >
              <Plus size={16} className="mr-1" /> {t('addItem')}
            </Button>
          </div>
          
          <div className="space-y-1">
            <div className="grid grid-cols-12 gap-2 mb-2 text-sm font-medium text-muted-foreground">
              <div className="col-span-4">{t('description')}</div>
              <div className="col-span-2">{t('quantity')}</div>
              <div className="col-span-2">{t('unitPrice')}</div>
              <div className="col-span-2 text-right pr-2">{t('total')}</div>
              <div className="col-span-1"></div>
            </div>
            
            <Separator className="my-2" />
            
            {invoice.items.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <p>{t('noItemsAdded')}</p>
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
                  <span>{t('subtotal')}:</span>
                  <span>{invoice.currency} {invoice.subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span>{t('taxRate')}:</span>
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
                        <SelectItem value="18">18%</SelectItem>
                        <SelectItem value="20">20%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>{t('taxAmount')}:</span>
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

      {/* Additional Info */}
      <Card className="glass-card card-animation overflow-hidden">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">{t('additionalInformation')}</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">{t('notes')}</Label>
              <Textarea
                id="notes"
                name="notes"
                value={invoice.notes}
                onChange={handleInputChange}
                placeholder={t('addAnyNotes')}
                className="form-input min-h-24"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="terms">{t('termsAndConditions')}</Label>
              <Textarea
                id="terms"
                name="terms"
                value={invoice.terms}
                onChange={handleInputChange}
                placeholder={t('addPaymentTerms')}
                className="form-input min-h-24"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceForm;
