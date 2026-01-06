'use client';

import { useTranslations } from '@/hooks/useTranslations';
import { ProcessIcon } from '@/components/icons/TradeliaIcons';

interface StepProps {
  step: {
    title: string;
    description: string;
  };
  index: number;
}

function Step({ step, index }: StepProps) {
  return (
    <article className="card-interactive">
      <div className="flex items-start gap-4">
        <div 
          className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5 border border-primary/20"
          aria-label={`Step ${index + 1}`}
        >
          {index + 1}
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">
            {step.title}
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {step.description}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function HowItWorksSection() {
  const { howItWorks } = useTranslations();

  return (
    <section 
      id="how-it-works"
      className="section-md fade-in-section bg-muted/30 border-b border-border/30"
      aria-labelledby="how-it-works-title"
    >
      <div className="max-w-2xl mx-auto px-6 sm:px-8">
        <header className="text-center mb-12">
          <h2 
            id="how-it-works-title"
            className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground leading-tight tracking-tight mb-4 text-center"
          >
            Come funziona <span className="font-semibold relative">
              <span className="text-muted-foreground relative">
                T
                <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-primary" />
              </span>
              <span className="text-foreground relative">
                <span className="relative">
                  r
                  <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-primary" />
                </span>
                adelia
              </span>
            </span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {howItWorks.subtitle}
          </p>
        </header>
        
        <ol className="space-y-8" role="list">
          {howItWorks.steps.map((step, index) => (
            <li key={`step-${index + 1}`} role="listitem">
              <Step step={step} index={index} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}