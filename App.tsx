import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CreateCard from './components/CreateCard';
import PreviewCard from './components/PreviewCard';
import HelpModal from './components/HelpModal';
import { isValidUrl } from './utils/validation';
import { REPO_URL, AUTHOR_URL, AUTHOR_NAME, APP_YEAR } from './utils/constants';

export type ValidationState = 'empty' | 'invalid' | 'valid';
export type FramePreset = 'none' | 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6' | 'A7' | 'A8';
export type CornerStyle = 'classic' | 'rounded' | 'bold';

export interface GeneratedData {
  url: string;
  timestamp: string;
  framePreset: FramePreset;
  frameColor: string;
  cornerStyle: CornerStyle;
  captionText: string;
}

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [validationState, setValidationState] = useState<ValidationState>('empty');
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null);
  
  // Branding State
  const [framePreset, setFramePreset] = useState<FramePreset>('none');
  const [frameHexColor, setFrameHexColor] = useState('#2563EB');
  const [cornerStyle, setCornerStyle] = useState<CornerStyle>('classic');
  const [captionText, setCaptionText] = useState('');

  // Modal State
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Debounced validation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!inputValue) {
        setValidationState('empty');
        return;
      }
      
      const valid = isValidUrl(inputValue);
      setValidationState(valid ? 'valid' : 'invalid');
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  const handleGenerate = () => {
    if (validationState === 'valid') {
      setGeneratedData({
        url: inputValue.trim(),
        timestamp: new Date().toISOString(),
        framePreset,
        frameColor: frameHexColor,
        cornerStyle,
        captionText
      });
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (generatedData) {
      setGeneratedData(null);
    }
  };

  // Immediate preview update if already generated
  useEffect(() => {
    if (generatedData) {
      setGeneratedData(prev => prev ? ({
        ...prev,
        framePreset,
        frameColor: frameHexColor,
        cornerStyle,
        captionText
      }) : null);
    }
  }, [framePreset, frameHexColor, cornerStyle, captionText]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-[1100px]">
        <Header onOpenHelp={() => setIsHelpOpen(true)} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="w-full h-full">
            <CreateCard 
              inputValue={inputValue}
              setInputValue={handleInputChange}
              validationState={validationState}
              onGenerate={handleGenerate}
              framePreset={framePreset}
              setFramePreset={setFramePreset}
              frameHexColor={frameHexColor}
              setFrameHexColor={setFrameHexColor}
              cornerStyle={cornerStyle}
              setCornerStyle={setCornerStyle}
              captionText={captionText}
              setCaptionText={setCaptionText}
            />
          </div>
          <div className="w-full h-full">
            <PreviewCard 
              validationState={validationState}
              generatedData={generatedData}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-[#E3E8F2] text-center">
          <div className="text-[#94A3B8] text-sm mb-3">
            © {APP_YEAR} Webhook QR Studio. No data is stored.
          </div>
          <div className="flex items-center justify-center gap-6 text-sm font-medium">
            <a 
              href={REPO_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#475569] hover:text-[#2563EB] transition-colors hover:underline decoration-1 underline-offset-4"
            >
              Source
            </a>
            <button 
              onClick={() => setIsHelpOpen(true)} 
              className="text-[#475569] hover:text-[#2563EB] transition-colors hover:underline decoration-1 underline-offset-4 bg-transparent border-none cursor-pointer"
            >
              License
            </button>
            <a 
              href={AUTHOR_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#475569] hover:text-[#2563EB] transition-colors hover:underline decoration-1 underline-offset-4"
            >
              {AUTHOR_NAME}
            </a>
          </div>
        </footer>

        {/* Modals */}
        <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      </div>
    </div>
  );
};

export default App;
