import 'driver.js/dist/driver.css';

import { driver } from 'driver.js';

export const QRTutorial = driver({
    showProgress: true,
    steps: [
        { element: '#banking-select', popover: { title: 'Ngân Hàng', description: 'Chọn ngân hàng mà bạn muốn tạo mã chuyển khoản', side: 'left', align: 'start' } },
        { element: '#banking-account', popover: { title: 'Số tài khoản', description: 'Nhập số tài khoản mà bạn muốn tạo mã chuyển khoảng. Vui lòng kiểm tra kĩ thông tin này vì phần mềm không thể tự động kiểm tra tên chủ tài khoảng. Nếu sai khi chuyển khoảng sẽ bị lỗi hoặc qua người khác.', side: 'right', align: 'start' } },
        { element: '#account-holder', popover: { title: 'Chủ tài khoản', description: 'Tên chủ tài khoản. Nội dung này sẽ không có trong mã QR vì hệ thống ngân hàng sẽ tự động check.', side: 'left', align: 'start' } },
        { element: '#amount-number', popover: { title: 'Số tiền', description: 'Nhập số tiền cố định trong mã. Nếu bỏ trống số tiền sẽ do người quét tự nhập.', side: 'right', align: 'start' } },
        { element: '#bank-content', popover: { title: 'Nội dung', description: 'Thêm nội dung chuyển khoản cố định. Nếu không có người dùng sẽ tự nhập nội dung', side: 'left', align: 'start' } },
        { element: '#settings-icon', popover: { title: 'Cấu hình', description: 'Bấm vào đây để cấu hình QR dàng riêng cho mình', side: 'top', align: 'start' } },
        { element: '#submit-button', popover: { title: 'Tạo QR', description: 'Cuối cùng bấm vào đây để tạo QR', side: 'top', align: 'start' } },
        { element: '#qr-generated', popover: { title: 'Mã QR', description: 'Mã QR được tạo ra sẽ hiển thị tại đây. Bạn có thể nhấn button bên dưới để tải về', side: 'left', align: 'start' } },
    ]
});

export const configTutorial = driver({
    showProgress: true,
    steps: [
        { element: '#tab-logo', popover: { title: 'Logo', description: 'Bạn có thể thêm logo của mình vào QR', side: 'bottom', align: 'start' } },
        { element: '#tab-dots', popover: { title: 'Dots', description: 'Thay đổi và thêm màu vào chấm (Dots) của QR', side: 'bottom', align: 'start' } },
        { element: '#tab-corner-square', popover: { title: 'Corners Square', description: 'Thay đổi và thêm màu cho vòng tròn ở góc (Corners Square) của QR', side: 'bottom', align: 'start' } },
        { element: '#tab-corner-dot', popover: { title: 'Corners Dot', description: 'Thay đổi và thêm màu cho dấu chấm ở góc (Corners Dot) của QR', side: 'bottom', align: 'start' } },
        { element: '#qr-template', popover: { title: 'Preview', description: 'Bản xem trước sẽ hiển thị tại đây nếu bạn thay đổi thông tin', side: 'bottom', align: 'start' } },
        { element: '#save-config', popover: { title: 'Lưu', description: 'Cuối cùng nhấn vào đây để lưu lại cấu hình của bạn', side: 'bottom', align: 'start' } },

    ]
});
