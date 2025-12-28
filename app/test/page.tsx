import { FearGreedSimpleTest } from '@/components/test/fear-greed-simple-test'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Tradelia - Test Step by Step</h1>
          <p className="text-muted-foreground">
            Test Fear & Greed Index API (senza database)
          </p>
        </div>
        
        <FearGreedSimpleTest />
      </div>
    </div>
  )
}