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
  coffee: <Coffee className="text-orange-400" size={18} />,
  sun: <Sun className="text-yellow-400" size={18} />,
  cloudSun: <CloudSun className="text-emerald-400" size={18} />,
  moon: <Moon className="text-indigo-400" size={18} />
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
  const [activeTab, setActiveTab] = useState(1);
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

  const radius = 80;
  const stroke = 12;
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

  const renderLineChart = () => {
    const width = 300;
    const height = 100;
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
      <div className="w-full bg-black/20 rounded-2xl p-3 border border-white/5 mt-4 relative overflow-hidden group">
        <p className="text-[8px] font-black text-emerald-500/50 uppercase tracking-[0.2em] mb-2 flex items-center gap-1"><TrendingUp size={10} /> Curva</p>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <polyline fill="none" stroke="url(#lineGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={points} />
          {historial.map((d, i) => {
             const x = padding + (i / (historial.length > 1 ? historial.length - 1 : 1)) * (width - padding * 2);
             const y = height - padding - ((d.pesoActual - minWeight) / range) * (height - padding * 2);
             return (
               <circle key={i} cx={x} cy={y} r="4" fill={i === currentDayIndex ? "#10b981" : "#334155"} />
             );
          })}
          <defs><linearGradient id="lineGradient"><stop offset="0%" stopColor="#059669" /><stop offset="100%" stopColor="#2dd4bf" /></linearGradient></defs>
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#1e1f22] flex flex-col items-center justify-center p-3 sm:p-6 font-sans selection:bg-emerald-500/30 text-slate-200 overflow-hidden">
      
      <div className={`
        flex w-full transition-transform duration-500 ease-out h-full max-w-7xl
        xl:flex-row xl:translate-x-0 xl:gap-8 xl:items-stretch xl:justify-center
        ${activeTab === 0 ? 'translate-x-0' : activeTab === 1 ? '-translate-x-full' : '-translate-x-[200%]'}
        xl:transform-none
      `}>
        
        {/* 1. FOCUS MENTAL */}
        <div className="w-full shrink-0 px-1 xl:w-auto xl:max-w-md xl:px-0">
          <div className="h-full bg-[#2b2d31] rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden relative flex flex-col min-h-[550px]">
            <div className="relative p-6 pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-purple-400 text-[9px] font-black uppercase tracking-widest mb-1">Focus</p>
                  <h1 className="text-2xl font-black text-white tracking-tight">Focus Mental</h1>
                </div>
                <button onClick={resetProductivity} className="p-2 bg-white/5 text-slate-400 rounded-xl transition-all active:scale-90"><RotateCcw size={18} /></button>
              </div>
            </div>

            <div className="p-6 space-y-3 flex-1">
              {[
                { label: 'Anki', val: (data?.ankiHoras || 0).toFixed(1) + 'h', icon: <Brain size={20} />, color: 'purple', key: 'ankiHoras', step: 0.5 },
                { label: 'Frases', val: data?.ankiFrases || 0, icon: <BookOpen size={20} />, color: 'blue', key: 'ankiFrases', step: 10 },
                { label: 'Preply', val: (data?.preplyHoras || 0).toFixed(1) + 'h', icon: <Languages size={20} />, color: 'cyan', key: 'preplyHoras', step: 1 },
                { label: 'App', val: (data?.appHoras || 0).toFixed(1) + 'h', icon: <Code size={20} />, color: 'emerald', key: 'appHoras', step: 0.5 },
                { label: 'Ocio', val: formatTime(data?.tiempoOcio), icon: <Hourglass size={20} />, color: 'rose', key: 'tiempoOcio', step: 0.25 }
              ].map((item, idx) => (
                <div key={idx} className={`bg-gradient-to-br from-${item.color}-500/10 to-transparent border border-${item.color}-500/20 p-4 rounded-2xl flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 bg-${item.color}-500/20 rounded-lg text-${item.color}-400`}>{item.icon}</div>
                    <div><p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{item.label}</p><p className="text-xl font-black text-white">{item.val}</p></div>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => updateStat(item.key, -item.step)} className="p-1.5 bg-white/5 rounded-lg"><Minus size={14} /></button>
                    <button onClick={() => updateStat(item.key, item.step)} className={`p-1.5 bg-${item.color}-500/20 rounded-lg text-${item.color}-400`}><Plus size={14} /></button>
                  </div>
                </div>
              ))}

              <div className="mt-4 bg-black/40 p-4 rounded-2xl border border-white/5">
                <div className="grid grid-cols-5 gap-1 text-center">
                  <div><p className="text-[7px] font-bold text-purple-400 uppercase">Anki</p><p className="text-xs font-black text-white">{sumaTotalAnkiHoras.toFixed(1)}h</p></div>
                  <div><p className="text-[7px] font-bold text-blue-400 uppercase">Fra</p><p className="text-xs font-black text-white">{sumaTotalAnkiFrases}</p></div>
                  <div><p className="text-[7px] font-bold text-cyan-400 uppercase">Prep</p><p className="text-xs font-black text-white">{sumaTotalPreplyHoras.toFixed(1)}h</p></div>
                  <div><p className="text-[7px] font-bold text-emerald-400 uppercase">App</p><p className="text-xs font-black text-white">{sumaTotalAppHoras.toFixed(1)}h</p></div>
                  <div><p className="text-[7px] font-bold text-rose-400 uppercase">Ocio</p><p className="text-xs font-black text-white">{sumaTotalOcio.toFixed(1)}h</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. NUTRICIÓN */}
        <div className="w-full shrink-0 px-1 xl:w-auto xl:max-w-md xl:px-0">
          <div className="h-full bg-[#2b2d31] rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden relative min-h-[550px] flex flex-col">
            <div className="relative p-6 pb-2">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <p className="text-emerald-400 text-[9px] font-black uppercase tracking-widest mb-1">Nutrition</p>
                  <div className="flex items-center justify-between gap-2 bg-black/20 p-1.5 rounded-xl border border-white/5">
                    <button onClick={prevDay} disabled={currentDayIndex === 0} className="p-1.5 hover:bg-white/10 text-white"><ChevronLeft size={16} /></button>
                    <h1 className="text-sm font-black text-white tracking-tight truncate">{data?.fecha?.split(',')[0]}</h1>
                    <button onClick={nextDay} disabled={currentDayIndex === historial.length - 1} className="p-1.5 hover:bg-white/10 text-white"><ChevronRight size={16} /></button>
                  </div>
                </div>
                <div className="flex gap-2 ml-3">
                  <button onClick={restoreDefaults} className="p-2.5 bg-white/5 text-rose-400 rounded-xl"><Trash2 size={18} /></button>
                  <button onClick={addNewDay} className="p-2.5 bg-emerald-500 text-white rounded-xl"><PlusCircle size={18} /></button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 p-3 rounded-xl flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Zap size={16} className="text-orange-400" fill="currentColor" />
                  <div><p className="text-[9px] font-bold text-orange-500/80 uppercase">Calorías</p><p className="text-lg font-black text-orange-100">{totalCalorias} kcal</p></div>
                </div>
                <div className="text-center">
                  <p className="text-slate-500 text-[8px] font-bold uppercase mb-1">Peso</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateWeight(-0.1)}><Minus size={12}/></button>
                    <span className="text-xl font-black text-white">{data?.pesoActual}</span>
                    <button onClick={() => updateWeight(0.1)}><Plus size={12}/></button>
                  </div>
                </div>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Agua</p>
                    <p className="text-xs font-bold text-blue-200">{data?.vasosAgua || 0}/8</p>
                  </div>
                  <div className="flex justify-between gap-1">
                    {[...Array(8)].map((_, i) => (
                      <button key={i} onClick={() => setWater(i + 1)} className={`flex-1 aspect-square rounded-lg flex items-center justify-center ${i < (data?.vasosAgua || 0) ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-600'}`}>
                        <Droplets size={14} fill={i < (data?.vasosAgua || 0) ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border flex items-center justify-between ${data?.tomadaTiroides ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
                  <div className="flex items-center gap-3">
                    <button onClick={togglePill} className={`w-10 h-10 rounded-xl flex items-center justify-center ${data?.tomadaTiroides ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-500'}`}><Pill size={20} /></button>
                    <div><p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Tiroides</p><p className={`text-xs font-bold ${data?.tomadaTiroides ? 'text-emerald-400' : 'text-rose-400'}`}>{data?.tomadaTiroides ? 'Tomada' : 'Pendiente'}</p></div>
                  </div>
                  <div className="flex gap-1">
                    {historial.slice(-7).map((d, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${d.tomadaTiroides ? 'bg-emerald-500' : 'bg-white/10'}`} />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {(data?.comidas || []).map((item, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center">{ICON_MAP[item.icon]}</div>
                      <div className="flex-1"><p className="text-xs text-slate-100 font-bold">{item.menu}</p><p className="text-[9px] text-slate-500">{item.tipo} • {item.hora}</p></div>
                      <p className="text-xs font-black text-orange-400">{item.cal}k</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. PROGRESO */}
        <div className="w-full shrink-0 px-1 xl:w-auto xl:max-w-sm xl:px-0">
          <div className="h-full bg-[#2b2d31] rounded-[2rem] shadow-2xl border border-white/10 p-6 flex flex-col items-center relative overflow-hidden min-h-[550px]">
            <h2 className="text-emerald-400 text-[9px] font-black uppercase tracking-widest mb-6">Progreso Meta</h2>
            <div className="relative flex items-center justify-center mb-4">
              <svg height={radius * 2} width={radius * 2} className="-rotate-90">
                <circle stroke="rgba(255,255,255,0.05)" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
                <circle stroke="url(#gradient)" fill="transparent" strokeWidth={stroke} strokeDasharray={circumference + ' ' + circumference} style={{ strokeDashoffset }} strokeLinecap="round" r={normalizedRadius} cx={radius} cy={radius} />
                <defs><linearGradient id="gradient"><stop offset="0%" stopColor="#059669" /><stop offset="100%" stopColor="#2dd4bf" /></linearGradient></defs>
              </svg>
              <div className="absolute text-3xl font-black text-emerald-400">{animatedProgress.toFixed(0)}%</div>
            </div>
            <div className="w-full space-y-2 text-center">
              <div className="bg-black/30 p-3 rounded-xl border border-white/5 flex justify-between items-center"><p className="text-[9px] font-bold text-slate-500 uppercase">Inicio: {puntoPartida}kg</p><Scale size={16} className="text-slate-400" /></div>
              <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 flex justify-between items-center text-left">
                <div><p className="text-[9px] font-bold text-emerald-500 uppercase">Faltan</p><p className="text-xl font-black text-emerald-400">{(data?.pesoActual - data?.pesoMeta || 0).toFixed(1)} kg</p></div>
                <TrendingDown size={18} className="text-emerald-400" />
              </div>
            </div>
            {renderLineChart()}
          </div>
        </div>
      </div>

      <div className="flex xl:hidden gap-3 mt-6 mb-2 relative z-50">
        {[
          { icon: <Brain size={18} />, color: 'bg-purple-500' },
          { icon: <Utensils size={18} />, color: 'bg-emerald-500' },
          { icon: <Target size={18} />, color: 'bg-teal-500' }
        ].map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeTab === i ? `${tab.color} text-white shadow-lg scale-110` : 'bg-white/5 text-slate-500'}`}
          >
            {tab.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
