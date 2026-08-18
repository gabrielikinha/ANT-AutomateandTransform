import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Camera, X, CheckCircle, AlertCircle, Keyboard } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface BarcodeScannerProps {
  onDetected: (code: string) => void;
  onClose: () => void;
  onManualEntry: (code: string) => void;
}

export default function BarcodeScanner({ onDetected, onClose, onManualEntry }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const [status, setStatus] = useState<'starting' | 'scanning' | 'detected' | 'error'>('starting');
  const [errorMsg, setErrorMsg] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [showManual, setShowManual] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        const reader = new BrowserMultiFormatReader();
        readerRef.current = reader;

        const controls = await reader.decodeFromVideoDevice(
          undefined,
          videoRef.current!,
          (result, err) => {
            if (result && !cancelled) {
              const text = result.getText();
              if (text) {
                setStatus('detected');
                controlsRef.current?.stop();
                setTimeout(() => onDetected(text), 600);
              }
            }
          },
        );

        if (cancelled) {
          controls.stop();
          return;
        }
        controlsRef.current = controls;
        setStatus('scanning');
      } catch (err: any) {
        if (cancelled) return;
        setStatus('error');
        if (err?.name === 'NotAllowedError') {
          setErrorMsg('Permissão de câmera negada. Digite o código manualmente.');
        } else if (err?.name === 'NotFoundError' || err?.name === 'DevicesNotFoundError') {
          setErrorMsg('Nenhuma câmera encontrada. Digite o código manualmente.');
        } else {
          setErrorMsg('Não foi possível acessar a câmera. Tente digitar o código.');
        }
        setShowManual(true);
      }
    }

    start();

    return () => {
      cancelled = true;
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, [onDetected]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = manualCode.trim();
    if (code) onManualEntry(code);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-ant-purple-soft flex items-center justify-center">
              <Camera size={16} className="text-ant-purple" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-800">Ler código de barras</h2>
              <p className="text-xs text-neutral-400">Aponte para o código do produto</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Camera viewport */}
        {!showManual && (
          <div className="relative bg-black aspect-square">
            <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />

            {/* Framing overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-40 border-2 border-white/70 rounded-xl relative">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-ant-green rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-ant-green rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-ant-green rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-ant-green rounded-br-lg" />
              </div>
            </div>

            {/* Status bar */}
            <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent">
              {status === 'starting' && (
                <p className="text-xs text-white/80 text-center">Iniciando câmera...</p>
              )}
              {status === 'scanning' && (
                <p className="text-xs text-white/80 text-center">Centralize o código na área verde</p>
              )}
              {status === 'detected' && (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle size={16} className="text-ant-green" />
                  <p className="text-xs font-semibold text-white">Código identificado!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error message */}
        {status === 'error' && !showManual && (
          <div className="p-4 bg-error-50 border-b border-error-100">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-error-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-error-700">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Manual entry */}
        {showManual && (
          <form onSubmit={handleManualSubmit} className="p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Keyboard size={16} className="text-neutral-400" />
              <span>Digitar código manualmente</span>
            </div>
            <Input
              label="Código de barras"
              placeholder="Ex: 7891234567890"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              autoFocus
              inputMode="numeric"
            />
            <div className="flex gap-3">
              <Button type="button" variant="outline" size="sm" fullWidth onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" size="sm" fullWidth disabled={!manualCode.trim()}>
                Buscar produto
              </Button>
            </div>
          </form>
        )}

        {/* Footer toggle */}
        {!showManual && (
          <div className="px-5 py-3 border-t border-neutral-100 flex justify-center">
            <button
              onClick={() => setShowManual(true)}
              className="text-xs text-ant-purple font-medium hover:text-ant-purple-light transition-colors flex items-center gap-1.5"
            >
              <Keyboard size={13} />
              Prefiro digitar o código
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
