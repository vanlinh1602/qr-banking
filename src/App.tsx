import QRCodeStyling, { Options } from 'qr-code-styling';
import { useEffect, useRef, useState } from 'react';

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
import banks from '@/lib/banks.json';

import QRCodeConfig from './components/QRConfig';
import SearchableSelect from './components/SearchableSelect';
import { defaultQRCodeOptions, defaultQRData } from './lib/options';
import { BankingService } from './services/banking';

type BankingInfo = {
  bank: string;
  accountNumber: string;
  accountHolder: string;
  amount: string;
  content: string;
};

export default function BankingQRGenerator() {
  const [bankDetails, setBankDetails] = useState<BankingInfo>({
    bank: '',
    accountNumber: '',
    accountHolder: '',
    amount: '',
    content: '',
  });
  const [options, setOptions] = useState<Options>(defaultQRCodeOptions);
  const [qrCode] = useState<QRCodeStyling>(
    new QRCodeStyling({
      width: 300,
      height: 300,
      data: defaultQRData,
    })
  );
  const [openConfig, setOpenConfig] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      qrCode.append(ref.current);
    }
  }, [qrCode, ref]);

  useEffect(() => {
    if (!qrCode) return;
    qrCode.update(options);
  }, [qrCode, options]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBankDetails({ ...bankDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const service = new BankingService({ ...bankDetails });
    const qrData = service.generateCode();

    qrCode.update({
      data: qrData,
    });
  };

  return (
    <div className="w-svw p-4 flex flex-col md:flex-row md:space-x-4 md:items-center">
      {openConfig ? (
        <QRCodeConfig
          onCancel={() => setOpenConfig(false)}
          onSave={(opt) => {
            setOptions((pre) => ({ ...pre, ...opt }));
            setOpenConfig(false);
          }}
          options={options}
        />
      ) : null}
      <Card className="w-full mx-auto md:w-2/3">
        <CardHeader>
          <CardTitle>Tạo Banking QR</CardTitle>
          <CardDescription>
            Generate a QR code for bank transfers
          </CardDescription>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bank">Ngân Hàng</Label>
                <SearchableSelect
                  className="w-full text-ellipsis"
                  options={banks.map((bank) => ({
                    label: `(${bank.shortName}) ${bank.name}`,
                    value: bank.bin,
                    icon: bank.logo,
                  }))}
                  onSelect={(v) => setBankDetails({ ...bankDetails, bank: v })}
                  placeholder="Chọn ngân hàng"
                  value={bankDetails.bank}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Số tài khoản</Label>
                <Input
                  id="accountNumber"
                  name="accountNumber"
                  placeholder="0337541878"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountHolder">Chủ tài khoản</Label>
                <Input
                  id="accountHolder"
                  name="accountHolder"
                  placeholder="NGUYEN VAN LINH"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Số tiền</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="text"
                  placeholder="20.000"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value) {
                      const formattedValue = new Intl.NumberFormat().format(
                        Number(value)
                      );
                      setBankDetails({
                        ...bankDetails,
                        amount: formattedValue,
                      });
                    } else {
                      setBankDetails({
                        ...bankDetails,
                        amount: '',
                      });
                    }
                  }}
                  value={bankDetails.amount}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Nội dung</Label>
                <Input
                  id="content"
                  name="content"
                  placeholder="Donate cho Linh"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </CardHeader>
        <CardContent className="space-y-6"></CardContent>
        <CardFooter className="space-x-2">
          <Button variant="outline" onClick={() => setOpenConfig(true)}>
            QR Settings
          </Button>

          <Button type="submit" onClick={handleSubmit}>
            Generate QR Code
          </Button>
        </CardFooter>
      </Card>

      {/* Placeholder for generated QR code */}
      <Card className="mt-6 w-full mx-auto md:w-1/3">
        <CardHeader>
          <CardTitle>QR Code</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div id="qr-code" ref={ref} />
        </CardContent>
      </Card>
    </div>
  );
}
