import React, { useState } from 'react';
import { ChevronDown, Orbit, Flame, CircleDashed, Sparkles, Timer, Info } from 'lucide-react';
import { cn } from '../lib/utils';

interface SliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (val: number) => void;
  isLog?: boolean;
  tooltip?: string;
  icon: React.ReactNode;
  accentColor: 'emerald' | 'orange' | 'cyan' | 'yellow' | 'purple';
}

const getAccentClasses = (color: string) => {
  switch (color) {
    case 'emerald': return { text: 'text-emerald-400', border: 'focus:border-emerald-500', accent: 'accent-emerald-500', glow: 'from-emerald-500/10 to-transparent' };
    case 'orange': return { text: 'text-orange-400', border: 'focus:border-orange-500', accent: 'accent-orange-500', glow: 'from-orange-500/10 to-transparent' };
    case 'cyan': return { text: 'text-cyan-400', border: 'focus:border-cyan-500', accent: 'accent-cyan-500', glow: 'from-cyan-500/10 to-transparent' };
    case 'yellow': return { text: 'text-yellow-400', border: 'focus:border-yellow-500', accent: 'accent-yellow-500', glow: 'from-yellow-500/10 to-transparent' };
    case 'purple': return { text: 'text-purple-400', border: 'focus:border-purple-500', accent: 'accent-purple-500', glow: 'from-purple-500/10 to-transparent' };
    default: return { text: 'text-blue-400', border: 'focus:border-blue-500', accent: 'accent-blue-500', glow: 'from-blue-500/10 to-transparent' };
  }
};

export function Slider({ label, min, max, step = 1, value, onChange, isLog = false, tooltip, icon, accentColor }: SliderProps) {
  const handleLinearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  const handleLogChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sliderVal = parseFloat(e.target.value);
    const minLog = Math.log(min);
    const maxLog = Math.log(max);
    const newVal = Math.exp(minLog + (sliderVal / 100) * (maxLog - minLog));
    onChange(newVal);
  };

  let sliderValue;
  if (isLog) {
    const minLog = Math.log(min);
    const maxLog = Math.log(max);
    sliderValue = ((Math.log(Math.max(value, min)) - minLog) / (maxLog - minLog)) * 100;
  } else {
    sliderValue = value;
  }

  const accent = getAccentClasses(accentColor);
  const isTemp = label.includes('Temperature') || label.includes('Temp');

  return (
    <div className="relative group rounded-2xl bg-[#0a1128]/80 border border-slate-700/60 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.5)] backdrop-blur-md overflow-hidden transition-all hover:border-slate-500/80 hover:bg-[#0d1635]/90">
      {/* Background Glow */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-40 pointer-events-none transition-opacity group-hover:opacity-60", accent.glow)} />
      
      {/* Tech Accent Line */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1 opacity-70", accent.glow.replace('from-', 'bg-').split('/')[0])} />
      
      <div className="relative z-10 flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg bg-black/50 border border-slate-700/50 shadow-inner backdrop-blur-sm", accent.text)}>
              {icon}
            </div>
            <label className="text-sm font-bold text-slate-200 tracking-wide uppercase flex items-center gap-2 cursor-help">
              {label}
              {tooltip && (
                <div className="relative flex items-center">
                  <Info size={14} className="text-slate-500 hover:text-slate-300 transition-colors" />
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute left-6 w-48 bg-slate-900 text-xs text-slate-300 p-3 rounded-lg shadow-2xl pointer-events-none z-50 border border-slate-700 leading-relaxed">
                    {tooltip}
                  </span>
                </div>
              )}
            </label>
          </div>
          <input 
            type="number" 
            value={isLog ? Number(value.toPrecision(3)) : Number(value.toFixed(2))} 
            onChange={(e) => {
              let val = parseFloat(e.target.value);
              if (!isNaN(val)) {
                onChange(Math.max(min, Math.min(max, val)));
              }
            }}
            className={cn(
              "w-28 bg-black/80 font-mono text-right px-3 py-1.5 rounded-lg text-base border border-slate-700/80 focus:outline-none transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]",
              accent.text,
              accent.border
            )}
          />
        </div>
        
        <div className="relative pt-2 pb-1">
          <input 
            type="range" 
            min={isLog ? 0 : min} 
            max={isLog ? 100 : max} 
            step={isLog ? 0.1 : step} 
            value={sliderValue || 0} 
            onChange={isLog ? handleLogChange : handleLinearChange}
            className={cn(
              "w-full h-2.5 rounded-full appearance-none cursor-pointer shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)]",
              accent.accent,
              !isTemp && "bg-black/60 border border-slate-700/50"
            )}
            style={isTemp ? {
              background: 'linear-gradient(to right, #ff4b00, #ffcc6f, #fff4ea, #cad7ff, #9bb0ff)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
            } : {}}
          />
        </div>
      </div>
    </div>
  );
}

