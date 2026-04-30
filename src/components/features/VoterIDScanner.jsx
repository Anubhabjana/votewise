import { useState, useRef } from 'react';
import { analyzeVoterID } from '../../services/gemini';
import { useTranslation } from '../../hooks/useTranslation';
import { Camera, Upload, Loader2, CheckCircle, AlertTriangle, X, ScanLine, CreditCard, User, MapPin, FileText } from 'lucide-react';

export default function VoterIDScanner() {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  const processImage = async (base64, mimeType) => {
    setIsAnalyzing(true);
    setError('');
    setResult(null);

    try {
      const data = await analyzeVoterID(base64, mimeType);
      setResult(data);
    } catch (err) {
      setError(err.message || t('Could not analyze the document. Please try with a clearer image.'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Full = reader.result;
      setPreview(base64Full);
      // Extract just the base64 data (remove the data:image/...;base64, prefix)
      const base64Data = base64Full.split(',')[1];
      processImage(base64Data, file.type);
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    setShowCamera(true);
    setResult(null);
    setError('');
    setPreview(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError(t('Could not access camera. Please use file upload instead.'));
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    const base64Full = canvas.toDataURL('image/jpeg', 0.85);
    setPreview(base64Full);
    const base64Data = base64Full.split(',')[1];

    // Stop camera
    const stream = video.srcObject;
    stream?.getTracks().forEach(track => track.stop());
    setShowCamera(false);

    processImage(base64Data, 'image/jpeg');
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const reset = () => {
    setResult(null);
    setPreview(null);
    setError('');
    stopCamera();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--color-navy)] to-blue-800 px-6 py-4 text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <ScanLine className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{t('AI Document Scanner')}</h2>
            <p className="text-blue-200 text-sm">{t('Powered by Gemini Vision')}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Upload/Camera Section */}
        {!result && !isAnalyzing && !showCamera && (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              {t('Scan your Voter ID (EPIC) or any ID card. Our AI will extract details and check your voter eligibility.')}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-[var(--color-saffron)] hover:bg-orange-50 transition-all group"
              >
                <Upload className="w-10 h-10 text-gray-400 group-hover:text-[var(--color-saffron)] mb-3 transition-colors" />
                <span className="font-semibold text-gray-700 group-hover:text-[var(--color-navy)]">{t('Upload Photo')}</span>
                <span className="text-xs text-gray-500 mt-1">{t('JPG, PNG — Max 10MB')}</span>
              </button>
              
              {/* Camera Button */}
              <button
                onClick={startCamera}
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-[var(--color-navy)] hover:bg-blue-50 transition-all group"
              >
                <Camera className="w-10 h-10 text-gray-400 group-hover:text-[var(--color-navy)] mb-3 transition-colors" />
                <span className="font-semibold text-gray-700 group-hover:text-[var(--color-navy)]">{t('Take Photo')}</span>
                <span className="text-xs text-gray-500 mt-1">{t('Use your camera')}</span>
              </button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}

        {/* Camera View */}
        {showCamera && (
          <div className="relative rounded-xl overflow-hidden bg-black">
            <video ref={videoRef} autoPlay playsInline className="w-full rounded-xl" />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Camera overlay guide */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-4/5 h-3/5 border-2 border-white/50 rounded-xl">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                  {t('Align your ID card within the frame')}
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
              <button
                onClick={stopCamera}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full text-sm font-medium"
              >
                {t('Cancel')}
              </button>
              <button
                onClick={capturePhoto}
                className="px-6 py-3 bg-white hover:bg-gray-100 text-[var(--color-navy)] rounded-full font-bold shadow-lg flex items-center gap-2"
              >
                <Camera className="w-5 h-5" />
                {t('Capture')}
              </button>
            </div>
          </div>
        )}

        {/* Analyzing State */}
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
            {preview && (
              <img src={preview} alt="Uploaded ID" className="w-48 h-auto rounded-lg shadow-md mb-6 opacity-70" />
            )}
            <Loader2 className="w-10 h-10 text-[var(--color-navy)] animate-spin mb-4" />
            <p className="text-gray-700 font-semibold">{t('Analyzing with Gemini Vision AI...')}</p>
            <p className="text-gray-500 text-sm mt-1">{t('Extracting details from your document')}</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-fade-in">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-red-700 font-medium">{error}</p>
              <button onClick={reset} className="mt-2 text-sm text-red-600 underline">{t('Try again')}</button>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4 animate-fade-in">
            {/* Preview + Card Type */}
            <div className="flex items-start gap-4">
              {preview && (
                <img src={preview} alt="Scanned ID" className="w-32 h-auto rounded-lg shadow-md border" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-5 h-5 text-[var(--color-navy)]" />
                  <span className="font-bold text-lg text-gray-900">{result.card_type || 'ID Card'}</span>
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                  result.is_valid_voter_id 
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {result.is_valid_voter_id ? (
                    <><CheckCircle className="w-4 h-4 mr-1" /> {t('Valid Voter ID')}</>
                  ) : (
                    <><AlertTriangle className="w-4 h-4 mr-1" /> {t('Not a Voter ID')}</>
                  )}
                </div>
              </div>
              <button onClick={reset} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Reset">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Extracted Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.name && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-[var(--color-navy)] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-gray-500 font-semibold uppercase">{t('Name')}</span>
                    <p className="font-semibold text-gray-900">{result.name}</p>
                  </div>
                </div>
              )}
              {result.father_or_husband_name && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-gray-500 font-semibold uppercase">{t('Father/Husband')}</span>
                    <p className="font-semibold text-gray-900">{result.father_or_husband_name}</p>
                  </div>
                </div>
              )}
              {result.age_or_dob && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-5 h-5 text-[var(--color-saffron)] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-gray-500 font-semibold uppercase">{t('Age / DOB')}</span>
                    <p className="font-semibold text-gray-900">{result.age_or_dob}</p>
                  </div>
                </div>
              )}
              {result.epic_number && (
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <CreditCard className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-blue-500 font-semibold uppercase">{t('EPIC Number')}</span>
                    <p className="font-bold text-blue-900 font-mono">{result.epic_number}</p>
                  </div>
                </div>
              )}
              {result.constituency && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-gray-500 font-semibold uppercase">{t('Constituency')}</span>
                    <p className="font-semibold text-gray-900">{result.constituency}</p>
                  </div>
                </div>
              )}
              {result.state && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-gray-500 font-semibold uppercase">{t('State')}</span>
                    <p className="font-semibold text-gray-900">{result.state}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Eligibility Summary */}
            {result.eligibility_summary && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                <h4 className="font-bold text-[var(--color-navy)] mb-1">{t('Eligibility Assessment')}</h4>
                <p className="text-gray-700 text-sm">{result.eligibility_summary}</p>
              </div>
            )}

            {/* Tips */}
            {result.tips && result.tips.length > 0 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="font-bold text-amber-800 mb-2">💡 {t('Tips')}</h4>
                <ul className="text-sm text-amber-900 space-y-1">
                  {result.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={reset}
                className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                {t('Scan Another')}
              </button>
              <a
                href="https://voters.eci.gov.in/"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-4 bg-[var(--color-navy)] hover:bg-blue-900 text-white rounded-lg font-medium text-center transition-colors"
              >
                {t('Check Electoral Roll →')}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
