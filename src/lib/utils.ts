
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


export const removeAccents = (text: string): string =>
  text
    .replace(/A|Á|À|Ã|Ạ|Ả|Â|Ấ|Ầ|Ẫ|Ậ|Ẩ|Ă|Ắ|Ằ|Ẵ|Ặ|Ẳ/g, 'A')
    .replace(/á|à|ã|ạ|ả|â|ấ|ầ|ẫ|ậ|ẩ|ă|ắ|ằ|ẵ|ặ|ẳ/g, 'a')
    .replace(/E|É|È|Ẽ|Ẹ|Ẻ|Ê|Ế|Ề|Ễ|Ệ|Ể/, 'E')
    .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
    .replace(/I|Í|Ì|Ĩ|Ị|Ỉ/g, 'I')
    .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
    .replace(/O|Ó|Ò|Õ|Ọ|Ỏ|Ô|Ố|Ồ|Ỗ|Ộ|Ổ|Ơ|Ớ|Ờ|Ỡ|Ợ|Ở/g, 'O')
    .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
    .replace(/U|Ú|Ù|Ũ|Ụ|Ủ|Ư|Ứ|Ừ|Ữ|Ự|Ử/g, 'U')
    .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
    .replace(/Y|Ý|Ỳ|Ỹ|Ỵ|Ỷ/g, 'Y')
    .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
    .replace(/Đ/g, 'D')
    .replace(/đ/g, 'd')
    .replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '')
    .replace(/\u02C6|\u0306|\u031B/g, '');