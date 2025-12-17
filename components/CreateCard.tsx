import React, { useState } from 'react';
import { 
  Link2, AlertCircle, X, Clipboard, CheckCircle2, 
  Play, Loader2, ExternalLink, XCircle, Copy,
  Type, Palette, Layout, CornerUpRight
} from 'lucide-react';
import { ValidationState, FramePreset, CornerStyle } from '../App';

interface CreateCardProps {
  inputValue: string;
  setInputValue: (val: string) => void;
  validationState: ValidationState;
  onGenerate: () => void;
  framePreset: FramePreset;
  setFramePreset: (val: FramePreset) => void;
  frameHexColor: string;
  setFrameHexColor: (val: string) => void;
  cornerStyle: CornerStyle;
  setCornerStyle: (val: CornerStyle) => void;
  captionText: string;
  setCaptionText: (val: string) => void;
}

const PRESETS: FramePreset[] = ['none', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8'];
const CORNER_STYLES: CornerStyle[] = ['classic', 'rounded', 'bold'];

type TestStatus = 'idle' | 'running' | 'success' | 'error';

interface TestResult {
  durationMs: number | null;
  httpStatus: number | null;
  responseText: string | null;
  errorMessage: string | null;
  lastRunAt: string | null;
}

const CreateCard: React.FC<CreateCardProps> = ({ 
  inputValue, 
  setInputValue, 
  validationState, 
  onGenerate,
  framePreset,
  setFramePreset,
  frameHexColor,
  setFrameHexColor,
  cornerStyle,
  setCornerStyle,
  captionText,
  setCaptionText
}) => {
  const [uiMessage, setUiMessage] = useState<string | null>(null);
  const [hexInput, setHexInput] = useState(frameHexColor);
  const [hexError, setHexError] = useState(false);
  
  // Test Webhook State
  const [testStatus, setTestStatus] = useState<TestStatus>('idle');
  const [testResult, setTestResult] = useState<TestResult>({
    durationMs: null,
    httpStatus: null,
    responseText: null,
    errorMessage: null,
    lastRunAt: null,
  });
  const [copiedResponse, setCopiedResponse] = useState(false);

  const handleClear = () => {
    setInputValue('');
    setUiMessage(null);
    setTestStatus('idle');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputValue(text);
        setUiMessage(null);
        setTestStatus('idle');
      }
    } catch (err) {
      setUiMessage('Clipboard access not available, paste manually.');
      setTimeout(() => setUiMessage(null), 3000);
    }
  };

  const handleHexChange = (val: string) => {
    setHexInput(val);
    const isValid = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(val);
    if (isValid) {
      setFrameHexColor(val);
      setHexError(false);
    } else {
      setHexError(true);
    }
  };

  const handleHexBlur = () => {
    if (!hexError) {
      const upper = hexInput.toUpperCase();
      setHexInput(upper);
      setFrameHexColor(upper);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && validationState === 'valid') {
      onGenerate();
    }
  };

  const handleTestRequest = async () => {
    if (!inputValue || validationState !== 'valid') return;
    setTestStatus('running');
    setTestResult({
      durationMs: null,
      httpStatus: null,
      responseText: null,
      errorMessage: null,
      lastRunAt: null,
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const startTime = performance.now();

    try {
      const response = await fetch(inputValue, { method: 'GET', signal: controller.signal });
      const text = await response.text();
      const duration = Math.round(performance.now() - startTime);
      clearTimeout(timeoutId);

      if (response.ok) {
        setTestStatus('success');
        setTestResult({
          durationMs: duration,
          httpStatus: response.status,
          responseText: text.slice(0, 600),
          errorMessage: null,
          lastRunAt: new Date().toLocaleTimeString(),
        });
      } else {
        setTestStatus('error');
        setTestResult({
          durationMs: duration,
          httpStatus: response.status,
          responseText: text.slice(0, 600),
          errorMessage: `Request returned status ${response.status}`,
          lastRunAt: new Date().toLocaleTimeString(),
        });
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      setTestStatus('error');
      setTestResult({
        durationMs: Math.round(performance.now() - startTime),
        httpStatus: null,
        responseText: null,
        errorMessage: error.name === 'AbortError' ? 'Timed out after 10s' : 'Network error (Check URL or CORS)',
        lastRunAt: new Date().toLocaleTimeString(),
      });
    }
  };

  return (
    <div className="bg-white rounded-[18px] border border-[#E3E8F2] shadow-premium card-highlight p-8 flex flex-col h-full relative overflow-hidden transition-all duration-300">
      <div className="mb-6">
        <h2 className="text-[#0F172A] text-[30px] font-bold mb-2 tracking-tight leading-[1.15]">Create</h2>
        <p className="text-[#475569] text-[14px] leading-relaxed">
          Paste a webhook URL, generate, and download as PNG.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="w-full">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Link2 className="text-[#94A3B8]" size={18} />
            </div>
            <input
              id="url-input"
              type="url"
              className={`block w-full pl-11 pr-10 h-12 rounded-[14px] text-[#0F172A] placeholder-slate-400 border bg-white focus:outline-none focus:ring-4 transition-all duration-200 font-medium ${
                validationState === 'invalid' && inputValue 
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-500/10' 
                  : 'border-[#E3E8F2] focus:border-[#2563EB] focus:ring-[#2563EB]/10'
              }`}
              placeholder="https://n8n.yourdomain.com/webhook/..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {inputValue && (
              <button onClick={handleClear} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors">
                <X size={16} />
              </button>
            )}
          </div>
          <div className="h-4 mt-2 flex items-center min-h-[16px]">
            {validationState === 'invalid' && inputValue && (
              <div className="flex items-center text-red-600 px-1 py-0.5 rounded text-[11px] font-semibold animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle size={12} className="mr-1" />
                <span>Please enter a valid HTTP/HTTPS URL</span>
              </div>
            )}
            {validationState === 'valid' && (
               <div className="flex items-center text-[#14B8A6] px-1 py-0.5 rounded text-[11px] font-bold animate-in fade-in slide-in-from-top-1 duration-200">
                <CheckCircle2 size={12} className="mr-1" />
                <span>VALID URL</span>
               </div>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={handlePaste} className="flex items-center justify-center gap-2 px-6 h-12 rounded-xl border border-[#E3E8F2] text-[#0F172A] hover:bg-[#F8FAFC] active:scale-[0.98] transition-all duration-150 font-medium text-[14px]">
            <Clipboard size={16} className="text-[#64748B]" />
            Paste
          </button>
          <button onClick={onGenerate} disabled={validationState !== 'valid'} className="flex-grow h-12 bg-[#2563EB] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] text-white font-semibold rounded-xl transition-all duration-150 shadow-sm text-[14px]">
            Generate
          </button>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-[#F1F5F9] space-y-6">
        <div>
          <h3 className="text-[#0F172A] text-[15px] font-bold mb-3 flex items-center gap-2">
            <Layout size={16} className="text-[#2563EB]" />
            Frames
          </h3>
          <div className="flex overflow-x-auto gap-2.5 pb-1 hide-scrollbar snap-x">
            {PRESETS.map((p) => (
              <button key={p} onClick={() => setFramePreset(p)} className="flex-shrink-0 w-[52px] group snap-start transition-all duration-200">
                <div className={`w-[52px] h-[52px] rounded-xl border-2 mb-1 flex items-center justify-center transition-all ${
                  framePreset === p 
                    ? 'border-[#2563EB] bg-blue-50/50 shadow-sm shadow-blue-100' 
                    : 'border-[#E3E8F2] bg-white group-hover:border-[#CBD5E1]'
                }`}>
                  <div className={`w-6 h-6 rounded border ${framePreset === p ? 'border-[#2563EB]' : 'border-[#94A3B8]'} flex items-center justify-center`}>
                    <span className="text-[8px] font-bold opacity-60">{p === 'none' ? 'X' : p}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold block text-center truncate ${framePreset === p ? 'text-[#2563EB]' : 'text-[#94A3B8]'}`}>
                  {p === 'none' ? 'NONE' : p}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <h3 className="text-[#0F172A] text-[13px] font-bold mb-2 flex items-center gap-2">
              <Palette size={14} className="text-[#2563EB]" />
              Frame Color
            </h3>
            <div className="flex items-center gap-2">
              <div className="relative w-11 h-11 flex-shrink-0">
                <input
                  type="color"
                  value={frameHexColor}
                  onChange={(e) => handleHexChange(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div 
                  className="w-full h-full rounded-xl border border-[#E3E8F2] shadow-sm"
                  style={{ backgroundColor: frameHexColor }}
                />
              </div>
              <div className="flex-grow">
                <input
                  type="text"
                  value={hexInput}
                  onChange={(e) => handleHexChange(e.target.value)}
                  onBlur={handleHexBlur}
                  className={`w-full text-[13px] font-mono font-medium border rounded-xl px-3 h-11 bg-white focus:outline-none focus:ring-4 transition-all ${
                    hexError ? 'border-red-300 focus:ring-red-500/10' : 'border-[#E3E8F2] focus:ring-[#2563EB]/10 focus:border-[#2563EB]'
                  }`}
                  placeholder="#2563EB"
                />
                <p className="text-[10px] text-[#94A3B8] mt-1 pl-1">Use #RRGGBB</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[#0F172A] text-[13px] font-bold mb-2 flex items-center gap-2">
              <CornerUpRight size={14} className="text-[#2563EB]" />
              Corner Style
            </h3>
            <div className="grid grid-cols-3 gap-1 bg-[#F1F5F9] p-1 rounded-xl h-11">
              {CORNER_STYLES.map((style) => (
                <button
                  key={style}
                  onClick={() => setCornerStyle(style)}
                  className={`text-[11px] font-bold rounded-lg transition-all capitalize ${
                    cornerStyle === style 
                      ? 'bg-white text-[#2563EB] shadow-sm' 
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[#0F172A] text-[13px] font-bold mb-2 flex items-center gap-2">
            <Type size={14} className="text-[#2563EB]" />
            Caption (optional)
          </h3>
          <div className="relative">
            <input
              type="text"
              maxLength={40}
              placeholder="e.g. Scan to trigger automation"
              value={captionText}
              onChange={(e) => setCaptionText(e.target.value)}
              className="w-full text-[13px] font-medium border border-[#E3E8F2] rounded-xl px-4 h-11 bg-white focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#94A3B8] font-bold">
              {captionText.length}/40
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-[#F1F5F9]">
        <button
          onClick={handleTestRequest}
          disabled={validationState !== 'valid' || testStatus === 'running'}
          className="flex items-center justify-center gap-2 px-4 h-10 rounded-lg border border-[#E3E8F2] text-[#475569] bg-white hover:bg-[#F8FAFC] disabled:opacity-50 transition-all font-medium text-[13px] w-full"
        >
          {testStatus === 'running' ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
          Send Test Request
        </button>
        {(testStatus === 'success' || testStatus === 'error') && (
          <div className="mt-4 p-3 bg-[#F8FAFC] border border-[#E3E8F2] rounded-xl animate-in fade-in duration-200">
             <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${testStatus === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {testStatus.toUpperCase()} {testResult.httpStatus}
                </span>
                <span className="text-[10px] text-[#94A3B8]">{testResult.durationMs}ms</span>
             </div>
             <pre className="text-[11px] font-mono text-[#475569] truncate whitespace-pre-wrap">{testResult.responseText || testResult.errorMessage}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCard;
