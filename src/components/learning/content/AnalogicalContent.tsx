// Professional Analogical Content - Zero Emoji, Cognitive Design
// Follows Tradelia Design System v1.1 and cognitive load principles

import { RepresentationData } from '@/types/multipleRepresentations';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowRight, AlertTriangle, Lightbulb } from 'lucide-react';
import { cn } from '@/utils/Helpers';

interface AnalogicalContentProps {
  data: RepresentationData;
  className?: string;
}

export const AnalogicalContent: React.FC<AnalogicalContentProps> = ({ 
  data, 
  className 
}) => {
  const { metaphor } = data.content;

  if (!metaphor) {
    return (
      <div className={cn('p-6', className)}>
        <p className="text-muted-foreground">Contenuto analogico non disponibile.</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      
      {/* Core Metaphor - Primary Focus */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
              <Lightbulb className="size-5 text-primary" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {metaphor.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                Comprensione intuitiva attraverso analogia
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-base leading-relaxed text-foreground">
            {metaphor.description}
          </p>
        </CardContent>
      </Card>

      {/* Mapping Section - Clear Correspondence */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <h4 className="text-base font-semibold text-foreground">
            Corrispondenze Concettuali
          </h4>
          <p className="text-sm text-muted-foreground">
            Come i concetti familiari si mappano alla realtà tecnica
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {metaphor.mapping.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/50"
              >
                <div className="flex-1">
                  <span className="text-sm font-medium text-foreground">
                    {item.from}
                  </span>
                </div>
                <ArrowRight className="size-4 text-muted-foreground flex-shrink-0" strokeWidth={2} />
                <div className="flex-1">
                  <span className="text-sm text-muted-foreground">
                    {item.to}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Limitations - Critical Academic Honesty */}
      <Alert className="border-warning/30 bg-warning/10">
        <AlertTriangle className="size-5 text-warning" strokeWidth={2} />
        <AlertDescription>
          <h4 className="text-base font-semibold text-warning mb-3">
            Limitazioni dell'Analogia
          </h4>
          <div className="space-y-2">
            {metaphor.limitations.map((limitation, index) => (
              <p key={index} className="text-sm leading-relaxed text-warning/90">
                {limitation}
              </p>
            ))}
          </div>
          <p className="text-xs text-warning/80 mt-3 font-medium">
            Ricorda: le analogie aiutano la comprensione iniziale ma non sostituiscono la conoscenza tecnica precisa.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
};