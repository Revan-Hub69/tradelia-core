import { dictionary } from '@/lib/i18n';

export default function HomePage() {
  return (
    <>
      {/* Hero Section - Ultra Premium */}
      <section className="section-xl relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20 -z-10" />
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02] -z-10" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`
        }} />
        
        <div className="container-responsive relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="animate-fade-in-up">
              <h1 className="mb-8 gradient-text">
                {dictionary.hero.title}
              </h1>
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <p className="lead mb-12 max-w-2xl mx-auto">
                {dictionary.hero.description}
              </p>
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <a href="#verifica" className="btn-primary-premium group">
                {dictionary.hero.cta}
                <svg className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contesto Section - Premium */}
      <section className="section-lg bg-gradient-to-br from-muted/20 to-muted/40 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-accent/5 to-transparent rounded-full blur-3xl" />
        
        <div className="container-responsive relative">
          <div className="animate-fade-in-up">
            <p className="eyebrow-premium mb-6 text-center">{dictionary.context.eyebrow}</p>
            <h2 className="mb-8 text-center max-w-3xl mx-auto">
              {dictionary.context.title}
            </h2>
          </div>
          
          <div className="card-glass p-8 sm:p-12 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="space-y-6">
              <p className="text-base sm:text-lg leading-relaxed">
                {dictionary.context.description1}
              </p>
              <p className="text-base sm:text-lg leading-relaxed">
                {dictionary.context.description2}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Funzionamento Section - Premium Steps */}
      <section className="section-lg">
        <div className="container-responsive">
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="eyebrow-premium mb-6">{dictionary.how.eyebrow}</p>
            <h2 className="mb-8 max-w-3xl mx-auto">
              {dictionary.how.title}
            </h2>
          </div>
          
          <div className="grid gap-8 md:gap-12 max-w-4xl mx-auto stagger-children">
            {/* Step 1 */}
            <div className="card-interactive-premium p-8 group">
              <div className="flex items-start gap-6">
                <div className="list-number-premium group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="mb-4 text-xl font-semibold">{dictionary.how.step1.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {dictionary.how.step1.description}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="card-interactive-premium p-8 group">
              <div className="flex items-start gap-6">
                <div className="list-number-premium group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="mb-4 text-xl font-semibold">{dictionary.how.step2.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {dictionary.how.step2.description}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="card-interactive-premium p-8 group">
              <div className="flex items-start gap-6">
                <div className="list-number-premium group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="mb-4 text-xl font-semibold">{dictionary.how.step3.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {dictionary.how.step3.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Esempi Section - Premium List */}
      <section className="section-lg bg-gradient-to-br from-muted/10 to-muted/30 relative">
        {/* Decorative gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-primary/5 to-transparent rounded-full blur-3xl" />
        
        <div className="container-responsive relative">
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="eyebrow-premium mb-6">{dictionary.examples.eyebrow}</p>
            <h2 className="mb-8 max-w-3xl mx-auto">
              {dictionary.examples.title}
            </h2>
          </div>
          
          <div className="card-glass p-8 sm:p-12 max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <ul className="space-y-8">
              <li className="list-item group">
                <div className="list-bullet-premium group-hover:scale-125 transition-transform duration-300" />
                <div className="flex-1">
                  <span className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    {dictionary.examples.example1}
                  </span>
                  <span className="ml-3 badge-warning">{dictionary.examples.badge}</span>
                </div>
              </li>
              <li className="list-item group">
                <div className="list-bullet-premium group-hover:scale-125 transition-transform duration-300" />
                <div className="flex-1">
                  <span className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    {dictionary.examples.example2}
                  </span>
                  <span className="ml-3 badge-warning">{dictionary.examples.badge}</span>
                </div>
              </li>
              <li className="list-item group">
                <div className="list-bullet-premium group-hover:scale-125 transition-transform duration-300" />
                <div className="flex-1">
                  <span className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    {dictionary.examples.example3}
                  </span>
                  <span className="ml-3 badge-warning">{dictionary.examples.badge}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Metodologia Section - Premium Content */}
      <section id="metodologia" className="section-lg">
        <div className="container-responsive">
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="eyebrow-premium mb-6">{dictionary.methodology.eyebrow}</p>
            <h2 className="mb-8 max-w-3xl mx-auto">
              {dictionary.methodology.title}
            </h2>
          </div>
          
          <div className="card-elevated p-8 sm:p-12 max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="space-y-8">
              <p className="text-base sm:text-lg leading-relaxed">
                {dictionary.methodology.description1}
              </p>
              <p className="text-base sm:text-lg leading-relaxed">
                {dictionary.methodology.description2}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Limiti Section - Transparency Premium */}
      <section className="section-lg bg-gradient-to-br from-muted/10 to-muted/20 relative">
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        <div className="container-responsive relative">
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="eyebrow-premium mb-6">{dictionary.limits.eyebrow}</p>
            <h2 className="mb-8 max-w-3xl mx-auto">{dictionary.limits.title}</h2>
          </div>
          
          <div className="card-glass p-8 sm:p-12 max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <ul className="space-y-6">
              <li className="list-item group">
                <div className="list-bullet-premium group-hover:scale-125 transition-transform duration-300" />
                <span className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {dictionary.limits.limit1}
                </span>
              </li>
              <li className="list-item group">
                <div className="list-bullet-premium group-hover:scale-125 transition-transform duration-300" />
                <span className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {dictionary.limits.limit2}
                </span>
              </li>
              <li className="list-item group">
                <div className="list-bullet-premium group-hover:scale-125 transition-transform duration-300" />
                <span className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {dictionary.limits.limit3}
                </span>
              </li>
              <li className="list-item group">
                <div className="list-bullet-premium group-hover:scale-125 transition-transform duration-300" />
                <span className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {dictionary.limits.limit4}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Final Section - Premium Finale */}
      <section id="verifica" className="section-2xl relative overflow-hidden">
        {/* Premium background with multiple gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/10 to-primary/5 -z-10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-primary/10 to-transparent rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-radial from-accent/10 to-transparent rounded-full blur-3xl -z-10" />
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary/30 rounded-full animate-float" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-accent/40 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-primary/20 rounded-full animate-float" style={{ animationDelay: '4s' }} />
        
        <div className="container-responsive relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="animate-fade-in-up">
              <h2 className="mb-8 gradient-text">
                {dictionary.cta.title}
              </h2>
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <p className="lead mb-12 max-w-2xl mx-auto">
                {dictionary.cta.description}
              </p>
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <a href="/verifica" className="btn-primary-premium group">
                {dictionary.cta.button}
                <svg className="ml-2 w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}