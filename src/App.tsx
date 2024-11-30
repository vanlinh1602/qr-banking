import * as htmlToImage from 'html-to-image';
import { Banknote, CircleHelp, Download, Settings } from 'lucide-react';
import QRCodeStyling, { Options } from 'qr-code-styling';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import ButtonHover3 from '@/components/ui/button';
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
import Waiting from './components/Waiting';
import { defaultQRCodeOptions, defaultQRData } from './lib/options';
import { QRTutorial } from './lib/tutorial';
import { BankingService } from './services/banking';
import { BankAPI } from './type';

type BankingInfo = {
  bank: string;
  accountNumber: string;
  accountHolder: string;
  amount: string;
  content: string;
};

type QRCreated = {
  bank: BankAPI;
  accountNumber: string;
  accountHolder: string;
  amount: string;
  content: string;
};

export default function BankingQRGenerator() {
  const [handling, setHandling] = useState(false);
  const [bankDetails, setBankDetails] = useState<BankingInfo>({
    bank: '',
    accountNumber: '',
    accountHolder: '',
    amount: '',
    content: '',
  });
  const [options, setOptions] = useState<Options>(defaultQRCodeOptions);
  const [qrCreated, setQRCreated] = useState<QRCreated>();

  const [qrCode] = useState<QRCodeStyling>(
    new QRCodeStyling({
      width: 300,
      height: 300,
      data: defaultQRData,
    })
  );
  const [openConfig, setOpenConfig] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const qrGenerated = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const opt = localStorage.getItem('qr-options');
    if (opt) {
      setOptions(JSON.parse(opt));
    }
  }, []);

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
    try {
      if (!bankDetails.bank) {
        toast.error('Vui lòng chọn ngân hàng');
        return;
      }

      if (!bankDetails.accountNumber) {
        toast.error('Vui lòng nhập số tài khoản');
        return;
      }

      const service = new BankingService({ ...bankDetails });
      const qrData = service.generateCode();

      qrCode.update({
        data: qrData,
      });
      setQRCreated({
        ...bankDetails,
        bank: banks.find((b) => b.bin === bankDetails.bank) as BankAPI,
      });
    } finally {
      localStorage.setItem('qr-options', JSON.stringify(options));
    }
  };

  return (
    <div className="w-svw p-4 flex flex-col md:flex-row md:space-x-4 md:items-center">
      {handling ? <Waiting /> : null}
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
          <div className="flex justify-between">
            <div>
              <CardTitle>Tạo Banking QR</CardTitle>
              <CardDescription>
                Tạo mã QR Banking dễ dàng với các thông tin cần thiết
              </CardDescription>
            </div>
            <CircleHelp
              className="text-primary"
              onClick={() => {
                QRTutorial.drive();
              }}
            />
          </div>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
              <div id="banking-select" className="space-y-2 md:col-span-2">
                <Label htmlFor="bank">
                  Ngân Hàng
                  <span className="text-red-500">*</span>
                </Label>
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
              <div id="banking-account" className="space-y-2">
                <Label htmlFor="accountNumber">
                  Số tài khoản
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="accountNumber"
                  name="accountNumber"
                  placeholder="0337541878"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div id="account-holder" className="space-y-2">
                <Label htmlFor="accountHolder">Chủ tài khoản</Label>
                <Input
                  id="accountHolder"
                  name="accountHolder"
                  placeholder="NGUYEN VAN LINH"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div id="amount-number" className="space-y-2">
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
              <div id="bank-content" className="space-y-2">
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
        <CardFooter className="flex items-center justify-between">
          <Settings
            id="settings-icon"
            className="text-primary cursor-pointer"
            onClick={() => setOpenConfig(true)}
          />

          <ButtonHover3 id="submit-button" onClick={handleSubmit}>
            Tạo QR
          </ButtonHover3>
        </CardFooter>
      </Card>

      {/* Placeholder for generated QR code */}
      <Card className="mt-6 w-full mx-auto md:w-1/3">
        <CardHeader>
          <CardTitle>QR Chuyển Khoảng</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center">
          <div
            id="qr-generated"
            ref={qrGenerated}
            className="bg-white p-5 text-xs rounded-lg"
          >
            <div id="qr-code" ref={ref} />
            {qrCreated ? (
              <div className="mt-2">
                <div className="flex items-center justify-center">
                  <img
                    src={qrCreated.bank.logo}
                    alt={qrCreated.bank.shortName}
                    className="h-5"
                  />
                  <b>{qrCreated.accountNumber}</b>
                  {qrCreated.accountHolder ? (
                    <span className="ml-2">({qrCreated.accountHolder})</span>
                  ) : null}
                </div>
                <div className="flex items-center justify-center">
                  {qrCreated.amount ? (
                    <>
                      <Banknote className="mr-2" />
                      <b>{qrCreated.amount}</b>
                    </>
                  ) : null}
                  {qrCreated.content ? (
                    <>
                      <span className="ml-2">-</span>
                      <span className="ml-2">{qrCreated.content}</span>
                    </>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
          <div>
            <ButtonHover3
              className="mt-4"
              onClick={async (e) => {
                setHandling(true);
                e.stopPropagation();
                try {
                  const dataUrl = await htmlToImage.toPng(qrGenerated.current!);
                  const link = document.createElement('a');
                  link.download = 'qr-generated.png';
                  link.href = dataUrl;
                  link.click();
                } catch (error: any) {
                  toast.error(`Lỗi: ${error.message}`);
                } finally {
                  setHandling(false);
                }
              }}
            >
              <Download className="mr-2 h-5 w-5" />
              Tải về
            </ButtonHover3>
            {/* <ButtonHover3
              className="mt-4"
              onClick={() => {
                const qrDownload = new QRCodeStyling({
                  ...options,
                  data: qrCode._options.data,
                });
                qrDownload.download({
                  name: `QRBanking-${bankDetails.bank}`,
                  extension: 'png',
                });
              }}
            >
              <Download className="mr-2 h-5 w-5" />
              QR
            </ButtonHover3> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
