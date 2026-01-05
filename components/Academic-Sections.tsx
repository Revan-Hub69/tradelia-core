'use client';

import { 
  AcademicSection, 
  AcademicCard, 
  AcademicButton, 
  Citation, 
  MethodologyBox, 
  AcademicList, 
  BibliographyEntry, 
  ResearchFinding, 
  ProcessStep 
} from '@/components/Academic-Components';
import { academicContent } from '@/lib/academic-content';

// Abstract Section - Scientific Paper Style
export const AbstractSection = () => {
  const content = academicContent.it.abstract;
  
  return (
    <AcademicSection className="border-b border-border">
      <div className="max-w-3xl">
        <h1 className="text-title mb-8">
          Framework di Verifica della Coerenza tra Obiettivi di Investimento e Strumenti Finanziari
        </h1>
        
        <div className="mb-8">
          <h2 className="text-subsection mb-4">{content.title}</h2>
          <div className="text-body text-justify-academic">
            {content.content}
          </div>
        </div>
        
        <div className="text-caption text-muted-foreground">
          <strong>Parole chiave:</strong> finanza comportamentale, verifica coerenza, trading retail, bias cognitivi, strumenti finanziari
        </div>
      </div>
    </AcademicSection>
  );
};

// Introduction Section - Academic Context
export const IntroductionSection = () => {
  const content = academicContent.it.introduction;
  
  return (
    <AcademicSection>
      <div className="max-w-3xl">
        <h2 className="text-section mb-6">{content.title}</h2>
        
        <h3 className="text-subsection mb-4">{content.subtitle}</h3>
        
        <div className="space-y-4 mb-8">
          {content.content.map((paragraph, index) => (
            <div key={index} className="text-body text-justify-academic">
              {paragraph}
            </div>
          ))}
        </div>
        
        <Citation 
          author="Barber & Odean" 
          year="2000" 
          source="Journal of Finance, 55(2), 773-806"
        >
          {content.citation}
        </Citation>
      </div>
    </AcademicSection>
  );
};

// Methodology Section - Scientific Rigor
export const MethodologySection = () => {
  const content = academicContent.it.methodology;
  
  return (
    <AcademicSection className="bg-muted/20">
      <div className="max-w-3xl">
        <h2 className="text-section mb-6">{content.title}</h2>
        
        <h3 className="text-subsection mb-4">{content.subtitle}</h3>
        
        <div className="text-body text-justify-academic mb-6">
          {content.content[0]}
        </div>
        
        <AcademicList items={content.content.slice(1)} className="mb-8" />
        
        <MethodologyBox title={content.process.title}>
          <div className="space-y-4">
            {content.process.steps.map((step, index) => (
              <ProcessStep
                key={index}
                number={(index + 1).toString()}
                phase={step.phase}
                description={step.description}
              />
            ))}
          </div>
        </MethodologyBox>
      </div>
    </AcademicSection>
  );
};

// Results Section - Research Findings
export const ResultsSection = () => {
  const content = academicContent.it.results;
  
  return (
    <AcademicSection>
      <div className="max-w-4xl">
        <h2 className="text-section mb-6">{content.title}</h2>
        
        <h3 className="text-subsection mb-8">{content.subtitle}</h3>
        
        <div className="space-y-6">
          {content.examples.map((example, index) => (
            <ResearchFinding
              key={index}
              category={example.category}
              scenario={example.scenario}
              instrument={example.instrument}
              issue={example.issue}
              reference={example.reference}
            />
          ))}
        </div>
        
        <div className="mt-8 p-4 border border-border bg-muted/10">
          <div className="text-caption mb-2 font-medium">Nota Metodologica</div>
          <div className="text-body-sm text-muted-foreground">
            Gli esempi riportati sono basati su pattern documentati nella letteratura accademica peer-reviewed. 
            Ogni situazione individuale richiede analisi specifica e non può essere generalizzata.
          </div>
        </div>
      </div>
    </AcademicSection>
  );
};

// Limitations Section - Academic Honesty
export const LimitationsSection = () => {
  const content = academicContent.it.limitations;
  
  return (
    <AcademicSection className="bg-muted/20">
      <div className="max-w-3xl">
        <h2 className="text-section mb-6">{content.title}</h2>
        
        <h3 className="text-subsection mb-4">{content.subtitle}</h3>
        
        <div className="text-body text-justify-academic mb-4">
          {content.content[0]}
        </div>
        
        <AcademicList items={content.content.slice(1)} className="mb-8" />
        
        <AcademicCard className="bg-background border-l-4 border-l-primary">
          <div className="text-heading mb-2">Disclaimer</div>
          <div className="text-body-sm text-muted-foreground">
            {content.disclaimer}
          </div>
        </AcademicCard>
      </div>
    </AcademicSection>
  );
};

// Bibliography Section - Academic References
export const BibliographySection = () => {
  const content = academicContent.it.bibliography;
  
  return (
    <AcademicSection>
      <div className="max-w-3xl">
        <h2 className="text-section mb-8">{content.title}</h2>
        
        <div className="space-y-4">
          {content.references.map((ref, index) => (
            <BibliographyEntry
              key={index}
              authors={ref.authors}
              year={ref.year}
              title={ref.title}
              journal={'journal' in ref ? ref.journal : undefined}
              publisher={'publisher' in ref ? ref.publisher : undefined}
              volume={'volume' in ref ? ref.volume : undefined}
              pages={'pages' in ref ? ref.pages : undefined}
              doi={'doi' in ref ? ref.doi : undefined}
              isbn={'isbn' in ref ? ref.isbn : undefined}
            />
          ))}
        </div>
      </div>
    </AcademicSection>
  );
};

// Verification Access Section - Academic CTA
export const VerificationSection = () => {
  const content = academicContent.it.verification;
  
  return (
    <AcademicSection className="border-t border-border">
      <div className="max-w-2xl text-center">
        <h2 className="text-section mb-6">{content.title}</h2>
        
        <div className="text-body text-justify-academic mb-8">
          {content.description}
        </div>
        
        <AcademicButton href="/dashboard" className="mb-4">
          {content.action}
        </AcademicButton>
        
        <div className="text-caption text-muted-foreground">
          {content.note}
        </div>
      </div>
    </AcademicSection>
  );
};