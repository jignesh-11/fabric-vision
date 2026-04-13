
import React, { useState, useRef, useEffect } from 'react';
import { Material } from '../types.ts';
import { applyMaterialToPhoto } from '../services/geminiService.ts';

interface ImagePreviewerProps {
  selectedMaterials: Material[];
  onBack: () => void;
}

const GARMENT_OPTIONS = [
  { id: 'top', label: 'Top / Shirt' },
  { id: 'bottom', label: 'Bottom / Pants / Skirt' },
  { id: 'dress', label: 'Dress / Full Body' },
  { id: 'jacket', label: 'Jacket / Outerwear' },
];

const ImagePreviewer: React.FC<ImagePreviewerProps> = ({ selectedMaterials, onBack }) => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeMaterialId, setActiveMaterialId] = useState<string>(selectedMaterials[0]?.id || '');
  const [targetGarment, setTargetGarment] = useState<string>('top');

  const activeMaterial = selectedMaterials.find(m => m.id === activeMaterialId) || selectedMaterials[0];

  const currentResultKey = `${activeMaterial?.id}-${targetGarment}`;
  const currentResultImage = results[currentResultKey] || null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
        setResults({});
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyMaterial = async () => {
    if (!userImage || !activeMaterial) return;

    setIsProcessing(true);
    setError(null);
    try {
      const result = await applyMaterialToPhoto(
        userImage, 
        activeMaterial.imageUrl,
        activeMaterial.name,
        targetGarment
      );
      if (result) {
        setResults(prev => ({ ...prev, [currentResultKey]: result }));
      } else {
        setError("AI could not process the texture mapping. Please try another photo.");
      }
    } catch (err) {
      setError("An error occurred during AI processing. Please check your API configuration.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={onBack}
        className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors mb-8 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Catalog
      </button>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left Side: Upload & Control */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-2xl font-display font-bold text-slate-900">1. Upload Your Photo</h2>
            <p className="text-slate-500 text-sm">Upload a clear photo of yourself wearing a solid-colored top for best results.</p>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${userImage ? 'border-indigo-600 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 bg-slate-50'}`}
            >
              {userImage ? (
                <img src={userImage} alt="Uploaded" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <p className="font-semibold text-slate-900">Click to upload</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileUpload}
            />

            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">2. Target Garment</h3>
              <div className="grid grid-cols-2 gap-3">
                {GARMENT_OPTIONS.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setTargetGarment(option.id)}
                    className={`py-2 px-4 rounded-xl text-sm font-medium transition-colors border ${targetGarment === option.id ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">3. Select Material to Preview</h3>
              <div className="flex space-x-4 overflow-x-auto pb-4 snap-x">
                {selectedMaterials.map(material => (
                  <button
                    key={material.id}
                    onClick={() => setActiveMaterialId(material.id)}
                    className={`flex-shrink-0 w-24 flex flex-col items-center space-y-2 snap-start transition-all ${activeMaterialId === material.id ? 'opacity-100 scale-105' : 'opacity-60 hover:opacity-100'}`}
                  >
                    <img 
                      src={material.imageUrl} 
                      className={`w-16 h-16 rounded-xl object-cover shadow-sm border-2 ${activeMaterialId === material.id ? 'border-indigo-600' : 'border-transparent'}`} 
                      alt={material.name} 
                    />
                    <span className="text-xs font-medium text-slate-700 text-center line-clamp-2 leading-tight">{material.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              disabled={!userImage || isProcessing || !!currentResultImage}
              onClick={handleApplyMaterial}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg ${!userImage || isProcessing || !!currentResultImage ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 active:scale-95'}`}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>AI is mapping texture...</span>
                </>
              ) : currentResultImage ? (
                <>
                  <span>Preview Generated</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </>
              ) : (
                <>
                  <span>Apply Fabric Preview</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </button>
            {error && <p className="text-red-500 text-sm font-medium mt-2">{error}</p>}
          </div>
        </div>

        {/* Right Side: Result */}
        <div className="relative">
          <div className="sticky top-24 bg-slate-900 p-4 rounded-[40px] shadow-2xl h-fit border-[12px] border-slate-800">
            <div className="bg-slate-800 rounded-[28px] overflow-hidden aspect-[3/4] flex items-center justify-center relative group">
              {currentResultImage ? (
                <img 
                  key={currentResultKey}
                  src={currentResultImage} 
                  alt="Result" 
                  className="w-full h-full object-cover animate-in fade-in zoom-in duration-700"
                />
              ) : (
                <div className="text-center p-8 max-w-xs">
                  <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold mb-2">AI Visualizer</h3>
                  <p className="text-slate-400 text-sm">Upload a photo and click apply to see the virtual fabric transformation here.</p>
                </div>
              )}
              
              {isProcessing && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center text-white p-6">
                    <div className="flex justify-center space-x-1 mb-4">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce delay-75"></div>
                      <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
                    </div>
                    <p className="text-sm font-medium tracking-wide animate-pulse">Analyzing clothing contours...</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-between items-center px-4 py-2">
              <div className="flex space-x-2">
                <button className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
                 <button className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>
              <button 
                className={`px-6 py-3 rounded-full font-bold text-sm transition-all ${currentResultImage ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
              >
                Buy Material
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewer;
