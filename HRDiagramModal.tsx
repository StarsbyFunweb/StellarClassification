import React from 'react';
import { X } from 'lucide-react';

interface HRDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  temperature: number;
  luminosity: number;
  starColorHex: string;
}

export function HRDiagramModal({ isOpen, onClose, temperature, luminosity, starColorHex }: HRDiagramModalProps) {
  if (!isOpen) return null;

  // Math for mapping
  // X: Temp (40000 down to 2500) -> log10
  const logTMax = Math.log10(40000);
  const logTMin = Math.log10(2500);
  const logT = Math.log10(temperature);
  const xPercent = ((logTMax - logT) / (logTMax - logTMin)) * 100;

  // Y: Lum (10^6 down to 10^-4) -> log10
  const logLMax = 6;
  const logLMin = -4;
  const logL = Math.log10(luminosity);
  const yPercent = ((logLMax - logL) / (logLMax - logLMin)) * 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl bg-[#050914] border border-slate-700/60 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/80 bg-slate-900/50">
          <h2 className="text-sm sm:text-lg font-bold text-white tracking-widest uppercase flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Hertzsprung-Russell Diagram
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800">
            <X size={20} />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-4 sm:p-8 relative aspect-square sm:aspect-[16/10] w-full bg-[#020617] flex-1">
          {/* Axes Labels */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] sm:text-xs font-bold text-yellow-400 tracking-widest uppercase origin-center whitespace-nowrap drop-shadow-md">
            Luminosity (L☉)
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs font-bold text-yellow-400 tracking-widest uppercase whitespace-nowrap drop-shadow-md">
            Surface Temperature (K)
          </div>

          {/* Graph Area */}
          <div className="absolute top-8 left-12 right-8 bottom-10 border-l border-b border-slate-700/50">
            
            {/* Background Regions (Approximations) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
              {/* Main Sequence Band */}
              <path d="M 0,0 C 30,30 70,70 100,100 L 100,90 C 70,60 30,20 0,-10 Z" fill="rgba(255,255,255,0.03)" />
              {/* Giants */}
              <ellipse cx="75%" cy="35%" rx="15%" ry="15%" fill="rgba(255,100,100,0.04)" />
              <text x="75%" y="35%" fill="#FF6B6B" fontSize="14" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" className="font-mono uppercase tracking-widest">Giants</text>
              
              {/* Supergiants */}
              <rect x="10%" y="5%" width="80%" height="15%" fill="rgba(100,200,255,0.04)" rx="10" />
              <text x="50%" y="12%" fill="#4DABF7" fontSize="14" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" className="font-mono uppercase tracking-widest">Supergiants</text>
              
              {/* White Dwarfs */}
              <ellipse cx="20%" cy="85%" rx="12%" ry="10%" fill="rgba(200,200,255,0.04)" />
              <text x="20%" y="85%" fill="#E9ECEF" fontSize="14" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" className="font-mono uppercase tracking-widest">White Dwarfs</text>

              {/* Main Sequence Label */}
              <text x="50%" y="55%" fill="#FFD700" fontSize="14" fontWeight="bold" textAnchor="middle" transform="rotate(35, 50%, 55%)" className="font-mono uppercase tracking-widest">Main Sequence</text>
            </svg>

            {/* Grid Lines */}
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '25% 20%' }} />

            {/* The Star Point */}
            <div 
              className="absolute w-5 h-5 -ml-2.5 -mt-2.5 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] border-2 border-white z-10 transition-all duration-500 ease-out"
              style={{ 
                left: `${Math.max(0, Math.min(100, xPercent))}%`, 
                top: `${Math.max(0, Math.min(100, yPercent))}%`,
                backgroundColor: starColorHex,
                boxShadow: `0 0 30px ${starColorHex}`
              }}
            >
              {/* Ping animation */}
              <div className="absolute inset-0 rounded-full animate-ping opacity-75" style={{ backgroundColor: starColorHex }}></div>
              
              {/* Label for current star */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-700 px-2 py-1 rounded text-[10px] font-mono text-white whitespace-nowrap pointer-events-none">
                Current Star
              </div>
            </div>
          </div>
          
          {/* Axis Ticks (X) */}
          <div className="absolute bottom-4 left-12 text-[10px] text-slate-200 font-semibold drop-shadow-md font-mono -translate-x-1/2">40,000K</div>
          <div className="absolute bottom-4 left-[calc(12px+25%)] text-[10px] text-slate-200 font-semibold drop-shadow-md font-mono -translate-x-1/2">10,000K</div>
          <div className="absolute bottom-4 left-[calc(12px+50%)] text-[10px] text-slate-200 font-semibold drop-shadow-md font-mono -translate-x-1/2">6,000K</div>
          <div className="absolute bottom-4 right-8 text-[10px] text-slate-200 font-semibold drop-shadow-md font-mono translate-x-1/2">2,500K</div>

          {/* Axis Ticks (Y) */}
          <div className="absolute top-8 left-2 text-[10px] text-slate-200 font-semibold drop-shadow-md font-mono">10⁶</div>
          <div className="absolute top-[calc(8px+20%)] left-2 text-[10px] text-slate-200 font-semibold drop-shadow-md font-mono">10⁴</div>
          <div className="absolute top-[calc(8px+40%)] left-2 text-[10px] text-slate-200 font-semibold drop-shadow-md font-mono">10²</div>
          <div className="absolute top-[calc(8px+60%)] left-2 text-[10px] text-slate-200 font-semibold drop-shadow-md font-mono">1</div>
          <div className="absolute top-[calc(8px+80%)] left-2 text-[10px] text-slate-200 font-semibold drop-shadow-md font-mono">10⁻²</div>
          <div className="absolute bottom-10 left-2 text-[10px] text-slate-200 font-semibold drop-shadow-md font-mono">10⁻⁴</div>

        </div>
      </div>
    </div>
  );
}
