import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  ArrowLeft, 
  Volume2, 
  RefreshCw, 
  Check, 
  UploadCloud, 
  Sparkles,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { Language } from '../../types';
import { TRANSLATIONS } from '../../utils/translations';
import { speak } from '../../utils/speech';
import { SAMPLE_CAPTURE_PREVIEWS } from '../../data/mockData';

interface CameraCaptureScreenProps {
  language: Language;
  onCancel: () => void;
  onPhotosCaptured: (photoUrls: string[]) => void;
  isAudioMuted: boolean;
}

export const CameraCaptureScreen: React.FC<CameraCaptureScreenProps> = ({
  language,
  onCancel,
  onPhotosCaptured,
  isAudioMuted,
}) => {
  const t = TRANSLATIONS[language];
  const [currentStep, setCurrentStep] = useState<number>(0); // 0, 1, 2
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string>('');
  const [isProcessingShutter, setIsProcessingShutter] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const guidanceSteps = [
    {
      title: 'Photo 1 of 3: Front View',
      guidance: t.captureGuidance1,
      speechText: 'फोटो 1: उत्पाद को कैमरे के ठीक बीच में रखें।',
      sampleUrl: SAMPLE_CAPTURE_PREVIEWS[0].url,
    },
    {
      title: 'Photo 2 of 3: 45° Angle',
      guidance: t.captureGuidance2,
      speechText: 'फोटो 2: उत्पाद को 45 डिग्री दाईं ओर घुमाएं ताकि गहराई दिखे।',
      sampleUrl: SAMPLE_CAPTURE_PREVIEWS[1].url,
    },
    {
      title: 'Photo 3 of 3: Top View',
      guidance: t.captureGuidance3,
      speechText: 'फोटो 3: उत्पाद का ऊपरी हिस्सा और किनारा दिखाएं।',
      sampleUrl: SAMPLE_CAPTURE_PREVIEWS[2].url,
    },
  ];

  // Initialize camera stream
  useEffect(() => {
    let active = true;

    async function startCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera device API not available');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });

        if (active && videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setCameraActive(true);
          setCameraError('');
        }
      } catch (err: any) {
        console.warn('Camera access prevented or not available:', err);
        setCameraActive(false);
        setCameraError('Webcam preview not available. Using guided simulation photos.');
      }
    }

    startCamera();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Speak guidance whenever step changes
  useEffect(() => {
    if (currentStep < 3 && !isAudioMuted) {
      speak(guidanceSteps[currentStep].speechText, language);
    }
  }, [currentStep, isAudioMuted, language]);

  const handleCapture = () => {
    setIsProcessingShutter(true);

    let photoUrl = guidanceSteps[currentStep].sampleUrl;

    // If real camera is working, snapshot canvas
    if (cameraActive && videoRef.current && canvasRef.current) {
      try {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          photoUrl = canvas.toDataURL('image/jpeg', 0.85);
        }
      } catch (e) {
        console.warn('Canvas snapshot fallback', e);
      }
    }

    setTimeout(() => {
      const nextPhotos = [...capturedPhotos, photoUrl];
      setCapturedPhotos(nextPhotos);
      setIsProcessingShutter(false);

      if (currentStep < 2) {
        setCurrentStep(prev => prev + 1);
      } else {
        // All 3 captured
        setCurrentStep(3);
        if (!isAudioMuted) {
          speak('तीनों फोटो खींच ली गई हैं। क्या आप इन फोटो का उपयोग करना चाहते हैं?', language);
        }
      }
    }, 400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const urls: string[] = [];
      for (let i = 0; i < Math.min(files.length, 3); i++) {
        urls.push(URL.createObjectURL(files[i]));
      }
      // Fill remaining if less than 3
      while (urls.length < 3) {
        urls.push(SAMPLE_CAPTURE_PREVIEWS[urls.length].url);
      }
      setCapturedPhotos(urls);
      setCurrentStep(3);
    }
  };

  const handleRetake = (stepToRetake?: number) => {
    if (stepToRetake !== undefined) {
      const next = [...capturedPhotos];
      next.splice(stepToRetake, 1);
      setCapturedPhotos(next);
      setCurrentStep(stepToRetake);
    } else {
      setCapturedPhotos([]);
      setCurrentStep(0);
    }
  };

  const handleConfirmUsePhotos = () => {
    if (capturedPhotos.length === 3) {
      onPhotosCaptured(capturedPhotos);
    } else {
      // Fallback with all 3 sample images
      onPhotosCaptured(SAMPLE_CAPTURE_PREVIEWS.map(s => s.url));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-between select-none">
      {/* Hidden canvas for snapshotting */}
      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Top Overlay: Progress & Step Info */}
      <div className="relative z-20 bg-gradient-to-b from-black/80 to-transparent p-4 flex items-center justify-between">
        <button
          onClick={onCancel}
          id="camera-cancel-btn"
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="text-sm font-bold tracking-wide">
            {currentStep < 3 ? `फोटो ${currentStep + 1} / 3 (${guidanceSteps[currentStep].title})` : 'तीनों फोटो की समीक्षा करें'}
          </div>
          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className={`w-3 h-3 rounded-full transition-all ${capturedPhotos.length >= 1 ? 'bg-emerald-400 scale-110 shadow-sm shadow-emerald-400' : 'bg-white/40'}`} />
            <span className={`w-3 h-3 rounded-full transition-all ${capturedPhotos.length >= 2 ? 'bg-emerald-400 scale-110 shadow-sm shadow-emerald-400' : 'bg-white/40'}`} />
            <span className={`w-3 h-3 rounded-full transition-all ${capturedPhotos.length >= 3 ? 'bg-emerald-400 scale-110 shadow-sm shadow-emerald-400' : 'bg-white/40'}`} />
          </div>
        </div>

        <button
          onClick={() => {
            if (currentStep < 3) {
              speak(guidanceSteps[currentStep].speechText, language);
            }
          }}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          title="Repeat guidance"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Main Viewport & Guides */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-gray-950">
        {/* Real Video or Simulated Viewfinder */}
        {cameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-radial from-gray-900 to-black p-6">
            <img
              src={currentStep < 3 ? guidanceSteps[currentStep].sampleUrl : capturedPhotos[0]}
              alt="Guidance Preview"
              className="w-full max-w-sm h-72 object-cover rounded-2xl opacity-75 shadow-2xl border border-white/20"
              referrerPolicy="no-referrer"
            />
            <div className="mt-3 text-center">
              <span className="text-xs bg-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/40">
                ✨ Guided Artisan Camera Simulation
              </span>
            </div>
          </div>
        )}

        {/* Shutter flash animation */}
        {isProcessingShutter && (
          <div className="absolute inset-0 bg-white z-30 animate-ping opacity-75" />
        )}

        {/* Center Frame Guide Overlay (if not finished) */}
        {currentStep < 3 && (
          <div className="relative z-10 w-72 h-80 sm:w-84 sm:h-96 border-2 border-dashed border-amber-400/80 rounded-3xl flex flex-col items-center justify-between p-4 shadow-2xl pointer-events-none">
            {/* Corner Markers */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-amber-400 rounded-tl-xl" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-amber-400 rounded-tr-xl" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-amber-400 rounded-bl-xl" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-amber-400 rounded-br-xl" />

            {/* AI Guidance Badge Top */}
            <div className="bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-400/40 text-xs font-bold text-amber-300 shadow-md">
              AI Guide: Step {currentStep + 1}
            </div>

            {/* Center crosshair */}
            <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            </div>

            {/* AI Guidance Banner Bottom */}
            <div className="bg-black/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-center max-w-[260px]">
              <p className="text-xs sm:text-sm font-bold text-white leading-tight">
                {guidanceSteps[currentStep].guidance}
              </p>
            </div>
          </div>
        )}

        {/* Finished State: 3 Photos Strip */}
        {currentStep >= 3 && (
          <div className="relative z-10 p-4 max-w-md w-full bg-stone-900/90 backdrop-blur-md rounded-xl border border-stone-700 text-center mx-4">
            <h3 className="text-sm font-bold text-white mb-0.5 flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>3 Angles Captured</span>
            </h3>
            <p className="text-xs text-stone-300 mb-3">
              Front, 45° angle, and top view ready for cataloging.
            </p>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {capturedPhotos.map((url, idx) => (
                <div key={idx} className="relative group rounded-lg overflow-hidden border border-stone-600 h-24 bg-stone-950">
                  <img
                    src={url}
                    alt={`Photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-1 left-1 text-[10px] font-semibold bg-stone-900/80 px-1.5 py-0.5 rounded text-white">
                    {idx === 0 ? 'Front' : idx === 1 ? '45°' : 'Top'}
                  </span>
                  <button
                    onClick={() => handleRetake(idx)}
                    className="absolute top-1 right-1 w-6 h-6 rounded bg-stone-900/80 text-stone-200 hover:text-white flex items-center justify-center hover:bg-stone-800 transition-colors cursor-pointer"
                    title="Retake this photo"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleConfirmUsePhotos}
                id="camera-use-photos-btn"
                className="w-full h-11 rounded-lg bg-stone-100 hover:bg-white text-stone-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{t.useThesePhotos}</span>
              </button>
              <button
                onClick={() => handleRetake()}
                className="h-9 text-xs text-stone-300 hover:text-white cursor-pointer flex items-center justify-center gap-1.5 font-medium"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t.retake}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls Overlay */}
      <div className="relative z-20 bg-stone-950/80 p-4 sm:p-5 border-t border-stone-900">
        {currentStep < 3 ? (
          <div className="max-w-md mx-auto flex items-center justify-between gap-4">
            {/* Manual file picker fallback */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center text-stone-400 hover:text-white text-xs gap-1 min-w-[50px] cursor-pointer"
              title="Upload existing photos"
            >
              <UploadCloud className="w-5 h-5" />
              <span>Gallery</span>
            </button>

            {/* Shutter Capture Button */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={handleCapture}
                disabled={isProcessingShutter}
                id="camera-shutter-btn"
                className="w-16 h-16 rounded-full border-2 border-white/80 bg-stone-900 flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-white group-hover:bg-stone-200 flex items-center justify-center text-stone-900">
                  <Camera className="w-5 h-5" />
                </div>
              </button>
              <span className="text-[11px] font-medium text-stone-300 tracking-wide">
                {t.captureButton}
              </span>
            </div>

            {/* Skip guidance link */}
            <button
              onClick={() => {
                setCapturedPhotos(SAMPLE_CAPTURE_PREVIEWS.map(s => s.url));
                setCurrentStep(3);
              }}
              className="flex flex-col items-center justify-center text-stone-400 hover:text-white text-xs gap-1 min-w-[50px] cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Auto 3</span>
            </button>
          </div>
        ) : (
          <div className="text-center text-xs text-stone-400">
            Select "Use These Photos" to begin AI processing
          </div>
        )}
      </div>
    </div>
  );
};
