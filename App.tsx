import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import { Terminal, Brain, Shield, Heart, ChevronDown, Menu, X, ExternalLink, Clock, Radio, Instagram, Linkedin, MapPin, Zap, User, Users, Mail, Code, Sparkles, AlertTriangle, Activity } from 'lucide-react';
import { NAV_LINKS, TRACKS, FAQS, SCHEDULE } from './constants';
import { PrizePool } from './components/PrizePool';
import { Chatbot } from './components/Chatbot';
import { analyzeProjectIdea } from './services/geminiService';

// --- Shared Functions ---

const handleSmoothScroll = (e: React.MouseEvent, href: string) => {
  e.preventDefault();
  const targetId = href.replace('#', '');
  const element = document.getElementById(targetId);
  if (element) {
    const offset = 80;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

// --- Shared Components ---

const DevkraftIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="30" y="15" width="55" height="50" rx="6" fill="#E71D36" opacity="0.4" />
    <rect x="15" y="35" width="55" height="50" rx="6" fill="#E71D36" />
    <path d="M25 50L35 60L25 70" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="42" y1="70" x2="55" y2="70" stroke="white" strokeWidth="5" strokeLinecap="round" />
  </svg>
);

const XIcon = ({ size = 28 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const SectionTitle = ({ children, subtitle, upsideDown }: { children?: React.ReactNode; subtitle?: boolean; upsideDown?: boolean }) => (
  <div className="text-center mb-12 px-4">
    <motion.h2 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className={`text-3xl md:text-5xl font-stranger stranger-title animate-authentic-flicker tracking-tighter ${upsideDown ? 'grayscale-[0.3] contrast-[1.1]' : ''}`}
      data-text={typeof children === 'string' ? children : ''}
    >
      {children}
    </motion.h2>
    {subtitle && (
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: "120px" }}
        transition={{ duration: 1.2 }}
        className={`h-[1.5px] bg-gradient-to-r from-transparent via-stranger-blue to-transparent mx-auto mt-4 shadow-[0_0_15px_#00d2ff] ${upsideDown ? 'opacity-30' : ''}`}
      />
    )}
  </div>
);

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-10-27T10:00:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const TimeUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center mx-1 md:mx-2">
      <div className="bg-black/95 border border-stranger-blue/20 p-2 md:p-3 min-w-[55px] md:min-w-[80px] backdrop-blur-xl shadow-[0_0_10px_rgba(0,210,255,0.05)]">
        <span className="text-xl md:text-3xl font-mono text-stranger-red font-black tracking-tighter">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-zinc-600 font-mono text-[7px] md:text-[9px] mt-1 uppercase tracking-[0.2em] font-bold">{label}</span>
    </div>
  );

  return (
    <div className="flex justify-center flex-wrap my-4">
      <TimeUnit value={timeLeft.days} label="days" />
      <TimeUnit value={timeLeft.hours} label="hrs" />
      <TimeUnit value={timeLeft.minutes} label="min" />
      <TimeUnit value={timeLeft.seconds} label="sec" />
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('#home');
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = NAV_LINKS.map(link => link.href.substring(1));
      const current = sections.find(section => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 120 && rect.bottom >= 120;
        }
        return false;
      });
      if (current) setActiveLink(`#${current}`);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    handleSmoothScroll(e, href);
    setActiveLink(href);
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${scrolled ? 'bg-black/98 backdrop-blur-2xl border-b border-stranger-blue/10 py-1' : 'bg-transparent py-4'}`}>
      <motion.div
        className="absolute bottom-0 left-0 h-[1.5px] bg-stranger-red origin-left z-50 shadow-[0_0_8px_#ff0033]"
        style={{ scaleX }}
      />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-12 relative">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex-shrink-0 flex items-center gap-2 group cursor-pointer" onClick={(e) => handleNavClick(e as any, '#home')}>
            <div className="relative flex items-center gap-2">
              <DevkraftIcon className="w-7 h-7 md:w-8 md:h-8 transition-transform group-hover:scale-105" />
              <span className="font-stranger text-lg md:text-xl text-stranger-red tracking-tighter uppercase font-black">DEVKRAFT</span>
            </div>
          </motion.div>
          
          <div className="hidden lg:block">
            <div className="flex items-center space-x-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative font-serif text-[9px] font-bold tracking-[0.3em] uppercase transition-all duration-500
                    ${activeLink === link.href ? 'text-white' : 'text-zinc-500 hover:text-zinc-200'}
                  `}
                >
                  <span className="relative z-10">{link.name}</span>
                  {activeLink === link.href && (
                    <motion.div layoutId="activeGlow" className="absolute -bottom-1 left-0 right-0 h-[1px] bg-stranger-red shadow-[0_0_8px_#ff0000]" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                  )}
                </a>
              ))}
              <button onClick={(e) => handleNavClick(e as any, '#register')} className="px-3 py-1 border border-stranger-red text-stranger-red font-mono text-[8px] tracking-widest uppercase hover:bg-stranger-red hover:text-black transition-all duration-300">Register</button>
            </div>
          </div>

          <div className="lg:hidden flex items-center gap-4">
            <button onClick={() => setIsOpen(!isOpen)} className="text-stranger-red p-1 border border-stranger-red/20">
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="lg:hidden absolute top-full left-0 w-full bg-black/98 backdrop-blur-3xl border-b border-stranger-blue/20 py-6 flex flex-col items-center space-y-4">
            {NAV_LINKS.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-lg text-zinc-300 hover:text-stranger-red font-stranger uppercase tracking-widest" 
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const contentY = useTransform(scrollY, [0, 800], [0, 60]);
  const bgScale = useTransform(scrollY, [0, 800], [1, 1.05]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-16 pb-4 px-4">
      <motion.div 
        style={{ 
          scale: bgScale,
          backgroundImage: 'url("https://wallpapers.com/images/high/stranger-things-aesthetic-desktop-wpnc6ln8nkzhjss0.webp")'
        }}
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,210,255,0.05)_0%,black_95%)]" />
      </motion.div>

      <div className="absolute inset-0 pointer-events-none z-[1]">
        <motion.div 
          animate={{ opacity: [0, 0.1, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
          className="absolute inset-0 bg-stranger-blue/5 mix-blend-overlay"
        />
        <div className="spores absolute inset-0 opacity-10" />
      </div>

      <motion.div 
        style={{ y: contentY, opacity }}
        className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-stranger-red font-mono mb-2 md:mb-4 text-[8px] md:text-[10px] uppercase font-black tracking-[0.6em] drop-shadow-[0_0_10px_rgba(231,29,54,0.6)]">
            24 HOUR CHALLENGE
          </p>
        </motion.div>
        
        <div className="relative mb-6 md:mb-10 w-full max-w-5xl">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ duration: 1.5, ease: "easeOut" }} 
            className="flex flex-col items-center"
          >
            <div className="relative flex items-center justify-center py-4 md:py-8 group">
              {/* BIG FIRST LETTER */}
              <span className="font-stranger text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] stranger-title animate-authentic-flicker leading-none pr-1 md:pr-2 select-none" data-text="D">
                D
              </span>
              
              {/* MIDDLE SECTION WITH SYMMETRICAL BARS */}
              <div className="relative flex flex-col items-center px-1 md:px-2">
                {/* TOP THIN LINE */}
                <div className="absolute top-[8%] left-0 right-0 h-[1px] md:h-[1.5px] bg-stranger-red shadow-[0_0_15px_#E71D36,0_0_5px_#00d2ff]" />
                
                <span className="font-stranger text-4xl sm:text-6xl md:text-7xl lg:text-[8rem] stranger-title animate-authentic-flicker leading-none tracking-[-0.04em] select-none" data-text="EVCLAS">
                  EVCLAS
                </span>
                
                {/* BOTTOM THIN LINE */}
                <div className="absolute bottom-[8%] left-0 right-0 h-[1px] md:h-[1.5px] bg-stranger-red shadow-[0_0_15px_#E71D36]" />
              </div>
              
              {/* BIG LAST LETTER */}
              <span className="font-stranger text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] stranger-title animate-authentic-flicker leading-none pl-1 md:pl-2 select-none" data-text="H">
                H
              </span>
            </div>
            
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1, duration: 1.2 }}
              className="h-[1px] bg-stranger-blue/20 shadow-[0_0_10px_#00d2ff] opacity-40 mt-2" 
            />
          </motion.div>
        </div>

        <div className="flex flex-col items-center max-w-2xl mx-auto">
          <motion.p 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1, delay: 0.8 }} 
            className="font-serif text-zinc-300 text-xs md:text-lg lg:text-xl mb-4 italic leading-relaxed tracking-wide"
          >
            24 Hours of Code. One Night in the Void. <br/>
            <span className="text-zinc-500 text-[8px] md:text-[10px] lg:text-[12px] not-italic uppercase tracking-[0.4em] font-mono mt-2 block">The Biggest Clash of College Builders is Here.</span>
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 1 }}
            className="w-full"
          >
            <Countdown />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 1.2, duration: 0.8 }} 
            className="mt-6 md:mt-8"
          >
            <a href="#register" onClick={(e) => handleSmoothScroll(e as any, '#register')} className="group relative px-8 md:px-12 py-3 md:py-4 bg-black border border-stranger-red text-stranger-red font-black font-mono tracking-[0.4em] hover:bg-stranger-red hover:text-black transition-all duration-500 uppercase overflow-hidden shadow-[0_0_20px_rgba(231,29,54,0.15)]">
              <span className="relative z-10 text-[10px] md:text-sm">Open the Gate</span>
              <div className="absolute inset-0 bg-stranger-red transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
            </a>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        animate={{ y: [0, 5, 0], opacity: [0.3, 0.5, 0.3] }} 
        transition={{ repeat: Infinity, duration: 3 }} 
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-stranger-blue/30 cursor-pointer z-20" 
        onClick={(e) => handleSmoothScroll(e as any, '#about')}
      >
        <div className="flex flex-col items-center gap-1">
          <span className="font-mono text-[7px] uppercase tracking-[0.5em]">Descend</span>
          <ChevronDown size={20} />
        </div>
      </motion.div>
    </section>
  );
};

