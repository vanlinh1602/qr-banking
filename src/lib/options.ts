import {
    CornerDotType,
    CornerSquareType,
    DotType,
    DrawType,
    ErrorCorrectionLevel,
    Gradient,
    Mode,
    Options,
    TypeNumber
} from 'qr-code-styling';

export const dotsStyles = {
    dots: 'Dots',
    rounded: 'Rounded',
    classy: 'Classy',
    'classy-rounded': 'Classy Rounded',
    square: 'Square',
    'extra-rounded': 'Extra Rounded'
};

export const gradientDefault: Gradient = {
    type: 'linear',
    colorStops: [
        { offset: 0, color: '#5248a3' },
        { offset: 1, color: '#6f2051' },
    ],
};

export const defaultQRCodeOptions: Options = {
    width: 300,
    height: 300,
    type: 'svg' as DrawType,
    data: 'http://qr-code-styling.com',
    margin: 10,
    qrOptions: {
        typeNumber: 0 as TypeNumber,
        mode: 'Byte' as Mode,
        errorCorrectionLevel: 'Q' as ErrorCorrectionLevel
    },
    imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 5,
        crossOrigin: 'anonymous',
    },
    dotsOptions: {
        color: '#222222',
        type: 'rounded' as DotType
    },
    backgroundOptions: {
    },
    cornersSquareOptions: {
        color: '#222222',
        type: 'extra-rounded' as CornerSquareType,
    },
    cornersDotOptions: {
        color: '#222222',
        type: 'dot' as CornerDotType,
    }
};