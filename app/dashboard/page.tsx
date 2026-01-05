'use client';

import { useState } from 'react';
import { AlertIcon, CheckIcon, TrendingIcon, ShieldIcon, TargetIcon } from '@/components/Icons';

export default function Dashboard() {
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [timeHorizon, setTimeHorizon] = useState<'short' | 'medium' | 'long'>('medium');
  const [experience, setExperience] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  const getRecommendations = () => {
    const isHighRisk = riskLevel === 'high' && timeHorizon === 'short';
    const isLeverageRisk = experience === 'beginner' && riskLevel === 'high';
    
    return {
      suitable: [
        'Spot trading (compra/vendi diretto)',
        'DCA (Dollar Cost Averaging)',
        'Staking su asset consolidati'
      ],
      avoid: [
        isLeverageRisk ? 'Leva finanziaria (alto rischio per principianti)' : null,
        isHighRisk ? 'Futures a breve termine' : null,
        'Segnali di trading non verificabili',
        'Bot automatici senza controllo'
      ].filter(Boolean),
      warnings: [
        isLeverageRisk ? 'La leva amplifica sia guadagni che perdite' : null,
        timeHorizon === 'short' ? 'Investimenti a breve termine = maggiore volatilità' : null,
        'Mai investire più di quanto puoi permetterti di perdere'
      ].filter(Boolean)
    };
  };

  const recommendations = getRecommendations();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard Anti-Errori Crypto</h1>
          <p className="text-xl text-gray-700">Configura il tuo profilo per ricevere raccomandazioni personalizzate</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <TargetIcon className="w-6 h-6" />
              Il tuo profilo
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Tolleranza al rischio</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['low', 'medium', 'high'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setRiskLevel(level)}
                      className={`p-3 rounded-lg border-2 font-medium transition-colors ${
                        riskLevel === level
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {level === 'low' ? 'Basso' : level === 'medium' ? 'Medio' : 'Alto'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Orizzonte temporale</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['short', 'medium', 'long'] as const).map((horizon) => (
                    <button
                      key={horizon}
                      onClick={() => setTimeHorizon(horizon)}
                      className={`p-3 rounded-lg border-2 font-medium transition-colors ${
                        timeHorizon === horizon
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {horizon === 'short' ? '< 6 mesi' : horizon === 'medium' ? '6m - 2 anni' : '> 2 anni'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Esperienza crypto</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['beginner', 'intermediate', 'advanced'] as const).map((exp) => (
                    <button
                      key={exp}
                      onClick={() => setExperience(exp)}
                      className={`p-3 rounded-lg border-2 font-medium transition-colors ${
                        experience === exp
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {exp === 'beginner' ? 'Principiante' : exp === 'intermediate' ? 'Intermedio' : 'Avanzato'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations Panel */}
          <div className="space-y-6">
            {/* Suitable Tools */}
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-3">
                <CheckIcon className="w-6 h-6" />
                Strumenti adatti al tuo profilo
              </h3>
              <ul className="space-y-2">
                {recommendations.suitable.map((tool, index) => (
                  <li key={index} className="flex items-center gap-3 text-green-800">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    {tool}
                  </li>
                ))}
              </ul>
            </div>

            {/* Avoid */}
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-3">
                <AlertIcon className="w-6 h-6" />
                Da evitare nel tuo caso
              </h3>
              <ul className="space-y-2">
                {recommendations.avoid.map((tool, index) => (
                  <li key={index} className="flex items-center gap-3 text-red-800">
                    <AlertIcon className="w-4 h-4 text-red-600" />
                    {tool}
                  </li>
                ))}
              </ul>
            </div>

            {/* Warnings */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-3">
                <ShieldIcon className="w-6 h-6" />
                Regole anti-errore
              </h3>
              <ul className="space-y-2">
                {recommendations.warnings.map((warning, index) => (
                  <li key={index} className="flex items-center gap-3 text-amber-800">
                    <ShieldIcon className="w-4 h-4 text-amber-600" />
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Risk Meter */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <TrendingIcon className="w-6 h-6" />
            Livello di rischio attuale
          </h3>
          
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full transition-all duration-500 ${
                  riskLevel === 'low' ? 'w-1/3 bg-green-500' :
                  riskLevel === 'medium' ? 'w-2/3 bg-yellow-500' :
                  'w-full bg-red-500'
                }`}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Basso</span>
              <span>Medio</span>
              <span>Alto</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-gray-700">
              <strong>Raccomandazione:</strong> {
                riskLevel === 'low' ? 'Mantieni un approccio conservativo con asset consolidati.' :
                riskLevel === 'medium' ? 'Bilancia tra sicurezza e opportunità di crescita.' :
                'Attenzione: alto rischio richiede esperienza e capitale che puoi permetterti di perdere.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}