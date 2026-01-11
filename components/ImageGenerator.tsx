
import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Zap, Image as ImageIcon, Loader, Download, Maximize2 } from 'lucide-react';
// Fix: Renamed generateImage to generateImagePro to match exported function in geminiService
import { generateImagePro } from '../services/geminiService';

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">("1K");
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const sporesOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.4, 0.1]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Check for API key if required for Pro model
    if (window.aistudio && typeof (window.aistudio as any).hasSelectedApiKey === 'function') {
      const hasKey = await (window.aistudio as any).hasSelectedApiKey();
      if (!hasKey) {
        await (window.aistudio as any).openSelectKey();
        // Proceeding after prompt as per instructions
      }
    }

    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      // Fix: Calling generateImagePro instead of the incorrect generateImage
      const result = await generateImagePro(prompt, imageSize);
      if (result) {
        setImageUrl(result);
      } else {
        setError("The image was lost in the Upside Down. Try again.");
      }
    } catch (err: any) {
      if (err.message?.includes("Requested entity was not found")) {
        setError("API Key Error. Please re-select your key.");
        if (window.aistudio) (window.aistudio as any).openSelectKey();
      } else {
        setError("Connection to the Void failed. Please check your signal.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section 
      ref={containerRef}
      id="visions" 
      className="py-24 bg-black relative overflow-hidden active-spores border-y border-zinc-900"
    >
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,_rgba(0,210,255,0.08)_0%,_#050505_100%)]"
      />
      <motion.div 
        style={{ opacity: sporesOpacity }}
        className="spores absolute inset-0 pointer-events-none"
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-3xl md:text-5xl font-stranger text-stranger-red stranger-title animate-authentic-flicker tracking-widest"
            data-text="Psychic Visions"
          >
            Psychic Visions
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "100px" }}
            transition={{ duration: 1 }}
            className="h-[1px] bg-stranger-blue/50 mx-auto mt-4 shadow-[0_0_15px_#00d2ff]"
          />
          <p className="mt-6 text-zinc-500 font-serif text-base md:text-lg max-w-xl mx-auto italic">
            Manifest your thoughts into visual artifacts using the Nano Banana Pro engine.
          </p>
        </div>

        <div className="bg-black/80 border border-zinc-900 p-1 max-w-2xl mx-auto shadow-[0_0_60px_rgba(0,210,255,0.05)] relative group">
           <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,210,255,0.02),rgba(0,0,255,0.02))] bg-[length:100%_3px,3px_100%] opacity-40"></div>
           
           <div className="bg-zinc-950 border border-zinc-900 p-4 md:p-6 relative z-10 min-h-[350px] flex flex-col items-center justify-center overflow-hidden">
              {isLoading ? (
                <div className="text-center space-y-4">
                  <div className="relative w-20 h-20 mx-auto">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 border border-stranger-blue rounded-full"
                    />
                    <div className="absolute inset-0 border border-t-stranger-red border-r-transparent border-b-stranger-blue border-l-transparent rounded-full animate-spin"></div>
                    <Loader className="absolute inset-0 m-auto text-stranger-red w-8 h-8 animate-pulse" />
                  </div>
                  <p className="font-mono text-stranger-blue tracking-[0.3em] uppercase text-[10px] animate-pulse">Scanning the Void...</p>
                </div>
              ) : imageUrl ? (
                <motion.div 
                  initial={{ opacity: 0, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  className="relative w-full"
                >
                  <img 
                    src={imageUrl} 
                    alt="Generated Vision" 
                    className="w-full h-auto shadow-2xl border border-zinc-900 grayscale-[0.3] contrast-125 group-hover:grayscale-0 transition-all duration-700" 
                  />
                  <div className="absolute bottom-4 right-4 flex gap-3">
                    <a 
                      href={imageUrl} 
                      download={`hawkins-vision-${Date.now()}.png`} 
                      className="bg-black/70 backdrop-blur-md border border-stranger-blue/30 text-stranger-blue p-2 hover:bg-stranger-blue hover:text-white transition-all duration-300"
                    >
                      <Download size={18} />
                    </a>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-16">
                  <ImageIcon size={60} className="mx-auto mb-4 text-zinc-900 opacity-20" />
                  <p className="font-mono text-[9px] text-zinc-800 uppercase tracking-[0.5em]">Waiting for transmission...</p>
                </div>
              )}

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 p-3 bg-red-950/20 border border-red-900/30 text-red-600 font-mono text-[10px] tracking-wider rounded-none"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>

        <form onSubmit={handleGenerate} className="mt-8 max-w-xl mx-auto relative z-30">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-3 p-1 bg-zinc-900/10 backdrop-blur-sm border border-zinc-900/50">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Communicate with the other side..."
                className="flex-1 bg-black/80 border border-zinc-900 text-zinc-400 px-4 py-3 focus:outline-none focus:border-stranger-blue/50 font-mono transition-all text-xs placeholder:text-zinc-800"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="bg-stranger-red text-black font-black font-mono uppercase tracking-[0.2em] px-8 py-3 hover:bg-white transition-all disabled:opacity-20 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(231,29,54,0.2)]"
              >
                <Zap size={14} className={isLoading ? 'animate-pulse' : ''} />
                <span className="text-[10px]">{isLoading ? 'Channeling...' : 'Transmit'}</span>
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-6">
              <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Resolution Artifact:</label>
              <div className="flex gap-4">
                {(["1K", "2K", "4K"] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setImageSize(size)}
                    className={`px-3 py-1 font-mono text-[10px] border transition-all ${
                      imageSize === size 
                        ? 'border-stranger-red text-stranger-red bg-stranger-red/5 shadow-[0_0_10px_rgba(231,29,54,0.2)]' 
                        : 'border-zinc-800 text-zinc-600 hover:border-zinc-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};
