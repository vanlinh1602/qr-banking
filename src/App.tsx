import { CloudUpload } from 'lucide-react';
import QRCodeStyling, {
  CornerDotType,
  CornerSquareType,
  DotType,
  Options,
} from 'qr-code-styling';
import { useEffect, useRef, useState } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FileInput, FileUploader } from '@/components/ui/file-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import banks from '@/lib/banks.json';

import SearchableSelect from './components/SearchableSelect';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select';
import Waiting from './components/Waiting';
import {
  defaultQRCodeOptions,
  dotsStyles,
  gradientDefault,
} from './lib/options';
import { convertImgaesToBase64 } from './lib/utils';

type BankingInfo = {
  bank: string;
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
  const [qrCode] = useState<QRCodeStyling>(
    new QRCodeStyling({
      width: 300,
      height: 300,
      data: 'https://www.facebook.com/',
    })
  );
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
  };

  return (
    <div className="w-svw p-4 flex flex-col md:flex-row md:space-x-4 md:items-center">
      {handling ? <Waiting /> : null}
      <Card className="w-full mx-auto md:w-2/3">
        <CardHeader>
          <CardTitle>Tạo Banking QR</CardTitle>
          <CardDescription>
            Generate a QR code for bank transfers
          </CardDescription>
          <CardContent className="p-0">
            <Accordion type="single" collapsible defaultValue="info">
              <AccordionItem value="info">
                <AccordionTrigger className="p-2">
                  Thông tin tài khoản
                </AccordionTrigger>
                <AccordionContent>
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
                        onSelect={(v) =>
                          setBankDetails({ ...bankDetails, bank: v })
                        }
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
                          const formattedValue = new Intl.NumberFormat().format(
                            Number(value)
                          );
                          setBankDetails({
                            ...bankDetails,
                            amount: formattedValue,
                          });
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
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="setting">
                <AccordionTrigger className="p-2">Cấu hình QR</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <CardTitle className="text-xl">Logo</CardTitle>
                    {options.image ? (
                      <div className="flex items-center space-x-2">
                        <img
                          src={options.image}
                          alt="Logo"
                          className="h-20 object-cover"
                        />
                        <Button
                          variant="destructive"
                          onClick={() => setOptions({ ...options, image: '' })}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <FileUploader
                        value={[]}
                        onValueChange={async (value) => {
                          try {
                            setHandling(true);
                            if (!value) return;
                            const file = value[0];
                            const image = await convertImgaesToBase64(file);
                            setOptions({ ...options, image });
                          } finally {
                            setHandling(false);
                          }
                        }}
                        dropzoneOptions={{
                          accept: {
                            'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
                          },
                          maxFiles: 1,
                        }}
                        className="relative bg-background rounded-lg p-2 "
                      >
                        <FileInput
                          id="fileInput"
                          className="outline-dashed outline-1 outline-slate-500 w-52"
                        >
                          <div className="flex items-center justify-center p-8 w-52 h-20 text-center space-x-2">
                            <CloudUpload className="text-gray-500 w-10 h-10" />
                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Click to upload
                              </span>
                            </p>
                          </div>
                        </FileInput>
                      </FileUploader>
                    )}
                  </div>

                  <div className="w-full border-b-2 my-2" />
                  <CardTitle className="text-xl">Dots Options</CardTitle>
                  <div className="grid md:grid-cols-4 p-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dotStyle">Dots Style</Label>
                      <Select
                        value={options.dotsOptions?.type}
                        onValueChange={(v) => {
                          setOptions((pre) => ({
                            ...pre,
                            dotsOptions: {
                              ...pre.dotsOptions,
                              type: v as DotType,
                            },
                          }));
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a styles" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {Object.entries(dotsStyles).map(([key, value]) => (
                              <SelectItem key={key} value={key}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dotStyle">Color Type</Label>
                      <Select
                        value={
                          options.dotsOptions?.gradient ? 'gradient' : 'single'
                        }
                        onValueChange={(v) => {
                          if (v === 'single') {
                            setOptions((pre) => ({
                              ...pre,
                              dotsOptions: {
                                ...pre.dotsOptions,
                                gradient: undefined,
                              },
                            }));
                          } else {
                            setOptions((pre) => ({
                              ...pre,
                              dotsOptions: {
                                ...pre.dotsOptions,
                                gradient: gradientDefault,
                              },
                            }));
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a styles" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem key="single" value="single">
                              Single color
                            </SelectItem>
                            <SelectItem key="gradient" value="gradient">
                              Color Gradient
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    {options.dotsOptions?.gradient ? (
                      <div className="space-y-2">
                        <Label htmlFor="dotStyle">Gradient Type</Label>
                        <Select
                          value={options.dotsOptions?.gradient?.type}
                          onValueChange={(v) => {
                            setOptions((pre) => ({
                              ...pre,
                              dotsOptions: {
                                ...pre.dotsOptions,
                                gradient: {
                                  ...pre.dotsOptions!.gradient!,
                                  type: v as 'linear' | 'radial',
                                },
                              },
                            }));
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a styles" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem key="linear" value="linear">
                                Linear
                              </SelectItem>
                              <SelectItem key="radial" value="radial">
                                Radial
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : null}
                    <div className="space-y-2">
                      <Label htmlFor="content">Colors</Label>
                      <div className="flex space-x-2">
                        {options.dotsOptions?.gradient ? (
                          <>
                            <Input
                              id="dotColor1"
                              name="dotColor1"
                              type="color"
                              value={
                                options.dotsOptions?.gradient.colorStops[0]
                                  .color
                              }
                              onChange={(e) => {
                                setOptions((pre) => ({
                                  ...pre,
                                  dotsOptions: {
                                    ...pre.dotsOptions,
                                    gradient: {
                                      ...pre.dotsOptions!.gradient!,
                                      colorStops: [
                                        { offset: 0, color: e.target.value },
                                        {
                                          offset: 1,
                                          color:
                                            pre.dotsOptions!.gradient!
                                              .colorStops[1].color,
                                        },
                                      ],
                                    },
                                  },
                                }));
                              }}
                            />
                            <Input
                              id="dotColor2"
                              name="dotColor2"
                              type="color"
                              value={
                                options.dotsOptions?.gradient.colorStops[1]
                                  .color
                              }
                              onChange={(e) => {
                                setOptions((pre) => ({
                                  ...pre,
                                  dotsOptions: {
                                    ...pre.dotsOptions,
                                    gradient: {
                                      ...pre.dotsOptions!.gradient!,
                                      colorStops: [
                                        {
                                          offset: 0,
                                          color:
                                            pre.dotsOptions!.gradient!
                                              .colorStops[0].color,
                                        },
                                        { offset: 1, color: e.target.value },
                                      ],
                                    },
                                  },
                                }));
                              }}
                            />
                          </>
                        ) : (
                          <Input
                            id="dotColor"
                            name="dotColor"
                            type="color"
                            value={options.dotsOptions?.color}
                            onChange={(e) => {
                              setOptions((pre) => ({
                                ...pre,
                                dotsOptions: {
                                  ...pre.dotsOptions,
                                  color: e.target.value,
                                },
                              }));
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="w-full border-b-2 my-2" />
                  <CardTitle className="text-xl">
                    Corners Square Options
                  </CardTitle>
                  <div className="grid md:grid-cols-4 p-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cornersSquareStyle">
                        Corners Square Style
                      </Label>
                      <Select
                        value={options.cornersSquareOptions?.type}
                        onValueChange={(v) => {
                          setOptions((pre) => ({
                            ...pre,
                            cornersSquareOptions: {
                              ...pre.cornersSquareOptions,
                              type:
                                v === 'none'
                                  ? undefined
                                  : (v as CornerSquareType),
                            },
                          }));
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a styles" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem key="none" value="none">
                              None
                            </SelectItem>
                            <SelectItem key="dot" value="dot">
                              Dot
                            </SelectItem>
                            <SelectItem key="square" value="square">
                              Square
                            </SelectItem>
                            <SelectItem
                              key="extra-rounded"
                              value="extra-rounded"
                            >
                              Extra Rounded
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cornersSquareColorType">Color Type</Label>
                      <Select
                        value={
                          options.cornersSquareOptions?.gradient
                            ? 'gradient'
                            : 'single'
                        }
                        onValueChange={(v) => {
                          if (v === 'single') {
                            setOptions((pre) => ({
                              ...pre,
                              cornersSquareOptions: {
                                ...pre.cornersSquareOptions,
                                gradient: undefined,
                              },
                            }));
                          } else {
                            setOptions((pre) => ({
                              ...pre,
                              cornersSquareOptions: {
                                ...pre.cornersSquareOptions,
                                gradient: gradientDefault,
                              },
                            }));
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a styles" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem key="single" value="single">
                              Single color
                            </SelectItem>
                            <SelectItem key="gradient" value="gradient">
                              Color Gradient
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    {options.cornersSquareOptions?.gradient ? (
                      <div className="space-y-2">
                        <Label htmlFor="dotStyle">Gradient Type</Label>
                        <Select
                          value={options.cornersSquareOptions?.gradient?.type}
                          onValueChange={(v) => {
                            setOptions((pre) => ({
                              ...pre,
                              cornersSquareOptions: {
                                ...pre.cornersSquareOptions,
                                gradient: {
                                  ...pre.cornersSquareOptions!.gradient!,
                                  type: v as 'linear' | 'radial',
                                },
                              },
                            }));
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a styles" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem key="linear" value="linear">
                                Linear
                              </SelectItem>
                              <SelectItem key="radial" value="radial">
                                Radial
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : null}
                    <div className="space-y-2">
                      <Label htmlFor="content">Colors</Label>
                      <div className="flex space-x-2">
                        {options.cornersSquareOptions?.gradient ? (
                          <>
                            <Input
                              id="cornersSquareColor1"
                              name="cornersSquareColor1"
                              type="color"
                              value={
                                options.cornersSquareOptions?.gradient
                                  .colorStops[0].color
                              }
                              onChange={(e) => {
                                setOptions((pre) => ({
                                  ...pre,
                                  cornersSquareOptions: {
                                    ...pre.cornersSquareOptions,
                                    gradient: {
                                      ...pre.cornersSquareOptions!.gradient!,
                                      colorStops: [
                                        { offset: 0, color: e.target.value },
                                        {
                                          offset: 1,
                                          color:
                                            pre.cornersSquareOptions!.gradient!
                                              .colorStops[1].color,
                                        },
                                      ],
                                    },
                                  },
                                }));
                              }}
                            />
                            <Input
                              id="cornersSquareColor2"
                              name="cornersSquareColor2"
                              type="color"
                              value={
                                options.cornersSquareOptions?.gradient
                                  .colorStops[1].color
                              }
                              onChange={(e) => {
                                setOptions((pre) => ({
                                  ...pre,
                                  cornersSquareOptions: {
                                    ...pre.cornersSquareOptions,
                                    gradient: {
                                      ...pre.cornersSquareOptions!.gradient!,
                                      colorStops: [
                                        {
                                          offset: 0,
                                          color:
                                            pre.cornersSquareOptions!.gradient!
                                              .colorStops[0].color,
                                        },
                                        { offset: 1, color: e.target.value },
                                      ],
                                    },
                                  },
                                }));
                              }}
                            />
                          </>
                        ) : (
                          <Input
                            id="cornersSquareColor"
                            name="cornersSquareColor"
                            type="color"
                            value={options.cornersSquareOptions?.color}
                            onChange={(e) => {
                              setOptions((pre) => ({
                                ...pre,
                                cornersSquareOptions: {
                                  ...pre.cornersSquareOptions,
                                  color: e.target.value,
                                },
                              }));
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="w-full border-b-2 my-2" />
                  <CardTitle className="text-xl">Corners Dot Options</CardTitle>
                  <div className="grid md:grid-cols-4 p-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cornersSquareStyle">
                        Corners Square Style
                      </Label>
                      <Select
                        value={options.cornersDotOptions?.type}
                        onValueChange={(v) => {
                          setOptions((pre) => ({
                            ...pre,
                            cornersDotOptions: {
                              ...pre.cornersDotOptions,
                              type:
                                v === 'none' ? undefined : (v as CornerDotType),
                            },
                          }));
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a styles" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem key="none" value="none">
                              None
                            </SelectItem>
                            <SelectItem key="dot" value="dot">
                              Dot
                            </SelectItem>
                            <SelectItem key="square" value="square">
                              Square
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cornersDotColorType">Color Type</Label>
                      <Select
                        value={
                          options.cornersDotOptions?.gradient
                            ? 'gradient'
                            : 'single'
                        }
                        onValueChange={(v) => {
                          if (v === 'single') {
                            setOptions((pre) => ({
                              ...pre,
                              cornersDotOptions: {
                                ...pre.cornersDotOptions,
                                gradient: undefined,
                              },
                            }));
                          } else {
                            setOptions((pre) => ({
                              ...pre,
                              cornersDotOptions: {
                                ...pre.cornersDotOptions,
                                gradient: gradientDefault,
                              },
                            }));
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a color type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem key="single" value="single">
                              Single color
                            </SelectItem>
                            <SelectItem key="gradient" value="gradient">
                              Color Gradient
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    {options.cornersDotOptions?.gradient ? (
                      <div className="space-y-2">
                        <Label htmlFor="dotStyle">Gradient Type</Label>
                        <Select
                          value={options.cornersDotOptions?.gradient?.type}
                          onValueChange={(v) => {
                            setOptions((pre) => ({
                              ...pre,
                              cornersDotOptions: {
                                ...pre.cornersDotOptions,
                                gradient: {
                                  ...pre.cornersDotOptions!.gradient!,
                                  type: v as 'linear' | 'radial',
                                },
                              },
                            }));
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a styles" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem key="linear" value="linear">
                                Linear
                              </SelectItem>
                              <SelectItem key="radial" value="radial">
                                Radial
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : null}
                    <div className="space-y-2">
                      <Label htmlFor="content">Colors</Label>
                      <div className="flex space-x-2">
                        {options.cornersDotOptions?.gradient ? (
                          <>
                            <Input
                              id="cornersDotColor1"
                              name="cornersDotColor1"
                              type="color"
                              value={
                                options.cornersDotOptions?.gradient
                                  .colorStops[0].color
                              }
                              onChange={(e) => {
                                setOptions((pre) => ({
                                  ...pre,
                                  cornersDotOptions: {
                                    ...pre.cornersDotOptions,
                                    gradient: {
                                      ...pre.cornersDotOptions!.gradient!,
                                      colorStops: [
                                        { offset: 0, color: e.target.value },
                                        {
                                          offset: 1,
                                          color:
                                            pre.cornersDotOptions!.gradient!
                                              .colorStops[1].color,
                                        },
                                      ],
                                    },
                                  },
                                }));
                              }}
                            />
                            <Input
                              id="cornersDotColor2"
                              name="cornersDotColor2"
                              type="color"
                              value={
                                options.cornersDotOptions?.gradient
                                  .colorStops[1].color
                              }
                              onChange={(e) => {
                                setOptions((pre) => ({
                                  ...pre,
                                  cornersDotOptions: {
                                    ...pre.cornersDotOptions,
                                    gradient: {
                                      ...pre.cornersDotOptions!.gradient!,
                                      colorStops: [
                                        {
                                          offset: 0,
                                          color:
                                            pre.cornersDotOptions!.gradient!
                                              .colorStops[0].color,
                                        },
                                        { offset: 1, color: e.target.value },
                                      ],
                                    },
                                  },
                                }));
                              }}
                            />
                          </>
                        ) : (
                          <Input
                            id="cornersDotColor"
                            name="cornersDotColor"
                            type="color"
                            value={options.cornersDotOptions?.color}
                            onChange={(e) => {
                              setOptions((pre) => ({
                                ...pre,
                                cornersDotOptions: {
                                  ...pre.cornersDotOptions,
                                  color: e.target.value,
                                },
                              }));
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </CardHeader>
        <CardContent className="space-y-6"></CardContent>
        <CardFooter>
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
