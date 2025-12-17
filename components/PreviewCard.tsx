import React, { useState } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import { 
  QrCode, Sparkles, FileImage, FileCode, FileText, 
  Link, Share2, Save, X, Download
} from 'lucide-react';
import { downloadPng, downloadSvg, downloadPdf, getQrBlob, getFilename } from '../utils/download';
import { getHostname } from '../utils/validation';
import { ValidationState, GeneratedData, ToastType } from '../App';
import QRCodeFrame from './QRCodeFrame';

interface PreviewCardProps {
  validationState: ValidationState;
  generatedData: GeneratedData | null;
  showToast: (message: string, type?: ToastType) => void;
}

const PreviewCard: React.FC<PreviewCardProps> = ({ validationState, generatedData, showToast }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const hostname = generatedData ? getHostname(generatedData.url) : '';
  const dateString = generatedData ? new Date(generatedData.timestamp).toLocaleDateString() : '';

  const handleCopyLink = async () => {
    if (!generatedData) return;
    try {
      await navigator.clipboard.writeText(generatedData.url);
      showToast('Link copied');
    } catch (err) {
      showToast('Copy failed, try manually', 'error');
    }
  };

  const handleShare = async () => {
    if (!generatedData) return;
    
    try {
      if (navigator.share) {
        const blob = await getQrBlob();
        if (!blob) throw new Error('Blob generation failed');
        
        const filename = getFilename(generatedData.url, 'png');
        const file = new File([blob], filename, { type: 'image/png' });

        const shareData: ShareData = {
          title: 'Webhook QR',
          text: 'Scan to trigger automation',
          url: generatedData.url
        };

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ ...shareData, files: [file] });
        } else {
          await navigator.share(shareData);
        }
        showToast('Share opened');
      } else {
        setIsShareModalOpen(true);
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setIsShareModalOpen(true);
      }
    }
  };

  const handleSaveImage = async () => {
    if (!generatedData) return;
    await downloadPng(generatedData.url);
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIOS) {
      showToast('Tip: Open image, then use Save Image', 'info');
    } else {
      showToast('Saved to device');
    }
  };

  return (
    <div className="bg-white rounded-[18px] border border-[#E3E8F2] shadow-premium card-highlight p-8 flex flex-col h-full relative overflow-hidden transition-all duration-300">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-[#0F172A] text-[16px] font-bold mb-1">Preview</h2>
          <p className="text-[#64748B] text-[13px]">
            {generatedData ? 'Ready for download.' : 'Your QR code will appear here.'}
          </p>
        </div>
        {generatedData && (
          <div className="px-2.5 py-1 bg-green-50 rounded-lg text-green-600 text-[10px] font-bold border border-green-100 flex items-center gap-1 animate-in fade-in zoom-in-50">
            <CheckCircle2Icon size={12} strokeWidth={3} /> SCANNABLE
          </div>
        )}
      </div>

      <div className="flex-grow flex flex-col items-center justify-center bg-[#F8FAFC] bg-pattern-dots rounded-2xl border border-[#E3E8F2] p-8 mb-6 overflow-hidden relative shadow-inner min-h-[420px]">
        {generatedData ? (
          <div className="flex flex-col items-center animate-in zoom-in-95 duration-300 w-full">
            <QRCodeFrame 
              preset={generatedData.framePreset} 
              color={generatedData.frameColor} 
              cornerStyle={generatedData.cornerStyle}
              caption={generatedData.captionText}
            >
              <QRCodeCanvas
                id="qr-code-canvas"
                value={generatedData.url}
                size={1024}
                style={{ width: '220px', height: '220px' }}
                level={"H"}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                marginSize={1}
              />
              <div className="hidden">
                 <QRCodeSVG
                  id="qr-code-svg"
                  value={generatedData.url}
                  size={1024}
                  level={"H"}
                  bgColor={"#ffffff"}
                  fgColor={"#000000"}
                  marginSize={1}
                />
              </div>
            </QRCodeFrame>
            
            <div className="text-center mt-6">
              <p className="text-[#64748B] font-semibold text-sm mb-0.5 tracking-tight">{hostname}</p>
              <p className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-widest">Generated {dateString}</p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            {validationState === 'valid' ? (
              <div className="animate-in fade-in duration-300">
                <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg shadow-teal-500/10 border border-teal-50">
                  <Sparkles className="text-[#14B8A6]" size={28} />
                </div>
                <h3 className="text-[#0F172A] font-semibold text-sm mb-1">Ready to generate</h3>
                <p className="text-[#94A3B8] text-xs">URL looks good.</p>
              </div>
            ) : (
              <div className="text-[#94A3B8]">
                <div className="w-20 h-20 mx-auto mb-4 border-2 border-dashed border-[#E2E8F0] rounded-[20px] flex items-center justify-center bg-white/50">
                  <QrCode size={32} className="opacity-20 text-[#64748B]" />
                </div>
                <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Enter a URL to preview</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-auto space-y-6">
        <div>
          <h3 className="text-[#0F172A] text-[11px] font-bold uppercase tracking-widest mb-3 pl-1">Download Format</h3>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => generatedData && downloadPng(generatedData.url)}
              disabled={!generatedData}
              className="flex items-center justify-center gap-1.5 border border-[#E3E8F2] text-[#334155] bg-white hover:bg-[#F8FAFC] disabled:opacity-50 font-bold h-[38px] rounded-xl transition-all text-[12px] group"
            >
              <FileImage size={14} className="text-[#94A3B8] group-hover:text-[#2563EB] transition-colors" />
              PNG
            </button>
            <button
              onClick={() => generatedData && downloadSvg(generatedData.url)}
              disabled={!generatedData}
              className="flex items-center justify-center gap-1.5 border border-[#E3E8F2] text-[#334155] bg-white hover:bg-[#F8FAFC] disabled:opacity-50 font-bold h-[38px] rounded-xl transition-all text-[12px] group"
            >
              <FileCode size={14} className="text-[#94A3B8] group-hover:text-[#2563EB] transition-colors" />
              SVG
            </button>
            <button
              onClick={() => generatedData && downloadPdf(generatedData.url, generatedData.timestamp)}
              disabled={!generatedData}
              className="flex items-center justify-center gap-1.5 border border-[#E3E8F2] text-[#334155] bg-white hover:bg-[#F8FAFC] disabled:opacity-50 font-bold h-[38px] rounded-xl transition-all text-[12px] group"
            >
              <FileText size={14} className="text-[#94A3B8] group-hover:text-[#2563EB] transition-colors" />
              PDF
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-[#0F172A] text-[11px] font-bold uppercase tracking-widest mb-3 pl-1">Share</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCopyLink}
              disabled={!generatedData}
              className="flex-1 flex items-center justify-center gap-1.5 border border-[#E3E8F2] text-[#475569] bg-white hover:bg-blue-50/50 hover:border-[#2563EB]/30 hover:text-[#2563EB] disabled:opacity-50 font-bold h-[38px] rounded-xl transition-all text-[11px] px-3 whitespace-nowrap"
            >
              <Link size={13} />
              Copy Link
            </button>
            <button
              onClick={handleShare}
              disabled={!generatedData}
              className="flex-1 flex items-center justify-center gap-1.5 border border-[#E3E8F2] text-[#475569] bg-white hover:bg-blue-50/50 hover:border-[#2563EB]/30 hover:text-[#2563EB] disabled:opacity-50 font-bold h-[38px] rounded-xl transition-all text-[11px] px-3 whitespace-nowrap"
            >
              <Share2 size={13} />
              Share
            </button>
            <button
              onClick={handleSaveImage}
              disabled={!generatedData}
              className="flex-1 flex items-center justify-center gap-1.5 border border-[#E3E8F2] text-[#475569] bg-white hover:bg-blue-50/50 hover:border-[#2563EB]/30 hover:text-[#2563EB] disabled:opacity-50 font-bold h-[38px] rounded-xl transition-all text-[11px] px-3 whitespace-nowrap"
            >
              <Save size={13} />
              Save Image
            </button>
          </div>
        </div>
      </div>

      {/* Share Fallback Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] w-full max-w-[400px] shadow-2xl p-6 border border-[#E3E8F2] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[#0F172A] text-lg font-bold tracking-tight">Share options</h3>
              <button onClick={() => setIsShareModalOpen(false)} className="p-2 text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5FB] rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => { handleCopyLink(); setIsShareModalOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E3E8F2] text-[#475569] font-semibold hover:bg-[#F8FAFC] transition-all text-sm"
              >
                <Link size={18} />
                Copy Webhook Link
              </button>
              <button
                onClick={() => { handleSaveImage(); setIsShareModalOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E3E8F2] text-[#475569] font-semibold hover:bg-[#F8FAFC] transition-all text-sm"
              >
                <Download size={18} />
                Download PNG
              </button>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 mt-4">
                <p className="text-[12px] text-blue-700 font-medium leading-relaxed">
                  Tip: On mobile devices, download the image first then share it from your gallery or files.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckCircle2Icon = ({ size, strokeWidth, className }: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth || 2} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default PreviewCard;