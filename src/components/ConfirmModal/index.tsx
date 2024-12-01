'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Checkbox } from '../ui/checkbox';

interface ConfirmModalProps {
  id: string;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  id,
  title,
  description,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  const isRemind = localStorage.getItem(id) === '1';
  if (isRemind) {
    onConfirm();
  }

  return (
    <>
      <Dialog
        open
        onOpenChange={(open) => {
          if (!open) {
            onCancel();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex flex-row justify-between w-full">
              <div className="flex items-center space-x-2 justify-start">
                <Checkbox
                  id="remind"
                  defaultChecked={isRemind}
                  onCheckedChange={(checked) => {
                    localStorage.setItem(id, checked ? '1' : '0');
                  }}
                />
                <label
                  htmlFor="remind"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Không hiển thị lại
                </label>
              </div>
            </div>

            <Button onClick={handleConfirm}>Xác nhận</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
