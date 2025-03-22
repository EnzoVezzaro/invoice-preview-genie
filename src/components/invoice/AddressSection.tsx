
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Address } from '@/types/invoice';

interface AddressSectionProps {
  title: string;
  address: Address;
  prefix: 'from' | 'to';
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const AddressSection: React.FC<AddressSectionProps> = ({ 
  title, 
  address, 
  prefix, 
  handleInputChange 
}) => {
  return (
    <Card className="glass-card card-animation overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">{title}</h3>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor={`${prefix}.name`}>{prefix === 'from' ? 'Business Name' : 'Client Name'}</Label>
            <Input
              id={`${prefix}.name`}
              name={`${prefix}.name`}
              value={address.name}
              onChange={handleInputChange}
              placeholder={prefix === 'from' ? 'Your Business Name' : 'Client Name'}
              className="form-input"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`${prefix}.street`}>Street Address</Label>
            <Input
              id={`${prefix}.street`}
              name={`${prefix}.street`}
              value={address.street}
              onChange={handleInputChange}
              placeholder={prefix === 'from' ? '123 Business Street' : '456 Client Street'}
              className="form-input"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor={`${prefix}.city`}>City</Label>
              <Input
                id={`${prefix}.city`}
                name={`${prefix}.city`}
                value={address.city}
                onChange={handleInputChange}
                placeholder="City"
                className="form-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`${prefix}.state`}>State</Label>
              <Input
                id={`${prefix}.state`}
                name={`${prefix}.state`}
                value={address.state}
                onChange={handleInputChange}
                placeholder="State"
                className="form-input"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor={`${prefix}.zipCode`}>Zip Code</Label>
              <Input
                id={`${prefix}.zipCode`}
                name={`${prefix}.zipCode`}
                value={address.zipCode}
                onChange={handleInputChange}
                placeholder="Zip Code"
                className="form-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`${prefix}.country`}>Country</Label>
              <Input
                id={`${prefix}.country`}
                name={`${prefix}.country`}
                value={address.country}
                onChange={handleInputChange}
                placeholder="Country"
                className="form-input"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor={`${prefix}.email`}>Email</Label>
              <Input
                id={`${prefix}.email`}
                name={`${prefix}.email`}
                type="email"
                value={address.email || ''}
                onChange={handleInputChange}
                placeholder={prefix === 'from' ? 'you@business.com' : 'client@example.com'}
                className="form-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`${prefix}.phone`}>Phone</Label>
              <Input
                id={`${prefix}.phone`}
                name={`${prefix}.phone`}
                value={address.phone || ''}
                onChange={handleInputChange}
                placeholder="(123) 456-7890"
                className="form-input"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressSection;
