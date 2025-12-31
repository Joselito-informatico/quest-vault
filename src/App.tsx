import { useCharacterStore } from '@/features/character-creator/store/characterStore';
import { StatRoller } from '@/features/character-creator/components/StatRoller';
import { RaceSelector } from '@/features/character-creator/components/RaceSelector';
import { ClassSelector } from '@/features/character-creator/components/ClassSelector';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronLeft, Terminal } from 'lucide-react';
import { useEffect } from 'react';

function App() {
  const { currentStep, character } = useCharacterStore();
  
  // Hack temporal para navegación (luego moveremos esto al store)
  const setStep = useCharacterStore.setState; 

  const STEPS = [
    { title: "Especie", component: <RaceSelector /> },
    { title: "Clase", component: <ClassSelector /> }, // <--- Nuevo paso insertado
    { title: "Atributos", component: <StatRoller /> },
  ];

  // --- SAFETY GUARD ---
  // Si el store tiene basura (ej: paso 5) y solo tenemos 2 pasos, forzamos el 0.
  // Esto evita el crash de "undefined reading title".
  const safeIndex = (currentStep >= 0 && currentStep < STEPS.length) ? currentStep : 0;
  const activeStep = STEPS[safeIndex];

  // Efecto de autoreparación: Si detectamos inconsistencia, corregimos el store silenciosamente
  useEffect(() => {
    if (currentStep !== safeIndex) {
      console.warn(`Indice de paso inválido (${currentStep}). Reseteando a ${safeIndex}.`);
      setStep({ currentStep: safeIndex });
    }
  }, [currentStep, safeIndex, setStep]);

  // Validación para avanzar
  const canAdvance = () => {
    if (safeIndex === 0) return !!character.raceId;  // Requiere Raza
    if (safeIndex === 1) return !!character.classId; // Requiere Clase (Nuevo)
    return true; // Stats siempre ok
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30">
      {/* Navbar */}
      <header className="border-b border-border p-4 bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center font-bold text-black shadow-lg shadow-primary/20">
              <Terminal className="w-5 h-5" />
            </div>
            <h1 className="font-bold tracking-tight hidden sm:block">QuestVault</h1>
          </div>
          
          {/* Step Indicator */}
          <div className="flex gap-2">
            {STEPS.map((_, idx) => (
              <div 
                key={idx}
                className={cn(
                  "h-1.5 w-8 rounded-full transition-all duration-300",
                  idx === safeIndex ? "bg-primary w-12" : idx < safeIndex ? "bg-primary/50" : "bg-secondary"
                )} 
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 animate-in fade-in zoom-in-95 duration-300">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-foreground mb-2 tracking-tight">
            {activeStep.title}
          </h2>
          <p className="text-muted-foreground text-lg">
            {safeIndex === 0 && "Elige tu linaje. En D&D 5.2, esto define tus rasgos innatos como visión y resistencias."}
            {safeIndex === 1 && "Distribuye tus 27 puntos para definir tus capacidades físicas y mentales."}
          </p>
        </div>

        {activeStep.component}
      </main>

      {/* Footer Navigation */}
      <footer className="border-t border-border p-4 bg-card mt-auto pb-8 md:pb-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => setStep({ currentStep: Math.max(0, safeIndex - 1) })}
            disabled={safeIndex === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Atrás
          </button>

          <button 
            onClick={() => setStep({ currentStep: Math.min(STEPS.length - 1, safeIndex + 1) })}
            disabled={!canAdvance() || safeIndex === STEPS.length - 1}
            className={cn(
              "flex items-center gap-2 px-8 py-3 rounded-lg font-bold transition-all shadow-lg",
              !canAdvance() || safeIndex === STEPS.length - 1
                ? "bg-secondary text-muted-foreground cursor-not-allowed opacity-50" 
                : "bg-primary text-primary-foreground hover:scale-105 active:scale-95 shadow-primary/20"
            )}
          >
            {safeIndex === STEPS.length - 1 ? 'Finalizar' : 'Siguiente'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  )
}

export default App;