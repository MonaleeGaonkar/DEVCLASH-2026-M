import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Image as ImageIcon, 
  Loader, 
  Download, 
  Upload, 
  Search, 
  Eraser, 
  Film, 
  Cpu, 
  Sparkles,
  AlertCircle,
  Video
} from 'lucide-react';
import { generateImagePro, editImage, analyzeMedia, generateVideo } from '../services/geminiService';

type AspectRatio = "1:1" | "2:3" | "3:2" | "3:4" | "4:3" | "9:16" | "16:9" | "21:9";

export const VoidTerminal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'generate' | 'video' | 'edit' | 'analyze'>('generate');
  const [prompt, setPrompt] = useState('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [resultVideo, setResultVideo] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">("1K");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [videoResolution, setVideoResolution] = useState<"720p" | "1080p">("720p");
  const [videoAspectRatio, setVideoAspectRatio] = useState<"16:9" | "9:16">("16:9");
  const [useThinking, setUseThinking] = useState(true);
  const [uploadedFile, setUploadedFile] = useState<{data: string, type: string} | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Scanning frequencies...");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetTerminal = () => {
    setResultImage(null);
    setResultVideo(null);
    setAnalysisResult(null);
    setError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedFile({
        data: reader.result as string,
        type: file.type
      });
      resetTerminal();
    };
    reader.readAsDataURL(file);
  };

  const checkApiKey = async () => {
    if (window.aistudio && typeof (window.aistudio as any).hasSelectedApiKey === 'function') {
      const hasKey = await (window.aistudio as any).hasSelectedApiKey();
      if (!hasKey) {
        await (window.aistudio as any).openSelectKey();
        return false;
      }
    }
    return true;
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const keyChecked = await checkApiKey();
      // Proceeding regardless of key selection if we are in a dev environment that injects it
      
      if (activeTab === 'generate') {
        setLoadingMessage("Manifesting Psychic Image...");
        const result = await generateImagePro(prompt, imageSize, aspectRatio);
        setResultImage(result);
      } else if (activeTab === 'video') {
        setLoadingMessage("Opening Video Rift... This may take a few minutes.");
        const result = await generateVideo(prompt, videoAspectRatio, videoResolution);
        setResultVideo(result);
      } else if (activeTab === 'edit') {
        setLoadingMessage("Manipulating Artifact...");
        if (!uploadedFile) throw new Error("Need an artifact to manipulate. Upload a file.");
        const result = await editImage(uploadedFile.data, prompt, uploadedFile.type);
        setResultImage(result);
      } else if (activeTab === 'analyze') {
        setLoadingMessage("Observing Artifact through Thinking Mode...");
        if (!uploadedFile) throw new Error("Need an artifact to observe. Upload a file.");
        const result = await analyzeMedia(uploadedFile.data, uploadedFile.type, prompt || "Analyze this artifact for key information.", useThinking);
        setAnalysisResult(result);
      }
    } catch (err: any) {
      setError(err.message || "The Void resisted your request.");
      if (err.message?.includes("entity was not found")) {
        if (window.aistudio) (window.aistudio as any).openSelectKey();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="void-terminal" className="py-24 bg-black relative border-y border-zinc-900 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-stranger text-stranger-red stranger-title animate-authentic-flicker tracking-[0.2em]"
            data-text="THE VOID TERMINAL"
          >
            THE VOID TERMINAL
          </motion.h2>
          <p className="mt-4 text-zinc-500 font-mono text-[10px] uppercase tracking-[0.4em]">Advanced Inter-Dimensional Processing Unit</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: 'generate', label: 'Image', icon: <ImageIcon size={14} /> },
            { id: 'video', label: 'Video', icon: <Video size={14} /> },
            { id: 'edit', label: 'Edit', icon: <Eraser size={14} /> },
            { id: 'analyze', label: 'Analyze', icon: <Search size={14} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); resetTerminal(); }}
              className={`flex items-center gap-2 px-5 py-3 font-mono text-[9px] uppercase tracking-widest border transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'border-stranger-red text-stranger-red bg-stranger-red/5 shadow-[0_0_15px_rgba(231,29,54,0.2)]' 
                  : 'border-zinc-800 text-zinc-600 hover:border-zinc-600'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Controls */}
          <motion.div layout className="space-y-6 bg-zinc-950/50 p-8 border border-zinc-900">
            <div className="space-y-4">
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Input Stream</label>
              
              {(activeTab === 'edit' || activeTab === 'analyze') && (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-stranger-blue/30 hover:bg-zinc-900/50 transition-all group"
                >
                  <input type="file" hidden ref={fileInputRef} onChange={handleFileUpload} accept="image/*,video/*" />
                  {uploadedFile ? (
                    activeTab === 'analyze' && uploadedFile.type.startsWith('video') ? (
                      <Film className="text-stranger-blue animate-pulse" />
                    ) : (
                      <img src={uploadedFile.data} className="h-full w-full object-cover opacity-50" />
                    )
                  ) : (
                    <>
                      <Upload className="text-zinc-700 group-hover:text-stranger-blue transition-colors" />
                      <span className="text-[9px] font-mono text-zinc-700 group-hover:text-zinc-400 uppercase tracking-widest">Inject Artifact</span>
                    </>
                  )}
                </div>
              )}

              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  activeTab === 'generate' ? "Describe the image vision to manifest..." :
                  activeTab === 'video' ? "Describe the video rift to open..." :
                  activeTab === 'edit' ? "Instruct the void how to alter the artifact..." :
                  "Ask about the artifact's secrets..."
                }
                className="w-full bg-black border border-zinc-800 text-zinc-300 p-4 font-mono text-xs focus:outline-none focus:border-stranger-red h-32 resize-none"
              />
            </div>

            {activeTab === 'generate' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">Aspect Ratio</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9"].map(ratio => (
                      <button 
                        key={ratio}
                        onClick={() => setAspectRatio(ratio as any)}
                        className={`py-2 border font-mono text-[8px] transition-all ${aspectRatio === ratio ? 'border-stranger-red text-stranger-red bg-stranger-red/5' : 'border-zinc-800 text-zinc-700'}`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">Resolution Quality</label>
                  <div className="flex gap-2">
                    {(['1K', '2K', '4K'] as const).map(size => (
                      <button 
                        key={size}
                        onClick={() => setImageSize(size)}
                        className={`flex-1 py-2 border font-mono text-[9px] transition-all ${imageSize === size ? 'border-stranger-red text-stranger-red bg-stranger-red/5' : 'border-zinc-800 text-zinc-700'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'video' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">Video Aspect</label>
                  <div className="flex gap-2">
                    {["16:9", "9:16"].map(ratio => (
                      <button 
                        key={ratio}
                        onClick={() => setVideoAspectRatio(ratio as any)}
                        className={`flex-1 py-2 border font-mono text-[9px] transition-all ${videoAspectRatio === ratio ? 'border-stranger-red text-stranger-red bg-stranger-red/5' : 'border-zinc-800 text-zinc-700'}`}
                      >
                        {ratio === "16:9" ? "Landscape (16:9)" : "Portrait (9:16)"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">Resolution</label>
                  <div className="flex gap-2">
                    {["720p", "1080p"].map(res => (
                      <button 
                        key={res}
                        onClick={() => setVideoResolution(res as any)}
                        className={`flex-1 py-2 border font-mono text-[9px] transition-all ${videoResolution === res ? 'border-stranger-red text-stranger-red bg-stranger-red/5' : 'border-zinc-800 text-zinc-700'}`}
                      >
                        {res}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {(activeTab === 'analyze' || activeTab === 'generate' || activeTab === 'video') && (
              <div className="flex items-center justify-between p-4 border border-zinc-900 bg-black">
                <div className="flex items-center gap-3">
                  <Cpu className={`text-stranger-red ${useThinking ? 'animate-pulse' : 'opacity-20'}`} size={18} />
                  <div>
                    <p className="text-[10px] font-mono text-white uppercase tracking-widest">Cognitive Budget</p>
                    <p className="text-[8px] font-mono text-zinc-600 uppercase">32,768 Thinking Tokens Enabled</p>
                  </div>
                </div>
                <button 
                  onClick={() => setUseThinking(!useThinking)}
                  className={`w-12 h-6 rounded-full relative transition-all duration-500 ${useThinking ? 'bg-stranger-red' : 'bg-zinc-800'}`}
                >
                  <motion.div 
                    animate={{ x: useThinking ? 24 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                  />
                </button>
              </div>
            )}

            <button 
              onClick={handleAction}
              disabled={isLoading || (!prompt && (activeTab === 'generate' || activeTab === 'video'))}
              className="w-full bg-stranger-red text-black font-black font-mono uppercase tracking-[0.4em] py-4 hover:bg-white transition-all shadow-[0_0_20px_rgba(231,29,54,0.3)] disabled:opacity-20 flex items-center justify-center gap-3"
            >
              {isLoading ? <Loader className="animate-spin" size={18} /> : <Zap size={18} />}
              {activeTab === 'generate' ? 'Execute Manifest' : activeTab === 'video' ? 'Open Rift' : activeTab === 'edit' ? 'Alter Reality' : 'Decipher Transmission'}
            </button>

            {error && (
              <div className="p-3 bg-red-950/20 border border-red-900/50 text-red-500 font-mono text-[9px] uppercase tracking-widest flex items-center gap-2">
                <AlertCircle size={14} /> {error}
              </div>
            )}
          </motion.div>

          {/* Results Display */}
          <div className="relative aspect-video lg:aspect-square bg-black border border-zinc-900 overflow-hidden flex flex-col items-center justify-center group">
            <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,210,255,0.01),rgba(0,0,255,0.01))] bg-[length:100%_3px,3px_100%] opacity-20"></div>
            
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div 
                  key="loading" 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 text-center p-10"
                >
                  <div className="w-16 h-16 relative">
                    <div className="absolute inset-0 border-2 border-stranger-red/20 rounded-full"></div>
                    <div className="absolute inset-0 border-t-2 border-stranger-red rounded-full animate-spin"></div>
                  </div>
                  <p className="font-mono text-stranger-red text-[10px] uppercase tracking-[0.5em] animate-pulse">{loadingMessage}</p>
                </motion.div>
              ) : resultImage ? (
                <motion.div 
                  key="image"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-full relative"
                >
                  <img src={resultImage} className="w-full h-full object-contain grayscale-[0.3] hover:grayscale-0 transition-all duration-1000" />
                  <div className="absolute bottom-6 right-6">
                    <a href={resultImage} download="void-artifact.png" className="bg-black/80 backdrop-blur-md p-3 border border-stranger-blue/30 text-stranger-blue hover:text-white hover:bg-stranger-blue transition-all">
                      <Download size={20} />
                    </a>
                  </div>
                </motion.div>
              ) : resultVideo ? (
                <motion.div 
                  key="video"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-full relative"
                >
                  <video src={resultVideo} controls className="w-full h-full object-contain" />
                  <div className="absolute top-6 right-6 bg-stranger-red px-3 py-1 text-black font-mono text-[8px] uppercase font-bold shadow-[0_0_10px_#ff0033]">
                    RIFT STABILIZED
                  </div>
                </motion.div>
              ) : analysisResult ? (
                <motion.div 
                  key="analysis"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="w-full h-full p-8 overflow-y-auto font-mono text-green-400 text-xs leading-relaxed custom-scrollbar"
                >
                  <div className="mb-4 text-stranger-red border-b border-stranger-red/30 pb-2 uppercase tracking-widest text-[10px]">Observation Log:</div>
                  {analysisResult}
                  <div className="mt-6 flex justify-end">
                    <button onClick={() => { setAnalysisResult(null); setPrompt(''); }} className="text-[9px] text-zinc-600 hover:text-white transition-colors uppercase tracking-widest">Clear Log</button>
                  </div>
                </motion.div>
              ) : (
                <div key="placeholder" className="text-center p-10">
                  {activeTab === 'video' ? <Video size={64} className="mx-auto text-zinc-900 mb-6 opacity-30" /> : <ImageIcon size={64} className="mx-auto text-zinc-900 mb-6 opacity-30" />}
                  <p className="font-mono text-[9px] text-zinc-800 uppercase tracking-[0.6em]">Awaiting Void Transmission...</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};