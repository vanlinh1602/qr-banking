import { Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Contact Info */}
          <div className="mb-4 md:mb-0 text-center md:text-left flex space-x-2">
            <p className="text-sm">Contact:</p>
            <Facebook
              className="cursor-pointer w-5 h-5"
              onClick={() =>
                window.open('https://www.facebook.com/MonsieurKuma/', '_blank')
              }
            />
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/ios/50/discord-logo--v1.png"
              alt="discord-logo--v1"
              className="cursor-pointer w-5 h-5"
              onClick={() =>
                window.open(
                  'https://discord.com/users/776054010414497823',
                  '_blank'
                )
              }
            />

            <img
              width="24"
              height="24"
              src="https://img.icons8.com/material-outlined/24/mail.png"
              alt="mail"
              className="cursor-pointer"
              onClick={() =>
                window.open('mailto:linhnv1622@gmail.com', '_blank')
              }
            />
          </div>

          {/* Copyright */}
          <div className="text-sm text-center md:text-right">
            © {new Date().getFullYear()} Nguyen Van Linh. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