interface ControlsProps {
  mass: number;
  temperature: number;
  radius: number;
  luminosity: number;
  age: number;
  onMassChange: (v: number) => void;
  onTempChange: (v: number) => void;
  onRadiusChange: (v: number) => void;
  onLuminosityChange: (v: number) => void;
  onAgeChange: (v: number) => void;
  onPresetSelect: (m: number, t: number, r: number, l: number, a: number) => void;
}

export function Controls({
  mass, temperature, radius, luminosity, age,
  onMassChange, onTempChange, onRadiusChange, onLuminosityChange, onAgeChange,
  onPresetSelect
}: ControlsProps) {
  const [isPresetOpen, setIsPresetOpen] = useState(false);
  
  const presets = [
    { id: 'sun', name: "The Sun (G-Type)", m: 1, t: 5778, r: 1, l: 1, a: 0.5 },
    { id: 'sirius', name: "Sirius A (A-Type)", m: 2.02, t: 9940, r: 1.71, l: 25.4, a: 0.2 },
    { id: 'betelgeuse', name: "Betelgeuse (Red Supergiant)", m: 16.5, t: 3600, r: 764, l: 126000, a: 0.99 },
    { id: 'proxima', name: "Proxima Centauri (Red Dwarf)", m: 0.12, t: 3042, r: 0.14, l: 0.0017, a: 0.5 },
    { id: 'rigel', name: "Rigel (Blue Supergiant)", m: 21, t: 12100, r: 78.9, l: 120000, a: 0.9 }
  ];

  return (
    <div className="space-y-5">
      
      {/* Preset Button at the top for better UX */}
      <div className="relative pb-2 z-50">
        <button 
          onClick={() => setIsPresetOpen(!isPresetOpen)}
          className="w-full flex items-center justify-between bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white py-4 px-5 rounded-2xl font-bold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] border border-indigo-400/30"
        >
          <div className="flex items-center gap-3">
            <Sparkles size={20} className="text-indigo-200" />
            <span className="tracking-wide uppercase text-sm">Choose a Star Preset</span>
          </div>
          <ChevronDown size={20} className={cn("transition-transform duration-300", isPresetOpen && "rotate-180")} />
        </button>
        
        {isPresetOpen && (
          <div className="absolute top-[calc(100%-0.5rem)] left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-600 rounded-2xl shadow-2xl overflow-hidden divide-y divide-slate-700/50">
            {presets.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  onPresetSelect(p.m, p.t, p.r, p.l, p.a);
                  setIsPresetOpen(false);
                }}
                className="w-full text-left px-5 py-4 text-sm font-medium text-slate-200 hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors flex items-center justify-between group"
              >
                {p.name}
                <span className="text-xs font-mono text-slate-500 group-hover:text-indigo-400 transition-colors">
                  {p.t}K
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <Slider 
        label="Mass (M)" 
        min={0.1} max={50} step={0.1} 
        value={mass} onChange={onMassChange} isLog 
        tooltip="Higher mass stars burn fuel faster and are hotter."
        icon={<Orbit size={22} strokeWidth={1.5} />}
        accentColor="emerald"
      />
      <Slider 
        label="Surface Temp (K)" 
        min={2500} max={40000} step={100} 
        value={temperature} onChange={onTempChange} isLog 
        tooltip="Determines color and spectral class."
        icon={<Flame size={22} strokeWidth={1.5} />}
        accentColor="orange"
      />
      <Slider 
        label="Radius (R)" 
        min={0.1} max={1000} step={0.1} 
        value={radius} onChange={onRadiusChange} isLog 
        tooltip="Affects visual size and luminosity scaling."
        icon={<CircleDashed size={22} strokeWidth={1.5} />}
        accentColor="cyan"
      />
      <Slider 
        label="Luminosity (L)" 
        min={0.001} max={1000000} step={0.01} 
        value={luminosity} onChange={onLuminosityChange} isLog 
        tooltip="Luminosity shows total energy output, not apparent brightness."
        icon={<Sparkles size={22} strokeWidth={1.5} />}
        accentColor="yellow"
      />
      <Slider 
        label="Age / Stage" 
        min={0} max={0.99} step={0.01} 
        value={age} onChange={onAgeChange} 
        tooltip="0 = Young, 0.99 = End of life. Affects radius and temperature."
        icon={<Timer size={22} strokeWidth={1.5} />}
        accentColor="purple"
      />
    </div>
  );
}
