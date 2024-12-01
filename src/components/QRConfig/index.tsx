'use client';

import { CloudUpload, HelpCircle } from 'lucide-react';
import QRCodeStyling, {
  CornerDotType,
  CornerSquareType,
  DotType,
  Options,
} from 'qr-code-styling';
import { useEffect, useRef, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { defaultQRData, dotsStyles, gradientDefault } from '@/lib/options';
import { startTutorial } from '@/lib/tutorial';

import { CropImage } from '../CropImage';
import { Button } from '../ui/button';
import { FileInput, FileUploader } from '../ui/file-input';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import Waiting from '../Waiting';

type Props = {
  onSave: (options: Options) => void;
  onCancel: () => void;
  options: Options;
};

export const QRCodeConfig = ({
  onCancel,
  onSave,
  options: defaultOptions,
}: Props) => {
  const [handling, setHandling] = useState(false);
  const [cropImage, setCropImage] = useState<File>();
  const [options, setOptions] = useState<Options>({
    ...defaultOptions,
    width: 250,
    height: 250,
  });
  const [qrCode] = useState<QRCodeStyling>(
    new QRCodeStyling({
      data: defaultQRData,
    })
  );

  const templateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (templateRef.current) {
      qrCode.append(templateRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrCode, templateRef.current]);

  useEffect(() => {
    qrCode.update(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          onCancel();
        }
      }}
    >
      {handling ? <Waiting /> : null}
      {cropImage ? (
        <CropImage
          imageFile={cropImage}
          onClose={() => setCropImage(undefined)}
          onSave={(croppedImageUrl) => {
            setOptions({ ...options, image: croppedImageUrl });
            setCropImage(undefined);
          }}
        />
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center">
            Cấu hình QR
            <HelpCircle
              className="w-5 h-5 text-primary ml-2"
              onClick={() => {
                startTutorial('config').drive();
              }}
            />
          </DialogTitle>
          <DialogDescription>
            Cấu hình các thông số cho mã QR của bạn
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Tabs defaultValue="logo" className="w-full">
            <TabsList>
              <TabsTrigger id="tab-logo" value="logo">
                Logo
              </TabsTrigger>
              <TabsTrigger id="tab-dots" value="dots">
                Dots
              </TabsTrigger>
              <TabsTrigger id="tab-corner-square" value="corner-square">
                Corners Square
              </TabsTrigger>
              <TabsTrigger id="tab-corner-dot" value="corner-dot">
                Corners Dot
              </TabsTrigger>
            </TabsList>
            <TabsContent value="logo" className="w-full">
              {options.image ? (
                <div className="flex items-center space-x-2">
                  <img
                    src={options.image}
                    alt="Logo"
                    className="h-20 object-cover"
                  />
                  <Button
                    variant="secondary"
                    onClick={() => setOptions({ ...options, image: '' })}
                  >
                    Xóa
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
                      // const image = await convertImgaesToBase64(file);
                      // setOptions({ ...options, image });
                      setCropImage(file);
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
                  className="relative bg-background rounded-lg p-2"
                >
                  <FileInput
                    id="fileInput"
                    className="outline-dashed outline-1 outline-slate-500 w-full "
                  >
                    <div className="flex items-center justify-center flex-col p-8 w-full ">
                      <CloudUpload className="text-gray-500 w-5 h-5" />
                      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>
                        &nbsp; or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF
                      </p>
                    </div>
                  </FileInput>
                </FileUploader>
              )}
            </TabsContent>
            <TabsContent value="dots">
              <div className="grid grid-cols-2 p-2 gap-4">
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
                            options.dotsOptions?.gradient.colorStops[0].color
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
                                        pre.dotsOptions!.gradient!.colorStops[1]
                                          .color,
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
                            options.dotsOptions?.gradient.colorStops[1].color
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
                                        pre.dotsOptions!.gradient!.colorStops[0]
                                          .color,
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
            </TabsContent>
            <TabsContent value="corner-square">
              <div className="grid grid-cols-2 p-2 gap-4">
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
                            v === 'none' ? undefined : (v as CornerSquareType),
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
                        <SelectItem key="extra-rounded" value="extra-rounded">
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
                            options.cornersSquareOptions?.gradient.colorStops[0]
                              .color
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
                            options.cornersSquareOptions?.gradient.colorStops[1]
                              .color
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
            </TabsContent>
            <TabsContent value="corner-dot">
              <div className="grid grid-cols-2 p-2 gap-4">
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
                          type: v === 'none' ? undefined : (v as CornerDotType),
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
                            options.cornersDotOptions?.gradient.colorStops[0]
                              .color
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
                            options.cornersDotOptions?.gradient.colorStops[1]
                              .color
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
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex flex-col items-center ">
          <div id="qr-template" ref={templateRef} />
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-[-20px] mb-2">
            Đây là bản xem trước
          </span>
          <Button
            id="save-config"
            onClick={() => {
              const data = { ...options };
              delete data.width;
              delete data.height;
              onSave(data);
            }}
          >
            Lưu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeConfig;
