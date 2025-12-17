import React from 'react';
import { Share2, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onOpenHelp: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenHelp }) => {
  return (
    <header className="w-full flex items-center justify-between mb-10">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-[#2563EB]/10 rounded-xl text-[#2563EB]">
          <Share2 size={22} strokeWidth={2.5} />
        </div>
        <h1 className="text-[#0F172A] font-bold text-[19px] tracking-tight">
          n8n Webhook QR Studio
        </h1>
      </div>
      <button 
        onClick={onOpenHelp}
        className="group flex items-center gap-2 text-[#475569] hover:text-[#2563EB] px-3 py-2 rounded-lg font-medium text-[14px] transition-all focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
      >
        <HelpCircle size={18} className="text-[#94A3B8] group-hover:text-[#2563EB] transition-colors" />
        <span className="group-hover:underline decoration-1 underline-offset-4">Help</span>
      </button>
    </header>
  );
};

export default Header;