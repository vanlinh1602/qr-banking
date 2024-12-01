
import imageCompression from 'browser-image-compression';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const convertImgaesToBase64 = async (file: File): Promise<string> => {
  const compressFile = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 100,
    useWebWorker: true,
    initialQuality: 1,
  });

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(compressFile);
  });
};

export const round = (value: number, dec: number = 2) => Number(Number(value || 0).toFixed(dec));


export const formatNumber = (value: string | number = '', dec?: number) =>
  `${dec === undefined ? value : round(Number(value), dec)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
