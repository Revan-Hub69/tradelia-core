import { FearGreedEducational } from '@/components/indicators/fear-greed-educational'

export default function FearGreedEducationalTestPage() {
  // Test con valore di paura estrema
  const testValue = 24
  const testClassification = "extreme_fear"

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Indice Paura & Avidità - Analisi Educativa</h1>
        <p className="text-muted-foreground">
          Approccio Tradelia: educativo, trasparente, senza promesse
        </p>
      </div>
      
      <FearGreedEducational 
        value={testValue} 
        classification={testClassification} 
      />
    </div>
  )
}