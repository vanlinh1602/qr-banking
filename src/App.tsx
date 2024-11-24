import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function BankingQRGenerator() {
  const [bankDetails, setBankDetails] = useState({
    bank: '',
    accountNumber: '',
    accountHolder: '',
    amount: '',
    content: '',
  });
  const [qrStyle, setQrStyle] = useState('classic');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBankDetails({ ...bankDetails, [e.target.name]: e.target.value });
  };

  const handleBankChange = (value: string) => {
    setBankDetails({ ...bankDetails, bank: value });
  };

  const handleStyleChange = (value: string) => {
    setQrStyle(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically call an API to generate the QR code
    console.log('Generating QR code with:', { ...bankDetails, qrStyle });
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Banking QR Code Generator</CardTitle>
          <CardDescription>
            Generate a QR code for bank transfers
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <CardTitle className="text-xl">Part 1: Banking Details</CardTitle>
              <div className="space-y-2">
                <Label htmlFor="bank">Select Bank</Label>
                <Select onValueChange={handleBankChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank1">Bank 1</SelectItem>
                    <SelectItem value="bank2">Bank 2</SelectItem>
                    <SelectItem value="bank3">Bank 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  name="accountNumber"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountHolder">Account Holder Name</Label>
                <Input
                  id="accountHolder"
                  name="accountHolder"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Input
                  id="content"
                  name="content"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-4">
              <CardTitle className="text-xl">Part 2: QR Code Style</CardTitle>
              <RadioGroup
                defaultValue="classic"
                onValueChange={handleStyleChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="classic" id="classic" />
                  <Label htmlFor="classic">Classic</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dotted" id="dotted" />
                  <Label htmlFor="dotted">Dotted</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rounded" id="rounded" />
                  <Label htmlFor="rounded">Rounded</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Generate QR Code
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Placeholder for generated QR code */}
      {bankDetails.bank && (
        <Card className="mt-6 w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Generated QR Code</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <img
              src={'/placeholder.svg?height=200&width=200&text=QR Code'}
              alt="Generated QR Code"
              className="w-48 h-48"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
