
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface AdditionalInfoSectionProps {
  notes: string;
  terms: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
  notes,
  terms,
  handleInputChange
}) => {
  return (
    <Card className="glass-card card-animation overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Additional Information</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={notes}
              onChange={handleInputChange}
              placeholder="Add any notes you want to include on the invoice"
              className="form-input min-h-24"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="terms">Terms & Conditions</Label>
            <Textarea
              id="terms"
              name="terms"
              value={terms}
              onChange={handleInputChange}
              placeholder="Add your payment terms and conditions"
              className="form-input min-h-24"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdditionalInfoSection;
