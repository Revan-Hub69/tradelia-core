'use client';

import { ReactNode } from 'react';
import { useInView } from '@/hooks/useAnimations';
import { Section, Container, Card, Button } from '@/components/UI';
import { CheckIcon, TargetIcon, AlertIcon, LightbulbIcon, RocketIcon, ClockIcon, LockIcon, BarChartIcon, ShieldIcon, FileTextIcon } from '@/components/Icons';
import { errorPatterns, evidenceData, dashboardFeatures } from '@/lib/data';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  subtitleBold: string;
}

export const HeroSection = ({ title, subtitle, subtitleBold }: HeroSectionProps) => {
  const { ref, isInView } = useInView();

  return (
    <Section className="py-24 lg:py-32 bg-white">
      <Container size="md" center>
        <div ref={ref} className={`transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-6xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
            {title}
          </h1>
          <p className="text-2xl lg:text-3xl text-gray-800 mb-6 font-medium leading-tight">
            {subtitle}<br />
            <span className="text-gray-900 font-bold">{subtitleBold}</span>
          </p>
          
          <Card className="text-left max-w-2xl mx-auto mb-12">
            <p className="text-xl text-gray-800 mb-6 leading-relaxed">
              In <strong className="text-gray-900">pochi click</strong> configura il tuo profilo
              e ottieni una <strong className="text-gray-900">dashboard personalizzata</strong> per evitare errori crypto.
            </p>
            <div className="space-y-3 text-gray-700">
              {['Nessuna promessa di guadagno', 'Nessun segnale di trading', 'Nessuna pressione ad agire'].map((item, i) => (
                <p key={i} className="flex items-center gap-3">
                  <CheckIcon className="w-5 h-5 text-green-600" />
                  {item}
                </p>
              ))}
            </div>
          </Card>
          
          <div className="space-y-4 mb-8">
            <Button href="/dashboard" size="md">
              <TargetIcon className="w-6 h-6" />
              Accedi alla Dashboard
            </Button>
            <p className="text-sm text-gray-500 flex items-center justify-center gap-4">
              {[
                { icon: ClockIcon, text: 'Configurazione rapida' },
                { icon: LockIcon, text: 'Nessuna registrazione' },
                { icon: BarChartIcon, text: 'Analisi obiettiva' }
              ].map((item, i) => (
                <span key={i} className="flex items-center gap-1">
                  <item.icon className="w-4 h-4" />
                  {item.text}
                </span>
              ))}
            </p>
          </div>
          
          <Card variant="success" className="max-w-2xl mx-auto">
            <p className="text-blue-900 font-medium">
              <span className="font-bold">Metodologia verificabile:</span> Basato su ricerche di Kahneman, Tversky, 
              Barber & Odean e report regolatori ESMA, SEC, FCA
            </p>
          </Card>
        </div>
      </Container>
    </Section>
  );
};

export const ProblemSection = () => {
  const { ref, isInView } = useInView();

  return (
    <Section className="bg-gray-900 text-white">
      <Container>
        <div ref={ref} className={`transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-8">
              Il problema non è il mercato<br />
              <span className="text-red-400">È partire senza un criterio</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              La maggior parte delle perdite nel mondo crypto non nasce da previsioni sbagliate,
              ma da <strong className="text-white">errori iniziali ripetuti</strong>:
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {errorPatterns.map((error, index) => (
              <div 
                key={index} 
                className={`bg-red-900/30 border border-red-700/50 rounded-xl p-6 hover:bg-red-900/40 transition-all duration-300 ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-3">
                  <AlertIcon className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <p className="text-white font-medium leading-relaxed">{error}</p>
                </div>
              </div>
            ))}
          </div>
          
          <Card className="text-center bg-gray-800 border-gray-700">
            <p className="text-2xl font-bold mb-4 text-white">
              Questi errori non sono individuali.<br />
              <span className="text-yellow-400">Sono pattern documentati.</span>
            </p>
            <p className="text-gray-300">
              Studiati da decenni in finanza comportamentale e confermati dai regolatori
            </p>
          </Card>
        </div>
      </Container>
    </Section>
  );
};

export const EvidenceSection = () => {
  const { ref, isInView } = useInView();

  return (
    <Section className="bg-white">
      <Container size="xl">
        <div ref={ref}>
          <div className="text-center mb-16">
            <h2 className={`text-4xl lg:text-5xl font-bold text-gray-900 mb-8 transition-all duration-1000 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              Errori tipici documentati
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto">
              Gli errori più comuni non dipendono dall'esperienza dell'utente,
              ma da <strong>bias cognitivi</strong> e <strong>mismatch obiettivo–strumento</strong> ampiamente studiati.
            </p>
          </div>
          
          {/* Mobile Cards */}
          <div className="lg:hidden space-y-6">
            {evidenceData.map((row, index) => (
              <Card 
                key={index}
                className={`hover:shadow-md transition-all duration-300 ${
                  isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex items-start gap-4 mb-3">
                  <row.icon className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
                  <h3 className="font-bold text-gray-900 text-lg">{row.error}</h3>
                </div>
                <p className="text-gray-700 pl-10">
                  <strong>Fonte:</strong> {row.evidence}
                </p>
              </Card>
            ))}
          </div>

          {/* Desktop Table */}
          <div className={`hidden lg:block transition-all duration-1000 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <Card className="overflow-hidden shadow-sm">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-8 font-bold text-gray-900 text-xl w-1/2">Errore tipico</th>
                    <th className="text-left p-8 font-bold text-gray-900 text-xl w-1/2">Evidenza accademica</th>
                  </tr>
                </thead>
                <tbody>
                  {evidenceData.map((row, index) => (
                    <tr key={index} className="border-t-2 border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-8 font-semibold text-gray-900 text-lg">
                        <div className="flex items-center gap-3">
                          <row.icon className="w-5 h-5 text-gray-600" />
                          {row.error}
                        </div>
                      </td>
                      <td className="p-8 text-gray-700 text-lg">{row.evidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
          
          <Card variant="success" className="mt-8">
            <div className="flex items-center justify-center gap-3">
              <LightbulbIcon className="w-6 h-6 text-blue-600" />
              <p className="text-blue-900 font-bold text-xl text-center">
                Questi non sono errori casuali. Sono comportamenti ricorrenti osservati nel tempo.
              </p>
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
};

export const CTASection = () => {
  const { ref, isInView } = useInView();

  return (
    <Section className="bg-gray-900 text-white">
      <Container size="md" center>
        <div ref={ref} className={`transition-all duration-1000 ${isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <h2 className="text-5xl lg:text-6xl font-bold mb-8 flex items-center justify-center gap-4">
            <RocketIcon className="w-12 h-12" />
            Dashboard Anti-Errori
          </h2>
          
          <div className="mb-8">
            <Button href="/dashboard" variant="secondary" size="lg">
              <ClockIcon className="w-6 h-6" />
              Accedi alla Dashboard Anti-Errori
            </Button>
          </div>
          
          <div className="space-y-2">
            <p className="text-gray-400 text-lg flex items-center justify-center gap-6">
              {[
                { icon: LockIcon, text: 'Nessuna email' },
                { icon: ShieldIcon, text: 'Nessuna operazione' },
                { icon: TargetIcon, text: 'Solo chiarezza decisionale' }
              ].map((item, i) => (
                <span key={i} className="flex items-center gap-2">
                  <item.icon className="w-5 h-5" />
                  {item.text}
                </span>
              ))}
            </p>
            <p className="text-gray-500 text-sm">
              Completamente gratuito · Basato su evidenze accademiche
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
};