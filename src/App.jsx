import React, { useEffect, useState } from 'react';
import { 
  Scale, 
  Utensils, 
  Calendar, 
  TrendingDown, 
  Coffee, 
  Sun, 
  CloudSun, 
  Moon, 
  Target, 
  ChevronRight, 
  ChevronLeft, 
  Flame, 
  Dumbbell, 
  Zap, 
  Activity, 
  Brain, 
  BookOpen, 
  Hourglass, 
  Plus, 
  Minus, 
  PlusCircle, 
  History, 
  RotateCcw, 
  Trash2, 
  TrendingUp,
  Code,
  Droplets,
  Pill,
  CheckCircle2,
  Languages
} from 'lucide-react';

const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const formatDate = (date) => {
  const d = date.getDate().toString().padStart(2, '0');
  const m = months[date.getMonth()];
  const y = date.getFullYear();
  return `${d} de ${m}, ${y}`;
};

const parseDateStr = (dateStr) => {
  try {
    const parts = dateStr.split(' de ');
    const day = parseInt(parts[0]);
    const monthStr = parts[1].split(', ')[0];
    const year = parseInt(parts[1].split(', ')[1]);
    const month = months.indexOf(monthStr);
    return new Date(year, month, day);
  } catch (e) {
    return new Date();
  }
};

const ICON_MAP = {
  coffee: <Coffee className="text-orange-400" />,
  sun: <Sun className="text-yellow-400" />,
  cloudSun: <CloudSun className="text-emerald-400" />,
  moon: <Moon className="text-indigo-400" />
};

const DEFAULT_INITIAL_STATE = [
  {
    fecha: "02 de Mayo, 2026",
    pesoActual: 143,
    pesoMeta: 86,
    unidad: "kg",
    ankiHoras: 0,
    ankiFrases: 0,
    tiempoOcio: 0,
    appHoras: 0,
    comidas: [
      { tipo: "Desayuno", menu: "Café con leche", hora: "08:30", cal: 120, icon: "coffee" },
      { tipo: "Almuerzo", menu: "2 papas sancochadas + 3 medallones de solomillo", hora: "14:00", cal: 550, icon: "sun" },
      { tipo: "Merienda", menu: "Arroz cocido con atún", hora: "17:30", cal: 380, icon: "cloudSun" },
      { tipo: "Cena", menu: "Leche con avena", hora: "21:00", cal: 320, icon: "moon" }
    ],
    vasosAgua: 0,
    tomadaTiroides: false,
    preplyHoras: 0
  },
  {
    fecha: "03 de Mayo, 2026",
    pesoActual: 142.5,
    pesoMeta: 86,
    unidad: "kg",
    ankiHoras: 0,
    ankiFrases: 0,
    tiempoOcio: 0,
    appHoras: 0,
    comidas: [
      { tipo: "Desayuno", menu: "Café con leche", hora: "08:30", cal: 120, icon: "coffee" },
      { tipo: "Almuerzo", menu: "30gr de gofio con un yogurt", hora: "11:30", cal: 200, icon: "sun" },
      { tipo: "Comida", menu: "Paella (100gr)", hora: "14:30", cal: 150, icon: "cloudSun" },
      { tipo: "Cena", menu: "Leche con avena", hora: "21:00", cal: 320, icon: "moon" }
    ],
    vasosAgua: 0,
    tomadaTiroides: false,
    preplyHoras: 0
  }
];

