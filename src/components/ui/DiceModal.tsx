import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { rollCheck, type RollResult } from '@/utils/dice';
import { cn } from '@/lib/utils';
import { X, Dices } from 'lucide-react';

interface DiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  modifier: number;
}

export const DiceModal = ({ isOpen, onClose, title, modifier }: DiceModalProps) => {
  const [result, setResult] = useState<RollResult | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [displayNumber, setDisplayNumber] = useState(1); // Para la animación

  // Efecto de rodar al abrir
  useEffect(() => {
    if (isOpen) {
      roll();
    } else {
      // Resetear al cerrar
      setTimeout(() => setResult(null), 300);
    }
  }, [isOpen]);

  const roll = () => {
    setIsRolling(true);
    setResult(null);

    // Animación "Casino": cambiar números rápido
    const interval = setInterval(() => {
      setDisplayNumber(Math.floor(Math.random() * 20) + 1);
    }, 50);

    // Detener animación y mostrar resultado real tras 600ms
    setTimeout(() => {
      clearInterval(interval);
      const finalResult = rollCheck(modifier);
      setResult(finalResult);
      setDisplayNumber(finalResult.rolls[0]); // Mostrar el dado natural
      setIsRolling(false);
    }, 600);
  };

  if (!isOpen) return null;

  // Usamos Portal para que salga por encima de todo (z-index seguro)
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Click fuera para cerrar */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl p-6 animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Dices className="w-5 h-5" />
            {title}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Área del Dado */}
        <div className="flex flex-col items-center gap-4 mb-8">
          {/* El D20 Visual */}
          <div className={cn(
            "w-32 h-32 flex items-center justify-center relative transition-all duration-300",
             isRolling && "animate-pulse scale-110",
             !isRolling && result?.isCritical && "text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]",
             !isRolling && result?.isFumble && "text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]"
          )}>
            {/* Hexágono CSS simple para simular d20 */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full fill-current opacity-10">
              <polygon points="50 0, 95 25, 95 75, 50 100, 5 75, 5 25" />
            </svg>
            
            <span className="text-6xl font-black tabular-nums relative z-10">
              {displayNumber}
            </span>
          </div>

          {/* Resultado Final (Matemática) */}
          {!isRolling && result && (
            <div className="text-center space-y-1 animate-in slide-in-from-bottom-2">
              <div className="text-sm text-muted-foreground font-mono">
                {result.rolls[0]} (d20) {modifier >= 0 ? '+' : ''} {modifier} (mod)
              </div>
              <div className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-foreground">
                = {result.total}
              </div>
              
              {result.isCritical && <div className="text-yellow-500 font-bold uppercase tracking-widest text-sm mt-2">¡Crítico!</div>}
              {result.isFumble && <div className="text-red-500 font-bold uppercase tracking-widest text-sm mt-2">¡Pifia!</div>}
            </div>
          )}
        </div>

        {/* Botón Re-Roll */}
        <button 
          onClick={roll}
          disabled={isRolling}
          className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl active:scale-95 transition-transform disabled:opacity-50"
        >
          {isRolling ? 'Rodando...' : 'Lanzar de Nuevo'}
        </button>

      </div>
    </div>,
    document.body
  );
};