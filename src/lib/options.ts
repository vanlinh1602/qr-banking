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
        { offset: 0, color: '#F0A8A8' },
        { offset: 1, color: '#EB477E' },
    ],
};

export const defaultQRData = '00020101021238540010A00000072701240006970422011003375418780208QRIBFTTA53037045405200005802VN62190815Buy me a coffee6304EC1E';

export const defaultQRCodeOptions: Options = {
    width: 300,
    height: 300,
    type: 'svg' as DrawType,
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