function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary tracking-tight">
          QuestVault
        </h1>
        <p className="text-muted-foreground">
          System Online. Ready to roll.
        </p>
        <div className="p-4 bg-card border border-border rounded-lg shadow-sm">
          <span className="text-sm font-mono text-accent-foreground">
            v0.1.0 - Protocolo SRD 5.2 Activo
          </span>
        </div>
      </div>
    </div>
  )
}

export default App