import { FearGreedCompact } from '@/components/indicators/fear-greed-compact'

export default function FearGreedCompactTestPage() {
  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Test Componente Compatto</h1>
        <p className="text-muted-foreground">
          Versione compatta con progressive disclosure - Testa ogni fascia per verificare contenuti dinamici
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4 text-center">Paura Estrema (15)</h2>
          <FearGreedCompact value={15} classification="extreme_fear" />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4 text-center">Paura (35)</h2>
          <FearGreedCompact value={35} classification="fear" />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4 text-center">Neutrale (50)</h2>
          <FearGreedCompact value={50} classification="neutral" />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4 text-center">Avidità (65)</h2>
          <FearGreedCompact value={65} classification="greed" />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4 text-center">Avidità Estrema (85)</h2>
          <FearGreedCompact value={85} classification="extreme_greed" />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4 text-center">Avidità Max (95)</h2>
          <FearGreedCompact value={95} classification="extreme_greed" />
        </div>
      </div>
      
      <div className="mt-12 p-6 bg-muted/30 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Test Checklist:</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>Ogni fascia ha spiegazioni diverse</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>Errori comuni specifici per ogni livello</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>Uso corretto contestualizzato</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>Domande di riflessione personalizzate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>Bottone con call-to-action chiara</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>Drawer con scrollbar corretta</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>Gauge senza mini-scrollbar</span>
          </div>
        </div>
      </div>
    </div>
  )
}