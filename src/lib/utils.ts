
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