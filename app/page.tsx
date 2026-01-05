import { dictionary } from '@/lib/i18n';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="section-lg relative overflow-hidden">
        {/* Geometric pattern background */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
            <defs>
              <pattern id="geometric" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="currentColor" className="text-primary-500" />
                <path d="M0 20h40M20 0v40" stroke="currentColor" strokeWidth="0.5" className="text-primary-300" opacity="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#geometric)" />
          </svg>
        </div>
        
        {/* Floating geometric elements */}
        <div className="absolute top-20 left-10 w-4 h-4 border border-primary-300/30 rotate-45 animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-32 right-20 w-3 h-3 bg-primary-400/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-primary-500/30 rotate-12 animate-float" style={{ animationDelay: '4s' }} />
        
        <div className="container-xs text-center relative z-10">
          <h1 className="mb-6 animate-in">
            {dictionary.hero.title}
          </h1>
          <p className="mb-8 text-xl text-muted-foreground animate-up">
            {dictionary.hero.description}
          </p>
          <a href="#verifica" className="btn-primary btn-lg animate-up">
            {dictionary.hero.cta}
          </a>
        </div>
      </section>

      {/* Context Section */}
      <section className="section bg-muted/50">
        <div className="container-xs">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-primary-600 mb-4">{dictionary.context.eyebrow}</p>
            <h2 className="mb-6">
              {dictionary.context.title}
            </h2>
          </div>
          
          <div className="card p-8 space-y-6">
            <p className="text-lg">
              {dictionary.context.description1}
            </p>
            <p className="text-lg">
              {dictionary.context.description2}
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section">
        <div className="container-xs">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-primary-600 mb-4">{dictionary.how.eyebrow}</p>
            <h2 className="mb-6">
              {dictionary.how.title}
            </h2>
          </div>
          
          <div className="space-y-8">
            <div className="card p-6 interactive">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-semibold text-sm">
                  1
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">{dictionary.how.step1.title}</h3>
                  <p className="text-muted-foreground">
                    {dictionary.how.step1.description}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card p-6 interactive">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-semibold text-sm">
                  2
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">{dictionary.how.step2.title}</h3>
                  <p className="text-muted-foreground">
                    {dictionary.how.step2.description}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card p-6 interactive">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-semibold text-sm">
                  3
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">{dictionary.how.step3.title}</h3>
                  <p className="text-muted-foreground">
                    {dictionary.how.step3.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="section bg-muted/50">
        <div className="container-xs">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-primary-600 mb-4">{dictionary.examples.eyebrow}</p>
            <h2 className="mb-6">
              {dictionary.examples.title}
            </h2>
          </div>
          
          <div className="card p-8">
            <ul className="space-y-6">
              <li className="flex items-start gap-3">
                <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                <div>
                  <span className="text-muted-foreground">
                    {dictionary.examples.example1}
                  </span>
                  <span className="ml-2 badge-warning">{dictionary.examples.badge}</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                <div>
                  <span className="text-muted-foreground">
                    {dictionary.examples.example2}
                  </span>
                  <span className="ml-2 badge-warning">{dictionary.examples.badge}</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                <div>
                  <span className="text-muted-foreground">
                    {dictionary.examples.example3}
                  </span>
                  <span className="ml-2 badge-warning">{dictionary.examples.badge}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="metodologia" className="section">
        <div className="container-xs">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-primary-600 mb-4">{dictionary.methodology.eyebrow}</p>
            <h2 className="mb-6">
              {dictionary.methodology.title}
            </h2>
          </div>
          
          <div className="card p-8 space-y-6">
            <p className="text-lg">
              {dictionary.methodology.description1}
            </p>
            <p className="text-lg">
              {dictionary.methodology.description2}
            </p>
          </div>
        </div>
      </section>

      {/* Limits Section */}
      <section className="section bg-muted/50">
        <div className="container-xs">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-primary-600 mb-4">{dictionary.limits.eyebrow}</p>
            <h2 className="mb-6">{dictionary.limits.title}</h2>
          </div>
          
          <div className="card p-8">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                <span className="text-muted-foreground">
                  {dictionary.limits.limit1}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                <span className="text-muted-foreground">
                  {dictionary.limits.limit2}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                <span className="text-muted-foreground">
                  {dictionary.limits.limit3}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                <span className="text-muted-foreground">
                  {dictionary.limits.limit4}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="verifica" className="section-lg">
        <div className="container-xs text-center">
          <h2 className="mb-6">
            {dictionary.cta.title}
          </h2>
          <p className="mb-8 text-xl text-muted-foreground">
            {dictionary.cta.description}
          </p>
          <a href="/verifica" className="btn-primary btn-lg">
            {dictionary.cta.button}
          </a>
        </div>
      </section>
    </>
  );
}