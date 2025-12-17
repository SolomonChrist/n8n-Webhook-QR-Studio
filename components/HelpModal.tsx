import React, { useEffect, useRef } from 'react';
import { X, ExternalLink, Github, FileText, Info } from 'lucide-react';
import { REPO_URL, AUTHOR_URL, AUTHOR_NAME } from '../utils/constants';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Close on click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-[24px] w-full max-w-[680px] max-h-[90vh] shadow-2xl flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#E3E8F2] bg-white sticky top-0 z-10">
          <h2 id="help-modal-title" className="text-[#0F172A] text-[20px] font-bold tracking-tight">Help & Documentation</h2>
          <button 
            onClick={onClose}
            className="p-2 text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5FB] rounded-xl transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          <div className="space-y-8">
            
            {/* Section 1: What it does */}
            <section>
              <h3 className="flex items-center gap-2.5 text-[#0F172A] text-[16px] font-bold mb-3">
                <div className="p-1 bg-blue-50 rounded-md text-[#2563EB]">
                  <Info size={16} strokeWidth={2.5} />
                </div>
                What this app does
              </h3>
              <p className="text-[#475569] text-[15px] leading-relaxed pl-1">
                This utility allows you to instantly generate scannable QR codes for your <span className="font-semibold text-[#0F172A]">n8n webhooks</span>. 
                Instead of manually triggering workflows or typing long URLs on mobile devices, you can simply scan the QR code to fire the webhook.
              </p>
            </section>

            {/* Section 2: How to use */}
            <section>
              <h3 className="text-[#0F172A] text-[16px] font-bold mb-4">How to use</h3>
              <ul className="space-y-3 text-[#475569] text-[15px] leading-relaxed list-none pl-1">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F1F5FB] text-[#64748B] text-xs font-bold flex items-center justify-center">1</span>
                  <span>Paste your full n8n webhook URL into the input field.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F1F5FB] text-[#64748B] text-xs font-bold flex items-center justify-center">2</span>
                  <span>Click <span className="font-semibold text-[#0F172A]">Generate</span> to create the QR code.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F1F5FB] text-[#64748B] text-xs font-bold flex items-center justify-center">3</span>
                  <span>Use the <strong>Test Webhook</strong> tool to ensure the URL is reachable.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F1F5FB] text-[#64748B] text-xs font-bold flex items-center justify-center">4</span>
                  <span>Download the QR code in your preferred format.</span>
                </li>
              </ul>
            </section>

            {/* Section 3: CORS & Testing - Enhanced Card */}
            <section className="bg-[#F8FAFC] border border-[#E3E8F2] rounded-2xl p-6">
              <h3 className="text-[#0F172A] text-[15px] font-bold mb-2">Testing webhooks and CORS</h3>
              <p className="text-[#475569] text-[14px] leading-relaxed mb-4">
                When using the <strong>Test Webhook</strong> button, you might see a "Network Error" or CORS warning. This is a browser security feature.
              </p>
              <ul className="space-y-2 text-[#475569] text-[14px] list-disc pl-5 marker:text-[#94A3B8]">
                <li>The webhook <strong>likely still fired</strong> successfully on your n8n server.</li>
                <li>The browser just blocked this app from reading the response text.</li>
                <li>To verify without CORS issues, use the <strong>"Open Test in New Tab"</strong> button.</li>
              </ul>
            </section>

            {/* Section 4: Security */}
            <section>
              <h3 className="text-[#0F172A] text-[16px] font-bold mb-3">Security and Privacy</h3>
              <p className="text-[#475569] text-[15px] leading-relaxed pl-1">
                This application runs entirely in your browser (client-side). 
                <span className="block mt-2 font-medium text-[#0F172A]">
                  No webhook URLs, response data, or analytics are sent to any server. 
                </span>
                Everything stays in your browser's memory and is cleared when you refresh the page.
              </p>
            </section>

            {/* Section 5: About */}
            <section className="border-t border-[#E3E8F2] pt-8 mt-2">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <a 
                  href={AUTHOR_URL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center sm:justify-start gap-2 text-[#2563EB] hover:text-[#1d4ed8] bg-blue-50/50 hover:bg-blue-50 border border-blue-100 px-4 py-2.5 rounded-xl text-[14px] font-medium transition-colors"
                >
                  <ExternalLink size={16} />
                  {AUTHOR_NAME}
                </a>
                <a 
                  href={REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center sm:justify-start gap-2 text-[#475569] hover:text-[#0F172A] bg-white border border-[#E3E8F2] hover:bg-[#F8FAFC] px-4 py-2.5 rounded-xl text-[14px] font-medium transition-colors"
                >
                  <Github size={16} />
                  Source Code
                </a>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;