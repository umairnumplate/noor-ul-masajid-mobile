
import React from 'react';
import { WhatsAppIcon } from './Icons';

interface WhatsappLinkProps {
  phone: string;
}

const WhatsappLink: React.FC<WhatsappLinkProps> = ({ phone }) => {
  if (!phone) {
    return null;
  }

  // Basic formatting for Pakistani numbers: remove non-numeric chars, and replace a leading 0 with the country code 92.
  let formattedPhone = phone.replace(/[^0-9]/g, ''); 
  if (formattedPhone.startsWith('03')) {
    formattedPhone = '92' + formattedPhone.substring(1);
  } else if (formattedPhone.startsWith('3')) {
    // Handle cases where the leading 0 is omitted
    formattedPhone = '92' + formattedPhone;
  }
  
  const whatsappUrl = `https://wa.me/${formattedPhone}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-primary hover:text-primary-dark hover:underline transition-colors"
      onClick={(e) => e.stopPropagation()} // Prevents parent elements from capturing the click
    >
      <WhatsAppIcon className="h-4 w-4" />
      <span>{phone}</span>
    </a>
  );
};

export default WhatsappLink;
