import React from 'react';
import { Share2 } from 'lucide-react';
import { FramePreset, CornerStyle } from '../App';

interface QRCodeFrameProps {
  preset: FramePreset;
  color: string;
  cornerStyle: CornerStyle;
  caption: string;
  children: React.ReactNode;
}

const QRCodeFrame: React.FC<QRCodeFrameProps> = ({ preset, color, cornerStyle, caption, children }) => {
  const primaryColor = color;
  const hasCaption = caption.trim().length > 0;

  // Determine radii and border widths based on cornerStyle
  const getRadius = (base: number) => {
    if (cornerStyle === 'rounded') return base * 1.8;
    return base;
  };

  const getBorderWidth = (base: number) => {
    if (cornerStyle === 'bold') return base + 2;
    return base;
  };

  const renderFrameContent = () => {
    const commonRadius = getRadius(24);
    const commonBorder = getBorderWidth(3);

    if (preset === 'none') {
      return <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100">{children}</div>;
    }

    switch (preset) {
      case 'A1': 
        return (
          <div 
            className="bg-white p-4 shadow-lg flex flex-col items-center gap-4 transition-all duration-300" 
            style={{ 
              borderColor: primaryColor, 
              borderWidth: commonBorder, 
              borderStyle: 'solid',
              borderRadius: commonRadius 
            }}
          >
            <div className="bg-white p-2 rounded-xl">{children}</div>
            <div className="flex items-center gap-2 py-1 px-4 rounded-full" style={{ backgroundColor: `${primaryColor}15` }}>
              <Share2 size={16} style={{ color: primaryColor }} />
              <span className="text-[14px] font-bold" style={{ color: primaryColor }}>{hasCaption ? caption : 'SCAN TO TRIGGER'}</span>
            </div>
          </div>
        );

      case 'A2': // Thick top bar
        return (
          <div 
            className="bg-white border-solid overflow-hidden shadow-lg transition-all duration-300" 
            style={{ 
              borderColor: primaryColor, 
              borderWidth: getBorderWidth(2),
              borderRadius: getRadius(16)
            }}
          >
            <div className="h-10 flex items-center justify-center px-4" style={{ backgroundColor: primaryColor }}>
              <span className="text-white text-[13px] font-bold tracking-wider uppercase">{hasCaption ? caption : 'WEBHOOK TRIGGER'}</span>
            </div>
            <div className="p-8">{children}</div>
          </div>
        );

      case 'A3': // Double border
        return (
          <div 
            className="bg-white p-2 border-solid shadow-lg transition-all duration-300" 
            style={{ 
              borderColor: primaryColor, 
              borderWidth: getBorderWidth(4),
              borderRadius: getRadius(16)
            }}
          >
            <div className="p-6 border border-solid rounded-xl flex flex-col items-center gap-4" style={{ borderColor: `${primaryColor}40` }}>
              {children}
              {hasCaption && <span className="text-[13px] font-bold text-center px-2" style={{ color: primaryColor }}>{caption}</span>}
            </div>
          </div>
        );

      case 'A4': // Ticket style
        return (
          <div 
            className="bg-white p-8 border-solid shadow-lg relative flex flex-col items-center gap-4 transition-all duration-300" 
            style={{ borderColor: primaryColor, borderWidth: getBorderWidth(2) }}
          >
             <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 bg-[#F8FAFC] rounded-full border-r-2 border-solid" style={{ borderColor: primaryColor }}></div>
             <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 bg-[#F8FAFC] rounded-full border-l-2 border-solid" style={{ borderColor: primaryColor }}></div>
             {children}
             {hasCaption && <span className="text-[12px] font-black uppercase tracking-widest text-center" style={{ color: primaryColor }}>{caption}</span>}
          </div>
        );

      case 'A5': // Corner brackets
        return (
          <div className="bg-white p-8 relative flex flex-col items-center gap-6 shadow-lg border border-slate-100 rounded-xl transition-all duration-300">
             <div className="absolute top-3 left-3 w-8 h-8 border-t-4 border-l-4 border-solid transition-all" style={{ borderColor: primaryColor, borderRadius: cornerStyle === 'rounded' ? '8px' : '2px', borderWidth: getBorderWidth(4) }}></div>
             <div className="absolute top-3 right-3 w-8 h-8 border-t-4 border-r-4 border-solid transition-all" style={{ borderColor: primaryColor, borderRadius: cornerStyle === 'rounded' ? '8px' : '2px', borderWidth: getBorderWidth(4) }}></div>
             <div className="absolute bottom-3 left-3 w-8 h-8 border-b-4 border-l-4 border-solid transition-all" style={{ borderColor: primaryColor, borderRadius: cornerStyle === 'rounded' ? '8px' : '2px', borderWidth: getBorderWidth(4) }}></div>
             <div className="absolute bottom-3 right-3 w-8 h-8 border-b-4 border-r-4 border-solid transition-all" style={{ borderColor: primaryColor, borderRadius: cornerStyle === 'rounded' ? '8px' : '2px', borderWidth: getBorderWidth(4) }}></div>
             <div className="p-2">{children}</div>
             {hasCaption && (
               <div className="flex items-center gap-3">
                 <div className="h-[2px] w-4 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                 <span className="text-[14px] font-bold text-[#0F172A]">{caption}</span>
                 <div className="h-[2px] w-4 rounded-full" style={{ backgroundColor: primaryColor }}></div>
               </div>
             )}
          </div>
        );

      case 'A6': // Bottom pill caption
        return (
          <div className="flex flex-col items-center gap-4 transition-all duration-300">
             <div className="bg-white p-6 shadow-lg border-2 border-solid transition-all" style={{ borderColor: primaryColor, borderRadius: getRadius(24), borderWidth: getBorderWidth(2) }}>{children}</div>
             <div className="bg-white px-6 py-2 rounded-full border-2 border-solid shadow-sm transition-all" style={{ borderColor: primaryColor, borderWidth: getBorderWidth(2) }}>
                <span className="text-[14px] font-bold whitespace-nowrap" style={{ color: primaryColor }}>{hasCaption ? caption : 'SCAN ME'}</span>
             </div>
          </div>
        );

      case 'A7': // Minimal border + dots
        return (
          <div 
            className="bg-white p-6 border border-solid shadow-lg relative flex flex-col items-center gap-4 transition-all duration-300" 
            style={{ borderColor: `${primaryColor}30`, borderRadius: getRadius(8), borderWidth: cornerStyle === 'bold' ? 2 : 1 }}
          >
             <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }}></div>
             <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }}></div>
             <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }}></div>
             <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }}></div>
             <div className="p-2">{children}</div>
             {hasCaption && (
               <div className="pt-2 border-t w-full text-center" style={{ borderColor: `${primaryColor}20` }}>
                  <span className="text-[13px] font-semibold text-[#475569] italic">{caption}</span>
               </div>
             )}
          </div>
        );

      case 'A8': // Bold accents
        return (
          <div 
            className="bg-white p-6 border-solid shadow-xl relative flex flex-col items-center gap-5 transition-all duration-300" 
            style={{ borderColor: primaryColor, borderWidth: getBorderWidth(6), borderRadius: cornerStyle === 'rounded' ? '12px' : '0px' }}
          >
             <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-4 border-l-4 border-solid rotate-45" style={{ borderColor: primaryColor, borderWidth: getBorderWidth(6) }}></div>
             <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-4 border-r-4 border-solid rotate-45" style={{ borderColor: primaryColor, borderWidth: getBorderWidth(6) }}></div>
             <div className="bg-slate-50 p-1 rounded-sm">{children}</div>
             {hasCaption && <span className="text-[15px] font-black tracking-tight" style={{ color: primaryColor }}>{caption}</span>}
          </div>
        );

      default:
        return <div className="p-4">{children}</div>;
    }
  };

  return (
    <div id="qr-export-container" className="inline-block transition-all duration-300 bg-white">
      {renderFrameContent()}
    </div>
  );
};

export default QRCodeFrame;