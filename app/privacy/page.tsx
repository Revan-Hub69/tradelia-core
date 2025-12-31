import { SectionLayout } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardContent } from "@/components/ui/design-system/unified-card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <SectionLayout className="py-20">
        <div className="mx-auto max-w-4xl">
          <header className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground">
              Informazioni sulla privacy e protezione dei dati
            </p>
          </header>

          <UnifiedCard>
            <CardContent className="p-8">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <h2>Informazioni Generali</h2>
                <p>
                  Tradelia è una piattaforma educativa per il trading di criptovalute. 
                  Questa pagina descrive come raccogliamo, utilizziamo e proteggiamo le tue informazioni.
                </p>

                <h2>Dati Raccolti</h2>
                <ul>
                  <li>Informazioni di registrazione (email, nome utente)</li>
                  <li>Preferenze utente e impostazioni</li>
                  <li>Dati di utilizzo della piattaforma</li>
                  <li>Cookie tecnici necessari al funzionamento</li>
                </ul>

                <h2>Utilizzo dei Dati</h2>
                <p>
                  I dati vengono utilizzati esclusivamente per:
                </p>
                <ul>
                  <li>Fornire i servizi educativi della piattaforma</li>
                  <li>Personalizzare l'esperienza utente</li>
                  <li>Migliorare la qualità dei contenuti</li>
                  <li>Comunicazioni relative al servizio</li>
                </ul>

                <h2>Protezione dei Dati</h2>
                <p>
                  Implementiamo misure di sicurezza appropriate per proteggere i tuoi dati 
                  personali contro accesso non autorizzato, alterazione, divulgazione o distruzione.
                </p>

                <h2>I Tuoi Diritti</h2>
                <p>
                  Hai il diritto di:
                </p>
                <ul>
                  <li>Accedere ai tuoi dati personali</li>
                  <li>Richiedere la correzione di dati inesatti</li>
                  <li>Richiedere la cancellazione dei tuoi dati</li>
                  <li>Opporti al trattamento dei tuoi dati</li>
                </ul>

                <h2>Contatti</h2>
                <p>
                  Per qualsiasi domanda relativa alla privacy, puoi contattarci attraverso 
                  i canali ufficiali della piattaforma.
                </p>

                <p className="text-sm text-muted-foreground mt-8">
                  Ultimo aggiornamento: Gennaio 2025
                </p>
              </div>
            </CardContent>
          </UnifiedCard>
        </div>
      </SectionLayout>
    </div>
  )
}