const App = () => {
  const [historial, setHistorial] = useState(() => {
    try {
      const saved = localStorage.getItem('tracker_data_v3');
      return saved ? JSON.parse(saved) : DEFAULT_INITIAL_STATE;
    } catch (e) {
      return DEFAULT_INITIAL_STATE;
    }
  });

  const [currentDayIndex, setCurrentDayIndex] = useState(historial.length - 1);
  const [activeTab, setActiveTab] = useState(1); // 0: Focus, 1: Nutrición, 2: Progreso
  const data = historial[currentDayIndex] || historial[0];

  useEffect(() => {
    localStorage.setItem('tracker_data_v3', JSON.stringify(historial));
  }, [historial]);

  const sumaTotalAnkiHoras = historial.reduce((acc, dia) => acc + (dia.ankiHoras || 0), 0);
  const sumaTotalAnkiFrases = historial.reduce((acc, dia) => acc + (dia.ankiFrases || 0), 0);
  const sumaTotalOcio = historial.reduce((acc, dia) => acc + (dia.tiempoOcio || 0), 0);
  const sumaTotalAppHoras = historial.reduce((acc, dia) => acc + (dia.appHoras || 0), 0);
  const BASE_PREPLY_HOURS = 1254;
  const sumaTotalPreplyHoras = BASE_PREPLY_HOURS + historial.reduce((acc, dia) => acc + (dia.preplyHoras || 0), 0);

  const totalCalorias = (data?.comidas || []).reduce((acc, curr) => acc + (curr.cal || 0), 0);
  
  const puntoPartida = 143;
  const progresoTotal = (data && puntoPartida !== data.pesoMeta) 
    ? ((puntoPartida - data.pesoActual) / (puntoPartida - data.pesoMeta)) * 100 
    : 0;
  
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    setAnimatedProgress(0);
    const timer = setTimeout(() => {
      setAnimatedProgress(Math.max(0, Math.min(100, progresoTotal)));
    }, 100);
    return () => clearTimeout(timer);
  }, [progresoTotal, currentDayIndex]);

  const radius = 90;
  const stroke = 14;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  const updateStat = (key, delta) => {
    setHistorial(prev => {
      const newHistorial = [...prev];
      if (newHistorial[currentDayIndex]) {
        newHistorial[currentDayIndex] = {
          ...newHistorial[currentDayIndex],
          [key]: Math.max(0, Number(((newHistorial[currentDayIndex][key] || 0) + delta).toFixed(2)))
        };
      }
      return newHistorial;
    });
  };

  const updateWeight = (delta) => {
    setHistorial(prev => {
      const newHistorial = [...prev];
      if (newHistorial[currentDayIndex]) {
        newHistorial[currentDayIndex] = {
          ...newHistorial[currentDayIndex],
          pesoActual: Math.max(data.pesoMeta, Number((newHistorial[currentDayIndex].pesoActual + delta).toFixed(1)))
        };
      }
      return newHistorial;
    });
  };

  const togglePill = () => {
    setHistorial(prev => {
      const newHistorial = [...prev];
      if (newHistorial[currentDayIndex]) {
        newHistorial[currentDayIndex] = {
          ...newHistorial[currentDayIndex],
          tomadaTiroides: !newHistorial[currentDayIndex].tomadaTiroides
        };
      }
      return newHistorial;
    });
  };

  const setWater = (count) => {
    setHistorial(prev => {
      const newHistorial = [...prev];
      if (newHistorial[currentDayIndex]) {
        newHistorial[currentDayIndex] = {
          ...newHistorial[currentDayIndex],
          vasosAgua: count
        };
      }
      return newHistorial;
    });
  };

  const resetProductivity = () => {
    setHistorial(prev => {
      const newHistorial = [...prev];
      if (newHistorial[currentDayIndex]) {
        newHistorial[currentDayIndex] = {
          ...newHistorial[currentDayIndex],
          ankiHoras: 0,
          ankiFrases: 0,
          tiempoOcio: 0,
          appHoras: 0,
          preplyHoras: 0
        };
      }
      return newHistorial;
    });
  };

  const restoreDefaults = () => {
    if (window.confirm("¿Restaurar valores iniciales?")) {
      setHistorial(DEFAULT_INITIAL_STATE);
      setCurrentDayIndex(DEFAULT_INITIAL_STATE.length - 1);
      localStorage.removeItem('tracker_data_v3');
    }
  };

  const addNewDay = () => {
    const lastDay = historial[historial.length - 1];
    const lastDate = parseDateStr(lastDay.fecha);
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const newDay = {
      ...lastDay,
      fecha: formatDate(nextDate),
      ankiHoras: 0,
      ankiFrases: 0,
      tiempoOcio: 0,
      appHoras: 0,
      comidas: [],
      vasosAgua: 0,
      tomadaTiroides: false,
      preplyHoras: 0
    };
    setHistorial(prev => {
      const next = [...prev, newDay];
      setCurrentDayIndex(next.length - 1);
      return next;
    });
  };

  const formatTime = (hours) => {
    const h = Math.floor(hours || 0);
    const m = Math.round(((hours || 0) - h) * 60);
    return `${h}h ${m}m`;
  };

  const prevDay = () => setCurrentDayIndex(prev => Math.max(0, prev - 1));
  const nextDay = () => setCurrentDayIndex(prev => Math.min(historial.length - 1, prev + 1));

  const pillStreak = historial.slice().reverse().findIndex(d => !d.tomadaTiroides);
  const totalPills = historial.filter(d => d.tomadaTiroides).length;

  const renderLineChart = () => {
    const width = 300;
    const height = 120;
    const padding = 20;
    if (historial.length < 1) return null;
    const weights = historial.map(d => d.pesoActual);
    const maxWeight = Math.max(...weights, puntoPartida);
    const minWeight = Math.min(...weights, data.pesoMeta);
    const range = maxWeight - minWeight || 1;
    const points = historial.map((d, i) => {
      const x = padding + (i / (historial.length > 1 ? historial.length - 1 : 1)) * (width - padding * 2);
      const y = height - padding - ((d.pesoActual - minWeight) / range) * (height - padding * 2);
      return `${x},${y}`;
    }).join(' ');
    return (
      <div className="w-full bg-black/20 rounded-3xl p-4 border border-white/5 mt-6 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent"></div>
        <p className="text-[9px] font-black text-emerald-500/50 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><TrendingUp size={12} /> Curva de Peso</p>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <line x1={padding} y1={padding} x2={width-padding} y2={padding} stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
          <line x1={padding} y1={height-padding} x2={width-padding} y2={height-padding} stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
          <polyline fill="none" stroke="url(#lineGradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={points} className="drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          {historial.map((d, i) => {
             const x = padding + (i / (historial.length > 1 ? historial.length - 1 : 1)) * (width - padding * 2);
             const y = height - padding - ((d.pesoActual - minWeight) / range) * (height - padding * 2);
             return (
               <g key={i} className="group/dot">
                 <circle cx={x} cy={y} r="6" fill="#1e1f22" stroke="#10b981" strokeWidth="2" />
                 {i === currentDayIndex && (<circle cx={x} cy={y} r="12" fill="#10b981" className="animate-ping opacity-20" />)}
               </g>
             );
          })}
          <defs><linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#059669" /><stop offset="100%" stopColor="#2dd4bf" /></linearGradient></defs>
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#1e1f22] flex flex-col items-center justify-center p-4 xl:p-6 font-sans selection:bg-emerald-500/30 text-slate-200 overflow-hidden">
      
      {/* Container para las columnas con transición en móvil */}
      <div className={`
        flex w-full transition-transform duration-500 ease-out h-full max-w-7xl
        xl:flex-row xl:translate-x-0 xl:gap-8 xl:items-stretch xl:justify-center
        ${activeTab === 0 ? 'translate-x-0' : activeTab === 1 ? '-translate-x-full' : '-translate-x-[-200%]'}
        xl:transform-none
      `}>
        
        {/* 1. FOCUS MENTAL */}
        <div className="w-full shrink-0 px-2 xl:w-auto xl:max-w-md xl:px-0">
          <div className="h-full bg-[#2b2d31] rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden relative flex flex-col min-h-[650px]">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/15 blur-[80px] rounded-full"></div>
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full"></div>

            <div className="relative p-8 pb-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-purple-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Productivity Report</p>
                  <h1 className="text-3xl font-black text-white tracking-tight">Focus Mental</h1>
                </div>
                <div className="flex gap-2">
                  <button onClick={resetProductivity} className="p-3 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-2xl border border-white/10 transition-all active:scale-90"><RotateCcw size={20} /></button>
                  <div className="bg-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.5)] p-3 rounded-2xl border border-white/20"><Brain className="text-white" size={24} strokeWidth={3} /></div>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-4 flex-1">
              <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 p-5 rounded-3xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/20 rounded-xl"><Brain size={24} className="text-purple-400" /></div>
                  <div><p className="text-[10px] font-bold text-purple-500/80 uppercase tracking-widest mb-1">Anki</p><p className="text-2xl font-black text-purple-100">{(data?.ankiHoras || 0).toFixed(1)} h</p></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateStat('ankiHoras', -0.5)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5"><Minus size={16} /></button>
                  <button onClick={() => updateStat('ankiHoras', 0.5)} className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg border border-purple-500/20 text-purple-400"><Plus size={16} /></button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 p-5 rounded-3xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl"><BookOpen size={24} className="text-blue-400" /></div>
                  <div><p className="text-[10px] font-bold text-blue-500/80 uppercase tracking-widest mb-1">Frases</p><p className="text-2xl font-black text-blue-100">{data?.ankiFrases || 0}</p></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateStat('ankiFrases', -10)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5"><Minus size={16} /></button>
                  <button onClick={() => updateStat('ankiFrases', 10)} className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg border border-blue-500/20 text-blue-400"><Plus size={16} /></button>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 p-5 rounded-3xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-cyan-500/20 rounded-xl"><Languages size={24} className="text-cyan-400" /></div>
                  <div><p className="text-[10px] font-bold text-cyan-500/80 uppercase tracking-widest mb-1">Preply</p><p className="text-2xl font-black text-cyan-100">{(data?.preplyHoras || 0).toFixed(1)} h</p></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateStat('preplyHoras', -1)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5"><Minus size={16} /></button>
                  <button onClick={() => updateStat('preplyHoras', 1)} className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg border border-cyan-500/20 text-cyan-400"><Plus size={16} /></button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 p-5 rounded-3xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/20 rounded-xl"><Code size={24} className="text-emerald-400" /></div>
                  <div><p className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest mb-1">Mejorando App</p><p className="text-2xl font-black text-emerald-100">{(data?.appHoras || 0).toFixed(1)} h</p></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateStat('appHoras', -0.5)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5"><Minus size={16} /></button>
                  <button onClick={() => updateStat('appHoras', 0.5)} className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg border border-emerald-500/20 text-emerald-400"><Plus size={16} /></button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-rose-500/10 to-transparent border border-rose-500/20 p-5 rounded-3xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-rose-500/20 rounded-xl"><Hourglass size={24} className="text-rose-400" /></div>
                  <div><p className="text-[10px] font-bold text-rose-500/80 uppercase tracking-widest mb-1">Ocio</p><p className="text-2xl font-black text-rose-100">{formatTime(data?.tiempoOcio)}</p></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateStat('tiempoOcio', -0.25)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10"><Minus size={16} /></button>
                  <button onClick={() => updateStat('tiempoOcio', 0.25)} className="p-2 bg-rose-500/20 hover:bg-rose-500/30 rounded-lg border border-rose-500/20 text-rose-400"><Plus size={16} /></button>
                </div>
              </div>

              <div className="mt-8 bg-black/40 p-6 rounded-[2rem] border border-white/5">
                <div className="flex items-center gap-2 mb-4"><History size={14} className="text-slate-400" /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Totales Acumulados</p></div>
                <div className="grid grid-cols-5 gap-1">
                  <div className="text-center"><p className="text-[7px] font-bold text-purple-400 uppercase mb-1">Anki</p><p className="text-base font-black text-white">{sumaTotalAnkiHoras.toFixed(1)}h</p></div>
                  <div className="text-center"><p className="text-[7px] font-bold text-blue-400 uppercase mb-1">Frases</p><p className="text-base font-black text-white">{sumaTotalAnkiFrases}</p></div>
                  <div className="text-center"><p className="text-[7px] font-bold text-cyan-400 uppercase mb-1">Preply</p><p className="text-base font-black text-white">{sumaTotalPreplyHoras.toFixed(1)}h</p></div>
                  <div className="text-center"><p className="text-[7px] font-bold text-emerald-400 uppercase mb-1">App</p><p className="text-base font-black text-white">{sumaTotalAppHoras.toFixed(1)}h</p></div>
                  <div className="text-center"><p className="text-[7px] font-bold text-rose-400 uppercase mb-1">Ocio</p><p className="text-base font-black text-white">{sumaTotalOcio.toFixed(1)}h</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. NUTRICIÓN (Daily Progress) */}
        <div className="w-full shrink-0 px-2 xl:w-auto xl:max-w-md xl:px-0">
          <div className="h-full bg-[#2b2d31] rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden relative min-h-[650px]">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/15 blur-[80px] rounded-full"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full"></div>
            <div className="relative p-8 pb-4">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Daily Progress Report</p>
                  <div className="flex items-center justify-between gap-3 bg-black/20 p-2 rounded-2xl border border-white/5">
                    <button onClick={prevDay} disabled={currentDayIndex === 0} className={`p-2 rounded-xl transition-all ${currentDayIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/10 text-white'}`}><ChevronLeft size={20} /></button>
                    <h1 className="text-xl font-black text-white tracking-tight truncate px-1">{data?.fecha?.split(',')[0] || "---"}</h1>
                    <button onClick={nextDay} disabled={currentDayIndex === historial.length - 1} className={`p-2 rounded-xl transition-all ${currentDayIndex === historial.length - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/10 text-white'}`}><ChevronRight size={20} /></button>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={restoreDefaults} className="p-4 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-2xl border border-white/10 transition-all active:scale-95" title="Restaurar valores iniciales"><Trash2 size={24} /></button>
                  <button onClick={addNewDay} className="p-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl shadow-lg transition-all active:scale-95"><PlusCircle size={24} /></button>
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 p-4 rounded-2xl flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/20 rounded-xl"><Zap size={20} className="text-orange-400" fill="currentColor" /></div>
                  <div><p className="text-[10px] font-bold text-orange-500/80 uppercase tracking-widest">Energía</p><p className="text-xl font-black text-orange-100">{totalCalorias} <span className="text-xs font-normal opacity-60">kcal</span></p></div>
                </div>
                <p className="text-xs font-bold text-emerald-400 uppercase">Déficit Activo</p>
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 bg-black/25 p-6 rounded-[2rem] border border-white/5 backdrop-blur-sm mb-6 group">
                <div className="text-center flex flex-col items-center">
                  <p className="text-slate-500 text-[9px] font-bold uppercase mb-1">Actual</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateWeight(-0.1)} className="p-1 hover:text-emerald-400 transition-colors"><Minus size={14}/></button>
                    <span className="text-4xl font-black text-white leading-none">{data?.pesoActual || 0}</span>
                    <button onClick={() => updateWeight(0.1)} className="p-1 hover:text-emerald-400 transition-colors"><Plus size={14}/></button>
                  </div>
                </div>
                <ChevronRight className="text-emerald-500" size={20} strokeWidth={3} />
                <div className="text-center">
                  <p className="text-slate-500 text-[9px] font-bold uppercase mb-1">Meta</p>
                  <span className="text-4xl font-black text-white/40 leading-none">{data?.pesoMeta || 0}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-white text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2"><Utensils size={14} className="text-emerald-500" /> Nutrición</h2>
                </div>
                
                {/* HIDRATACIÓN & TIROIDES */}
                <div className="grid grid-cols-1 gap-3 mb-4">
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10"><Droplets size={40} className="text-blue-400" /></div>
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Hidratación</p>
                      <p className="text-xs font-bold text-blue-200">{data?.vasosAgua || 0} / 8 vasos</p>
                    </div>
                    <div className="flex justify-between gap-1">
                      {[...Array(8)].map((_, i) => (
                        <button 
                          key={i} 
                          onClick={() => setWater(i + 1 === data?.vasosAgua ? i : i + 1)}
                          className={`flex-1 aspect-square rounded-lg flex items-center justify-center transition-all ${
                            i < (data?.vasosAgua || 0) 
                              ? 'bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]' 
                              : 'bg-white/5 text-slate-600 hover:bg-white/10'
                          }`}
                        >
                          <Droplets size={16} fill={i < (data?.vasosAgua || 0) ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={`transition-all duration-500 p-4 rounded-3xl border flex flex-col gap-3 relative overflow-hidden ${
                    data?.tomadaTiroides 
                      ? 'bg-emerald-500/20 border-emerald-500/30' 
                      : 'bg-rose-500/10 border-rose-500/20'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={togglePill}
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                            data?.tomadaTiroides ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white/5 text-slate-500'
                          }`}
                        >
                          <Pill size={24} />
                        </button>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Tiroides</p>
                          <p className={`text-sm font-bold ${data?.tomadaTiroides ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {data?.tomadaTiroides ? '¡Tomada!' : 'Pendiente'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-1">Racha Actual</p>
                        <div className="flex items-center gap-1.5 justify-end">
                          <CheckCircle2 size={12} className={pillStreak > 0 ? 'text-emerald-500' : 'text-slate-600'} />
                          <span className="text-lg font-black text-white">{pillStreak === -1 ? historial.length : pillStreak} d</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Visual History Dots */}
                    <div className="flex gap-1 justify-between items-center bg-black/20 p-2 rounded-xl mt-1">
                      {historial.slice(-14).map((d, i) => (
                        <div 
                          key={i} 
                          className={`w-2 h-2 rounded-full transition-all ${
                            d.tomadaTiroides ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-white/10'
                          } ${historial.length - 14 + i === currentDayIndex ? 'ring-2 ring-white ring-offset-1 ring-offset-[#2b2d31]' : ''}`}
                          title={d.fecha}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {data?.comidas && data.comidas.length > 0 ? (
                    data.comidas.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-xl bg-[#1e1f22] border border-white/10 flex items-center justify-center">{ICON_MAP[item.icon] || item.icon}</div>
                        <div className="flex-1 bg-white/5 p-4 rounded-2xl border border-transparent hover:bg-white/[0.08] transition-all">
                          <div className="flex justify-between items-start">
                            <div><span className="text-[10px] font-black text-slate-500 uppercase block mb-0.5">{item.tipo}</span><p className="text-sm text-slate-100 font-bold">{item.menu}</p></div>
                            <div className="text-right"><p className="text-[10px] font-black text-orange-400/80">{item.cal} kcal</p><p className="text-[9px] font-bold text-slate-600">{item.hora}</p></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white/5 border border-dashed border-white/10 p-8 rounded-3xl text-center">
                      <Utensils size={24} className="text-slate-600 mx-auto mb-2 opacity-20" />
                      <p className="text-xs text-slate-500 font-bold">No hay comidas registradas para este día</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. PROGRESO (Gráfico) */}
        <div className="w-full shrink-0 px-2 xl:w-auto xl:max-w-sm xl:px-0">
          <div className="h-full bg-[#2b2d31] rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10 p-8 flex flex-col items-center relative overflow-hidden min-h-[650px]">
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full"></div>
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-teal-500/10 blur-[100px] rounded-full"></div>
            <div className="w-full relative z-10 flex flex-col items-center mb-8">
              <h2 className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-2"><Target size={14} className="text-emerald-500" /> Progreso</h2>
              <div className="relative flex items-center justify-center mb-6 group cursor-pointer">
                <svg height={radius * 2} width={radius * 2} className="-rotate-90 drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                  <circle stroke="rgba(255,255,255,0.05)" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
                  <circle stroke="url(#gradient)" fill="transparent" strokeWidth={stroke} strokeDasharray={circumference + ' ' + circumference} style={{ strokeDashoffset, transition: 'stroke-dashoffset 2s ease-out' }} strokeLinecap="round" r={normalizedRadius} cx={radius} cy={radius} />
                  <defs><linearGradient id="gradient"><stop offset="0%" stopColor="#059669" /><stop offset="100%" stopColor="#2dd4bf" /></linearGradient></defs>
                </svg>
                <div className="absolute flex flex-col items-center"><span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 to-teal-500 tracking-tighter">{animatedProgress.toFixed(0)}%</span></div>
              </div>
            </div>
            <div className="w-full space-y-4 relative z-10">
              <div className="bg-black/30 p-4 rounded-2xl border border-white/5 flex justify-between items-center"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inicio: {puntoPartida}kg</p><Scale size={18} className="text-slate-400" /></div>
              <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 flex justify-between items-center">
                <div><p className="text-[10px] font-bold text-emerald-500/80 uppercase mb-1">Restante</p><p className="text-2xl font-black text-emerald-400">{(data?.pesoActual - data?.pesoMeta || 0).toFixed(1)} kg</p></div>
                <TrendingDown size={18} className="text-emerald-400" strokeWidth={3} />
              </div>
            </div>
            <div className="w-full relative z-10">{renderLineChart()}</div>
          </div>
        </div>
      </div>

      {/* PAGINATION DOTS (Solo móvil) */}
      <div className="flex xl:hidden gap-4 mt-8 mb-4 relative z-50">
        {[
          { icon: <Brain size={16} />, color: 'bg-purple-500' },
          { icon: <Utensils size={16} />, color: 'bg-emerald-500' },
          { icon: <Target size={16} />, color: 'bg-teal-500' }
        ].map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`
              relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300
              ${activeTab === i 
                ? `${tab.color} text-white shadow-[0_0_20px_rgba(0,0,0,0.4)] scale-110` 
                : 'bg-white/5 text-slate-500 hover:bg-white/10'}
            `}
          >
            {tab.icon}
            {activeTab === i && (
              <span className={`absolute inset-0 rounded-2xl ${tab.color} animate-ping opacity-20`}></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
