
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Trophy, Award, Medal, Zap } from 'lucide-react';

export const PrizePool: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const prizes = [
    {
      rank: "2nd",
      title: "RUNNER UP",
      amount: "₹3,000",
      color: "stranger-blue",
      glow: "rgba(0,210,255,0.4)",
      icon: <Award className="w-12 h-12" />,
      delay: 0.1
    },
    {
      rank: "1st",
      title: "THE CHAMPION",
      amount: "₹5,000",
      color: "stranger-red",
      glow: "rgba(231,29,54,0.6)",
      icon: <Trophy className="w-16 h-16" />,
      delay: 0,
      highlight: true
    },
    {
      rank: "3rd",
      title: "2ND RUNNER UP",
      amount: "₹1,000",
      color: "stranger-blue",
      glow: "rgba(0,210,255,0.2)",
      icon: <Medal className="w-10 h-10" />,
      delay: 0.2
    }
  ];

  return (
    <section 
      ref={containerRef}
      id="prizes" 
      className="py-32 bg-black relative overflow-hidden active-spores border-y border-zinc-900"
    >
      <div className="spores absolute inset-0 opacity-10 pointer-events-none" />
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,_rgba(231,29,54,0.05)_0%,_#050505_100%)]"
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-6xl font-stranger text-stranger-red stranger-title animate-authentic-flicker tracking-widest"
            data-text="The Bounty"
          >
            The Bounty
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "150px" }}
            transition={{ duration: 1 }}
            className="h-[2px] bg-stranger-blue/50 mx-auto mt-6 shadow-[0_0_15px_#00d2ff]"
          />
          <p className="mt-8 text-zinc-500 font-serif text-lg max-w-2xl mx-auto italic uppercase tracking-widest">
            The Gate is open. Rewards await those who return from the void with the most powerful artifacts.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-end">
          {prizes.map((prize, idx) => (
            <motion.div
              key={prize.rank}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: prize.delay, duration: 0.8 }}
              className={`relative group ${prize.highlight ? 'md:order-2 order-1' : (idx === 0 ? 'md:order-1 order-2' : 'order-3')}`}
            >
              <div 
                className={`
                  relative bg-black border border-zinc-900 p-8 flex flex-col items-center text-center overflow-hidden transition-all duration-700
                  ${prize.highlight ? 'md:py-16 border-stranger-red/30' : 'md:py-12 border-stranger-blue/10'}
                  group-hover:border-opacity-100 group-hover:scale-[1.02]
                `}
                style={{ 
                  boxShadow: `0 0 40px rgba(0,0,0,1), inset 0 0 20px ${prize.highlight ? 'rgba(231,29,54,0.05)' : 'rgba(0,210,255,0.02)'}` 
                }}
              >
                {/* Background Glow */}
                <div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 blur-[80px] pointer-events-none opacity-40 transition-opacity group-hover:opacity-100"
                  style={{ backgroundColor: prize.glow }}
                />

                <div className={`mb-6 ${prize.highlight ? 'text-stranger-red' : 'text-stranger-blue'} opacity-80 group-hover:scale-110 transition-transform duration-500`}>
                  {prize.icon}
                </div>

                <span className="font-mono text-[10px] text-zinc-600 tracking-[0.4em] uppercase mb-2">Rank {prize.rank}</span>
                
                <h3 className="text-xl font-stranger text-white mb-6 tracking-tighter" data-text={prize.title}>
                  {prize.title}
                </h3>

                <div className="relative">
                  <span className={`text-4xl md:text-5xl font-black font-mono tracking-tighter ${prize.highlight ? 'text-stranger-red' : 'text-stranger-blue'} stranger-title animate-authentic-flicker`} data-text={prize.amount}>
                    {prize.amount}
                  </span>
                  <div className={`absolute -inset-2 blur-xl opacity-20 ${prize.highlight ? 'bg-stranger-red' : 'bg-stranger-blue'}`} />
                </div>

                <div className="mt-8 flex items-center gap-2">
                  <Zap className="w-3 h-3 text-zinc-800" />
                  <span className="text-[9px] font-mono text-zinc-700 tracking-widest uppercase">Hawkins National Lab Clearance</span>
                </div>
              </div>

              {/* Decorative side bars */}
              <div className={`absolute top-0 bottom-0 -left-[1px] w-[1px] bg-gradient-to-b from-transparent via-${prize.highlight ? 'stranger-red' : 'stranger-blue'}/20 to-transparent`} />
              <div className={`absolute top-0 bottom-0 -right-[1px] w-[1px] bg-gradient-to-b from-transparent via-${prize.highlight ? 'stranger-red' : 'stranger-blue'}/20 to-transparent`} />
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 text-center"
        >
          <p className="font-mono text-[10px] text-zinc-600 tracking-[0.5em] uppercase">
            + CERTIFICATES & SPECIAL SWAG FOR ALL ELIGIBLE PARTIES
          </p>
        </motion.div>
      </div>
    </section>
  );
};
