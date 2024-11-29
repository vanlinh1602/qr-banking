
type BankInfo = {
    bank: string;
    accountNumber: string;
    accountHolder: string;
    amount: string;
    content: string;
}

type ServiceSetting = {
    format?: 'dynamic' | 'static';

}

export class BankingService {
    // Info
    bank: string;
    accountNumber: string;
    accountHolder: string;
    amount: number;
    content: string;

    // Setting
    format: 'dynamic' | 'static' = 'dynamic';

    constructor(info: BankInfo, setting?: ServiceSetting) {
        this.bank = info.bank;
        this.accountNumber = info.accountNumber;
        this.accountHolder = info.accountHolder;
        this.content = info.content;
        this.amount = Number(info.amount.replace(/,/g, ''));

        if (setting?.format) {
            this.format = setting.format;
        }
    }

    private payload(): string {
        return '000201';
    }

    private pointOfInitiation(): string {
        if (this.format === 'dynamic') {
            return '010212';
        }
        return '010211';
    }

    private consumerAccountInfo(): string {
        // GUID
        const guid = '0010A000000727';

        // Bank
        const bankBin = `00${this.bank.length.toString().padStart(2, '0')}${this.bank}`;
        const accountNumber = `01${this.accountNumber.length.toString().padStart(2, '0')}${this.accountNumber}`;
        const bankInfo = `${bankBin}${accountNumber}`;
        const bankData = `01${bankInfo.length.toString().padStart(2, '0')}${bankInfo}`;

        // Service code
        const service = '0208QRIBFTTA';

        const finalData = `${guid}${bankData}${service}`;
        return `38${finalData.length.toString().padStart(2, '0')}${finalData}`;
    }

    private transactionCurrency(): string {
        return '5303704';
    }

    private transactionAmount(): string {
        if (!this.amount) {
            return '';
        }
        return `54${this.amount.toString().length.toString().padStart(2, '0')}${this.amount}`;
    }

    private countryCode(): string {
        return '5802VN';
    }

    private additionalData(): string {
        if (!this.content) {
            return '';
        }
        const data = `08${this.content.length.toString().padStart(2, '0')}${this.content}`;
        return `62${data.length.toString().padStart(2, '0')}${data}`;
    }

    private calculateCRC(data: string): string {
        const polynomial = 0x1021;
        let crc = 0xFFFF;

        for (let i = 0; i < data.length; i++) {
            crc ^= (data.charCodeAt(i) << 8);
            for (let j = 0; j < 8; j++) {
                if (crc & 0x8000) {
                    crc = ((crc << 1) ^ polynomial) & 0xFFFF;
                } else {
                    crc = (crc << 1) & 0xFFFF;
                }
            }
        }

        return crc.toString(16).toUpperCase().padStart(4, '0');
    };

    generateCode(): string {
        const data = `${this.payload()}${this.pointOfInitiation()}${this.consumerAccountInfo()}${this.transactionCurrency()}${this.transactionAmount()}${this.countryCode()}${this.additionalData()}6304`;
        const crc = this.calculateCRC(data);
        return `${data}${crc}`;
    }

}