export default function DesignSystemShowcase() {
  return (
    <div className="min-h-screen bg-background">
      <section className="section-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20 -z-10" />
        
        <div className="container-responsive relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="animate-fade-in-up">
              <h1 className="mb-8 gradient-text">
                Tradelia Ultra Premium Design System
              </h1>
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <p className="lead mb-12 max-w-2xl mx-auto">
                Showcase di tutti i componenti e stili del design system ultra premium
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-lg">
        <div className="container-responsive">
          <div className="mb-16">
            <p className="eyebrow-premium mb-6">Typography</p>
            <h2 className="mb-8">Sistema Tipografico</h2>
          </div>
          
          <div className="card-glass p-8 sm:p-12 space-y-8">
            <div>
              <h1>Display Heading (H1)</h1>
              <p className="text-sm text-muted-foreground mt-2">text-5xl lg:text-6xl font-bold tracking-tighter</p>
            </div>
            
            <div>
              <h2>Section Heading (H2)</h2>
              <p className="text-sm text-muted-foreground mt-2">text-4xl lg:text-5xl font-semibold tracking-tight</p>
            </div>
            
            <div>
              <h3>Subsection Heading (H3)</h3>
              <p className="text-sm text-muted-foreground mt-2">text-3xl lg:text-4xl font-medium tracking-snug</p>
            </div>
            
            <div>
              <p className="lead">Lead paragraph - Testo introduttivo più grande per catturare l'attenzione del lettore.</p>
              <p className="text-sm text-muted-foreground mt-2">text-lg sm:text-xl leading-relaxed</p>
            </div>
            
            <div>
              <p>Body paragraph - Testo standard per il contenuto principale con ottima leggibilità.</p>
              <p className="text-sm text-muted-foreground mt-2">text-sm sm:text-base leading-relaxed</p>
            </div>
            
            <div>
              <p className="small">Small text - Per note, disclaimer e informazioni secondarie.</p>
              <p className="text-sm text-muted-foreground mt-2">text-xs sm:text-sm leading-normal</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-lg bg-gradient-to-br from-muted/10 to-muted/30">
        <div className="container-responsive">
          <div className="mb-16">
            <p className="eyebrow-premium mb-6">Buttons</p>
            <h2 className="mb-8">Sistema di Button</h2>
          </div>
          
          <div className="card-elevated p-8 sm:p-12">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h4 className="mb-6">Primary Buttons</h4>
                <div className="space-y-4">
                  <div>
                    <button className="btn-primary-premium">
                      Premium CTA Button
                    </button>
                    <p className="text-xs text-muted-foreground mt-2">btn-primary-premium</p>
                  </div>
                  
                  <div>
                    <button className="btn-primary">Standard Primary</button>
                    <p className="text-xs text-muted-foreground mt-2">btn-primary</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="mb-6">Secondary Buttons</h4>
                <div className="space-y-4">
                  <div>
                    <button className="btn-secondary">Secondary Button</button>
                    <p className="text-xs text-muted-foreground mt-2">btn-secondary</p>
                  </div>
                  
                  <div>
                    <button className="btn-ghost">Ghost Button</button>
                    <p className="text-xs text-muted-foreground mt-2">btn-ghost</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-lg">
        <div className="container-responsive">
          <div className="mb-16">
            <p className="eyebrow-premium mb-6">Cards</p>
            <h2 className="mb-8">Sistema di Card</h2>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="card-base p-6">
              <h4 className="mb-3">Base Card</h4>
              <p className="text-muted-foreground mb-4">Card standard con bordo e background base.</p>
              <code className="text-xs bg-muted px-2 py-1 rounded">card-base</code>
            </div>
            
            <div className="card-elevated p-6">
              <h4 className="mb-3">Elevated Card</h4>
              <p className="text-muted-foreground mb-4">Card con elevazione e ombra sottile.</p>
              <code className="text-xs bg-muted px-2 py-1 rounded">card-elevated</code>
            </div>
            
            <div className="card-premium p-6">
              <h4 className="mb-3">Premium Card</h4>
              <p className="text-muted-foreground mb-4">Card premium con gradient e ombra avanzata.</p>
              <code className="text-xs bg-muted px-2 py-1 rounded">card-premium</code>
            </div>
            
            <div className="card-glass p-6">
              <h4 className="mb-3">Glass Card</h4>
              <p className="text-muted-foreground mb-4">Card con effetto glassmorphism e backdrop blur.</p>
              <code className="text-xs bg-muted px-2 py-1 rounded">card-glass</code>
            </div>
            
            <div className="card-interactive-premium p-6">
              <h4 className="mb-3">Interactive Premium</h4>
              <p className="text-muted-foreground mb-4">Card interattiva con animazioni premium.</p>
              <code className="text-xs bg-muted px-2 py-1 rounded">card-interactive-premium</code>
            </div>
            
            <div className="card-interactive p-6">
              <h4 className="mb-3">Interactive Standard</h4>
              <p className="text-muted-foreground mb-4">Card interattiva standard con hover effects.</p>
              <code className="text-xs bg-muted px-2 py-1 rounded">card-interactive</code>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}