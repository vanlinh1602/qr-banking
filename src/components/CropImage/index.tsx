import 'react-image-crop/dist/ReactCrop.css';

import { useEffect, useRef, useState } from 'react';
import ReactCrop, {
  centerCrop,
  type Crop,
  makeAspectCrop,
} from 'react-image-crop';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ImageCropModalProps {
  imageFile: File;
  onClose: () => void;
  onSave: (croppedImageUrl: string) => void;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export function CropImage({ imageFile, onClose, onSave }: ImageCropModalProps) {
  const [crop, setCrop] = useState<Crop>();
  const [src, setSrc] = useState<string>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        if (typeof reader.result === 'string') {
          setSrc(reader.result);
        }
      });
      reader.readAsDataURL(imageFile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {src && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
              // minWidth={400}
              minHeight={100}
              // circularCrop
            >
              <img
                ref={imageRef}
                alt="Crop me"
                src={src}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!completedCrop || !src) {
                return;
              }
              const canvas = document.createElement('canvas');
              const image = imageRef.current;
              if (!image) {
                return;
              }
              const scaleX = image.naturalWidth / image.width;
              const scaleY = image.naturalHeight / image.height;
              canvas.width = completedCrop.width!;
              canvas.height = completedCrop.height!;
              const ctx = canvas.getContext('2d');
              if (!ctx) {
                return;
              }

              ctx.drawImage(
                image,
                completedCrop.x! * scaleX,
                completedCrop.y! * scaleY,
                completedCrop.width! * scaleX,
                completedCrop.height! * scaleY,
                0,
                0,
                completedCrop.width!,
                completedCrop.height!
              );

              const base64Image = canvas.toDataURL('image/png');

              onSave(base64Image);
            }}
            disabled={!src || !crop}
          >
            Apply Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