const GroupSectionContainer = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="relative">
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center pointer-events-none opacity-0 transition-opacity duration-1000"
        style={{ 
          backgroundImage: 'url(https://wallpapercave.com/wp/wp3773101.jpg)',
          // @ts-ignore
          '--group-bg-opacity': 'var(--group-bg-opacity, 0)'
        } as React.CSSProperties}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,10,20,0.2)_0%,black_90%)] z-10" />
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

const About = () => (
  <section id="about" className="py-32 relative">
    <div className="max-w-7xl mx-auto px-6">
      <SectionTitle subtitle>About Us</SectionTitle>
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="bg-black/70 p-8 md:p-12 backdrop-blur-md border border-stranger-blue/10">
          <p className="font-serif text-lg md:text-xl text-zinc-400 leading-relaxed text-justify first-letter:text-5xl first-letter:font-stranger first-letter:text-stranger-red first-letter:mr-3 first-letter:float-left">
            DevKraft is the premier technical community of our college, a collective of visionaries dedicated to bridging the gap between imagination and reality. Our mission culminates in DevClash 2026—a high-stakes, 24-hour odyssey where the brightest minds converge to solve the impossible. Whether you are deciphering the void, building the next fintech revolutionary tool, or securing the rift against digital threats, you are entering a sanctuary of innovation where creativity is the ultimate power and code is the only law. Join us as we transform our campus labs into a hub of inter-dimensional problem solving.
          </p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} className="hidden lg:block">
           <div className="border-2 border-stranger-blue/20 p-4 rotate-2 bg-black/20 backdrop-blur-sm shadow-[0_0_30px_rgba(0,210,255,0.05)]">
              <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800" className="w-full grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700" alt="Lab Equipment" />
           </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const Tracks = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'laptop': return <Terminal size={32} />;
      case 'brain': return <Brain size={32} />;
      case 'lock': return <Shield size={32} />;
      case 'heart': return <Heart size={32} />;
      default: return <Terminal size={32} />;
    }
  };

  return (
    <section id="tracks" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle subtitle>The Domains</SectionTitle>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TRACKS.map((track, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ delay: index * 0.1 }} 
              className="group relative h-[450px] overflow-hidden border border-zinc-900 bg-black backdrop-blur-xl transition-all duration-700 hover:border-stranger-blue/30 hover:shadow-[0_0_40px_rgba(0,210,255,0.1)]"
            >
              <div className="absolute inset-0 z-0">
                <img 
                  src={track.image} 
                  alt={track.title} 
                  className="w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              </div>

              <div className="relative z-10 h-full p-8 flex flex-col items-center justify-end text-center">
                <div className="text-stranger-blue mb-6 group-hover:scale-110 group-hover:text-stranger-red transition-all duration-500 opacity-80">
                  {getIcon(track.icon)}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 font-serif uppercase tracking-[0.2em] group-hover:text-stranger-red transition-colors duration-300">
                  {track.title}
                </h3>
                
                <div className="overflow-hidden h-0 group-hover:h-auto opacity-0 group-hover:opacity-100 transition-all duration-500">
                   <p className="text-zinc-400 text-xs leading-relaxed font-mono">
                    {track.description}
                  </p>
                </div>

                <div className="mt-4 w-8 h-[1px] bg-stranger-blue/30 group-hover:w-full group-hover:bg-stranger-red/50 transition-all duration-700" />
              </div>

              <div className="absolute inset-0 pointer-events-none z-20 opacity-0 group-hover:opacity-10 transition-opacity bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,210,255,0.02),rgba(0,0,255,0.02))] bg-[length:100%_3px,3px_100%]"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Schedule = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section id="schedule" ref={containerRef} className="py-32 bg-upside-down active-spores relative border-y border-zinc-900 overflow-hidden">
      <div className="spores"></div>
      
      <motion.div 
        animate={{ opacity: [0.03, 0.08, 0.03] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,210,255,0.08)_0%,_transparent_70%)] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionTitle subtitle upsideDown>Operational Log</SectionTitle>
        
        <div className="relative mt-24">
          {/* Main vertical line */}
          <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[1px] bg-zinc-900 -translate-x-1/2" />
          <motion.div 
            style={{ scaleY: pathLength, originY: 0 }}
            className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[1px] bg-stranger-blue -translate-x-1/2 shadow-[0_0_15px_#00d2ff]"
          />

          <div className="space-y-12 md:space-y-32">
            {SCHEDULE.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, delay: 0.1 }}
                className={`relative flex flex-col md:flex-row items-start md:items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 w-6 h-6 bg-black border border-stranger-blue rounded-none rotate-45 z-20 flex items-center justify-center">
                  <motion.div 
                    animate={{ scale: [1, 0.5, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-2 h-2 bg-stranger-red"
                  />
                </div>

                {/* Content Card */}
                <div className="w-full md:w-[45%] pl-12 md:pl-0 group">
                  <div className="relative p-6 border border-zinc-900 bg-black/80 backdrop-blur-xl hover:border-stranger-blue/30 transition-all duration-700 group overflow-hidden">
                    {/* Scanning Line Animation on Hover */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-stranger-blue/20 translate-y-[-100%] group-hover:translate-y-[600px] transition-all duration-[3s] ease-linear pointer-events-none" />
                    
                    <div className="relative z-10">
                      {/* Symmetrical Header for Time */}
                      <div className="flex flex-col items-center mb-6 relative">
                        {/* THIN TOP LINE - Symmetrical request */}
                        <div className="w-full h-[1px] bg-stranger-red/30 shadow-[0_0_8px_rgba(231,29,54,0.2)]" />
                        
                        <div className="py-2 flex items-center gap-3">
                           <Activity size={14} className="text-stranger-red opacity-50" />
                           <span className="font-stranger text-2xl text-stranger-red tracking-[0.1em]">
                             {item.time}
                           </span>
                           <Activity size={14} className="text-stranger-red opacity-50" />
                        </div>

                        {/* THIN BOTTOM LINE - Symmetrical request */}
                        <div className="w-full h-[1px] bg-stranger-red/30" />
                      </div>
                      
                      <h3 className="text-lg text-white font-bold font-serif mb-4 uppercase tracking-[0.2em] group-hover:text-stranger-blue transition-colors flex items-center gap-3">
                        <Terminal size={16} className="text-zinc-700" />
                        {item.event}
                      </h3>
                      
                      <p className="text-zinc-500 font-mono text-[10px] leading-relaxed group-hover:text-zinc-300 transition-colors uppercase tracking-wider">
                        {item.description}
                      </p>

                      <div className="mt-6 flex justify-between items-center opacity-30 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-1">
                          {[1,2,3].map(i => <div key={i} className="w-4 h-[2px] bg-zinc-800" />)}
                        </div>
                        <span className="text-[8px] font-mono text-zinc-700 uppercase tracking-[0.3em]">SECURE CHANNEL 04</span>
                      </div>
                    </div>

                    {/* Background Subtle Signal Map */}
                    <div className="absolute bottom-0 right-0 w-32 h-32 opacity-[0.03] pointer-events-none">
                       <svg viewBox="0 0 100 100" className="w-full h-full stroke-stranger-blue">
                         <path d="M0 50 Q 25 20, 50 50 T 100 50" fill="none" strokeWidth="0.5" />
                         <path d="M0 60 Q 25 30, 50 60 T 100 60" fill="none" strokeWidth="0.5" />
                       </svg>
                    </div>
                  </div>
                </div>

                {/* Empty space on opposite side */}
                <div className="hidden md:block md:w-[10%]" />
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-32 flex flex-col items-center text-center"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-24 h-[1px] bg-stranger-blue/20" />
            <Zap size={24} className="text-stranger-red animate-pulse" />
            <div className="w-24 h-[1px] bg-stranger-blue/20" />
          </div>
          <p className="font-stranger text-stranger-red text-2xl tracking-[0.3em] animate-pulse" data-text="TRANSMISSION ENDED">TRANSMISSION ENDED</p>
          <p className="mt-4 font-mono text-[9px] text-zinc-600 uppercase tracking-[0.4em]">The gate will remain closed until next synchronization.</p>
        </motion.div>
      </div>
    </section>
  );
};

const Register = () => {
  const [submitted, setSubmitted] = useState(false);
  const [description, setDescription] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const handleAnalyze = async () => {
    if (!description.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    const result = await analyzeProjectIdea(description);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="register" className="py-32 relative bg-black overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <SectionTitle subtitle>Registration Portal</SectionTitle>
        
        <div className="bg-black/60 border border-zinc-900 p-8 md:p-12 relative shadow-[0_0_50px_rgba(231,29,54,0.1)]">
          <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,210,255,0.01),rgba(0,0,255,0.01))] bg-[length:100%_3px,3px_100%] opacity-40"></div>
          
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6 relative z-10"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-stranger-blue font-mono text-[10px] uppercase tracking-widest flex items-center gap-2">
                      <Users size={12} /> Team Name
                    </label>
                    <input required type="text" placeholder="Hawkins AV Club" className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 px-4 py-3 focus:outline-none focus:border-stranger-red font-mono text-sm transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-stranger-blue font-mono text-[10px] uppercase tracking-widest flex items-center gap-2">
                      <Mail size={12} /> Leader Email
                    </label>
                    <input required type="email" placeholder="mike@hawkins.edu" className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 px-4 py-3 focus:outline-none focus:border-stranger-red font-mono text-sm transition-all" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-stranger-blue font-mono text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <Code size={12} /> Preferred Domain
                  </label>
                  <select required className="w-full bg-zinc-950 border border-zinc-800 text-zinc-400 px-4 py-3 focus:outline-none focus:border-stranger-red font-mono text-sm transition-all">
                    <option value="">Select a Domain...</option>
                    {TRACKS.map(track => (
                      <option key={track.title} value={track.title.toLowerCase()}>{track.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 relative">
                  <label className="text-stranger-blue font-mono text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <User size={12} /> Brief Description
                  </label>
                  <textarea 
                    required 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What will you build to save the world?" 
                    className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 px-4 py-3 focus:outline-none focus:border-stranger-red font-mono text-sm transition-all h-32"
                  ></textarea>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <button 
                      type="button" 
                      onClick={handleAnalyze}
                      disabled={!description.trim() || isAnalyzing}
                      className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-widest text-stranger-blue hover:text-white disabled:opacity-30 transition-all border border-stranger-blue/20 px-3 py-1.5"
                    >
                      {isAnalyzing ? <Radio size={12} className="animate-pulse" /> : <Sparkles size={12} />}
                      Scan for Void Compatibility
                    </button>
                    <span className="text-[8px] font-mono text-zinc-700">Powered by Gemini AI</span>
                  </div>

                  <AnimatePresence>
                    {analysis && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 p-4 bg-zinc-900 border-l-2 border-stranger-red"
                      >
                        <div className="flex gap-3">
                          <AlertTriangle className="text-stranger-red shrink-0" size={16} />
                          <p className="text-xs font-mono italic text-zinc-400 leading-relaxed">
                            <span className="text-stranger-red font-bold uppercase mr-2">The Void Responds:</span>
                            {analysis}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button type="submit" className="w-full bg-stranger-red text-black font-black font-mono uppercase tracking-[0.4em] py-4 hover:bg-white transition-all shadow-[0_0_20px_rgba(231,29,54,0.3)]">
                  Submit to the Void
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 relative z-10"
              >
                <div className="w-20 h-20 border-2 border-stranger-red rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_#ff0033]">
                  <Zap className="text-stranger-red w-10 h-10 animate-pulse" />
                </div>
                <h3 className="text-2xl font-stranger text-white mb-4 stranger-title" data-text="CLEARANCE GRANTED">CLEARANCE GRANTED</h3>
                <p className="text-zinc-500 font-mono text-sm leading-relaxed max-w-sm mx-auto">
                  Your team data has been transmitted. Check your radio (email) for frequency details. Welcome to the lab.
                </p>
                <button onClick={() => setSubmitted(false)} className="mt-8 text-stranger-blue font-mono text-[10px] uppercase tracking-[0.5em] hover:text-white transition-colors">Register Another Party</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-32 bg-upside-down active-spores border-t border-zinc-900">
      <div className="spores"></div>
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <SectionTitle subtitle upsideDown>Curiosity Door</SectionTitle>
        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div key={index} className="border border-zinc-900 bg-black/60 hover:border-stranger-blue/10 transition-all duration-500 rounded-none overflow-hidden backdrop-blur-sm">
              <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full text-left px-6 py-6 flex justify-between items-center focus:outline-none">
                <span className="text-base md:text-lg font-serif text-zinc-400 tracking-wider uppercase">{faq.question}</span>
                <span className={`text-stranger-blue transition-transform duration-500 ${openIndex === index ? 'rotate-180' : 'rotate-0'}`}><ChevronDown size={20} /></span>
              </button>
              <motion.div initial={false} animate={{ height: openIndex === index ? 'auto' : 0, opacity: openIndex === index ? 1 : 0 }} className="overflow-hidden">
                <div className="px-6 pb-6 text-zinc-500 font-mono text-xs leading-relaxed border-t border-zinc-900/30 pt-4">
                  <p>{faq.answer}</p>
                  {faq.link && (
                    <a 
                      href={faq.link} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 border border-stranger-blue/30 text-stranger-blue hover:bg-stranger-blue hover:text-black transition-all duration-300 text-[9px] tracking-widest uppercase font-bold"
                    >
                      <ExternalLink size={12} />
                      Access Location
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-black text-white py-20 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 flex flex-col items-center relative z-10 text-center">
      
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-stranger-blue font-mono text-xs tracking-[0.4em] mb-4 uppercase font-bold">DEVKRAFT</motion.p>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        className="relative mb-8 flex flex-col items-center"
      >
        {/* SYMMETRICAL FOOTER LOGO */}
        <div className="relative flex flex-col items-center px-4">
           {/* THIN TOP LINE */}
          <div className="absolute top-[5%] left-0 right-0 h-[1px] bg-stranger-red shadow-[0_0_8px_#E71D36]" />
          
          <h2 className="font-stranger text-3xl md:text-6xl stranger-title animate-authentic-flicker" data-text="DEVCLASH">
            DEVCLASH
          </h2>
          
           {/* THIN BOTTOM LINE */}
          <div className="absolute bottom-[5%] left-0 right-0 h-[1px] bg-stranger-red shadow-[0_0_8px_#E71D36]" />
        </div>
        
        <p className="font-mono text-[9px] md:text-[11px] tracking-[0.5em] text-white/40 mt-6 uppercase font-black">
          - THE BIGGEST CLASH -
        </p>
      </motion.div>

      <div className="flex gap-6 mb-12 text-stranger-blue/60 items-center">
        <a href="https://www.linkedin.com/company/dev-kraft" target="_blank" rel="noreferrer" className="hover:text-stranger-red transition-colors duration-300"><Linkedin size={24} /></a>
        <a href="https://www.instagram.com/devkraft.dpu" target="_blank" rel="noreferrer" className="hover:text-stranger-red transition-colors duration-300"><Instagram size={24} /></a>
        <a href="https://x.com/devkraftdpu" target="_blank" rel="noreferrer" className="hover:text-stranger-red transition-colors duration-300"><XIcon size={20} /></a>
        <a href="https://www.google.com/maps/place/Dr.+D.+Y.+Patil+Institute+of+Technology/@18.6230833,73.8160199,17z/data=!3m1!4b1!4m6!3m5!1s0x3bc2b860d63876d1:0x9bccd5081468bc36!8m2!3d18.6230833!4d73.8160199!16zL20vMDdxZjdx?entry=ttu&g_ep=EgoyMDI2MDEwNy4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noreferrer" className="hover:text-stranger-red transition-colors duration-300"><MapPin size={24} /></a>
      </div>

      <div className="text-[8px] font-mono text-white/20 tracking-[0.3em] uppercase">
        DEVCLASH ™ / © DEVKRAFT 2026
      </div>
    </div>
  </footer>
);

export default function App() {
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      const heroBottom = windowHeight;
      const tracksBottom = windowHeight * 3;
      
      if (scrollY > heroBottom * 0.5 && scrollY < tracksBottom) {
        document.documentElement.style.setProperty('--group-bg-opacity', '1');
      } else {
        document.documentElement.style.setProperty('--group-bg-opacity', '0');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-zinc-100 overflow-x-hidden selection:bg-stranger-red selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <GroupSectionContainer>
          <About />
          <Tracks />
        </GroupSectionContainer>
        <PrizePool />
        <Schedule />
        <Register />
        <FAQ />
      </main>
      <Chatbot />
      <Footer />
    </div>
  );
}
