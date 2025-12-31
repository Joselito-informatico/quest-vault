import { StatRoller } from './features/character-creator/components/StatRoller';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar simulado */}
      <header className="border-b border-border p-4 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary tracking-tight">QuestVault</h1>
          <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">
            Character Creator v0.1
          </span>
        </div>
      </header>

      {/* Área Principal */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 space-y-8">
        
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-3xl font-bold">Asigna tus Atributos</h2>
          <p className="text-muted-foreground">
            Define las capacidades físicas y mentales de tu personaje. 
            El modificador (número grande) es lo que sumarás a tus tiradas.
          </p>
        </div>

        {/* Aquí vive nuestro componente */}
        <StatRoller />

      </main>
    </div>
  )
}

export default App;