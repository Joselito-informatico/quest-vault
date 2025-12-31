import { useState } from 'react';
import { useCharacterStore } from '@/features/character-creator/store/characterStore';
import { StatRoller } from '@/features/character-creator/components/StatRoller';
import { RaceSelector } from '@/features/character-creator/components/RaceSelector';
import { ClassSelector } from '@/features/character-creator/components/ClassSelector';
import { BackgroundSelector } from '@/features/character-creator/components/BackgroundSelector';
import { CharacterSummary } from '@/features/character-creator/components/CharacterSummary';
import { Dashboard } from '@/features/dashboard/Dashboard';
import { CharacterSheet } from '@/features/character-sheet/CharacterSheet'; // <--- IMPORT NUEVO
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronLeft, Home } from 'lucide-react';

// Tipos de vista ampliados
type ViewState = 'dashboard' | 'creator' | 'sheet';

function App() {
  const [view, setView] = useState<ViewState>('dashboard');
  const [selectedCharId, setSelectedCharId] = useState<number | null>(null);

  // Lógica del Creador
  const { currentStep, character } = useCharacterStore();
  const setStep = useCharacterStore.setState;

  // --- LÓGICA DE NAVEGACIÓN ---
  
  const goToCreator = () => {
    setView('creator');
    setSelectedCharId(null);
  };

  const goToDashboard = () => {
    setView('dashboard');
    setSelectedCharId(null);
  };

  const goToSheet = (id: number) => {
    setSelectedCharId(id);
    setView('sheet');
  };

  // --- RENDERIZADO CONDICIONAL ---

  // 1. MODO HOJA DE PERSONAJE (JUEGO)
  if (view === 'sheet' && selectedCharId) {
    return <CharacterSheet characterId={selectedCharId} onBack={goToDashboard} />;
  }

  // 2. MODO DASHBOARD (HOME)
  // Necesitamos actualizar Dashboard para aceptar onSelectCharacter
  if (view === 'dashboard') {
    return (
      <Dashboard 
        onCreateNew={goToCreator} 
        // @ts-expect-error - Vamos a arreglar Dashboard en el siguiente paso para aceptar esta prop
        onSelectCharacter={goToSheet} 
      />
    );
  }

  // 3. MODO CREADOR (WIZARD) - El resto del código que ya tenías...
  const STEPS = [
    { title: "Especie", component: <RaceSelector /> },
    { title: "Trasfondo", component: <BackgroundSelector /> },
    { title: "Clase", component: <ClassSelector /> },
    { title: "Atributos", component: <StatRoller /> },
    { title: "Resumen", component: <CharacterSummary /> },
  ];

  const safeIndex = (currentStep >= 0 && currentStep < STEPS.length) ? currentStep : 0;
  const activeStep = STEPS[safeIndex];

  const canAdvance = () => {
    if (safeIndex === 0) return !!character.raceId;
    if (safeIndex === 1) return !!character.backgroundId;
    if (safeIndex === 2) return !!character.classId;
    return true;
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30">
      {/* Navbar Wizard */}
      <header className="border-b border-border p-4 bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button 
              onClick={goToDashboard}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              title="Cancelar y Volver al Inicio"
            >
               <Home className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </button>
            <h1 className="font-bold tracking-tight hidden sm:block">Nuevo Personaje</h1>
          </div>
          
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

      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 animate-in fade-in zoom-in-95 duration-300">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-foreground mb-2 tracking-tight">
            {activeStep.title}
          </h2>
        </div>
        {activeStep.component}
      </main>

      <footer className="border-t border-border p-4 bg-card mt-auto pb-8 md:pb-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => setStep({ currentStep: Math.max(0, safeIndex - 1) })}
            disabled={safeIndex === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
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
            Siguiente <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;